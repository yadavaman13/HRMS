import { tool } from 'langchain';
import * as z from 'zod';
import { randomUUID } from 'crypto';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import {
    getEmployeeLeaveBalances,
    checkLeaveOverlap,
    createLeaveRequest,
    listLeaveTypes,
} from '../../../../dao/leave.dao.js';
import { createAuditLog } from '../../../../dao/audit.dao.js';
import redisClient from '../../../../config/cache.config.js';

const PREVIEW_TTL = 900; // 15 minutes

export function createCreateLeaveRequestTool(hrmsContext) {
    return tool(
        async (args) => {
            // ── CONFIRM STEP ───────────────────────────────────────────────
            if (args.confirmed === true) {
                const { previewId } = args;
                let targetEmpId = args.employeeId || hrmsContext.employeeId;

                let raw = null;
                let usedKey = null;

                if (previewId) {
                    const key = `hrms:leave_preview:${previewId}`;
                    raw = await redisClient.get(key);
                    if (raw) usedKey = key;
                }

                // Fallback 1: check latest preview for this employee/organization
                if (!raw && targetEmpId) {
                    const latestKey = `hrms:leave_preview:latest:${hrmsContext.organizationId}:${targetEmpId}`;
                    raw = await redisClient.get(latestKey);
                    if (raw) usedKey = latestKey;
                }

                // Fallback 2: If model called confirmed=true directly with leave details
                if (!raw) {
                    const {
                        leaveTypeId,
                        leaveType: leaveTypeAlias,
                        leaveTypeName,
                        leaveTypeCode,
                        reason,
                    } = args;
                    let { startDate, endDate } = args;
                    if (startDate && targetEmpId) {
                        if (!endDate) endDate = startDate;
                        const activeLeaveTypes = await listLeaveTypes(hrmsContext.organizationId, {
                            isActive: true,
                        });
                        const rawInput = (
                            leaveTypeId ||
                            leaveTypeAlias ||
                            leaveTypeName ||
                            leaveTypeCode ||
                            ''
                        ).trim();
                        let matched = null;
                        if (rawInput) {
                            const lower = rawInput.toLowerCase();
                            matched = activeLeaveTypes.find(
                                (lt) =>
                                    lt.id === rawInput ||
                                    lt.code?.toLowerCase() === lower ||
                                    lt.name?.toLowerCase() === lower ||
                                    lt.name?.toLowerCase().includes(lower) ||
                                    lower.includes(lt.name?.toLowerCase()),
                            );
                        }
                        if (matched) {
                            const overlap = await checkLeaveOverlap(
                                targetEmpId,
                                startDate,
                                endDate,
                            );
                            if (overlap)
                                return toolError(
                                    'OVERLAPPING_LEAVE',
                                    `Overlaps with ${overlap.status} leave from ${overlap.startDate} to ${overlap.endDate}.`,
                                );

                            const balances = await getEmployeeLeaveBalances(
                                targetEmpId,
                                hrmsContext.organizationId,
                            );
                            const balance = balances.find((b) => b.leaveTypeId === matched.id);
                            const start = new Date(startDate),
                                end = new Date(endDate);
                            const requestedDays = Math.round((end - start) / 86400000) + 1;
                            const remaining = balance
                                ? balance.remaining !== undefined
                                    ? balance.remaining
                                    : balance.availableBalance
                                : null;
                            if (
                                matched.requiresAllocation &&
                                balance &&
                                requestedDays > Number(remaining || 0)
                            ) {
                                return toolError(
                                    'INSUFFICIENT_BALANCE',
                                    `Requested ${requestedDays} days for ${matched.name} but only ${remaining} remain.`,
                                );
                            }

                            raw = JSON.stringify({
                                previewId: randomUUID(),
                                organizationId: hrmsContext.organizationId,
                                employeeId: targetEmpId,
                                leaveTypeId: matched.id,
                                leaveTypeName: matched.name,
                                startDate,
                                endDate,
                                requestedDays,
                                reason: reason || null,
                            });
                        }
                    }
                }

                if (!raw)
                    return toolError(
                        'ALREADY_PROCESSED',
                        'Preview expired or already confirmed. Please create a new preview if needed.',
                    );

                const preview = JSON.parse(raw);
                if (preview.organizationId !== hrmsContext.organizationId)
                    return toolError('FORBIDDEN', 'Preview does not belong to this organization.');

                // Clean up redis keys for idempotency
                if (usedKey) await redisClient.del(usedKey);
                if (preview.previewId)
                    await redisClient.del(`hrms:leave_preview:${preview.previewId}`);
                if (preview.employeeId)
                    await redisClient.del(
                        `hrms:leave_preview:latest:${hrmsContext.organizationId}:${preview.employeeId}`,
                    );

                await createLeaveRequest({
                    employeeId: preview.employeeId,
                    leaveTypeId: preview.leaveTypeId,
                    startDate: preview.startDate,
                    endDate: preview.endDate,
                    requestedDays: String(preview.requestedDays),
                    reason: preview.reason || null,
                    status: 'pending',
                    submittedAt: new Date(),
                });
                await createAuditLog({
                    organizationId: hrmsContext.organizationId,
                    actorUserId: hrmsContext.userId,
                    action: 'ai_leave_request_created',
                    entityType: 'leave_request',
                    entityId: preview.employeeId,
                    newData: preview,
                });
                return toolSuccess({
                    message: 'Leave request submitted successfully.',
                    preview,
                });
            }

            // ── PREVIEW STEP ───────────────────────────────────────────────
            const {
                employeeId,
                leaveTypeId,
                leaveType: leaveTypeAlias,
                leaveTypeName,
                leaveTypeCode,
                reason,
            } = args;
            let { startDate, endDate } = args;

            if (hrmsContext.role === 'user') return toolError('FORBIDDEN', 'Access denied.');
            let targetId = employeeId || hrmsContext.employeeId;
            if (hrmsContext.role === 'employee') {
                if (!hrmsContext.employeeId)
                    return toolError('NOT_AN_EMPLOYEE', 'No linked employee record.');
                targetId = hrmsContext.employeeId;
            }

            if (!startDate) {
                return toolError('INVALID_INPUT', 'startDate is required (format: YYYY-MM-DD).');
            }
            if (!endDate) {
                endDate = startDate; // Default to single-day leave
            }

            if (!targetId) {
                return toolError('INVALID_INPUT', 'Target employeeId could not be resolved.');
            }

            const start = new Date(startDate),
                end = new Date(endDate);
            if (isNaN(start) || isNaN(end) || start > end)
                return toolError(
                    'INVALID_DATE_RANGE',
                    'startDate must be a valid date on or before endDate.',
                );

            const activeLeaveTypes = await listLeaveTypes(hrmsContext.organizationId, {
                isActive: true,
            });
            if (!activeLeaveTypes || activeLeaveTypes.length === 0) {
                return toolError('NOT_FOUND', 'No active leave types found for this organization.');
            }

            const rawLeaveTypeInput = (
                leaveTypeId ||
                leaveTypeAlias ||
                leaveTypeName ||
                leaveTypeCode ||
                ''
            ).trim();
            let matchedLeaveType = null;

            if (rawLeaveTypeInput) {
                const lower = rawLeaveTypeInput.toLowerCase();
                matchedLeaveType =
                    activeLeaveTypes.find((lt) => lt.id === rawLeaveTypeInput) ||
                    activeLeaveTypes.find((lt) => lt.code?.toLowerCase() === lower) ||
                    activeLeaveTypes.find((lt) => lt.name?.toLowerCase() === lower) ||
                    activeLeaveTypes.find((lt) => lt.name?.toLowerCase().includes(lower)) ||
                    activeLeaveTypes.find((lt) => lower.includes(lt.name?.toLowerCase()));
            }

            if (!matchedLeaveType) {
                const availableList = activeLeaveTypes
                    .map((lt) => `"${lt.name}" (code: ${lt.code}, ID: ${lt.id})`)
                    .join(', ');
                return toolError(
                    'LEAVE_TYPE_NOT_FOUND',
                    `Leave type "${rawLeaveTypeInput || 'unspecified'}" not recognized. Available active leave types: ${availableList}`,
                );
            }

            const resolvedLeaveTypeId = matchedLeaveType.id;

            const overlap = await checkLeaveOverlap(targetId, startDate, endDate);
            if (overlap)
                return toolError(
                    'OVERLAPPING_LEAVE',
                    `Overlaps with ${overlap.status} leave from ${overlap.startDate} to ${overlap.endDate}.`,
                );

            const balances = await getEmployeeLeaveBalances(targetId, hrmsContext.organizationId);
            const balance = balances.find((b) => b.leaveTypeId === resolvedLeaveTypeId);
            const requestedDays = Math.round((end - start) / 86400000) + 1;

            const remaining = balance
                ? balance.remaining !== undefined
                    ? balance.remaining
                    : balance.availableBalance
                : null;

            if (
                matchedLeaveType.requiresAllocation &&
                balance &&
                requestedDays > Number(remaining || 0)
            )
                return toolError(
                    'INSUFFICIENT_BALANCE',
                    `Requested ${requestedDays} days for ${matchedLeaveType.name} but only ${remaining} remain.`,
                );

            const previewId = randomUUID();
            const previewData = {
                previewId,
                organizationId: hrmsContext.organizationId,
                employeeId: targetId,
                leaveTypeId: resolvedLeaveTypeId,
                leaveTypeName: matchedLeaveType.name,
                startDate,
                endDate,
                requestedDays,
                reason: reason || null,
                balanceBefore: remaining,
                balanceAfter: remaining !== null ? Number(remaining) - requestedDays : null,
                expiresAt: new Date(Date.now() + PREVIEW_TTL * 1000).toISOString(),
            };
            await redisClient.setex(
                `hrms:leave_preview:${previewId}`,
                PREVIEW_TTL,
                JSON.stringify(previewData),
            );
            await redisClient.setex(
                `hrms:leave_preview:latest:${hrmsContext.organizationId}:${targetId}`,
                PREVIEW_TTL,
                JSON.stringify(previewData),
            );
            return toolSuccess({
                previewId,
                preview: previewData,
                instructions: `Show the user this preview and ask for confirmation. When the user confirms (e.g. says yes, submit, proceed, okay), call create_leave_request with confirmed: true and previewId: "${previewId}". Do not recreate the preview.`,
            });
        },
        {
            name: 'create_leave_request',
            description:
                'Two-step leave request workflow. STEP 1 (confirmed=false): provide leave details (leave type name/code/id and dates) to receive a previewId and policy impact summary. Show this preview to the user. STEP 2 (confirmed=true): provide previewId to confirm and submit. Previews expire in 5 minutes.',
            schema: z.object({
                confirmed: z
                    .boolean()
                    .default(false)
                    .describe('Set to true to confirm and execute, or false to create a preview'),
                previewId: z
                    .string()
                    .optional()
                    .describe('The preview ID received from step 1 (required when confirmed=true)'),
                employeeId: z
                    .string()
                    .optional()
                    .describe(
                        'Target employee UUID (required for preview if HR/Admin applying on behalf of someone else)',
                    ),
                leaveTypeId: z
                    .string()
                    .optional()
                    .describe(
                        'Leave type UUID, name (e.g. "Casual Leave", "Sick Leave"), or code (e.g. "CL", "SL")',
                    ),
                leaveType: z
                    .string()
                    .optional()
                    .describe(
                        'Leave type name or code (e.g. "Casual Leave", "Sick Leave", "CL", "SL")',
                    ),
                startDate: z
                    .string()
                    .optional()
                    .describe('Start date in YYYY-MM-DD format (required for step 1 preview)'),
                endDate: z
                    .string()
                    .optional()
                    .describe(
                        'End date in YYYY-MM-DD format (defaults to startDate if single day)',
                    ),
                reason: z
                    .string()
                    .optional()
                    .describe('Optional justification or reason for leave request'),
            }),
        },
    );
}

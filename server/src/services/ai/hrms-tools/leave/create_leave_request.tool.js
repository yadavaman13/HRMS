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

const PREVIEW_TTL = 300; // 5 minutes

export function createCreateLeaveRequestTool(hrmsContext) {
    return tool(
        async (args) => {
            // ── CONFIRM STEP ───────────────────────────────────────────────
            if (args.confirmed === true) {
                const { previewId } = args;
                if (!previewId)
                    return toolError('INVALID_INPUT', 'previewId is required to confirm.');
                const key = `hrms:leave_preview:${previewId}`;
                const raw = await redisClient.get(key);
                if (!raw)
                    return toolError('ALREADY_PROCESSED', 'Preview expired or already confirmed.');
                const preview = JSON.parse(raw);
                if (preview.organizationId !== hrmsContext.organizationId)
                    return toolError('FORBIDDEN', 'Preview does not belong to this organization.');

                await redisClient.del(key); // idempotency: subsequent calls get ALREADY_PROCESSED
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
                return toolSuccess({ message: 'Leave request submitted successfully.', preview });
            }

            // ── PREVIEW STEP ───────────────────────────────────────────────
            const { employeeId, leaveTypeId, startDate, endDate, reason } = args;
            if (hrmsContext.role === 'user') return toolError('FORBIDDEN', 'Access denied.');
            let targetId = employeeId || hrmsContext.employeeId;
            if (hrmsContext.role === 'employee') {
                if (!hrmsContext.employeeId)
                    return toolError('NOT_AN_EMPLOYEE', 'No linked employee record.');
                targetId = hrmsContext.employeeId;
            }
            if (!targetId || !leaveTypeId || !startDate || !endDate)
                return toolError(
                    'INVALID_INPUT',
                    'employeeId, leaveTypeId, startDate, and endDate are required.',
                );

            const start = new Date(startDate),
                end = new Date(endDate);
            if (isNaN(start) || isNaN(end) || start > end)
                return toolError('INVALID_DATE_RANGE', 'startDate must be on or before endDate.');

            const leaveTypes = await listLeaveTypes(hrmsContext.organizationId, { isActive: true });
            const leaveType = leaveTypes.find((lt) => lt.id === leaveTypeId);
            if (!leaveType) return toolError('NOT_FOUND', 'Leave type not found or inactive.');

            const overlap = await checkLeaveOverlap(targetId, startDate, endDate);
            if (overlap)
                return toolError(
                    'OVERLAPPING_LEAVE',
                    `Overlaps with ${overlap.status} leave from ${overlap.startDate} to ${overlap.endDate}.`,
                );

            const balances = await getEmployeeLeaveBalances(targetId, hrmsContext.organizationId);
            const balance = balances.find((b) => b.leaveTypeId === leaveTypeId);
            const requestedDays = Math.round((end - start) / 86400000) + 1;

            const remaining = balance
                ? balance.remaining !== undefined
                    ? balance.remaining
                    : balance.availableBalance
                : null;

            if (leaveType.requiresAllocation && balance && requestedDays > Number(remaining || 0))
                return toolError(
                    'INSUFFICIENT_BALANCE',
                    `Requested ${requestedDays} days but only ${remaining} remain.`,
                );

            const previewId = randomUUID();
            const previewData = {
                previewId,
                organizationId: hrmsContext.organizationId,
                employeeId: targetId,
                leaveTypeId,
                leaveTypeName: leaveType.name,
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
            return toolSuccess({
                previewId,
                preview: previewData,
                instructions:
                    'Show the user this preview and ask for confirmation. Call again with confirmed:true and previewId to submit.',
            });
        },
        {
            name: 'create_leave_request',
            description:
                'Two-step leave request workflow. STEP 1 (confirmed=false): provide leave details to receive a previewId and policy impact summary. Show this preview to the user. STEP 2 (confirmed=true): provide previewId to confirm and submit. Previews expire in 5 minutes.',
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
                    .describe('Leave type UUID (required for step 1 preview)'),
                startDate: z
                    .string()
                    .optional()
                    .describe('Start date in YYYY-MM-DD format (required for step 1 preview)'),
                endDate: z
                    .string()
                    .optional()
                    .describe('End date in YYYY-MM-DD format (required for step 1 preview)'),
                reason: z
                    .string()
                    .optional()
                    .describe('Optional justification or reason for leave request'),
            }),
        },
    );
}

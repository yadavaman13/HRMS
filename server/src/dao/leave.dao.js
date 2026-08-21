import { db } from '../config/database.config.js';
import {
    leaveTypes,
    leaveAllocations,
    leaveRequests,
    leaveBalanceTransactions,
    employees,
    departments,
    workSchedules,
    workScheduleDays,
    employeeScheduleAssignments,
    holidays,
    attendanceRecords,
    auditLogs,
    notifications,
} from '../db/schema/schema.js';
import { eq, and, sql, desc, inArray, gte, lte, isNull } from 'drizzle-orm';

// ── Leave Types DAO ─────────────────────────────────────────────────────────

export async function listLeaveTypes(organizationId, opts = {}) {
    const { isActive } = opts;
    const filters = [eq(leaveTypes.organizationId, organizationId)];

    if (isActive !== undefined) {
        filters.push(eq(leaveTypes.isActive, Boolean(isActive)));
    }

    return db
        .select()
        .from(leaveTypes)
        .where(and(...filters))
        .orderBy(leaveTypes.name);
}

export async function getLeaveTypeById(id) {
    if (!id) return null;
    const [row] = await db.select().from(leaveTypes).where(eq(leaveTypes.id, id));
    return row || null;
}

export async function getLeaveTypeByCode(organizationId, code) {
    if (!organizationId || !code) return null;
    const [row] = await db
        .select()
        .from(leaveTypes)
        .where(
            and(
                eq(leaveTypes.organizationId, organizationId),
                eq(leaveTypes.code, code.toUpperCase()),
            ),
        );
    return row || null;
}

export async function createLeaveType(data) {
    const [row] = await db
        .insert(leaveTypes)
        .values({
            ...data,
            code: data.code.toUpperCase(),
        })
        .returning();
    return row;
}

export async function updateLeaveType(id, data) {
    const [row] = await db
        .update(leaveTypes)
        .set({
            ...data,
            code: data.code ? data.code.toUpperCase() : undefined,
            updatedAt: new Date(),
        })
        .where(eq(leaveTypes.id, id))
        .returning();
    return row || null;
}

// ── Schedule & Holiday Helpers for Employee ──────────────────────────────────

export async function getEmployeeScheduleDays(employeeId, organizationId) {
    // 1. Check direct schedule assignment
    const [assignment] = await db
        .select({
            scheduleId: employeeScheduleAssignments.scheduleId,
        })
        .from(employeeScheduleAssignments)
        .where(
            and(
                eq(employeeScheduleAssignments.employeeId, employeeId),
                isNull(employeeScheduleAssignments.effectiveTo),
            ),
        )
        .orderBy(desc(employeeScheduleAssignments.effectiveFrom))
        .limit(1);

    let scheduleId = assignment?.scheduleId;

    // 2. Fallback to organization's active schedule
    if (!scheduleId) {
        const [defaultSchedule] = await db
            .select({ id: workSchedules.id })
            .from(workSchedules)
            .where(
                and(
                    eq(workSchedules.organizationId, organizationId),
                    eq(workSchedules.isActive, true),
                ),
            )
            .limit(1);
        scheduleId = defaultSchedule?.id;
    }

    if (!scheduleId) {
        return [];
    }

    return db.select().from(workScheduleDays).where(eq(workScheduleDays.scheduleId, scheduleId));
}

export async function getOrganizationHolidays(organizationId, startDate, endDate) {
    const filters = [eq(holidays.organizationId, organizationId)];

    if (startDate && endDate) {
        filters.push(gte(holidays.holidayDate, startDate), lte(holidays.holidayDate, endDate));
    }

    return db
        .select()
        .from(holidays)
        .where(and(...filters));
}

// ── Leave Allocations & Balance Ledger DAO ───────────────────────────────────

export async function createLeaveAllocationTx({
    employeeId,
    leaveTypeId,
    periodStart,
    periodEnd,
    allocatedDays,
    carriedForwardDays = '0',
    createdBy,
    description = 'Annual quota allocation',
}) {
    return await db.transaction(async (tx) => {
        // 1. Insert allocation record
        const [allocation] = await tx
            .insert(leaveAllocations)
            .values({
                employeeId,
                leaveTypeId,
                periodStart,
                periodEnd,
                allocatedDays: String(allocatedDays),
                carriedForwardDays: String(carriedForwardDays),
                createdBy,
            })
            .returning();

        // 2. Post initial credit transaction to ledger
        const totalCreditedDays = (Number(allocatedDays) || 0) + (Number(carriedForwardDays) || 0);

        await tx.insert(leaveBalanceTransactions).values({
            employeeId,
            leaveTypeId,
            transactionType: 'allocation',
            days: String(totalCreditedDays),
            referenceType: 'leave_allocation',
            referenceId: allocation.id,
            description: description || `Allocation for period ${periodStart} to ${periodEnd}`,
        });

        return allocation;
    });
}

export async function getEmployeeAllocations(employeeId, opts = {}) {
    const { year, leaveTypeId } = opts;
    const filters = [eq(leaveAllocations.employeeId, employeeId)];

    if (leaveTypeId) {
        filters.push(eq(leaveAllocations.leaveTypeId, leaveTypeId));
    }

    if (year) {
        filters.push(
            gte(leaveAllocations.periodEnd, `${year}-01-01`),
            lte(leaveAllocations.periodStart, `${year}-12-31`),
        );
    }

    return db
        .select({
            id: leaveAllocations.id,
            employeeId: leaveAllocations.employeeId,
            leaveTypeId: leaveAllocations.leaveTypeId,
            leaveTypeName: leaveTypes.name,
            leaveTypeCode: leaveTypes.code,
            periodStart: leaveAllocations.periodStart,
            periodEnd: leaveAllocations.periodEnd,
            allocatedDays: leaveAllocations.allocatedDays,
            carriedForwardDays: leaveAllocations.carriedForwardDays,
            createdBy: leaveAllocations.createdBy,
            createdAt: leaveAllocations.createdAt,
        })
        .from(leaveAllocations)
        .innerJoin(leaveTypes, eq(leaveAllocations.leaveTypeId, leaveTypes.id))
        .where(and(...filters))
        .orderBy(desc(leaveAllocations.periodStart));
}

export async function getEmployeeLeaveBalances(employeeId, organizationId) {
    // 1. Fetch all active leave types for organization
    const allLeaveTypes = await db
        .select()
        .from(leaveTypes)
        .where(and(eq(leaveTypes.organizationId, organizationId), eq(leaveTypes.isActive, true)))
        .orderBy(leaveTypes.name);

    if (allLeaveTypes.length === 0) return [];

    // 2. Fetch all balance ledger transactions for this employee
    const transactions = await db
        .select()
        .from(leaveBalanceTransactions)
        .where(eq(leaveBalanceTransactions.employeeId, employeeId));

    // 3. Fetch active pending requests
    const pendingRequests = await db
        .select({
            leaveTypeId: leaveRequests.leaveTypeId,
            requestedDays: leaveRequests.requestedDays,
        })
        .from(leaveRequests)
        .where(and(eq(leaveRequests.employeeId, employeeId), eq(leaveRequests.status, 'pending')));

    // Group transactions and pending requests by leaveTypeId
    const txByLeaveType = new Map();
    for (const tx of transactions) {
        if (!txByLeaveType.has(tx.leaveTypeId)) {
            txByLeaveType.set(tx.leaveTypeId, []);
        }
        txByLeaveType.get(tx.leaveTypeId).push(tx);
    }

    const pendingByLeaveType = new Map();
    for (const pr of pendingRequests) {
        const current = pendingByLeaveType.get(pr.leaveTypeId) || 0;
        pendingByLeaveType.set(pr.leaveTypeId, current + (Number(pr.requestedDays) || 0));
    }

    // 4. Compute ledger balances for each leave type
    return allLeaveTypes.map((lt) => {
        const typeTxs = txByLeaveType.get(lt.id) || [];
        let allocated = 0;
        let used = 0;
        let credited = 0;
        let carryForward = 0;
        let adjustments = 0;
        let expired = 0;

        for (const tx of typeTxs) {
            const amount = Number(tx.days) || 0;
            switch (tx.transactionType) {
                case 'allocation':
                    allocated += amount;
                    break;
                case 'leave_used':
                    used += amount;
                    break;
                case 'leave_cancelled':
                case 'leave_credited':
                    credited += amount;
                    break;
                case 'carry_forward':
                    carryForward += amount;
                    break;
                case 'adjustment':
                    adjustments += amount;
                    break;
                case 'expiry':
                    expired += amount;
                    break;
            }
        }

        const totalCredits = allocated + credited + carryForward + adjustments;
        const totalDebits = used + expired;
        const netBalance = Math.max(0, totalCredits - totalDebits);
        const pendingDays = pendingByLeaveType.get(lt.id) || 0;
        const availableBalance = Math.max(0, netBalance - pendingDays);

        return {
            leaveTypeId: lt.id,
            code: lt.code,
            name: lt.name,
            isPaid: lt.isPaid,
            requiresAllocation: lt.requiresAllocation,
            requiresAttachment: lt.requiresAttachment,
            unit: lt.unit,
            allocatedDays: Number(allocated.toFixed(2)),
            usedDays: Number(used.toFixed(2)),
            pendingDays: Number(pendingDays.toFixed(2)),
            creditedDays: Number(credited.toFixed(2)),
            carryForwardDays: Number(carryForward.toFixed(2)),
            netBalance: lt.requiresAllocation ? Number(netBalance.toFixed(2)) : 999,
            availableBalance: lt.requiresAllocation ? Number(availableBalance.toFixed(2)) : 999,
        };
    });
}

export async function getLeaveTransactions(employeeId, opts = {}) {
    const { leaveTypeId, limit = 50, offset = 0 } = opts;
    const filters = [eq(leaveBalanceTransactions.employeeId, employeeId)];

    if (leaveTypeId) {
        filters.push(eq(leaveBalanceTransactions.leaveTypeId, leaveTypeId));
    }

    return db
        .select({
            id: leaveBalanceTransactions.id,
            employeeId: leaveBalanceTransactions.employeeId,
            leaveTypeId: leaveBalanceTransactions.leaveTypeId,
            leaveTypeName: leaveTypes.name,
            leaveTypeCode: leaveTypes.code,
            transactionType: leaveBalanceTransactions.transactionType,
            days: leaveBalanceTransactions.days,
            referenceType: leaveBalanceTransactions.referenceType,
            referenceId: leaveBalanceTransactions.referenceId,
            description: leaveBalanceTransactions.description,
            createdAt: leaveBalanceTransactions.createdAt,
        })
        .from(leaveBalanceTransactions)
        .innerJoin(leaveTypes, eq(leaveBalanceTransactions.leaveTypeId, leaveTypes.id))
        .where(and(...filters))
        .limit(limit)
        .offset(offset)
        .orderBy(desc(leaveBalanceTransactions.createdAt));
}

// ── Leave Requests Lifecycle DAO ─────────────────────────────────────────────

export async function createLeaveRequest(data) {
    const [row] = await db.insert(leaveRequests).values(data).returning();
    return row;
}

export async function getLeaveRequestById(id) {
    if (!id) return null;

    const [row] = await db
        .select({
            id: leaveRequests.id,
            employeeId: leaveRequests.employeeId,
            leaveTypeId: leaveRequests.leaveTypeId,
            startDate: leaveRequests.startDate,
            endDate: leaveRequests.endDate,
            startHalf: leaveRequests.startHalf,
            endHalf: leaveRequests.endHalf,
            requestedDays: leaveRequests.requestedDays,
            reason: leaveRequests.reason,
            status: leaveRequests.status,
            attachmentUrl: leaveRequests.attachmentUrl,
            submittedAt: leaveRequests.submittedAt,
            approvedAt: leaveRequests.approvedAt,
            rejectedAt: leaveRequests.rejectedAt,
            approvedBy: leaveRequests.approvedBy,
            rejectedBy: leaveRequests.rejectedBy,
            hrComment: leaveRequests.hrComment,
            createdAt: leaveRequests.createdAt,
            updatedAt: leaveRequests.updatedAt,
            // Employee info
            employeeFirstName: employees.firstName,
            employeeLastName: employees.lastName,
            employeeCode: employees.employeeCode,
            employeeWorkEmail: employees.workEmail,
            organizationId: employees.organizationId,
            departmentId: employees.departmentId,
            // Leave type info
            leaveTypeName: leaveTypes.name,
            leaveTypeCode: leaveTypes.code,
            leaveTypeIsPaid: leaveTypes.isPaid,
            leaveTypeRequiresAllocation: leaveTypes.requiresAllocation,
            leaveTypeRequiresApproval: leaveTypes.requiresApproval,
            // Approver / Rejector
            approverFirstName: sql`approver.first_name`.as('approver_first_name'),
            approverLastName: sql`approver.last_name`.as('approver_last_name'),
            rejectorFirstName: sql`rejector.first_name`.as('rejector_first_name'),
            rejectorLastName: sql`rejector.last_name`.as('rejector_last_name'),
        })
        .from(leaveRequests)
        .innerJoin(employees, eq(leaveRequests.employeeId, employees.id))
        .innerJoin(leaveTypes, eq(leaveRequests.leaveTypeId, leaveTypes.id))
        .leftJoin(sql`users AS approver`, eq(leaveRequests.approvedBy, sql`approver.id`))
        .leftJoin(sql`users AS rejector`, eq(leaveRequests.rejectedBy, sql`rejector.id`))
        .where(eq(leaveRequests.id, id));

    return row || null;
}

export async function checkLeaveOverlap(employeeId, startDate, endDate, excludeRequestId = null) {
    const filters = [
        eq(leaveRequests.employeeId, employeeId),
        inArray(leaveRequests.status, ['pending', 'approved']),
        lte(leaveRequests.startDate, endDate),
        gte(leaveRequests.endDate, startDate),
    ];

    if (excludeRequestId) {
        filters.push(sql`${leaveRequests.id} != ${excludeRequestId}`);
    }

    const [conflicting] = await db
        .select({
            id: leaveRequests.id,
            startDate: leaveRequests.startDate,
            endDate: leaveRequests.endDate,
            status: leaveRequests.status,
        })
        .from(leaveRequests)
        .where(and(...filters))
        .limit(1);

    return conflicting || null;
}

export async function listLeaveRequests(organizationId, opts = {}) {
    const { employeeId, departmentId, status, startDate, endDate, limit = 50, offset = 0 } = opts;

    const filters = [eq(employees.organizationId, organizationId)];

    if (employeeId) filters.push(eq(leaveRequests.employeeId, employeeId));
    if (departmentId) filters.push(eq(employees.departmentId, departmentId));
    if (status) filters.push(eq(leaveRequests.status, status));
    if (startDate) filters.push(gte(leaveRequests.endDate, startDate));
    if (endDate) filters.push(lte(leaveRequests.startDate, endDate));

    return db
        .select({
            id: leaveRequests.id,
            employeeId: leaveRequests.employeeId,
            leaveTypeId: leaveRequests.leaveTypeId,
            startDate: leaveRequests.startDate,
            endDate: leaveRequests.endDate,
            startHalf: leaveRequests.startHalf,
            endHalf: leaveRequests.endHalf,
            requestedDays: leaveRequests.requestedDays,
            reason: leaveRequests.reason,
            status: leaveRequests.status,
            attachmentUrl: leaveRequests.attachmentUrl,
            submittedAt: leaveRequests.submittedAt,
            approvedAt: leaveRequests.approvedAt,
            rejectedAt: leaveRequests.rejectedAt,
            approvedBy: leaveRequests.approvedBy,
            rejectedBy: leaveRequests.rejectedBy,
            hrComment: leaveRequests.hrComment,
            createdAt: leaveRequests.createdAt,
            // Employee details
            employeeFirstName: employees.firstName,
            employeeLastName: employees.lastName,
            employeeCode: employees.employeeCode,
            employeeWorkEmail: employees.workEmail,
            departmentName: departments.name,
            // Leave Type details
            leaveTypeName: leaveTypes.name,
            leaveTypeCode: leaveTypes.code,
            isPaid: leaveTypes.isPaid,
        })
        .from(leaveRequests)
        .innerJoin(employees, eq(leaveRequests.employeeId, employees.id))
        .leftJoin(departments, eq(employees.departmentId, departments.id))
        .innerJoin(leaveTypes, eq(leaveRequests.leaveTypeId, leaveTypes.id))
        .where(and(...filters))
        .limit(limit)
        .offset(offset)
        .orderBy(desc(leaveRequests.createdAt));
}

/**
 * Approve leave request in transaction:
 * 1. Updates leave request status to 'approved'.
 * 2. Debits double-entry ledger (inserts 'leave_used' transaction).
 * 3. Syncs attendance records for working dates to 'leave'.
 * 4. Logs audit entry and sends in-app notification.
 */
export async function approveLeaveRequestTx({
    requestId,
    approverUserId,
    hrComment,
    workingDates = [],
    leaveType,
    employee,
}) {
    return await db.transaction(async (tx) => {
        // 1. Update leave request record
        const [updatedRequest] = await tx
            .update(leaveRequests)
            .set({
                status: 'approved',
                approvedBy: approverUserId,
                approvedAt: new Date(),
                hrComment: hrComment || null,
                updatedAt: new Date(),
            })
            .where(eq(leaveRequests.id, requestId))
            .returning();

        // 2. Post ledger debit transaction if allocation is required
        if (leaveType.requiresAllocation) {
            await tx.insert(leaveBalanceTransactions).values({
                employeeId: updatedRequest.employeeId,
                leaveTypeId: updatedRequest.leaveTypeId,
                transactionType: 'leave_used',
                days: String(updatedRequest.requestedDays),
                referenceType: 'leave_request',
                referenceId: updatedRequest.id,
                description: `Approved leave application from ${updatedRequest.startDate} to ${updatedRequest.endDate}`,
            });
        }

        // 3. Attendance synchronization: Upsert attendance records for all working dates
        if (workingDates && workingDates.length > 0) {
            for (const attendanceDate of workingDates) {
                const [existingRecord] = await tx
                    .select()
                    .from(attendanceRecords)
                    .where(
                        and(
                            eq(attendanceRecords.employeeId, updatedRequest.employeeId),
                            eq(attendanceRecords.attendanceDate, attendanceDate),
                        ),
                    );

                if (existingRecord) {
                    await tx
                        .update(attendanceRecords)
                        .set({
                            status: 'leave',
                            source: 'system',
                            remarks: `On Approved Leave: ${leaveType.name}`,
                            updatedAt: new Date(),
                        })
                        .where(eq(attendanceRecords.id, existingRecord.id));
                } else {
                    await tx.insert(attendanceRecords).values({
                        employeeId: updatedRequest.employeeId,
                        attendanceDate,
                        status: 'leave',
                        scheduledWorkMinutes: 480,
                        source: 'system',
                        remarks: `On Approved Leave: ${leaveType.name}`,
                    });
                }
            }
        }

        // 4. Notification to employee
        if (employee?.userId) {
            await tx.insert(notifications).values({
                userId: employee.userId,
                type: 'leave_approved',
                title: 'Leave Request Approved',
                message: `Your leave request for ${updatedRequest.requestedDays} day(s) from ${updatedRequest.startDate} to ${updatedRequest.endDate} has been approved.`,
                isRead: false,
            });
        }

        // 5. Audit Log
        if (employee?.organizationId) {
            await tx.insert(auditLogs).values({
                organizationId: employee.organizationId,
                actorUserId: approverUserId,
                action: 'leave_approved',
                entityType: 'leave_request',
                entityId: updatedRequest.id,
                newData: {
                    requestId: updatedRequest.id,
                    employeeId: updatedRequest.employeeId,
                    requestedDays: updatedRequest.requestedDays,
                    startDate: updatedRequest.startDate,
                    endDate: updatedRequest.endDate,
                    hrComment,
                },
            });
        }

        return updatedRequest;
    });
}

/**
 * Reject leave request:
 * 1. Updates leave request status to 'rejected'.
 * 2. Notification and Audit log.
 */
export async function rejectLeaveRequestTx({ requestId, rejectorUserId, hrComment, employee }) {
    return await db.transaction(async (tx) => {
        const [updatedRequest] = await tx
            .update(leaveRequests)
            .set({
                status: 'rejected',
                rejectedBy: rejectorUserId,
                rejectedAt: new Date(),
                hrComment: hrComment || null,
                updatedAt: new Date(),
            })
            .where(eq(leaveRequests.id, requestId))
            .returning();

        // Notification to employee
        if (employee?.userId) {
            await tx.insert(notifications).values({
                userId: employee.userId,
                type: 'leave_rejected',
                title: 'Leave Request Rejected',
                message: `Your leave request for ${updatedRequest.startDate} to ${updatedRequest.endDate} was rejected.${hrComment ? ` Reason: ${hrComment}` : ''}`,
                isRead: false,
            });
        }

        // Audit log
        if (employee?.organizationId) {
            await tx.insert(auditLogs).values({
                organizationId: employee.organizationId,
                actorUserId: rejectorUserId,
                action: 'leave_rejected',
                entityType: 'leave_request',
                entityId: updatedRequest.id,
                newData: {
                    requestId: updatedRequest.id,
                    employeeId: updatedRequest.employeeId,
                    hrComment,
                },
            });
        }

        return updatedRequest;
    });
}

/**
 * Cancel leave request:
 * 1. Updates status to 'cancelled'.
 * 2. If it was approved and requires allocation, restores balance via 'leave_cancelled' ledger credit.
 * 3. Reverts attendance records marked as 'leave'.
 */
export async function cancelLeaveRequestTx({
    requestId,
    actorUserId,
    reason,
    wasApproved,
    leaveType,
    workingDates = [],
    employee,
}) {
    return await db.transaction(async (tx) => {
        const [updatedRequest] = await tx
            .update(leaveRequests)
            .set({
                status: 'cancelled',
                hrComment: reason ? `Cancelled by employee: ${reason}` : 'Cancelled by employee',
                updatedAt: new Date(),
            })
            .where(eq(leaveRequests.id, requestId))
            .returning();

        // If it was already approved and had consumed balance, restore it
        if (wasApproved && leaveType?.requiresAllocation) {
            await tx.insert(leaveBalanceTransactions).values({
                employeeId: updatedRequest.employeeId,
                leaveTypeId: updatedRequest.leaveTypeId,
                transactionType: 'leave_cancelled',
                days: String(updatedRequest.requestedDays),
                referenceType: 'leave_request',
                referenceId: updatedRequest.id,
                description: `Restored balance upon cancellation of approved leave (${updatedRequest.startDate} to ${updatedRequest.endDate})`,
            });
        }

        // Revert attendance records from 'leave' back to 'absent'
        if (wasApproved && workingDates.length > 0) {
            for (const attendanceDate of workingDates) {
                await tx
                    .update(attendanceRecords)
                    .set({
                        status: 'absent',
                        remarks: 'Leave cancelled',
                        updatedAt: new Date(),
                    })
                    .where(
                        and(
                            eq(attendanceRecords.employeeId, updatedRequest.employeeId),
                            eq(attendanceRecords.attendanceDate, attendanceDate),
                            eq(attendanceRecords.status, 'leave'),
                        ),
                    );
            }
        }

        // Audit Log
        if (employee?.organizationId) {
            await tx.insert(auditLogs).values({
                organizationId: employee.organizationId,
                actorUserId,
                action: 'leave_cancelled',
                entityType: 'leave_request',
                entityId: updatedRequest.id,
                newData: {
                    requestId: updatedRequest.id,
                    employeeId: updatedRequest.employeeId,
                    wasApproved,
                    reason,
                },
            });
        }

        return updatedRequest;
    });
}

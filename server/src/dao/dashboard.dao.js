import { db } from '../config/database.config.js';
import { eq, and, sql, desc, asc } from 'drizzle-orm';
import { employees } from '../db/schema/employees.schema.js';
import { departments, jobPositions, locations } from '../db/schema/organizations.schema.js';
import {
    attendanceRecords,
    attendanceSessions,
    attendanceAdjustments,
} from '../db/schema/attendance.schema.js';
import { leaveRequests, leaveAllocations, leaveTypes } from '../db/schema/leave.schema.js';
import { payrollPeriods, payslips } from '../db/schema/payroll.schema.js';
import { holidays } from '../db/schema/work_schedules.schema.js';
import { notifications } from '../db/schema/notifications.schema.js';

/**
 * Retrieve comprehensive Admin / HR Executive Dashboard & Analytics
 */
export async function getAdminDashboardOverview(organizationId) {
    const todayStr = new Date().toISOString().split('T')[0];
    const currentYear = new Date().getFullYear();

    // 1. Employee Headcount Summary
    const [headcount] = await db
        .select({
            total: sql`count(*)::int`,
            active: sql`count(*) filter (where ${employees.employmentStatus} = 'active')::int`,
            probation: sql`count(*) filter (where ${employees.employmentStatus} = 'probation')::int`,
            onLeave: sql`count(*) filter (where ${employees.employmentStatus} = 'on_leave')::int`,
            terminated: sql`count(*) filter (where ${employees.employmentStatus} = 'terminated')::int`,
            newJoinersThisMonth: sql`count(*) filter (where date_trunc('month', ${employees.joiningDate}) = date_trunc('month', CURRENT_DATE))::int`,
        })
        .from(employees)
        .where(
            and(eq(employees.organizationId, organizationId), sql`${employees.deletedAt} IS NULL`),
        );

    // 2. Headcount by Department
    const departmentBreakdown = await db
        .select({
            departmentId: departments.id,
            departmentName: departments.name,
            departmentCode: departments.code,
            employeeCount: sql`count(${employees.id})::int`,
        })
        .from(departments)
        .leftJoin(
            employees,
            and(
                eq(departments.id, employees.departmentId),
                sql`${employees.deletedAt} IS NULL`,
                eq(employees.employmentStatus, 'active'),
            ),
        )
        .where(and(eq(departments.organizationId, organizationId), eq(departments.isActive, true)))
        .groupBy(departments.id, departments.name, departments.code)
        .orderBy(desc(sql`count(${employees.id})`));

    // 3. Headcount by Employment Type
    const employmentTypeBreakdown = await db
        .select({
            employmentType: employees.employmentType,
            count: sql`count(*)::int`,
        })
        .from(employees)
        .where(
            and(
                eq(employees.organizationId, organizationId),
                sql`${employees.deletedAt} IS NULL`,
                eq(employees.employmentStatus, 'active'),
            ),
        )
        .groupBy(employees.employmentType);

    // 4. Today's Attendance Overview
    const [todayAttendance] = await db
        .select({
            totalRecords: sql`count(*)::int`,
            present: sql`count(*) filter (where ${attendanceRecords.status} = 'present')::int`,
            absent: sql`count(*) filter (where ${attendanceRecords.status} = 'absent')::int`,
            onLeave: sql`count(*) filter (where ${attendanceRecords.status} = 'leave')::int`,
            halfDay: sql`count(*) filter (where ${attendanceRecords.status} = 'half_day')::int`,
            late: sql`count(*) filter (where ${attendanceRecords.lateMinutes} > 0)::int`,
            incomplete: sql`count(*) filter (where ${attendanceRecords.status} = 'incomplete')::int`,
        })
        .from(attendanceRecords)
        .innerJoin(employees, eq(attendanceRecords.employeeId, employees.id))
        .where(
            and(
                eq(employees.organizationId, organizationId),
                eq(attendanceRecords.attendanceDate, todayStr),
            ),
        );

    // 5. Pending Approval Queues
    const pendingLeaves = await db
        .select({
            id: leaveRequests.id,
            employeeId: leaveRequests.employeeId,
            employeeCode: employees.employeeCode,
            employeeName: employees.displayName,
            leaveTypeName: leaveTypes.name,
            leaveTypeCode: leaveTypes.code,
            startDate: leaveRequests.startDate,
            endDate: leaveRequests.endDate,
            requestedDays: leaveRequests.requestedDays,
            reason: leaveRequests.reason,
            submittedAt: leaveRequests.submittedAt,
        })
        .from(leaveRequests)
        .innerJoin(employees, eq(leaveRequests.employeeId, employees.id))
        .innerJoin(leaveTypes, eq(leaveRequests.leaveTypeId, leaveTypes.id))
        .where(
            and(eq(employees.organizationId, organizationId), eq(leaveRequests.status, 'pending')),
        )
        .orderBy(desc(leaveRequests.submittedAt))
        .limit(5);

    const [pendingLeavesCount] = await db
        .select({ count: sql`count(*)::int` })
        .from(leaveRequests)
        .innerJoin(employees, eq(leaveRequests.employeeId, employees.id))
        .where(
            and(eq(employees.organizationId, organizationId), eq(leaveRequests.status, 'pending')),
        );

    const [pendingAdjustmentsCount] = await db
        .select({ count: sql`count(*)::int` })
        .from(attendanceAdjustments)
        .innerJoin(
            attendanceRecords,
            eq(attendanceAdjustments.attendanceRecordId, attendanceRecords.id),
        )
        .innerJoin(employees, eq(attendanceRecords.employeeId, employees.id))
        .where(
            and(
                eq(employees.organizationId, organizationId),
                eq(attendanceAdjustments.status, 'pending'),
            ),
        );

    // 6. Latest Payroll Period Summary
    const [latestPayrollPeriod] = await db
        .select({
            id: payrollPeriods.id,
            periodStart: payrollPeriods.periodStart,
            periodEnd: payrollPeriods.periodEnd,
            status: payrollPeriods.status,
            processedAt: payrollPeriods.processedAt,
            finalizedAt: payrollPeriods.finalizedAt,
        })
        .from(payrollPeriods)
        .where(eq(payrollPeriods.organizationId, organizationId))
        .orderBy(desc(payrollPeriods.periodStart))
        .limit(1);

    let payrollMetrics = null;
    if (latestPayrollPeriod) {
        const [slipTotals] = await db
            .select({
                payslipsCount: sql`count(*)::int`,
                totalGross: sql`coalesce(sum(${payslips.grossEarnings}), 0)::numeric`,
                totalDeductions: sql`coalesce(sum(${payslips.totalEmployeeDeductions}), 0)::numeric`,
                totalNetPay: sql`coalesce(sum(${payslips.netPay}), 0)::numeric`,
            })
            .from(payslips)
            .where(eq(payslips.payrollPeriodId, latestPayrollPeriod.id));

        payrollMetrics = {
            period: latestPayrollPeriod,
            summary: slipTotals || {
                payslipsCount: 0,
                totalGross: '0',
                totalDeductions: '0',
                totalNetPay: '0',
            },
        };
    }

    // 7. Upcoming Holidays in the next 30 Days
    const upcomingHolidays = await db
        .select()
        .from(holidays)
        .where(
            and(
                eq(holidays.organizationId, organizationId),
                sql`${holidays.holidayDate} >= CURRENT_DATE`,
                sql`${holidays.holidayDate} <= CURRENT_DATE + INTERVAL '30 days'`,
            ),
        )
        .orderBy(asc(holidays.holidayDate))
        .limit(5);

    // 8. Last 7 Days Attendance Trend
    const past7DaysAttendance = await db
        .select({
            date: attendanceRecords.attendanceDate,
            present: sql`count(*) filter (where ${attendanceRecords.status} = 'present')::int`,
            absent: sql`count(*) filter (where ${attendanceRecords.status} = 'absent')::int`,
            onLeave: sql`count(*) filter (where ${attendanceRecords.status} = 'leave')::int`,
            halfDay: sql`count(*) filter (where ${attendanceRecords.status} = 'half_day')::int`,
        })
        .from(attendanceRecords)
        .innerJoin(employees, eq(attendanceRecords.employeeId, employees.id))
        .where(
            and(
                eq(employees.organizationId, organizationId),
                sql`${attendanceRecords.attendanceDate} >= CURRENT_DATE - INTERVAL '7 days'`,
                sql`${attendanceRecords.attendanceDate} <= CURRENT_DATE`,
            ),
        )
        .groupBy(attendanceRecords.attendanceDate)
        .orderBy(asc(attendanceRecords.attendanceDate));

    // 9. Leave Distribution by Type this year
    const leaveDistribution = await db
        .select({
            leaveTypeId: leaveTypes.id,
            leaveTypeCode: leaveTypes.code,
            leaveTypeName: leaveTypes.name,
            totalDays: sql`coalesce(sum(${leaveRequests.requestedDays}), 0)::numeric`,
            requestCount: sql`count(${leaveRequests.id})::int`,
        })
        .from(leaveTypes)
        .leftJoin(
            leaveRequests,
            and(
                eq(leaveTypes.id, leaveRequests.leaveTypeId),
                eq(leaveRequests.status, 'approved'),
                sql`EXTRACT(YEAR FROM ${leaveRequests.startDate}) = ${currentYear}`,
            ),
        )
        .where(and(eq(leaveTypes.organizationId, organizationId), eq(leaveTypes.isActive, true)))
        .groupBy(leaveTypes.id, leaveTypes.code, leaveTypes.name);

    return {
        headcount: headcount || {
            total: 0,
            active: 0,
            probation: 0,
            onLeave: 0,
            terminated: 0,
            newJoinersThisMonth: 0,
        },
        departmentBreakdown,
        employmentTypeBreakdown,
        todayAttendance: todayAttendance || {
            totalRecords: 0,
            present: 0,
            absent: 0,
            onLeave: 0,
            halfDay: 0,
            late: 0,
            incomplete: 0,
        },
        pendingQueues: {
            leavesCount: pendingLeavesCount?.count || 0,
            adjustmentsCount: pendingAdjustmentsCount?.count || 0,
            recentPendingLeaves: pendingLeaves,
        },
        payrollMetrics,
        upcomingHolidays,
        past7DaysAttendance,
        leaveDistribution,
    };
}

/**
 * Retrieve Employee Self-Service Dashboard Overview
 */
export async function getEmployeeDashboardOverview(organizationId, employeeId, userId) {
    const todayStr = new Date().toISOString().split('T')[0];
    const currentYear = new Date().getFullYear();

    // 1. Employee Profile Summary
    const [emp] = await db
        .select({
            id: employees.id,
            employeeCode: employees.employeeCode,
            firstName: employees.firstName,
            lastName: employees.lastName,
            displayName: employees.displayName,
            workEmail: employees.workEmail,
            joiningDate: employees.joiningDate,
            employmentStatus: employees.employmentStatus,
            departmentName: departments.name,
            jobPositionName: jobPositions.name,
            locationName: locations.name,
        })
        .from(employees)
        .leftJoin(departments, eq(employees.departmentId, departments.id))
        .leftJoin(jobPositions, eq(employees.jobPositionId, jobPositions.id))
        .leftJoin(locations, eq(employees.locationId, locations.id))
        .where(eq(employees.id, employeeId))
        .limit(1);

    // 2. Today's Attendance Session & Status
    const [todayRecord] = await db
        .select({
            id: attendanceRecords.id,
            attendanceDate: attendanceRecords.attendanceDate,
            status: attendanceRecords.status,
            totalWorkMinutes: attendanceRecords.totalWorkMinutes,
            scheduledWorkMinutes: attendanceRecords.scheduledWorkMinutes,
            overtimeMinutes: attendanceRecords.overtimeMinutes,
            lateMinutes: attendanceRecords.lateMinutes,
        })
        .from(attendanceRecords)
        .where(
            and(
                eq(attendanceRecords.employeeId, employeeId),
                eq(attendanceRecords.attendanceDate, todayStr),
            ),
        )
        .limit(1);

    let latestSession = null;
    if (todayRecord) {
        const [session] = await db
            .select()
            .from(attendanceSessions)
            .where(eq(attendanceSessions.attendanceRecordId, todayRecord.id))
            .orderBy(desc(attendanceSessions.checkInAt))
            .limit(1);
        latestSession = session || null;
    }

    // 3. Leave Balances Summary
    const leaveBalances = await db
        .select({
            leaveTypeId: leaveTypes.id,
            leaveTypeCode: leaveTypes.code,
            leaveTypeName: leaveTypes.name,
            isPaid: leaveTypes.isPaid,
            allocatedDays: sql`coalesce(${leaveAllocations.allocatedDays}, 0)::numeric`,
            carriedForwardDays: sql`coalesce(${leaveAllocations.carriedForwardDays}, 0)::numeric`,
            usedDays: sql`coalesce((
                select sum(lr.requested_days)
                from leave_requests lr
                where lr.employee_id = ${employeeId}
                  and lr.leave_type_id = ${leaveTypes.id}
                  and lr.status = 'approved'
                  and EXTRACT(YEAR FROM lr.start_date) = ${currentYear}
            ), 0)::numeric`,
            pendingDays: sql`coalesce((
                select sum(lr.requested_days)
                from leave_requests lr
                where lr.employee_id = ${employeeId}
                  and lr.leave_type_id = ${leaveTypes.id}
                  and lr.status = 'pending'
                  and EXTRACT(YEAR FROM lr.start_date) = ${currentYear}
            ), 0)::numeric`,
        })
        .from(leaveTypes)
        .leftJoin(
            leaveAllocations,
            and(
                eq(leaveTypes.id, leaveAllocations.leaveTypeId),
                eq(leaveAllocations.employeeId, employeeId),
                sql`EXTRACT(YEAR FROM ${leaveAllocations.periodStart}) = ${currentYear}`,
            ),
        )
        .where(and(eq(leaveTypes.organizationId, organizationId), eq(leaveTypes.isActive, true)));

    const formattedLeaveBalances = leaveBalances.map((b) => {
        const totalEntitled = Number(b.allocatedDays) + Number(b.carriedForwardDays);
        const available = Math.max(0, totalEntitled - Number(b.usedDays));
        return {
            ...b,
            totalEntitled,
            availableDays: available,
        };
    });

    // 4. Current Month Attendance Metrics
    const [monthSummary] = await db
        .select({
            presentDays: sql`count(*) filter (where ${attendanceRecords.status} = 'present')::int`,
            absentDays: sql`count(*) filter (where ${attendanceRecords.status} = 'absent')::int`,
            leaveDays: sql`count(*) filter (where ${attendanceRecords.status} = 'leave')::int`,
            halfDays: sql`count(*) filter (where ${attendanceRecords.status} = 'half_day')::int`,
            totalWorkedHours: sql`coalesce(round(sum(${attendanceRecords.totalWorkMinutes})::numeric / 60, 1), 0)`,
            totalOvertimeHours: sql`coalesce(round(sum(${attendanceRecords.overtimeMinutes})::numeric / 60, 1), 0)`,
        })
        .from(attendanceRecords)
        .where(
            and(
                eq(attendanceRecords.employeeId, employeeId),
                sql`date_trunc('month', ${attendanceRecords.attendanceDate}) = date_trunc('month', CURRENT_DATE)`,
            ),
        );

    // 5. Recent 7 Attendance Records
    const recentAttendance = await db
        .select()
        .from(attendanceRecords)
        .where(eq(attendanceRecords.employeeId, employeeId))
        .orderBy(desc(attendanceRecords.attendanceDate))
        .limit(7);

    // 6. Recent Leave Requests
    const recentLeaves = await db
        .select({
            id: leaveRequests.id,
            leaveTypeName: leaveTypes.name,
            leaveTypeCode: leaveTypes.code,
            startDate: leaveRequests.startDate,
            endDate: leaveRequests.endDate,
            requestedDays: leaveRequests.requestedDays,
            status: leaveRequests.status,
            reason: leaveRequests.reason,
            submittedAt: leaveRequests.submittedAt,
        })
        .from(leaveRequests)
        .innerJoin(leaveTypes, eq(leaveRequests.leaveTypeId, leaveTypes.id))
        .where(eq(leaveRequests.employeeId, employeeId))
        .orderBy(desc(leaveRequests.submittedAt))
        .limit(5);

    // 7. Latest Payslip Snapshot
    const [latestPayslip] = await db
        .select({
            id: payslips.id,
            periodStart: payrollPeriods.periodStart,
            periodEnd: payrollPeriods.periodEnd,
            grossEarnings: payslips.grossEarnings,
            totalEmployeeDeductions: payslips.totalEmployeeDeductions,
            netPay: payslips.netPay,
            status: payslips.status,
            generatedAt: payslips.generatedAt,
        })
        .from(payslips)
        .innerJoin(payrollPeriods, eq(payslips.payrollPeriodId, payrollPeriods.id))
        .where(and(eq(payslips.employeeId, employeeId), eq(payslips.status, 'finalized')))
        .orderBy(desc(payrollPeriods.periodStart))
        .limit(1);

    // 8. Upcoming Holidays
    const upcomingHolidays = await db
        .select()
        .from(holidays)
        .where(
            and(
                eq(holidays.organizationId, organizationId),
                sql`${holidays.holidayDate} >= CURRENT_DATE`,
                sql`${holidays.holidayDate} <= CURRENT_DATE + INTERVAL '30 days'`,
            ),
        )
        .orderBy(asc(holidays.holidayDate))
        .limit(3);

    // 9. Unread Notifications Count
    const [unreadNotif] = await db
        .select({ count: sql`count(*)::int` })
        .from(notifications)
        .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

    return {
        profile: emp,
        employee: emp,
        today: {
            record: todayRecord || null,
            session: latestSession || null,
            isCheckedIn: latestSession && !latestSession.checkOutAt,
            status: todayRecord?.status || 'NOT_LOGGED',
        },
        leaveBalances: formattedLeaveBalances,
        monthSummary: monthSummary || {
            presentDays: 0,
            absentDays: 0,
            leaveDays: 0,
            halfDays: 0,
            totalWorkedHours: 0,
            totalOvertimeHours: 0,
        },
        recentAttendance,
        recentLeaves,
        latestPayslip: latestPayslip || null,
        upcomingHolidays,
        unreadNotificationsCount: unreadNotif?.count || 0,
    };
}

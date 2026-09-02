import { db } from '../config/database.config.js';
import {
    attendanceRecords,
    attendanceSessions,
    attendanceAdjustments,
    employees,
    departments,
    users,
    workSchedules,
    workScheduleDays,
    employeeScheduleAssignments,
    holidays,
} from '../db/schema/schema.js';
import { eq, and, gte, lte, desc, asc, sql, isNull } from 'drizzle-orm';

// ── Attendance Records ────────────────────────────────────────────────────────

export async function getAttendanceRecordById(id, tx) {
    const client = tx || db;
    const [record] = await client
        .select({
            id: attendanceRecords.id,
            employeeId: attendanceRecords.employeeId,
            attendanceDate: attendanceRecords.attendanceDate,
            status: attendanceRecords.status,
            totalWorkMinutes: attendanceRecords.totalWorkMinutes,
            scheduledWorkMinutes: attendanceRecords.scheduledWorkMinutes,
            overtimeMinutes: attendanceRecords.overtimeMinutes,
            lateMinutes: attendanceRecords.lateMinutes,
            earlyCheckoutMinutes: attendanceRecords.earlyCheckoutMinutes,
            remarks: attendanceRecords.remarks,
            source: attendanceRecords.source,
            createdAt: attendanceRecords.createdAt,
            updatedAt: attendanceRecords.updatedAt,
            employeeCode: employees.employeeCode,
            firstName: employees.firstName,
            lastName: employees.lastName,
            displayName: employees.displayName,
            workEmail: employees.workEmail,
            departmentId: employees.departmentId,
            departmentName: departments.name,
        })
        .from(attendanceRecords)
        .innerJoin(employees, eq(attendanceRecords.employeeId, employees.id))
        .leftJoin(departments, eq(employees.departmentId, departments.id))
        .where(eq(attendanceRecords.id, id));

    return record || null;
}

export async function getAttendanceRecordByEmployeeAndDate(employeeId, attendanceDate, tx) {
    const client = tx || db;
    const [record] = await client
        .select()
        .from(attendanceRecords)
        .where(
            and(
                eq(attendanceRecords.employeeId, employeeId),
                eq(attendanceRecords.attendanceDate, attendanceDate),
            ),
        );
    return record || null;
}

export async function createAttendanceRecord(data, tx) {
    const client = tx || db;
    const [record] = await client.insert(attendanceRecords).values(data).returning();
    return record;
}

export async function updateAttendanceRecord(id, data, tx) {
    const client = tx || db;
    const [record] = await client
        .update(attendanceRecords)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(attendanceRecords.id, id))
        .returning();
    return record || null;
}

// ── Attendance Sessions ───────────────────────────────────────────────────────

export async function getSessionsByRecordId(attendanceRecordId, tx) {
    const client = tx || db;
    return await client
        .select()
        .from(attendanceSessions)
        .where(eq(attendanceSessions.attendanceRecordId, attendanceRecordId))
        .orderBy(asc(attendanceSessions.checkInAt));
}

export async function getActiveSession(attendanceRecordId, tx) {
    const client = tx || db;
    const [session] = await client
        .select()
        .from(attendanceSessions)
        .where(
            and(
                eq(attendanceSessions.attendanceRecordId, attendanceRecordId),
                isNull(attendanceSessions.checkOutAt),
            ),
        )
        .orderBy(desc(attendanceSessions.checkInAt))
        .limit(1);
    return session || null;
}

export async function createAttendanceSession(data, tx) {
    const client = tx || db;
    const [session] = await client.insert(attendanceSessions).values(data).returning();
    return session;
}

export async function updateAttendanceSession(id, data, tx) {
    const client = tx || db;
    const [session] = await client
        .update(attendanceSessions)
        .set(data)
        .where(eq(attendanceSessions.id, id))
        .returning();
    return session || null;
}

// ── Attendance List & Filtering ───────────────────────────────────────────────

export async function getAttendanceRecords(
    {
        organizationId,
        employeeId,
        date,
        startDate,
        endDate,
        status,
        departmentId,
        limit = 50,
        offset = 0,
    } = {},
    tx,
) {
    const client = tx || db;
    const filters = [];

    if (organizationId) {
        filters.push(eq(employees.organizationId, organizationId));
    }
    if (employeeId) {
        filters.push(eq(attendanceRecords.employeeId, employeeId));
    }
    if (date) {
        filters.push(eq(attendanceRecords.attendanceDate, date));
    }
    if (startDate) {
        filters.push(gte(attendanceRecords.attendanceDate, startDate));
    }
    if (endDate) {
        filters.push(lte(attendanceRecords.attendanceDate, endDate));
    }
    if (status) {
        filters.push(eq(attendanceRecords.status, status));
    }
    if (departmentId) {
        filters.push(eq(employees.departmentId, departmentId));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const [countResult] = await client
        .select({ total: sql`count(*)::int` })
        .from(attendanceRecords)
        .innerJoin(employees, eq(attendanceRecords.employeeId, employees.id))
        .where(whereClause);

    const records = await client
        .select({
            id: attendanceRecords.id,
            employeeId: attendanceRecords.employeeId,
            attendanceDate: attendanceRecords.attendanceDate,
            status: attendanceRecords.status,
            totalWorkMinutes: attendanceRecords.totalWorkMinutes,
            scheduledWorkMinutes: attendanceRecords.scheduledWorkMinutes,
            overtimeMinutes: attendanceRecords.overtimeMinutes,
            lateMinutes: attendanceRecords.lateMinutes,
            earlyCheckoutMinutes: attendanceRecords.earlyCheckoutMinutes,
            remarks: attendanceRecords.remarks,
            source: attendanceRecords.source,
            createdAt: attendanceRecords.createdAt,
            updatedAt: attendanceRecords.updatedAt,
            employeeCode: employees.employeeCode,
            firstName: employees.firstName,
            lastName: employees.lastName,
            displayName: employees.displayName,
            workEmail: employees.workEmail,
            departmentId: employees.departmentId,
            departmentName: departments.name,
        })
        .from(attendanceRecords)
        .innerJoin(employees, eq(attendanceRecords.employeeId, employees.id))
        .leftJoin(departments, eq(employees.departmentId, departments.id))
        .where(whereClause)
        .orderBy(desc(attendanceRecords.attendanceDate), asc(employees.employeeCode))
        .limit(limit)
        .offset(offset);

    return {
        total: countResult?.total || 0,
        limit,
        offset,
        records,
    };
}

// ── Aggregated Summaries ──────────────────────────────────────────────────────

export async function getEmployeeAttendanceSummary(employeeId, startDate, endDate, tx) {
    const client = tx || db;
    const filters = [eq(attendanceRecords.employeeId, employeeId)];
    if (startDate) filters.push(gte(attendanceRecords.attendanceDate, startDate));
    if (endDate) filters.push(lte(attendanceRecords.attendanceDate, endDate));

    const whereClause = and(...filters);

    const rows = await client
        .select({
            status: attendanceRecords.status,
            totalWorkMinutes: attendanceRecords.totalWorkMinutes,
            overtimeMinutes: attendanceRecords.overtimeMinutes,
            lateMinutes: attendanceRecords.lateMinutes,
            earlyCheckoutMinutes: attendanceRecords.earlyCheckoutMinutes,
        })
        .from(attendanceRecords)
        .where(whereClause);

    const summary = {
        totalRecords: rows.length,
        presentDays: 0,
        halfDays: 0,
        absentDays: 0,
        leaveDays: 0,
        holidayDays: 0,
        weeklyOffDays: 0,
        incompleteDays: 0,
        totalWorkMinutes: 0,
        totalOvertimeMinutes: 0,
        totalLateMinutes: 0,
        lateDaysCount: 0,
    };

    for (const r of rows) {
        if (r.status === 'present') summary.presentDays++;
        else if (r.status === 'half_day') summary.halfDays++;
        else if (r.status === 'absent') summary.absentDays++;
        else if (r.status === 'leave') summary.leaveDays++;
        else if (r.status === 'holiday') summary.holidayDays++;
        else if (r.status === 'weekly_off') summary.weeklyOffDays++;
        else if (r.status === 'incomplete') summary.incompleteDays++;

        summary.totalWorkMinutes += Number(r.totalWorkMinutes) || 0;
        summary.totalOvertimeMinutes += Number(r.overtimeMinutes) || 0;
        summary.totalLateMinutes += Number(r.lateMinutes) || 0;
        if (Number(r.lateMinutes) > 0) summary.lateDaysCount++;
    }

    summary.totalWorkHours = +(summary.totalWorkMinutes / 60).toFixed(2);
    summary.totalOvertimeHours = +(summary.totalOvertimeMinutes / 60).toFixed(2);

    return summary;
}

export async function getCompanyAttendanceSummary(
    organizationId,
    date = new Date().toISOString().split('T')[0],
    departmentId = null,
    tx,
) {
    const client = tx || db;

    // Total active employees count
    const empFilters = [
        eq(employees.organizationId, organizationId),
        eq(employees.employmentStatus, 'active'),
        sql`${employees.deletedAt} IS NULL`,
    ];
    if (departmentId) {
        empFilters.push(eq(employees.departmentId, departmentId));
    }

    const [empCount] = await client
        .select({ count: sql`count(*)::int` })
        .from(employees)
        .where(and(...empFilters));

    const totalActiveEmployees = empCount?.count || 0;

    // Today's attendance records for these employees
    const attFilters = [
        eq(employees.organizationId, organizationId),
        eq(attendanceRecords.attendanceDate, date),
    ];
    if (departmentId) {
        attFilters.push(eq(employees.departmentId, departmentId));
    }

    const records = await client
        .select({
            status: attendanceRecords.status,
            lateMinutes: attendanceRecords.lateMinutes,
            totalWorkMinutes: attendanceRecords.totalWorkMinutes,
        })
        .from(attendanceRecords)
        .innerJoin(employees, eq(attendanceRecords.employeeId, employees.id))
        .where(and(...attFilters));

    let present = 0;
    let halfDay = 0;
    let absent = 0;
    let leave = 0;
    let holiday = 0;
    let weeklyOff = 0;
    let incomplete = 0;
    let lateCount = 0;

    for (const r of records) {
        if (r.status === 'present') present++;
        else if (r.status === 'half_day') halfDay++;
        else if (r.status === 'absent') absent++;
        else if (r.status === 'leave') leave++;
        else if (r.status === 'holiday') holiday++;
        else if (r.status === 'weekly_off') weeklyOff++;
        else if (r.status === 'incomplete') incomplete++;

        if (Number(r.lateMinutes) > 0) lateCount++;
    }

    const unrecorded = Math.max(
        0,
        totalActiveEmployees -
            (present + halfDay + absent + leave + holiday + weeklyOff + incomplete),
    );

    const effectivePresent = present + halfDay * 0.5;
    const attendancePercentage =
        totalActiveEmployees > 0
            ? +((effectivePresent / totalActiveEmployees) * 100).toFixed(1)
            : 0;

    return {
        date,
        totalActiveEmployees,
        recordedEmployees: records.length,
        present,
        halfDay,
        absent: absent + unrecorded,
        leave,
        holiday,
        weeklyOff,
        incomplete,
        lateCount,
        attendancePercentage,
    };
}

// ── Attendance Regularizations & Adjustments ──────────────────────────────────

export async function createAdjustment(data, tx) {
    const client = tx || db;
    const [adj] = await client.insert(attendanceAdjustments).values(data).returning();
    return adj;
}

export async function getAdjustmentById(id, tx) {
    const client = tx || db;
    const [adj] = await client
        .select({
            id: attendanceAdjustments.id,
            attendanceRecordId: attendanceAdjustments.attendanceRecordId,
            requestedBy: attendanceAdjustments.requestedBy,
            approvedBy: attendanceAdjustments.approvedBy,
            oldValue: attendanceAdjustments.oldValue,
            newValue: attendanceAdjustments.newValue,
            reason: attendanceAdjustments.reason,
            status: attendanceAdjustments.status,
            createdAt: attendanceAdjustments.createdAt,
            updatedAt: attendanceAdjustments.updatedAt,
            attendanceDate: attendanceRecords.attendanceDate,
            employeeId: attendanceRecords.employeeId,
            employeeCode: employees.employeeCode,
            employeeName: employees.displayName,
            requesterEmail: users.email,
        })
        .from(attendanceAdjustments)
        .innerJoin(
            attendanceRecords,
            eq(attendanceAdjustments.attendanceRecordId, attendanceRecords.id),
        )
        .innerJoin(employees, eq(attendanceRecords.employeeId, employees.id))
        .innerJoin(users, eq(attendanceAdjustments.requestedBy, users.id))
        .where(eq(attendanceAdjustments.id, id));

    return adj || null;
}

export async function getAdjustments(
    { organizationId, employeeId, requestedBy, status, limit = 50, offset = 0 } = {},
    tx,
) {
    const client = tx || db;
    const filters = [];

    if (organizationId) {
        filters.push(eq(employees.organizationId, organizationId));
    }
    if (employeeId) {
        filters.push(eq(attendanceRecords.employeeId, employeeId));
    }
    if (requestedBy) {
        filters.push(eq(attendanceAdjustments.requestedBy, requestedBy));
    }
    if (status) {
        filters.push(eq(attendanceAdjustments.status, status));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const [countResult] = await client
        .select({ total: sql`count(*)::int` })
        .from(attendanceAdjustments)
        .innerJoin(
            attendanceRecords,
            eq(attendanceAdjustments.attendanceRecordId, attendanceRecords.id),
        )
        .innerJoin(employees, eq(attendanceRecords.employeeId, employees.id))
        .where(whereClause);

    const adjustments = await client
        .select({
            id: attendanceAdjustments.id,
            attendanceRecordId: attendanceAdjustments.attendanceRecordId,
            requestedBy: attendanceAdjustments.requestedBy,
            approvedBy: attendanceAdjustments.approvedBy,
            oldValue: attendanceAdjustments.oldValue,
            newValue: attendanceAdjustments.newValue,
            reason: attendanceAdjustments.reason,
            status: attendanceAdjustments.status,
            createdAt: attendanceAdjustments.createdAt,
            updatedAt: attendanceAdjustments.updatedAt,
            attendanceDate: attendanceRecords.attendanceDate,
            employeeId: attendanceRecords.employeeId,
            employeeCode: employees.employeeCode,
            employeeName: employees.displayName,
            requesterEmail: users.email,
        })
        .from(attendanceAdjustments)
        .innerJoin(
            attendanceRecords,
            eq(attendanceAdjustments.attendanceRecordId, attendanceRecords.id),
        )
        .innerJoin(employees, eq(attendanceRecords.employeeId, employees.id))
        .innerJoin(users, eq(attendanceAdjustments.requestedBy, users.id))
        .where(whereClause)
        .orderBy(desc(attendanceAdjustments.createdAt))
        .limit(limit)
        .offset(offset);

    return {
        total: countResult?.total || 0,
        limit,
        offset,
        adjustments,
    };
}

export async function updateAdjustment(id, data, tx) {
    const client = tx || db;
    const [adj] = await client
        .update(attendanceAdjustments)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(eq(attendanceAdjustments.id, id))
        .returning();
    return adj || null;
}

// ── Work Schedule Resolution ──────────────────────────────────────────────────

export async function getEmployeeActiveSchedule(employeeId, organizationId, targetDate, tx) {
    const client = tx || db;
    const targetDateObj = new Date(targetDate);
    const weekday = targetDateObj.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat

    // 1. Check if employee has a specific schedule assignment
    const [assignment] = await client
        .select({
            scheduleId: employeeScheduleAssignments.scheduleId,
        })
        .from(employeeScheduleAssignments)
        .where(
            and(
                eq(employeeScheduleAssignments.employeeId, employeeId),
                lte(employeeScheduleAssignments.effectiveFrom, targetDate),
                sql`(${employeeScheduleAssignments.effectiveTo} IS NULL OR ${employeeScheduleAssignments.effectiveTo} >= ${targetDate})`,
            ),
        )
        .orderBy(desc(employeeScheduleAssignments.effectiveFrom))
        .limit(1);

    let scheduleId = assignment?.scheduleId;

    // 2. If no assignment, get the organization's active default schedule
    if (!scheduleId && organizationId) {
        const [defaultSchedule] = await client
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
        return null;
    }

    // 3. Get schedule day timing for the weekday
    const [scheduleDay] = await client
        .select()
        .from(workScheduleDays)
        .where(
            and(eq(workScheduleDays.scheduleId, scheduleId), eq(workScheduleDays.weekday, weekday)),
        );

    // 4. Check if targetDate is a Holiday
    const [holiday] = await client
        .select()
        .from(holidays)
        .where(
            and(eq(holidays.organizationId, organizationId), eq(holidays.holidayDate, targetDate)),
        );

    return {
        scheduleId,
        weekday,
        scheduleDay: scheduleDay || null,
        holiday: holiday || null,
    };
}

export async function analyzeAttendance(orgId, metric, groupBy, startDate, endDate) {
    const metricExprMap = {
        overtime: sql`SUM(${attendanceRecords.overtimeMinutes})`,
        absenteeism: sql`COUNT(*) FILTER (WHERE LOWER(${attendanceRecords.status}::text) = 'absent')`,
        late_arrivals: sql`COUNT(*) FILTER (WHERE ${attendanceRecords.lateMinutes} > 0)`,
        early_checkouts: sql`COUNT(*) FILTER (WHERE ${attendanceRecords.earlyCheckoutMinutes} > 0)`,
        worked_hours: sql`ROUND(SUM(${attendanceRecords.totalWorkMinutes}) / 60.0, 2)`,
        attendance: sql`COUNT(*) FILTER (WHERE LOWER(${attendanceRecords.status}::text) = 'present')`,
    };
    const metricExpr = metricExprMap[metric];
    if (!metricExpr) throw new Error(`Unknown metric: ${metric}`);

    const groupByMap = {
        employee: {
            id: employees.id,
            label: sql`CONCAT(${employees.firstName}, ' ', ${employees.lastName})`,
        },
        department: { id: departments.id, label: departments.name },
        location: {
            id: employees.locationId,
            label: sql`COALESCE(${employees.locationId}::text, 'No Location')`,
        },
    };
    const { id: groupId, label: groupLabel } = groupByMap[groupBy] || groupByMap.employee;

    return db
        .select({ groupId, groupLabel, value: metricExpr })
        .from(attendanceRecords)
        .innerJoin(employees, eq(attendanceRecords.employeeId, employees.id))
        .leftJoin(departments, eq(employees.departmentId, departments.id))
        .where(
            and(
                eq(employees.organizationId, orgId),
                gte(attendanceRecords.attendanceDate, startDate),
                lte(attendanceRecords.attendanceDate, endDate),
            ),
        )
        .groupBy(groupId, groupLabel)
        .orderBy(sql`2 DESC`)
        .limit(50);
}

export async function getAttendanceAnomalies(orgId, date, empId) {
    const filters = [
        eq(employees.organizationId, orgId),
        eq(attendanceRecords.attendanceDate, date),
    ];
    if (empId) filters.push(eq(attendanceRecords.employeeId, empId));

    const records = await db
        .select({
            employeeId: attendanceRecords.employeeId,
            employeeName: sql`CONCAT(${employees.firstName}, ' ', ${employees.lastName})`,
            status: attendanceRecords.status,
            lateMinutes: attendanceRecords.lateMinutes,
            earlyCheckoutMinutes: attendanceRecords.earlyCheckoutMinutes,
            totalWorkMinutes: attendanceRecords.totalWorkMinutes,
            scheduledWorkMinutes: attendanceRecords.scheduledWorkMinutes,
            hasSession: sql`EXISTS (
                SELECT 1 FROM ${attendanceSessions}
                WHERE ${attendanceSessions.attendanceRecordId} = ${attendanceRecords.id}
                  AND ${attendanceSessions.checkOutAt || attendanceSessions.checkOut} IS NOT NULL
            )`.as('has_session'),
        })
        .from(attendanceRecords)
        .innerJoin(employees, eq(attendanceRecords.employeeId, employees.id))
        .where(and(...filters));

    const anomalies = [];
    for (const rec of records) {
        const normalizedStatus = (rec.status || '').toLowerCase();
        if (!rec.hasSession && normalizedStatus === 'present')
            anomalies.push({
                employeeId: rec.employeeId,
                employeeName: rec.employeeName,
                anomalyType: 'missing_checkout',
                detail: 'Checked in but no checkout recorded',
            });
        if (normalizedStatus === 'absent')
            anomalies.push({
                employeeId: rec.employeeId,
                employeeName: rec.employeeName,
                anomalyType: 'absent_without_leave',
                detail: 'Absent with no approved leave',
            });
        if ((rec.lateMinutes || 0) > 0)
            anomalies.push({
                employeeId: rec.employeeId,
                employeeName: rec.employeeName,
                anomalyType: 'late_arrival',
                detail: `${rec.lateMinutes} minutes late`,
            });
        if ((rec.earlyCheckoutMinutes || 0) > 0)
            anomalies.push({
                employeeId: rec.employeeId,
                employeeName: rec.employeeName,
                anomalyType: 'early_checkout',
                detail: `Left ${rec.earlyCheckoutMinutes} minutes early`,
            });
        if ((rec.totalWorkMinutes || 0) > (rec.scheduledWorkMinutes || 0) + 120)
            anomalies.push({
                employeeId: rec.employeeId,
                employeeName: rec.employeeName,
                anomalyType: 'excessive_duration',
                detail: `Worked ${Math.round(rec.totalWorkMinutes / 60)}h vs ${Math.round(rec.scheduledWorkMinutes / 60)}h scheduled`,
            });
    }
    return anomalies;
}

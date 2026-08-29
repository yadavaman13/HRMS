import * as payrollDao from '../dao/payroll.dao.js';
import * as employeeDao from '../dao/employee.dao.js';
import * as attendanceDao from '../dao/attendance.dao.js';
import { makePDF } from './pdf/render.pdf.service.js';
import { payslipTemplate } from '../templates/index.js';
import { db } from '../config/database.config.js';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import {
    leaveRequests,
    leaveTypes,
    holidays,
    employeeScheduleAssignments,
    workSchedules,
    workScheduleDays,
    employees,
    organizations,
    payslips,
} from '../db/schema/schema.js';

// ── Attendance and Payable Days Engine ──────────────────────────────────────

export async function calculateAttendanceSummary(
    employeeId,
    organizationId,
    startDateStr,
    endDateStr,
    tx,
) {
    const client = tx || db;

    // 1. Fetch Employee details (for joining/termination date)
    const employee = await employeeDao.getEmployeeById(employeeId, true);
    if (!employee) {
        throw new Error(`Employee with ID ${employeeId} not found`);
    }

    const joiningDate = employee.joiningDate ? new Date(employee.joiningDate) : null;
    const terminationDate = employee.terminationDate ? new Date(employee.terminationDate) : null;

    // 2. Parse range dates
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // 3. Fetch all attendance records for employee in range
    const attendanceResult = await attendanceDao.getAttendanceRecords(
        {
            employeeId,
            startDate: startDateStr,
            endDate: endDateStr,
            limit: 1000,
        },
        client,
    );

    const attendanceRecordsList = Array.isArray(attendanceResult)
        ? attendanceResult
        : attendanceResult?.records || [];

    const attendanceMap = new Map();
    for (const record of attendanceRecordsList) {
        // Date from DB might be a Date object or string "YYYY-MM-DD"
        const dateKey =
            typeof record.attendanceDate === 'string'
                ? record.attendanceDate
                : new Date(record.attendanceDate).toISOString().split('T')[0];
        attendanceMap.set(dateKey, record);
    }

    // 4. Fetch all holidays in range
    const holidaysList = await client
        .select()
        .from(holidays)
        .where(
            and(
                eq(holidays.organizationId, organizationId),
                gte(holidays.holidayDate, startDateStr),
                lte(holidays.holidayDate, endDateStr),
            ),
        );
    const holidayMap = new Map();
    for (const h of holidaysList) {
        const dateKey =
            typeof h.holidayDate === 'string'
                ? h.holidayDate
                : new Date(h.holidayDate).toISOString().split('T')[0];
        holidayMap.set(dateKey, h);
    }

    // 5. Fetch all approved leave requests in range
    const leavesList = await client
        .select({
            id: leaveRequests.id,
            startDate: leaveRequests.startDate,
            endDate: leaveRequests.endDate,
            isPaid: leaveTypes.isPaid,
        })
        .from(leaveRequests)
        .innerJoin(leaveTypes, eq(leaveRequests.leaveTypeId, leaveTypes.id))
        .where(
            and(
                eq(leaveRequests.employeeId, employeeId),
                eq(leaveRequests.status, 'approved'),
                gte(leaveRequests.endDate, startDateStr),
                lte(leaveRequests.startDate, endDateStr),
            ),
        );

    // Build a map of leave dates
    const leaveMap = new Map();
    for (const leave of leavesList) {
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateKey = d.toISOString().split('T')[0];
            leaveMap.set(dateKey, leave);
        }
    }

    // 6. Resolve Work Schedule Assignments in range
    const assignments = await client
        .select()
        .from(employeeScheduleAssignments)
        .where(
            and(
                eq(employeeScheduleAssignments.employeeId, employeeId),
                lte(employeeScheduleAssignments.effectiveFrom, endDateStr),
            ),
        )
        .orderBy(employeeScheduleAssignments.effectiveFrom);

    // Fetch default schedule details in case no custom assignment
    let defaultScheduleId = null;
    const [defaultSchedule] = await client
        .select({ id: workSchedules.id })
        .from(workSchedules)
        .where(
            and(eq(workSchedules.organizationId, organizationId), eq(workSchedules.isActive, true)),
        )
        .limit(1);
    if (defaultSchedule) {
        defaultScheduleId = defaultSchedule.id;
    }

    // Get all schedule days for caching
    const scheduleDaysList = await client.select().from(workScheduleDays);

    // Group schedule days by scheduleId
    const scheduleDaysMap = new Map();
    for (const sd of scheduleDaysList) {
        if (!scheduleDaysMap.has(sd.scheduleId)) {
            scheduleDaysMap.set(sd.scheduleId, new Map());
        }
        scheduleDaysMap.get(sd.scheduleId).set(sd.weekday, sd);
    }

    // Helper to get active schedule day config for a day
    const getScheduleDayConfig = (dateObj) => {
        const dateStr = dateObj.toISOString().split('T')[0];
        // Find matching assignment
        let activeScheduleId = null;
        for (const ass of assignments) {
            if (dateStr >= ass.effectiveFrom && (!ass.effectiveTo || dateStr <= ass.effectiveTo)) {
                activeScheduleId = ass.scheduleId;
                break;
            }
        }
        if (!activeScheduleId) {
            activeScheduleId = defaultScheduleId;
        }
        if (!activeScheduleId) return null;

        const weekday = dateObj.getDay(); // 0 = Sun, 1 = Mon ...
        return scheduleDaysMap.get(activeScheduleId)?.get(weekday) || null;
    };

    // 7. Iterate day by day in range
    let totalCalendarDays = 0;
    let scheduledDays = 0;
    let presentDays = 0;
    let paidLeaveDays = 0;
    let unpaidLeaveDays = 0;
    let absentDays = 0;
    let halfDays = 0;
    let holidayDays = 0;
    let weekendDays = 0;
    let workingMinutes = 0;
    let overtimeMinutes = 0;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        // Skip days before employee joined or after they were terminated
        if (joiningDate && d < joiningDate) continue;
        if (terminationDate && d > terminationDate) continue;

        totalCalendarDays++;
        const dateKey = d.toISOString().split('T')[0];

        const attendance = attendanceMap.get(dateKey);
        const holiday = holidayMap.get(dateKey);
        const leave = leaveMap.get(dateKey);
        const scheduleDay = getScheduleDayConfig(d);

        const isScheduledWorkDay = scheduleDay ? scheduleDay.isWorkingDay : false;

        if (holiday) {
            holidayDays++;
            // If present on holiday, count towards present/overtime if appropriate, but standard: holiday is paid
            if (
                attendance &&
                (attendance.status === 'present' || attendance.status === 'half_day')
            ) {
                presentDays += attendance.status === 'present' ? 1 : 0.5;
                workingMinutes += attendance.totalWorkMinutes || 0;
                overtimeMinutes += attendance.overtimeMinutes || 0;
            }
        } else if (!isScheduledWorkDay) {
            weekendDays++;
            if (
                attendance &&
                (attendance.status === 'present' || attendance.status === 'half_day')
            ) {
                presentDays += attendance.status === 'present' ? 1 : 0.5;
                workingMinutes += attendance.totalWorkMinutes || 0;
                overtimeMinutes += attendance.overtimeMinutes || 0;
            }
        } else {
            // Scheduled working day
            scheduledDays++;

            if (attendance) {
                workingMinutes += attendance.totalWorkMinutes || 0;
                overtimeMinutes += attendance.overtimeMinutes || 0;

                if (attendance.status === 'present') {
                    presentDays++;
                } else if (attendance.status === 'half_day') {
                    halfDays++;
                    presentDays += 0.5;
                    absentDays += 0.5; // remaining half is unpaid/absent
                } else if (attendance.status === 'incomplete') {
                    halfDays++;
                    presentDays += 0.5;
                    absentDays += 0.5;
                } else if (attendance.status === 'absent') {
                    absentDays++;
                } else if (attendance.status === 'leave') {
                    // Handled if leave exists
                    if (leave) {
                        if (leave.isPaid) {
                            paidLeaveDays++;
                        } else {
                            unpaidLeaveDays++;
                        }
                    } else {
                        // Fallback if status is leave but no leave request found
                        paidLeaveDays++;
                    }
                } else {
                    // Fallback weekly_off/holiday inside working day context
                    presentDays++;
                }
            } else if (leave) {
                // No attendance record but approved leave
                if (leave.isPaid) {
                    paidLeaveDays++;
                } else {
                    unpaidLeaveDays++;
                }
            } else {
                // No attendance and no leave = ABSENT
                absentDays++;
            }
        }
    }

    // Payable Days = Present + Paid Leaves + Holidays + Weekends
    const payableDays = presentDays + paidLeaveDays + holidayDays + weekendDays;
    const unpaidDays = absentDays + unpaidLeaveDays;

    return {
        totalCalendarDays,
        scheduledDays,
        presentDays,
        paidLeaveDays,
        unpaidLeaveDays,
        absentDays,
        halfDays,
        holidayDays,
        weekendDays,
        payableDays,
        unpaidDays,
        workingMinutes,
        overtimeMinutes,
    };
}

// ── Salary Components Calculation Engine ─────────────────────────────────────

export function calculateSalaryComponents(monthlyWage, components, settings) {
    const calculated = [];
    const wage = Number(monthlyWage);

    // Filter components by type
    const earnings = components.filter((c) => c.componentType === 'earning');
    const deductions = components.filter((c) => c.componentType === 'employee_deduction');
    const employerContributions = components.filter(
        (c) => c.componentType === 'employer_contribution',
    );

    // Helper map to store calculated earnings for percentage_of_component dependencies
    const earningsMap = new Map();

    let earningsSum = 0;
    let residualComponent = null;

    // Sort earnings components: process residual last, and resolve dependency tree (simple 1-level for hackathon)
    const sortedEarnings = [...earnings].sort((a, b) => {
        if (a.isResidual) return 1;
        if (b.isResidual) return -1;
        // If a depends on b, b should go first
        if (a.calculationType === 'percentage_of_component' && a.calculationBase === b.code)
            return 1;
        if (b.calculationType === 'percentage_of_component' && b.calculationBase === a.code)
            return -1;
        return 0;
    });

    for (const comp of sortedEarnings) {
        if (comp.isResidual) {
            residualComponent = comp;
            continue;
        }

        let amount = 0;
        if (comp.calculationType === 'fixed') {
            amount = Number(comp.fixedAmount) || 0;
        } else if (comp.calculationType === 'percentage_of_wage') {
            amount = wage * (Number(comp.percentage) / 100);
        } else if (comp.calculationType === 'percentage_of_component') {
            const baseAmount = earningsMap.get(comp.calculationBase) || 0;
            amount = baseAmount * (Number(comp.percentage) / 100);
        }

        amount = Math.round(amount * 100) / 100;
        earningsSum += amount;
        earningsMap.set(comp.code, amount);

        calculated.push({
            componentDefinitionId: comp.componentDefinitionId,
            code: comp.code,
            name: comp.name,
            componentType: comp.componentType,
            calculationType: comp.calculationType,
            baseAmount:
                comp.calculationType === 'percentage_of_component'
                    ? earningsMap.get(comp.calculationBase)
                    : wage,
            percentage: comp.percentage,
            quantity: 1.0,
            amount,
            sequence: comp.sequence,
        });
    }

    // Process residual component if defined
    if (residualComponent) {
        let amount = Math.max(0, wage - earningsSum);
        amount = Math.round(amount * 100) / 100;
        earningsSum += amount;

        calculated.push({
            componentDefinitionId: residualComponent.componentDefinitionId,
            code: residualComponent.code,
            name: residualComponent.name,
            componentType: residualComponent.componentType,
            calculationType: residualComponent.calculationType,
            baseAmount: wage,
            percentage: null,
            quantity: 1.0,
            amount,
            sequence: residualComponent.sequence,
        });
    }

    const grossEarnings = Math.round(earningsSum * 100) / 100;

    // Calculate deductions
    let totalDeductions = 0;

    // Find BASIC/Basic component amount for PF base calculations
    const basicAmount = earningsMap.get('BASIC') || earningsMap.get('Basic') || grossEarnings;

    for (const comp of deductions) {
        let amount = 0;
        if (comp.code === 'EMPLOYEE_PF' || comp.code === 'PF') {
            if (settings && settings.pfEnabled) {
                const pfRate = Number(settings.employeePfRate) || 12.0;
                amount = basicAmount * (pfRate / 100);
            }
        } else if (comp.code === 'PROFESSIONAL_TAX' || comp.code === 'PT') {
            if (settings && settings.professionalTaxEnabled) {
                amount = Number(settings.professionalTaxAmount) || 200.0;
            }
        } else {
            // General deduction component
            if (comp.calculationType === 'fixed') {
                amount = Number(comp.fixedAmount) || 0;
            } else if (comp.calculationType === 'percentage_of_wage') {
                amount = wage * (Number(comp.percentage) / 100);
            } else if (comp.calculationType === 'percentage_of_component') {
                const baseAmount = earningsMap.get(comp.calculationBase) || 0;
                amount = baseAmount * (Number(comp.percentage) / 100);
            }
        }

        amount = Math.round(amount * 100) / 100;
        totalDeductions += amount;

        calculated.push({
            componentDefinitionId: comp.componentDefinitionId,
            code: comp.code,
            name: comp.name,
            componentType: comp.componentType,
            calculationType: comp.calculationType,
            baseAmount:
                comp.calculationType === 'percentage_of_component'
                    ? earningsMap.get(comp.calculationBase)
                    : comp.code === 'EMPLOYEE_PF' || comp.code === 'PF'
                      ? basicAmount
                      : wage,
            percentage: comp.percentage,
            quantity: 1.0,
            amount,
            sequence: comp.sequence,
        });
    }

    // Calculate Employer Contributions
    let totalContributions = 0;
    for (const comp of employerContributions) {
        let amount = 0;
        if (comp.code === 'EMPLOYER_PF') {
            if (settings && settings.pfEnabled) {
                const pfRate = Number(settings.employerPfRate) || 12.0;
                amount = basicAmount * (pfRate / 100);
            }
        } else {
            if (comp.calculationType === 'fixed') {
                amount = Number(comp.fixedAmount) || 0;
            } else if (comp.calculationType === 'percentage_of_wage') {
                amount = wage * (Number(comp.percentage) / 100);
            } else if (comp.calculationType === 'percentage_of_component') {
                const baseAmount = earningsMap.get(comp.calculationBase) || 0;
                amount = baseAmount * (Number(comp.percentage) / 100);
            }
        }

        amount = Math.round(amount * 100) / 100;
        totalContributions += amount;

        calculated.push({
            componentDefinitionId: comp.componentDefinitionId,
            code: comp.code,
            name: comp.name,
            componentType: comp.componentType,
            calculationType: comp.calculationType,
            baseAmount:
                comp.calculationType === 'percentage_of_component'
                    ? earningsMap.get(comp.calculationBase)
                    : comp.code === 'EMPLOYER_PF'
                      ? basicAmount
                      : wage,
            percentage: comp.percentage,
            quantity: 1.0,
            amount,
            sequence: comp.sequence,
        });
    }

    return {
        lines: calculated,
        grossEarnings,
        totalEmployeeDeductions: Math.round(totalDeductions * 100) / 100,
        employerContributions: Math.round(totalContributions * 100) / 100,
    };
}

// ── Payroll Period Lifecycle Service ─────────────────────────────────────────

export async function processPayrollPeriod(periodId, _processedById) {
    return await db.transaction(async (tx) => {
        // 1. Fetch Payroll Period details
        const period = await payrollDao.getPayrollPeriodById(periodId, tx);
        if (!period) {
            throw new Error('Payroll period not found');
        }
        if (period.status === 'finalized' || period.status === 'paid') {
            throw new Error('Cannot process a finalized or paid payroll period');
        }

        // 2. Update status to processing
        await payrollDao.updatePayrollPeriod(periodId, { status: 'processing' }, tx);

        // 3. Clear existing draft payslips, lines, and summaries for this period
        await payrollDao.deletePayslipLinesByPeriod(periodId, tx);
        await payrollDao.deletePayslipAttendanceSummariesByPeriod(periodId, tx);
        await payrollDao.deletePayslipsByPeriod(periodId, tx);

        // 4. Get active organization settings
        let settings = await payrollDao.getPayrollSettings(period.organizationId, tx);
        if (!settings) {
            // Seed a default payroll settings if none exists
            settings = await payrollDao.createPayrollSettings(
                {
                    organizationId: period.organizationId,
                    payrollFrequency: 'MONTHLY',
                    payrollCurrency: 'INR',
                    payDay: 1,
                    workingDaysBasis: '22',
                    unpaidLeaveDeductionMethod: 'PROPORTIONAL_GROSS',
                    pfEnabled: true,
                    employeePfRate: '12.00',
                    employerPfRate: '12.00',
                    professionalTaxEnabled: true,
                    professionalTaxAmount: '200.00',
                },
                tx,
            );
        }

        // 5. Fetch all active employees of the organization
        const activeEmployees = await tx
            .select()
            .from(employees)
            .where(
                and(
                    eq(employees.organizationId, period.organizationId),
                    sql`${employees.deletedAt} IS NULL`,
                ),
            );

        const workingDaysBasis = Number(settings.workingDaysBasis) || 22;

        // 6. Loop and calculate payslip details for each employee
        for (const emp of activeEmployees) {
            // Get employee active salary structure
            const salaryStructure = await payrollDao.getSalaryStructureByEmployeeId(emp.id, tx);
            if (!salaryStructure) {
                // Skip employees without salary structures configured
                continue;
            }

            const monthlyWage = Number(salaryStructure.monthlyWage);

            // Calculate attendance & leave summary
            const summary = await calculateAttendanceSummary(
                emp.id,
                period.organizationId,
                period.periodStart,
                period.periodEnd,
                tx,
            );

            // Calculate base earning and deduction lines
            const { lines, grossEarnings, totalEmployeeDeductions, employerContributions } =
                calculateSalaryComponents(monthlyWage, salaryStructure.components, settings);

            // Calculate unpaid days deduction
            // Daily rate = monthlyWage / workingDaysBasis
            const dailyRate = monthlyWage / workingDaysBasis;
            const unpaidDeduction = Math.round(dailyRate * summary.unpaidDays * 100) / 100;

            // Final Net Pay = gross - total deductions - unpaid deduction
            const netPay = Math.max(
                0,
                Math.round((grossEarnings - totalEmployeeDeductions - unpaidDeduction) * 100) / 100,
            );

            // Insert Payslip
            const payslip = await payrollDao.createPayslip(
                {
                    payrollPeriodId: periodId,
                    employeeId: emp.id,
                    salaryStructureId: salaryStructure.id,
                    monthlyWage: String(monthlyWage),
                    workingDays: String(summary.scheduledDays),
                    payableDays: String(summary.payableDays),
                    paidLeaveDays: String(summary.paidLeaveDays),
                    unpaidLeaveDays: String(summary.unpaidLeaveDays),
                    absentDays: String(summary.absentDays),
                    halfDaysCount: String(summary.halfDays),
                    grossEarnings: String(grossEarnings),
                    totalEmployeeDeductions: String(totalEmployeeDeductions),
                    employerContributions: String(employerContributions),
                    unpaidDeduction: String(unpaidDeduction),
                    netPay: String(netPay),
                    status: 'calculated',
                    generatedAt: new Date(),
                },
                tx,
            );

            // Insert Payslip Lines
            const linesData = lines.map((line) => ({
                payslipId: payslip.id,
                componentCode: line.code,
                componentName: line.name,
                componentType: line.componentType,
                calculationType: line.calculationType,
                baseAmount: String(line.baseAmount),
                percentage: line.percentage ? String(line.percentage) : null,
                quantity: String(line.quantity),
                amount: String(line.amount),
                sequence: line.sequence,
            }));

            if (unpaidDeduction > 0) {
                // Record the unpaid day deduction in payslip lines as a separate deduction
                linesData.push({
                    payslipId: payslip.id,
                    componentCode: 'UNPAID_DEDUCTION',
                    componentName: 'Unpaid Days Deduction',
                    componentType: 'employee_deduction',
                    calculationType: 'fixed',
                    baseAmount: String(monthlyWage),
                    percentage: null,
                    quantity: String(summary.unpaidDays),
                    amount: String(unpaidDeduction),
                    sequence: 99,
                });
            }

            await payrollDao.createPayslipLines(linesData, tx);

            // Insert Payslip Attendance Summary
            await payrollDao.createPayslipAttendanceSummary(
                {
                    payslipId: payslip.id,
                    totalCalendarDays: summary.totalCalendarDays,
                    scheduledDays: String(summary.scheduledDays),
                    presentDays: String(summary.presentDays),
                    paidLeaveDays: String(summary.paidLeaveDays),
                    unpaidLeaveDays: String(summary.unpaidLeaveDays),
                    absentDays: String(summary.absentDays),
                    halfDays: String(summary.halfDays),
                    holidayDays: String(summary.holidayDays),
                    weekendDays: String(summary.weekendDays),
                    payableDays: String(summary.payableDays),
                    workingMinutes: summary.workingMinutes,
                    overtimeMinutes: summary.overtimeMinutes,
                },
                tx,
            );
        }

        // 7. Update Period Status to calculated
        return await payrollDao.updatePayrollPeriod(
            periodId,
            {
                status: 'calculated',
                processedAt: new Date(),
            },
            tx,
        );
    });
}

export async function finalizePayrollPeriod(periodId, _finalizedById) {
    return await db.transaction(async (tx) => {
        const period = await payrollDao.getPayrollPeriodById(periodId, tx);
        if (!period) {
            throw new Error('Payroll period not found');
        }
        if (period.status !== 'calculated' && period.status !== 'processing') {
            throw new Error('Only calculated or processing payroll periods can be finalized');
        }

        // Lock period to finalized
        const updatedPeriod = await payrollDao.updatePayrollPeriod(
            periodId,
            {
                status: 'finalized',
                finalizedAt: new Date(),
            },
            tx,
        );

        // Update all related payslips status to finalized
        await tx
            .update(payslips)
            .set({ status: 'finalized', finalizedAt: new Date() })
            .where(eq(payslips.payrollPeriodId, periodId));

        return updatedPeriod;
    });
}

// ── Payslip PDF Generation ──────────────────────────────────────────────────

export async function getPayslipPdfBuffer(payslipId) {
    const payslip = await payrollDao.getPayslipById(payslipId);
    if (!payslip) {
        throw new Error('Payslip not found');
    }

    const employee = await employeeDao.getEmployeeById(payslip.employeeId, true);
    const lines = await payrollDao.getPayslipLines(payslipId);
    const attendanceSummary = await payrollDao.getPayslipAttendanceSummary(payslipId);
    const period = await payrollDao.getPayrollPeriodById(payslip.payrollPeriodId);

    const [org] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, period.organizationId));

    // Generate HTML via template
    const html = payslipTemplate({
        payslip,
        lines,
        attendanceSummary,
        employee,
        organization: org,
        period,
    });

    // Render PDF Buffer using HTML-to-PDF Service wrapper makePDF
    return await makePDF({ html });
}

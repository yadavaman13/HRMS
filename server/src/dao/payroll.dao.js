import { db } from '../config/database.config.js';
import {
    payrollSettings,
    salaryComponentDefinitions,
    salaryStructures,
    salaryStructureComponents,
    payrollPeriods,
    payslips,
    payslipLines,
    payslipAttendanceSummary,
    employees,
} from '../db/schema/schema.js';
import { eq, and, sql } from 'drizzle-orm';

// ── Payroll Settings ─────────────────────────────────────────────────────────

export async function getPayrollSettings(organizationId, tx) {
    const client = tx || db;
    const [settings] = await client
        .select()
        .from(payrollSettings)
        .where(eq(payrollSettings.organizationId, organizationId));
    return settings || null;
}

export async function createPayrollSettings(data, tx) {
    const client = tx || db;
    const [settings] = await client.insert(payrollSettings).values(data).returning();
    return settings;
}

export async function updatePayrollSettings(organizationId, data, tx) {
    const client = tx || db;
    const [settings] = await client
        .update(payrollSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(payrollSettings.organizationId, organizationId))
        .returning();
    return settings || null;
}

// ── Salary Component Definitions ─────────────────────────────────────────────

export async function getComponentDefinitionById(id, tx) {
    const client = tx || db;
    const [definition] = await client
        .select()
        .from(salaryComponentDefinitions)
        .where(eq(salaryComponentDefinitions.id, id));
    return definition || null;
}

export async function getComponentDefinitionByCode(organizationId, code, tx) {
    const client = tx || db;
    const [definition] = await client
        .select()
        .from(salaryComponentDefinitions)
        .where(
            and(
                eq(salaryComponentDefinitions.organizationId, organizationId),
                eq(salaryComponentDefinitions.code, code),
            ),
        );
    return definition || null;
}

export async function listComponentDefinitions(organizationId, tx) {
    const client = tx || db;
    return await client
        .select()
        .from(salaryComponentDefinitions)
        .where(
            and(
                eq(salaryComponentDefinitions.organizationId, organizationId),
                eq(salaryComponentDefinitions.isActive, true),
            ),
        )
        .orderBy(salaryComponentDefinitions.code);
}

export async function createComponentDefinition(data, tx) {
    const client = tx || db;
    const [definition] = await client.insert(salaryComponentDefinitions).values(data).returning();
    return definition;
}

export async function updateComponentDefinition(id, data, tx) {
    const client = tx || db;
    const [definition] = await client
        .update(salaryComponentDefinitions)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(salaryComponentDefinitions.id, id))
        .returning();
    return definition || null;
}

export async function deleteComponentDefinition(id, tx) {
    const client = tx || db;
    const [definition] = await client
        .update(salaryComponentDefinitions)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(salaryComponentDefinitions.id, id))
        .returning();
    return definition || null;
}

// ── Salary Structures ────────────────────────────────────────────────────────

export async function getSalaryStructureByEmployeeId(employeeId, tx) {
    const client = tx || db;
    const [structure] = await client
        .select()
        .from(salaryStructures)
        .where(
            and(eq(salaryStructures.employeeId, employeeId), eq(salaryStructures.status, 'ACTIVE')),
        );
    if (!structure) return null;

    const components = await client
        .select({
            id: salaryStructureComponents.id,
            salaryStructureId: salaryStructureComponents.salaryStructureId,
            componentDefinitionId: salaryStructureComponents.componentDefinitionId,
            calculationType: salaryStructureComponents.calculationType,
            calculationBase: salaryStructureComponents.calculationBase,
            percentage: salaryStructureComponents.percentage,
            fixedAmount: salaryStructureComponents.fixedAmount,
            sequence: salaryStructureComponents.sequence,
            isResidual: salaryStructureComponents.isResidual,
            code: salaryComponentDefinitions.code,
            name: salaryComponentDefinitions.name,
            componentType: salaryComponentDefinitions.componentType,
        })
        .from(salaryStructureComponents)
        .innerJoin(
            salaryComponentDefinitions,
            eq(salaryStructureComponents.componentDefinitionId, salaryComponentDefinitions.id),
        )
        .where(eq(salaryStructureComponents.salaryStructureId, structure.id))
        .orderBy(salaryStructureComponents.sequence);

    return {
        ...structure,
        components,
    };
}

export async function createSalaryStructure(data, tx) {
    const client = tx || db;
    const [structure] = await client.insert(salaryStructures).values(data).returning();
    return structure;
}

export async function updateSalaryStructure(id, data, tx) {
    const client = tx || db;
    const [structure] = await client
        .update(salaryStructures)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(salaryStructures.id, id))
        .returning();
    return structure || null;
}

export async function createSalaryStructureComponents(components, tx) {
    if (!components || components.length === 0) return [];
    const client = tx || db;
    return await client.insert(salaryStructureComponents).values(components).returning();
}

export async function deleteSalaryStructureComponents(salaryStructureId, tx) {
    const client = tx || db;
    return await client
        .delete(salaryStructureComponents)
        .where(eq(salaryStructureComponents.salaryStructureId, salaryStructureId))
        .returning();
}

// ── Payroll Periods ──────────────────────────────────────────────────────────

export async function getPayrollPeriodById(id, tx) {
    const client = tx || db;
    const [period] = await client.select().from(payrollPeriods).where(eq(payrollPeriods.id, id));
    return period || null;
}

export async function listPayrollPeriods(organizationId, tx) {
    const client = tx || db;
    return await client
        .select()
        .from(payrollPeriods)
        .where(eq(payrollPeriods.organizationId, organizationId))
        .orderBy(sql`${payrollPeriods.periodStart} DESC`);
}

export async function createPayrollPeriod(data, tx) {
    const client = tx || db;
    const [period] = await client.insert(payrollPeriods).values(data).returning();
    return period;
}

export async function updatePayrollPeriod(id, data, tx) {
    const client = tx || db;
    const [period] = await client
        .update(payrollPeriods)
        .set(data)
        .where(eq(payrollPeriods.id, id))
        .returning();
    return period || null;
}

// ── Payslips ─────────────────────────────────────────────────────────────────

export async function getPayslipById(id, tx) {
    const client = tx || db;
    const [payslip] = await client.select().from(payslips).where(eq(payslips.id, id));
    return payslip || null;
}

export async function getPayslipByEmployeeAndPeriod(employeeId, payrollPeriodId, tx) {
    const client = tx || db;
    const [payslip] = await client
        .select()
        .from(payslips)
        .where(
            and(eq(payslips.employeeId, employeeId), eq(payslips.payrollPeriodId, payrollPeriodId)),
        );
    return payslip || null;
}

export async function listPayslipsByPeriod(payrollPeriodId, tx) {
    const client = tx || db;
    return await client
        .select({
            id: payslips.id,
            employeeId: payslips.employeeId,
            payrollPeriodId: payslips.payrollPeriodId,
            salaryStructureId: payslips.salaryStructureId,
            monthlyWage: payslips.monthlyWage,
            workingDays: payslips.workingDays,
            payableDays: payslips.payableDays,
            paidLeaveDays: payslips.paidLeaveDays,
            unpaidLeaveDays: payslips.unpaidLeaveDays,
            absentDays: payslips.absentDays,
            halfDaysCount: payslips.halfDaysCount,
            grossEarnings: payslips.grossEarnings,
            totalEmployeeDeductions: payslips.totalEmployeeDeductions,
            employerContributions: payslips.employerContributions,
            unpaidDeduction: payslips.unpaidDeduction,
            netPay: payslips.netPay,
            status: payslips.status,
            generatedAt: payslips.generatedAt,
            finalizedAt: payslips.finalizedAt,
            firstName: employees.firstName,
            lastName: employees.lastName,
            employeeCode: employees.employeeCode,
        })
        .from(payslips)
        .innerJoin(employees, eq(payslips.employeeId, employees.id))
        .where(eq(payslips.payrollPeriodId, payrollPeriodId))
        .orderBy(employees.firstName);
}

export async function listPayslipsByEmployee(employeeId, tx) {
    const client = tx || db;
    return await client
        .select({
            id: payslips.id,
            payrollPeriodId: payslips.payrollPeriodId,
            monthlyWage: payslips.monthlyWage,
            grossEarnings: payslips.grossEarnings,
            totalEmployeeDeductions: payslips.totalEmployeeDeductions,
            unpaidDeduction: payslips.unpaidDeduction,
            netPay: payslips.netPay,
            status: payslips.status,
            periodStart: payrollPeriods.periodStart,
            periodEnd: payrollPeriods.periodEnd,
        })
        .from(payslips)
        .innerJoin(payrollPeriods, eq(payslips.payrollPeriodId, payrollPeriods.id))
        .where(eq(payslips.employeeId, employeeId))
        .orderBy(sql`${payrollPeriods.periodStart} DESC`);
}

export async function createPayslip(data, tx) {
    const client = tx || db;
    const [payslip] = await client.insert(payslips).values(data).returning();
    return payslip;
}

export async function updatePayslip(id, data, tx) {
    const client = tx || db;
    const [payslip] = await client
        .update(payslips)
        .set(data)
        .where(eq(payslips.id, id))
        .returning();
    return payslip || null;
}

export async function deletePayslipsByPeriod(payrollPeriodId, tx) {
    const client = tx || db;
    return await client.delete(payslips).where(eq(payslips.payrollPeriodId, payrollPeriodId));
}

// ── Payslip Lines ────────────────────────────────────────────────────────────

export async function createPayslipLines(lines, tx) {
    if (!lines || lines.length === 0) return [];
    const client = tx || db;
    return await client.insert(payslipLines).values(lines).returning();
}

export async function getPayslipLines(payslipId, tx) {
    const client = tx || db;
    return await client
        .select()
        .from(payslipLines)
        .where(eq(payslipLines.payslipId, payslipId))
        .orderBy(payslipLines.sequence);
}

export async function deletePayslipLinesByPeriod(payrollPeriodId, tx) {
    const client = tx || db;
    return await client.execute(sql`
        DELETE FROM ${payslipLines}
        WHERE ${payslipLines.payslipId} IN (
            SELECT id FROM ${payslips}
            WHERE ${payslips.payrollPeriodId} = ${payrollPeriodId}
        )
    `);
}

// ── Payslip Attendance Summary ────────────────────────────────────────────────

export async function createPayslipAttendanceSummary(data, tx) {
    const client = tx || db;
    const [summary] = await client.insert(payslipAttendanceSummary).values(data).returning();
    return summary;
}

export async function getPayslipAttendanceSummary(payslipId, tx) {
    const client = tx || db;
    const [summary] = await client
        .select()
        .from(payslipAttendanceSummary)
        .where(eq(payslipAttendanceSummary.payslipId, payslipId));
    return summary || null;
}

export async function deletePayslipAttendanceSummariesByPeriod(payrollPeriodId, tx) {
    const client = tx || db;
    return await client.execute(sql`
        DELETE FROM ${payslipAttendanceSummary}
        WHERE ${payslipAttendanceSummary.payslipId} IN (
            SELECT id FROM ${payslips}
            WHERE ${payslips.payrollPeriodId} = ${payrollPeriodId}
        )
    `);
}

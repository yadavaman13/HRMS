import { eq } from 'drizzle-orm';
import {
    pgTable,
    uuid,
    varchar,
    boolean,
    integer,
    numeric,
    date,
    timestamp,
    index,
    uniqueIndex,
} from 'drizzle-orm/pg-core';
import {
    wageTypeEnum,
    salaryComponentTypeEnum,
    salaryCalculationTypeEnum,
    payrollPeriodStatusEnum,
    payslipStatusEnum,
} from './enums.js';
import { organizations } from './organizations.schema.js';
import { employees } from './employees.schema.js';
import { users } from './users.schema.js';

export const payrollSettings = pgTable('payroll_settings', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
        .notNull()
        .unique()
        .references(() => organizations.id, { onDelete: 'cascade' }),
    payrollFrequency: varchar('payroll_frequency', { length: 20 }).notNull().default('MONTHLY'),
    payrollCurrency: varchar('payroll_currency', { length: 3 }).notNull().default('INR'),
    payDay: integer('pay_day').notNull().default(1),
    workingDaysBasis: numeric('working_days_basis', { precision: 5, scale: 2 })
        .notNull()
        .default('22'),
    unpaidLeaveDeductionMethod: varchar('unpaid_leave_deduction_method', {
        length: 50,
    })
        .notNull()
        .default('PROPORTIONAL_GROSS'),
    pfEnabled: boolean('pf_enabled').notNull().default(true),
    employeePfRate: numeric('employee_pf_rate', { precision: 5, scale: 2 })
        .notNull()
        .default('12.00'),
    employerPfRate: numeric('employer_pf_rate', { precision: 5, scale: 2 })
        .notNull()
        .default('12.00'),
    professionalTaxEnabled: boolean('professional_tax_enabled').notNull().default(true),
    professionalTaxAmount: numeric('professional_tax_amount', {
        precision: 12,
        scale: 2,
    })
        .notNull()
        .default('200.00'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const salaryComponentDefinitions = pgTable(
    'salary_component_definitions',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        organizationId: uuid('organization_id')
            .notNull()
            .references(() => organizations.id, { onDelete: 'cascade' }),
        code: varchar('code', { length: 50 }).notNull(),
        name: varchar('name', { length: 255 }).notNull(),
        componentType: salaryComponentTypeEnum('component_type').notNull(),
        calculationType: salaryCalculationTypeEnum('calculation_type').notNull(),
        calculationBase: varchar('calculation_base', { length: 50 }),
        isActive: boolean('is_active').notNull().default(true),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            orgCodeIdx: uniqueIndex('component_def_org_code_idx').on(
                table.organizationId,
                table.code,
            ),
        };
    },
);

export const salaryStructures = pgTable(
    'salary_structures',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        employeeId: uuid('employee_id')
            .notNull()
            .references(() => employees.id, { onDelete: 'cascade' }),
        monthlyWage: numeric('monthly_wage', { precision: 12, scale: 2 }).notNull(),
        wageType: wageTypeEnum('wage_type').notNull().default('fixed'),
        effectiveFrom: date('effective_from').notNull(),
        effectiveTo: date('effective_to'),
        status: varchar('status', { length: 20 }).notNull().default('ACTIVE'),
        createdBy: uuid('created_by')
            .notNull()
            .references(() => users.id),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            empActiveIdx: index('salary_structures_emp_active_idx')
                .on(table.employeeId)
                .where(eq(table.status, 'ACTIVE')),
            empEffectiveIdx: index('salary_structures_emp_effective_idx').on(
                table.employeeId,
                table.effectiveFrom,
            ),
        };
    },
);

export const salaryStructureComponents = pgTable(
    'salary_structure_components',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        salaryStructureId: uuid('salary_structure_id')
            .notNull()
            .references(() => salaryStructures.id, { onDelete: 'cascade' }),
        componentDefinitionId: uuid('component_definition_id')
            .notNull()
            .references(() => salaryComponentDefinitions.id, {
                onDelete: 'restrict',
            }),
        calculationType: salaryCalculationTypeEnum('calculation_type').notNull(),
        calculationBase: varchar('calculation_base', { length: 50 }),
        percentage: numeric('percentage', { precision: 6, scale: 3 }),
        fixedAmount: numeric('fixed_amount', { precision: 12, scale: 2 }).default('0.00'),
        sequence: integer('sequence').notNull().default(0),
        isResidual: boolean('is_residual').notNull().default(false),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            structCompIdx: uniqueIndex('structure_component_idx').on(
                table.salaryStructureId,
                table.componentDefinitionId,
            ),
        };
    },
);

export const payrollPeriods = pgTable(
    'payroll_periods',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        organizationId: uuid('organization_id')
            .notNull()
            .references(() => organizations.id, { onDelete: 'cascade' }),
        periodStart: date('period_start').notNull(),
        periodEnd: date('period_end').notNull(),
        status: payrollPeriodStatusEnum('status').notNull().default('draft'),
        processedAt: timestamp('processed_at', { withTimezone: true }),
        finalizedAt: timestamp('finalized_at', { withTimezone: true }),
        createdBy: uuid('created_by')
            .notNull()
            .references(() => users.id),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            orgPeriodIdx: uniqueIndex('payroll_period_org_period_idx').on(
                table.organizationId,
                table.periodStart,
                table.periodEnd,
            ),
            orgStatusIdx: index('payroll_periods_org_status_idx').on(
                table.organizationId,
                table.status,
            ),
        };
    },
);

export const payslips = pgTable(
    'payslips',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        payrollPeriodId: uuid('payroll_period_id')
            .notNull()
            .references(() => payrollPeriods.id, { onDelete: 'restrict' }),
        employeeId: uuid('employee_id')
            .notNull()
            .references(() => employees.id, { onDelete: 'restrict' }),
        salaryStructureId: uuid('salary_structure_id')
            .notNull()
            .references(() => salaryStructures.id, { onDelete: 'restrict' }),
        monthlyWage: numeric('monthly_wage', { precision: 12, scale: 2 }).notNull(),
        workingDays: numeric('working_days', { precision: 5, scale: 2 }).notNull().default('0'),
        payableDays: numeric('payable_days', { precision: 5, scale: 2 }).notNull().default('0'),
        paidLeaveDays: numeric('paid_leave_days', { precision: 5, scale: 2 })
            .notNull()
            .default('0'),
        unpaidLeaveDays: numeric('unpaid_leave_days', { precision: 5, scale: 2 })
            .notNull()
            .default('0'),
        absentDays: numeric('absent_days', { precision: 5, scale: 2 }).notNull().default('0'),
        halfDaysCount: numeric('half_days_count', { precision: 3, scale: 1 })
            .notNull()
            .default('0'),
        grossEarnings: numeric('gross_earnings', { precision: 12, scale: 2 })
            .notNull()
            .default('0'),
        totalEmployeeDeductions: numeric('total_employee_deductions', {
            precision: 12,
            scale: 2,
        })
            .notNull()
            .default('0'),
        employerContributions: numeric('employer_contributions', {
            precision: 12,
            scale: 2,
        })
            .notNull()
            .default('0'),
        unpaidDeduction: numeric('unpaid_deduction', { precision: 12, scale: 2 })
            .notNull()
            .default('0'),
        netPay: numeric('net_pay', { precision: 12, scale: 2 }).notNull().default('0'),
        status: payslipStatusEnum('status').notNull().default('draft'),
        generatedAt: timestamp('generated_at', { withTimezone: true }),
        finalizedAt: timestamp('finalized_at', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            empPeriodIdx: uniqueIndex('payslips_emp_period_idx').on(
                table.employeeId,
                table.payrollPeriodId,
            ),
            periodIdx: index('payslips_period_idx').on(table.payrollPeriodId),
            statusIdx: index('payslips_status_idx').on(table.payrollPeriodId, table.status),
        };
    },
);

export const payslipLines = pgTable(
    'payslip_lines',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        payslipId: uuid('payslip_id')
            .notNull()
            .references(() => payslips.id, { onDelete: 'cascade' }),
        componentCode: varchar('component_code', { length: 50 }).notNull(),
        componentName: varchar('component_name', { length: 255 }).notNull(),
        componentType: salaryComponentTypeEnum('component_type').notNull(),
        calculationType: salaryCalculationTypeEnum('calculation_type').notNull(),
        baseAmount: numeric('base_amount', { precision: 12, scale: 2 }).default('0.00'),
        percentage: numeric('percentage', { precision: 6, scale: 3 }),
        quantity: numeric('quantity', { precision: 6, scale: 2 }).default('1.00'),
        amount: numeric('amount', { precision: 12, scale: 2 }).notNull().default('0.00'),
        sequence: integer('sequence').notNull().default(0),
    },
    (table) => {
        return {
            payslipIdx: index('payslip_lines_payslip_idx').on(table.payslipId),
            typeIdx: index('payslip_lines_type_idx').on(table.payslipId, table.componentType),
        };
    },
);

export const payslipAttendanceSummary = pgTable('payslip_attendance_summary', {
    payslipId: uuid('payslip_id')
        .primaryKey()
        .references(() => payslips.id, { onDelete: 'cascade' }),
    totalCalendarDays: integer('total_calendar_days').notNull().default(0),
    scheduledDays: numeric('scheduled_days', { precision: 5, scale: 2 }).notNull().default('0'),
    presentDays: numeric('present_days', { precision: 5, scale: 2 }).notNull().default('0'),
    paidLeaveDays: numeric('paid_leave_days', { precision: 5, scale: 2 }).notNull().default('0'),
    unpaidLeaveDays: numeric('unpaid_leave_days', { precision: 5, scale: 2 })
        .notNull()
        .default('0'),
    absentDays: numeric('absent_days', { precision: 5, scale: 2 }).notNull().default('0'),
    halfDays: numeric('half_days', { precision: 3, scale: 1 }).notNull().default('0'),
    holidayDays: numeric('holiday_days', { precision: 3, scale: 1 }).notNull().default('0'),
    weekendDays: numeric('weekend_days', { precision: 3, scale: 1 }).notNull().default('0'),
    payableDays: numeric('payable_days', { precision: 5, scale: 2 }).notNull().default('0'),
    workingMinutes: integer('working_minutes').notNull().default(0),
    overtimeMinutes: integer('overtime_minutes').notNull().default(0),
});

import {
    pgTable,
    uuid,
    text,
    varchar,
    boolean,
    numeric,
    date,
    timestamp,
    index,
    uniqueIndex,
} from 'drizzle-orm/pg-core';
import {
    leaveUnitEnum,
    leaveHalfEnum,
    leaveStatusEnum,
    leaveTransactionTypeEnum,
} from './enums.js';
import { organizations } from './organizations.schema.js';
import { employees } from './employees.schema.js';
import { users } from './users.schema.js';


export const leaveTypes = pgTable(
    'leave_types',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        organizationId: uuid('organization_id')
            .notNull()
            .references(() => organizations.id, { onDelete: 'cascade' }),
        code: varchar('code', { length: 20 }).notNull(),
        name: varchar('name', { length: 255 }).notNull(),
        isPaid: boolean('is_paid').notNull().default(true),
        requiresAllocation: boolean('requires_allocation').notNull().default(true),
        requiresAttachment: boolean('requires_attachment').notNull().default(false),
        requiresApproval: boolean('requires_approval').notNull().default(true),
        unit: leaveUnitEnum('unit').notNull().default('day'),
        isActive: boolean('is_active').notNull().default(true),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            orgCodeIdx: uniqueIndex('leave_types_org_code_idx').on(
                table.organizationId,
                table.code,
            ),
        };
    },
);

export const leaveAllocations = pgTable(
    'leave_allocations',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        employeeId: uuid('employee_id')
            .notNull()
            .references(() => employees.id, { onDelete: 'cascade' }),
        leaveTypeId: uuid('leave_type_id')
            .notNull()
            .references(() => leaveTypes.id, { onDelete: 'restrict' }),
        periodStart: date('period_start').notNull(),
        periodEnd: date('period_end').notNull(),
        allocatedDays: numeric('allocated_days', { precision: 6, scale: 2 }).notNull(),
        carriedForwardDays: numeric('carried_forward_days', {
            precision: 6,
            scale: 2,
        })
            .notNull()
            .default('0'),
        createdBy: uuid('created_by')
            .notNull()
            .references(() => users.id),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            empTypeIdx: index('leave_allocations_emp_type_idx').on(
                table.employeeId,
                table.leaveTypeId,
            ),
            periodIdx: index('leave_allocations_period_idx').on(
                table.employeeId,
                table.periodStart,
                table.periodEnd,
            ),
        };
    },
);

export const leaveRequests = pgTable(
    'leave_requests',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        employeeId: uuid('employee_id')
            .notNull()
            .references(() => employees.id, { onDelete: 'cascade' }),
        leaveTypeId: uuid('leave_type_id')
            .notNull()
            .references(() => leaveTypes.id, { onDelete: 'restrict' }),
        startDate: date('start_date').notNull(),
        endDate: date('end_date').notNull(),
        startHalf: leaveHalfEnum('start_half').notNull().default('none'),
        endHalf: leaveHalfEnum('end_half').notNull().default('none'),
        requestedDays: numeric('requested_days', { precision: 5, scale: 1 }).notNull(),
        reason: text('reason'),
        status: leaveStatusEnum('status').notNull().default('draft'),
        attachmentUrl: text('attachment_url'),
        submittedAt: timestamp('submitted_at', { withTimezone: true }),
        approvedAt: timestamp('approved_at', { withTimezone: true }),
        rejectedAt: timestamp('rejected_at', { withTimezone: true }),
        approvedBy: uuid('approved_by').references(() => users.id),
        rejectedBy: uuid('rejected_by').references(() => users.id),
        hrComment: text('hr_comment'),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            empStatusIdx: index('leave_requests_emp_status_idx').on(
                table.employeeId,
                table.status,
            ),
            datesIdx: index('leave_requests_dates_idx').on(
                table.startDate,
                table.endDate,
            ),
            pendingIdx: index('leave_requests_pending_idx')
                .on(table.employeeId)
                .where(table.status.eq('pending')),
        };
    },
);

export const leaveBalanceTransactions = pgTable(
    'leave_balance_transactions',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        employeeId: uuid('employee_id')
            .notNull()
            .references(() => employees.id, { onDelete: 'cascade' }),
        leaveTypeId: uuid('leave_type_id')
            .notNull()
            .references(() => leaveTypes.id, { onDelete: 'restrict' }),
        transactionType: leaveTransactionTypeEnum('transaction_type').notNull(),
        days: numeric('days', { precision: 6, scale: 2 }).notNull(),
        referenceType: varchar('reference_type', { length: 50 }),
        referenceId: uuid('reference_id'),
        description: text('description'),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            empTypeIdx: index('leave_transactions_emp_type_idx').on(
                table.employeeId,
                table.leaveTypeId,
            ),
            refIdx: index('leave_transactions_ref_idx').on(
                table.referenceType,
                table.referenceId,
            ),
        };
    },
);


import {
    pgTable,
    uuid,
    text,
    integer,
    jsonb,
    date,
    timestamp,
    index,
    uniqueIndex,
} from 'drizzle-orm/pg-core';
import {
    attendanceStatusEnum,
    attendanceSourceEnum,
    adjustmentStatusEnum,
} from './enums.js';
import { employees } from './employees.schema.js';
import { users } from './users.schema.js';

export const attendanceRecords = pgTable(
    'attendance_records',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        employeeId: uuid('employee_id')
            .notNull()
            .references(() => employees.id, { onDelete: 'cascade' }),
        attendanceDate: date('attendance_date').notNull(),
        status: attendanceStatusEnum('status').notNull().default('absent'),
        totalWorkMinutes: integer('total_work_minutes').notNull().default(0),
        scheduledWorkMinutes: integer('scheduled_work_minutes').notNull().default(0),
        overtimeMinutes: integer('overtime_minutes').notNull().default(0),
        lateMinutes: integer('late_minutes').notNull().default(0),
        earlyCheckoutMinutes: integer('early_checkout_minutes').notNull().default(0),
        remarks: text('remarks'),
        source: attendanceSourceEnum('source').notNull().default('system'),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            empDateIdx: uniqueIndex('attendance_emp_date_idx').on(
                table.employeeId,
                table.attendanceDate,
            ),
            empStatusIdx: index('attendance_emp_status_idx').on(
                table.employeeId,
                table.status,
            ),
            dateStatusIdx: index('attendance_date_status_idx').on(
                table.attendanceDate,
                table.status,
            ),
        };
    },
);

export const attendanceSessions = pgTable(
    'attendance_sessions',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        attendanceRecordId: uuid('attendance_record_id')
            .notNull()
            .references(() => attendanceRecords.id, { onDelete: 'cascade' }),
        checkInAt: timestamp('check_in_at', { withTimezone: true }).notNull(),
        checkOutAt: timestamp('check_out_at', { withTimezone: true }),
        workedMinutes: integer('worked_minutes'),
        breakMinutes: integer('break_minutes').notNull().default(0),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            recordIdx: index('attendance_sessions_record_idx').on(
                table.attendanceRecordId,
            ),
            checkinIdx: index('attendance_sessions_checkin_idx').on(table.checkInAt),
        };
    },
);

export const attendanceAdjustments = pgTable(
    'attendance_adjustments',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        attendanceRecordId: uuid('attendance_record_id')
            .notNull()
            .references(() => attendanceRecords.id, { onDelete: 'cascade' }),
        requestedBy: uuid('requested_by')
            .notNull()
            .references(() => users.id),
        approvedBy: uuid('approved_by').references(() => users.id),
        oldValue: jsonb('old_value').notNull(),
        newValue: jsonb('new_value').notNull(),
        reason: text('reason').notNull(),
        status: adjustmentStatusEnum('status').notNull().default('pending'),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            recordIdx: index('adjustments_record_idx').on(table.attendanceRecordId),
        };
    },
);
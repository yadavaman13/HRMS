import {
    pgTable,
    uuid,
    text,
    varchar,
    integer,
    boolean,
    date,
    time,
    timestamp,
    index,
    uniqueIndex,
} from 'drizzle-orm/pg-core';
import { organizations } from './organizations.schema.js';
import { employees } from './employees.schema.js';

export const workSchedules = pgTable(
    'work_schedules',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        organizationId: uuid('organization_id')
            .notNull()
            .references(() => organizations.id, { onDelete: 'cascade' }),
        name: varchar('name', { length: 255 }).notNull(),
        timezone: varchar('timezone', { length: 50 }).notNull().default('Asia/Kolkata'),
        isActive: boolean('is_active').notNull().default(true),
        defaultBreakMinutes: integer('default_break_minutes').notNull().default(60),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            orgIdx: index('work_schedules_org_idx').on(table.organizationId),
        };
    },
);

export const workScheduleDays = pgTable(
    'work_schedule_days',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        scheduleId: uuid('schedule_id')
            .notNull()
            .references(() => workSchedules.id, { onDelete: 'cascade' }),
        weekday: integer('weekday').notNull(),
        isWorkingDay: boolean('is_working_day').notNull().default(true),
        startTime: time('start_time'),
        endTime: time('end_time'),
        breakMinutes: integer('break_minutes').notNull().default(0),
    },
    (table) => {
        return {
            scheduleDayIdx: uniqueIndex('schedule_day_idx').on(table.scheduleId, table.weekday),
        };
    },
);

export const employeeScheduleAssignments = pgTable(
    'employee_schedule_assignments',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        employeeId: uuid('employee_id')
            .notNull()
            .references(() => employees.id, { onDelete: 'cascade' }),
        scheduleId: uuid('schedule_id')
            .notNull()
            .references(() => workSchedules.id, { onDelete: 'restrict' }),
        effectiveFrom: date('effective_from').notNull(),
        effectiveTo: date('effective_to'),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            empEffectiveIdx: index('emp_sched_effective_idx').on(
                table.employeeId,
                table.effectiveFrom,
            ),
            empActiveIdx: index('emp_sched_active_idx')
                .on(table.employeeId)
                .where(table.effectiveTo.isNull()),
        };
    },
);

export const holidays = pgTable(
    'holidays',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        organizationId: uuid('organization_id')
            .notNull()
            .references(() => organizations.id, { onDelete: 'cascade' }),
        name: varchar('name', { length: 255 }).notNull(),
        holidayDate: date('holiday_date').notNull(),
        isOptional: boolean('is_optional').notNull().default(false),
        description: text('description'),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            orgDateIdx: uniqueIndex('holidays_org_date_idx').on(
                table.organizationId,
                table.holidayDate,
            ),
        };
    },
);

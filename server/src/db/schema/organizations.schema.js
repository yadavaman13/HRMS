import {
    pgTable,
    uuid,
    text,
    varchar,
    boolean,
    timestamp,
    index,
    uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema.js';

export const organizations = pgTable(
    'organizations',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        name: varchar('name', { length: 255 }).notNull(),
        code: varchar('code', { length: 10 }).notNull().unique(),
        logoUrl: text('logo_url'),
        email: varchar('email', { length: 255 }),
        phone: varchar('phone', { length: 20 }),
        address: text('address'),
        city: varchar('city', { length: 100 }),
        state: varchar('state', { length: 100 }),
        country: varchar('country', { length: 100 }).notNull().default('India'),
        postalCode: varchar('postal_code', { length: 20 }),
        timezone: varchar('timezone', { length: 50 }).notNull().default('Asia/Kolkata'),
        currency: varchar('currency', { length: 3 }).notNull().default('INR'),
        isActive: boolean('is_active').notNull().default(true),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            codeIdx: index('orgs_code_idx').on(table.code),
        };
    },
);

export const locations = pgTable(
    'locations',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        organizationId: uuid('organization_id')
            .notNull()
            .references(() => organizations.id, { onDelete: 'cascade' }),
        name: varchar('name', { length: 255 }).notNull(),
        address: text('address'),
        isActive: boolean('is_active').notNull().default(true),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            orgIdx: index('locations_org_idx').on(table.organizationId),
        };
    },
);

export const departments = pgTable(
    'departments',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        organizationId: uuid('organization_id')
            .notNull()
            .references(() => organizations.id, { onDelete: 'cascade' }),
        name: varchar('name', { length: 255 }).notNull(),
        code: varchar('code', { length: 50 }),
        managerEmployeeId: uuid('manager_employee_id'), // FK added via raw SQL migration (circular dependency with employees)
        isActive: boolean('is_active').notNull().default(true),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            orgCodeIdx: uniqueIndex('dept_org_code_idx').on(table.organizationId, table.code),
            orgIdx: index('departments_org_idx').on(table.organizationId),
        };
    },
);

export const jobPositions = pgTable(
    'job_positions',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        organizationId: uuid('organization_id')
            .notNull()
            .references(() => organizations.id, { onDelete: 'cascade' }),
        name: varchar('name', { length: 255 }).notNull(),
        description: text('description'),
        isActive: boolean('is_active').notNull().default(true),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            orgIdx: index('job_positions_org_idx').on(table.organizationId),
        };
    },
);

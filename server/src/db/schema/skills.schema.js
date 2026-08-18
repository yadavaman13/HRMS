import {
    pgTable,
    uuid,
    text,
    varchar,
    date,
    timestamp,
    index,
    uniqueIndex,
    primaryKey,
} from 'drizzle-orm/pg-core';
import { proficiencyEnum } from './enums.js';
import { organizations } from './organizations.schema.js';
import { employees } from './employees.schema.js';

export const skills = pgTable(
    'skills',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        organizationId: uuid('organization_id')
            .notNull()
            .references(() => organizations.id, { onDelete: 'cascade' }),
        name: varchar('name', { length: 255 }).notNull(),
    },
    (table) => {
        return {
            orgNameIdx: uniqueIndex('skills_org_name_idx').on(
                table.organizationId,
                table.name,
            ),
        };
    },
);

export const employeeSkills = pgTable(
    'employee_skills',
    {
        employeeId: uuid('employee_id')
            .notNull()
            .references(() => employees.id, { onDelete: 'cascade' }),
        skillId: uuid('skill_id')
            .notNull()
            .references(() => skills.id, { onDelete: 'cascade' }),
        proficiency: proficiencyEnum('proficiency').notNull().default('beginner'),
    },
    (table) => {
        return {
            pk: primaryKey({ columns: [table.employeeId, table.skillId] }),
        };
    },
);

export const certifications = pgTable(
    'certifications',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        employeeId: uuid('employee_id')
            .notNull()
            .references(() => employees.id, { onDelete: 'cascade' }),
        name: varchar('name', { length: 255 }).notNull(),
        issuer: varchar('issuer', { length: 255 }),
        issueDate: date('issue_date'),
        expiryDate: date('expiry_date'),
        certificateUrl: text('certificate_url'),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            empIdx: index('certifications_emp_idx').on(table.employeeId),
        };
    },
);
import {
    pgTable,
    uuid,
    text,
    varchar,
    integer,
    bigint,
    boolean,
    date,
    timestamp,
    index,
    uniqueIndex,
} from 'drizzle-orm/pg-core';
import { bytea } from './custom_types.js';
import {
    genderEnum,
    maritalStatusEnum,
    documentTypeEnum,
    employmentStatusEnum,
    employmentTypeEnum,
} from './enums.js';
import { organizations } from './organizations.schema.js';
import { departments, jobPositions, locations } from './organizations.schema.js';
import { users } from './users.schema.js';

export const employees = pgTable(
    'employees',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        organizationId: uuid('organization_id')
            .notNull()
            .references(() => organizations.id, { onDelete: 'cascade' }),
        userId: uuid('user_id')
            .unique()
            .references(() => users.id, { onDelete: 'set null' }),
        employeeCode: varchar('employee_code', { length: 20 }).notNull(),
        firstName: varchar('first_name', { length: 100 }).notNull(),
        middleName: varchar('middle_name', { length: 100 }),
        lastName: varchar('last_name', { length: 100 }),
        displayName: varchar('display_name', { length: 255 }),
        dateOfBirth: date('date_of_birth'),
        gender: genderEnum('gender'),
        phone: varchar('phone', { length: 20 }),
        workEmail: varchar('work_email', { length: 255 }),
        departmentId: uuid('department_id').references(() => departments.id, {
            onDelete: 'set null',
        }),
        jobPositionId: uuid('job_position_id').references(() => jobPositions.id, {
            onDelete: 'set null',
        }),
        managerId: uuid('manager_id'),
        locationId: uuid('location_id').references(() => locations.id, {
            onDelete: 'set null',
        }),
        joiningDate: date('joining_date').notNull(),
        terminationDate: date('termination_date'),
        employmentStatus: employmentStatusEnum('employment_status')
            .notNull()
            .default('active'),
        employmentType: employmentTypeEnum('employment_type')
            .notNull()
            .default('full_time'),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
        deletedAt: timestamp('deleted_at', { withTimezone: true }),
    },
    (table) => {
        return {
            orgCodeIdx: uniqueIndex('employees_org_code_idx').on(
                table.organizationId,
                table.employeeCode,
            ),
            orgIdx: index('employees_org_idx').on(table.organizationId),
            orgDeptIdx: index('employees_org_dept_idx').on(
                table.organizationId,
                table.departmentId,
            ),
            managerIdx: index('employees_manager_idx').on(table.managerId),
            statusIdx: index('employees_status_idx').on(
                table.organizationId,
                table.employmentStatus,
            ),
            joiningIdx: index('employees_joining_idx').on(
                table.organizationId,
                table.joiningDate,
            ),
            userIdx: index('employees_user_idx').on(table.userId),
        };
    },
);

export const employeePrivateInfo = pgTable(
    'employee_private_info',
    {
        employeeId: uuid('employee_id')
            .primaryKey()
            .references(() => employees.id, { onDelete: 'cascade' }),
        residentialAddress: text('residential_address'),
        personalEmail: varchar('personal_email', { length: 255 }),
        nationality: varchar('nationality', { length: 100 }),
        maritalStatus: maritalStatusEnum('marital_status'),
        emergencyContactName: varchar('emergency_contact_name', { length: 255 }),
        emergencyContactPhone: varchar('emergency_contact_phone', { length: 20 }),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
);

export const employeeBankAccounts = pgTable(
    'employee_bank_accounts',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        employeeId: uuid('employee_id')
            .notNull()
            .references(() => employees.id, { onDelete: 'cascade' }),
        accountHolderName: varchar('account_holder_name', { length: 255 }).notNull(),
        accountNumberEncrypted: bytea('account_number_encrypted').notNull(),
        bankName: varchar('bank_name', { length: 255 }).notNull(),
        ifscCode: varchar('ifsc_code', { length: 11 }).notNull(),
        isPrimary: boolean('is_primary').notNull().default(false),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            empIdx: index('bank_accounts_emp_idx').on(table.employeeId),
            primaryIdx: uniqueIndex('bank_accounts_primary_idx')
                .on(table.employeeId)
                .where(table.isPrimary.eq(true)),
        };
    },
);

export const employeeIdentifiers = pgTable(
    'employee_identifiers',
    {
        employeeId: uuid('employee_id')
            .primaryKey()
            .references(() => employees.id, { onDelete: 'cascade' }),
        panEncrypted: bytea('pan_encrypted'),
        uanEncrypted: bytea('uan_encrypted'),
        aadhaarEncrypted: bytea('aadhaar_encrypted'),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    },
);

export const employeeCodeSequences = pgTable(
    'employee_code_sequences',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        organizationId: uuid('organization_id')
            .notNull()
            .references(() => organizations.id, { onDelete: 'cascade' }),
        joiningYear: integer('joining_year').notNull(),
        lastSequence: integer('last_sequence').notNull().default(0),
    },
    (table) => {
        return {
            orgYearIdx: uniqueIndex('emp_code_seq_org_year_idx').on(
                table.organizationId,
                table.joiningYear,
            ),
        };
    },
);

export const employeeDocuments = pgTable(
    'employee_documents',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        employeeId: uuid('employee_id')
            .notNull()
            .references(() => employees.id, { onDelete: 'cascade' }),
        documentType: documentTypeEnum('document_type').notNull(),
        fileName: varchar('file_name', { length: 255 }).notNull(),
        fileUrl: text('file_url').notNull(),
        mimeType: varchar('mime_type', { length: 100 }),
        fileSize: bigint('file_size', { mode: 'number' }),
        uploadedBy: uuid('uploaded_by').references(() => users.id, {
            onDelete: 'set null',
        }),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => {
        return {
            empIdx: index('employee_docs_emp_idx').on(table.employeeId),
        };
    },
);
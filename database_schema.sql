-- ============================================================================
-- DAYFLOW HRMS — PostgreSQL Database Schema
-- Modules: Organization | Identity | Employee | Work | Attendance | Leave | Payroll | Notifications | Audit
-- ============================================================================

BEGIN;

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ============================================================================
-- ENUMS (lowercase — aligned with Drizzle ORM)
-- ============================================================================
CREATE TYPE user_role             AS ENUM ('admin', 'hr', 'employee');
CREATE TYPE employment_status     AS ENUM ('active', 'inactive', 'terminated', 'on_leave', 'probation');
CREATE TYPE employment_type       AS ENUM ('full_time', 'part_time', 'contract', 'intern', 'consultant');
CREATE TYPE gender_type           AS ENUM ('male', 'female', 'other');
CREATE TYPE marital_status_type   AS ENUM ('single', 'married', 'divorced', 'widowed');
CREATE TYPE document_type         AS ENUM ('resume', 'pan_card', 'aadhaar', 'offer_letter', 'medical_certificate', 'certification', 'other');
CREATE TYPE proficiency_level     AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE attendance_status     AS ENUM ('present', 'absent', 'half_day', 'leave', 'holiday', 'weekly_off', 'incomplete');
CREATE TYPE attendance_source     AS ENUM ('system', 'manual', 'biometric', 'corrected');
CREATE TYPE adjustment_status     AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE leave_status          AS ENUM ('draft', 'pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE leave_half            AS ENUM ('none', 'first_half', 'second_half');
CREATE TYPE leave_transaction_type AS ENUM ('allocation', 'leave_used', 'leave_cancelled', 'leave_credited', 'carry_forward', 'adjustment', 'expiry');
CREATE TYPE leave_unit            AS ENUM ('day', 'half_day', 'hour');
CREATE TYPE salary_component_type AS ENUM ('earning', 'employee_deduction', 'employer_contribution');
CREATE TYPE salary_calculation_type AS ENUM ('fixed', 'percentage_of_wage', 'percentage_of_component', 'residual');
CREATE TYPE payroll_period_status AS ENUM ('draft', 'processing', 'calculated', 'review', 'finalized', 'paid', 'cancelled');
CREATE TYPE payslip_status        AS ENUM ('draft', 'processing', 'calculated', 'finalized', 'paid');
CREATE TYPE wage_type             AS ENUM ('fixed', 'hourly', 'daily');
CREATE TYPE notification_type     AS ENUM (
    'leave_approved', 'leave_rejected', 'leave_submitted',
    'salary_updated', 'payslip_generated', 'payslip_finalized',
    'attendance_reminder', 'attendance_corrected',
    'password_reset', 'password_changed',
    'employee_created', 'employee_terminated',
    'general', 'system_alert'
);

-- ============================================================================
-- MODULE 01 — ORGANIZATION
-- ============================================================================

CREATE TABLE organizations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    code            VARCHAR(10)  NOT NULL UNIQUE,
    logo_url        TEXT,
    email           VARCHAR(255),
    phone           VARCHAR(20),
    address         TEXT,
    city            VARCHAR(100),
    state           VARCHAR(100),
    country         VARCHAR(100) NOT NULL DEFAULT 'India',
    postal_code     VARCHAR(20),
    timezone        VARCHAR(50)  NOT NULL DEFAULT 'Asia/Kolkata',
    currency        VARCHAR(3)   NOT NULL DEFAULT 'INR',
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE locations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID         NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    address         TEXT,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID         NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name                VARCHAR(255) NOT NULL,
    code                VARCHAR(50),
    manager_employee_id UUID,  -- FK added below (circular dep)
    is_active           BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_departments_org_code UNIQUE (organization_id, code)
);

CREATE TABLE job_positions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID         NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MODULE 02 — IDENTITY
-- ============================================================================

CREATE TABLE users (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id         UUID         NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    first_name              VARCHAR(100) NOT NULL,
    last_name               VARCHAR(100) NOT NULL,
    email                   VARCHAR(255) NOT NULL UNIQUE,
    password                VARCHAR(255) NOT NULL,
    profile_image           TEXT         DEFAULT 'https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg',
    role                    user_role    NOT NULL DEFAULT 'employee',
    email_verified          BOOLEAN      NOT NULL DEFAULT FALSE,
    is_active               BOOLEAN      NOT NULL DEFAULT TRUE,
    is_deleted              BOOLEAN      NOT NULL DEFAULT FALSE,
    deleted_at              TIMESTAMPTZ,
    last_login_at           TIMESTAMPTZ,
    must_change_password    BOOLEAN      NOT NULL DEFAULT FALSE,
    failed_login_attempts   INTEGER      NOT NULL DEFAULT 0,
    locked_until            TIMESTAMPTZ,
    recovery_expires_at     TIMESTAMPTZ,
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  VARCHAR(255) NOT NULL,
    expires_at  TIMESTAMPTZ  NOT NULL,
    revoked_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MODULE 03 — EMPLOYEE
-- ============================================================================

CREATE TABLE employees (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID              NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id             UUID              UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    employee_code       VARCHAR(20)       NOT NULL,
    first_name          VARCHAR(100)      NOT NULL,
    middle_name         VARCHAR(100),
    last_name           VARCHAR(100),
    display_name        VARCHAR(255),
    date_of_birth       DATE,
    gender              gender_type,
    phone               VARCHAR(20),
    work_email          VARCHAR(255),
    department_id       UUID              REFERENCES departments(id) ON DELETE SET NULL,
    job_position_id     UUID              REFERENCES job_positions(id) ON DELETE SET NULL,
    manager_id          UUID              REFERENCES employees(id) ON DELETE SET NULL,
    location_id         UUID              REFERENCES locations(id) ON DELETE SET NULL,
    joining_date        DATE              NOT NULL,
    termination_date    DATE,
    employment_status   employment_status NOT NULL DEFAULT 'active',
    employment_type     employment_type   NOT NULL DEFAULT 'full_time',
    created_at          TIMESTAMPTZ       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMPTZ,

    CONSTRAINT uq_employees_code UNIQUE (organization_id, employee_code),
    CONSTRAINT chk_employees_dates CHECK (termination_date IS NULL OR termination_date >= joining_date)
);

CREATE TABLE employee_private_info (
    employee_id             UUID PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
    residential_address     TEXT,
    personal_email          VARCHAR(255),
    nationality             VARCHAR(100),
    marital_status          marital_status_type,
    emergency_contact_name  VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_bank_accounts (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id              UUID         NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    account_holder_name      VARCHAR(255) NOT NULL,
    account_number_encrypted BYTEA        NOT NULL,
    bank_name                VARCHAR(255) NOT NULL,
    ifsc_code                VARCHAR(11)  NOT NULL,
    is_primary               BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at               TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at               TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_bank_accounts_primary ON employee_bank_accounts(employee_id)
    WHERE is_primary = TRUE;

CREATE TABLE employee_identifiers (
    employee_id        UUID PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
    pan_encrypted      BYTEA,
    uan_encrypted      BYTEA,
    aadhaar_encrypted  BYTEA,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_code_sequences (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID    NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    joining_year    INTEGER NOT NULL,
    last_sequence   INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT uq_emp_code_seq UNIQUE (organization_id, joining_year)
);

CREATE TABLE employee_documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id     UUID          NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    document_type   document_type NOT NULL,
    file_name       VARCHAR(255)  NOT NULL,
    file_url        TEXT          NOT NULL,
    mime_type       VARCHAR(100),
    file_size       BIGINT,
    uploaded_by     UUID          REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skills (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID         NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,

    CONSTRAINT uq_skills_org_name UNIQUE (organization_id, name)
);

CREATE TABLE employee_skills (
    employee_id UUID             NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    skill_id    UUID             NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency proficiency_level NOT NULL DEFAULT 'beginner',

    PRIMARY KEY (employee_id, skill_id)
);

CREATE TABLE certifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id     UUID         NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    issuer          VARCHAR(255),
    issue_date      DATE,
    expiry_date     DATE,
    certificate_url TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_cert_dates CHECK (expiry_date IS NULL OR expiry_date >= issue_date)
);

-- ============================================================================
-- MODULE 04 — WORK MANAGEMENT
-- ============================================================================

CREATE TABLE work_schedules (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id       UUID         NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name                  VARCHAR(255) NOT NULL,
    timezone              VARCHAR(50)  NOT NULL DEFAULT 'Asia/Kolkata',
    is_active             BOOLEAN      NOT NULL DEFAULT TRUE,
    default_break_minutes INTEGER      NOT NULL DEFAULT 60,
    created_at            TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE work_schedule_days (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id    UUID    NOT NULL REFERENCES work_schedules(id) ON DELETE CASCADE,
    weekday        INTEGER NOT NULL CHECK (weekday BETWEEN 0 AND 6),
    is_working_day BOOLEAN NOT NULL DEFAULT TRUE,
    start_time     TIME,
    end_time       TIME,
    break_minutes  INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT uq_schedule_day UNIQUE (schedule_id, weekday),
    CONSTRAINT chk_working_time CHECK (
        (is_working_day = FALSE) OR
        (start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time)
    )
);

CREATE TABLE employee_schedule_assignments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id     UUID        NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    schedule_id     UUID        NOT NULL REFERENCES work_schedules(id) ON DELETE RESTRICT,
    effective_from  DATE        NOT NULL,
    effective_to    DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_schedule_effective CHECK (effective_to IS NULL OR effective_to >= effective_from)
);

CREATE TABLE holidays (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID         NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    holiday_date    DATE         NOT NULL,
    is_optional     BOOLEAN      NOT NULL DEFAULT FALSE,
    description     TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_holiday_org_date UNIQUE (organization_id, holiday_date)
);

-- ============================================================================
-- MODULE 05 — ATTENDANCE
-- ============================================================================

CREATE TABLE attendance_records (
    id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id            UUID              NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    attendance_date        DATE              NOT NULL,
    status                 attendance_status NOT NULL DEFAULT 'absent',
    total_work_minutes     INTEGER           NOT NULL DEFAULT 0,
    scheduled_work_minutes INTEGER           NOT NULL DEFAULT 0,
    overtime_minutes       INTEGER           NOT NULL DEFAULT 0,
    late_minutes           INTEGER           NOT NULL DEFAULT 0,
    early_checkout_minutes INTEGER           NOT NULL DEFAULT 0,
    remarks                TEXT,
    source                 attendance_source NOT NULL DEFAULT 'system',
    created_at             TIMESTAMPTZ       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMPTZ       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_attendance_date UNIQUE (employee_id, attendance_date)
);

CREATE TABLE attendance_sessions (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attendance_record_id UUID        NOT NULL REFERENCES attendance_records(id) ON DELETE CASCADE,
    check_in_at          TIMESTAMPTZ  NOT NULL,
    check_out_at         TIMESTAMPTZ,
    worked_minutes       INTEGER,
    break_minutes        INTEGER      NOT NULL DEFAULT 0,
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_session_times CHECK (
        check_out_at IS NOT NULL OR worked_minutes IS NULL
    )
);

CREATE TABLE attendance_adjustments (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attendance_record_id UUID              NOT NULL REFERENCES attendance_records(id) ON DELETE CASCADE,
    requested_by         UUID              NOT NULL REFERENCES users(id),
    approved_by          UUID              REFERENCES users(id),
    old_value            JSONB             NOT NULL,
    new_value            JSONB             NOT NULL,
    reason               TEXT              NOT NULL,
    status               adjustment_status NOT NULL DEFAULT 'pending',
    created_at           TIMESTAMPTZ       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMPTZ       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MODULE 06 — LEAVE
-- ============================================================================

CREATE TABLE leave_types (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id     UUID         NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    code                VARCHAR(20)  NOT NULL,
    name                VARCHAR(255) NOT NULL,
    is_paid             BOOLEAN      NOT NULL DEFAULT TRUE,
    requires_allocation BOOLEAN      NOT NULL DEFAULT TRUE,
    requires_attachment BOOLEAN      NOT NULL DEFAULT FALSE,
    requires_approval   BOOLEAN      NOT NULL DEFAULT TRUE,
    unit                leave_unit   NOT NULL DEFAULT 'day',
    is_active           BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_leave_type_code UNIQUE (organization_id, code)
);

CREATE TABLE leave_allocations (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id          UUID         NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id        UUID         NOT NULL REFERENCES leave_types(id) ON DELETE RESTRICT,
    period_start         DATE         NOT NULL,
    period_end           DATE         NOT NULL,
    allocated_days       NUMERIC(6,2) NOT NULL CHECK (allocated_days > 0),
    carried_forward_days NUMERIC(6,2) NOT NULL DEFAULT 0,
    created_by           UUID         NOT NULL REFERENCES users(id),
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_allocation_period CHECK (period_end >= period_start)
);

CREATE TABLE leave_requests (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id    UUID         NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id  UUID         NOT NULL REFERENCES leave_types(id) ON DELETE RESTRICT,
    start_date     DATE         NOT NULL,
    end_date       DATE         NOT NULL,
    start_half     leave_half   NOT NULL DEFAULT 'none',
    end_half       leave_half   NOT NULL DEFAULT 'none',
    requested_days NUMERIC(5,1) NOT NULL CHECK (requested_days > 0),
    reason         TEXT,
    status         leave_status NOT NULL DEFAULT 'draft',
    attachment_url TEXT,
    submitted_at   TIMESTAMPTZ,
    approved_at    TIMESTAMPTZ,
    rejected_at    TIMESTAMPTZ,
    approved_by    UUID         REFERENCES users(id),
    rejected_by    UUID         REFERENCES users(id),
    hr_comment     TEXT,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_leave_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_leave_half CHECK (
        (start_date < end_date AND start_half = 'none' AND end_half = 'none') OR
        (start_date = end_date)
    )
);

CREATE TABLE leave_balance_transactions (
    id               UUID                   PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id      UUID                   NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id    UUID                   NOT NULL REFERENCES leave_types(id) ON DELETE RESTRICT,
    transaction_type leave_transaction_type NOT NULL,
    days             NUMERIC(6,2)           NOT NULL,
    reference_type   VARCHAR(50),
    reference_id     UUID,
    description      TEXT,
    created_at       TIMESTAMPTZ            NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MODULE 07 — PAYROLL
-- ============================================================================

CREATE TABLE payroll_settings (
    id                            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id               UUID            NOT NULL REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
    payroll_frequency             VARCHAR(20)     NOT NULL DEFAULT 'MONTHLY',
    payroll_currency              VARCHAR(3)      NOT NULL DEFAULT 'INR',
    pay_day                       INTEGER         NOT NULL DEFAULT 1 CHECK (pay_day BETWEEN 1 AND 31),
    working_days_basis            NUMERIC(5,2)    NOT NULL DEFAULT 22 CHECK (working_days_basis > 0),
    unpaid_leave_deduction_method VARCHAR(50)     NOT NULL DEFAULT 'PROPORTIONAL_GROSS',
    pf_enabled                    BOOLEAN         NOT NULL DEFAULT TRUE,
    employee_pf_rate              NUMERIC(5,2)    NOT NULL DEFAULT 12.00,
    employer_pf_rate              NUMERIC(5,2)    NOT NULL DEFAULT 12.00,
    professional_tax_enabled      BOOLEAN         NOT NULL DEFAULT TRUE,
    professional_tax_amount       NUMERIC(12,2)   NOT NULL DEFAULT 200.00,
    created_at                    TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                    TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE salary_component_definitions (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id          UUID                    NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    code                     VARCHAR(50)             NOT NULL,
    name                     VARCHAR(255)            NOT NULL,
    component_type           salary_component_type   NOT NULL,
    calculation_type         salary_calculation_type NOT NULL,
    calculation_base         VARCHAR(50),
    is_active                BOOLEAN                 NOT NULL DEFAULT TRUE,
    created_at               TIMESTAMPTZ             NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at               TIMESTAMPTZ             NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_component_code UNIQUE (organization_id, code)
);

CREATE TABLE salary_structures (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id     UUID          NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    monthly_wage    NUMERIC(12,2) NOT NULL CHECK (monthly_wage > 0),
    wage_type       wage_type     NOT NULL DEFAULT 'fixed',
    effective_from  DATE          NOT NULL,
    effective_to    DATE,
    status          VARCHAR(20)   NOT NULL DEFAULT 'active',
    created_by      UUID          NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_salary_effective CHECK (effective_to IS NULL OR effective_to >= effective_from)
);

CREATE TABLE salary_structure_components (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    salary_structure_id     UUID                    NOT NULL REFERENCES salary_structures(id) ON DELETE CASCADE,
    component_definition_id UUID                    NOT NULL REFERENCES salary_component_definitions(id) ON DELETE RESTRICT,
    calculation_type        salary_calculation_type NOT NULL,
    calculation_base        VARCHAR(50),
    percentage              NUMERIC(6,3),
    fixed_amount            NUMERIC(12,2) DEFAULT 0.00,
    sequence                INTEGER       NOT NULL DEFAULT 0,
    is_residual             BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_component_value CHECK (
        (calculation_type = 'fixed' AND fixed_amount IS NOT NULL) OR
        (calculation_type IN ('percentage_of_wage', 'percentage_of_component') AND percentage IS NOT NULL) OR
        (calculation_type = 'residual')
    ),
    CONSTRAINT uq_structure_component UNIQUE (salary_structure_id, component_definition_id)
);

CREATE TABLE payroll_periods (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID                  NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    period_start    DATE                  NOT NULL,
    period_end      DATE                  NOT NULL,
    status          payroll_period_status NOT NULL DEFAULT 'draft',
    processed_at    TIMESTAMPTZ,
    finalized_at    TIMESTAMPTZ,
    created_by      UUID                  NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ           NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_payroll_period UNIQUE (organization_id, period_start, period_end),
    CONSTRAINT chk_payroll_period CHECK (period_end > period_start)
);

CREATE TABLE payslips (
    id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_period_id         UUID          NOT NULL REFERENCES payroll_periods(id) ON DELETE RESTRICT,
    employee_id               UUID          NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    salary_structure_id       UUID          NOT NULL REFERENCES salary_structures(id) ON DELETE RESTRICT,
    monthly_wage              NUMERIC(12,2) NOT NULL,
    working_days              NUMERIC(5,2)  NOT NULL DEFAULT 0,
    payable_days              NUMERIC(5,2)  NOT NULL DEFAULT 0,
    paid_leave_days           NUMERIC(5,2)  NOT NULL DEFAULT 0,
    unpaid_leave_days         NUMERIC(5,2)  NOT NULL DEFAULT 0,
    absent_days               NUMERIC(5,2)  NOT NULL DEFAULT 0,
    half_days_count           NUMERIC(3,1)  NOT NULL DEFAULT 0,
    gross_earnings            NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_employee_deductions NUMERIC(12,2) NOT NULL DEFAULT 0,
    employer_contributions    NUMERIC(12,2) NOT NULL DEFAULT 0,
    unpaid_deduction          NUMERIC(12,2) NOT NULL DEFAULT 0,
    net_pay                   NUMERIC(12,2) NOT NULL DEFAULT 0,
    status                    payslip_status NOT NULL DEFAULT 'draft',
    generated_at              TIMESTAMPTZ,
    finalized_at              TIMESTAMPTZ,
    created_at                TIMESTAMPTZ   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_payslip_employee_period UNIQUE (employee_id, payroll_period_id)
);

CREATE TABLE payslip_lines (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payslip_id               UUID                    NOT NULL REFERENCES payslips(id) ON DELETE CASCADE,
    component_code           VARCHAR(50)             NOT NULL,
    component_name           VARCHAR(255)            NOT NULL,
    component_type           salary_component_type   NOT NULL,
    calculation_type         salary_calculation_type NOT NULL,
    base_amount              NUMERIC(12,2) DEFAULT 0.00,
    percentage               NUMERIC(6,3),
    quantity                 NUMERIC(6,2)  DEFAULT 1.00,
    amount                   NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    sequence                 INTEGER       NOT NULL DEFAULT 0
);

CREATE TABLE payslip_attendance_summary (
    payslip_id          UUID PRIMARY KEY REFERENCES payslips(id) ON DELETE CASCADE,
    total_calendar_days INTEGER      NOT NULL DEFAULT 0,
    scheduled_days      NUMERIC(5,2) NOT NULL DEFAULT 0,
    present_days        NUMERIC(5,2) NOT NULL DEFAULT 0,
    paid_leave_days     NUMERIC(5,2) NOT NULL DEFAULT 0,
    unpaid_leave_days   NUMERIC(5,2) NOT NULL DEFAULT 0,
    absent_days         NUMERIC(5,2) NOT NULL DEFAULT 0,
    half_days           NUMERIC(3,1) NOT NULL DEFAULT 0,
    holiday_days        NUMERIC(3,1) NOT NULL DEFAULT 0,
    weekend_days        NUMERIC(3,1) NOT NULL DEFAULT 0,
    payable_days        NUMERIC(5,2) NOT NULL DEFAULT 0,
    working_minutes     INTEGER      NOT NULL DEFAULT 0,
    overtime_minutes    INTEGER      NOT NULL DEFAULT 0
);

-- ============================================================================
-- MODULE 08 — NOTIFICATIONS
-- ============================================================================

CREATE TABLE notifications (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type           notification_type NOT NULL,
    title          VARCHAR(255)      NOT NULL,
    message        TEXT,
    reference_type VARCHAR(50),
    reference_id   UUID,
    is_read        BOOLEAN           NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at        TIMESTAMPTZ
);

-- ============================================================================
-- MODULE 09 — AUDIT
-- ============================================================================

CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID         NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    actor_user_id   UUID         REFERENCES users(id) ON DELETE SET NULL,
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(100) NOT NULL,
    entity_id       UUID         NOT NULL,
    old_data        JSONB,
    new_data        JSONB,
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- DEFERRED FK: departments.manager_employee_id → employees.id
-- ============================================================================
ALTER TABLE departments
    ADD CONSTRAINT fk_departments_manager
    FOREIGN KEY (manager_employee_id) REFERENCES employees(id) ON DELETE SET NULL;

-- ============================================================================
-- EXCLUSION CONSTRAINT: non-overlapping leave per employee
-- ============================================================================
ALTER TABLE leave_requests ADD CONSTRAINT exclude_overlapping_leave
    EXCLUDE USING gist (
        employee_id WITH =,
        daterange(start_date, end_date, '[]') WITH &&
    )
    WHERE (status IN ('pending', 'approved'));

-- ============================================================================
-- INDEX STRATEGY
-- ============================================================================

-- Users
CREATE INDEX idx_users_org               ON users(organization_id);
CREATE INDEX idx_users_role              ON users(role);
CREATE INDEX idx_users_is_deleted        ON users(is_deleted);
CREATE INDEX idx_users_deleted_at        ON users(deleted_at);
CREATE INDEX idx_users_recovery_expires  ON users(recovery_expires_at);
CREATE INDEX idx_users_org_active        ON users(organization_id, is_active) WHERE is_deleted = FALSE;

-- Employees
CREATE INDEX idx_employees_org_dept      ON employees(organization_id, department_id);
CREATE INDEX idx_employees_manager       ON employees(manager_id);
CREATE INDEX idx_employees_status        ON employees(organization_id, employment_status);
CREATE INDEX idx_employees_joining       ON employees(organization_id, joining_date);
CREATE INDEX idx_employees_user          ON employees(user_id);

-- Departments / Job Positions / Locations
CREATE INDEX idx_departments_org         ON departments(organization_id);
CREATE INDEX idx_job_positions_org       ON job_positions(organization_id);
CREATE INDEX idx_locations_org           ON locations(organization_id);

-- Work Schedules
CREATE INDEX idx_work_schedules_org      ON work_schedules(organization_id);
CREATE INDEX idx_emp_sched_active_date   ON employee_schedule_assignments(employee_id, effective_from);
CREATE INDEX idx_emp_sched_active        ON employee_schedule_assignments(employee_id) WHERE effective_to IS NULL;
CREATE INDEX idx_holidays_org_date       ON holidays(organization_id, holiday_date);

-- Attendance
CREATE INDEX idx_attendance_emp_date     ON attendance_records(employee_id, attendance_date);
CREATE INDEX idx_attendance_emp_status   ON attendance_records(employee_id, status);
CREATE INDEX idx_attendance_date_status  ON attendance_records(attendance_date, status);
CREATE INDEX idx_attendance_sessions_rec ON attendance_sessions(attendance_record_id);

-- Leave
CREATE INDEX idx_leave_requests_emp_status ON leave_requests(employee_id, status);
CREATE INDEX idx_leave_requests_dates      ON leave_requests(start_date, end_date);
CREATE INDEX idx_leave_requests_pending    ON leave_requests(employee_id) WHERE status = 'pending';
CREATE INDEX idx_leave_allocations_emp_type   ON leave_allocations(employee_id, leave_type_id);
CREATE INDEX idx_leave_allocations_period    ON leave_allocations(employee_id, period_start, period_end);
CREATE INDEX idx_leave_transactions_emp_type ON leave_balance_transactions(employee_id, leave_type_id);
CREATE INDEX idx_leave_transactions_ref     ON leave_balance_transactions(reference_type, reference_id);

-- Salary
CREATE INDEX idx_salary_structures_emp_active   ON salary_structures(employee_id) WHERE status = 'active';
CREATE INDEX idx_salary_structures_effective    ON salary_structures(employee_id, effective_from);

-- Payroll
CREATE INDEX idx_payroll_periods_org       ON payroll_periods(organization_id, status);
CREATE INDEX idx_payslips_emp_period       ON payslips(employee_id, payroll_period_id);
CREATE INDEX idx_payslips_period           ON payslips(payroll_period_id);
CREATE INDEX idx_payslips_status           ON payslips(payroll_period_id, status);
CREATE INDEX idx_payslip_lines_payslip     ON payslip_lines(payslip_id);
CREATE INDEX idx_payslip_lines_type        ON payslip_lines(payslip_id, component_type);

-- Notifications
CREATE INDEX idx_notifications_user_unread  ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at);

-- Audit
CREATE INDEX idx_audit_entity       ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_actor        ON audit_logs(actor_user_id, created_at);
CREATE INDEX idx_audit_org_created  ON audit_logs(organization_id, created_at);

-- Misc
CREATE INDEX idx_employee_documents_emp  ON employee_documents(employee_id);
CREATE INDEX idx_certifications_emp      ON certifications(employee_id);
CREATE INDEX idx_bank_accounts_emp       ON employee_bank_accounts(employee_id);
CREATE INDEX idx_refresh_tokens_user     ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash     ON refresh_tokens(token_hash);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Employee code generator: {CompanyCode}{Initials}{Year}{Sequence}
CREATE OR REPLACE FUNCTION generate_employee_code(
    p_organization_id UUID,
    p_first_name      VARCHAR,
    p_last_name       VARCHAR,
    p_joining_year    INTEGER
) RETURNS VARCHAR
LANGUAGE plpgsql
AS $$
DECLARE
    v_company_code  VARCHAR(10);
    v_initials      VARCHAR(10);
    v_new_sequence  INTEGER;
    v_employee_code VARCHAR(20);
BEGIN
    SELECT code INTO v_company_code FROM organizations WHERE id = p_organization_id;

    v_initials := UPPER(SUBSTRING(p_first_name FROM 1 FOR 2)
                     || SUBSTRING(p_last_name FROM 1 FOR 2));

    INSERT INTO employee_code_sequences AS ecs (organization_id, joining_year, last_sequence)
    VALUES (p_organization_id, p_joining_year, 1)
    ON CONFLICT (organization_id, joining_year)
    DO UPDATE SET last_sequence = ecs.last_sequence + 1
    RETURNING last_sequence INTO v_new_sequence;

    v_employee_code := v_company_code
                    || v_initials
                    || p_joining_year::VARCHAR
                    || LPAD(v_new_sequence::VARCHAR, 4, '0');

    RETURN v_employee_code;
END;
$$;

-- Ledger-based leave balance
CREATE OR REPLACE FUNCTION get_leave_balance(
    p_employee_id   UUID,
    p_leave_type_id UUID,
    p_as_of_date    DATE DEFAULT CURRENT_DATE
) RETURNS NUMERIC(6,2)
LANGUAGE sql STABLE
AS $$
    SELECT COALESCE(SUM(days), 0)::NUMERIC(6,2)
    FROM leave_balance_transactions
    WHERE employee_id = p_employee_id
      AND leave_type_id = p_leave_type_id
      AND created_at::DATE <= p_as_of_date;
$$;

-- Get active schedule for an employee on a date
CREATE OR REPLACE FUNCTION get_employee_schedule(
    p_employee_id UUID,
    p_date        DATE
) RETURNS UUID
LANGUAGE sql STABLE
AS $$
    SELECT schedule_id
    FROM employee_schedule_assignments
    WHERE employee_id = p_employee_id
      AND effective_from <= p_date
      AND (effective_to IS NULL OR effective_to >= p_date)
    ORDER BY effective_from DESC
    LIMIT 1;
$$;

-- Check if a date is a working day for an employee
CREATE OR REPLACE FUNCTION is_working_day(
    p_employee_id UUID,
    p_date        DATE
) RETURNS BOOLEAN
LANGUAGE sql STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM employee_schedule_assignments esa
        JOIN work_schedule_days wsd ON wsd.schedule_id = esa.schedule_id
        WHERE esa.employee_id = p_employee_id
          AND esa.effective_from <= p_date
          AND (esa.effective_to IS NULL OR esa.effective_to >= p_date)
          AND wsd.weekday = EXTRACT(DOW FROM p_date)::INTEGER
          AND wsd.is_working_day = TRUE
        ORDER BY esa.effective_from DESC
        LIMIT 1
    );
$$;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- updated_at auto-timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_org_updated              BEFORE UPDATE ON organizations                  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_users_updated            BEFORE UPDATE ON users                          FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_employees_updated        BEFORE UPDATE ON employees                      FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_departments_updated      BEFORE UPDATE ON departments                    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_job_positions_updated    BEFORE UPDATE ON job_positions                  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_locations_updated        BEFORE UPDATE ON locations                      FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_work_schedules_updated   BEFORE UPDATE ON work_schedules                 FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_attendance_updated       BEFORE UPDATE ON attendance_records             FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_leave_requests_updated   BEFORE UPDATE ON leave_requests                 FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_leave_allocations_updated BEFORE UPDATE ON leave_allocations             FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_salary_structures_upd    BEFORE UPDATE ON salary_structures              FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_payroll_settings_upd     BEFORE UPDATE ON payroll_settings               FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_component_defs_updated   BEFORE UPDATE ON salary_component_definitions   FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_private_info_updated     BEFORE UPDATE ON employee_private_info          FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_bank_accounts_updated    BEFORE UPDATE ON employee_bank_accounts         FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_identifiers_updated      BEFORE UPDATE ON employee_identifiers           FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_adjustments_updated      BEFORE UPDATE ON attendance_adjustments         FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Leave status changes → ledger entries
CREATE OR REPLACE FUNCTION log_leave_usage_to_ledger()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        INSERT INTO leave_balance_transactions (
            employee_id, leave_type_id, transaction_type, days,
            reference_type, reference_id, description
        ) VALUES (
            NEW.employee_id, NEW.leave_type_id, 'leave_used', -NEW.requested_days,
            'leave_request', NEW.id,
            'Leave approved: ' || NEW.start_date::TEXT || ' to ' || NEW.end_date::TEXT
        );
    ELSIF NEW.status = 'cancelled' AND OLD.status = 'approved' THEN
        INSERT INTO leave_balance_transactions (
            employee_id, leave_type_id, transaction_type, days,
            reference_type, reference_id, description
        ) VALUES (
            NEW.employee_id, NEW.leave_type_id, 'leave_cancelled', NEW.requested_days,
            'leave_request', NEW.id,
            'Leave cancelled: ' || NEW.start_date::TEXT || ' to ' || NEW.end_date::TEXT
        );
    ELSIF NEW.status = 'rejected' AND OLD.status = 'approved' THEN
        INSERT INTO leave_balance_transactions (
            employee_id, leave_type_id, transaction_type, days,
            reference_type, reference_id, description
        ) VALUES (
            NEW.employee_id, NEW.leave_type_id, 'leave_cancelled', NEW.requested_days,
            'leave_request', NEW.id,
            'Leave rejected after approval: ' || NEW.start_date::TEXT || ' to ' || NEW.end_date::TEXT
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leave_ledger_on_status
    AFTER UPDATE ON leave_requests
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION log_leave_usage_to_ledger();

-- Leave allocation → ledger credit
CREATE OR REPLACE FUNCTION log_leave_allocation_to_ledger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO leave_balance_transactions (
        employee_id, leave_type_id, transaction_type, days,
        reference_type, reference_id, description
    ) VALUES (
        NEW.employee_id, NEW.leave_type_id, 'allocation',
        NEW.allocated_days + NEW.carried_forward_days,
        'leave_allocation', NEW.id,
        'Period: ' || NEW.period_start::TEXT || ' to ' || NEW.period_end::TEXT
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leave_ledger_on_alloc
    AFTER INSERT ON leave_allocations
    FOR EACH ROW
    EXECUTE FUNCTION log_leave_allocation_to_ledger();

-- Auto-generate employee code on insert
CREATE OR REPLACE FUNCTION set_employee_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.employee_code IS NULL OR NEW.employee_code = '' THEN
        NEW.employee_code := generate_employee_code(
            NEW.organization_id,
            NEW.first_name,
            COALESCE(NEW.last_name, ''),
            EXTRACT(YEAR FROM NEW.joining_date)::INTEGER
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_employee_code
    BEFORE INSERT ON employees
    FOR EACH ROW
    EXECUTE FUNCTION set_employee_code();

-- ============================================================================
-- VIEWS
-- ============================================================================

CREATE OR REPLACE VIEW employee_dashboard_status AS
SELECT
    e.id AS employee_id,
    e.organization_id,
    e.display_name,
    e.department_id,
    d.name AS department_name,
    e.employee_code,
    CURRENT_DATE AS status_date,
    CASE
        WHEN EXISTS (
            SELECT 1 FROM leave_requests lr
            WHERE lr.employee_id = e.id
              AND lr.status = 'approved'
              AND CURRENT_DATE BETWEEN lr.start_date AND lr.end_date
        ) THEN 'leave'
        WHEN EXISTS (
            SELECT 1 FROM attendance_records ar
            WHERE ar.employee_id = e.id
              AND ar.attendance_date = CURRENT_DATE
              AND ar.status = 'present'
        ) THEN 'present'
        WHEN is_working_day(e.id, CURRENT_DATE) THEN 'absent'
        ELSE 'off_day'
    END AS computed_status
FROM employees e
LEFT JOIN departments d ON d.id = e.department_id
WHERE e.employment_status = 'active'
  AND e.deleted_at IS NULL;

CREATE OR REPLACE VIEW leave_balance_summary AS
SELECT
    e.id AS employee_id,
    e.organization_id,
    lt.id AS leave_type_id,
    lt.code AS leave_type_code,
    lt.name AS leave_type_name,
    la.allocated_days + la.carried_forward_days AS total_allocated,
    get_leave_balance(e.id, lt.id) AS available_balance,
    COALESCE(
        (SELECT SUM(lr.requested_days)
         FROM leave_requests lr
         WHERE lr.employee_id = e.id
           AND lr.leave_type_id = lt.id
           AND lr.status = 'pending'),
        0
    ) AS pending_days,
    get_leave_balance(e.id, lt.id) -
    COALESCE(
        (SELECT SUM(lr.requested_days)
         FROM leave_requests lr
         WHERE lr.employee_id = e.id
           AND lr.leave_type_id = lt.id
           AND lr.status = 'pending'),
        0
    ) AS net_available
FROM employees e
CROSS JOIN leave_types lt
LEFT JOIN LATERAL (
    SELECT allocated_days, carried_forward_days
    FROM leave_allocations la2
    WHERE la2.employee_id = e.id
      AND la2.leave_type_id = lt.id
      AND CURRENT_DATE BETWEEN la2.period_start AND la2.period_end
    ORDER BY la2.period_start DESC
    LIMIT 1
) la ON TRUE
WHERE e.deleted_at IS NULL
  AND lt.is_active = TRUE
  AND lt.organization_id = e.organization_id
  AND la.allocated_days IS NOT NULL;

-- ============================================================================
-- SEED: Default Indian salary component definitions
-- ============================================================================
-- INSERT INTO salary_component_definitions (organization_id, code, name, component_type, calculation_type, calculation_base)
-- VALUES
--     (:org_id, 'BASIC',              'Basic Salary',          'earning',              'percentage_of_wage',      'monthly_wage'),
--     (:org_id, 'HRA',                'House Rent Allowance',  'earning',              'percentage_of_component', 'basic'),
--     (:org_id, 'STANDARD_ALLOWANCE', 'Standard Allowance',    'earning',              'fixed',                   NULL),
--     (:org_id, 'PERFORMANCE_BONUS',  'Performance Bonus',     'earning',              'percentage_of_component', 'basic'),
--     (:org_id, 'LTA',                'Leave Travel Allowance','earning',              'percentage_of_component', 'basic'),
--     (:org_id, 'FIXED_ALLOWANCE',    'Fixed Allowance',       'earning',              'residual',                NULL),
--     (:org_id, 'EMPLOYEE_PF',        'Employee PF',           'employee_deduction',   'percentage_of_component', 'basic'),
--     (:org_id, 'EMPLOYER_PF',        'Employer PF',           'employer_contribution', 'percentage_of_component', 'basic'),
--     (:org_id, 'PROFESSIONAL_TAX',   'Professional Tax',      'employee_deduction',   'fixed',                   NULL);

COMMIT;
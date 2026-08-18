-- ============================================================================
-- DAYFLOW HRMS — Raw SQL: Extensions, Functions, Triggers, Exclusion Constraints
-- Run AFTER the Drizzle-generated migration for table creation
-- ============================================================================

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ----------------------------------------------------------------------------
-- DEFERRED FOREIGN KEY: departments.manager_employee_id → employees.id
-- (circular dependency — cannot be expressed in Drizzle inline)
-- ----------------------------------------------------------------------------
ALTER TABLE departments
    ADD CONSTRAINT fk_departments_manager
    FOREIGN KEY (manager_employee_id) REFERENCES employees(id) ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- EXCLUSION CONSTRAINT: Non-overlapping PENDING/APPROVED leave per employee
-- ----------------------------------------------------------------------------
ALTER TABLE leave_requests ADD CONSTRAINT exclude_overlapping_leave
    EXCLUDE USING gist (
        employee_id WITH =,
        daterange(start_date, end_date, '[]') WITH &&
    )
    WHERE (status IN ('pending', 'approved'));

-- ----------------------------------------------------------------------------
-- FUNCTION: Generate employee code (OIJODO20260001 format)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_employee_code(
    p_organization_id UUID,
    p_first_name      VARCHAR,
    p_last_name       VARCHAR,
    p_joining_year    INTEGER
) RETURNS VARCHAR
LANGUAGE plpgsql
AS $$
DECLARE
    v_company_code VARCHAR(10);
    v_initials     VARCHAR(10);
    v_new_sequence INTEGER;
    v_employee_code VARCHAR(20);
BEGIN
    SELECT code INTO v_company_code
    FROM organizations
    WHERE id = p_organization_id;

    v_initials := UPPER(
        SUBSTRING(p_first_name FROM 1 FOR 2) ||
        SUBSTRING(p_last_name FROM 1 FOR 2)
    );

    INSERT INTO employee_code_sequences AS ecs (organization_id, joining_year, last_sequence)
    VALUES (p_organization_id, p_joining_year, 1)
    ON CONFLICT (organization_id, joining_year)
    DO UPDATE SET last_sequence = ecs.last_sequence + 1
    RETURNING last_sequence INTO v_new_sequence;

    v_employee_code := v_company_code || v_initials || p_joining_year::VARCHAR ||
                       LPAD(v_new_sequence::VARCHAR, 4, '0');

    RETURN v_employee_code;
END;
$$;

-- ----------------------------------------------------------------------------
-- FUNCTION: Get leave balance for employee + leave type (ledger-based)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_leave_balance(
    p_employee_id   UUID,
    p_leave_type_id UUID,
    p_as_of_date    DATE DEFAULT CURRENT_DATE
) RETURNS NUMERIC(6,2)
LANGUAGE sql
STABLE
AS $$
    SELECT COALESCE(SUM(days), 0)::NUMERIC(6,2)
    FROM leave_balance_transactions
    WHERE employee_id = p_employee_id
      AND leave_type_id = p_leave_type_id
      AND created_at::DATE <= p_as_of_date;
$$;

-- ----------------------------------------------------------------------------
-- FUNCTION: Get active schedule for an employee on a given date
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_employee_schedule(
    p_employee_id UUID,
    p_date        DATE
) RETURNS UUID
LANGUAGE sql
STABLE
AS $$
    SELECT schedule_id
    FROM employee_schedule_assignments
    WHERE employee_id = p_employee_id
      AND effective_from <= p_date
      AND (effective_to IS NULL OR effective_to >= p_date)
    ORDER BY effective_from DESC
    LIMIT 1;
$$;

-- ----------------------------------------------------------------------------
-- FUNCTION: Check if a given date is a working day for an employee
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_working_day(
    p_employee_id UUID,
    p_date        DATE
) RETURNS BOOLEAN
LANGUAGE sql
STABLE
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

-- ----------------------------------------------------------------------------
-- FUNCTION: Auto-update updated_at timestamp
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- TRIGGERS: updated_at auto-timestamp
-- ----------------------------------------------------------------------------
CREATE TRIGGER trg_organizations_updated BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_employees_updated BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_departments_updated BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_job_positions_updated BEFORE UPDATE ON job_positions
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_locations_updated BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_work_schedules_updated BEFORE UPDATE ON work_schedules
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_attendance_records_updated BEFORE UPDATE ON attendance_records
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_leave_requests_updated BEFORE UPDATE ON leave_requests
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_leave_allocations_updated BEFORE UPDATE ON leave_allocations
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_salary_structures_updated BEFORE UPDATE ON salary_structures
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_payroll_settings_updated BEFORE UPDATE ON payroll_settings
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_salary_component_definitions_updated BEFORE UPDATE ON salary_component_definitions
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_employee_private_info_updated BEFORE UPDATE ON employee_private_info
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_employee_bank_accounts_updated BEFORE UPDATE ON employee_bank_accounts
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_employee_identifiers_updated BEFORE UPDATE ON employee_identifiers
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trg_attendance_adjustments_updated BEFORE UPDATE ON attendance_adjustments
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ----------------------------------------------------------------------------
-- TRIGGER: Leave status → ledger entries
-- ----------------------------------------------------------------------------
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
            'Leave rejected after prior approval: ' || NEW.start_date::TEXT || ' to ' || NEW.end_date::TEXT
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leave_ledger_on_status_change
    AFTER UPDATE ON leave_requests
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION log_leave_usage_to_ledger();

-- ----------------------------------------------------------------------------
-- TRIGGER: Leave allocation → ledger credit
-- ----------------------------------------------------------------------------
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

CREATE TRIGGER trg_leave_ledger_on_allocation
    AFTER INSERT ON leave_allocations
    FOR EACH ROW
    EXECUTE FUNCTION log_leave_allocation_to_ledger();

-- ----------------------------------------------------------------------------
-- TRIGGER: Auto-generate employee code on insert
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- VIEW: Employee dashboard status (computed status dot)
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- VIEW: Leave balance summary
-- ----------------------------------------------------------------------------
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
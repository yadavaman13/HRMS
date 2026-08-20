import { pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role_enum', ['user', 'admin', 'hr', 'employee']);

export const employmentStatusEnum = pgEnum('employment_status', [
    'active',
    'inactive',
    'terminated',
    'on_leave',
    'probation',
]);

export const employmentTypeEnum = pgEnum('employment_type', [
    'full_time',
    'part_time',
    'contract',
    'intern',
    'consultant',
]);

export const genderEnum = pgEnum('gender_type', ['male', 'female', 'other']);

export const maritalStatusEnum = pgEnum('marital_status_type', [
    'single',
    'married',
    'divorced',
    'widowed',
]);

export const documentTypeEnum = pgEnum('document_type', [
    'resume',
    'pan_card',
    'aadhaar',
    'offer_letter',
    'medical_certificate',
    'certification',
    'other',
]);

export const proficiencyEnum = pgEnum('proficiency_level', [
    'beginner',
    'intermediate',
    'advanced',
    'expert',
]);

export const attendanceStatusEnum = pgEnum('attendance_status', [
    'present',
    'absent',
    'half_day',
    'leave',
    'holiday',
    'weekly_off',
    'incomplete',
]);

export const attendanceSourceEnum = pgEnum('attendance_source', [
    'system',
    'manual',
    'biometric',
    'corrected',
]);

export const adjustmentStatusEnum = pgEnum('adjustment_status', [
    'pending',
    'approved',
    'rejected',
]);

export const leaveStatusEnum = pgEnum('leave_status', [
    'draft',
    'pending',
    'approved',
    'rejected',
    'cancelled',
]);

export const leaveHalfEnum = pgEnum('leave_half', ['none', 'first_half', 'second_half']);

export const leaveTransactionTypeEnum = pgEnum('leave_transaction_type', [
    'allocation',
    'leave_used',
    'leave_cancelled',
    'leave_credited',
    'carry_forward',
    'adjustment',
    'expiry',
]);

export const leaveUnitEnum = pgEnum('leave_unit', ['day', 'half_day', 'hour']);

export const salaryComponentTypeEnum = pgEnum('salary_component_type', [
    'earning',
    'employee_deduction',
    'employer_contribution',
]);

export const salaryCalculationTypeEnum = pgEnum('salary_calculation_type', [
    'fixed',
    'percentage_of_wage',
    'percentage_of_component',
    'residual',
]);

export const payrollPeriodStatusEnum = pgEnum('payroll_period_status', [
    'draft',
    'processing',
    'calculated',
    'review',
    'finalized',
    'paid',
    'cancelled',
]);

export const payslipStatusEnum = pgEnum('payslip_status', [
    'draft',
    'processing',
    'calculated',
    'finalized',
    'paid',
]);

export const wageTypeEnum = pgEnum('wage_type', ['fixed', 'hourly', 'daily']);

export const notificationTypeEnum = pgEnum('notification_type', [
    'leave_approved',
    'leave_rejected',
    'leave_submitted',
    'salary_updated',
    'payslip_generated',
    'payslip_finalized',
    'attendance_reminder',
    'attendance_corrected',
    'password_reset',
    'password_changed',
    'employee_created',
    'employee_terminated',
    'general',
    'system_alert',
]);

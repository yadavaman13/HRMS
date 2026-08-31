import { createSearchEmployeesTool } from './employee/search_employees.tool.js';
import { createGetEmployeeProfileTool } from './employee/get_employee_profile.tool.js';
import { createSearchEmployeeSkillsTool } from './employee/search_employee_skills.tool.js';
import { createGetEmployeeScheduleTool } from './employee/get_employee_schedule.tool.js';
import { createGetAttendanceTool } from './attendance/get_attendance.tool.js';
import { createAnalyzeAttendanceTool } from './attendance/analyze_attendance.tool.js';
import { createGetAttendanceAnomaliesTool } from './attendance/get_attendance_anomalies.tool.js';
import { createGetAttendanceAdjustmentHistoryTool } from './attendance/get_attendance_adjustment_history.tool.js';
import { createGetLeaveBalanceTool } from './leave/get_leave_balance.tool.js';
import { createSearchLeaveRequestsTool } from './leave/search_leave_requests.tool.js';
import { createGetTeamAvailabilityTool } from './leave/get_team_availability.tool.js';
import { createCreateLeaveRequestTool } from './leave/create_leave_request.tool.js';
import { createGetPayslipTool } from './payroll/get_payslip.tool.js';
import { createComparePayslipsTool } from './payroll/compare_payslips.tool.js';
import { createAnalyzePayrollTool } from './payroll/analyze_payroll.tool.js';
import { createGetPayrollStatusTool } from './payroll/get_payroll_status.tool.js';
import { createGetHrDashboardTool } from './analytics/get_hr_dashboard.tool.js';
import { createGetAuditHistoryTool } from './governance/get_audit_history.tool.js';

/**
 * Creates all 18 HRMS tools closed over the resolved hrmsContext.
 * organizationId is always from hrmsContext — never from LLM args.
 */
export function createHrmsTools(hrmsContext) {
    return [
        createSearchEmployeesTool(hrmsContext),
        createGetEmployeeProfileTool(hrmsContext),
        createSearchEmployeeSkillsTool(hrmsContext),
        createGetEmployeeScheduleTool(hrmsContext),
        createGetAttendanceTool(hrmsContext),
        createAnalyzeAttendanceTool(hrmsContext),
        createGetAttendanceAnomaliesTool(hrmsContext),
        createGetAttendanceAdjustmentHistoryTool(hrmsContext),
        createGetLeaveBalanceTool(hrmsContext),
        createSearchLeaveRequestsTool(hrmsContext),
        createGetTeamAvailabilityTool(hrmsContext),
        createCreateLeaveRequestTool(hrmsContext),
        createGetPayslipTool(hrmsContext),
        createComparePayslipsTool(hrmsContext),
        createAnalyzePayrollTool(hrmsContext),
        createGetPayrollStatusTool(hrmsContext),
        createGetHrDashboardTool(hrmsContext),
        createGetAuditHistoryTool(hrmsContext),
    ];
}

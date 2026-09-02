import { tool } from 'langchain';
import * as z from 'zod';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import {
    getPayslipByEmployeeAndPeriod,
    listPayslipsByEmployee,
    getPayslipLines,
    getPayslipAttendanceSummary,
} from '../../../../dao/payroll.dao.js';

export function createGetPayslipTool(hrmsContext) {
    return tool(
        async ({ employeeId, payrollPeriodId }) => {
            if (hrmsContext.role === 'user') return toolError('FORBIDDEN', 'Access denied.');
            let targetId = employeeId;
            if (hrmsContext.role === 'employee') {
                if (!hrmsContext.employeeId)
                    return toolError('NOT_AN_EMPLOYEE', 'No linked employee record.');
                targetId = hrmsContext.employeeId;
            }
            if (!targetId) return toolError('NOT_AN_EMPLOYEE', 'Please provide an employeeId.');
            let payslip = payrollPeriodId
                ? await getPayslipByEmployeeAndPeriod(targetId, payrollPeriodId)
                : (await listPayslipsByEmployee(targetId))[0] || null;
            if (!payslip)
                return toolError('PAYROLL_NOT_FOUND', 'No payslip found for the specified period.');
            const [lines, attendanceSummary] = await Promise.all([
                getPayslipLines(payslip.id),
                getPayslipAttendanceSummary(payslip.id),
            ]);
            return toolSuccess({ payslip, lines, attendanceSummary });
        },
        {
            name: 'get_payslip',
            description:
                'Retrieve payslip with line items and attendance summary. Employee: own only. HR/Admin: any. Omit payrollPeriodId for latest.',
            schema: z.object({
                employeeId: z.string().uuid().optional(),
                payrollPeriodId: z.string().uuid().optional(),
            }),
        },
    );
}

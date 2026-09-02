import { tool } from 'langchain';
import * as z from 'zod';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import { analyzePayroll } from '../../../../dao/payroll.dao.js';

export function createAnalyzePayrollTool(hrmsContext) {
    return tool(
        async ({ metric, groupBy, payrollPeriodId }) => {
            if (hrmsContext.role === 'employee' || hrmsContext.role === 'user')
                return toolError('FORBIDDEN', 'Payroll analytics restricted to HR and Admin.');
            const results = await analyzePayroll(
                hrmsContext.organizationId,
                metric,
                groupBy,
                payrollPeriodId,
            );
            return toolSuccess({
                metric,
                groupBy,
                payrollPeriodId: payrollPeriodId || 'all',
                results,
            });
        },
        {
            name: 'analyze_payroll',
            description:
                'Aggregate payroll metrics (gross, net, deductions, unpaid_deduction, employer_contribution) by department/employee/period. DB aggregation only. HR/Admin only.',
            schema: z.object({
                metric: z.enum([
                    'gross',
                    'net',
                    'deductions',
                    'unpaid_deduction',
                    'employer_contribution',
                ]),
                groupBy: z.enum(['department', 'employee', 'payroll_period']),
                payrollPeriodId: z.string().uuid().optional(),
            }),
        },
    );
}

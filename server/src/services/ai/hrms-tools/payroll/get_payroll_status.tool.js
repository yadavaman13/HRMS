import { tool } from 'langchain';
import * as z from 'zod';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import { listPayrollPeriods } from '../../../../dao/payroll.dao.js';

export function createGetPayrollStatusTool(hrmsContext) {
    return tool(
        async ({ payrollPeriodId }) => {
            if (hrmsContext.role === 'employee' || hrmsContext.role === 'user')
                return toolError('FORBIDDEN', 'Payroll status restricted to HR and Admin.');
            const allPeriods = await listPayrollPeriods(hrmsContext.organizationId);
            const periods = Array.isArray(allPeriods) ? allPeriods.slice(0, 12) : [];
            if (payrollPeriodId) {
                const period = (allPeriods || []).find((p) => p.id === payrollPeriodId);
                if (!period) return toolError('PAYROLL_NOT_FOUND', 'Payroll period not found.');
                return toolSuccess({ period });
            }
            return toolSuccess({ periods });
        },
        {
            name: 'get_payroll_status',
            description:
                'Get payroll period status (DRAFT, CALCULATED, FINALIZED, PAID). Returns 12 most recent or specific period. HR/Admin only.',
            schema: z.object({ payrollPeriodId: z.string().uuid().optional() }),
        },
    );
}

import { tool } from 'langchain';
import * as z from 'zod';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import { getEmployeeLeaveBalances } from '../../../../dao/leave.dao.js';

export function createGetLeaveBalanceTool(hrmsContext) {
    return tool(
        async ({ employeeId }) => {
            if (hrmsContext.role === 'user') return toolError('FORBIDDEN', 'Access denied.');
            let targetId = employeeId || hrmsContext.employeeId;
            if (hrmsContext.role === 'employee') {
                if (!hrmsContext.employeeId)
                    return toolError('NOT_AN_EMPLOYEE', 'No linked employee record.');
                targetId = hrmsContext.employeeId;
            }
            if (!targetId)
                return toolError(
                    'NOT_AN_EMPLOYEE',
                    'Please specify an employeeId or ensure account has a linked employee record.',
                );
            const balances = await getEmployeeLeaveBalances(targetId, hrmsContext.organizationId);
            return toolSuccess(balances);
        },
        {
            name: 'get_leave_balance',
            description:
                'Retrieve leave balances (allocated, used, remaining). Employee: own only. HR/Admin: any employee.',
            schema: z.object({ employeeId: z.string().uuid().optional() }),
        },
    );
}

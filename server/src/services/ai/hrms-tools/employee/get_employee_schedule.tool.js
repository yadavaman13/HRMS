import { tool } from 'langchain';
import * as z from 'zod';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import { getEmployeeScheduleDays } from '../../../../dao/leave.dao.js';
import { getEmployeeActiveSchedule } from '../../../../dao/attendance.dao.js';

export function createGetEmployeeScheduleTool(hrmsContext) {
    return tool(
        async ({ employeeId }) => {
            const targetId = employeeId || hrmsContext.employeeId;
            if (!targetId) return toolError('NOT_AN_EMPLOYEE', 'No linked employee record.');
            if (hrmsContext.role === 'user') return toolError('FORBIDDEN', 'Access denied.');
            if (hrmsContext.role === 'employee' && targetId !== hrmsContext.employeeId)
                return toolError('FORBIDDEN', 'You can only view your own schedule.');

            const today = new Date().toISOString().split('T')[0];
            const [scheduleDays, activeSchedule] = await Promise.all([
                getEmployeeScheduleDays(targetId),
                getEmployeeActiveSchedule(targetId, hrmsContext.organizationId, today),
            ]);
            return toolSuccess({ scheduleDays, activeSchedule });
        },
        {
            name: 'get_employee_schedule',
            description: 'Retrieve employee work schedule days and current active schedule.',
            schema: z.object({ employeeId: z.string().uuid().optional() }),
        },
    );
}

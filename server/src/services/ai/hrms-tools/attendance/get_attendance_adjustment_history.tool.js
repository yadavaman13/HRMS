import { tool } from 'langchain';
import * as z from 'zod';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import { getAdjustments } from '../../../../dao/attendance.dao.js';

export function createGetAttendanceAdjustmentHistoryTool(hrmsContext) {
    return tool(
        async ({ employeeId, startDate, endDate, limit = 20 }) => {
            if (hrmsContext.role === 'user') return toolError('FORBIDDEN', 'Access denied.');
            let targetId = employeeId;
            if (hrmsContext.role === 'employee') {
                if (!hrmsContext.employeeId)
                    return toolError('NOT_AN_EMPLOYEE', 'No linked employee record.');
                targetId = hrmsContext.employeeId;
            }
            const adjustments = await getAdjustments({
                organizationId: hrmsContext.organizationId,
                employeeId: targetId,
                startDate,
                endDate,
                limit: Math.min(limit, 50),
            });
            return toolSuccess(adjustments);
        },
        {
            name: 'get_attendance_adjustment_history',
            description:
                'Retrieve attendance regularization history. Employee: own records. HR/Admin: any employee.',
            schema: z.object({
                employeeId: z.string().uuid().optional(),
                startDate: z.string().optional(),
                endDate: z.string().optional(),
                limit: z.number().int().min(1).max(50).default(20).optional(),
            }),
        },
    );
}

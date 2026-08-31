import { tool } from 'langchain';
import * as z from 'zod';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import {
    getAttendanceRecords,
    getEmployeeAttendanceSummary,
} from '../../../../dao/attendance.dao.js';

export function createGetAttendanceTool(hrmsContext) {
    return tool(
        async ({ employeeId, startDate, endDate }) => {
            const start = new Date(startDate),
                end = new Date(endDate);
            if (isNaN(start) || isNaN(end) || start > end)
                return toolError('INVALID_DATE_RANGE', 'startDate must be before endDate.');
            if ((end - start) / 86400000 > 90)
                return toolError('INVALID_DATE_RANGE', 'Date range cannot exceed 90 days.');

            if (hrmsContext.role === 'user') return toolError('FORBIDDEN', 'Access denied.');
            let targetId = employeeId;
            if (hrmsContext.role === 'employee') {
                if (!hrmsContext.employeeId)
                    return toolError('NOT_AN_EMPLOYEE', 'No linked employee record.');
                targetId = hrmsContext.employeeId;
            }
            const records = await getAttendanceRecords({
                organizationId: hrmsContext.organizationId,
                employeeId: targetId,
                startDate,
                endDate,
                limit: 100,
            });
            const summary = targetId
                ? await getEmployeeAttendanceSummary(targetId, startDate, endDate)
                : null;
            return toolSuccess({ records, summary, dateRange: { startDate, endDate } });
        },
        {
            name: 'get_attendance',
            description:
                'Retrieve attendance records. Max 90-day range. Employees: own records only. HR/Admin: org-wide.',
            schema: z.object({
                employeeId: z.string().uuid().optional(),
                startDate: z.string().describe('YYYY-MM-DD'),
                endDate: z.string().describe('YYYY-MM-DD'),
            }),
        },
    );
}

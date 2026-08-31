import { tool } from 'langchain';
import * as z from 'zod';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import { analyzeAttendance } from '../../../../dao/attendance.dao.js';

export function createAnalyzeAttendanceTool(hrmsContext) {
    return tool(
        async ({ metric, groupBy, startDate, endDate }) => {
            if (hrmsContext.role === 'employee' || hrmsContext.role === 'user')
                return toolError('FORBIDDEN', 'Attendance analytics restricted to HR and Admin.');
            const start = new Date(startDate),
                end = new Date(endDate);
            if (isNaN(start) || isNaN(end) || start > end)
                return toolError('INVALID_DATE_RANGE', 'startDate must be before endDate.');
            const results = await analyzeAttendance(
                hrmsContext.organizationId,
                metric,
                groupBy,
                startDate,
                endDate,
            );
            return toolSuccess({ metric, groupBy, dateRange: { startDate, endDate }, results });
        },
        {
            name: 'analyze_attendance',
            description:
                'Aggregate attendance metrics (overtime, absenteeism, late_arrivals, early_checkouts, worked_hours, attendance) grouped by employee/department/location. DB aggregation only. HR/Admin only.',
            schema: z.object({
                metric: z.enum([
                    'overtime',
                    'absenteeism',
                    'late_arrivals',
                    'early_checkouts',
                    'worked_hours',
                    'attendance',
                ]),
                groupBy: z.enum(['employee', 'department', 'location']),
                startDate: z.string().describe('YYYY-MM-DD'),
                endDate: z.string().describe('YYYY-MM-DD'),
            }),
        },
    );
}

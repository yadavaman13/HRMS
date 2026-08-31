import { tool } from 'langchain';
import * as z from 'zod';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import { getAttendanceAnomalies } from '../../../../dao/attendance.dao.js';

export function createGetAttendanceAnomaliesTool(hrmsContext) {
    return tool(
        async ({ date, employeeId }) => {
            if (hrmsContext.role === 'employee' || hrmsContext.role === 'user')
                return toolError('FORBIDDEN', 'Anomaly detection restricted to HR and Admin.');
            const targetDate = date || new Date().toISOString().split('T')[0];
            const anomalies = await getAttendanceAnomalies(
                hrmsContext.organizationId,
                targetDate,
                employeeId,
            );
            return toolSuccess({ date: targetDate, anomalies, count: anomalies.length });
        },
        {
            name: 'get_attendance_anomalies',
            description:
                'Detect anomalies: missing_checkout, absent_without_leave, late_arrival, early_checkout, excessive_duration. Defaults to today. HR/Admin only.',
            schema: z.object({
                date: z
                    .string()
                    .optional()
                    .describe(
                        'YYYY-MM-DD — use getCurrentDateTimeTool to determine org-timezone date',
                    ),
                employeeId: z.string().uuid().optional(),
            }),
        },
    );
}

import { tool } from 'langchain';
import * as z from 'zod';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import { getTeamAvailability } from '../../../../dao/leave.dao.js';

export function createGetTeamAvailabilityTool(hrmsContext) {
    return tool(
        async ({ departmentId, startDate, endDate }) => {
            if (hrmsContext.role === 'employee' || hrmsContext.role === 'user')
                return toolError('FORBIDDEN', 'Team availability restricted to HR and Admin.');
            const start = new Date(startDate),
                end = new Date(endDate);
            if (isNaN(start) || isNaN(end) || start > end)
                return toolError('INVALID_DATE_RANGE', 'startDate must be before endDate.');
            if ((end - start) / 86400000 > 31)
                return toolError(
                    'INVALID_DATE_RANGE',
                    'Range cannot exceed 31 days for team availability.',
                );
            const availability = await getTeamAvailability(
                hrmsContext.organizationId,
                departmentId || null,
                startDate,
                endDate,
            );
            return toolSuccess(availability);
        },
        {
            name: 'get_team_availability',
            description:
                'Per-day team availability: total vs on leave vs on holiday. HR/Admin only. Max 31-day range.',
            schema: z.object({
                departmentId: z.string().uuid().optional(),
                startDate: z.string(),
                endDate: z.string(),
            }),
        },
    );
}

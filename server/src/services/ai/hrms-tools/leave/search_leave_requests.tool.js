import { tool } from 'langchain';
import * as z from 'zod';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import { listLeaveRequests } from '../../../../dao/leave.dao.js';

export function createSearchLeaveRequestsTool(hrmsContext) {
    return tool(
        async ({
            employeeId,
            departmentId,
            leaveTypeId,
            status,
            startDate,
            endDate,
            limit = 20,
        }) => {
            if (hrmsContext.role === 'user') return toolError('FORBIDDEN', 'Access denied.');
            let scopedEmpId = employeeId;
            if (hrmsContext.role === 'employee') {
                if (!hrmsContext.employeeId)
                    return toolError('NOT_AN_EMPLOYEE', 'No linked employee record.');
                scopedEmpId = hrmsContext.employeeId;
            }
            const requests = await listLeaveRequests(hrmsContext.organizationId, {
                employeeId: scopedEmpId,
                departmentId,
                leaveTypeId,
                status,
                startDate,
                endDate,
                limit: Math.min(limit, 50),
            });
            return toolSuccess(requests);
        },
        {
            name: 'search_leave_requests',
            description:
                'Search leave requests. Employee: auto-scoped to own. HR/Admin: org-wide with optional filters.',
            schema: z.object({
                employeeId: z.string().uuid().optional(),
                departmentId: z.string().uuid().optional(),
                leaveTypeId: z.string().uuid().optional(),
                status: z.enum(['pending', 'approved', 'rejected', 'cancelled']).optional(),
                startDate: z.string().optional(),
                endDate: z.string().optional(),
                limit: z.number().int().min(1).max(50).default(20).optional(),
            }),
        },
    );
}

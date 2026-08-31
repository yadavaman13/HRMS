import { tool } from 'langchain';
import * as z from 'zod';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import { listEmployees } from '../../../../dao/employee.dao.js';

export function createSearchEmployeesTool(hrmsContext) {
    return tool(
        async ({ query, departmentId, managerId, locationId, employmentStatus, limit = 20 }) => {
            if (hrmsContext.role === 'user') return toolError('FORBIDDEN', 'Access denied.');
            if (hrmsContext.role === 'employee') {
                if (!hrmsContext.employeeId)
                    return toolError('NOT_AN_EMPLOYEE', 'No linked employee record.');
                const results = await listEmployees(hrmsContext.organizationId, {
                    search: query,
                    limit: 1,
                });
                const own = results.find((e) => e.id === hrmsContext.employeeId);
                return toolSuccess(own ? [own] : []);
            }
            const employees = await listEmployees(hrmsContext.organizationId, {
                search: query,
                departmentId,
                managerId,
                locationId,
                status: employmentStatus,
                limit: Math.min(limit, 50),
                offset: 0,
            });
            return toolSuccess(employees.map(({ _dateOfBirth, ...rest }) => rest));
        },
        {
            name: 'search_employees',
            description:
                'Search employees in the organization. HR/admin: org-wide. Employee: own record only. Never accepts organizationId as argument.',
            schema: z.object({
                query: z.string().optional(),
                departmentId: z.string().uuid().optional(),
                managerId: z.string().uuid().optional(),
                locationId: z.string().uuid().optional(),
                employmentStatus: z.enum(['active', 'inactive', 'terminated']).optional(),
                limit: z.number().int().min(1).max(50).default(20).optional(),
            }),
        },
    );
}

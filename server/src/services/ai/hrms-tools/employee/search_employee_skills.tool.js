import { tool } from 'langchain';
import * as z from 'zod';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import { searchEmployeesBySkill } from '../../../../dao/employee.dao.js';

export function createSearchEmployeeSkillsTool(hrmsContext) {
    return tool(
        async ({ skill, proficiency, limit = 20 }) => {
            if (hrmsContext.role === 'user') return toolError('FORBIDDEN', 'Access denied.');
            const results = await searchEmployeesBySkill(
                hrmsContext.organizationId,
                skill,
                proficiency,
                Math.min(limit, 50),
            );
            return toolSuccess(results);
        },
        {
            name: 'search_employee_skills',
            description:
                'Find employees with a specific skill. All roles (except user) can use this.',
            schema: z.object({
                skill: z.string().min(1),
                proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
                limit: z.number().int().min(1).max(50).default(20).optional(),
            }),
        },
    );
}

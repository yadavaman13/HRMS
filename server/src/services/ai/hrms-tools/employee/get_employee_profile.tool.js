import { tool } from 'langchain';
import * as z from 'zod';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import {
    getFullEmployeeProfile,
    getEmployeeSkills,
    getEmployeeCertifications,
} from '../../../../dao/employee.dao.js';
import { getEmployeeScheduleDays } from '../../../../dao/leave.dao.js';

export function createGetEmployeeProfileTool(hrmsContext) {
    return tool(
        async ({ employeeId }) => {
            const targetId = employeeId || hrmsContext.employeeId;
            if (!targetId)
                return toolError('NOT_AN_EMPLOYEE', 'No employee record linked to this account.');
            if (hrmsContext.role === 'user') return toolError('FORBIDDEN', 'Access denied.');
            if (hrmsContext.role === 'employee' && targetId !== hrmsContext.employeeId)
                return toolError('FORBIDDEN', 'You can only view your own profile.');

            const profile = await getFullEmployeeProfile(targetId);
            if (!profile || profile.organizationId !== hrmsContext.organizationId)
                return toolError('NOT_FOUND', 'Employee not found.');

            const { _dateOfBirth, _gender, _maritalStatus, ...safeProfile } = profile;
            const [skills, certifications, scheduleDays] = await Promise.all([
                getEmployeeSkills(targetId),
                getEmployeeCertifications(targetId),
                getEmployeeScheduleDays(targetId),
            ]);
            return toolSuccess({ profile: safeProfile, skills, certifications, scheduleDays });
        },
        {
            name: 'get_employee_profile',
            description:
                'Retrieve employee profile with skills, certifications, and schedule. Employee: own only. HR/Admin: any in org.',
            schema: z.object({ employeeId: z.string().uuid().optional() }),
        },
    );
}

import { getEmployeeByUserId } from '../../../dao/employee.dao.js';

// organizationId ALWAYS comes from token/user — NEVER from LLM arguments
export async function resolveHrmsContext(user) {
    const employee = await getEmployeeByUserId(user.id);
    return {
        userId: user.id,
        organizationId: user.organizationId,
        role: user.role,
        employeeId: employee?.id ?? null,
    };
}

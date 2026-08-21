import { getUserByEmail } from '../dao/user.dao.js';
import { signToken } from '../modules/auth/utils/jwt.js';

export async function getTestAuthTokens() {
    const admin = await getUserByEmail('admin@example.com');
    const hr = await getUserByEmail('hr@example.com');
    const employee = await getUserByEmail('employee@example.com');

    return {
        adminToken: admin
            ? signToken({ id: admin.id, email: admin.email, role: admin.role })
            : null,
        adminUser: admin,
        hrToken: hr ? signToken({ id: hr.id, email: hr.email, role: hr.role }) : null,
        hrUser: hr,
        employeeToken: employee
            ? signToken({ id: employee.id, email: employee.email, role: employee.role })
            : null,
        employeeUser: employee,
    };
}

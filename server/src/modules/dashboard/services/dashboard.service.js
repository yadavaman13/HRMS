import * as dashboardDao from '../../../dao/dashboard.dao.js';
import * as employeeDao from '../../../dao/employee.dao.js';
import { AppError } from '../../auth/utils/appError.js';

export async function getAdminDashboard(organizationId) {
    return await dashboardDao.getAdminDashboardOverview(organizationId);
}

export async function getEmployeeDashboard(organizationId, userId) {
    const employee = await employeeDao.getEmployeeByUserId(userId);
    if (!employee) {
        throw new AppError('No employee profile linked to this user account', 404);
    }
    return await dashboardDao.getEmployeeDashboardOverview(organizationId, employee.id, userId);
}

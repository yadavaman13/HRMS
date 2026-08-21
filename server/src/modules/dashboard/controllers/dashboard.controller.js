import * as dashboardService from '../services/dashboard.service.js';
import { sendResponse } from '../../../utils/response.utlis.js';

/**
 * Smart role-based dashboard router:
 * - If Admin/HR -> returns Executive Org Dashboard
 * - If Employee -> returns Employee Self-Service Dashboard
 */
export async function getDashboard(req, res, next) {
    try {
        if (req.user.role === 'admin' || req.user.role === 'hr') {
            const data = await dashboardService.getAdminDashboard(req.user.organizationId);
            return sendResponse({
                res,
                statusCode: 200,
                message: 'Admin executive dashboard retrieved',
                success: true,
                data: { role: req.user.role, dashboard: data },
            });
        } else {
            const data = await dashboardService.getEmployeeDashboard(
                req.user.organizationId,
                req.user.id,
            );
            return sendResponse({
                res,
                statusCode: 200,
                message: 'Employee dashboard retrieved',
                success: true,
                data: { role: req.user.role, dashboard: data },
            });
        }
    } catch (error) {
        next(error);
    }
}

export async function getAdminDashboard(req, res, next) {
    try {
        const data = await dashboardService.getAdminDashboard(req.user.organizationId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Admin dashboard analytics retrieved',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

export async function getEmployeeDashboard(req, res, next) {
    try {
        const data = await dashboardService.getEmployeeDashboard(
            req.user.organizationId,
            req.user.id,
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Employee self-service dashboard retrieved',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

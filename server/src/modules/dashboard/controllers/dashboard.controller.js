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

export async function getAttendanceDashboard(req, res, next) {
    try {
        const fullDashboard = await dashboardService.getAdminDashboard(req.user.organizationId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Attendance dashboard analytics retrieved',
            success: true,
            data: {
                todayAttendance: fullDashboard.todayAttendance,
                past7DaysAttendance: fullDashboard.past7DaysAttendance,
                pendingAdjustments: fullDashboard.pendingAdjustments,
                upcomingHolidays: fullDashboard.upcomingHolidays,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getLeaveDashboard(req, res, next) {
    try {
        const fullDashboard = await dashboardService.getAdminDashboard(req.user.organizationId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Leave dashboard analytics retrieved',
            success: true,
            data: {
                pendingLeaves: fullDashboard.pendingQueues?.recentPendingLeaves || [],
                pendingLeavesCount: fullDashboard.pendingQueues?.leavesCount || 0,
                leaveDistribution: fullDashboard.leaveDistribution,
                upcomingHolidays: fullDashboard.upcomingHolidays,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getEmployeesDashboard(req, res, next) {
    try {
        const fullDashboard = await dashboardService.getAdminDashboard(req.user.organizationId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Employees workforce dashboard analytics retrieved',
            success: true,
            data: {
                headcount: fullDashboard.headcount,
                departmentBreakdown: fullDashboard.departmentBreakdown,
                employmentTypeBreakdown: fullDashboard.employmentTypeBreakdown,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function getPayrollDashboard(req, res, next) {
    try {
        const fullDashboard = await dashboardService.getAdminDashboard(req.user.organizationId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Payroll overview dashboard retrieved',
            success: true,
            data: {
                payrollMetrics: fullDashboard.payrollMetrics,
            },
        });
    } catch (error) {
        next(error);
    }
}

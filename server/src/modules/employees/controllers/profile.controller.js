import * as employeeService from '../services/employee.service.js';
import * as employeeDao from '../../../dao/employee.dao.js';
import { sendResponse } from '../../../utils/response.utlis.js';

/**
 * Get logged-in user's profile
 */
export async function getMyProfile(req, res, next) {
    try {
        const employee = await employeeDao.getEmployeeByUserId(req.user.id);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'No employee profile linked to this account',
                success: false,
            });
        }
        const data = await employeeService.getProfile(employee.id, req.user.role);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'My profile retrieved successfully.',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update logged-in user's profile (rejects restricted employment/admin fields for employees)
 */
export async function updateMyProfile(req, res, next) {
    try {
        const employee = await employeeDao.getEmployeeByUserId(req.user.id);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'No employee profile linked to this account',
                success: false,
            });
        }

        // Enforce administrative fields check: if not admin/hr, reject if any of these are present
        const restrictedFields = [
            'employeeCode',
            'departmentId',
            'jobPositionId',
            'managerId',
            'locationId',
            'joiningDate',
            'employmentStatus',
            'employmentType',
            'organizationId',
            'salary',
            'monthlyWage',
        ];
        const requestedKeys = Object.keys(req.body);
        const hasRestricted = requestedKeys.some((key) => restrictedFields.includes(key));

        if (hasRestricted && req.user.role !== 'admin' && req.user.role !== 'hr') {
            return sendResponse({
                res,
                statusCode: 403,
                message:
                    'Access denied: You do not have permission to modify employment-related fields',
                success: false,
            });
        }

        const data = await employeeService.updateProfile(
            employee.id,
            req.user.id,
            req.user.role,
            req.body,
        );

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Profile updated successfully',
            success: true,
            data: { employee: data },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get employee profile by ID (Admin/HR view)
 */
export async function getEmployeeProfile(req, res, next) {
    try {
        const employeeId = req.params.employeeId || req.params.id;
        const data = await employeeService.getProfile(employeeId, req.user.role);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Employee profile retrieved successfully',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update employee profile by ID (Admin/HR only)
 */
export async function updateEmployeeProfile(req, res, next) {
    try {
        const employeeId = req.params.employeeId || req.params.id;
        const data = await employeeService.updateProfile(
            employeeId,
            req.user.id,
            req.user.role,
            req.body,
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Employee profile updated successfully',
            success: true,
            data: { employee: data },
        });
    } catch (error) {
        next(error);
    }
}

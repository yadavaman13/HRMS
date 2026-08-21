import * as employeeService from '../services/employee.service.js';
import * as employeeDao from '../../../dao/employee.dao.js';
import { sendResponse } from '../../../utils/response.utlis.js';

/**
 * Get logged-in user's private info (Self)
 */
export async function getMyPrivateInfo(req, res, next) {
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
        const data = await employeeService.getPrivateInfo(employee.id, req.user.role, true);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'My private information retrieved successfully',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update logged-in user's private info (Self)
 */
export async function updateMyPrivateInfo(req, res, next) {
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
        const data = await employeeService.updatePrivateInfo(employee.id, req.user.role, req.body, true);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'My private information updated successfully',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get employee private info (Admin/HR view)
 */
export async function getPrivateInfo(req, res, next) {
    try {
        const employeeId = req.params.employeeId || req.params.id;
        const data = await employeeService.getPrivateInfo(employeeId, req.user.role, false);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Private information retrieved successfully',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update employee private info (Admin/HR only)
 */
export async function updatePrivateInfo(req, res, next) {
    try {
        const employeeId = req.params.employeeId || req.params.id;
        const data = await employeeService.updatePrivateInfo(employeeId, req.user.role, req.body, false);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Private information updated successfully',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update employee bank account details (Admin/HR only)
 */
export async function updateBankAccount(req, res, next) {
    try {
        const employeeId = req.params.employeeId || req.params.id;
        const data = await employeeService.updateBankAccount(employeeId, req.user.role, req.body, false);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Bank account updated successfully',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update employee government identifiers (Admin/HR only)
 */
export async function updateIdentifiers(req, res, next) {
    try {
        const employeeId = req.params.employeeId || req.params.id;
        const data = await employeeService.updateIdentifiers(employeeId, req.user.role, req.body, false);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Identifiers updated successfully',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

import * as employeeService from '../services/employee.service.js';
import * as employeeDao from '../../../dao/employee.dao.js';
import { sendResponse } from '../../../utils/response.utlis.js';

export async function getDirectory(req, res, next) {
    try {
        const { status, departmentId, limit, offset } = req.query;
        const data = await employeeService.getDirectory(
            req.user.organizationId,
            req.user.id,
            req.user.role,
            { status, departmentId, limit: +limit || 100, offset: +offset || 0 },
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Employee directory retrieved',
            success: true,
            data: { employees: data },
        });
    } catch (error) {
        next(error);
    }
}

export async function getProfile(req, res, next) {
    try {
        const data = await employeeService.getProfile(req.params.id, req.user.role);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Employee profile retrieved',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

export async function getPrivateInfo(req, res, next) {
    try {
        const data = await employeeService.getPrivateInfo(req.params.id, req.user.role);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Private information retrieved',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

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
            message: 'My profile retrieved',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

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
        const data = await employeeService.getPrivateInfo(employee.id, req.user.role);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Private information retrieved',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateProfile(req, res, next) {
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
        const data = await employeeService.updateProfile(
            employee.id,
            req.user.id,
            req.user.role,
            req.body,
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Profile updated',
            success: true,
            data: { employee: data },
        });
    } catch (error) {
        next(error);
    }
}

export async function updateEmployeeProfile(req, res, next) {
    try {
        const data = await employeeService.updateProfile(
            req.params.id,
            req.user.id,
            req.user.role,
            req.body,
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Employee profile updated',
            success: true,
            data: { employee: data },
        });
    } catch (error) {
        next(error);
    }
}

export async function updatePrivateInfo(req, res, next) {
    try {
        const data = await employeeService.updatePrivateInfo(
            req.params.id,
            req.user.role,
            req.body,
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Private information updated',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateBankAccount(req, res, next) {
    try {
        const data = await employeeService.updateBankAccount(
            req.params.id,
            req.user.role,
            req.body,
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Bank account updated',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

export async function updateIdentifiers(req, res, next) {
    try {
        const data = await employeeService.updateIdentifiers(
            req.params.id,
            req.user.role,
            req.body,
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Identifiers updated',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}
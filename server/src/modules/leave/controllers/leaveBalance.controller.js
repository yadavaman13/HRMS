import * as leaveDao from '../../../dao/leave.dao.js';
import { getEmployeeByUserId, getEmployeeById } from '../../../dao/employee.dao.js';
import { sendResponse } from '../../../utils/response.utlis.js';

/**
 * Get current employee's available vs utilized leave balances
 */
export async function getMyBalances(req, res, next) {
    try {
        const employee = await getEmployeeByUserId(req.user.id);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee profile not found for authenticated user',
                success: false,
            });
        }

        const balances = await leaveDao.getEmployeeLeaveBalances(
            employee.id,
            employee.organizationId,
        );

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Leave balances retrieved successfully',
            success: true,
            data: balances,
        });
    } catch (error) {
        console.error('getMyBalances error:', error);
        next(error);
    }
}

/**
 * Get leave balances for a specific employee (Admin / HR)
 */
export async function getEmployeeBalances(req, res, next) {
    try {
        const { employeeId } = req.params;
        const employee = await getEmployeeById(employeeId);

        if (!employee || employee.organizationId !== req.user.organizationId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee not found',
                success: false,
            });
        }

        const balances = await leaveDao.getEmployeeLeaveBalances(
            employee.id,
            employee.organizationId,
        );

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Employee leave balances retrieved successfully',
            success: true,
            data: {
                employee: {
                    id: employee.id,
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    employeeCode: employee.employeeCode,
                },
                balances,
            },
        });
    } catch (error) {
        console.error('getEmployeeBalances error:', error);
        next(error);
    }
}

/**
 * Allocate leave quota to an employee (Admin / HR)
 */
export async function allocateLeave(req, res, next) {
    try {
        const {
            employeeId,
            leaveTypeId,
            periodStart,
            periodEnd,
            allocatedDays,
            carriedForwardDays = 0,
            description,
        } = req.body;

        const employee = await getEmployeeById(employeeId);
        if (!employee || employee.organizationId !== req.user.organizationId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee not found',
                success: false,
            });
        }

        const leaveType = await leaveDao.getLeaveTypeById(leaveTypeId);
        if (!leaveType || leaveType.organizationId !== req.user.organizationId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Leave type not found',
                success: false,
            });
        }

        if (new Date(periodEnd) < new Date(periodStart)) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'periodEnd must be on or after periodStart',
                success: false,
            });
        }

        const allocation = await leaveDao.createLeaveAllocationTx({
            employeeId,
            leaveTypeId,
            periodStart,
            periodEnd,
            allocatedDays,
            carriedForwardDays,
            createdBy: req.user.id,
            description:
                description ||
                `Quota allocated for ${leaveType.name} (${periodStart} to ${periodEnd})`,
        });

        return sendResponse({
            res,
            statusCode: 201,
            message: 'Leave quota allocated successfully',
            success: true,
            data: allocation,
        });
    } catch (error) {
        console.error('allocateLeave error:', error);
        next(error);
    }
}

/**
 * Get current employee's allocation history
 */
export async function getMyAllocations(req, res, next) {
    try {
        const employee = await getEmployeeByUserId(req.user.id);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee profile not found for authenticated user',
                success: false,
            });
        }

        const allocations = await leaveDao.getEmployeeAllocations(employee.id, {
            year: req.query.year,
            leaveTypeId: req.query.leaveTypeId,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Allocations retrieved successfully',
            success: true,
            data: allocations,
        });
    } catch (error) {
        console.error('getMyAllocations error:', error);
        next(error);
    }
}

/**
 * Get allocations for a specific employee (Admin / HR)
 */
export async function getEmployeeAllocations(req, res, next) {
    try {
        const { employeeId } = req.params;
        const employee = await getEmployeeById(employeeId);

        if (!employee || employee.organizationId !== req.user.organizationId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee not found',
                success: false,
            });
        }

        const allocations = await leaveDao.getEmployeeAllocations(employee.id, {
            year: req.query.year,
            leaveTypeId: req.query.leaveTypeId,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Employee allocations retrieved successfully',
            success: true,
            data: allocations,
        });
    } catch (error) {
        console.error('getEmployeeAllocations error:', error);
        next(error);
    }
}

/**
 * Get current employee's ledger transactions
 */
export async function getMyTransactions(req, res, next) {
    try {
        const employee = await getEmployeeByUserId(req.user.id);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee profile not found for authenticated user',
                success: false,
            });
        }

        const transactions = await leaveDao.getLeaveTransactions(employee.id, {
            leaveTypeId: req.query.leaveTypeId,
            limit: req.query.limit ? parseInt(req.query.limit, 10) : 50,
            offset: req.query.offset ? parseInt(req.query.offset, 10) : 0,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Leave transactions retrieved successfully',
            success: true,
            data: transactions,
        });
    } catch (error) {
        console.error('getMyTransactions error:', error);
        next(error);
    }
}

/**
 * Get ledger transactions for a specific employee (Admin / HR)
 */
export async function getEmployeeTransactions(req, res, next) {
    try {
        const { employeeId } = req.params;
        const employee = await getEmployeeById(employeeId);

        if (!employee || employee.organizationId !== req.user.organizationId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee not found',
                success: false,
            });
        }

        const transactions = await leaveDao.getLeaveTransactions(employee.id, {
            leaveTypeId: req.query.leaveTypeId,
            limit: req.query.limit ? parseInt(req.query.limit, 10) : 50,
            offset: req.query.offset ? parseInt(req.query.offset, 10) : 0,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Employee leave transactions retrieved successfully',
            success: true,
            data: transactions,
        });
    } catch (error) {
        console.error('getEmployeeTransactions error:', error);
        next(error);
    }
}

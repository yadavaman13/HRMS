import * as leaveDao from '../../../dao/leave.dao.js';
import { getEmployeeById } from '../../../dao/employee.dao.js';
import { calculateLeaveWorkingDays } from '../../../utils/leave.utils.js';
import { sendResponse } from '../../../utils/response.utlis.js';

/**
 * Company-wide Leave Requests Inbox (Admin / HR)
 */
export async function getAllRequests(req, res, next) {
    try {
        const organizationId = req.user.organizationId;
        const {
            employeeId,
            departmentId,
            status,
            startDate,
            endDate,
            limit = 50,
            offset = 0,
        } = req.query;

        const requests = await leaveDao.listLeaveRequests(organizationId, {
            employeeId,
            departmentId,
            status,
            startDate,
            endDate,
            limit: parseInt(limit, 10) || 50,
            offset: parseInt(offset, 10) || 0,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Leave requests retrieved successfully',
            success: true,
            data: requests,
        });
    } catch (error) {
        console.error('getAllRequests error:', error);
        next(error);
    }
}

/**
 * Approve a Leave Request (Admin / HR)
 */
export async function approveRequest(req, res, next) {
    try {
        const { requestId } = req.params;
        const { hrComment } = req.body;

        const leaveRequest = await leaveDao.getLeaveRequestById(requestId);
        if (!leaveRequest || leaveRequest.organizationId !== req.user.organizationId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Leave request not found',
                success: false,
            });
        }

        if (leaveRequest.status !== 'pending') {
            return sendResponse({
                res,
                statusCode: 400,
                message: `Cannot approve leave request with status '${leaveRequest.status}'`,
                success: false,
            });
        }

        const employee = await getEmployeeById(leaveRequest.employeeId);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee record not found',
                success: false,
            });
        }

        const leaveType = {
            id: leaveRequest.leaveTypeId,
            name: leaveRequest.leaveTypeName,
            code: leaveRequest.leaveTypeCode,
            requiresAllocation: leaveRequest.leaveTypeRequiresAllocation,
        };

        // 1. Recalculate working dates to ensure precision for attendance synchronization
        const scheduleDays = await leaveDao.getEmployeeScheduleDays(
            employee.id,
            employee.organizationId,
        );
        const orgHolidays = await leaveDao.getOrganizationHolidays(
            employee.organizationId,
            leaveRequest.startDate,
            leaveRequest.endDate,
        );
        const calculation = calculateLeaveWorkingDays({
            startDate: leaveRequest.startDate,
            endDate: leaveRequest.endDate,
            startHalf: leaveRequest.startHalf,
            endHalf: leaveRequest.endHalf,
            scheduleDays,
            holidays: orgHolidays,
        });

        // 2. If allocation is required, check available balance
        if (leaveType.requiresAllocation) {
            const balances = await leaveDao.getEmployeeLeaveBalances(
                employee.id,
                employee.organizationId,
            );
            const typeBalance = balances.find((b) => b.leaveTypeId === leaveType.id);
            const netBalance = typeBalance ? typeBalance.netBalance : 0;
            const requested = Number(leaveRequest.requestedDays);

            if (requested > netBalance) {
                return sendResponse({
                    res,
                    statusCode: 400,
                    message: `Cannot approve: Employee has insufficient net balance (${netBalance} available vs ${requested} requested)`,
                    success: false,
                });
            }
        }

        // 3. Execute approval transaction (updates request, posts ledger debit, syncs attendance)
        const updated = await leaveDao.approveLeaveRequestTx({
            requestId,
            approverUserId: req.user.id,
            hrComment,
            workingDates: calculation.workingDates,
            leaveType,
            employee,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Leave request approved successfully',
            success: true,
            data: updated,
        });
    } catch (error) {
        console.error('approveRequest error:', error);
        next(error);
    }
}

/**
 * Reject a Leave Request (Admin / HR)
 */
export async function rejectRequest(req, res, next) {
    try {
        const { requestId } = req.params;
        const { hrComment } = req.body;

        const leaveRequest = await leaveDao.getLeaveRequestById(requestId);
        if (!leaveRequest || leaveRequest.organizationId !== req.user.organizationId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Leave request not found',
                success: false,
            });
        }

        if (leaveRequest.status !== 'pending') {
            return sendResponse({
                res,
                statusCode: 400,
                message: `Cannot reject leave request with status '${leaveRequest.status}'`,
                success: false,
            });
        }

        const employee = await getEmployeeById(leaveRequest.employeeId);

        const updated = await leaveDao.rejectLeaveRequestTx({
            requestId,
            rejectorUserId: req.user.id,
            hrComment,
            employee,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Leave request rejected successfully',
            success: true,
            data: updated,
        });
    } catch (error) {
        console.error('rejectRequest error:', error);
        next(error);
    }
}

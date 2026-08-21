import * as leaveDao from '../../../dao/leave.dao.js';
import { getEmployeeByUserId } from '../../../dao/employee.dao.js';
import { calculateLeaveWorkingDays } from '../../../utils/leave.utils.js';
import { sendResponse } from '../../../utils/response.utlis.js';

/**
 * Apply for a Leave Request (Employee Self-Service)
 */
export async function applyLeave(req, res, next) {
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

        const {
            leaveTypeId,
            startDate,
            endDate,
            startHalf = 'none',
            endHalf = 'none',
            reason,
            attachmentUrl,
        } = req.body;

        if (new Date(endDate) < new Date(startDate)) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'End date must be on or after start date',
                success: false,
            });
        }

        // 1. Verify leave type
        const leaveType = await leaveDao.getLeaveTypeById(leaveTypeId);
        if (!leaveType || leaveType.organizationId !== employee.organizationId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Invalid leave type selected',
                success: false,
            });
        }

        if (!leaveType.isActive) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'Selected leave type is currently inactive',
                success: false,
            });
        }

        // 2. Validate mandatory attachment (e.g. for sick leave if required)
        if (leaveType.requiresAttachment && !attachmentUrl) {
            return sendResponse({
                res,
                statusCode: 400,
                message: `Attachment is mandatory for ${leaveType.name}`,
                success: false,
            });
        }

        // 3. Fetch schedule days & organization holidays
        const scheduleDays = await leaveDao.getEmployeeScheduleDays(
            employee.id,
            employee.organizationId,
        );
        const orgHolidays = await leaveDao.getOrganizationHolidays(
            employee.organizationId,
            startDate,
            endDate,
        );

        // 4. Calculate net working days (excluding weekends & holidays)
        const { totalDays, workingDates, breakdown } = calculateLeaveWorkingDays({
            startDate,
            endDate,
            startHalf,
            endHalf,
            scheduleDays,
            holidays: orgHolidays,
        });

        if (totalDays <= 0) {
            return sendResponse({
                res,
                statusCode: 400,
                message:
                    'The selected date range contains no working days (all dates are weekly offs or holidays)',
                success: false,
                data: { breakdown },
            });
        }

        // 5. Check for overlapping requests (pending or approved)
        const overlap = await leaveDao.checkLeaveOverlap(employee.id, startDate, endDate);
        if (overlap) {
            return sendResponse({
                res,
                statusCode: 400,
                message: `Overlapping leave request found between ${overlap.startDate} and ${overlap.endDate} (Status: ${overlap.status.toUpperCase()})`,
                success: false,
                data: { conflictingRequest: overlap },
            });
        }

        // 6. Check balance sufficiency if leave type requires allocation
        if (leaveType.requiresAllocation) {
            const balances = await leaveDao.getEmployeeLeaveBalances(
                employee.id,
                employee.organizationId,
            );
            const typeBalance = balances.find((b) => b.leaveTypeId === leaveTypeId);

            const available = typeBalance ? typeBalance.availableBalance : 0;
            if (totalDays > available) {
                return sendResponse({
                    res,
                    statusCode: 400,
                    message: `Insufficient leave balance for ${leaveType.name}. Available: ${available} day(s), Requested: ${totalDays} day(s)`,
                    success: false,
                    data: {
                        availableBalance: available,
                        requestedDays: totalDays,
                    },
                });
            }
        }

        // 7. Create leave request
        const newRequest = await leaveDao.createLeaveRequest({
            employeeId: employee.id,
            leaveTypeId,
            startDate,
            endDate,
            startHalf,
            endHalf,
            requestedDays: String(totalDays),
            reason: reason || null,
            status: 'pending',
            attachmentUrl: attachmentUrl || null,
            submittedAt: new Date(),
        });

        return sendResponse({
            res,
            statusCode: 201,
            message: 'Leave request submitted successfully',
            success: true,
            data: {
                request: newRequest,
                workingDays: totalDays,
                workingDates,
                breakdown,
            },
        });
    } catch (error) {
        console.error('applyLeave error:', error);
        next(error);
    }
}

/**
 * Get current employee's leave request history
 */
export async function getMyRequests(req, res, next) {
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

        const requests = await leaveDao.listLeaveRequests(employee.organizationId, {
            employeeId: employee.id,
            status: req.query.status,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            limit: req.query.limit ? parseInt(req.query.limit, 10) : 50,
            offset: req.query.offset ? parseInt(req.query.offset, 10) : 0,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Leave requests retrieved successfully',
            success: true,
            data: requests,
        });
    } catch (error) {
        console.error('getMyRequests error:', error);
        next(error);
    }
}

/**
 * Get details of a single leave request
 */
export async function getLeaveRequestById(req, res, next) {
    try {
        const { requestId } = req.params;
        const leaveRequest = await leaveDao.getLeaveRequestById(requestId);

        if (!leaveRequest || leaveRequest.organizationId !== req.user.organizationId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Leave request not found',
                success: false,
            });
        }

        // If regular employee, verify ownership
        if (req.user.role === 'employee') {
            const employee = await getEmployeeByUserId(req.user.id);
            if (!employee || employee.id !== leaveRequest.employeeId) {
                return sendResponse({
                    res,
                    statusCode: 403,
                    message: 'You do not have permission to view this leave request',
                    success: false,
                });
            }
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Leave request retrieved successfully',
            success: true,
            data: leaveRequest,
        });
    } catch (error) {
        console.error('getLeaveRequestById error:', error);
        next(error);
    }
}

/**
 * Cancel a leave request (Employee Self-Service)
 */
export async function cancelLeaveRequest(req, res, next) {
    try {
        const { requestId } = req.params;
        const { reason } = req.body;

        const employee = await getEmployeeByUserId(req.user.id);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee profile not found for authenticated user',
                success: false,
            });
        }

        const leaveRequest = await leaveDao.getLeaveRequestById(requestId);
        if (!leaveRequest || leaveRequest.employeeId !== employee.id) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Leave request not found or does not belong to you',
                success: false,
            });
        }

        if (leaveRequest.status === 'cancelled') {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'This leave request is already cancelled',
                success: false,
            });
        }

        if (leaveRequest.status === 'rejected') {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'Cannot cancel a rejected leave request',
                success: false,
            });
        }

        const wasApproved = leaveRequest.status === 'approved';

        // If it was approved, calculate working dates to revert attendance
        let workingDates = [];
        const leaveType = {
            id: leaveRequest.leaveTypeId,
            name: leaveRequest.leaveTypeName,
            requiresAllocation: leaveRequest.leaveTypeRequiresAllocation,
        };

        if (wasApproved) {
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
            workingDates = calculation.workingDates;
        }

        const updated = await leaveDao.cancelLeaveRequestTx({
            requestId,
            actorUserId: req.user.id,
            reason,
            wasApproved,
            leaveType,
            workingDates,
            employee,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: wasApproved
                ? 'Approved leave request cancelled and balance restored successfully'
                : 'Leave request cancelled successfully',
            success: true,
            data: updated,
        });
    } catch (error) {
        console.error('cancelLeaveRequest error:', error);
        next(error);
    }
}

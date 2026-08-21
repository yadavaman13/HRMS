import { db } from '../../../config/database.config.js';
import * as attendanceDao from '../../../dao/attendance.dao.js';
import { getEmployeeByUserId } from '../../../dao/employee.dao.js';
import { sendResponse } from '../../../utils/response.utlis.js';

/**
 * Submit an attendance regularization / adjustment request
 */
export async function requestAdjustment(req, res, next) {
    try {
        const { attendanceId } = req.params;
        const { reason, checkInAt, checkOutAt, totalWorkMinutes, status, remarks } = req.body;

        const record = await attendanceDao.getAttendanceRecordById(attendanceId);
        if (!record) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Attendance record not found',
                success: false,
            });
        }

        // Validate user owns the record if employee
        if (req.user.role === 'employee' || req.user.role === 'user') {
            const employee = await getEmployeeByUserId(req.user.id);
            if (!employee || employee.id !== record.employeeId) {
                return sendResponse({
                    res,
                    statusCode: 403,
                    message: 'You can only request adjustments for your own attendance records',
                    success: false,
                });
            }
        }

        const oldValue = {
            status: record.status,
            totalWorkMinutes: record.totalWorkMinutes,
            scheduledWorkMinutes: record.scheduledWorkMinutes,
            overtimeMinutes: record.overtimeMinutes,
            lateMinutes: record.lateMinutes,
            earlyCheckoutMinutes: record.earlyCheckoutMinutes,
            remarks: record.remarks,
        };

        const newValue = {
            checkInAt: checkInAt || null,
            checkOutAt: checkOutAt || null,
            totalWorkMinutes:
                totalWorkMinutes !== undefined ? totalWorkMinutes : record.totalWorkMinutes,
            status: status || record.status,
            remarks: remarks || record.remarks,
        };

        const adjustment = await attendanceDao.createAdjustment({
            attendanceRecordId: attendanceId,
            requestedBy: req.user.id,
            oldValue,
            newValue,
            reason,
            status: 'pending',
        });

        return sendResponse({
            res,
            statusCode: 201,
            message: 'Attendance regularization request submitted successfully',
            success: true,
            data: adjustment,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Directly update an attendance record (Admin/HR)
 */
export async function updateAttendanceRecord(req, res, next) {
    try {
        const { attendanceId } = req.params;
        const {
            status,
            totalWorkMinutes,
            overtimeMinutes,
            lateMinutes,
            earlyCheckoutMinutes,
            remarks,
            source,
        } = req.body;

        const existingRecord = await attendanceDao.getAttendanceRecordById(attendanceId);
        if (!existingRecord) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Attendance record not found',
                success: false,
            });
        }

        const updateData = {};
        if (status !== undefined) updateData.status = status;
        if (totalWorkMinutes !== undefined) updateData.totalWorkMinutes = totalWorkMinutes;
        if (overtimeMinutes !== undefined) updateData.overtimeMinutes = overtimeMinutes;
        if (lateMinutes !== undefined) updateData.lateMinutes = lateMinutes;
        if (earlyCheckoutMinutes !== undefined)
            updateData.earlyCheckoutMinutes = earlyCheckoutMinutes;
        if (remarks !== undefined) updateData.remarks = remarks;
        updateData.source = source || 'manual';

        const updated = await attendanceDao.updateAttendanceRecord(attendanceId, updateData);

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Attendance record updated successfully',
            success: true,
            data: updated,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Review (Approve or Reject) an attendance regularization request (Admin/HR)
 */
export async function reviewAdjustment(req, res, next) {
    try {
        const { adjustmentId } = req.params;
        const { status, remarks } = req.body;

        const adjustment = await attendanceDao.getAdjustmentById(adjustmentId);
        if (!adjustment) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Adjustment request not found',
                success: false,
            });
        }

        if (adjustment.status !== 'pending') {
            return sendResponse({
                res,
                statusCode: 400,
                message: `Adjustment request is already ${adjustment.status}`,
                success: false,
            });
        }

        // Execute in an atomic transaction
        const result = await db.transaction(async (tx) => {
            // 1. Update adjustment status
            const updatedAdj = await attendanceDao.updateAdjustment(
                adjustmentId,
                {
                    status,
                    approvedBy: req.user.id,
                },
                tx,
            );

            // 2. If approved, apply newValue changes to the attendance record
            let updatedRecord = null;
            if (status === 'approved') {
                const patch = {
                    source: 'corrected',
                };
                if (adjustment.newValue?.status) patch.status = adjustment.newValue.status;
                if (adjustment.newValue?.totalWorkMinutes !== undefined) {
                    patch.totalWorkMinutes = adjustment.newValue.totalWorkMinutes;
                }
                if (remarks) {
                    patch.remarks = remarks;
                }

                updatedRecord = await attendanceDao.updateAttendanceRecord(
                    adjustment.attendanceRecordId,
                    patch,
                    tx,
                );
            }

            return { adjustment: updatedAdj, record: updatedRecord };
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: `Adjustment request has been ${status}`,
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get company-wide list of regularization adjustments (Admin/HR)
 */
export async function getAdjustments(req, res, next) {
    try {
        const { status, employeeId, limit, offset } = req.query;

        const data = await attendanceDao.getAdjustments({
            organizationId: req.user.organizationId,
            employeeId,
            status,
            limit: limit ? +limit : 50,
            offset: offset ? +offset : 0,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Adjustment requests retrieved',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get current employee's submitted adjustment requests
 */
export async function getMyAdjustments(req, res, next) {
    try {
        const { status, limit, offset } = req.query;

        const data = await attendanceDao.getAdjustments({
            requestedBy: req.user.id,
            status,
            limit: limit ? +limit : 50,
            offset: offset ? +offset : 0,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'My adjustment requests retrieved',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get single adjustment request by ID
 */
export async function getAdjustmentById(req, res, next) {
    try {
        const { adjustmentId } = req.params;
        const adjustment = await attendanceDao.getAdjustmentById(adjustmentId);

        if (!adjustment) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Adjustment request not found',
                success: false,
            });
        }

        // If employee, ensure it's their request
        if (
            (req.user.role === 'employee' || req.user.role === 'user') &&
            adjustment.requestedBy !== req.user.id
        ) {
            return sendResponse({
                res,
                statusCode: 403,
                message: 'You do not have permission to view this adjustment request',
                success: false,
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Adjustment request details retrieved',
            success: true,
            data: adjustment,
        });
    } catch (error) {
        next(error);
    }
}

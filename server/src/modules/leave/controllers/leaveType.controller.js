import * as leaveDao from '../../../dao/leave.dao.js';
import { sendResponse } from '../../../utils/response.utlis.js';

/**
 * List all leave types for current organization
 */
export async function getLeaveTypes(req, res, next) {
    try {
        const organizationId = req.user.organizationId;
        const isActive =
            req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;

        const types = await leaveDao.listLeaveTypes(organizationId, { isActive });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Leave types retrieved successfully',
            success: true,
            data: types,
        });
    } catch (error) {
        console.error('getLeaveTypes error:', error);
        next(error);
    }
}

/**
 * Get leave type by ID
 */
export async function getLeaveTypeById(req, res, next) {
    try {
        const { typeId } = req.params;
        const leaveType = await leaveDao.getLeaveTypeById(typeId);

        if (!leaveType || leaveType.organizationId !== req.user.organizationId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Leave type not found',
                success: false,
            });
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Leave type retrieved successfully',
            success: true,
            data: leaveType,
        });
    } catch (error) {
        console.error('getLeaveTypeById error:', error);
        next(error);
    }
}

/**
 * Create a new leave type (Admin / HR)
 */
export async function createLeaveType(req, res, next) {
    try {
        const organizationId = req.user.organizationId;
        const {
            code,
            name,
            isPaid = true,
            requiresAllocation = true,
            requiresAttachment = false,
            requiresApproval = true,
            unit = 'day',
            isActive = true,
        } = req.body;

        // Check if code already exists in organization
        const existing = await leaveDao.getLeaveTypeByCode(organizationId, code);
        if (existing) {
            return sendResponse({
                res,
                statusCode: 400,
                message: `Leave type with code '${code.toUpperCase()}' already exists`,
                success: false,
            });
        }

        const newType = await leaveDao.createLeaveType({
            organizationId,
            code,
            name,
            isPaid,
            requiresAllocation,
            requiresAttachment,
            requiresApproval,
            unit,
            isActive,
        });

        return sendResponse({
            res,
            statusCode: 201,
            message: 'Leave type created successfully',
            success: true,
            data: newType,
        });
    } catch (error) {
        console.error('createLeaveType error:', error);
        next(error);
    }
}

/**
 * Update existing leave type (Admin / HR)
 */
export async function updateLeaveType(req, res, next) {
    try {
        const { typeId } = req.params;
        const leaveType = await leaveDao.getLeaveTypeById(typeId);

        if (!leaveType || leaveType.organizationId !== req.user.organizationId) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Leave type not found',
                success: false,
            });
        }

        // If code is being changed, ensure uniqueness
        if (req.body.code && req.body.code.toUpperCase() !== leaveType.code) {
            const existing = await leaveDao.getLeaveTypeByCode(
                req.user.organizationId,
                req.body.code,
            );
            if (existing && existing.id !== typeId) {
                return sendResponse({
                    res,
                    statusCode: 400,
                    message: `Leave type with code '${req.body.code.toUpperCase()}' already exists`,
                    success: false,
                });
            }
        }

        const updated = await leaveDao.updateLeaveType(typeId, req.body);

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Leave type updated successfully',
            success: true,
            data: updated,
        });
    } catch (error) {
        console.error('updateLeaveType error:', error);
        next(error);
    }
}

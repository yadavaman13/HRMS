import * as settingsService from '../services/settings.service.js';
import { sendResponse } from '../../../utils/response.utlis.js';

function extractReqMetadata(req) {
    return {
        ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
        userAgent: req.headers['user-agent'],
    };
}

export async function getSettings(req, res, next) {
    try {
        const settings = await settingsService.getSystemSettings(req.user.organizationId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'System settings retrieved successfully',
            success: true,
            data: { settings },
        });
    } catch (error) {
        next(error);
    }
}

export async function updatePayrollSettings(req, res, next) {
    try {
        const payroll = await settingsService.updatePayrollSettings(
            req.user.organizationId,
            req.user.id,
            req.body,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Payroll settings updated successfully',
            success: true,
            data: { payroll },
        });
    } catch (error) {
        next(error);
    }
}

export async function getLeaveTypes(req, res, next) {
    try {
        const leaveTypes = await settingsService.getLeaveTypes(req.user.organizationId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Leave types retrieved successfully',
            success: true,
            data: { leaveTypes },
        });
    } catch (error) {
        next(error);
    }
}

export async function createLeaveType(req, res, next) {
    try {
        const leaveType = await settingsService.createLeaveType(
            req.user.organizationId,
            req.user.id,
            req.body,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 201,
            message: 'Leave type created successfully',
            success: true,
            data: { leaveType },
        });
    } catch (error) {
        next(error);
    }
}

export async function updateLeaveType(req, res, next) {
    try {
        const leaveType = await settingsService.updateLeaveType(
            req.params.id,
            req.user.organizationId,
            req.user.id,
            req.body,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Leave type updated successfully',
            success: true,
            data: { leaveType },
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteLeaveType(req, res, next) {
    try {
        const leaveType = await settingsService.deleteLeaveType(
            req.params.id,
            req.user.organizationId,
            req.user.id,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Leave type deleted successfully',
            success: true,
            data: { leaveType },
        });
    } catch (error) {
        next(error);
    }
}

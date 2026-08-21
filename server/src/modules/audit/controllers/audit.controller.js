import * as auditService from '../services/audit.service.js';
import { sendResponse } from '../../../utils/response.utlis.js';

export async function getLogs(req, res, next) {
    try {
        const { entityType, actorUserId, action, startDate, endDate, limit, offset } = req.query;
        const result = await auditService.getLogs(req.user.organizationId, {
            entityType,
            actorUserId,
            action,
            startDate,
            endDate,
            limit: limit ? +limit : 50,
            offset: offset ? +offset : 0,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Audit logs retrieved successfully',
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function getEntityHistory(req, res, next) {
    try {
        const { entityType, entityId } = req.params;
        const { limit, offset } = req.query;
        const history = await auditService.getEntityHistory(
            entityType,
            entityId,
            limit ? +limit : 50,
            offset ? +offset : 0,
        );

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Entity audit history retrieved successfully',
            success: true,
            data: { history },
        });
    } catch (error) {
        next(error);
    }
}

export async function getLogById(req, res, next) {
    try {
        const log = await auditService.getLogById(req.params.id);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Audit log record retrieved successfully',
            success: true,
            data: { log },
        });
    } catch (error) {
        next(error);
    }
}

export async function getStats(req, res, next) {
    try {
        const stats = await auditService.getStats(req.user.organizationId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Audit statistics retrieved successfully',
            success: true,
            data: { stats },
        });
    } catch (error) {
        next(error);
    }
}

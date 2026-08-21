import { query, param, validationResult } from 'express-validator';
import { sendResponse } from '../../../utils/response.utlis.js';

function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponse({
            res,
            statusCode: 400,
            message: 'Validation failed',
            success: false,
            errors: errors.array(),
        });
    }
    next();
}

export const auditQueryValidator = [
    query('entityType').optional().isString().trim(),
    query('actorUserId').optional().isUUID().withMessage('Invalid actor user ID'),
    query('action').optional().isString().trim(),
    query('startDate').optional().isISO8601().withMessage('Invalid startDate format'),
    query('endDate').optional().isISO8601().withMessage('Invalid endDate format'),
    query('limit').optional().isInt({ min: 1, max: 200 }),
    query('offset').optional().isInt({ min: 0 }),
    validateRequest,
];

export const entityHistoryValidator = [
    param('entityType').notEmpty().isString().trim().withMessage('entityType is required'),
    param('entityId').notEmpty().isUUID().withMessage('Valid entityId UUID is required'),
    query('limit').optional().isInt({ min: 1, max: 200 }),
    query('offset').optional().isInt({ min: 0 }),
    validateRequest,
];

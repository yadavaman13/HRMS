import { body, param, query, validationResult } from 'express-validator';
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

export const notificationListValidator = [
    query('isRead').optional().isIn(['true', 'false']),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
    validateRequest,
];

export const notificationIdValidator = [
    param('id').notEmpty().isUUID().withMessage('Valid notification ID is required'),
    validateRequest,
];

export const broadcastValidator = [
    body('title')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('Notification title is required'),
    body('message').notEmpty().isString().trim().withMessage('Notification message is required'),
    body('type').optional().isString(),
    body('departmentId').optional().isUUID().withMessage('Invalid department ID'),
    body('role').optional().isIn(['admin', 'hr', 'employee', 'user']),
    validateRequest,
];

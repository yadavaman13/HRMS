import { body, query, param, validationResult } from 'express-validator';
import { sendResponse } from '../../../utils/response.utlis.js';

export function validateRequest(req, res, next) {
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

export const checkInValidator = [
    body('checkInTime').optional().isISO8601().withMessage('Invalid check-in timestamp'),
    body('remarks').optional().isString().trim(),
    validateRequest,
];

export const checkOutValidator = [
    body('checkOutTime').optional().isISO8601().withMessage('Invalid check-out timestamp'),
    body('breakMinutes')
        .optional()
        .isInt({ min: 0, max: 1440 })
        .withMessage('Break minutes must be between 0 and 1440'),
    body('remarks').optional().isString().trim(),
    validateRequest,
];

export const attendanceQueryValidator = [
    query('startDate').optional().isDate().withMessage('startDate must be YYYY-MM-DD'),
    query('endDate').optional().isDate().withMessage('endDate must be YYYY-MM-DD'),
    query('date').optional().isDate().withMessage('date must be YYYY-MM-DD'),
    query('month')
        .optional()
        .matches(/^\d{4}-\d{2}$/)
        .withMessage('Month must be in YYYY-MM format'),
    query('year').optional().isInt({ min: 2000, max: 2100 }),
    query('status')
        .optional()
        .isIn(['present', 'absent', 'half_day', 'leave', 'holiday', 'weekly_off', 'incomplete'])
        .withMessage('Invalid attendance status filter'),
    query('departmentId').optional().isUUID().withMessage('Invalid department UUID'),
    query('employeeId').optional().isUUID().withMessage('Invalid employee UUID'),
    query('limit').optional().isInt({ min: 1, max: 200 }),
    query('offset').optional().isInt({ min: 0 }),
    validateRequest,
];

export const adjustRequestValidator = [
    param('attendanceId').isUUID().withMessage('Invalid attendance record UUID'),
    body('reason')
        .notEmpty()
        .withMessage('Reason for adjustment is required')
        .isString()
        .isLength({ min: 3, max: 500 })
        .withMessage('Reason must be between 3 and 500 characters'),
    body('checkInAt').optional().isISO8601().withMessage('Invalid check-in timestamp'),
    body('checkOutAt').optional().isISO8601().withMessage('Invalid check-out timestamp'),
    body('totalWorkMinutes')
        .optional()
        .isInt({ min: 0, max: 1440 })
        .withMessage('totalWorkMinutes must be between 0 and 1440'),
    body('status')
        .optional()
        .isIn(['present', 'absent', 'half_day', 'leave', 'holiday', 'weekly_off', 'incomplete']),
    body('remarks').optional().isString().trim(),
    validateRequest,
];

export const adminUpdateAttendanceValidator = [
    param('attendanceId').isUUID().withMessage('Invalid attendance record UUID'),
    body('status')
        .optional()
        .isIn(['present', 'absent', 'half_day', 'leave', 'holiday', 'weekly_off', 'incomplete']),
    body('totalWorkMinutes').optional().isInt({ min: 0, max: 1440 }),
    body('overtimeMinutes').optional().isInt({ min: 0, max: 1440 }),
    body('lateMinutes').optional().isInt({ min: 0, max: 1440 }),
    body('earlyCheckoutMinutes').optional().isInt({ min: 0, max: 1440 }),
    body('remarks').optional().isString().trim(),
    body('source').optional().isIn(['system', 'manual', 'biometric', 'corrected']),
    validateRequest,
];

export const reviewAdjustmentValidator = [
    param('adjustmentId').isUUID().withMessage('Invalid adjustment UUID'),
    body('status')
        .notEmpty()
        .isIn(['approved', 'rejected'])
        .withMessage('Status must be either approved or rejected'),
    body('remarks').optional().isString().trim(),
    validateRequest,
];

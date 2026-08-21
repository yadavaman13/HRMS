import { body, validationResult } from 'express-validator';
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

export const updateCompanyValidator = [
    body('name').optional().isString().trim().isLength({ min: 2, max: 255 }),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('phone').optional().isString().trim(),
    body('address').optional().isString(),
    body('city').optional().isString().isLength({ max: 100 }),
    body('state').optional().isString().isLength({ max: 100 }),
    body('country').optional().isString().isLength({ max: 100 }),
    body('postalCode').optional().isString().isLength({ max: 20 }),
    body('timezone').optional().isString().isLength({ max: 50 }),
    body('currency').optional().isString().isLength({ min: 3, max: 3 }),
    body('logoUrl').optional().isString(),
    validateRequest,
];

export const locationValidator = [
    body('name')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Location name is required'),
    body('address').optional().isString(),
    body('isActive').optional().isBoolean(),
    validateRequest,
];

export const departmentValidator = [
    body('name')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Department name is required'),
    body('code').optional().isString().trim().isLength({ max: 50 }),
    body('managerEmployeeId').optional().isUUID().withMessage('Invalid manager employee ID'),
    body('isActive').optional().isBoolean(),
    validateRequest,
];

export const jobPositionValidator = [
    body('name')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Job position name is required'),
    body('description').optional().isString(),
    body('isActive').optional().isBoolean(),
    validateRequest,
];

export const workScheduleValidator = [
    body('name')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Schedule name is required'),
    body('timezone').optional().isString().isLength({ max: 50 }),
    body('defaultBreakMinutes').optional().isInt({ min: 0, max: 240 }),
    body('days').optional().isArray().withMessage('Days must be an array of weekday definitions'),
    body('days.*.weekday').optional().isInt({ min: 0, max: 6 }),
    body('days.*.isWorkingDay').optional().isBoolean(),
    body('days.*.startTime')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
        .withMessage('Invalid start time format (HH:MM:SS)'),
    body('days.*.endTime')
        .optional()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/)
        .withMessage('Invalid end time format (HH:MM:SS)'),
    body('days.*.breakMinutes').optional().isInt({ min: 0, max: 240 }),
    validateRequest,
];

export const holidayValidator = [
    body('name')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Holiday name is required'),
    body('holidayDate')
        .notEmpty()
        .isISO8601()
        .toDate()
        .withMessage('Valid holiday date is required (YYYY-MM-DD)'),
    body('isOptional').optional().isBoolean(),
    body('description').optional().isString(),
    validateRequest,
];

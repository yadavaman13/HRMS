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

export const createEmployeeValidator = [
    // Personal fields
    body('firstName').trim().notEmpty().withMessage('First Name is required'),
    body('lastName').optional().trim(),
    body('email')
        .optional({ checkFalsy: true })
        .trim()
        .isEmail()
        .withMessage('A valid personal email is required'),
    body('phone').optional({ checkFalsy: true }).trim(),
    body('profilePicture').optional({ checkFalsy: true }).trim(),

    // Job fields
    body('departmentId')
        .optional({ checkFalsy: true })
        .isUUID()
        .withMessage('Invalid department ID format'),
    body('jobPositionId')
        .optional({ checkFalsy: true })
        .isUUID()
        .withMessage('Invalid job position ID format'),
    body('managerId')
        .optional({ checkFalsy: true })
        .isUUID()
        .withMessage('Invalid manager ID format'),
    body('joiningDate')
        .trim()
        .notEmpty()
        .withMessage('Joining date is required')
        .isISO8601()
        .withMessage('Joining date must be in YYYY-MM-DD format'),
    body('locationId')
        .optional({ checkFalsy: true })
        .isUUID()
        .withMessage('Invalid location ID format'),
    body('employmentType')
        .optional()
        .isIn(['full_time', 'part_time', 'contract', 'intern', 'consultant'])
        .withMessage('Invalid employment type'),

    // Work fields
    body('workScheduleId')
        .optional({ checkFalsy: true })
        .isUUID()
        .withMessage('Invalid work schedule ID format'),

    validateRequest,
];

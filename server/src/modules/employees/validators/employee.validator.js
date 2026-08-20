import { query, body, validationResult } from 'express-validator';
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

export const directoryValidator = [
    query('status').optional().isIn(['active', 'inactive', 'terminated', 'on_leave', 'probation']),
    query('departmentId').optional().isUUID(),
    query('limit').optional().isInt({ min: 1, max: 200 }),
    query('offset').optional().isInt({ min: 0 }),
    validateRequest,
];

export const updateProfileValidator = [
    body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number'),
    body('workEmail').optional().isEmail().withMessage('Invalid work email'),
    body('firstName').optional().isString().isLength({ min: 1, max: 100 }),
    body('lastName').optional().isString().isLength({ min: 1, max: 100 }),
    body('displayName').optional().isString().isLength({ max: 255 }),
    body('dateOfBirth').optional().isISO8601().toDate(),
    body('gender').optional().isIn(['male', 'female', 'other']),
    body('departmentId').optional().isUUID(),
    body('jobPositionId').optional().isUUID(),
    body('managerId').optional().isUUID(),
    body('locationId').optional().isUUID(),
    body('employmentStatus')
        .optional()
        .isIn(['active', 'inactive', 'terminated', 'on_leave', 'probation']),
    body('employmentType')
        .optional()
        .isIn(['full_time', 'part_time', 'contract', 'intern', 'consultant']),
    validateRequest,
];

export const updatePrivateInfoValidator = [
    body('residentialAddress').optional().isString(),
    body('personalEmail').optional().isEmail(),
    body('nationality').optional().isString(),
    body('maritalStatus').optional().isIn(['single', 'married', 'divorced', 'widowed']),
    body('emergencyContactName').optional().isString(),
    body('emergencyContactPhone').optional().isMobilePhone('any'),
    validateRequest,
];

export const updateBankAccountValidator = [
    body('accountHolderName').notEmpty().isString().isLength({ max: 255 }),
    body('accountNumber').notEmpty().isString(),
    body('bankName').notEmpty().isString().isLength({ max: 255 }),
    body('ifscCode')
        .notEmpty()
        .isString()
        .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
        .withMessage('Invalid IFSC code'),
    body('isPrimary').optional().isBoolean(),
    validateRequest,
];

export const updateIdentifiersValidator = [
    body('pan').optional().isString(),
    body('uan').optional().isString(),
    body('aadhaar').optional().isString(),
    validateRequest,
];

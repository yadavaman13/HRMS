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

export const payrollSettingsValidator = [
    body('payrollFrequency').optional().isIn(['MONTHLY', 'WEEKLY', 'BIWEEKLY']),
    body('payrollCurrency').optional().isString().isLength({ min: 3, max: 3 }),
    body('payDay').optional().isInt({ min: 1, max: 31 }),
    body('workingDaysBasis').optional().isFloat({ min: 1, max: 31 }),
    body('unpaidLeaveDeductionMethod').optional().isString(),
    body('pfEnabled').optional().isBoolean(),
    body('employeePfRate').optional().isFloat({ min: 0, max: 100 }),
    body('employerPfRate').optional().isFloat({ min: 0, max: 100 }),
    body('professionalTaxEnabled').optional().isBoolean(),
    body('professionalTaxAmount').optional().isFloat({ min: 0 }),
    validateRequest,
];

export const leaveTypeValidator = [
    body('code')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 1, max: 20 })
        .withMessage('Leave type code is required'),
    body('name')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('Leave type name is required'),
    body('isPaid').optional().isBoolean(),
    body('requiresAllocation').optional().isBoolean(),
    body('requiresAttachment').optional().isBoolean(),
    body('requiresApproval').optional().isBoolean(),
    body('unit').optional().isIn(['day', 'half_day', 'hour']),
    validateRequest,
];

export const leaveTypeUpdateValidator = [
    body('code').optional().isString().trim().isLength({ min: 1, max: 20 }),
    body('name').optional().isString().trim().isLength({ min: 1, max: 255 }),
    body('isPaid').optional().isBoolean(),
    body('requiresAllocation').optional().isBoolean(),
    body('requiresAttachment').optional().isBoolean(),
    body('requiresApproval').optional().isBoolean(),
    body('unit').optional().isIn(['day', 'half_day', 'hour']),
    validateRequest,
];

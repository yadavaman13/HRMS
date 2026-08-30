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

// ── Leave Types Validators ──────────────────────────────────────────────────

export const createLeaveTypeValidator = [
    body('code')
        .notEmpty()
        .withMessage('Leave type code is required')
        .isString()
        .isLength({ min: 1, max: 20 })
        .withMessage('Code must be 1 to 20 characters'),
    body('name')
        .notEmpty()
        .withMessage('Leave type name is required')
        .isString()
        .isLength({ min: 2, max: 255 })
        .withMessage('Name must be 2 to 255 characters'),
    body('isPaid').optional().isBoolean().withMessage('isPaid must be boolean'),
    body('requiresAllocation')
        .optional()
        .isBoolean()
        .withMessage('requiresAllocation must be boolean'),
    body('requiresAttachment')
        .optional()
        .isBoolean()
        .withMessage('requiresAttachment must be boolean'),
    body('requiresApproval').optional().isBoolean().withMessage('requiresApproval must be boolean'),
    body('unit')
        .optional()
        .isIn(['day', 'half_day', 'hour'])
        .withMessage('Unit must be one of day, half_day, hour'),
    body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
    validateRequest,
];

export const updateLeaveTypeValidator = [
    param('typeId').isUUID().withMessage('Invalid leave type UUID'),
    body('code')
        .optional()
        .isString()
        .isLength({ min: 1, max: 20 })
        .withMessage('Code must be 1 to 20 characters'),
    body('name')
        .optional()
        .isString()
        .isLength({ min: 2, max: 255 })
        .withMessage('Name must be 2 to 255 characters'),
    body('isPaid').optional().isBoolean(),
    body('requiresAllocation').optional().isBoolean(),
    body('requiresAttachment').optional().isBoolean(),
    body('requiresApproval').optional().isBoolean(),
    body('unit').optional().isIn(['day', 'half_day', 'hour']),
    body('isActive').optional().isBoolean(),
    validateRequest,
];

export const leaveTypeParamValidator = [
    param('typeId').isUUID().withMessage('Invalid leave type UUID'),
    validateRequest,
];

// ── Allocations & Balances Validators ────────────────────────────────────────

export const allocateLeaveValidator = [
    body('employeeId').isUUID().withMessage('Valid employee UUID is required'),
    body('leaveTypeId').isUUID().withMessage('Valid leave type UUID is required'),
    body('periodStart').optional().isDate().withMessage('periodStart must be YYYY-MM-DD'),
    body('periodEnd').optional().isDate().withMessage('periodEnd must be YYYY-MM-DD'),
    body('allocatedDays')
        .optional()
        .isFloat({ min: 0.1, max: 365 })
        .withMessage('allocatedDays must be between 0.1 and 365'),
    body('daysAllocated')
        .optional()
        .isFloat({ min: 0.1, max: 365 })
        .withMessage('daysAllocated must be between 0.1 and 365'),
    body('year')
        .optional()
        .isInt({ min: 2000, max: 2100 })
        .withMessage('year must be a valid integer year'),
    body('carriedForwardDays')
        .optional()
        .isFloat({ min: 0, max: 365 })
        .withMessage('carriedForwardDays must be between 0 and 365'),
    body('description').optional().isString().trim(),
    body('reason').optional().isString().trim(),
    validateRequest,
];

export const employeeParamValidator = [
    param('employeeId').isUUID().withMessage('Invalid employee UUID'),
    validateRequest,
];

// ── Leave Requests Lifecycle Validators ─────────────────────────────────────

export const applyLeaveValidator = [
    body('leaveTypeId').isUUID().withMessage('Valid leave type UUID is required'),
    body('startDate').isDate().withMessage('startDate must be in YYYY-MM-DD format'),
    body('endDate').isDate().withMessage('endDate must be in YYYY-MM-DD format'),
    body('startHalf')
        .optional()
        .isIn(['none', 'first_half', 'second_half'])
        .withMessage('startHalf must be none, first_half, or second_half'),
    body('endHalf')
        .optional()
        .isIn(['none', 'first_half', 'second_half'])
        .withMessage('endHalf must be none, first_half, or second_half'),
    body('reason').optional().isString().trim(),
    body('attachmentUrl').optional().isString().trim(),
    validateRequest,
];

export const leaveRequestParamValidator = [
    param('requestId').isUUID().withMessage('Invalid leave request UUID'),
    validateRequest,
];

export const reviewLeaveValidator = [
    param('requestId').isUUID().withMessage('Invalid leave request UUID'),
    body('hrComment').optional().isString().trim(),
    validateRequest,
];

export const cancelLeaveValidator = [
    param('requestId').isUUID().withMessage('Invalid leave request UUID'),
    body('reason').optional().isString().trim(),
    validateRequest,
];

export const leaveQueryValidator = [
    query('employeeId').optional().isUUID().withMessage('Invalid employee UUID'),
    query('departmentId').optional().isUUID().withMessage('Invalid department UUID'),
    query('leaveTypeId').optional().isUUID().withMessage('Invalid leave type UUID'),
    query('status')
        .optional()
        .isIn(['draft', 'pending', 'approved', 'rejected', 'cancelled'])
        .withMessage('Invalid leave status filter'),
    query('startDate').optional().isDate().withMessage('startDate must be YYYY-MM-DD'),
    query('endDate').optional().isDate().withMessage('endDate must be YYYY-MM-DD'),
    query('year').optional().isInt({ min: 2000, max: 2100 }),
    query('limit').optional().isInt({ min: 1, max: 200 }),
    query('offset').optional().isInt({ min: 0 }),
    validateRequest,
];

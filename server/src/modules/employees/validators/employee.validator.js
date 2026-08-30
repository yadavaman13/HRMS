import { query, body, param, validationResult } from 'express-validator';
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

    // Salary (optional)
    body('salary')
        .optional()
        .custom((val) => {
            if (typeof val === 'number') return true;
            if (typeof val === 'string' && !isNaN(Number(val))) return true;
            if (typeof val === 'object' && val !== null) {
                if (val.monthlyWage !== undefined && isNaN(Number(val.monthlyWage))) {
                    throw new Error('monthlyWage must be a number');
                }
                return true;
            }
            throw new Error('salary must be a number or an object containing monthlyWage');
        }),

    validateRequest,
];

export const listEmployeesValidator = [
    query('status').optional().isIn(['active', 'inactive', 'terminated', 'on_leave', 'probation']),
    query('department').optional().isString(),
    query('search').optional().isString(),
    query('managerId').optional().isUUID(),
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

export const employeeIdParamValidator = [
    param('employeeId').optional().isUUID().withMessage('Invalid employee ID format'),
    param('id').optional().isUUID().withMessage('Invalid ID format'),
    validateRequest,
];

export const uploadDocumentValidator = [
    body('documentType')
        .notEmpty()
        .withMessage('documentType is required')
        .isIn([
            'resume',
            'pan_card',
            'aadhaar',
            'offer_letter',
            'medical_certificate',
            'certification',
            'other',
        ])
        .withMessage('Invalid document type'),
    body('fileName').optional().isString().trim(),
    validateRequest,
];

export const documentIdParamValidator = [
    param('docId').notEmpty().isUUID().withMessage('Invalid document ID format'),
    validateRequest,
];

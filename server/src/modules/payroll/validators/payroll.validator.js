import { body, param, query, validationResult } from 'express-validator';
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

export const payrollSettingsValidator = [
    body('pfEnabled').optional().isBoolean().withMessage('pfEnabled must be a boolean'),
    body('employeePfRate')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('employeePfRate must be between 0 and 100'),
    body('employerPfRate')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('employerPfRate must be between 0 and 100'),
    body('professionalTaxEnabled')
        .optional()
        .isBoolean()
        .withMessage('professionalTaxEnabled must be a boolean'),
    body('professionalTaxAmount')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('professionalTaxAmount must be a positive number'),
    body('workingDaysBasis')
        .optional()
        .isFloat({ min: 1, max: 31 })
        .withMessage('workingDaysBasis must be between 1 and 31'),
    body('unpaidLeaveDeductionMethod').optional().isString().trim(),
    validateRequest,
];

export const componentDefinitionValidator = [
    body('code')
        .notEmpty()
        .withMessage('Component code is required')
        .isString()
        .trim()
        .matches(/^[A-Z0-9_]+$/)
        .withMessage('Code must be uppercase alphanumeric and underscores only'),
    body('name').notEmpty().withMessage('Component name is required').isString().trim(),
    body('componentType')
        .notEmpty()
        .withMessage('Component type is required')
        .isIn(['earning', 'employee_deduction', 'employer_contribution'])
        .withMessage('Invalid component type'),
    body('calculationType')
        .notEmpty()
        .withMessage('Calculation type is required')
        .isIn(['fixed', 'percentage_of_wage', 'percentage_of_component', 'residual'])
        .withMessage('Invalid calculation type'),
    body('calculationBase').optional().isString().trim(),
    validateRequest,
];

export const updateComponentDefinitionValidator = [
    param('id').isUUID().withMessage('Invalid component UUID'),
    body('name').optional().isString().trim(),
    body('componentType')
        .optional()
        .isIn(['earning', 'employee_deduction', 'employer_contribution'])
        .withMessage('Invalid component type'),
    body('calculationType')
        .optional()
        .isIn(['fixed', 'percentage_of_wage', 'percentage_of_component', 'residual'])
        .withMessage('Invalid calculation type'),
    body('calculationBase').optional().isString().trim(),
    body('isActive').optional().isBoolean(),
    validateRequest,
];

export const componentIdParamValidator = [
    param('id').isUUID().withMessage('Invalid component UUID'),
    validateRequest,
];

export const salaryStructureValidator = [
    param('employeeId').isUUID().withMessage('Invalid employee UUID'),
    body('monthlyWage')
        .notEmpty()
        .withMessage('Monthly wage is required')
        .isFloat({ min: 0 })
        .withMessage('Monthly wage must be a positive number'),
    body('wageType').optional().isIn(['fixed', 'hourly', 'daily']).withMessage('Invalid wage type'),
    body('effectiveFrom')
        .notEmpty()
        .withMessage('Effective from date is required')
        .isDate()
        .withMessage('effectiveFrom must be a valid date (YYYY-MM-DD)'),
    body('components')
        .notEmpty()
        .withMessage('Salary components array is required')
        .isArray()
        .withMessage('components must be an array'),
    body('components.*.componentDefinitionId')
        .notEmpty()
        .withMessage('componentDefinitionId is required')
        .isUUID()
        .withMessage('componentDefinitionId must be a valid UUID'),
    body('components.*.calculationType')
        .notEmpty()
        .withMessage('calculationType is required')
        .isIn(['fixed', 'percentage_of_wage', 'percentage_of_component', 'residual']),
    body('components.*.fixedAmount')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('fixedAmount must be a positive number'),
    body('components.*.percentage')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('percentage must be between 0 and 100'),
    body('components.*.sequence')
        .optional()
        .isInt({ min: 0 })
        .withMessage('sequence must be a positive integer'),
    body('components.*.isResidual')
        .optional()
        .isBoolean()
        .withMessage('isResidual must be a boolean'),
    validateRequest,
];

export const payrollPeriodValidator = [
    body('periodStart')
        .notEmpty()
        .withMessage('Period start date is required')
        .isDate()
        .withMessage('periodStart must be a valid date (YYYY-MM-DD)'),
    body('periodEnd')
        .notEmpty()
        .withMessage('Period end date is required')
        .isDate()
        .withMessage('periodEnd must be a valid date (YYYY-MM-DD)')
        .custom((value, { req }) => {
            if (new Date(value) < new Date(req.body.periodStart)) {
                throw new Error('Period end date must be after start date');
            }
            return true;
        }),
    validateRequest,
];

export const payslipsQueryValidator = [
    query('payrollPeriodId')
        .optional()
        .isUUID()
        .withMessage('payrollPeriodId must be a valid UUID'),
    query('employeeId').optional().isUUID().withMessage('employeeId must be a valid UUID'),
    validateRequest,
];

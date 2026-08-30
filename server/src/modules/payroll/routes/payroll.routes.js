import { Router } from 'express';
import * as payrollController from '../controllers/payroll.controller.js';
import { protect, restrictTo } from '../../auth/middleware/auth.middleware.js';
import {
    payrollSettingsValidator,
    componentDefinitionValidator,
    updateComponentDefinitionValidator,
    componentIdParamValidator,
    salaryStructureValidator,
    payrollPeriodValidator,
    payslipsQueryValidator,
} from '../validators/payroll.validator.js';

const router = Router();

// Protect all routes
router.use(protect);

// ── Settings ─────────────────────────────────────────────────────────────────
router.get('/settings', restrictTo('admin', 'hr'), payrollController.getSettings);
router.post(
    '/settings',
    restrictTo('admin', 'hr'),
    payrollSettingsValidator,
    payrollController.updateSettings,
);

// ── Components ───────────────────────────────────────────────────────────────
router.get('/components', restrictTo('admin', 'hr'), payrollController.listComponents);
router.post(
    '/components',
    restrictTo('admin', 'hr'),
    componentDefinitionValidator,
    payrollController.createComponent,
);
router.patch(
    '/components/:id',
    restrictTo('admin', 'hr'),
    updateComponentDefinitionValidator,
    payrollController.updateComponent,
);
router.delete(
    '/components/:id',
    restrictTo('admin', 'hr'),
    componentIdParamValidator,
    payrollController.deleteComponent,
);

// ── Salary Structures ────────────────────────────────────────────────────────
router.get('/salary/:employeeId', payrollController.getSalaryStructure);
router.post(
    '/salary/:employeeId',
    restrictTo('admin', 'hr'),
    salaryStructureValidator,
    payrollController.setSalaryStructure,
);

// ── Periods ──────────────────────────────────────────────────────────────────
router.get('/periods', restrictTo('admin', 'hr'), payrollController.listPeriods);
router.post(
    '/periods',
    restrictTo('admin', 'hr'),
    payrollPeriodValidator,
    payrollController.createPeriod,
);
router.post('/periods/:id/process', restrictTo('admin', 'hr'), payrollController.processPeriod);
router.post('/periods/:id/finalize', restrictTo('admin', 'hr'), payrollController.finalizePeriod);

// ── Payslips ─────────────────────────────────────────────────────────────────
router.get('/payslips', payslipsQueryValidator, payrollController.listPayslips);
router.get('/payslips/:id', payrollController.getPayslipDetails);
router.get('/payslips/:id/download', payrollController.downloadPayslipPdf);

export default router;

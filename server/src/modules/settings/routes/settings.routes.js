import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller.js';
import { protect, restrictTo } from '../../auth/middleware/auth.middleware.js';
import {
    payrollSettingsValidator,
    leaveTypeValidator,
    leaveTypeUpdateValidator,
} from '../validators/settings.validator.js';

const router = Router();
router.use(protect);

// Overview
router.get('/', settingsController.getSettings);

// Payroll Settings
router.patch(
    '/payroll',
    restrictTo('admin'),
    payrollSettingsValidator,
    settingsController.updatePayrollSettings,
);

// Leave Types
router.get('/leave-types', settingsController.getLeaveTypes);
router.post(
    '/leave-types',
    restrictTo('admin', 'hr'),
    leaveTypeValidator,
    settingsController.createLeaveType,
);
router.patch(
    '/leave-types/:id',
    restrictTo('admin', 'hr'),
    leaveTypeUpdateValidator,
    settingsController.updateLeaveType,
);
router.delete('/leave-types/:id', restrictTo('admin'), settingsController.deleteLeaveType);

export default router;

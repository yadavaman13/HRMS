import { Router } from 'express';
import * as employeeController from '../controllers/employee.controller.js';
import { protect, restrictTo } from '../../auth/middleware/auth.middleware.js';
import {
    directoryValidator,
    updateProfileValidator,
    updatePrivateInfoValidator,
    updateBankAccountValidator,
    updateIdentifiersValidator,
} from '../validators/employee.validator.js';

const router = Router();
router.use(protect);

// ── Employee Directory ───────────────────────────────────────────────────
router.get('/', directoryValidator, employeeController.getDirectory);

// ── My Profile (self-service) ────────────────────────────────────────────
router.get('/me', employeeController.getMyProfile);
router.get('/me/private-info', employeeController.getMyPrivateInfo);
router.patch('/me/profile', updateProfileValidator, employeeController.updateProfile);

// ── Employee Profile (admin/hr only for writes) ──────────────────────────
router.get('/:id', employeeController.getProfile);
router.get('/:id/private-info', employeeController.getPrivateInfo);

// Admin/HR restricted write routes
router.patch(
    '/:id/profile',
    restrictTo('admin', 'hr'),
    updateProfileValidator,
    employeeController.updateEmployeeProfile,
);
router.patch(
    '/:id/private-info',
    restrictTo('admin', 'hr'),
    updatePrivateInfoValidator,
    employeeController.updatePrivateInfo,
);
router.patch(
    '/:id/bank-account',
    restrictTo('admin', 'hr'),
    updateBankAccountValidator,
    employeeController.updateBankAccount,
);
router.patch(
    '/:id/identifiers',
    restrictTo('admin', 'hr'),
    updateIdentifiersValidator,
    employeeController.updateIdentifiers,
);

export default router;
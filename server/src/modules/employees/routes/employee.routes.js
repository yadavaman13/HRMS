import { Router } from 'express';
import * as employeeController from '../controllers/employee.controller.js';
import * as employeeCredentialController from '../controllers/employeeCredential.controller.js';
import * as profileController from '../controllers/profile.controller.js';
import * as privateInfoController from '../controllers/privateInfo.controller.js';
import { protect, restrictTo } from '../../auth/middleware/auth.middleware.js';
import {
    createEmployeeValidator,
    listEmployeesValidator,
    updateProfileValidator,
    updatePrivateInfoValidator,
    updateBankAccountValidator,
    updateIdentifiersValidator,
    employeeIdParamValidator,
} from '../validators/employee.validator.js';

const router = Router();

// Protect all employee routes
router.use(protect);

// ── Employee CRUD & Directory Search ─────────────────────────────────────
router.post(
    '/',
    restrictTo('admin', 'hr'),
    createEmployeeValidator,
    employeeController.createEmployee,
);

router.get('/', listEmployeesValidator, employeeController.listEmployees);

router.get('/:employeeId', employeeIdParamValidator, employeeController.getEmployeeById);

router.patch(
    '/:employeeId',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    updateProfileValidator,
    employeeController.updateEmployee,
);

router.delete(
    '/:employeeId',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    employeeController.deleteEmployee,
);

// ── Account lifecycle (Activation / Deactivation / Password Reset) ────────
router.post(
    '/:employeeId/activate',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    employeeCredentialController.activateAccount,
);

router.post(
    '/:employeeId/deactivate',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    employeeCredentialController.deactivateAccount,
);

router.post(
    '/:employeeId/reset-password',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    employeeCredentialController.resetPassword,
);

// ── Admin-facing employee profile management ──────────────────────────────
router.get(
    '/:employeeId/profile',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    profileController.getEmployeeProfile,
);

router.patch(
    '/:employeeId/profile',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    updateProfileValidator,
    profileController.updateEmployeeProfile,
);

router.get(
    '/:employeeId/private-info',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    privateInfoController.getPrivateInfo,
);

router.patch(
    '/:employeeId/private-info',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    updatePrivateInfoValidator,
    privateInfoController.updatePrivateInfo,
);

router.patch(
    '/:employeeId/bank-account',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    updateBankAccountValidator,
    privateInfoController.updateBankAccount,
);

router.patch(
    '/:employeeId/identifiers',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    updateIdentifiersValidator,
    privateInfoController.updateIdentifiers,
);

export default router;

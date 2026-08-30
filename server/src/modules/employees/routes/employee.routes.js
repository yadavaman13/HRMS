import { Router } from 'express';
import multer from 'multer';
import * as employeeController from '../controllers/employee.controller.js';
import * as employeeCredentialController from '../controllers/employeeCredential.controller.js';
import * as profileController from '../controllers/profile.controller.js';
import * as privateInfoController from '../controllers/privateInfo.controller.js';
import * as employeeDocumentController from '../controllers/employeeDocument.controller.js';
import * as payrollController from '../../payroll/controllers/payroll.controller.js';
import * as leaveBalanceController from '../../leave/controllers/leaveBalance.controller.js';
import { protect, restrictTo } from '../../auth/middleware/auth.middleware.js';
import {
    createEmployeeValidator,
    listEmployeesValidator,
    updateProfileValidator,
    updatePrivateInfoValidator,
    updateBankAccountValidator,
    updateIdentifiersValidator,
    employeeIdParamValidator,
    uploadDocumentValidator,
    documentIdParamValidator,
} from '../validators/employee.validator.js';
import { salaryStructureValidator } from '../../payroll/validators/payroll.validator.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

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

// ── Salary Structure Management (Admin only) ──────────────────────────────
router.get(
    '/:employeeId/salary',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    payrollController.getSalaryStructure,
);

router.post(
    '/:employeeId/salary',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    salaryStructureValidator,
    payrollController.setSalaryStructure,
);

router.patch(
    '/:employeeId/salary',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    salaryStructureValidator,
    payrollController.setSalaryStructure,
);

// ── Leave Balances Alias (Admin/HR) ───────────────────────────────────────
router.get(
    '/:employeeId/leave-balances',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    leaveBalanceController.getEmployeeBalances,
);

// ── Documents (Admin/HR) ──────────────────────────────────────────────────
router.get(
    '/:employeeId/documents',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    employeeDocumentController.getEmployeeDocuments,
);

router.post(
    '/:employeeId/documents',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    upload.single('file'),
    uploadDocumentValidator,
    employeeDocumentController.uploadEmployeeDocument,
);

router.delete(
    '/:employeeId/documents/:docId',
    restrictTo('admin', 'hr'),
    employeeIdParamValidator,
    documentIdParamValidator,
    employeeDocumentController.deleteEmployeeDocument,
);

export default router;

import { Router } from 'express';
import * as leaveTypeController from '../controllers/leaveType.controller.js';
import * as leaveBalanceController from '../controllers/leaveBalance.controller.js';
import * as leaveRequestController from '../controllers/leaveRequest.controller.js';
import * as leaveApprovalController from '../controllers/leaveApproval.controller.js';
import { protect, restrictTo } from '../../auth/middleware/auth.middleware.js';
import {
    createLeaveTypeValidator,
    updateLeaveTypeValidator,
    leaveTypeParamValidator,
    allocateLeaveValidator,
    employeeParamValidator,
    applyLeaveValidator,
    leaveRequestParamValidator,
    reviewLeaveValidator,
    cancelLeaveValidator,
    leaveQueryValidator,
} from '../validators/leave.validator.js';

const router = Router();

// Protect all leave management routes
router.use(protect);

// ── Leave Types Configuration ───────────────────────────────────────────────
router.get('/types', leaveTypeController.getLeaveTypes);
router.post(
    '/types',
    restrictTo('admin', 'hr'),
    createLeaveTypeValidator,
    leaveTypeController.createLeaveType,
);
router.get('/types/:typeId', leaveTypeParamValidator, leaveTypeController.getLeaveTypeById);
router.patch(
    '/types/:typeId',
    restrictTo('admin', 'hr'),
    updateLeaveTypeValidator,
    leaveTypeController.updateLeaveType,
);

// ── Balance & Allocations ───────────────────────────────────────────────────
router.get('/balances/me', leaveBalanceController.getMyBalances);
router.get(
    '/balances/employee/:employeeId',
    restrictTo('admin', 'hr'),
    employeeParamValidator,
    leaveBalanceController.getEmployeeBalances,
);
router.get(
    '/employees/:employeeId/balances',
    restrictTo('admin', 'hr'),
    employeeParamValidator,
    leaveBalanceController.getEmployeeBalances,
);

router.post(
    '/allocations',
    restrictTo('admin', 'hr'),
    allocateLeaveValidator,
    leaveBalanceController.allocateLeave,
);
router.get('/allocations/me', leaveBalanceController.getMyAllocations);
router.get(
    '/allocations/employee/:employeeId',
    restrictTo('admin', 'hr'),
    employeeParamValidator,
    leaveBalanceController.getEmployeeAllocations,
);

// ── Ledger Transactions ─────────────────────────────────────────────────────
router.get('/transactions/me', leaveBalanceController.getMyTransactions);
router.get(
    '/transactions/employee/:employeeId',
    restrictTo('admin', 'hr'),
    employeeParamValidator,
    leaveBalanceController.getEmployeeTransactions,
);

// ── Leave Requests Lifecycle (Employee) ─────────────────────────────────────
router.post('/requests', applyLeaveValidator, leaveRequestController.applyLeave);
router.get('/requests/me', leaveQueryValidator, leaveRequestController.getMyRequests);
router.get(
    '/requests/:requestId',
    leaveRequestParamValidator,
    leaveRequestController.getLeaveRequestById,
);
router.patch(
    '/requests/:requestId/cancel',
    cancelLeaveValidator,
    leaveRequestController.cancelLeaveRequest,
);

// ── Admin / HR Approval Inbox ───────────────────────────────────────────────
router.get(
    '/requests',
    restrictTo('admin', 'hr'),
    leaveQueryValidator,
    leaveApprovalController.getAllRequests,
);
router.post(
    '/requests/:requestId/approve',
    restrictTo('admin', 'hr'),
    reviewLeaveValidator,
    leaveApprovalController.approveRequest,
);
router.post(
    '/requests/:requestId/reject',
    restrictTo('admin', 'hr'),
    reviewLeaveValidator,
    leaveApprovalController.rejectRequest,
);

export default router;

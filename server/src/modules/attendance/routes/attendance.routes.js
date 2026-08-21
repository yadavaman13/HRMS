import { Router } from 'express';
import * as attendanceController from '../controllers/attendance.controller.js';
import * as attendanceSummaryController from '../controllers/attendanceSummary.controller.js';
import * as attendanceAdjustmentController from '../controllers/attendanceAdjustment.controller.js';
import { protect, restrictTo } from '../../auth/middleware/auth.middleware.js';
import {
    checkInValidator,
    checkOutValidator,
    attendanceQueryValidator,
    adjustRequestValidator,
    adminUpdateAttendanceValidator,
    reviewAdjustmentValidator,
} from '../validators/attendance.validator.js';

const router = Router();

// Protect all attendance routes
router.use(protect);

// ── Employee Punch & Timesheet ───────────────────────────────────────────────
router.post('/check-in', checkInValidator, attendanceController.checkIn);
router.post('/check-out', checkOutValidator, attendanceController.checkOut);
router.get('/me', attendanceQueryValidator, attendanceController.getMyAttendance);
router.get('/me/summary', attendanceController.getMySummary);

// ── Regularization & Adjustments ─────────────────────────────────────────────
router.get('/adjustments/me', attendanceAdjustmentController.getMyAdjustments);
router.get(
    '/adjustments',
    restrictTo('admin', 'hr'),
    attendanceAdjustmentController.getAdjustments,
);
router.get('/adjustments/:adjustmentId', attendanceAdjustmentController.getAdjustmentById);
router.patch(
    '/adjustments/:adjustmentId',
    restrictTo('admin', 'hr'),
    reviewAdjustmentValidator,
    attendanceAdjustmentController.reviewAdjustment,
);

// ── Admin / HR Attendance Oversight ──────────────────────────────────────────
router.get('/summary', restrictTo('admin', 'hr'), attendanceSummaryController.getCompanySummary);
router.get(
    '/employee/:employeeId',
    restrictTo('admin', 'hr'),
    attendanceQueryValidator,
    attendanceController.getEmployeeAttendance,
);
router.get(
    '/',
    restrictTo('admin', 'hr'),
    attendanceQueryValidator,
    attendanceController.getAttendanceRecords,
);

// ── Single Record Details & Corrections ──────────────────────────────────────
router.get('/:attendanceId', attendanceController.getAttendanceById);
router.post(
    '/:attendanceId/adjust',
    adjustRequestValidator,
    attendanceAdjustmentController.requestAdjustment,
);
router.patch(
    '/:attendanceId',
    restrictTo('admin', 'hr'),
    adminUpdateAttendanceValidator,
    attendanceAdjustmentController.updateAttendanceRecord,
);

export default router;

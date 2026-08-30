import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { protect, restrictTo } from '../../auth/middleware/auth.middleware.js';

const router = Router();
router.use(protect);

// Smart role-aware root dashboard
router.get('/', dashboardController.getDashboard);

// Explicit role endpoints
router.get('/admin', restrictTo('admin', 'hr'), dashboardController.getAdminDashboard);
router.get('/employee', dashboardController.getEmployeeDashboard);
router.get(
    '/employee/:employeeId',
    restrictTo('admin', 'hr'),
    dashboardController.getEmployeeDashboardById,
);
router.get('/me', dashboardController.getEmployeeDashboard);

// Section-specific dashboard analytics (Admin/HR)
router.get('/attendance', restrictTo('admin', 'hr'), dashboardController.getAttendanceDashboard);
router.get('/leave', restrictTo('admin', 'hr'), dashboardController.getLeaveDashboard);
router.get('/employees', restrictTo('admin', 'hr'), dashboardController.getEmployeesDashboard);
router.get('/payroll', restrictTo('admin', 'hr'), dashboardController.getPayrollDashboard);

export default router;

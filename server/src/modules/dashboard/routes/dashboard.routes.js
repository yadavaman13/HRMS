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
router.get('/me', dashboardController.getEmployeeDashboard);

export default router;

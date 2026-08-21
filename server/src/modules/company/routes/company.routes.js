import { Router } from 'express';
import * as companyController from '../controllers/company.controller.js';
import { protect, restrictTo } from '../../auth/middleware/auth.middleware.js';
import {
    updateCompanyValidator,
    locationValidator,
    departmentValidator,
    jobPositionValidator,
    workScheduleValidator,
    holidayValidator,
} from '../validators/company.validator.js';

const router = Router();
router.use(protect);

// ── Company Profile ──────────────────────────────────────────────────────────
router.get('/my', companyController.getMyCompany);
router.get('/:id', companyController.getCompanyById);
router.patch(
    '/:id',
    restrictTo('admin', 'hr'),
    updateCompanyValidator,
    companyController.updateCompany,
);

// ── Locations ────────────────────────────────────────────────────────────────
router.get('/:id/locations', companyController.getLocations);
router.post(
    '/:id/locations',
    restrictTo('admin', 'hr'),
    locationValidator,
    companyController.createLocation,
);
router.patch(
    '/locations/:id',
    restrictTo('admin', 'hr'),
    locationValidator,
    companyController.updateLocation,
);
router.delete('/locations/:id', restrictTo('admin'), companyController.deleteLocation);

// ── Departments ──────────────────────────────────────────────────────────────
router.get('/:id/departments', companyController.getDepartments);
router.post(
    '/:id/departments',
    restrictTo('admin', 'hr'),
    departmentValidator,
    companyController.createDepartment,
);
router.patch(
    '/departments/:id',
    restrictTo('admin', 'hr'),
    departmentValidator,
    companyController.updateDepartment,
);
router.delete('/departments/:id', restrictTo('admin'), companyController.deleteDepartment);

// ── Job Positions ────────────────────────────────────────────────────────────
router.get('/:id/job-positions', companyController.getJobPositions);
router.post(
    '/:id/job-positions',
    restrictTo('admin', 'hr'),
    jobPositionValidator,
    companyController.createJobPosition,
);
router.patch(
    '/job-positions/:id',
    restrictTo('admin', 'hr'),
    jobPositionValidator,
    companyController.updateJobPosition,
);
router.delete('/job-positions/:id', restrictTo('admin'), companyController.deleteJobPosition);

// ── Work Schedules ──────────────────────────────────────────────────────────
router.get('/:id/schedules', companyController.getWorkSchedules);
router.get('/schedules/:id', companyController.getWorkScheduleById);
router.post(
    '/:id/schedules',
    restrictTo('admin', 'hr'),
    workScheduleValidator,
    companyController.createWorkSchedule,
);
router.patch(
    '/schedules/:id',
    restrictTo('admin', 'hr'),
    workScheduleValidator,
    companyController.updateWorkSchedule,
);
router.delete('/schedules/:id', restrictTo('admin'), companyController.deleteWorkSchedule);

// ── Holidays ─────────────────────────────────────────────────────────────────
router.get('/:id/holidays', companyController.getHolidays);
router.post(
    '/:id/holidays',
    restrictTo('admin', 'hr'),
    holidayValidator,
    companyController.createHoliday,
);
router.delete('/holidays/:id', restrictTo('admin', 'hr'), companyController.deleteHoliday);

export default router;

import * as companyService from '../services/company.service.js';
import { sendResponse } from '../../../utils/response.utlis.js';

function extractReqMetadata(req) {
    return {
        ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
        userAgent: req.headers['user-agent'],
    };
}

// ── Company Details ──────────────────────────────────────────────────────────

export async function getMyCompany(req, res, next) {
    try {
        const company = await companyService.getCompany(req.user.organizationId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Company details retrieved successfully',
            success: true,
            data: { company },
        });
    } catch (error) {
        next(error);
    }
}

export async function getCompanyById(req, res, next) {
    try {
        const company = await companyService.getCompany(req.params.id);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Company details retrieved successfully',
            success: true,
            data: { company },
        });
    } catch (error) {
        next(error);
    }
}

export async function updateCompany(req, res, next) {
    try {
        const company = await companyService.updateCompany(
            req.user.organizationId,
            req.user.id,
            req.body,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Company details updated successfully',
            success: true,
            data: { company },
        });
    } catch (error) {
        next(error);
    }
}

// ── Locations ────────────────────────────────────────────────────────────────

export async function getLocations(req, res, next) {
    try {
        const locations = await companyService.getLocations(req.user.organizationId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Locations retrieved successfully',
            success: true,
            data: { locations },
        });
    } catch (error) {
        next(error);
    }
}

export async function createLocation(req, res, next) {
    try {
        const location = await companyService.createLocation(
            req.user.organizationId,
            req.user.id,
            req.body,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 201,
            message: 'Location created successfully',
            success: true,
            data: { location },
        });
    } catch (error) {
        next(error);
    }
}

export async function updateLocation(req, res, next) {
    try {
        const location = await companyService.updateLocation(
            req.params.id,
            req.user.organizationId,
            req.user.id,
            req.body,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Location updated successfully',
            success: true,
            data: { location },
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteLocation(req, res, next) {
    try {
        const location = await companyService.deleteLocation(
            req.params.id,
            req.user.organizationId,
            req.user.id,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Location deleted successfully',
            success: true,
            data: { location },
        });
    } catch (error) {
        next(error);
    }
}

// ── Departments ──────────────────────────────────────────────────────────────

export async function getDepartments(req, res, next) {
    try {
        const departments = await companyService.getDepartments(req.user.organizationId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Departments retrieved successfully',
            success: true,
            data: { departments },
        });
    } catch (error) {
        next(error);
    }
}

export async function createDepartment(req, res, next) {
    try {
        const department = await companyService.createDepartment(
            req.user.organizationId,
            req.user.id,
            req.body,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 201,
            message: 'Department created successfully',
            success: true,
            data: { department },
        });
    } catch (error) {
        next(error);
    }
}

export async function updateDepartment(req, res, next) {
    try {
        const department = await companyService.updateDepartment(
            req.params.id,
            req.user.organizationId,
            req.user.id,
            req.body,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Department updated successfully',
            success: true,
            data: { department },
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteDepartment(req, res, next) {
    try {
        const department = await companyService.deleteDepartment(
            req.params.id,
            req.user.organizationId,
            req.user.id,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Department deleted successfully',
            success: true,
            data: { department },
        });
    } catch (error) {
        next(error);
    }
}

// ── Job Positions ────────────────────────────────────────────────────────────

export async function getJobPositions(req, res, next) {
    try {
        const jobPositions = await companyService.getJobPositions(req.user.organizationId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Job positions retrieved successfully',
            success: true,
            data: { jobPositions },
        });
    } catch (error) {
        next(error);
    }
}

export async function createJobPosition(req, res, next) {
    try {
        const jobPosition = await companyService.createJobPosition(
            req.user.organizationId,
            req.user.id,
            req.body,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 201,
            message: 'Job position created successfully',
            success: true,
            data: { jobPosition },
        });
    } catch (error) {
        next(error);
    }
}

export async function updateJobPosition(req, res, next) {
    try {
        const jobPosition = await companyService.updateJobPosition(
            req.params.id,
            req.user.organizationId,
            req.user.id,
            req.body,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Job position updated successfully',
            success: true,
            data: { jobPosition },
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteJobPosition(req, res, next) {
    try {
        const jobPosition = await companyService.deleteJobPosition(
            req.params.id,
            req.user.organizationId,
            req.user.id,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Job position deleted successfully',
            success: true,
            data: { jobPosition },
        });
    } catch (error) {
        next(error);
    }
}

// ── Work Schedules ──────────────────────────────────────────────────────────

export async function getWorkSchedules(req, res, next) {
    try {
        const schedules = await companyService.getWorkSchedules(req.user.organizationId);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Work schedules retrieved successfully',
            success: true,
            data: { schedules },
        });
    } catch (error) {
        next(error);
    }
}

export async function getWorkScheduleById(req, res, next) {
    try {
        const schedule = await companyService.getWorkScheduleById(
            req.params.id,
            req.user.organizationId,
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Work schedule details retrieved successfully',
            success: true,
            data: { schedule },
        });
    } catch (error) {
        next(error);
    }
}

export async function createWorkSchedule(req, res, next) {
    try {
        const schedule = await companyService.createWorkSchedule(
            req.user.organizationId,
            req.user.id,
            req.body,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 201,
            message: 'Work schedule created successfully',
            success: true,
            data: { schedule },
        });
    } catch (error) {
        next(error);
    }
}

export async function updateWorkSchedule(req, res, next) {
    try {
        const schedule = await companyService.updateWorkSchedule(
            req.params.id,
            req.user.organizationId,
            req.user.id,
            req.body,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Work schedule updated successfully',
            success: true,
            data: { schedule },
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteWorkSchedule(req, res, next) {
    try {
        const schedule = await companyService.deleteWorkSchedule(
            req.params.id,
            req.user.organizationId,
            req.user.id,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Work schedule deleted successfully',
            success: true,
            data: { schedule },
        });
    } catch (error) {
        next(error);
    }
}

// ── Holidays ─────────────────────────────────────────────────────────────────

export async function getHolidays(req, res, next) {
    try {
        const { year } = req.query;
        const holidays = await companyService.getHolidays(
            req.user.organizationId,
            year ? +year : undefined,
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Holidays retrieved successfully',
            success: true,
            data: { holidays },
        });
    } catch (error) {
        next(error);
    }
}

export async function createHoliday(req, res, next) {
    try {
        const holiday = await companyService.createHoliday(
            req.user.organizationId,
            req.user.id,
            req.body,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 201,
            message: 'Holiday created successfully',
            success: true,
            data: { holiday },
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteHoliday(req, res, next) {
    try {
        const holiday = await companyService.deleteHoliday(
            req.params.id,
            req.user.organizationId,
            req.user.id,
            extractReqMetadata(req),
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Holiday deleted successfully',
            success: true,
            data: { holiday },
        });
    } catch (error) {
        next(error);
    }
}

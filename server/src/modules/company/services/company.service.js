import * as orgDao from '../../../dao/organization.dao.js';
import * as auditDao from '../../../dao/audit.dao.js';
import { AppError } from '../../auth/utils/appError.js';

export async function getCompany(organizationId) {
    const org = await orgDao.getOrganizationById(organizationId);
    if (!org) {
        throw new AppError('Organization not found', 404);
    }
    return org;
}

export async function updateCompany(organizationId, actorUserId, updates, reqMetadata = {}) {
    const existing = await orgDao.getOrganizationById(organizationId);
    if (!existing) {
        throw new AppError('Organization not found', 404);
    }

    const updated = await orgDao.updateOrganization(organizationId, updates);

    // Audit log
    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'UPDATE_COMPANY_DETAILS',
        entityType: 'ORGANIZATION',
        entityId: organizationId,
        oldData: existing,
        newData: updated,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return updated;
}

// ── Locations ────────────────────────────────────────────────────────────────

export async function getLocations(organizationId) {
    return await orgDao.getLocations(organizationId);
}

export async function createLocation(organizationId, actorUserId, data, reqMetadata = {}) {
    const location = await orgDao.createLocation(organizationId, data);

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'CREATE_LOCATION',
        entityType: 'LOCATION',
        entityId: location.id,
        newData: location,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return location;
}

export async function updateLocation(
    locationId,
    organizationId,
    actorUserId,
    updates,
    reqMetadata = {},
) {
    const existing = await orgDao.getLocationById(locationId);
    if (!existing || existing.organizationId !== organizationId) {
        throw new AppError('Location not found in this organization', 404);
    }

    const updated = await orgDao.updateLocation(locationId, updates);

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'UPDATE_LOCATION',
        entityType: 'LOCATION',
        entityId: locationId,
        oldData: existing,
        newData: updated,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return updated;
}

export async function deleteLocation(locationId, organizationId, actorUserId, reqMetadata = {}) {
    const existing = await orgDao.getLocationById(locationId);
    if (!existing || existing.organizationId !== organizationId) {
        throw new AppError('Location not found in this organization', 404);
    }

    const deleted = await orgDao.deleteLocation(locationId);

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'DELETE_LOCATION',
        entityType: 'LOCATION',
        entityId: locationId,
        oldData: existing,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return deleted;
}

// ── Departments ──────────────────────────────────────────────────────────────

export async function getDepartments(organizationId) {
    return await orgDao.getDepartments(organizationId);
}

export async function createDepartment(organizationId, actorUserId, data, reqMetadata = {}) {
    const dept = await orgDao.createDepartment(organizationId, data);

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'CREATE_DEPARTMENT',
        entityType: 'DEPARTMENT',
        entityId: dept.id,
        newData: dept,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return dept;
}

export async function updateDepartment(
    departmentId,
    organizationId,
    actorUserId,
    updates,
    reqMetadata = {},
) {
    const existing = await orgDao.getDepartmentById(departmentId);
    if (!existing || existing.organizationId !== organizationId) {
        throw new AppError('Department not found in this organization', 404);
    }

    const updated = await orgDao.updateDepartment(departmentId, updates);

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'UPDATE_DEPARTMENT',
        entityType: 'DEPARTMENT',
        entityId: departmentId,
        oldData: existing,
        newData: updated,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return updated;
}

export async function deleteDepartment(
    departmentId,
    organizationId,
    actorUserId,
    reqMetadata = {},
) {
    const existing = await orgDao.getDepartmentById(departmentId);
    if (!existing || existing.organizationId !== organizationId) {
        throw new AppError('Department not found in this organization', 404);
    }

    const deleted = await orgDao.deleteDepartment(departmentId);

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'DELETE_DEPARTMENT',
        entityType: 'DEPARTMENT',
        entityId: departmentId,
        oldData: existing,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return deleted;
}

// ── Job Positions ────────────────────────────────────────────────────────────

export async function getJobPositions(organizationId) {
    return await orgDao.getJobPositions(organizationId);
}

export async function createJobPosition(organizationId, actorUserId, data, reqMetadata = {}) {
    const pos = await orgDao.createJobPosition(organizationId, data);

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'CREATE_JOB_POSITION',
        entityType: 'JOB_POSITION',
        entityId: pos.id,
        newData: pos,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return pos;
}

export async function updateJobPosition(
    jobPositionId,
    organizationId,
    actorUserId,
    updates,
    reqMetadata = {},
) {
    const existing = await orgDao.getJobPositionById(jobPositionId);
    if (!existing || existing.organizationId !== organizationId) {
        throw new AppError('Job position not found in this organization', 404);
    }

    const updated = await orgDao.updateJobPosition(jobPositionId, updates);

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'UPDATE_JOB_POSITION',
        entityType: 'JOB_POSITION',
        entityId: jobPositionId,
        oldData: existing,
        newData: updated,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return updated;
}

export async function deleteJobPosition(
    jobPositionId,
    organizationId,
    actorUserId,
    reqMetadata = {},
) {
    const existing = await orgDao.getJobPositionById(jobPositionId);
    if (!existing || existing.organizationId !== organizationId) {
        throw new AppError('Job position not found in this organization', 404);
    }

    const deleted = await orgDao.deleteJobPosition(jobPositionId);

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'DELETE_JOB_POSITION',
        entityType: 'JOB_POSITION',
        entityId: jobPositionId,
        oldData: existing,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return deleted;
}

// ── Work Schedules ──────────────────────────────────────────────────────────

export async function getWorkSchedules(organizationId) {
    return await orgDao.getWorkSchedules(organizationId);
}

export async function getWorkScheduleById(scheduleId, organizationId) {
    const schedule = await orgDao.getWorkScheduleById(scheduleId);
    if (!schedule || schedule.organizationId !== organizationId) {
        throw new AppError('Work schedule not found in this organization', 404);
    }
    return schedule;
}

export async function createWorkSchedule(
    organizationId,
    actorUserId,
    { name, timezone, defaultBreakMinutes, days },
    reqMetadata = {},
) {
    const schedule = await orgDao.createWorkSchedule(
        organizationId,
        { name, timezone, defaultBreakMinutes },
        days,
    );

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'CREATE_WORK_SCHEDULE',
        entityType: 'WORK_SCHEDULE',
        entityId: schedule.id,
        newData: schedule,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return schedule;
}

export async function updateWorkSchedule(
    scheduleId,
    organizationId,
    actorUserId,
    { name, timezone, defaultBreakMinutes, days },
    reqMetadata = {},
) {
    const existing = await orgDao.getWorkScheduleById(scheduleId);
    if (!existing || existing.organizationId !== organizationId) {
        throw new AppError('Work schedule not found in this organization', 404);
    }

    const updated = await orgDao.updateWorkSchedule(
        scheduleId,
        { name, timezone, defaultBreakMinutes },
        days,
    );

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'UPDATE_WORK_SCHEDULE',
        entityType: 'WORK_SCHEDULE',
        entityId: scheduleId,
        oldData: existing,
        newData: updated,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return updated;
}

export async function deleteWorkSchedule(
    scheduleId,
    organizationId,
    actorUserId,
    reqMetadata = {},
) {
    const existing = await orgDao.getWorkScheduleById(scheduleId);
    if (!existing || existing.organizationId !== organizationId) {
        throw new AppError('Work schedule not found in this organization', 404);
    }

    const deleted = await orgDao.deleteWorkSchedule(scheduleId);

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'DELETE_WORK_SCHEDULE',
        entityType: 'WORK_SCHEDULE',
        entityId: scheduleId,
        oldData: existing,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return deleted;
}

// ── Holidays ─────────────────────────────────────────────────────────────────

export async function getHolidays(organizationId, year) {
    return await orgDao.getHolidays(organizationId, year);
}

export async function createHoliday(organizationId, actorUserId, data, reqMetadata = {}) {
    const holiday = await orgDao.createHoliday(organizationId, data);

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'CREATE_HOLIDAY',
        entityType: 'HOLIDAY',
        entityId: holiday.id,
        newData: holiday,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return holiday;
}

export async function deleteHoliday(holidayId, organizationId, actorUserId, reqMetadata = {}) {
    const deleted = await orgDao.deleteHoliday(holidayId);
    if (!deleted) {
        throw new AppError('Holiday not found', 404);
    }

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'DELETE_HOLIDAY',
        entityType: 'HOLIDAY',
        entityId: holidayId,
        oldData: deleted,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return deleted;
}

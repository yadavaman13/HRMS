import * as orgDao from '../../../dao/organization.dao.js';
import * as auditDao from '../../../dao/audit.dao.js';
import { AppError } from '../../auth/utils/appError.js';

export async function getSystemSettings(organizationId) {
    const org = await orgDao.getOrganizationById(organizationId);
    if (!org) {
        throw new AppError('Organization not found', 404);
    }

    const payroll = await orgDao.getPayrollSettingsByOrgId(organizationId);
    const schedules = await orgDao.getWorkSchedules(organizationId);
    const leaveTypes = await orgDao.getLeaveTypes(organizationId);
    const locations = await orgDao.getLocations(organizationId);
    const departments = await orgDao.getDepartments(organizationId);

    return {
        company: org,
        payroll,
        schedules,
        leaveTypes,
        locations,
        departments,
    };
}

export async function updatePayrollSettings(
    organizationId,
    actorUserId,
    updates,
    reqMetadata = {},
) {
    const existing = await orgDao.getPayrollSettingsByOrgId(organizationId);
    if (!existing) {
        throw new AppError('Payroll settings not found for this organization', 404);
    }

    const updated = await orgDao.updatePayrollSettingsByOrgId(organizationId, updates);

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'UPDATE_PAYROLL_SETTINGS',
        entityType: 'PAYROLL_SETTINGS',
        entityId: existing.id,
        oldData: existing,
        newData: updated,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return updated;
}

export async function getLeaveTypes(organizationId) {
    return await orgDao.getLeaveTypes(organizationId);
}

export async function createLeaveType(organizationId, actorUserId, data, reqMetadata = {}) {
    const leaveType = await orgDao.createLeaveType(organizationId, data);

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'CREATE_LEAVE_TYPE',
        entityType: 'LEAVE_TYPE',
        entityId: leaveType.id,
        newData: leaveType,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return leaveType;
}

export async function updateLeaveType(
    leaveTypeId,
    organizationId,
    actorUserId,
    updates,
    reqMetadata = {},
) {
    const existing = await orgDao.getLeaveTypeById(leaveTypeId);
    if (!existing || existing.organizationId !== organizationId) {
        throw new AppError('Leave type not found in this organization', 404);
    }

    const updated = await orgDao.updateLeaveType(leaveTypeId, updates);

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'UPDATE_LEAVE_TYPE',
        entityType: 'LEAVE_TYPE',
        entityId: leaveTypeId,
        oldData: existing,
        newData: updated,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return updated;
}

export async function deleteLeaveType(leaveTypeId, organizationId, actorUserId, reqMetadata = {}) {
    const existing = await orgDao.getLeaveTypeById(leaveTypeId);
    if (!existing || existing.organizationId !== organizationId) {
        throw new AppError('Leave type not found in this organization', 404);
    }

    const deleted = await orgDao.deleteLeaveType(leaveTypeId);

    await auditDao.createAuditLog({
        organizationId,
        actorUserId,
        action: 'DELETE_LEAVE_TYPE',
        entityType: 'LEAVE_TYPE',
        entityId: leaveTypeId,
        oldData: existing,
        ipAddress: reqMetadata.ipAddress,
        userAgent: reqMetadata.userAgent,
    });

    return deleted;
}

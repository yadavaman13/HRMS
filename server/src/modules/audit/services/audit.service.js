import * as auditDao from '../../../dao/audit.dao.js';
import { AppError } from '../../auth/utils/appError.js';

export async function getLogs(organizationId, filters) {
    return await auditDao.getAuditLogs({
        organizationId,
        ...filters,
    });
}

export async function getEntityHistory(entityType, entityId, limit, offset) {
    return await auditDao.getAuditLogsByEntity(entityType, entityId, limit, offset);
}

export async function getLogById(id) {
    const log = await auditDao.getAuditLogById(id);
    if (!log) {
        throw new AppError('Audit log record not found', 404);
    }
    return log;
}

export async function getStats(organizationId) {
    return await auditDao.getAuditStats(organizationId);
}

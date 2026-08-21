import { db } from '../config/database.config.js';
import { eq, and, sql, desc } from 'drizzle-orm';
import { auditLogs } from '../db/schema/audit.schema.js';
import { users } from '../db/schema/users.schema.js';

/**
 * Insert a new audit log entry.
 * @param {object} params
 */
export async function createAuditLog({
    organizationId,
    actorUserId,
    action,
    entityType,
    entityId,
    oldData = null,
    newData = null,
    ipAddress = null,
    userAgent = null,
}) {
    try {
        const [log] = await db
            .insert(auditLogs)
            .values({
                organizationId,
                actorUserId: actorUserId || null,
                action,
                entityType,
                entityId,
                oldData,
                newData,
                ipAddress,
                userAgent,
            })
            .returning();
        return log;
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // Non-blocking in case of audit failure so critical business transaction finishes
        return null;
    }
}

/**
 * Retrieve audit logs with filtering and actor user details.
 */
export async function getAuditLogs({
    organizationId,
    entityType,
    actorUserId,
    action,
    startDate,
    endDate,
    limit = 50,
    offset = 0,
}) {
    const filters = [eq(auditLogs.organizationId, organizationId)];

    if (entityType) {
        filters.push(eq(auditLogs.entityType, entityType));
    }
    if (actorUserId) {
        filters.push(eq(auditLogs.actorUserId, actorUserId));
    }
    if (action) {
        filters.push(eq(auditLogs.action, action));
    }
    if (startDate) {
        filters.push(sql`${auditLogs.createdAt} >= ${startDate}`);
    }
    if (endDate) {
        filters.push(sql`${auditLogs.createdAt} <= ${endDate}`);
    }

    const rows = await db
        .select({
            id: auditLogs.id,
            organizationId: auditLogs.organizationId,
            actorUserId: auditLogs.actorUserId,
            action: auditLogs.action,
            entityType: auditLogs.entityType,
            entityId: auditLogs.entityId,
            oldData: auditLogs.oldData,
            newData: auditLogs.newData,
            ipAddress: auditLogs.ipAddress,
            userAgent: auditLogs.userAgent,
            createdAt: auditLogs.createdAt,
            actor: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                role: users.role,
                profileImage: users.profileImage,
            },
        })
        .from(auditLogs)
        .leftJoin(users, eq(auditLogs.actorUserId, users.id))
        .where(and(...filters))
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit)
        .offset(offset);

    const [{ total }] = await db
        .select({ total: sql`count(*)::int` })
        .from(auditLogs)
        .where(and(...filters));

    return { logs: rows, total, limit, offset };
}

/**
 * Retrieve history timeline for a specific entity (e.g. Employee, Salary, Leave).
 */
export async function getAuditLogsByEntity(entityType, entityId, limit = 50, offset = 0) {
    const rows = await db
        .select({
            id: auditLogs.id,
            organizationId: auditLogs.organizationId,
            actorUserId: auditLogs.actorUserId,
            action: auditLogs.action,
            entityType: auditLogs.entityType,
            entityId: auditLogs.entityId,
            oldData: auditLogs.oldData,
            newData: auditLogs.newData,
            ipAddress: auditLogs.ipAddress,
            userAgent: auditLogs.userAgent,
            createdAt: auditLogs.createdAt,
            actor: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                role: users.role,
            },
        })
        .from(auditLogs)
        .leftJoin(users, eq(auditLogs.actorUserId, users.id))
        .where(and(eq(auditLogs.entityType, entityType), eq(auditLogs.entityId, entityId)))
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit)
        .offset(offset);

    return rows;
}

/**
 * Get single audit log record by ID.
 */
export async function getAuditLogById(id) {
    const [row] = await db
        .select({
            id: auditLogs.id,
            organizationId: auditLogs.organizationId,
            actorUserId: auditLogs.actorUserId,
            action: auditLogs.action,
            entityType: auditLogs.entityType,
            entityId: auditLogs.entityId,
            oldData: auditLogs.oldData,
            newData: auditLogs.newData,
            ipAddress: auditLogs.ipAddress,
            userAgent: auditLogs.userAgent,
            createdAt: auditLogs.createdAt,
            actor: {
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                role: users.role,
            },
        })
        .from(auditLogs)
        .leftJoin(users, eq(auditLogs.actorUserId, users.id))
        .where(eq(auditLogs.id, id))
        .limit(1);

    return row || null;
}

/**
 * Get audit overview stats for dashboard metrics.
 */
export async function getAuditStats(organizationId) {
    const [totalCount] = await db
        .select({ count: sql`count(*)::int` })
        .from(auditLogs)
        .where(eq(auditLogs.organizationId, organizationId));

    const topActions = await db
        .select({
            action: auditLogs.action,
            count: sql`count(*)::int`,
        })
        .from(auditLogs)
        .where(eq(auditLogs.organizationId, organizationId))
        .groupBy(auditLogs.action)
        .orderBy(desc(sql`count(*)`))
        .limit(5);

    const topEntities = await db
        .select({
            entityType: auditLogs.entityType,
            count: sql`count(*)::int`,
        })
        .from(auditLogs)
        .where(eq(auditLogs.organizationId, organizationId))
        .groupBy(auditLogs.entityType)
        .orderBy(desc(sql`count(*)`))
        .limit(5);

    return {
        totalLogs: totalCount?.count || 0,
        topActions,
        topEntities,
    };
}

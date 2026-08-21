import * as notificationDao from '../../../dao/notification.dao.js';
import { db } from '../../../config/database.config.js';
import { users } from '../../../db/schema/users.schema.js';
import { employees } from '../../../db/schema/employees.schema.js';
import { eq, and } from 'drizzle-orm';
import { AppError } from '../../auth/utils/appError.js';

export async function sendNotification({
    userId,
    type,
    title,
    message,
    referenceType,
    referenceId,
}) {
    return await notificationDao.createNotification({
        userId,
        type,
        title,
        message,
        referenceType,
        referenceId,
    });
}

export async function sendBroadcastNotification(
    organizationId,
    { type = 'general', title, message, departmentId = null, role = null },
) {
    let query = db
        .select({
            id: users.id,
            organizationId: users.organizationId,
        })
        .from(users);

    const filters = [
        eq(users.organizationId, organizationId),
        eq(users.isActive, true),
        eq(users.isDeleted, false),
    ];

    if (role) {
        filters.push(eq(users.role, role));
    }

    if (departmentId) {
        query = query.innerJoin(employees, eq(users.id, employees.userId));
        filters.push(eq(employees.departmentId, departmentId));
    }

    const recipients = await query.where(and(...filters));

    if (recipients.length === 0) {
        return { sentCount: 0 };
    }

    const notificationsToInsert = recipients.map((u) => ({
        userId: u.id,
        type,
        title,
        message,
        referenceType: 'BROADCAST',
        referenceId: null,
        isRead: false,
    }));

    const inserted = await notificationDao.createBulkNotifications(notificationsToInsert);
    return { sentCount: inserted.length };
}

export async function getMyNotifications(userId, filters) {
    return await notificationDao.getNotificationsByUser(userId, filters);
}

export async function getUnreadCount(userId) {
    return await notificationDao.getUnreadCount(userId);
}

export async function markAsRead(id, userId) {
    const notification = await notificationDao.markNotificationAsRead(id, userId);
    if (!notification) {
        throw new AppError('Notification not found or access denied', 404);
    }
    return notification;
}

export async function markAllAsRead(userId) {
    return await notificationDao.markAllNotificationsAsRead(userId);
}

export async function deleteNotification(id, userId) {
    const deleted = await notificationDao.deleteNotification(id, userId);
    if (!deleted) {
        throw new AppError('Notification not found or access denied', 404);
    }
    return deleted;
}

import { db } from '../config/database.config.js';
import { eq, and, sql, desc } from 'drizzle-orm';
import { notifications } from '../db/schema/notifications.schema.js';

/**
 * Create a single notification.
 */
export async function createNotification({
    userId,
    type,
    title,
    message = null,
    referenceType = null,
    referenceId = null,
}) {
    const [row] = await db
        .insert(notifications)
        .values({
            userId,
            type,
            title,
            message,
            referenceType,
            referenceId,
            isRead: false,
        })
        .returning();
    return row;
}

/**
 * Bulk create notifications (for broadcasts or team announcements).
 */
export async function createBulkNotifications(notificationsArray) {
    if (!notificationsArray || notificationsArray.length === 0) return [];
    return await db.insert(notifications).values(notificationsArray).returning();
}

/**
 * Get notifications for a user with pagination and read/unread filter.
 */
export async function getNotificationsByUser(userId, { isRead, limit = 20, offset = 0 } = {}) {
    const filters = [eq(notifications.userId, userId)];

    if (typeof isRead === 'boolean') {
        filters.push(eq(notifications.isRead, isRead));
    }

    const rows = await db
        .select()
        .from(notifications)
        .where(and(...filters))
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
        .offset(offset);

    const [{ total }] = await db
        .select({ total: sql`count(*)::int` })
        .from(notifications)
        .where(and(...filters));

    return { notifications: rows, total, limit, offset };
}

/**
 * Get unread notification count for badge display.
 */
export async function getUnreadCount(userId) {
    const [result] = await db
        .select({ count: sql`count(*)::int` })
        .from(notifications)
        .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));

    return result?.count || 0;
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationAsRead(id, userId) {
    const [row] = await db
        .update(notifications)
        .set({ isRead: true, readAt: new Date() })
        .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
        .returning();
    return row || null;
}

/**
 * Mark all notifications for a user as read.
 */
export async function markAllNotificationsAsRead(userId) {
    const rows = await db
        .update(notifications)
        .set({ isRead: true, readAt: new Date() })
        .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
        .returning();
    return rows.length;
}

/**
 * Delete a notification.
 */
export async function deleteNotification(id, userId) {
    const [deleted] = await db
        .delete(notifications)
        .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
        .returning();
    return deleted || null;
}

import * as notificationService from '../services/notification.service.js';
import { sendResponse } from '../../../utils/response.utlis.js';

export async function getMyNotifications(req, res, next) {
    try {
        const { isRead, limit, offset } = req.query;
        const parsedIsRead = isRead !== undefined ? isRead === 'true' : undefined;

        const result = await notificationService.getMyNotifications(req.user.id, {
            isRead: parsedIsRead,
            limit: limit ? +limit : 20,
            offset: offset ? +offset : 0,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Notifications retrieved successfully',
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export async function getUnreadCount(req, res, next) {
    try {
        const unreadCount = await notificationService.getUnreadCount(req.user.id);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Unread notification count retrieved',
            success: true,
            data: { unreadCount },
        });
    } catch (error) {
        next(error);
    }
}

export async function markAsRead(req, res, next) {
    try {
        const notification = await notificationService.markAsRead(req.params.id, req.user.id);
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Notification marked as read',
            success: true,
            data: { notification },
        });
    } catch (error) {
        next(error);
    }
}

export async function markAllAsRead(req, res, next) {
    try {
        const count = await notificationService.markAllAsRead(req.user.id);
        return sendResponse({
            res,
            statusCode: 200,
            message: `${count} notifications marked as read`,
            success: true,
            data: { count },
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteNotification(req, res, next) {
    try {
        const notification = await notificationService.deleteNotification(
            req.params.id,
            req.user.id,
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: 'Notification deleted successfully',
            success: true,
            data: { notification },
        });
    } catch (error) {
        next(error);
    }
}

export async function broadcastNotification(req, res, next) {
    try {
        const result = await notificationService.sendBroadcastNotification(
            req.user.organizationId,
            req.body,
        );
        return sendResponse({
            res,
            statusCode: 200,
            message: `Broadcast sent to ${result.sentCount} recipients`,
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

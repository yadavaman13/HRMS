import { useCallback, useContext } from 'react';
import { NotificationsContext } from '../context/notifications.context';
import * as notificationsApi from '../services/notifications.api';

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }

    const { setNotifications, setUnreadCount, setLoading, setError } = context;

    const loadNotifications = useCallback(
        async (params = {}) => {
            setLoading(true);
            setError(null);
            try {
                const data = await notificationsApi.fetchNotifications(params);
                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data?.notifications)
                      ? data.data.notifications
                      : Array.isArray(data.data)
                        ? data.data
                        : Array.isArray(data.notifications)
                          ? data.notifications
                          : [];
                setNotifications(list);
                return list;
            } catch (err) {
                console.error('Error loading notifications:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to load notifications',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setNotifications],
    );

    const loadUnreadCount = useCallback(async () => {
        try {
            const data = await notificationsApi.fetchUnreadCount();
            const count =
                data.data?.unreadCount !== undefined
                    ? data.data.unreadCount
                    : data.unreadCount || 0;
            setUnreadCount(count);
            return count;
        } catch (err) {
            console.error('Error loading unread count:', err);
            return 0;
        }
    }, [setUnreadCount]);

    const handleMarkAsRead = useCallback(
        async (notificationId) => {
            try {
                await notificationsApi.markNotificationAsRead(notificationId);
                setNotifications((prev) =>
                    prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            } catch (err) {
                console.error('Error marking notification as read:', err);
            }
        },
        [setNotifications, setUnreadCount],
    );

    const handleMarkAllRead = useCallback(async () => {
        try {
            await notificationsApi.markAllNotificationsAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    }, [setNotifications, setUnreadCount]);

    // Export ACTION HANDLERS ONLY
    return {
        loadNotifications,
        loadUnreadCount,
        handleMarkAsRead,
        handleMarkAllRead,
    };
};

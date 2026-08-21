import axios from 'axios';

const notificationsApiInstance = axios.create({
    baseURL: '/api/notifications',
    withCredentials: true,
});

export async function fetchNotifications(params = {}) {
    const response = await notificationsApiInstance.get('/', { params });
    return response.data;
}

export async function fetchUnreadCount() {
    const response = await notificationsApiInstance.get('/unread-count');
    return response.data;
}

export async function markNotificationAsRead(notificationId) {
    const response = await notificationsApiInstance.patch(`/${notificationId}/read`);
    return response.data;
}

export async function markAllNotificationsAsRead() {
    const response = await notificationsApiInstance.patch('/read-all');
    return response.data;
}

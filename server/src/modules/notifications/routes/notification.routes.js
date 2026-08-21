import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { protect, restrictTo } from '../../auth/middleware/auth.middleware.js';
import {
    notificationListValidator,
    notificationIdValidator,
    broadcastValidator,
} from '../validators/notification.validator.js';

const router = Router();
router.use(protect);

router.get('/', notificationListValidator, notificationController.getMyNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', notificationIdValidator, notificationController.markAsRead);
router.delete('/:id', notificationIdValidator, notificationController.deleteNotification);

// Admin broadcast
router.post(
    '/broadcast',
    restrictTo('admin', 'hr'),
    broadcastValidator,
    notificationController.broadcastNotification,
);

export default router;

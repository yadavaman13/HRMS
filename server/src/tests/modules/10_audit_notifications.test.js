import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '10_audit_notifications.md',
    'Feature 10: Audit Logs & Notifications API',
    'Covers immutable audit trail inspection, activity metrics, entity audit history, employee in-app notifications, and admin broadcast alerts.',
);

describe('10: Audit Logs & Notifications API', () => {
    let adminUser;
    let employeeUser;
    let auditLogId;
    let notificationId;

    beforeAll(async () => {
        adminUser = await createAndLoginTestUser({ role: 'admin' });
        employeeUser = await createAndLoginTestUser({ role: 'employee' });
    });

    afterAll(() => {
        docLogger.save();
    });

    describe('Audit Logs & Activity Metrics (Admin)', () => {
        it('should list audit logs (Admin)', async () => {
            const res = await request(app).get('/api/audit-logs').set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'List Audit Logs (Admin)',
                method: 'GET',
                endpoint: '/api/audit-logs',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves immutable system activity logs with actor metadata and IP addresses.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.logs).toBeInstanceOf(Array);

            if (res.body.data.logs.length > 0) {
                auditLogId = res.body.data.logs[0].id;
            }
        });

        it('should get audit log summary stats (Admin)', async () => {
            const res = await request(app)
                .get('/api/audit-logs/stats')
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Audit Activity Stats (Admin)',
                method: 'GET',
                endpoint: '/api/audit-logs/stats',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Aggregates security events by action type and frequency.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should get audit log by ID (Admin)', async () => {
            if (!auditLogId) return;

            const res = await request(app)
                .get(`/api/audit-logs/${auditLogId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Audit Log by ID (Admin)',
                method: 'GET',
                endpoint: `/api/audit-logs/${auditLogId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves complete before/after state diff and actor metadata.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should get entity audit history (Admin)', async () => {
            const res = await request(app)
                .get(`/api/audit-logs/entity/employee/${employeeUser.user.id}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Entity Audit History (Admin)',
                method: 'GET',
                endpoint: `/api/audit-logs/entity/employee/${employeeUser.user.id}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Filters audit trail for specific target entity (e.g. employee, payroll_period, leave_request).',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.history).toBeInstanceOf(Array);
        });
    });

    describe('Notifications Management & Broadcasts', () => {
        it('should broadcast notification to all employees (Admin)', async () => {
            const broadcastPayload = {
                title: 'System Maintenance Notice',
                message: 'Scheduled maintenance will take place this Sunday at midnight.',
                type: 'system_alert',
            };

            const res = await request(app)
                .post('/api/notifications/broadcast')
                .set('Cookie', adminUser.cookie)
                .send(broadcastPayload);

            docLogger.record({
                scenario: 'Broadcast Notification (Admin)',
                method: 'POST',
                endpoint: '/api/notifications/broadcast',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: broadcastPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Dispatches company-wide announcement to all active employee accounts.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should list user notifications (200 OK)', async () => {
            const res = await request(app)
                .get('/api/notifications')
                .set('Cookie', employeeUser.cookie);

            docLogger.record({
                scenario: 'Get My Notifications (Success)',
                method: 'GET',
                endpoint: '/api/notifications',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves recent alerts and status updates for the employee.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.notifications).toBeInstanceOf(Array);

            if (res.body.data.notifications.length > 0) {
                notificationId = res.body.data.notifications[0].id;
            }
        });

        it('should get unread notification count (200 OK)', async () => {
            const res = await request(app)
                .get('/api/notifications/unread-count')
                .set('Cookie', employeeUser.cookie);

            docLogger.record({
                scenario: 'Get Unread Notification Count (Success)',
                method: 'GET',
                endpoint: '/api/notifications/unread-count',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Returns badge count of unread messages for topbar notifications indicator.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should mark single notification as read (200 OK)', async () => {
            if (!notificationId) return;

            const res = await request(app)
                .patch(`/api/notifications/${notificationId}/read`)
                .set('Cookie', employeeUser.cookie);

            docLogger.record({
                scenario: 'Mark Notification as Read (Success)',
                method: 'PATCH',
                endpoint: `/api/notifications/${notificationId}/read`,
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Marks specified alert as read.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should mark all notifications as read (200 OK)', async () => {
            const res = await request(app)
                .patch('/api/notifications/read-all')
                .set('Cookie', employeeUser.cookie);

            docLogger.record({
                scenario: 'Mark All Notifications Read (Success)',
                method: 'PATCH',
                endpoint: '/api/notifications/read-all',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Clears unread flag on all user alerts in batch.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should delete notification by ID (200 OK)', async () => {
            if (!notificationId) return;

            const res = await request(app)
                .delete(`/api/notifications/${notificationId}`)
                .set('Cookie', employeeUser.cookie);

            docLogger.record({
                scenario: 'Delete Notification (Success)',
                method: 'DELETE',
                endpoint: `/api/notifications/${notificationId}`,
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Permanently removes dismissed notification from user inbox.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});

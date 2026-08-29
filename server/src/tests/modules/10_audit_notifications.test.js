import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '10_audit_notifications.md',
    'Feature 10: Audit Logs & Notifications API',
    'Covers immutable audit trail inspection, activity metrics, employee in-app notifications, and admin broadcast alerts.',
);

describe('10: Audit Logs & Notifications API', () => {
    let adminUser;
    let employeeUser;

    beforeAll(async () => {
        adminUser = await createAndLoginTestUser({ role: 'admin' });
        employeeUser = await createAndLoginTestUser({ role: 'employee' });
    });

    afterAll(() => {
        docLogger.save();
    });

    describe('GET /api/audit-logs & /stats', () => {
        it('should list audit logs (Admin)', async () => {
            const res = await request(app)
                .get('/api/audit-logs')
                .set('Cookie', adminUser.cookie);

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
    });

    describe('GET & PATCH /api/notifications', () => {
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
                notes: 'Returns badge count of unread messages.',
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
                notes: 'Clears unread flag on all user alerts.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

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
                notes: 'Dispatches company-wide announcement.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});

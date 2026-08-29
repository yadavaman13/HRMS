import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '08_dashboard_analytics.md',
    'Feature 08: Dashboard & Workforce Overview API',
    'Covers executive analytics, employee self-service metrics, and modular attendance, leave, headcount, and payroll breakdowns.',
);

describe('08: Dashboard & Workforce Overview API', () => {
    let adminUser;
    let employeeUser;

    beforeAll(async () => {
        adminUser = await createAndLoginTestUser({ role: 'admin' });
        employeeUser = await createAndLoginTestUser({ role: 'employee' });
    });

    afterAll(() => {
        docLogger.save();
    });

    describe('GET /api/dashboard', () => {
        it('should return executive dashboard for Admin (200 OK)', async () => {
            const res = await request(app)
                .get('/api/dashboard')
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Executive Dashboard (Admin)',
                method: 'GET',
                endpoint: '/api/dashboard',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Smart root router detects Admin role and returns high-level company metrics.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.role).toBe('admin');
        });
    });

    describe('Modular Section Analytics (Admin)', () => {
        it('should return attendance dashboard breakdown (200 OK)', async () => {
            const res = await request(app)
                .get('/api/dashboard/attendance')
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Attendance Dashboard Slice (Admin)',
                method: 'GET',
                endpoint: '/api/dashboard/attendance',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Provides today attendance counts, 7-day trend, and pending regularization requests.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.todayAttendance).toBeDefined();
        });

        it('should return leave dashboard breakdown (200 OK)', async () => {
            const res = await request(app)
                .get('/api/dashboard/leave')
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Leave Dashboard Slice (Admin)',
                method: 'GET',
                endpoint: '/api/dashboard/leave',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Provides pending leave requests queue and leave distribution by type.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.pendingLeaves).toBeDefined();
        });

        it('should return workforce headcount breakdown (200 OK)', async () => {
            const res = await request(app)
                .get('/api/dashboard/employees')
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Employees Headcount Slice (Admin)',
                method: 'GET',
                endpoint: '/api/dashboard/employees',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Provides total active, probation, and department breakdown.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.headcount).toBeDefined();
        });

        it('should return payroll overview breakdown (200 OK)', async () => {
            const res = await request(app)
                .get('/api/dashboard/payroll')
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Payroll Dashboard Slice (Admin)',
                method: 'GET',
                endpoint: '/api/dashboard/payroll',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Provides latest payroll period status and financial totals.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});

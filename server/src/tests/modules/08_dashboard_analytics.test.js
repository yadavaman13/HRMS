import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '08_dashboard_analytics.md',
    'Feature 08: Dashboard & Workforce Overview API',
    'Covers executive analytics, contextual single-employee inspection, employee self-service metrics, and modular attendance, leave, headcount, and payroll breakdowns.',
);

describe('08: Dashboard & Workforce Overview API', () => {
    let adminUser;
    let employeeUser;
    let targetEmployeeId;

    beforeAll(async () => {
        adminUser = await createAndLoginTestUser({ role: 'admin' });
        const timestamp = Date.now();
        const res = await request(app)
            .post('/api/employees')
            .set('Cookie', adminUser.cookie)
            .send({
                firstName: 'George',
                lastName: 'Clark',
                email: `george_${timestamp}@personal.com`,
                phone: '9333322220',
                joiningDate: '2026-08-01',
                employmentType: 'full_time',
            });

        targetEmployeeId = res.body.data.employee?.id;

        const workEmail =
            res.body.data.credentials?.workEmail ||
            res.body.data.credentials?.loginId ||
            res.body.data.employee?.workEmail;
        const tempPassword =
            res.body.data.credentials?.temporaryPassword || res.body.data.tempPassword;

        const loginRes = await request(app).post('/api/auth/login').send({
            email: workEmail,
            password: tempPassword,
        });

        const cookieHeader = loginRes.headers['set-cookie'];
        const tokenCookie = cookieHeader ? cookieHeader[0].split(';')[0] : '';
        employeeUser = {
            cookie: tokenCookie,
            employeeId: targetEmployeeId,
        };
    });

    afterAll(() => {
        docLogger.save();
    });

    describe('Root & Explicit Role Dashboards', () => {
        it('should return executive dashboard for Admin on root route (200 OK)', async () => {
            const res = await request(app).get('/api/dashboard').set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Executive Dashboard via Root (Admin)',
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

        it('should return explicit Admin dashboard (200 OK)', async () => {
            const res = await request(app)
                .get('/api/dashboard/admin')
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Explicit Admin Dashboard (Admin)',
                method: 'GET',
                endpoint: '/api/dashboard/admin',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Direct endpoint for organizational KPIs, headcount, and pending approval queues.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return employee self-service dashboard (200 OK)', async () => {
            const res = await request(app)
                .get('/api/dashboard/employee')
                .set('Cookie', employeeUser.cookie);

            docLogger.record({
                scenario: 'Get Employee Self-Service Dashboard (Success)',
                method: 'GET',
                endpoint: '/api/dashboard/employee',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Returns personal daily punch status, remaining leave counters, and latest payslip preview.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return employee dashboard via /me alias (200 OK)', async () => {
            const res = await request(app)
                .get('/api/dashboard/me')
                .set('Cookie', employeeUser.cookie);

            docLogger.record({
                scenario: 'Get My Dashboard Summary via Alias (Success)',
                method: 'GET',
                endpoint: '/api/dashboard/me',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Convenience alias for current employee overview.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return contextual single-employee dashboard for Admin (200 OK)', async () => {
            if (!targetEmployeeId) return;

            const res = await request(app)
                .get(`/api/dashboard/employee/${targetEmployeeId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Contextual Single-Employee Dashboard (Admin)',
                method: 'GET',
                endpoint: `/api/dashboard/employee/${targetEmployeeId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Allows HR/Admin to inspect any specific employee personal dashboard slice (impersonation view).',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.employee).toBeDefined();
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

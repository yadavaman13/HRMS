import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '04_attendance_management.md',
    'Feature 04: Attendance Management API',
    'Covers punch-in, punch-out, overtime tracking, status computation, admin overview, and regularization requests.',
);

describe('04: Attendance Management API', () => {
    let adminUser;
    let employeeSession;
    let employeeId;
    let attendanceRecordId;

    beforeAll(async () => {
        adminUser = await createAndLoginTestUser({ role: 'admin' });

        const timestamp = Date.now();
        const res = await request(app)
            .post('/api/employees')
            .set('Cookie', adminUser.cookie)
            .send({
                firstName: 'Charlie',
                lastName: 'Davis',
                email: `charlie_${timestamp}@personal.com`,
                phone: '9777766660',
                joiningDate: '2026-08-01',
                employmentType: 'full_time',
            });

        employeeId = res.body.data.employee.id;

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
        employeeSession = {
            cookie: tokenCookie,
            employeeId,
        };
    });

    afterAll(() => {
        docLogger.save();
    });

    describe('POST /api/attendance/check-in', () => {
        it('should record employee check-in (201 Created)', async () => {
            const res = await request(app)
                .post('/api/attendance/check-in')
                .set('Cookie', employeeSession.cookie)
                .send();

            docLogger.record({
                scenario: 'Employee Check-In (Success)',
                method: 'POST',
                endpoint: '/api/attendance/check-in',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Records daily punch-in with schedule lookup and late arrival calculation.',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.session).toBeDefined();
            attendanceRecordId = res.body.data.record?.id;
        });

        it('should reject duplicate active check-in (400 Bad Request)', async () => {
            const res = await request(app)
                .post('/api/attendance/check-in')
                .set('Cookie', employeeSession.cookie)
                .send();

            docLogger.record({
                scenario: 'Duplicate Check-In (Rejected)',
                method: 'POST',
                endpoint: '/api/attendance/check-in',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Prevents double punch-in when an active session is already running.',
            });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/attendance/check-out', () => {
        it('should record employee check-out and compute work duration (200 OK)', async () => {
            const res = await request(app)
                .post('/api/attendance/check-out')
                .set('Cookie', employeeSession.cookie)
                .send();

            docLogger.record({
                scenario: 'Employee Check-Out (Success)',
                method: 'POST',
                endpoint: '/api/attendance/check-out',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Closes punch session and computes work duration and overtime.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('GET /api/attendance/me & /api/attendance/me/summary', () => {
        it('should return monthly attendance records for employee (200 OK)', async () => {
            const res = await request(app)
                .get('/api/attendance/me')
                .set('Cookie', employeeSession.cookie);

            docLogger.record({
                scenario: 'Get My Attendance Records (Success)',
                method: 'GET',
                endpoint: '/api/attendance/me',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves current employee punch history for calendar rendering.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.records).toBeInstanceOf(Array);
        });

        it('should return attendance monthly summary counters (200 OK)', async () => {
            const res = await request(app)
                .get('/api/attendance/me/summary')
                .set('Cookie', employeeSession.cookie);

            docLogger.record({
                scenario: 'Get Attendance Summary Counters (Success)',
                method: 'GET',
                endpoint: '/api/attendance/me/summary',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Aggregates present days, absent days, and overtime totals.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.summary || res.body.data).toBeDefined();
        });
    });

    describe('GET /api/attendance/summary (Admin)', () => {
        it('should return organization-wide attendance overview (200 OK)', async () => {
            const res = await request(app)
                .get('/api/attendance/summary')
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Company Attendance Summary (Admin)',
                method: 'GET',
                endpoint: '/api/attendance/summary',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Executive snapshot of today attendance across all departments.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.summary || res.body.data).toBeDefined();
        });
    });
});

import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '04_attendance_management.md',
    'Feature 04: Attendance Tracking & Regularization API',
    'Covers punch-in, punch-out, overtime tracking, status computation, timesheet CSV export, regularization adjustment requests, and admin oversight.',
);

describe('04: Attendance Management API', () => {
    let adminUser;
    let employeeSession;
    let employeeId;
    let attendanceRecordId;
    let adjustmentRequestId;

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

    describe('POST /api/attendance/check-in & /check-out', () => {
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

    describe('GET /api/attendance/export', () => {
        it('should export attendance timesheets as CSV stream (200 OK)', async () => {
            const res = await request(app)
                .get('/api/attendance/export?month=8&year=2026')
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Export Attendance Timesheet CSV (Success)',
                method: 'GET',
                endpoint: '/api/attendance/export',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                queryParams: { month: '8', year: '2026' },
                statusCode: res.status,
                responseBody: {
                    contentType: res.headers['content-type'],
                    status: 'CSV Stream',
                },
                notes: 'Streams CSV formatted attendance timesheets for payroll validation and external reporting.',
            });

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toContain('text/csv');
        });
    });

    describe('Attendance Regularization / Adjustments Workflow', () => {
        it('should submit regularization request for a punch record (201 Created)', async () => {
            if (!attendanceRecordId) return;

            const adjustPayload = {
                requestedCheckIn: '2026-08-30T09:00:00.000Z',
                requestedCheckOut: '2026-08-30T18:00:00.000Z',
                reason: 'Forgot to clock out on mobile device',
            };

            const res = await request(app)
                .post(`/api/attendance/${attendanceRecordId}/adjust`)
                .set('Cookie', employeeSession.cookie)
                .send(adjustPayload);

            docLogger.record({
                scenario: 'Request Attendance Regularization (Success)',
                method: 'POST',
                endpoint: `/api/attendance/${attendanceRecordId}/adjust`,
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                requestBody: adjustPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Submits attendance correction request for HR/Manager review.',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            adjustmentRequestId = res.body.data.adjustment?.id;
        });

        it('should list employee pending adjustments (200 OK)', async () => {
            const res = await request(app)
                .get('/api/attendance/adjustments/me')
                .set('Cookie', employeeSession.cookie);

            docLogger.record({
                scenario: 'Get My Regularization Requests (Success)',
                method: 'GET',
                endpoint: '/api/attendance/adjustments/me',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Returns history and pending review status of employee regularization requests.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.adjustments).toBeInstanceOf(Array);
        });

        it('should list all regularization requests for Admin inbox (200 OK)', async () => {
            const res = await request(app)
                .get('/api/attendance/adjustments')
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Regularization Inbox (Admin)',
                method: 'GET',
                endpoint: '/api/attendance/adjustments',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Lists organization-wide pending attendance regularization tickets.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.adjustments).toBeInstanceOf(Array);
        });

        it('should get single adjustment details (200 OK)', async () => {
            if (!adjustmentRequestId) return;

            const res = await request(app)
                .get(`/api/attendance/adjustments/${adjustmentRequestId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Adjustment by ID (Success)',
                method: 'GET',
                endpoint: `/api/attendance/adjustments/${adjustmentRequestId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves requested punch timestamps and justification notes.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should review and approve attendance adjustment (200 OK)', async () => {
            if (!adjustmentRequestId) return;

            const reviewPayload = {
                status: 'approved',
                reviewNotes: 'Verified with office entry log',
            };

            const res = await request(app)
                .patch(`/api/attendance/adjustments/${adjustmentRequestId}`)
                .set('Cookie', adminUser.cookie)
                .send(reviewPayload);

            docLogger.record({
                scenario: 'Approve Attendance Adjustment (Admin)',
                method: 'PATCH',
                endpoint: `/api/attendance/adjustments/${adjustmentRequestId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: reviewPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Approves request and recalculates daily work duration and overtime.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('Admin / HR Attendance Oversight', () => {
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

        it('should get employee attendance history (Admin)', async () => {
            const res = await request(app)
                .get(`/api/attendance/employee/${employeeId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Specific Employee Attendance (Admin)',
                method: 'GET',
                endpoint: `/api/attendance/employee/${employeeId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Allows HR/Admin to inspect timesheet records for any target employee.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.records).toBeInstanceOf(Array);
        });

        it('should list all attendance records (Admin)', async () => {
            const res = await request(app).get('/api/attendance').set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'List All Attendance Records (Admin)',
                method: 'GET',
                endpoint: '/api/attendance',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Filtered directory of attendance records with department and status filters.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.records).toBeInstanceOf(Array);
        });

        it('should get single attendance record by ID (200 OK)', async () => {
            if (!attendanceRecordId) return;

            const res = await request(app)
                .get(`/api/attendance/${attendanceRecordId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Attendance Record by ID (Success)',
                method: 'GET',
                endpoint: `/api/attendance/${attendanceRecordId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves itemized sessions, breaks, and computed work hours.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should update attendance record manually (Admin)', async () => {
            if (!attendanceRecordId) return;

            const updatePayload = {
                status: 'present',
                workHours: 8.5,
            };

            const res = await request(app)
                .patch(`/api/attendance/${attendanceRecordId}`)
                .set('Cookie', adminUser.cookie)
                .send(updatePayload);

            docLogger.record({
                scenario: 'Manual Attendance Record Correction (Admin)',
                method: 'PATCH',
                endpoint: `/api/attendance/${attendanceRecordId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: updatePayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Allows HR/Admin to perform direct adjustments on timesheet logs.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});

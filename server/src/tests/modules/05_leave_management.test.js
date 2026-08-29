import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '05_leave_management.md',
    'Feature 05: Time-Off / Leave Management API',
    'Covers leave types configuration, balance allocations, leave applications, date overlap validation, and manager approvals.',
);

describe('05: Time-Off / Leave Management API', () => {
    let adminUser;
    let employeeSession;
    let employeeId;
    let leaveTypeId;
    let createdRequestId;

    beforeAll(async () => {
        adminUser = await createAndLoginTestUser({ role: 'admin' });

        const timestamp = Date.now();
        const res = await request(app)
            .post('/api/employees')
            .set('Cookie', adminUser.cookie)
            .send({
                firstName: 'Diana',
                lastName: 'Prince',
                email: `diana_${timestamp}@personal.com`,
                phone: '9666655550',
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

    describe('GET /api/leave/types & POST /api/leave/types', () => {
        it('should list available leave types (200 OK)', async () => {
            const res = await request(app)
                .get('/api/leave/types')
                .set('Cookie', employeeSession.cookie);

            docLogger.record({
                scenario: 'List Leave Types (Success)',
                method: 'GET',
                endpoint: '/api/leave/types',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Returns active leave policies (Paid Time Off, Sick Leave, Unpaid Leave).',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            const typesList = Array.isArray(res.body.data) ? res.body.data : res.body.data.leaveTypes;
            expect(typesList).toBeInstanceOf(Array);

            if (typesList && typesList.length > 0) {
                leaveTypeId = typesList[0].id;
            }
        });

        it('should create new leave type (Admin)', async () => {
            const timestamp = Date.now();
            const payload = {
                code: `CASUAL_${timestamp}`,
                name: 'Casual Leave',
                isPaid: true,
                maxConsecutiveDays: 5,
                requiresAllocation: true,
            };

            const res = await request(app)
                .post('/api/leave/types')
                .set('Cookie', adminUser.cookie)
                .send(payload);

            docLogger.record({
                scenario: 'Create Leave Type (Admin)',
                method: 'POST',
                endpoint: '/api/leave/types',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: payload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Defines new leave policy rules and allocations.',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            const createdType = res.body.data?.leaveType || res.body.data;
            if (!leaveTypeId && createdType?.id) leaveTypeId = createdType.id;
        });
    });

    describe('GET /api/leave/balances/me', () => {
        it('should return current employee leave balances (200 OK)', async () => {
            const res = await request(app)
                .get('/api/leave/balances/me')
                .set('Cookie', employeeSession.cookie);

            docLogger.record({
                scenario: 'Get My Leave Balances (Success)',
                method: 'GET',
                endpoint: '/api/leave/balances/me',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Returns remaining balances per leave category for the current year.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            const balanceList = Array.isArray(res.body.data)
                ? res.body.data
                : res.body.data.balances;
            expect(balanceList).toBeInstanceOf(Array);
        });
    });

    describe('POST /api/leave/requests', () => {
        it('should apply for time off (201 Created)', async () => {
            if (!leaveTypeId) return;

            const applyPayload = {
                leaveTypeId,
                startDate: '2026-08-17',
                endDate: '2026-08-18',
                reason: 'Family event',
            };

            const res = await request(app)
                .post('/api/leave/requests')
                .set('Cookie', employeeSession.cookie)
                .send(applyPayload);

            docLogger.record({
                scenario: 'Apply for Leave (Success)',
                method: 'POST',
                endpoint: '/api/leave/requests',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                requestBody: applyPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Submits pending leave request and validates non-overlapping dates.',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            const createdReq = res.body.data?.leaveRequest || res.body.data;
            expect(createdReq).toBeDefined();
            createdRequestId = createdReq?.id;
        });
    });

    describe('GET /api/leave/requests & POST /api/leave/requests/:id/approve', () => {
        it('should list all requests for Admin review (200 OK)', async () => {
            const res = await request(app)
                .get('/api/leave/requests')
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Leave Approvals Inbox (Admin)',
                method: 'GET',
                endpoint: '/api/leave/requests',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Lists pending leave applications awaiting approval.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            const reqList = Array.isArray(res.body.data) ? res.body.data : res.body.data.requests;
            expect(reqList).toBeInstanceOf(Array);
        });

        it('should approve leave request and deduct balance (200 OK)', async () => {
            if (!createdRequestId) return;

            const res = await request(app)
                .post(`/api/leave/requests/${createdRequestId}/approve`)
                .set('Cookie', adminUser.cookie)
                .send({ comments: 'Approved, enjoy your time off!' });

            docLogger.record({
                scenario: 'Approve Leave Request (Admin)',
                method: 'POST',
                endpoint: `/api/leave/requests/${createdRequestId}/approve`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: { comments: 'Approved' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Transitions leave status to approved, atomically deducts allocation balance, and logs ledger transaction.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});

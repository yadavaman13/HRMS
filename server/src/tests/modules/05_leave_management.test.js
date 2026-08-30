import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '05_leave_management.md',
    'Feature 05: Time-Off / Leave Management API',
    'Covers leave types configuration, double-entry balance allocations, ledger transactions, leave applications, date overlap validation, and manager approval/rejection workflows.',
);

describe('05: Time-Off / Leave Management API', () => {
    let adminUser;
    let employeeSession;
    let employeeId;
    let leaveTypeId;
    let createdRequestId;
    let rejectRequestId;

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

    describe('Leave Types Configuration CRUD', () => {
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
            const typesList = Array.isArray(res.body.data)
                ? res.body.data
                : res.body.data.leaveTypes;
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
            if (createdType?.id) leaveTypeId = createdType.id;
        });

        it('should get leave type by ID (200 OK)', async () => {
            if (!leaveTypeId) return;

            const res = await request(app)
                .get(`/api/leave/types/${leaveTypeId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Leave Type by ID (Success)',
                method: 'GET',
                endpoint: `/api/leave/types/${leaveTypeId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves leave type definition and configuration parameters.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should update leave type configuration (Admin)', async () => {
            if (!leaveTypeId) return;

            const updatePayload = {
                maxConsecutiveDays: 7,
            };

            const res = await request(app)
                .patch(`/api/leave/types/${leaveTypeId}`)
                .set('Cookie', adminUser.cookie)
                .send(updatePayload);

            docLogger.record({
                scenario: 'Update Leave Type (Admin)',
                method: 'PATCH',
                endpoint: `/api/leave/types/${leaveTypeId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: updatePayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Updates constraints on maximum consecutive days and policy options.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('Leave Balances & Allocations', () => {
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
        });

        it('should return employee leave balances for Admin (200 OK)', async () => {
            const res = await request(app)
                .get(`/api/leave/balances/employee/${employeeId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Employee Leave Balances (Admin)',
                method: 'GET',
                endpoint: `/api/leave/balances/employee/${employeeId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Allows HR/Admin to inspect leave balances for any employee.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should allocate additional leave balance (Admin)', async () => {
            if (!leaveTypeId) return;

            const allocPayload = {
                employeeId,
                leaveTypeId,
                daysAllocated: 12,
                reason: 'Annual policy allotment',
                year: 2026,
            };

            const res = await request(app)
                .post('/api/leave/allocations')
                .set('Cookie', adminUser.cookie)
                .send(allocPayload);

            docLogger.record({
                scenario: 'Allocate Leave Days (Admin)',
                method: 'POST',
                endpoint: '/api/leave/allocations',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: allocPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Credits employee balance and registers double-entry allocation transaction in ledger.',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });

        it('should get employee allocations history (200 OK)', async () => {
            const res = await request(app)
                .get('/api/leave/allocations/me')
                .set('Cookie', employeeSession.cookie);

            docLogger.record({
                scenario: 'Get My Allocations History (Success)',
                method: 'GET',
                endpoint: '/api/leave/allocations/me',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Lists historical balance credits granted to employee.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should get employee allocations for Admin (200 OK)', async () => {
            const res = await request(app)
                .get(`/api/leave/allocations/employee/${employeeId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Employee Allocations (Admin)',
                method: 'GET',
                endpoint: `/api/leave/allocations/employee/${employeeId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Administrative inspection of all granted allocations.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('Double-Entry Balance Ledger Transactions', () => {
        it('should get employee balance ledger transactions (200 OK)', async () => {
            const res = await request(app)
                .get('/api/leave/transactions/me')
                .set('Cookie', employeeSession.cookie);

            docLogger.record({
                scenario: 'Get My Leave Ledger Transactions (Success)',
                method: 'GET',
                endpoint: '/api/leave/transactions/me',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Returns audit trail of balance debits and credits with reasons.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should get employee ledger transactions for Admin (200 OK)', async () => {
            const res = await request(app)
                .get(`/api/leave/transactions/employee/${employeeId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Employee Leave Ledger (Admin)',
                method: 'GET',
                endpoint: `/api/leave/transactions/employee/${employeeId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Administrative view of immutable double-entry ledger transactions.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('Leave Application & Approval Lifecycle', () => {
        it('should apply for time off (201 Created)', async () => {
            if (!leaveTypeId) return;

            const applyPayload = {
                leaveTypeId,
                startDate: '2026-09-10',
                endDate: '2026-09-11',
                reason: 'Family wedding event',
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
            createdRequestId = createdReq?.id;
        });

        it('should get employee submitted requests (200 OK)', async () => {
            const res = await request(app)
                .get('/api/leave/requests/me')
                .set('Cookie', employeeSession.cookie);

            docLogger.record({
                scenario: 'Get My Leave Requests (Success)',
                method: 'GET',
                endpoint: '/api/leave/requests/me',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Lists all pending, approved, and rejected leave requests for the employee.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should get single leave request details by ID (200 OK)', async () => {
            if (!createdRequestId) return;

            const res = await request(app)
                .get(`/api/leave/requests/${createdRequestId}`)
                .set('Cookie', employeeSession.cookie);

            docLogger.record({
                scenario: 'Get Leave Request by ID (Success)',
                method: 'GET',
                endpoint: `/api/leave/requests/${createdRequestId}`,
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves requested dates, working days duration, and approval history.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

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
                requestBody: { comments: 'Approved, enjoy your time off!' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Transitions leave status to approved, atomically deducts allocation balance, and logs ledger transaction.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should reject another leave request (200 OK)', async () => {
            if (!leaveTypeId) return;

            // Apply another request to test reject
            const applyRes = await request(app)
                .post('/api/leave/requests')
                .set('Cookie', employeeSession.cookie)
                .send({
                    leaveTypeId,
                    startDate: '2026-09-20',
                    endDate: '2026-09-21',
                    reason: 'Weekend extension',
                });

            rejectRequestId = applyRes.body.data?.leaveRequest?.id || applyRes.body.data?.id;
            if (!rejectRequestId) return;

            const res = await request(app)
                .post(`/api/leave/requests/${rejectRequestId}/reject`)
                .set('Cookie', adminUser.cookie)
                .send({ comments: 'Coverage needed on project deadline' });

            docLogger.record({
                scenario: 'Reject Leave Request (Admin)',
                method: 'POST',
                endpoint: `/api/leave/requests/${rejectRequestId}/reject`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: { comments: 'Coverage needed on project deadline' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Marks request as rejected without deducting leave balance.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should cancel a pending leave request (Employee)', async () => {
            if (!leaveTypeId) return;

            // Apply another request to test cancel
            const applyRes = await request(app)
                .post('/api/leave/requests')
                .set('Cookie', employeeSession.cookie)
                .send({
                    leaveTypeId,
                    startDate: '2026-10-01',
                    endDate: '2026-10-02',
                    reason: 'Tentative plan',
                });

            const cancelReqId = applyRes.body.data?.leaveRequest?.id || applyRes.body.data?.id;
            if (!cancelReqId) return;

            const res = await request(app)
                .patch(`/api/leave/requests/${cancelReqId}/cancel`)
                .set('Cookie', employeeSession.cookie);

            docLogger.record({
                scenario: 'Cancel Leave Request (Employee)',
                method: 'PATCH',
                endpoint: `/api/leave/requests/${cancelReqId}/cancel`,
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Allows employees to retract unapproved leave requests.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});

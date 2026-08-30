import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '02_employees_management.md',
    'Feature 02: Employee & Account Management API',
    'Covers employee provisioning, atomic Login ID generation, directory search, activation controls, and credential resets.',
);

describe('02: Employee & Account Management API', () => {
    let adminUser;
    let employeeUser;
    let createdEmployeeId;

    beforeAll(async () => {
        adminUser = await createAndLoginTestUser({ role: 'admin' });
        employeeUser = await createAndLoginTestUser({ role: 'employee' });
    });

    afterAll(() => {
        docLogger.save();
    });

    describe('POST /api/employees', () => {
        it('should create employee with system-generated Login ID & temporary credentials (201 Created)', async () => {
            const timestamp = Date.now();
            const createPayload = {
                firstName: 'Alice',
                lastName: 'Smith',
                email: `alice_${timestamp}@personal.com`,
                phone: '9123456780',
                joiningDate: '2026-08-01',
                employmentType: 'full_time',
            };

            const res = await request(app)
                .post('/api/employees')
                .set('Cookie', adminUser.cookie)
                .send(createPayload);

            docLogger.record({
                scenario: 'Create Employee Account (Admin)',
                method: 'POST',
                endpoint: '/api/employees',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: createPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Generates atomic Login ID (e.g. TESTALSM20260001), temporary password, work email, and default leave allocations.',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.employee).toBeDefined();
            expect(res.body.data.employee.employeeCode).toBeDefined();
            createdEmployeeId = res.body.data.employee.id;
        });

        it('should reject employee creation for non-admin/non-HR users (403 Forbidden)', async () => {
            const res = await request(app)
                .post('/api/employees')
                .set('Cookie', employeeUser.cookie)
                .send({ firstName: 'Unauthorized', joiningDate: '2026-08-01' });

            docLogger.record({
                scenario: 'Create Employee (Forbidden for Regular Employee)',
                method: 'POST',
                endpoint: '/api/employees',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Enforces RBAC restricting employee creation to Admin and HR.',
            });

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/employees', () => {
        it('should list and search employees in directory (200 OK)', async () => {
            const res = await request(app)
                .get('/api/employees?search=Alice')
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Search & List Employees (Success)',
                method: 'GET',
                endpoint: '/api/employees',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                queryParams: { search: 'Alice' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Searches employee directory by name, code, email, and department.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.employees).toBeInstanceOf(Array);
        });
    });

    describe('GET /api/employees/:employeeId', () => {
        it('should return detailed employee record (200 OK)', async () => {
            if (!createdEmployeeId) return;

            const res = await request(app)
                .get(`/api/employees/${createdEmployeeId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Employee by ID (Success)',
                method: 'GET',
                endpoint: `/api/employees/${createdEmployeeId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves complete profile details for the specified employee.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            const employeeRecordId =
                res.body.data.header?.id || res.body.data.employee?.id || res.body.data.id;
            expect(employeeRecordId).toBe(createdEmployeeId);
        });
    });

    describe('Account Lifecycle: Deactivate / Activate / Reset Password', () => {
        it('should deactivate employee account (200 OK)', async () => {
            if (!createdEmployeeId) return;

            const res = await request(app)
                .post(`/api/employees/${createdEmployeeId}/deactivate`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Deactivate Employee Account (Admin)',
                method: 'POST',
                endpoint: `/api/employees/${createdEmployeeId}/deactivate`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Sets account status to inactive, preventing login attempts.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should reactivate employee account (200 OK)', async () => {
            if (!createdEmployeeId) return;

            const res = await request(app)
                .post(`/api/employees/${createdEmployeeId}/activate`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Reactivate Employee Account (Admin)',
                method: 'POST',
                endpoint: `/api/employees/${createdEmployeeId}/activate`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Restores active status on employee user account.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should reset employee password with temporary credentials (200 OK)', async () => {
            if (!createdEmployeeId) return;

            const res = await request(app)
                .post(`/api/employees/${createdEmployeeId}/reset-password`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Reset Employee Password (Admin)',
                method: 'POST',
                endpoint: `/api/employees/${createdEmployeeId}/reset-password`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Generates new temporary password, marks mustChangePassword: true, and dispatches reset email.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.temporaryPassword).toBeDefined();
        });
    });
});

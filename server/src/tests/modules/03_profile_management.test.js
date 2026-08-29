import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '03_profile_management.md',
    'Feature 03: Employee Profile Management API',
    'Covers self-service profile inspection, private information, bank details, and field write restrictions.',
);

describe('03: Employee Profile Management API', () => {
    let adminUser;
    let employeeSession;
    let employeeId;

    beforeAll(async () => {
        adminUser = await createAndLoginTestUser({ role: 'admin' });

        // Create an employee profile
        const timestamp = Date.now();
        const res = await request(app)
            .post('/api/employees')
            .set('Cookie', adminUser.cookie)
            .send({
                firstName: 'Bob',
                lastName: 'Johnson',
                email: `bob_${timestamp}@personal.com`,
                phone: '9888877770',
                joiningDate: '2026-08-01',
                employmentType: 'full_time',
            });

        employeeId = res.body.data.employee.id;

        // Login as this employee
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

    describe('GET /api/profile/me', () => {
        it('should return logged-in employee profile (200 OK)', async () => {
            const res = await request(app)
                .get('/api/profile/me')
                .set('Cookie', employeeSession.cookie);

            docLogger.record({
                scenario: 'Get My Profile (Self-Service)',
                method: 'GET',
                endpoint: '/api/profile/me',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Returns current employee work details, contact info, and skills resume.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.header || res.body.data.profile || res.body.data).toBeDefined();
        });
    });

    describe('PATCH /api/profile/me', () => {
        it('should allow employee to update permitted contact fields (200 OK)', async () => {
            const updatePayload = {
                phone: '9999911111',
            };

            const res = await request(app)
                .patch('/api/profile/me')
                .set('Cookie', employeeSession.cookie)
                .send(updatePayload);

            docLogger.record({
                scenario: 'Update My Profile (Success)',
                method: 'PATCH',
                endpoint: '/api/profile/me',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                requestBody: updatePayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Allows employees to edit self-service contact fields.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should reject employee modification of restricted company fields (403 Forbidden)', async () => {
            const forbiddenPayload = {
                departmentId: '00000000-0000-0000-0000-000000000000',
            };

            const res = await request(app)
                .patch('/api/profile/me')
                .set('Cookie', employeeSession.cookie)
                .send(forbiddenPayload);

            docLogger.record({
                scenario: 'Update Profile with Restricted Fields (Forbidden)',
                method: 'PATCH',
                endpoint: '/api/profile/me',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                requestBody: forbiddenPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Blocks unauthorized edits to department, salary, and employment records.',
            });

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET & PATCH /api/profile/me/private-info', () => {
        it('should get employee private info (200 OK)', async () => {
            const res = await request(app)
                .get('/api/profile/me/private-info')
                .set('Cookie', employeeSession.cookie);

            docLogger.record({
                scenario: 'Get Private Info (Self-Service)',
                method: 'GET',
                endpoint: '/api/profile/me/private-info',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves residential address, emergency contact, and masked bank accounts.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should update employee private info (200 OK)', async () => {
            const privatePayload = {
                residentialAddress: '123 Tech Park Road, Bengaluru',
                emergencyContactName: 'Jane Johnson',
                emergencyContactPhone: '9888877771',
            };

            const res = await request(app)
                .patch('/api/profile/me/private-info')
                .set('Cookie', employeeSession.cookie)
                .send(privatePayload);

            docLogger.record({
                scenario: 'Update Private Info (Success)',
                method: 'PATCH',
                endpoint: '/api/profile/me/private-info',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                requestBody: privatePayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Updates personal address and emergency contact data.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});

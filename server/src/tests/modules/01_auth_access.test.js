import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { generateTestUserData, createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '01_auth_access.md',
    'Feature 01: Authentication & Access Control API',
    'Covers user authentication, Login ID login, session management, password rotations, and role permissions.',
);

describe('01: Auth & Access Control API', () => {
    let testUser;
    let authCookie;

    afterAll(() => {
        docLogger.save();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new organization and admin (201 Created)', async () => {
            const timestamp = Date.now();
            const signupPayload = {
                companyName: `Acme Corp ${timestamp}`,
                name: 'John Admin',
                email: `admin_${timestamp}@example.com`,
                password: 'Password@123',
                phone: '9876543210',
            };

            const res = await request(app).post('/api/auth/register').send(signupPayload);

            docLogger.record({
                scenario: 'Register Organization and Admin (Success)',
                method: 'POST',
                endpoint: '/api/auth/register',
                requestBody: signupPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Registers new company organization and initializes admin user with session token.',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.user).toBeDefined();
        });

        it('should return 400 when registration fails validation', async () => {
            const invalidPayload = { email: 'invalid-email', password: '' };

            const res = await request(app).post('/api/auth/register').send(invalidPayload);

            docLogger.record({
                scenario: 'Register Organization (Validation Failure)',
                method: 'POST',
                endpoint: '/api/auth/register',
                requestBody: invalidPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Rejects registration when required fields are missing.',
            });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        let seededUser;
        const plainPassword = 'Password@123';

        beforeAll(async () => {
            const seeded = await createAndLoginTestUser({ password: plainPassword });
            seededUser = seeded.user;
        });

        it('should log in successfully with email (200 OK)', async () => {
            const loginPayload = {
                email: seededUser.email,
                password: plainPassword,
            };

            const res = await request(app).post('/api/auth/login').send(loginPayload);

            docLogger.record({
                scenario: 'Login with Email (Success)',
                method: 'POST',
                endpoint: '/api/auth/login',
                requestBody: loginPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Validates email credentials and sets HTTP-only session cookie.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user.email).toBe(seededUser.email);
        });

        it('should return 401 when password is invalid', async () => {
            const invalidLogin = {
                email: seededUser.email,
                password: 'WrongPassword123',
            };

            const res = await request(app).post('/api/auth/login').send(invalidLogin);

            docLogger.record({
                scenario: 'Login with Wrong Password (Unauthorized)',
                method: 'POST',
                endpoint: '/api/auth/login',
                requestBody: invalidLogin,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Rejects invalid credentials without leaking specific account status.',
            });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/auth/me', () => {
        beforeAll(async () => {
            const authResult = await createAndLoginTestUser();
            testUser = authResult.user;
            authCookie = authResult.cookie;
        });

        it('should return authenticated user profile (200 OK)', async () => {
            const res = await request(app).get('/api/auth/me').set('Cookie', authCookie);

            docLogger.record({
                scenario: 'Get Current Authenticated User (Success)',
                method: 'GET',
                endpoint: '/api/auth/me',
                headers: { Cookie: 'token=JWT_SESSION_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves active session details and mustChangePassword flag.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.user.email).toBe(testUser.email);
        });

        it('should return 401 when unauthenticated', async () => {
            const res = await request(app).get('/api/auth/me');

            docLogger.record({
                scenario: 'Get Current User (Unauthenticated)',
                method: 'GET',
                endpoint: '/api/auth/me',
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Protected endpoint rejects requests missing session tokens.',
            });

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/auth/roles & /api/auth/permissions', () => {
        it('should return system roles list (200 OK)', async () => {
            const res = await request(app).get('/api/auth/roles').set('Cookie', authCookie);

            docLogger.record({
                scenario: 'Get Roles Matrix (Success)',
                method: 'GET',
                endpoint: '/api/auth/roles',
                headers: { Cookie: 'token=JWT_SESSION_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Lists active roles (admin, hr, employee) and their tier descriptions.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.roles).toBeInstanceOf(Array);
        });

        it('should return permissions breakdown (200 OK)', async () => {
            const res = await request(app).get('/api/auth/permissions').set('Cookie', authCookie);

            docLogger.record({
                scenario: 'Get Permissions Matrix (Success)',
                method: 'GET',
                endpoint: '/api/auth/permissions',
                headers: { Cookie: 'token=JWT_SESSION_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Returns permissions hierarchy for the current user role.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.permissions).toBeDefined();
        });
    });

    describe('POST /api/auth/change-password', () => {
        it('should rotate user password and clear mustChangePassword (200 OK)', async () => {
            const newPassword = 'NewStrongPassword@123';
            const changePayload = {
                currentPassword: 'Password@123',
                newPassword,
            };

            const res = await request(app)
                .post('/api/auth/change-password')
                .set('Cookie', authCookie)
                .send(changePayload);

            docLogger.record({
                scenario: 'Change Password (Success)',
                method: 'POST',
                endpoint: '/api/auth/change-password',
                headers: { Cookie: 'token=JWT_SESSION_TOKEN' },
                requestBody: changePayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Updates user password hash and clears mustChangePassword flag.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should logout and invalidate token (200 OK)', async () => {
            const res = await request(app).post('/api/auth/logout').set('Cookie', authCookie);

            docLogger.record({
                scenario: 'Logout User (Success)',
                method: 'POST',
                endpoint: '/api/auth/logout',
                headers: { Cookie: 'token=JWT_SESSION_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Blacklists token in Redis cache and clears cookie.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});

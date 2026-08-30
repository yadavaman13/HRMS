import request from 'supertest';
import app from '../../app.js';
import redis from '../../config/cache.config.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { createAndLoginTestUser } from '../helpers/auth-helper.js';
import { db } from '../../config/database.config.js';
import { users } from '../../db/schema/schema.js';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const docLogger = new FeatureApiDocLogger(
    '01_auth_access.md',
    'Feature 01: Authentication & Access Control API',
    'Covers user authentication, Login ID login, session management, email verification OTP, password resets, account recovery, and role permissions.',
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

    describe('Email Verification OTP Workflow', () => {
        const testOtpEmail = `otp_test_${Date.now()}@example.com`;
        const testOtpCode = '123456';

        it('should send pre-registration verification OTP (200 OK)', async () => {
            const res = await request(app)
                .post('/api/auth/send-verification-otp')
                .send({ email: testOtpEmail });

            docLogger.record({
                scenario: 'Send Verification OTP (Success)',
                method: 'POST',
                endpoint: '/api/auth/send-verification-otp',
                requestBody: { email: testOtpEmail },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Dispatches 6-digit email verification OTP to unverified email address.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should verify email with valid OTP (200 OK)', async () => {
            // Seed the test OTP into redis
            const now = Date.now();
            const otpHash = crypto.createHash('sha256').update(testOtpCode).digest('hex');
            await redis.set(
                `verify:${testOtpEmail.toLowerCase()}`,
                JSON.stringify({
                    otp: testOtpCode,
                    otpHash,
                    attempts: 0,
                    resendCount: 0,
                    cooldownExpiresAt: now + 120000,
                    createdAt: now,
                }),
                'EX',
                600,
            );

            const res = await request(app)
                .post('/api/auth/verify-email')
                .send({ email: testOtpEmail, otp: testOtpCode });

            docLogger.record({
                scenario: 'Verify Email with OTP (Success)',
                method: 'POST',
                endpoint: '/api/auth/verify-email',
                requestBody: { email: testOtpEmail, otp: testOtpCode },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Verifies email address and marks emailVerified in database/cache.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should resend verification OTP (200 OK)', async () => {
            const now = Date.now();
            const otpHash = crypto.createHash('sha256').update(testOtpCode).digest('hex');
            await redis.set(
                `verify:${testOtpEmail.toLowerCase()}`,
                JSON.stringify({
                    otp: testOtpCode,
                    otpHash,
                    attempts: 0,
                    resendCount: 0,
                    cooldownExpiresAt: now - 1000, // Cooldown elapsed
                    createdAt: now,
                }),
                'EX',
                600,
            );

            const res = await request(app)
                .post('/api/auth/resend-otp')
                .send({ email: testOtpEmail, purpose: 'verify' });

            docLogger.record({
                scenario: 'Resend Verification OTP (Success)',
                method: 'POST',
                endpoint: '/api/auth/resend-otp',
                requestBody: { email: testOtpEmail, purpose: 'verify' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Resends verification OTP if cooldown period has elapsed.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
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

    describe('Password Reset Workflow', () => {
        let resetUser;
        const resetOtpCode = '654321';
        const newResetPassword = 'BrandNewPassword@999';

        beforeAll(async () => {
            const seeded = await createAndLoginTestUser();
            resetUser = seeded.user;
        });

        it('should send forgot password OTP (200 OK)', async () => {
            const res = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: resetUser.email });

            docLogger.record({
                scenario: 'Request Password Reset OTP (Success)',
                method: 'POST',
                endpoint: '/api/auth/forgot-password',
                requestBody: { email: resetUser.email },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Dispatches password reset OTP to user registered email address.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should verify forgot password OTP (200 OK)', async () => {
            const now = Date.now();
            const otpHash = crypto.createHash('sha256').update(resetOtpCode).digest('hex');
            await redis.set(
                `forgot-password:${resetUser.email.toLowerCase()}`,
                JSON.stringify({
                    otp: resetOtpCode,
                    otpHash,
                    attempts: 0,
                    resendCount: 0,
                    cooldownExpiresAt: now + 120000,
                    createdAt: now,
                }),
                'EX',
                600,
            );

            const res = await request(app)
                .post('/api/auth/verify-forgot-password-otp')
                .send({ email: resetUser.email, otp: resetOtpCode });

            docLogger.record({
                scenario: 'Verify Password Reset OTP (Success)',
                method: 'POST',
                endpoint: '/api/auth/verify-forgot-password-otp',
                requestBody: { email: resetUser.email, otp: resetOtpCode },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Validates reset OTP and grants a temporary 10-minute reset token in Redis.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should reset password with verified OTP token (200 OK)', async () => {
            const resetPayload = {
                email: resetUser.email,
                otp: resetOtpCode,
                password: newResetPassword,
                confirmPassword: newResetPassword,
            };

            const res = await request(app).post('/api/auth/reset-password').send(resetPayload);

            docLogger.record({
                scenario: 'Reset Password with Confirmed Credentials (Success)',
                method: 'POST',
                endpoint: '/api/auth/reset-password',
                requestBody: resetPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Updates user password hash and invalidates active session cache.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('Account Recovery Workflow', () => {
        let deletedUser;
        const recoveryOtp = '112233';

        beforeAll(async () => {
            const seeded = await createAndLoginTestUser();
            deletedUser = seeded.user;

            // Mark user account as deleted with recovery window
            const expiry = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
            await db
                .update(users)
                .set({ isDeleted: true, isActive: false, recoveryExpiresAt: expiry })
                .where(eq(users.id, deletedUser.id));
        });

        it('should request account recovery OTP (200 OK)', async () => {
            const res = await request(app)
                .post('/api/auth/recover-account/request')
                .send({ email: deletedUser.email });

            docLogger.record({
                scenario: 'Request Account Recovery OTP (Success)',
                method: 'POST',
                endpoint: '/api/auth/recover-account/request',
                requestBody: { email: deletedUser.email },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Sends recovery OTP to restore a soft-deleted account within the 15-day grace window.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should verify recovery OTP and restore account (200 OK)', async () => {
            const now = Date.now();
            const otpHash = crypto.createHash('sha256').update(recoveryOtp).digest('hex');
            await redis.set(
                `recover-account:${deletedUser.email.toLowerCase()}`,
                JSON.stringify({
                    otp: recoveryOtp,
                    otpHash,
                    attempts: 0,
                    resendCount: 0,
                    cooldownExpiresAt: now + 120000,
                    createdAt: now,
                }),
                'EX',
                600,
            );

            const res = await request(app)
                .post('/api/auth/recover-account/verify')
                .send({ email: deletedUser.email, otp: recoveryOtp });

            docLogger.record({
                scenario: 'Verify Account Recovery OTP & Restore (Success)',
                method: 'POST',
                endpoint: '/api/auth/recover-account/verify',
                requestBody: { email: deletedUser.email, otp: recoveryOtp },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Restores user account state (isDeleted: false, isActive: true) and sends confirmation email.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('GET /api/auth/me & /get-me', () => {
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

    describe('POST & PATCH /api/auth/change-password', () => {
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

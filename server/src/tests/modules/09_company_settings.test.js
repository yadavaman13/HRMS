import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '09_company_settings.md',
    'Feature 09: Company & HR Configuration API',
    'Covers company profile, branch locations, departments, job positions, work schedules, and holiday calendars.',
);

describe('09: Company & HR Configuration API', () => {
    let adminUser;
    let organizationId;

    beforeAll(async () => {
        adminUser = await createAndLoginTestUser({ role: 'admin' });
        organizationId = adminUser.organization.id;
    });

    afterAll(() => {
        docLogger.save();
    });

    describe('GET /api/companies/my', () => {
        it('should return current company profile (200 OK)', async () => {
            const res = await request(app)
                .get('/api/companies/my')
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Company Details (Success)',
                method: 'GET',
                endpoint: '/api/companies/my',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves current company profile, address, and localized settings.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.company || res.body.data.organization).toBeDefined();
        });
    });

    describe('POST & GET /api/companies/:id/departments', () => {
        it('should create department (Admin)', async () => {
            const timestamp = Date.now();
            const deptPayload = {
                name: `Engineering ${timestamp}`,
                code: `ENG_${timestamp}`,
            };

            const res = await request(app)
                .post(`/api/companies/${organizationId}/departments`)
                .set('Cookie', adminUser.cookie)
                .send(deptPayload);

            docLogger.record({
                scenario: 'Create Company Department (Admin)',
                method: 'POST',
                endpoint: `/api/companies/${organizationId}/departments`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: deptPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Adds department organizational unit.',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });

        it('should list all company departments (200 OK)', async () => {
            const res = await request(app)
                .get(`/api/companies/${organizationId}/departments`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'List Company Departments (Success)',
                method: 'GET',
                endpoint: `/api/companies/${organizationId}/departments`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves department hierarchy for employee assignments.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.departments).toBeInstanceOf(Array);
        });
    });

    describe('POST & GET /api/companies/:id/job-positions', () => {
        it('should create job position (Admin)', async () => {
            const timestamp = Date.now();
            const posPayload = {
                name: `Senior Fullstack Developer ${timestamp}`,
                code: `DEV_${timestamp}`,
            };

            const res = await request(app)
                .post(`/api/companies/${organizationId}/job-positions`)
                .set('Cookie', adminUser.cookie)
                .send(posPayload);

            docLogger.record({
                scenario: 'Create Job Position (Admin)',
                method: 'POST',
                endpoint: `/api/companies/${organizationId}/job-positions`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: posPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Adds job position designation.',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });
    });

    describe('POST & GET /api/companies/:id/holidays', () => {
        it('should declare company holiday (Admin)', async () => {
            const timestamp = Date.now();
            const randomOffset = Math.floor(Math.random() * 20) + 1;
            const holidayDate = `203${randomOffset % 10}-10-${String((randomOffset % 25) + 1).padStart(2, '0')}`;
            const holidayPayload = {
                name: `Company Foundation Day ${timestamp}`,
                holidayDate,
                isRecurring: false,
            };

            const res = await request(app)
                .post(`/api/companies/${organizationId}/holidays`)
                .set('Cookie', adminUser.cookie)
                .send(holidayPayload);

            docLogger.record({
                scenario: 'Create Company Holiday (Admin)',
                method: 'POST',
                endpoint: `/api/companies/${organizationId}/holidays`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: holidayPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Registers official company holiday in attendance & payroll calendars.',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });
    });
});

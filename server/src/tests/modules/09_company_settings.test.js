import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '09_company_settings.md',
    'Feature 09: Company & HR Configuration API',
    'Covers company profile, logo branding, branch locations, departments, job positions, work schedules, and holiday calendars.',
);

describe('09: Company & HR Configuration API', () => {
    let adminUser;
    let organizationId;
    let locationId;
    let departmentId;
    let jobPositionId;
    let scheduleId;
    let holidayId;

    beforeAll(async () => {
        adminUser = await createAndLoginTestUser({ role: 'admin' });
        organizationId = adminUser.organization.id;
    });

    afterAll(() => {
        docLogger.save();
    });

    describe('Company Profile & Branding', () => {
        it('should return current company profile (200 OK)', async () => {
            const res = await request(app).get('/api/companies/my').set('Cookie', adminUser.cookie);

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

        it('should get company by ID (200 OK)', async () => {
            const res = await request(app)
                .get(`/api/companies/${organizationId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Company by ID (Success)',
                method: 'GET',
                endpoint: `/api/companies/${organizationId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves company master configuration by ID.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should update company settings (Admin)', async () => {
            const updatePayload = {
                city: 'Bengaluru',
                state: 'Karnataka',
                country: 'India',
                timezone: 'Asia/Kolkata',
            };

            const res = await request(app)
                .patch(`/api/companies/${organizationId}`)
                .set('Cookie', adminUser.cookie)
                .send(updatePayload);

            docLogger.record({
                scenario: 'Update Company Profile (Admin)',
                method: 'PATCH',
                endpoint: `/api/companies/${organizationId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: updatePayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Updates organization profile, address, and localized timezone/currency.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should upload company logo directly (Admin)', async () => {
            const fakeLogoBuffer = Buffer.from('fake-logo-png-bytes');

            const res = await request(app)
                .post('/api/company/logo')
                .set('Cookie', adminUser.cookie)
                .attach('logo', fakeLogoBuffer, 'logo.png');

            docLogger.record({
                scenario: 'Upload Company Logo Branding (Admin)',
                method: 'POST',
                endpoint: '/api/company/logo',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN', 'Content-Type': 'multipart/form-data' },
                requestBody: { logo: '(binary image buffer)' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Uploads and updates organization brand logo.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('Locations CRUD', () => {
        it('should create branch location (Admin)', async () => {
            const timestamp = Date.now();
            const locationPayload = {
                name: `Bengaluru HQ ${timestamp}`,
                city: 'Bengaluru',
                country: 'India',
                isHeadquarters: true,
            };

            const res = await request(app)
                .post(`/api/companies/${organizationId}/locations`)
                .set('Cookie', adminUser.cookie)
                .send(locationPayload);

            docLogger.record({
                scenario: 'Create Location (Admin)',
                method: 'POST',
                endpoint: `/api/companies/${organizationId}/locations`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: locationPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Registers new office branch or office building.',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            locationId = res.body.data.location?.id;
        });

        it('should list all company locations (200 OK)', async () => {
            const res = await request(app)
                .get(`/api/companies/${organizationId}/locations`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'List Company Locations (Success)',
                method: 'GET',
                endpoint: `/api/companies/${organizationId}/locations`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves branch locations for organizational work schedules.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.locations).toBeInstanceOf(Array);
        });

        it('should update company location (Admin)', async () => {
            if (!locationId) return;

            const updatePayload = {
                city: 'Bengaluru Tech Park',
            };

            const res = await request(app)
                .patch(`/api/companies/locations/${locationId}`)
                .set('Cookie', adminUser.cookie)
                .send(updatePayload);

            docLogger.record({
                scenario: 'Update Location (Admin)',
                method: 'PATCH',
                endpoint: `/api/companies/locations/${locationId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: updatePayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Updates branch address and details.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should delete company location (Admin)', async () => {
            if (!locationId) return;

            const res = await request(app)
                .delete(`/api/companies/locations/${locationId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Delete Location (Admin)',
                method: 'DELETE',
                endpoint: `/api/companies/locations/${locationId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Removes location from company directory.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('Departments CRUD', () => {
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
            departmentId = res.body.data.department?.id;
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

        it('should update department (Admin)', async () => {
            if (!departmentId) return;

            const updatePayload = {
                name: 'Software Engineering & AI',
            };

            const res = await request(app)
                .patch(`/api/companies/departments/${departmentId}`)
                .set('Cookie', adminUser.cookie)
                .send(updatePayload);

            docLogger.record({
                scenario: 'Update Department (Admin)',
                method: 'PATCH',
                endpoint: `/api/companies/departments/${departmentId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: updatePayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Modifies department name and parent reporting structure.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should delete department (Admin)', async () => {
            if (!departmentId) return;

            const res = await request(app)
                .delete(`/api/companies/departments/${departmentId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Delete Department (Admin)',
                method: 'DELETE',
                endpoint: `/api/companies/departments/${departmentId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Removes department from organizational directory.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('Job Positions CRUD', () => {
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
            jobPositionId = res.body.data.jobPosition?.id;
        });

        it('should list all job positions (200 OK)', async () => {
            const res = await request(app)
                .get(`/api/companies/${organizationId}/job-positions`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'List Job Positions (Success)',
                method: 'GET',
                endpoint: `/api/companies/${organizationId}/job-positions`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Lists all defined organizational designations.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.jobPositions).toBeInstanceOf(Array);
        });

        it('should update job position (Admin)', async () => {
            if (!jobPositionId) return;

            const updatePayload = {
                name: 'Lead Fullstack Developer',
            };

            const res = await request(app)
                .patch(`/api/companies/job-positions/${jobPositionId}`)
                .set('Cookie', adminUser.cookie)
                .send(updatePayload);

            docLogger.record({
                scenario: 'Update Job Position (Admin)',
                method: 'PATCH',
                endpoint: `/api/companies/job-positions/${jobPositionId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: updatePayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Modifies job title and requirements.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should delete job position (Admin)', async () => {
            if (!jobPositionId) return;

            const res = await request(app)
                .delete(`/api/companies/job-positions/${jobPositionId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Delete Job Position (Admin)',
                method: 'DELETE',
                endpoint: `/api/companies/job-positions/${jobPositionId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Soft deletes job position designation.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('Work Schedules CRUD', () => {
        it('should create work schedule (Admin)', async () => {
            const timestamp = Date.now();
            const schedPayload = {
                name: `Standard Day Shift ${timestamp}`,
                hoursPerWeek: 40,
                daysPerWeek: 5,
            };

            const res = await request(app)
                .post(`/api/companies/${organizationId}/schedules`)
                .set('Cookie', adminUser.cookie)
                .send(schedPayload);

            docLogger.record({
                scenario: 'Create Work Schedule (Admin)',
                method: 'POST',
                endpoint: `/api/companies/${organizationId}/schedules`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: schedPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Defines standard working hours and weekly schedule.',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            scheduleId = res.body.data.schedule?.id;
        });

        it('should list all company work schedules (200 OK)', async () => {
            const res = await request(app)
                .get(`/api/companies/${organizationId}/schedules`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'List Work Schedules (Success)',
                method: 'GET',
                endpoint: `/api/companies/${organizationId}/schedules`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Lists active work schedules and shifts.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.schedules).toBeInstanceOf(Array);
        });

        it('should get work schedule by ID (200 OK)', async () => {
            if (!scheduleId) return;

            const res = await request(app)
                .get(`/api/companies/schedules/${scheduleId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Work Schedule by ID (Success)',
                method: 'GET',
                endpoint: `/api/companies/schedules/${scheduleId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves work schedule parameters and timing details.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should update work schedule (Admin)', async () => {
            if (!scheduleId) return;

            const updatePayload = {
                name: 'Flexible Day Shift',
                hoursPerWeek: 42,
            };

            const res = await request(app)
                .patch(`/api/companies/schedules/${scheduleId}`)
                .set('Cookie', adminUser.cookie)
                .send(updatePayload);

            docLogger.record({
                scenario: 'Update Work Schedule (Admin)',
                method: 'PATCH',
                endpoint: `/api/companies/schedules/${scheduleId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: updatePayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Modifies weekly expected work hours.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should delete work schedule (Admin)', async () => {
            if (!scheduleId) return;

            const res = await request(app)
                .delete(`/api/companies/schedules/${scheduleId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Delete Work Schedule (Admin)',
                method: 'DELETE',
                endpoint: `/api/companies/schedules/${scheduleId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Removes work schedule definition.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('Holidays Calendar CRUD', () => {
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
            holidayId = res.body.data.holiday?.id;
        });

        it('should list all company holidays (200 OK)', async () => {
            const res = await request(app)
                .get(`/api/companies/${organizationId}/holidays`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'List Company Holidays (Success)',
                method: 'GET',
                endpoint: `/api/companies/${organizationId}/holidays`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves holiday calendar for current organizational year.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.holidays).toBeInstanceOf(Array);
        });

        it('should delete company holiday (Admin)', async () => {
            if (!holidayId) return;

            const res = await request(app)
                .delete(`/api/companies/holidays/${holidayId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Delete Company Holiday (Admin)',
                method: 'DELETE',
                endpoint: `/api/companies/holidays/${holidayId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Removes holiday from company holiday calendar.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});

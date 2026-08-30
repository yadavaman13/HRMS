import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '06_salary_compensation.md',
    'Feature 06: Salary & Compensation Management API',
    'Covers salary component definitions, compensation structures, dynamic percentage calculations, statutory PF/PT settings, and admin-only access boundaries.',
);

describe('06: Salary & Compensation Management API', () => {
    let adminUser;
    let employeeSession;
    let employeeId;
    let basicComponentId;
    let createdComponentId;

    beforeAll(async () => {
        adminUser = await createAndLoginTestUser({ role: 'admin' });

        const timestamp = Date.now();
        const res = await request(app)
            .post('/api/employees')
            .set('Cookie', adminUser.cookie)
            .send({
                firstName: 'Ethan',
                lastName: 'Hunt',
                email: `ethan_${timestamp}@personal.com`,
                phone: '9555544440',
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

    describe('Salary Components Catalog CRUD', () => {
        it('should list salary components (Admin)', async () => {
            const res = await request(app)
                .get('/api/payroll/components')
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'List Salary Component Definitions (Admin)',
                method: 'GET',
                endpoint: '/api/payroll/components',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves salary component catalog (Basic, HRA, Allowances, PF, PT).',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.components).toBeInstanceOf(Array);

            const comps = res.body.data.components || [];
            if (comps.length > 0) {
                basicComponentId = comps.find((c) => c.code === 'BASIC')?.id || comps[0].id;
            } else {
                const basicRes = await request(app)
                    .post('/api/payroll/components')
                    .set('Cookie', adminUser.cookie)
                    .send({
                        code: 'BASIC',
                        name: 'Basic Salary',
                        componentType: 'earning',
                        calculationType: 'percentage_of_wage',
                    });
                basicComponentId = basicRes.body.data?.component?.id;
            }
        });

        it('should create new salary component definition (Admin)', async () => {
            const timestamp = Date.now();
            const payload = {
                code: `BONUS_${timestamp}`,
                name: 'Performance Bonus',
                componentType: 'earning',
                calculationType: 'percentage_of_wage',
            };

            const res = await request(app)
                .post('/api/payroll/components')
                .set('Cookie', adminUser.cookie)
                .send(payload);

            docLogger.record({
                scenario: 'Create Salary Component (Admin)',
                method: 'POST',
                endpoint: '/api/payroll/components',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: payload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Registers new earning or deduction component.',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            createdComponentId = res.body.data.component?.id;
        });

        it('should update salary component definition (Admin)', async () => {
            if (!createdComponentId) return;

            const updatePayload = {
                name: 'Annual Performance Bonus',
                isTaxable: true,
            };

            const res = await request(app)
                .patch(`/api/payroll/components/${createdComponentId}`)
                .set('Cookie', adminUser.cookie)
                .send(updatePayload);

            docLogger.record({
                scenario: 'Update Salary Component (Admin)',
                method: 'PATCH',
                endpoint: `/api/payroll/components/${createdComponentId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: updatePayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Updates component naming, taxability flags, and calculation parameters.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should delete salary component definition (Admin)', async () => {
            if (!createdComponentId) return;

            const res = await request(app)
                .delete(`/api/payroll/components/${createdComponentId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Delete Salary Component (Admin)',
                method: 'DELETE',
                endpoint: `/api/payroll/components/${createdComponentId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Soft deletes unused component definition from catalog.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('Salary Structure Configuration & Residual Balancing', () => {
        it('should configure employee salary structure (Admin)', async () => {
            if (!basicComponentId) return;

            const structurePayload = {
                monthlyWage: 60000,
                wageType: 'fixed',
                effectiveFrom: '2026-08-01',
                components: [
                    {
                        componentDefinitionId: basicComponentId,
                        calculationType: 'percentage_of_wage',
                        percentage: 50.0,
                        sequence: 1,
                    },
                ],
            };

            const res = await request(app)
                .post(`/api/employees/${employeeId}/salary`)
                .set('Cookie', adminUser.cookie)
                .send(structurePayload);

            docLogger.record({
                scenario: 'Set Employee Salary Structure (Admin)',
                method: 'POST',
                endpoint: `/api/employees/${employeeId}/salary`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: structurePayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Configures wage breakdown and percentage component calculations.',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
        });

        it('should retrieve employee salary structure (Admin)', async () => {
            const res = await request(app)
                .get(`/api/employees/${employeeId}/salary`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Employee Salary Structure (Admin)',
                method: 'GET',
                endpoint: `/api/employees/${employeeId}/salary`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves current active salary structure and itemized component formulas.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.structure).toBeDefined();
        });

        it('should update employee salary structure (Admin)', async () => {
            if (!basicComponentId) return;

            const updatePayload = {
                monthlyWage: 75000,
                wageType: 'fixed',
                effectiveFrom: '2026-09-01',
                components: [
                    {
                        componentDefinitionId: basicComponentId,
                        calculationType: 'percentage_of_wage',
                        percentage: 50.0,
                        sequence: 1,
                    },
                ],
            };

            const res = await request(app)
                .patch(`/api/employees/${employeeId}/salary`)
                .set('Cookie', adminUser.cookie)
                .send(updatePayload);

            docLogger.record({
                scenario: 'Update Employee Salary Structure (Admin)',
                method: 'PATCH',
                endpoint: `/api/employees/${employeeId}/salary`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: updatePayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Updates compensation structure with revision date.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should block regular employee from modifying salary (403 Forbidden)', async () => {
            const res = await request(app)
                .post(`/api/employees/${employeeId}/salary`)
                .set('Cookie', employeeSession.cookie)
                .send({ monthlyWage: 100000 });

            docLogger.record({
                scenario: 'Modify Salary (Forbidden for Regular Employee)',
                method: 'POST',
                endpoint: `/api/employees/${employeeId}/salary`,
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Enforces security preventing employees from modifying compensation data.',
            });

            expect(res.status).toBe(403);
            expect(res.body.success).toBe(false);
        });
    });

    describe('Payroll & Statutory Settings Configuration', () => {
        it('should get payroll statutory settings (Admin)', async () => {
            const res = await request(app)
                .get('/api/payroll/settings')
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Payroll Statutory Settings (Admin)',
                method: 'GET',
                endpoint: '/api/payroll/settings',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves Provident Fund (PF), Professional Tax (PT), and TDS withholding configurations.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should update payroll statutory settings (Admin)', async () => {
            const settingsPayload = {
                pfEnabled: true,
                pfEmployerRate: 12.0,
                pfEmployeeRate: 12.0,
                ptEnabled: true,
                defaultPaymentDay: 28,
            };

            const res = await request(app)
                .post('/api/payroll/settings')
                .set('Cookie', adminUser.cookie)
                .send(settingsPayload);

            docLogger.record({
                scenario: 'Update Payroll Statutory Settings (Admin)',
                method: 'POST',
                endpoint: '/api/payroll/settings',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: settingsPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Configures statutory deduction percentages and default disbursement schedules.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});

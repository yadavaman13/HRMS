import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '07_payroll_payslips.md',
    'Feature 07: Payroll & Payslip Management API',
    'Covers monthly payroll cycles, attendance-derived payable days computation, payslip generation, finalizing runs, and PDF downloads.',
);

describe('07: Payroll & Payslip Management API', () => {
    let adminUser;
    let employeeSession;
    let employeeId;
    let periodId;
    let payslipId;

    beforeAll(async () => {
        adminUser = await createAndLoginTestUser({ role: 'admin' });

        const timestamp = Date.now();
        const res = await request(app)
            .post('/api/employees')
            .set('Cookie', adminUser.cookie)
            .send({
                firstName: 'Fiona',
                lastName: 'Gallagher',
                email: `fiona_${timestamp}@personal.com`,
                phone: '9444433330',
                joiningDate: '2026-08-01',
                employmentType: 'full_time',
                salary: 50000,
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

    describe('POST & GET /api/payroll/periods', () => {
        it('should create new monthly payroll period (Admin)', async () => {
            const timestamp = Date.now();
            const year = 2030 + Math.floor(Math.random() * 50);
            const periodPayload = {
                periodStart: `${year}-01-01`,
                periodEnd: `${year}-01-31`,
            };

            const res = await request(app)
                .post('/api/payroll/periods')
                .set('Cookie', adminUser.cookie)
                .send(periodPayload);

            docLogger.record({
                scenario: 'Create Payroll Period (Admin)',
                method: 'POST',
                endpoint: '/api/payroll/periods',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: periodPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Initializes new payroll processing cycle in draft state.',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.period).toBeDefined();
            periodId = res.body.data.period.id;
        });

        it('should list all payroll periods (Admin)', async () => {
            const res = await request(app)
                .get('/api/payroll/periods')
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'List Payroll Periods (Admin)',
                method: 'GET',
                endpoint: '/api/payroll/periods',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves all historical and upcoming payroll cycles.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.periods).toBeInstanceOf(Array);
        });
    });

    describe('POST /api/payroll/periods/:id/process & /finalize', () => {
        it('should process period and calculate attendance-derived payslips (200 OK)', async () => {
            if (!periodId) return;

            const res = await request(app)
                .post(`/api/payroll/periods/${periodId}/process`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Process Payroll Period (Admin)',
                method: 'POST',
                endpoint: `/api/payroll/periods/${periodId}/process`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Executes payroll engine: aggregates attendance and leaves, computes payable days, applies unpaid deductions, and computes net pay.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.period.status).toBe('calculated');
        });

        it('should finalize and lock payroll period (200 OK)', async () => {
            if (!periodId) return;

            const res = await request(app)
                .post(`/api/payroll/periods/${periodId}/finalize`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Finalize Payroll Period (Admin)',
                method: 'POST',
                endpoint: `/api/payroll/periods/${periodId}/finalize`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Locks payroll run and transitions all payslips to finalized status.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.period.status).toBe('finalized');
        });
    });

    describe('GET /api/payroll/payslips', () => {
        it('should list payslips for period (Admin)', async () => {
            if (!periodId) return;

            const res = await request(app)
                .get(`/api/payroll/payslips?payrollPeriodId=${periodId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'List Period Payslips (Admin)',
                method: 'GET',
                endpoint: '/api/payroll/payslips',
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                queryParams: { payrollPeriodId: periodId },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves all generated payslips for the target payroll cycle.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.payslips).toBeInstanceOf(Array);

            if (res.body.data.payslips.length > 0) {
                payslipId = res.body.data.payslips[0].id;
            }
        });

        it('should get itemized payslip breakdown (200 OK)', async () => {
            if (!payslipId) return;

            const res = await request(app)
                .get(`/api/payroll/payslips/${payslipId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Payslip Breakdown Details (Success)',
                method: 'GET',
                endpoint: `/api/payroll/payslips/${payslipId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Returns itemized earnings and deductions lines, attendance days summary, and net payout.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.payslip).toBeDefined();
            expect(res.body.data.lines).toBeInstanceOf(Array);
        });

        it('should download compiled PDF payslip (200 OK)', async () => {
            if (!payslipId) return;

            const res = await request(app)
                .get(`/api/payroll/payslips/${payslipId}/download?inline=true`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Download PDF Payslip (Success)',
                method: 'GET',
                endpoint: `/api/payroll/payslips/${payslipId}/download`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                queryParams: { inline: 'true' },
                statusCode: res.status,
                responseBody: { contentType: res.headers['content-type'], status: 'PDF Buffer Stream' },
                notes: 'Generates static Chromium-free PDF document stream for printing or digital distribution.',
            });

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toBe('application/pdf');
        });
    });
});

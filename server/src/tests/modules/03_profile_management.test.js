import request from 'supertest';
import app from '../../app.js';
import { FeatureApiDocLogger } from '../helpers/md-logger.js';
import { createAndLoginTestUser } from '../helpers/auth-helper.js';

const docLogger = new FeatureApiDocLogger(
    '03_profile_management.md',
    'Feature 03: Employee Profile & Private Info Management API',
    'Covers self-service profile inspection, avatar media management, private contact info, document attachments, and HR/Admin oversight.',
);

describe('03: Employee Profile Management API', () => {
    let adminUser;
    let employeeSession;
    let employeeId;
    let myDocId;
    let adminUploadedDocId;

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

    describe('GET & PATCH /api/profile/me', () => {
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

    describe('Avatar Media Management (Self)', () => {
        it('should upload profile avatar (200 OK)', async () => {
            const fakeImageBuffer = Buffer.from('fake-image-bytes-content');

            const res = await request(app)
                .post('/api/profile/me/avatar')
                .set('Cookie', employeeSession.cookie)
                .attach('avatar', fakeImageBuffer, 'avatar.png');

            docLogger.record({
                scenario: 'Upload Profile Avatar (Success)',
                method: 'POST',
                endpoint: '/api/profile/me/avatar',
                headers: {
                    Cookie: 'token=JWT_EMPLOYEE_TOKEN',
                    'Content-Type': 'multipart/form-data',
                },
                requestBody: { avatar: '(binary image buffer)' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Uploads and processes employee avatar image via ImageKit.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should remove profile avatar (200 OK)', async () => {
            const res = await request(app)
                .delete('/api/profile/me/avatar')
                .set('Cookie', employeeSession.cookie);

            docLogger.record({
                scenario: 'Delete Profile Avatar (Success)',
                method: 'DELETE',
                endpoint: '/api/profile/me/avatar',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Clears profile picture URL and reverts to initials placeholder.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
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

    describe('Employee Document Management (Self-Service)', () => {
        it('should upload self-service document (201 Created)', async () => {
            const fakeDocBuffer = Buffer.from('PDF dummy content for certificate');

            const res = await request(app)
                .post('/api/profile/me/documents')
                .set('Cookie', employeeSession.cookie)
                .field('documentType', 'pan_card')
                .field('fileName', 'National Identity Proof')
                .attach('file', fakeDocBuffer, 'id_proof.pdf');

            docLogger.record({
                scenario: 'Upload Self-Service Document (Success)',
                method: 'POST',
                endpoint: '/api/profile/me/documents',
                headers: {
                    Cookie: 'token=JWT_EMPLOYEE_TOKEN',
                    'Content-Type': 'multipart/form-data',
                },
                requestBody: {
                    documentType: 'pan_card',
                    fileName: 'National Identity Proof',
                    file: '(binary PDF buffer)',
                },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Uploads personal verification documents (resumes, diplomas, government IDs).',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            myDocId = res.body.data.document?.id;
        });

        it('should list self-service documents (200 OK)', async () => {
            const res = await request(app)
                .get('/api/profile/me/documents')
                .set('Cookie', employeeSession.cookie);

            docLogger.record({
                scenario: 'List My Documents (Success)',
                method: 'GET',
                endpoint: '/api/profile/me/documents',
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Retrieves all document attachments belonging to the logged-in employee.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.documents).toBeInstanceOf(Array);
        });

        it('should delete self-service document (200 OK)', async () => {
            if (!myDocId) return;

            const res = await request(app)
                .delete(`/api/profile/me/documents/${myDocId}`)
                .set('Cookie', employeeSession.cookie);

            docLogger.record({
                scenario: 'Delete My Document (Success)',
                method: 'DELETE',
                endpoint: `/api/profile/me/documents/${myDocId}`,
                headers: { Cookie: 'token=JWT_EMPLOYEE_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Soft deletes employee-owned document attachment.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('Admin / HR Profile & Private Info Oversight', () => {
        it('should get employee profile by ID (Admin)', async () => {
            const res = await request(app)
                .get(`/api/employees/${employeeId}/profile`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Employee Profile (Admin)',
                method: 'GET',
                endpoint: `/api/employees/${employeeId}/profile`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Administrative inspection of entire employee profile view.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should update employee profile by ID (Admin)', async () => {
            const res = await request(app)
                .patch(`/api/employees/${employeeId}/profile`)
                .set('Cookie', adminUser.cookie)
                .send({ aboutMe: 'Senior specialist in technical systems' });

            docLogger.record({
                scenario: 'Update Employee Profile (Admin)',
                method: 'PATCH',
                endpoint: `/api/employees/${employeeId}/profile`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: { aboutMe: 'Senior specialist in technical systems' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Allows HR/Admin to edit all employee profile fields.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should get employee private info by ID (Admin)', async () => {
            const res = await request(app)
                .get(`/api/employees/${employeeId}/private-info`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Get Employee Private Info (Admin)',
                method: 'GET',
                endpoint: `/api/employees/${employeeId}/private-info`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Administrative access to unmasked residential and emergency info.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should update employee private info by ID (Admin)', async () => {
            const res = await request(app)
                .patch(`/api/employees/${employeeId}/private-info`)
                .set('Cookie', adminUser.cookie)
                .send({ nationality: 'Indian', maritalStatus: 'single' });

            docLogger.record({
                scenario: 'Update Employee Private Info (Admin)',
                method: 'PATCH',
                endpoint: `/api/employees/${employeeId}/private-info`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: { nationality: 'Indian', maritalStatus: 'single' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Updates personal and demographic records for employee.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should update employee bank account details (Admin)', async () => {
            const bankPayload = {
                accountNumber: '987654321000',
                bankName: 'HDFC Bank',
                ifscCode: 'HDFC0001234',
                accountHolderName: 'Bob Johnson',
            };

            const res = await request(app)
                .patch(`/api/employees/${employeeId}/bank-account`)
                .set('Cookie', adminUser.cookie)
                .send(bankPayload);

            docLogger.record({
                scenario: 'Update Employee Bank Details (Admin)',
                method: 'PATCH',
                endpoint: `/api/employees/${employeeId}/bank-account`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: bankPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Stores encrypted bank account and payout information for payroll.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should update employee statutory identifiers (Admin)', async () => {
            const idPayload = {
                pan: 'ABCDE1234F',
                uan: '100987654321',
                aadhaar: '123456789012',
            };

            const res = await request(app)
                .patch(`/api/employees/${employeeId}/identifiers`)
                .set('Cookie', adminUser.cookie)
                .send(idPayload);

            docLogger.record({
                scenario: 'Update Employee Identifiers (Admin)',
                method: 'PATCH',
                endpoint: `/api/employees/${employeeId}/identifiers`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                requestBody: idPayload,
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Configures PAN, Aadhaar/UAN, and statutory identification numbers.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should upload employee document on behalf (Admin)', async () => {
            const fakeDocBuffer = Buffer.from('Offer letter contract agreement content');

            const res = await request(app)
                .post(`/api/employees/${employeeId}/documents`)
                .set('Cookie', adminUser.cookie)
                .field('documentType', 'offer_letter')
                .field('fileName', 'Employment Contract 2026')
                .attach('file', fakeDocBuffer, 'contract.pdf');

            docLogger.record({
                scenario: 'Upload Document for Employee (Admin)',
                method: 'POST',
                endpoint: `/api/employees/${employeeId}/documents`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN', 'Content-Type': 'multipart/form-data' },
                requestBody: {
                    documentType: 'offer_letter',
                    fileName: 'Employment Contract 2026',
                    file: '(binary PDF buffer)',
                },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Uploads official HR documents (offer letter, contracts, appraisal reviews).',
            });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            adminUploadedDocId = res.body.data.document?.id;
        });

        it('should list employee documents (Admin)', async () => {
            const res = await request(app)
                .get(`/api/employees/${employeeId}/documents`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'List Employee Documents (Admin)',
                method: 'GET',
                endpoint: `/api/employees/${employeeId}/documents`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Lists all documents attached to an employee profile.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.documents).toBeInstanceOf(Array);
        });

        it('should delete employee document (Admin)', async () => {
            if (!adminUploadedDocId) return;

            const res = await request(app)
                .delete(`/api/employees/${employeeId}/documents/${adminUploadedDocId}`)
                .set('Cookie', adminUser.cookie);

            docLogger.record({
                scenario: 'Delete Employee Document (Admin)',
                method: 'DELETE',
                endpoint: `/api/employees/${employeeId}/documents/${adminUploadedDocId}`,
                headers: { Cookie: 'token=JWT_ADMIN_TOKEN' },
                statusCode: res.status,
                responseBody: res.body,
                notes: 'Administrative removal of employee document records.',
            });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });
});

import 'dotenv/config';
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../app.js';
import redis from '../config/cache.config.js';
import { db } from '../config/database.config.js';
import { signToken } from '../modules/auth/utils/jwt.js';
import {
    users,
    organizations,
    employees,
    leaveAllocations,
    salaryStructures,
    leaveTypes,
    leaveBalanceTransactions,
} from '../db/schema/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

describe('Employee & Profile Management Flow Tests', () => {
    let server;
    let baseUrl;
    let testOrg;
    let adminToken;
    let hrToken;

    before(async () => {
        // 1. Start test server
        await new Promise((resolve) => {
            server = app.listen(0, '127.0.0.1', () => {
                const address = server.address();
                baseUrl = `http://127.0.0.1:${address.port}`;
                resolve();
            });
        });

        // Clean up any stale test org with code 'TCORP' to avoid duplicate key conflict
        const [existingOrg] = await db
            .select()
            .from(organizations)
            .where(eq(organizations.code, 'TCORP'));
        if (existingOrg) {
            await db.delete(salaryStructures);
            await db.delete(leaveBalanceTransactions);
            await db.delete(leaveAllocations);
            await db.delete(leaveTypes);
            await db.delete(employees).where(eq(employees.organizationId, existingOrg.id));
            await db.delete(users).where(eq(users.organizationId, existingOrg.id));
            await db.delete(organizations).where(eq(organizations.id, existingOrg.id));
        }

        // 2. Setup test organization
        const [org] = await db
            .insert(organizations)
            .values({
                name: 'Test Corp',
                code: 'TCORP',
                email: 'test@tcorp.com',
                timezone: 'Asia/Kolkata',
                currency: 'INR',
            })
            .returning();
        testOrg = org;

        // Seed some active leave types for default allocations
        await db.insert(leaveTypes).values([
            {
                organizationId: org.id,
                code: 'CL',
                name: 'Casual Leave',
                requiresAllocation: true,
                isActive: true,
            },
            {
                organizationId: org.id,
                code: 'PL',
                name: 'Privilege Leave',
                requiresAllocation: true,
                isActive: true,
            },
            {
                organizationId: org.id,
                code: 'LWP',
                name: 'Leave Without Pay',
                requiresAllocation: false,
                isActive: true,
            },
        ]);

        // 3. Create Admin user
        const hashedPassword = await bcrypt.hash('AdminPass123!', 10);
        const [admin] = await db
            .insert(users)
            .values({
                organizationId: org.id,
                firstName: 'System',
                lastName: 'Admin',
                email: 'admin@tcorp.com',
                password: hashedPassword,
                role: 'admin',
                emailVerified: true,
                isActive: true,
            })
            .returning();
        adminToken = signToken({ id: admin.id });

        // 4. Create HR user
        const [hr] = await db
            .insert(users)
            .values({
                organizationId: org.id,
                firstName: 'HR',
                lastName: 'Manager',
                email: 'hr@tcorp.com',
                password: hashedPassword,
                role: 'hr',
                emailVerified: true,
                isActive: true,
            })
            .returning();
        hrToken = signToken({ id: hr.id });
    });

    after(async () => {
        // Clean up database tables in reverse dependency order
        try {
            if (testOrg) {
                await db.delete(salaryStructures);
                await db.delete(leaveBalanceTransactions);
                await db.delete(leaveAllocations);
                await db.delete(leaveTypes);
                await db.delete(employees).where(eq(employees.organizationId, testOrg.id));
                await db.delete(users).where(eq(users.organizationId, testOrg.id));
                await db.delete(organizations).where(eq(organizations.id, testOrg.id));
            }
        } catch (err) {
            console.error('Error during test teardown cleanup:', err);
        }

        if (server) {
            await new Promise((resolve) => server.close(resolve));
        }

        try {
            if (redis) await redis.quit();
        } catch (_err) {
            // Ignore redis quit failure
        }
    });

    let createdEmployee;
    let employeeToken;

    test('POST /api/employees - Creates employee, sets leaves, and configures salary (Admin/HR Only)', async () => {
        const payload = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe.personal@gmail.com',
            phone: '9876543210',
            joiningDate: '2026-08-21',
            employmentType: 'full_time',
            salary: 60000,
        };

        const res = await fetch(`${baseUrl}/api/employees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify(payload),
        });

        assert.equal(res.status, 201);
        const body = await res.json();
        assert.equal(body.success, true);
        assert.ok(body.data.employee.id);

        // Code format verify: prefix + initials + year + serial. e.g. TCORJODO20260002 (serial 2 since admin register org seeds serial 1 in sequences)
        // TC (companyPrefix is TCORP -> sliced to first 4 characters: TCOR) + JO (John) + DO (Doe) + 2026 + 0002
        assert.ok(body.data.employee.employeeCode.startsWith('TCORJODO2026'));
        assert.ok(body.data.credentials.temporaryPassword);

        createdEmployee = body.data.employee;
        employeeToken = signToken({ id: body.data.user.id });

        // Verify leave allocations are created in DB
        const allocations = await db
            .select()
            .from(leaveAllocations)
            .where(eq(leaveAllocations.employeeId, createdEmployee.id));
        assert.ok(allocations.length >= 2, 'Should create allocations for CL and PL');

        // Verify salary structure is created in DB
        const salaryRecs = await db
            .select()
            .from(salaryStructures)
            .where(eq(salaryStructures.employeeId, createdEmployee.id));
        assert.equal(salaryRecs.length, 1);
        assert.equal(Number(salaryRecs[0].monthlyWage), 60000);
    });

    test('GET /api/employees - Returns list with search, department, and status filters', async () => {
        // Search by name
        const resSearch = await fetch(`${baseUrl}/api/employees?search=John`, {
            headers: { Authorization: `Bearer ${hrToken}` },
        });
        assert.equal(resSearch.status, 200);
        const bodySearch = await resSearch.json();
        assert.ok(bodySearch.data.employees.some((e) => e.firstName === 'John'));

        // Filter by status
        const resStatus = await fetch(`${baseUrl}/api/employees?status=active`, {
            headers: { Authorization: `Bearer ${hrToken}` },
        });
        assert.equal(resStatus.status, 200);
        const bodyStatus = await resStatus.json();
        assert.ok(bodyStatus.data.employees.length > 0);
    });

    test('PATCH /api/profile/me - Allows editing self fields (phone), but rejects administrative fields with 403', async () => {
        // Update phone (allowed)
        const resAllowed = await fetch(`${baseUrl}/api/profile/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${employeeToken}`,
            },
            body: JSON.stringify({ phone: '1111111111' }),
        });
        assert.equal(resAllowed.status, 200);

        // Attempt to update departmentId (rejected)
        const resRejected = await fetch(`${baseUrl}/api/profile/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${employeeToken}`,
            },
            body: JSON.stringify({ departmentId: '00000000-0000-0000-0000-000000000000' }),
        });
        assert.equal(resRejected.status, 403);
        const bodyRejected = await resRejected.json();
        assert.equal(bodyRejected.success, false);
    });

    test('POST /api/employees/:id/deactivate and activate - Toggles account state', async () => {
        // Deactivate account
        const resDeactivate = await fetch(
            `${baseUrl}/api/employees/${createdEmployee.id}/deactivate`,
            {
                method: 'POST',
                headers: { Authorization: `Bearer ${adminToken}` },
            },
        );
        assert.equal(resDeactivate.status, 200);

        // Verify employee cannot log in / authenticate
        const resProfileBlocked = await fetch(`${baseUrl}/api/profile/me`, {
            headers: { Authorization: `Bearer ${employeeToken}` },
        });
        assert.equal(resProfileBlocked.status, 401, 'Should block deactivated user from access');

        // Activate account back
        const resActivate = await fetch(`${baseUrl}/api/employees/${createdEmployee.id}/activate`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        assert.equal(resActivate.status, 200);
    });

    test('POST /api/employees/:id/reset-password - Admin resets credentials', async () => {
        const resReset = await fetch(
            `${baseUrl}/api/employees/${createdEmployee.id}/reset-password`,
            {
                method: 'POST',
                headers: { Authorization: `Bearer ${adminToken}` },
            },
        );
        assert.equal(resReset.status, 200);
        const bodyReset = await resReset.json();
        assert.ok(bodyReset.data.temporaryPassword);
    });

    test('DELETE /api/employees/:id - Soft deletes employee and deactivates associated user', async () => {
        const resDelete = await fetch(`${baseUrl}/api/employees/${createdEmployee.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        assert.equal(resDelete.status, 200);

        // Verify not in list
        const resSearch = await fetch(`${baseUrl}/api/employees?search=John`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        assert.equal(resSearch.status, 200);
        const bodySearch = await resSearch.json();
        assert.ok(
            !bodySearch.data.employees.some((e) => e.id === createdEmployee.id),
            'Employee should be soft-deleted and removed from list',
        );
    });
});

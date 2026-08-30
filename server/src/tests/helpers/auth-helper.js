import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../config/database.config.js';
import { users, organizations, salaryComponentDefinitions } from '../../db/schema/schema.js';
import { eq } from 'drizzle-orm';
import envConfig from '../../config/env.config.js';

let cachedOrg = null;

/**
 * Get or create a baseline test organization
 */
export async function getOrCreateTestOrganization() {
    if (cachedOrg) return cachedOrg;

    let [org] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.code, 'TESTORG'))
        .limit(1);

    if (!org) {
        [org] = await db
            .insert(organizations)
            .values({
                name: 'Test Organization',
                code: 'TESTORG',
                email: 'admin@testorg.com',
                timezone: 'Asia/Kolkata',
                currency: 'INR',
            })
            .returning();
    }

    // Ensure baseline components exist for TESTORG
    const existingComps = await db
        .select()
        .from(salaryComponentDefinitions)
        .where(eq(salaryComponentDefinitions.organizationId, org.id));

    if (existingComps.length === 0) {
        await db.insert(salaryComponentDefinitions).values([
            {
                organizationId: org.id,
                code: 'BASIC',
                name: 'Basic Salary',
                componentType: 'earning',
                calculationType: 'percentage_of_wage',
            },
            {
                organizationId: org.id,
                code: 'HRA',
                name: 'House Rent Allowance',
                componentType: 'earning',
                calculationType: 'percentage_of_wage',
            },
            {
                organizationId: org.id,
                code: 'FIXED_ALLOWANCE',
                name: 'Fixed Allowance',
                componentType: 'earning',
                calculationType: 'fixed',
            },
            {
                organizationId: org.id,
                code: 'PF_EMPLOYEE',
                name: 'Provident Fund (Employee)',
                componentType: 'employee_deduction',
                calculationType: 'percentage_of_wage',
            },
            {
                organizationId: org.id,
                code: 'PROFESSIONAL_TAX',
                name: 'Professional Tax',
                componentType: 'employee_deduction',
                calculationType: 'fixed',
            },
        ]);
    }

    cachedOrg = org;
    return org;
}

/**
 * Generate randomized user data to avoid unique constraint collisions
 */
export function generateTestUserData(prefix = 'test_user') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 100000);
    return {
        firstName: 'Test',
        lastName: 'User',
        email: `${prefix}_${timestamp}_${random}@example.com`,
        password: 'Password@123',
        role: 'employee',
    };
}

/**
 * Directly create an authenticated test user and return records + auth headers/cookies
 */
export async function createAndLoginTestUser(overrides = {}) {
    const org = await getOrCreateTestOrganization();
    const payload = {
        ...generateTestUserData(),
        organizationId: org.id,
        ...overrides,
    };

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const [user] = await db
        .insert(users)
        .values({
            organizationId: payload.organizationId,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            password: hashedPassword,
            role: payload.role || 'employee',
            isActive: true,
            emailVerified: true,
            mustChangePassword: false,
        })
        .returning();

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, organizationId: user.organizationId },
        envConfig.JWT_SECRET || 'test-jwt-secret-key',
        { expiresIn: '1d' },
    );

    return {
        user,
        organization: org,
        token,
        cookie: `token=${token}`,
        authHeader: `Bearer ${token}`,
    };
}

/**
 * Get standard Admin, HR, and Employee users & cookies
 */
export async function getTestAuthContext() {
    const admin = await createAndLoginTestUser({ role: 'admin' });
    const hr = await createAndLoginTestUser({ role: 'hr' });
    const employee = await createAndLoginTestUser({ role: 'employee' });

    return { admin, hr, employee, organization: admin.organization };
}

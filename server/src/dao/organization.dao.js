import { db } from '../config/database.config.js';
import { eq } from 'drizzle-orm';
import { organizations } from '../db/schema/organizations.schema.js';
import { payrollSettings } from '../db/schema/payroll.schema.js';
import { workSchedules, workScheduleDays } from '../db/schema/work_schedules.schema.js';
import { leaveTypes } from '../db/schema/leave.schema.js';
import { users } from '../db/schema/users.schema.js';
import { employeeCodeSequences, employees } from '../db/schema/employees.schema.js';
import { generateEmployeeId } from '../utils/employeeId.utils.js';
import { getBaseCompanyCode } from '../utils/auth.utils.js';

/**
 * Generates a unique company code checking for conflicts in database.
 * @param {object} tx - Drizzle transaction context
 * @param {string} companyName
 */
export async function generateUniqueCompanyCode(tx, companyName) {
    const baseCode = getBaseCompanyCode(companyName);
    let code = baseCode;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
        const [existing] = await tx
            .select()
            .from(organizations)
            .where(eq(organizations.code, code));

        if (!existing) {
            isUnique = true;
        } else {
            const suffix = String(counter);
            code = baseCode.slice(0, 10 - suffix.length) + suffix;
            counter++;
        }
    }
    return code;
}

/**
 * Registers an organization along with its default setups, admin user and initial employee profile.
 */
export async function registerCompanyWithAdmin({
    companyName,
    logoUrl,
    email,
    phone,
    address,
    city,
    state,
    country,
    postalCode,
    timezone,
    currency,
    firstName,
    lastName,
    passwordHash,
    emailVerified,
}) {
    return await db.transaction(async (tx) => {
        // 1. Generate unique company code
        const orgCode = await generateUniqueCompanyCode(tx, companyName);

        // 2. Create organization
        const [org] = await tx
            .insert(organizations)
            .values({
                name: companyName,
                code: orgCode,
                logoUrl: logoUrl || null,
                email: email,
                phone: phone || null,
                address: address || null,
                city: city || null,
                state: state || null,
                country: country || 'India',
                postalCode: postalCode || null,
                timezone: timezone || 'Asia/Kolkata',
                currency: currency || 'INR',
                isActive: true,
            })
            .returning();

        // 3. Create default payroll settings
        await tx.insert(payrollSettings).values({
            organizationId: org.id,
            payrollFrequency: 'MONTHLY',
            payrollCurrency: org.currency,
            payDay: 1,
            workingDaysBasis: '22.00',
            unpaidLeaveDeductionMethod: 'PROPORTIONAL_GROSS',
            pfEnabled: true,
            employeePfRate: '12.00',
            employerPfRate: '12.00',
            professionalTaxEnabled: true,
            professionalTaxAmount: '200.00',
        });

        // 4. Create default work schedule
        const [schedule] = await tx
            .insert(workSchedules)
            .values({
                organizationId: org.id,
                name: 'Default Work Schedule',
                timezone: org.timezone,
                isActive: true,
                defaultBreakMinutes: 60,
            })
            .returning();

        // 5. Create default work schedule days (1-5 working, 0 and 6 off)
        const daysToInsert = [];
        for (let weekday = 0; weekday <= 6; weekday++) {
            const isWorking = weekday >= 1 && weekday <= 5;
            daysToInsert.push({
                scheduleId: schedule.id,
                weekday: weekday,
                isWorkingDay: isWorking,
                startTime: isWorking ? '09:00:00' : null,
                endTime: isWorking ? '18:00:00' : null,
                breakMinutes: isWorking ? 60 : 0,
            });
        }
        await tx.insert(workScheduleDays).values(daysToInsert);

        // 6. Create default leave policies
        const defaultLeaves = [
            { code: 'CL', name: 'Casual Leave', isPaid: true, requiresAllocation: true },
            { code: 'SL', name: 'Sick Leave', isPaid: true, requiresAllocation: true },
            { code: 'PL', name: 'Privilege Leave', isPaid: true, requiresAllocation: true },
            { code: 'LWP', name: 'Leave Without Pay', isPaid: false, requiresAllocation: false },
        ];
        await tx.insert(leaveTypes).values(
            defaultLeaves.map((lt) => ({
                organizationId: org.id,
                code: lt.code,
                name: lt.name,
                isPaid: lt.isPaid,
                requiresAllocation: lt.requiresAllocation,
                requiresAttachment: false,
                requiresApproval: true,
                unit: 'day',
                isActive: true,
            })),
        );

        // 7. Create user as admin of the organization
        const [user] = await tx
            .insert(users)
            .values({
                organizationId: org.id,
                firstName: firstName,
                lastName: lastName || 'Admin',
                email: email,
                password: passwordHash,
                role: 'admin',
                emailVerified: emailVerified,
                isActive: true,
                isDeleted: false,
            })
            .returning();

        // 8. Create employee sequence starting at 1
        const currentYear = new Date().getFullYear();
        await tx.insert(employeeCodeSequences).values({
            organizationId: org.id,
            joiningYear: currentYear,
            lastSequence: 1,
        });

        // 9. Generate employee ID for the admin user
        const empCode = generateEmployeeId(
            {
                firstName: firstName,
                lastName: lastName || 'Admin',
                joiningYear: currentYear,
                serialNumber: 1,
            },
            {
                companyPrefix: org.code.slice(0, 4),
            },
        );

        // 10. Create employee profile
        const [emp] = await tx
            .insert(employees)
            .values({
                organizationId: org.id,
                userId: user.id,
                employeeCode: empCode,
                firstName: firstName,
                lastName: lastName || 'Admin',
                displayName: `${firstName} ${lastName || 'Admin'}`.trim(),
                workEmail: email,
                joiningDate: new Date().toISOString().split('T')[0],
                employmentStatus: 'active',
                employmentType: 'full_time',
            })
            .returning();

        return { user, org, employee: emp };
    });
}

/**
 * Retrieve organization details by ID.
 * @param {string} id - Organization ID
 * @returns {Promise<object|null>} Organization details or null if not found
 */
export async function getOrganizationById(id) {
    if (!id) return null;
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org || null;
}

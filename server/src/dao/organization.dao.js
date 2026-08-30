import { db } from '../config/database.config.js';
import { eq, and, sql, asc } from 'drizzle-orm';
import {
    organizations,
    locations,
    departments,
    jobPositions,
} from '../db/schema/organizations.schema.js';
import { payrollSettings } from '../db/schema/payroll.schema.js';
import { workSchedules, workScheduleDays, holidays } from '../db/schema/work_schedules.schema.js';
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

// ── Company / Organization Operations ────────────────────────────────────────

export async function getOrganizationById(id) {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
    return org || null;
}

export async function updateOrganization(id, updates) {
    const [org] = await db
        .update(organizations)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(organizations.id, id))
        .returning();
    return org || null;
}

// ── Locations Operations ─────────────────────────────────────────────────────

export async function getLocations(organizationId) {
    return await db
        .select()
        .from(locations)
        .where(and(eq(locations.organizationId, organizationId), eq(locations.isActive, true)))
        .orderBy(asc(locations.name));
}

export async function getLocationById(id) {
    const [loc] = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
    return loc || null;
}

export async function createLocation(organizationId, data) {
    const [loc] = await db
        .insert(locations)
        .values({
            organizationId,
            name: data.name,
            address: data.address || null,
            isActive: data.isActive !== undefined ? data.isActive : true,
        })
        .returning();
    return loc;
}

export async function updateLocation(id, updates) {
    const data = {};
    if (updates.name !== undefined) data.name = updates.name;
    if (updates.address !== undefined || updates.city !== undefined) {
        data.address = updates.address || updates.city;
    }
    if (updates.isActive !== undefined) data.isActive = updates.isActive;

    const [loc] = await db
        .update(locations)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(locations.id, id))
        .returning();
    return loc || null;
}

export async function deleteLocation(id) {
    const [loc] = await db
        .update(locations)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(locations.id, id))
        .returning();
    return loc || null;
}

// ── Departments Operations ───────────────────────────────────────────────────

export async function getDepartments(organizationId) {
    return await db
        .select({
            id: departments.id,
            organizationId: departments.organizationId,
            name: departments.name,
            code: departments.code,
            managerEmployeeId: departments.managerEmployeeId,
            isActive: departments.isActive,
            createdAt: departments.createdAt,
            updatedAt: departments.updatedAt,
            manager: {
                id: employees.id,
                employeeCode: employees.employeeCode,
                firstName: employees.firstName,
                lastName: employees.lastName,
                displayName: employees.displayName,
                workEmail: employees.workEmail,
            },
        })
        .from(departments)
        .leftJoin(employees, eq(departments.managerEmployeeId, employees.id))
        .where(and(eq(departments.organizationId, organizationId), eq(departments.isActive, true)))
        .orderBy(asc(departments.name));
}

export async function getDepartmentById(id) {
    const [dept] = await db.select().from(departments).where(eq(departments.id, id)).limit(1);
    return dept || null;
}

export async function createDepartment(organizationId, data) {
    const [dept] = await db
        .insert(departments)
        .values({
            organizationId,
            name: data.name,
            code: data.code || null,
            managerEmployeeId: data.managerEmployeeId || null,
            isActive: data.isActive !== undefined ? data.isActive : true,
        })
        .returning();
    return dept;
}

export async function updateDepartment(id, updates) {
    const [dept] = await db
        .update(departments)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(departments.id, id))
        .returning();
    return dept || null;
}

export async function deleteDepartment(id) {
    const [dept] = await db
        .update(departments)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(departments.id, id))
        .returning();
    return dept || null;
}

// ── Job Positions Operations ─────────────────────────────────────────────────

export async function getJobPositions(organizationId) {
    return await db
        .select()
        .from(jobPositions)
        .where(
            and(eq(jobPositions.organizationId, organizationId), eq(jobPositions.isActive, true)),
        )
        .orderBy(asc(jobPositions.name));
}

export async function getJobPositionById(id) {
    const [pos] = await db.select().from(jobPositions).where(eq(jobPositions.id, id)).limit(1);
    return pos || null;
}

export async function createJobPosition(organizationId, data) {
    const [pos] = await db
        .insert(jobPositions)
        .values({
            organizationId,
            name: data.name,
            description: data.description || null,
            isActive: data.isActive !== undefined ? data.isActive : true,
        })
        .returning();
    return pos;
}

export async function updateJobPosition(id, updates) {
    const [pos] = await db
        .update(jobPositions)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(jobPositions.id, id))
        .returning();
    return pos || null;
}

export async function deleteJobPosition(id) {
    const [pos] = await db
        .update(jobPositions)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(jobPositions.id, id))
        .returning();
    return pos || null;
}

// ── Work Schedules & Schedule Days ──────────────────────────────────────────

export async function getWorkSchedules(organizationId) {
    const schedules = await db
        .select()
        .from(workSchedules)
        .where(
            and(eq(workSchedules.organizationId, organizationId), eq(workSchedules.isActive, true)),
        )
        .orderBy(asc(workSchedules.name));

    const result = [];
    for (const schedule of schedules) {
        const days = await db
            .select()
            .from(workScheduleDays)
            .where(eq(workScheduleDays.scheduleId, schedule.id))
            .orderBy(asc(workScheduleDays.weekday));

        result.push({
            ...schedule,
            days,
        });
    }
    return result;
}

export async function getWorkScheduleById(id) {
    const [schedule] = await db
        .select()
        .from(workSchedules)
        .where(eq(workSchedules.id, id))
        .limit(1);

    if (!schedule) return null;

    const days = await db
        .select()
        .from(workScheduleDays)
        .where(eq(workScheduleDays.scheduleId, schedule.id))
        .orderBy(asc(workScheduleDays.weekday));

    return {
        ...schedule,
        days,
    };
}

export async function createWorkSchedule(organizationId, scheduleData, daysData = []) {
    return await db.transaction(async (tx) => {
        const [schedule] = await tx
            .insert(workSchedules)
            .values({
                organizationId,
                name: scheduleData.name,
                timezone: scheduleData.timezone || 'Asia/Kolkata',
                defaultBreakMinutes: scheduleData.defaultBreakMinutes || 60,
                isActive: true,
            })
            .returning();

        if (daysData && daysData.length > 0) {
            const daysToInsert = daysData.map((d) => ({
                scheduleId: schedule.id,
                weekday: d.weekday,
                isWorkingDay: d.isWorkingDay !== undefined ? d.isWorkingDay : true,
                startTime: d.isWorkingDay ? d.startTime || '09:00:00' : null,
                endTime: d.isWorkingDay ? d.endTime || '18:00:00' : null,
                breakMinutes: d.isWorkingDay ? d.breakMinutes || 60 : 0,
            }));
            await tx.insert(workScheduleDays).values(daysToInsert);
        }

        const days = await tx
            .select()
            .from(workScheduleDays)
            .where(eq(workScheduleDays.scheduleId, schedule.id))
            .orderBy(asc(workScheduleDays.weekday));

        return { ...schedule, days };
    });
}

export async function updateWorkSchedule(id, updates, daysData) {
    return await db.transaction(async (tx) => {
        const [schedule] = await tx
            .update(workSchedules)
            .set({ ...updates, updatedAt: new Date() })
            .where(eq(workSchedules.id, id))
            .returning();

        if (!schedule) return null;

        if (daysData && Array.isArray(daysData)) {
            for (const d of daysData) {
                await tx
                    .insert(workScheduleDays)
                    .values({
                        scheduleId: id,
                        weekday: d.weekday,
                        isWorkingDay: d.isWorkingDay !== undefined ? d.isWorkingDay : true,
                        startTime: d.isWorkingDay ? d.startTime : null,
                        endTime: d.isWorkingDay ? d.endTime : null,
                        breakMinutes: d.isWorkingDay ? d.breakMinutes || 60 : 0,
                    })
                    .onConflictDoUpdate({
                        target: [workScheduleDays.scheduleId, workScheduleDays.weekday],
                        set: {
                            isWorkingDay: d.isWorkingDay !== undefined ? d.isWorkingDay : true,
                            startTime: d.isWorkingDay ? d.startTime : null,
                            endTime: d.isWorkingDay ? d.endTime : null,
                            breakMinutes: d.isWorkingDay ? d.breakMinutes || 60 : 0,
                        },
                    });
            }
        }

        const days = await tx
            .select()
            .from(workScheduleDays)
            .where(eq(workScheduleDays.scheduleId, schedule.id))
            .orderBy(asc(workScheduleDays.weekday));

        return { ...schedule, days };
    });
}

export async function deleteWorkSchedule(id) {
    const [schedule] = await db
        .update(workSchedules)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(workSchedules.id, id))
        .returning();
    return schedule || null;
}

// ── Holidays Operations ──────────────────────────────────────────────────────

export async function getHolidays(organizationId, year) {
    const filters = [eq(holidays.organizationId, organizationId)];
    if (year) {
        filters.push(sql`EXTRACT(YEAR FROM ${holidays.holidayDate}) = ${year}`);
    }
    return await db
        .select()
        .from(holidays)
        .where(and(...filters))
        .orderBy(asc(holidays.holidayDate));
}

export async function createHoliday(organizationId, data) {
    const [holiday] = await db
        .insert(holidays)
        .values({
            organizationId,
            name: data.name,
            holidayDate: data.holidayDate,
            isOptional: data.isOptional || false,
            description: data.description || null,
        })
        .returning();
    return holiday;
}

export async function deleteHoliday(id) {
    const [holiday] = await db.delete(holidays).where(eq(holidays.id, id)).returning();
    return holiday || null;
}

// ── Payroll Settings Operations ──────────────────────────────────────────────

export async function getPayrollSettingsByOrgId(organizationId) {
    const [settings] = await db
        .select()
        .from(payrollSettings)
        .where(eq(payrollSettings.organizationId, organizationId))
        .limit(1);
    return settings || null;
}

export async function updatePayrollSettingsByOrgId(organizationId, updates) {
    const [settings] = await db
        .update(payrollSettings)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(payrollSettings.organizationId, organizationId))
        .returning();
    return settings || null;
}

// ── Leave Types Operations ───────────────────────────────────────────────────

export async function getLeaveTypes(organizationId) {
    return await db
        .select()
        .from(leaveTypes)
        .where(and(eq(leaveTypes.organizationId, organizationId), eq(leaveTypes.isActive, true)))
        .orderBy(asc(leaveTypes.name));
}

export async function getLeaveTypeById(id) {
    const [lt] = await db.select().from(leaveTypes).where(eq(leaveTypes.id, id)).limit(1);
    return lt || null;
}

export async function createLeaveType(organizationId, data) {
    const [lt] = await db
        .insert(leaveTypes)
        .values({
            organizationId,
            code: data.code,
            name: data.name,
            isPaid: data.isPaid !== undefined ? data.isPaid : true,
            requiresAllocation:
                data.requiresAllocation !== undefined ? data.requiresAllocation : true,
            requiresAttachment: data.requiresAttachment || false,
            requiresApproval: data.requiresApproval !== undefined ? data.requiresApproval : true,
            unit: data.unit || 'day',
            isActive: true,
        })
        .returning();
    return lt;
}

export async function updateLeaveType(id, updates) {
    const [lt] = await db
        .update(leaveTypes)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(leaveTypes.id, id))
        .returning();
    return lt || null;
}

export async function deleteLeaveType(id) {
    const [lt] = await db
        .update(leaveTypes)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(leaveTypes.id, id))
        .returning();
    return lt || null;
}

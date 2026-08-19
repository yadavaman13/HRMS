import { db } from '../config/database.config.js';
import {
    employees,
    employeePrivateInfo,
    employeeBankAccounts,
    employeeIdentifiers,
    employeeDocuments,
    employeeSkills,
    skills,
    certifications,
} from '../db/schema/schema.js';
import { users } from '../db/schema/schema.js';
import { departments, jobPositions, locations } from '../db/schema/schema.js';
import { eq, and, sql } from 'drizzle-orm';

const employeeProfileSelect = {
    id: employees.id,
    organizationId: employees.organizationId,
    employeeCode: employees.employeeCode,
    firstName: employees.firstName,
    middleName: employees.middleName,
    lastName: employees.lastName,
    displayName: employees.displayName,
    dateOfBirth: employees.dateOfBirth,
    gender: employees.gender,
    phone: employees.phone,
    workEmail: employees.workEmail,
    departmentId: employees.departmentId,
    jobPositionId: employees.jobPositionId,
    managerId: employees.managerId,
    locationId: employees.locationId,
    joiningDate: employees.joiningDate,
    terminationDate: employees.terminationDate,
    employmentStatus: employees.employmentStatus,
    employmentType: employees.employmentType,
    userId: employees.userId,
    createdAt: employees.createdAt,
    updatedAt: employees.updatedAt,
};

// ── Employee CRUD ────────────────────────────────────────────────────────────

export async function getEmployeeById(id, includeDeleted = false) {
    const filters = [eq(employees.id, id)];
    if (!includeDeleted) filters.push(sql`${employees.deletedAt} IS NULL`);

    const [row] = await db
        .select(employeeProfileSelect)
        .from(employees)
        .where(and(...filters));
    return row || null;
}

export async function getEmployeeByUserId(userId) {
    const [row] = await db
        .select(employeeProfileSelect)
        .from(employees)
        .where(and(eq(employees.userId, userId), sql`${employees.deletedAt} IS NULL`));
    return row || null;
}

export async function listEmployees(organizationId, opts = {}) {
    const { status, departmentId, limit = 100, offset = 0 } = opts;
    const filters = [eq(employees.organizationId, organizationId), sql`${employees.deletedAt} IS NULL`];

    if (status) filters.push(eq(employees.employmentStatus, status));
    if (departmentId) filters.push(eq(employees.departmentId, departmentId));

    return db
        .select(employeeProfileSelect)
        .from(employees)
        .where(and(...filters))
        .limit(limit)
        .offset(offset)
        .orderBy(employees.firstName);
}

export async function updateEmployee(id, data) {
    const [row] = await db
        .update(employees)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(employees.id, id), sql`${employees.deletedAt} IS NULL`))
        .returning(employeeProfileSelect);
    return row || null;
}

// ── Private Info ─────────────────────────────────────────────────────────────

export async function getEmployeePrivateInfo(employeeId) {
    const [row] = await db
        .select()
        .from(employeePrivateInfo)
        .where(eq(employeePrivateInfo.employeeId, employeeId));
    return row || null;
}

export async function upsertEmployeePrivateInfo(employeeId, data) {
    // delete first to avoid conflict, then insert
    await db.delete(employeePrivateInfo).where(eq(employeePrivateInfo.employeeId, employeeId));
    const [row] = await db
        .insert(employeePrivateInfo)
        .values({ employeeId, ...data })
        .returning();
    return row;
}

// ── Bank Accounts ────────────────────────────────────────────────────────────

export async function getEmployeeBankAccounts(employeeId) {
    return db
        .select()
        .from(employeeBankAccounts)
        .where(eq(employeeBankAccounts.employeeId, employeeId));
}

export async function upsertEmployeeBankAccount(employeeId, data) {
    const [row] = await db
        .insert(employeeBankAccounts)
        .values({ employeeId, ...data })
        .onConflictDoUpdate({
            target: employeeBankAccounts.id,
            set: { ...data, updatedAt: new Date() },
        })
        .returning();
    return row;
}

// ── Government Identifiers ───────────────────────────────────────────────────

export async function getEmployeeIdentifiers(employeeId) {
    const [row] = await db
        .select()
        .from(employeeIdentifiers)
        .where(eq(employeeIdentifiers.employeeId, employeeId));
    return row || null;
}

export async function upsertEmployeeIdentifiers(employeeId, data) {
    await db.delete(employeeIdentifiers).where(eq(employeeIdentifiers.employeeId, employeeId));
    const [row] = await db
        .insert(employeeIdentifiers)
        .values({ employeeId, ...data })
        .returning();
    return row;
}

// ── Documents ────────────────────────────────────────────────────────────────

export async function getEmployeeDocuments(employeeId) {
    return db
        .select()
        .from(employeeDocuments)
        .where(eq(employeeDocuments.employeeId, employeeId));
}

// ── Skills ───────────────────────────────────────────────────────────────────

export async function getEmployeeSkills(employeeId) {
    return db
        .select({
            skillId: skills.id,
            name: skills.name,
            proficiency: employeeSkills.proficiency,
        })
        .from(employeeSkills)
        .innerJoin(skills, eq(employeeSkills.skillId, skills.id))
        .where(eq(employeeSkills.employeeId, employeeId));
}

// ── Certifications ───────────────────────────────────────────────────────────

export async function getEmployeeCertifications(employeeId) {
    return db
        .select()
        .from(certifications)
        .where(eq(certifications.employeeId, employeeId));
}

// ── Dashboard Status View ────────────────────────────────────────────────────

export async function getEmployeeDashboardStatus(organizationId) {
    const result = await db.execute(
        sql`SELECT * FROM employee_dashboard_status WHERE organization_id = ${organizationId}`,
    );
    return result.rows;
}

// ── Profile helper: fetch full profile with joins ────────────────────────────

export async function getFullEmployeeProfile(employeeId) {
    const [row] = await db
        .select({
            ...employeeProfileSelect,
            userEmail: users.email,
            userProfileImage: users.profileImage,
            departmentName: departments.name,
            jobPositionName: jobPositions.name,
            locationName: locations.name,
            managerFirstName: sql`manager.first_name`.as('manager_first_name'),
            managerLastName: sql`manager.last_name`.as('manager_last_name'),
        })
        .from(employees)
        .leftJoin(users, eq(employees.userId, users.id))
        .leftJoin(departments, eq(employees.departmentId, departments.id))
        .leftJoin(jobPositions, eq(employees.jobPositionId, jobPositions.id))
        .leftJoin(locations, eq(employees.locationId, locations.id))
        .leftJoin(sql`employees AS manager`, eq(employees.managerId, sql`manager.id`))
        .where(and(eq(employees.id, employeeId), sql`${employees.deletedAt} IS NULL`));
    return row || null;
}
// import { eq } from 'drizzle-orm';
// import { employees } from '../db/schema/employees.schema.js';

// /**
//  * Fetch employee profile by Employee Code.
//  * @param {string} employeeCode
//  * @returns {Promise<object|null>} The employee record or null if not found.
//  */
// export async function getEmployeeByCode(employeeCode) {
//     if (typeof employeeCode !== 'string') return null;
//     const [employee] = await db
//         .select()
//         .from(employees)
//         .where(eq(employees.employeeCode, employeeCode.toUpperCase()));
//     return employee || null;
// }
// >>>>>>> 5b7e10656e6142ef6dfc2462d6f1fa5d66567abb

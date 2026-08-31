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
    employeeCodeSequences,
    employeeScheduleAssignments,
    notifications,
    auditLogs,
    leaveTypes,
    leaveAllocations,
    salaryStructures,
    salaryStructureComponents,
    salaryComponentDefinitions,
} from '../db/schema/schema.js';
import { users } from '../db/schema/schema.js';
import { departments, jobPositions, locations } from '../db/schema/schema.js';
import { eq, and, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { generateEmployeeId } from '../utils/employeeId.utils.js';
import { generateTemporaryPassword } from '../utils/auth.utils.js';

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
    const { status, departmentId, department, search, managerId, limit = 100, offset = 0 } = opts;
    const filters = [
        eq(employees.organizationId, organizationId),
        sql`${employees.deletedAt} IS NULL`,
    ];

    if (status) {
        filters.push(eq(employees.employmentStatus, status));
    }
    if (departmentId) {
        filters.push(eq(employees.departmentId, departmentId));
    }
    if (managerId) {
        filters.push(eq(employees.managerId, managerId));
    }
    if (search) {
        const cleanSearch = `%${search.toLowerCase()}%`;
        filters.push(sql`(
            LOWER(${employees.firstName}) LIKE ${cleanSearch} OR
            LOWER(${employees.lastName}) LIKE ${cleanSearch} OR
            LOWER(${employees.workEmail}) LIKE ${cleanSearch} OR
            LOWER(${employees.employeeCode}) LIKE ${cleanSearch}
        )`);
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (department) {
        if (isUuid.test(department)) {
            filters.push(eq(employees.departmentId, department));
        }
    }

    let queryBuilder = db
        .select({
            ...employeeProfileSelect,
            departmentName: departments.name,
            jobPositionName: jobPositions.name,
            locationName: locations.name,
        })
        .from(employees)
        .leftJoin(departments, eq(employees.departmentId, departments.id))
        .leftJoin(jobPositions, eq(employees.jobPositionId, jobPositions.id))
        .leftJoin(locations, eq(employees.locationId, locations.id));

    if (department && !isUuid.test(department)) {
        filters.push(eq(sql`LOWER(${departments.name})`, department.toLowerCase()));
    }

    return queryBuilder
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

export async function getEmployeeDocuments(employeeId, tx) {
    const client = tx || db;
    return client
        .select()
        .from(employeeDocuments)
        .where(eq(employeeDocuments.employeeId, employeeId));
}

export async function getEmployeeDocumentById(id, tx) {
    const client = tx || db;
    const [doc] = await client
        .select()
        .from(employeeDocuments)
        .where(eq(employeeDocuments.id, id))
        .limit(1);
    return doc || null;
}

export async function createEmployeeDocument(data, tx) {
    const client = tx || db;
    const [doc] = await client.insert(employeeDocuments).values(data).returning();
    return doc;
}

export async function deleteEmployeeDocument(id, tx) {
    const client = tx || db;
    const [doc] = await client
        .delete(employeeDocuments)
        .where(eq(employeeDocuments.id, id))
        .returning();
    return doc || null;
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
    return db.select().from(certifications).where(eq(certifications.employeeId, employeeId));
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

/**
 * Fetch employee profile by Employee Code.
 * @param {string} employeeCode
 * @returns {Promise<object|null>} The employee record or null if not found.
 */
export async function getEmployeeByCode(employeeCode) {
    if (typeof employeeCode !== 'string') return null;
    const [employee] = await db
        .select()
        .from(employees)
        .where(eq(employees.employeeCode, employeeCode.toUpperCase()));
    return employee || null;
}

/**
 * Handle creation of employee, user account, temporary password,
 * audit logging, and notification in a single transaction.
 */
export async function createEmployeeTx({
    organizationId,
    orgCode,
    firstName,
    lastName,
    email, // personal email
    phone,
    profilePicture,
    departmentId,
    jobPositionId,
    managerId,
    joiningDate,
    locationId,
    employmentType,
    workScheduleId,
    actorUserId,
    ipAddress,
    userAgent,
    salary,
    role = 'employee',
}) {
    const currentYear = new Date(joiningDate).getFullYear();

    return await db.transaction(async (tx) => {
        // 1. Fetch or create sequence for organization and year
        const [existingSeq] = await tx
            .select()
            .from(employeeCodeSequences)
            .where(
                and(
                    eq(employeeCodeSequences.organizationId, organizationId),
                    eq(employeeCodeSequences.joiningYear, currentYear),
                ),
            );

        let serialNumber;
        if (existingSeq) {
            serialNumber = existingSeq.lastSequence + 1;
            await tx
                .update(employeeCodeSequences)
                .set({ lastSequence: serialNumber })
                .where(eq(employeeCodeSequences.id, existingSeq.id));
        } else {
            serialNumber = 1;
            await tx.insert(employeeCodeSequences).values({
                organizationId,
                joiningYear: currentYear,
                lastSequence: 1,
            });
        }

        // 2. Generate Employee Code (Login ID) using helper
        const empCode = generateEmployeeId(
            {
                firstName,
                lastName: lastName || '',
                joiningYear: currentYear,
                serialNumber,
            },
            {
                companyPrefix: orgCode.slice(0, 4),
            },
        );

        // 3. Generate Temporary Password
        const tempPassword = generateTemporaryPassword(email);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // 4. Generate unique work email
        const cleanFirst = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanLast = (lastName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const baseWorkEmail = `${cleanFirst}${cleanLast ? '.' + cleanLast : ''}@${orgCode.toLowerCase()}.dayflow.com`;

        let workEmail = baseWorkEmail;
        let emailUnique = false;
        let emailCounter = 1;
        while (!emailUnique) {
            const [existingUser] = await tx.select().from(users).where(eq(users.email, workEmail));
            if (!existingUser) {
                emailUnique = true;
            } else {
                workEmail = `${cleanFirst}${cleanLast ? '.' + cleanLast : ''}${emailCounter}@${orgCode.toLowerCase()}.dayflow.com`;
                emailCounter++;
            }
        }

        // 5. Create user record
        const [newUser] = await tx
            .insert(users)
            .values({
                organizationId,
                firstName,
                lastName: lastName || '',
                email: workEmail,
                password: hashedPassword,
                profileImage:
                    profilePicture || 'https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg',
                role: role,
                emailVerified: true,
                isActive: true,
                mustChangePassword: true,
            })
            .returning();

        // 6. Create employee profile
        const [newEmployee] = await tx
            .insert(employees)
            .values({
                organizationId,
                userId: newUser.id,
                employeeCode: empCode,
                firstName,
                lastName: lastName || null,
                displayName: `${firstName} ${lastName || ''}`.trim(),
                phone: phone || null,
                workEmail,
                departmentId: departmentId || null,
                jobPositionId: jobPositionId || null,
                managerId: managerId || null,
                locationId: locationId || null,
                joiningDate: joiningDate,
                employmentStatus: 'active',
                employmentType: employmentType || 'full_time',
            })
            .returning();

        // 7. Create private info record for personal email
        await tx.insert(employeePrivateInfo).values({
            employeeId: newEmployee.id,
            personalEmail: email || null,
        });

        // 8. Assign work schedule if schedule ID is provided
        if (workScheduleId) {
            await tx.insert(employeeScheduleAssignments).values({
                employeeId: newEmployee.id,
                scheduleId: workScheduleId,
                effectiveFrom: joiningDate,
            });
        }

        // 8.1 Create default leave allocations
        const activeLeaveTypes = await tx
            .select()
            .from(leaveTypes)
            .where(
                and(
                    eq(leaveTypes.organizationId, organizationId),
                    eq(leaveTypes.requiresAllocation, true),
                    eq(leaveTypes.isActive, true),
                ),
            );

        for (const lt of activeLeaveTypes) {
            let allocatedDays = '12.00';
            if (lt.code === 'PL') allocatedDays = '15.00';

            await tx.insert(leaveAllocations).values({
                employeeId: newEmployee.id,
                leaveTypeId: lt.id,
                periodStart: `${currentYear}-01-01`,
                periodEnd: `${currentYear}-12-31`,
                allocatedDays,
                carriedForwardDays: '0.00',
                createdBy: actorUserId,
            });
        }

        // 8.2 Create salary configuration if provided
        if (salary !== undefined && salary !== null) {
            let monthlyWage;
            let wageType;
            if (typeof salary === 'object') {
                monthlyWage = String(salary.monthlyWage || salary.salary || '0.00');
                wageType = salary.wageType || 'fixed';
            } else {
                monthlyWage = String(salary);
                wageType = 'fixed';
            }

            const [struct] = await tx
                .insert(salaryStructures)
                .values({
                    employeeId: newEmployee.id,
                    monthlyWage,
                    wageType,
                    effectiveFrom: joiningDate,
                    status: 'ACTIVE',
                    createdBy: actorUserId,
                })
                .returning();

            const [basicComp] = await tx
                .select()
                .from(salaryComponentDefinitions)
                .where(
                    and(
                        eq(salaryComponentDefinitions.organizationId, organizationId),
                        eq(salaryComponentDefinitions.code, 'BASIC'),
                        eq(salaryComponentDefinitions.isActive, true),
                    ),
                )
                .limit(1);

            if (basicComp && struct) {
                await tx.insert(salaryStructureComponents).values({
                    salaryStructureId: struct.id,
                    componentDefinitionId: basicComp.id,
                    calculationType: 'percentage_of_wage',
                    percentage: '100.00',
                    sequence: 1,
                });
            }
        }

        // 9. Log audit log
        await tx.insert(auditLogs).values({
            organizationId,
            actorUserId,
            action: 'employee_created',
            entityType: 'employee',
            entityId: newEmployee.id,
            newData: {
                userId: newUser.id,
                employeeId: newEmployee.id,
                firstName,
                lastName,
                workEmail,
                employeeCode: empCode,
                joiningDate,
            },
            ipAddress,
            userAgent,
        });

        // 10. Insert notification
        await tx.insert(notifications).values({
            userId: newUser.id,
            type: 'employee_created',
            title: 'Welcome to Dayflow!',
            message:
                'Your employee account has been created successfully. Please log in using your Employee ID and temporary password.',
            isRead: false,
        });

        return { newUser, newEmployee, empCode, workEmail, tempPassword };
    });
}

/**
 * Soft delete an employee and their user account in a transaction
 */
export async function softDeleteEmployee(employeeId, actorUserId, ipAddress, userAgent) {
    return await db.transaction(async (tx) => {
        const [employee] = await tx
            .select()
            .from(employees)
            .where(and(eq(employees.id, employeeId), sql`${employees.deletedAt} IS NULL`));

        if (!employee) {
            throw new Error('Employee not found or already deleted');
        }

        const now = new Date();

        // 1. Soft delete employee
        await tx
            .update(employees)
            .set({ deletedAt: now, updatedAt: now, employmentStatus: 'terminated' })
            .where(eq(employees.id, employeeId));

        // 2. Soft delete user
        if (employee.userId) {
            const recoveryExpiresAt = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
            await tx
                .update(users)
                .set({
                    isDeleted: true,
                    isActive: false,
                    deletedAt: now,
                    recoveryExpiresAt,
                    updatedAt: now,
                })
                .where(eq(users.id, employee.userId));
        }

        // 3. Log audit event
        await tx.insert(auditLogs).values({
            organizationId: employee.organizationId,
            actorUserId,
            action: 'employee_deleted',
            entityType: 'employee',
            entityId: employeeId,
            newData: { deletedAt: now },
            ipAddress,
            userAgent,
        });

        return employee;
    });
}

/**
 * Activate or deactivate an employee account
 */
export async function updateEmployeeStatus(
    employeeId,
    isActive,
    actorUserId,
    ipAddress,
    userAgent,
) {
    return await db.transaction(async (tx) => {
        const [employee] = await tx
            .select()
            .from(employees)
            .where(and(eq(employees.id, employeeId), sql`${employees.deletedAt} IS NULL`));

        if (!employee) {
            throw new Error('Employee not found');
        }

        if (!employee.userId) {
            throw new Error('No user account linked to this employee');
        }

        // 1. Update user active status
        const [updatedUser] = await tx
            .update(users)
            .set({ isActive, updatedAt: new Date() })
            .where(eq(users.id, employee.userId))
            .returning();

        // 2. Log audit event
        await tx.insert(auditLogs).values({
            organizationId: employee.organizationId,
            actorUserId,
            action: isActive ? 'employee_activated' : 'employee_deactivated',
            entityType: 'employee',
            entityId: employeeId,
            newData: { isActive },
            ipAddress,
            userAgent,
        });

        return { employee, user: updatedUser };
    });
}

/**
 * Reset employee password
 */
export async function resetEmployeePassword(
    employeeId,
    hashedPassword,
    actorUserId,
    ipAddress,
    userAgent,
) {
    return await db.transaction(async (tx) => {
        const [employee] = await tx
            .select()
            .from(employees)
            .where(and(eq(employees.id, employeeId), sql`${employees.deletedAt} IS NULL`));

        if (!employee) {
            throw new Error('Employee not found');
        }

        if (!employee.userId) {
            throw new Error('No user account linked to this employee');
        }

        // 1. Update user password
        const [updatedUser] = await tx
            .update(users)
            .set({
                password: hashedPassword,
                mustChangePassword: true,
                updatedAt: new Date(),
            })
            .where(eq(users.id, employee.userId))
            .returning();

        // 2. Log audit event
        await tx.insert(auditLogs).values({
            organizationId: employee.organizationId,
            actorUserId,
            action: 'employee_password_reset',
            entityType: 'employee',
            entityId: employeeId,
            ipAddress,
            userAgent,
        });

        return { employee, user: updatedUser };
    });
}

export async function searchEmployeesBySkill(orgId, skillName, proficiency, limit = 20) {
    const filters = [
        eq(employees.organizationId, orgId),
        sql`${employees.deletedAt} IS NULL`,
        sql`LOWER(${skills.name}) LIKE LOWER(${'%' + skillName + '%'})`,
    ];
    if (proficiency) filters.push(eq(employeeSkills.proficiency, proficiency));

    return db
        .select({
            employeeId: employees.id,
            firstName: employees.firstName,
            lastName: employees.lastName,
            displayName: employees.displayName,
            employeeCode: employees.employeeCode,
            workEmail: employees.workEmail,
            skillName: skills.name,
            proficiency: employeeSkills.proficiency,
        })
        .from(employeeSkills)
        .innerJoin(employees, eq(employeeSkills.employeeId, employees.id))
        .innerJoin(skills, eq(employeeSkills.skillId, skills.id))
        .where(and(...filters))
        .limit(Math.min(limit, 50))
        .orderBy(employees.firstName);
}

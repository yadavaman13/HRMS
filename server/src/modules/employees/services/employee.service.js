import * as employeeDao from '../../../dao/employee.dao.js';
import { AppError } from '../../auth/utils/appError.js';

// ── Permission matrix ────────────────────────────────────────────────────
const PERMISSIONS = {
    employee: {
        read: [
            'id',
            'employeeCode',
            'firstName',
            'middleName',
            'lastName',
            'displayName',
            'dateOfBirth',
            'gender',
            'phone',
            'workEmail',
            'userEmail',
            'userProfileImage',
            'departmentName',
            'jobPositionName',
            'locationName',
            'managerFirstName',
            'managerLastName',
            'joiningDate',
            'employmentStatus',
            'employmentType',
            'createdAt',
        ],
        write: ['phone', 'workEmail'], // self-only
    },
    hr: { read: 'all', write: 'all' },
    admin: { read: 'all', write: 'all' },
};

function canRead(role, field) {
    const perm = PERMISSIONS[role]?.read;
    return perm === 'all' || (Array.isArray(perm) && perm.includes(field));
}

function canWrite(role) {
    return PERMISSIONS[role]?.write === 'all';
}

function filterReadable(role, data) {
    if (!data) return null;
    if (PERMISSIONS[role]?.read === 'all') return data;
    const allowed = PERMISSIONS[role]?.read || [];
    const result = {};
    for (const key of allowed) {
        if (key in data) result[key] = data[key];
    }
    return result;
}

// ── Employee Directory ───────────────────────────────────────────────────

export async function getDirectory(organizationId, userId, userRole, opts) {
    const employees = await employeeDao.listEmployees(organizationId, opts);
    const statusRows = await employeeDao.getEmployeeDashboardStatus(organizationId);

    const statusMap = {};
    for (const s of statusRows) {
        statusMap[s.employee_id] = s.computed_status;
    }

    const mapped = employees.map((emp) => ({
        ...filterReadable(userRole, {
            id: emp.id,
            employeeCode: emp.employeeCode,
            firstName: emp.firstName,
            lastName: emp.lastName,
            displayName: emp.displayName,
            departmentId: emp.departmentId,
            jobPositionId: emp.jobPositionId,
            employmentStatus: emp.employmentStatus,
        }),
        status: statusMap[emp.id] || 'absent',
    }));

    return mapped;
}

// ── Employee Profile (header + resume) ──────────────────────────────────

export async function getProfile(employeeId, userRole) {
    const profile = await employeeDao.getFullEmployeeProfile(employeeId);
    if (!profile) throw new AppError('Employee not found', 404);

    const skills = await employeeDao.getEmployeeSkills(employeeId);
    const certifications = await employeeDao.getEmployeeCertifications(employeeId);

    return {
        header: filterReadable(userRole, {
            id: profile.id,
            employeeCode: profile.employeeCode,
            firstName: profile.firstName,
            lastName: profile.lastName,
            displayName: profile.displayName,
            workEmail: profile.workEmail,
            phone: profile.phone,
            userEmail: profile.userEmail,
            userProfileImage: profile.userProfileImage,
            departmentName: profile.departmentName,
            jobPositionName: profile.jobPositionName,
            locationName: profile.locationName,
            managerFirstName: profile.managerFirstName,
            managerLastName: profile.managerLastName,
            joiningDate: profile.joiningDate,
            employmentStatus: profile.employmentStatus,
            employmentType: profile.employmentType,
        }),
        resume: {
            dateOfBirth: profile.dateOfBirth,
            gender: profile.gender,
            skills,
            certifications,
        },
    };
}

// ── Private Info (restricted) ────────────────────────────────────────────

export async function getPrivateInfo(employeeId, userRole) {
    if (!canRead(userRole, 'bankDetails')) {
        throw new AppError('Access denied: private information requires admin/HR role', 403);
    }

    const [privateInfo, bankAccounts, identifiers] = await Promise.all([
        employeeDao.getEmployeePrivateInfo(employeeId),
        employeeDao.getEmployeeBankAccounts(employeeId),
        employeeDao.getEmployeeIdentifiers(employeeId),
    ]);

    return {
        residentialAddress: privateInfo?.residentialAddress ?? null,
        personalEmail: privateInfo?.personalEmail ?? null,
        nationality: privateInfo?.nationality ?? null,
        maritalStatus: privateInfo?.maritalStatus ?? null,
        emergencyContactName: privateInfo?.emergencyContactName ?? null,
        emergencyContactPhone: privateInfo?.emergencyContactPhone ?? null,
        bankAccounts: bankAccounts.map((b) => ({
            id: b.id,
            accountHolderName: b.accountHolderName,
            // account_number_encrypted is BYTEA — return masked or handle decryption at app layer
            maskedAccountNumber:
                '********' + (b.accountNumberEncrypted?.toString('utf-8').slice(-4) ?? ''),
            bankName: b.bankName,
            ifscCode: b.ifscCode,
            isPrimary: b.isPrimary,
        })),
        pan: identifiers?.panEncrypted ? '********' : null,
        uan: identifiers?.uanEncrypted ? '********' : null,
        aadhaar: identifiers?.aadhaarEncrypted ? '********' : null,
    };
}

// ── Update Profile ──────────────────────────────────────────────────────

export async function updateProfile(employeeId, userId, userRole, data) {
    // Employees can only update their own profile
    const employee = await employeeDao.getEmployeeById(employeeId);
    if (!employee) throw new AppError('Employee not found', 404);

    const isSelf = employee.userId === userId;
    const isAdmin = userRole === 'admin' || userRole === 'hr';

    if (!isSelf && !isAdmin) {
        throw new AppError('You can only update your own profile', 403);
    }

    const updates = {};

    // Field-level write enforcement
    const writableByEmployee = ['phone', 'workEmail'];
    for (const [key, value] of Object.entries(data)) {
        if (isAdmin || writableByEmployee.includes(key)) {
            // Map camelCase controller keys to DB column names
            const dbKey = key.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());
            updates[dbKey] = value;
        }
    }

    if (Object.keys(updates).length === 0) {
        throw new AppError('No valid fields to update', 400);
    }

    return employeeDao.updateEmployee(employeeId, updates);
}

// ── Update Private Info ─────────────────────────────────────────────────

export async function updatePrivateInfo(employeeId, userRole, data) {
    if (!canWrite(userRole)) {
        throw new AppError('Access denied', 403);
    }
    return employeeDao.upsertEmployeePrivateInfo(employeeId, data);
}

// ── Update Bank Accounts ────────────────────────────────────────────────

export async function updateBankAccount(employeeId, userRole, data) {
    if (!canWrite(userRole)) {
        throw new AppError('Access denied', 403);
    }
    return employeeDao.upsertEmployeeBankAccount(employeeId, data);
}

// ── Update Identifiers ──────────────────────────────────────────────────

export async function updateIdentifiers(employeeId, userRole, data) {
    if (!canWrite(userRole)) {
        throw new AppError('Access denied', 403);
    }
    return employeeDao.upsertEmployeeIdentifiers(employeeId, data);
}

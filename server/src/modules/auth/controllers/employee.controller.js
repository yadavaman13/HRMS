import { db } from '../../../config/database.config.js';
import { organizations } from '../../../db/schema/organizations.schema.js';
import { users } from '../../../db/schema/users.schema.js';
import {
    employees,
    employeePrivateInfo,
    employeeCodeSequences,
} from '../../../db/schema/employees.schema.js';
import { employeeScheduleAssignments } from '../../../db/schema/work_schedules.schema.js';
import { notifications } from '../../../db/schema/notifications.schema.js';
import { auditLogs } from '../../../db/schema/audit.schema.js';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { sendResponse } from '../../../utils/response.utlis.js';
import { generateEmployeeId } from '../../../utils/employeeId.utils.js';
import { generateTemporaryPassword } from '../../../utils/auth.utils.js';
import { sendEmail } from '../../../services/mail/mail.service.js';

/**
 * Admin creates an employee, creates their user account, generates credentials,
 * logs audit trails, and dispatches a welcome email.
 */
export async function createEmployee(req, res, next) {
    try {
        const organizationId = req.user.organizationId;
        if (!organizationId) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'Admin must belong to an organization.',
                success: false,
            });
        }

        const [org] = await db
            .select()
            .from(organizations)
            .where(eq(organizations.id, organizationId));

        if (!org) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Organization not found.',
                success: false,
            });
        }

        const orgCode = org.code;

        const {
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
        } = req.body;

        const currentYear = new Date(joiningDate).getFullYear();

        // Perform inserts inside a transaction to ensure atomic execution
        const registeredData = await db.transaction(async (tx) => {
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
                const [existingUser] = await tx
                    .select()
                    .from(users)
                    .where(eq(users.email, workEmail));
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
                        profilePicture ||
                        'https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg',
                    role: 'employee',
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

            // 9. Log audit log
            await tx.insert(auditLogs).values({
                organizationId,
                actorUserId: req.user.id,
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
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
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

        // 11. Send Welcome Email
        const emailToUse = email || registeredData.workEmail;
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #2c3e50; text-align: center;">Welcome to Dayflow</h2>
                <p>Dear ${firstName},</p>
                <p>Your employee profile has been created successfully. You can now access the portal using the credentials below.</p>
                <div style="background-color: #f7f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>System-Generated Login ID (Employee ID):</strong> <code style="background-color: #eef1f5; padding: 2px 6px; border-radius: 4px;">${registeredData.empCode}</code></p>
                    <p style="margin: 5px 0;"><strong>Work Email:</strong> ${registeredData.workEmail}</p>
                    <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <code style="background-color: #eef1f5; padding: 2px 6px; border-radius: 4px;">${registeredData.tempPassword}</code></p>
                </div>
                <p style="color: #e74c3c;"><strong>Note:</strong> You will be required to change this temporary password upon your first login.</p>
                <p style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.SERVER_URL || 'http://localhost:5173'}" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Portal</a>
                </p>
                <hr style="border: 0; border-top: 1px solid #e0e0e0; margin-top: 30px;">
                <p style="font-size: 12px; color: #7f8c8d; text-align: center;">This is an automated message. Please do not reply directly to this email.</p>
            </div>
        `;

        try {
            await sendEmail({
                to: emailToUse,
                subject: 'Welcome to Dayflow - Your Account Credentials',
                html: emailHtml,
                text: `Welcome to Dayflow!\n\nYour Employee ID is: ${registeredData.empCode}\nWork Email: ${registeredData.workEmail}\nTemporary Password: ${registeredData.tempPassword}\n\nPlease change your password on first login.`,
            });
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
        }

        return sendResponse({
            res,
            statusCode: 201,
            message: 'Employee created successfully.',
            success: true,
            data: {
                employee: {
                    id: registeredData.newEmployee.id,
                    employeeCode: registeredData.newEmployee.employeeCode,
                    firstName: registeredData.newEmployee.firstName,
                    lastName: registeredData.newEmployee.lastName,
                    displayName: registeredData.newEmployee.displayName,
                    workEmail: registeredData.newEmployee.workEmail,
                    joiningDate: registeredData.newEmployee.joiningDate,
                    employmentStatus: registeredData.newEmployee.employmentStatus,
                    employmentType: registeredData.newEmployee.employmentType,
                },
                user: {
                    id: registeredData.newUser.id,
                    email: registeredData.newUser.email,
                    role: registeredData.newUser.role,
                },
                credentials: {
                    loginId: registeredData.empCode,
                    workEmail: registeredData.workEmail,
                    temporaryPassword: registeredData.tempPassword,
                },
            },
        });
    } catch (error) {
        next(error);
    }
}

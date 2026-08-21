import { sendResponse } from '../../../utils/response.utlis.js';
import { sendEmail } from '../../../services/mail/mail.service.js';
import { getOrganizationById } from '../../../dao/organization.dao.js';
import { createEmployeeTx } from '../../../dao/employee.dao.js';

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

        const org = await getOrganizationById(organizationId);
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

        const registeredData = await createEmployeeTx({
            organizationId,
            orgCode,
            firstName,
            lastName,
            email,
            phone,
            profilePicture,
            departmentId,
            jobPositionId,
            managerId,
            joiningDate,
            locationId,
            employmentType,
            workScheduleId,
            actorUserId: req.user.id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        // Send Welcome Email
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

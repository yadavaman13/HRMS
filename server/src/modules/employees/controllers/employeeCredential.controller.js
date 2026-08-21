import * as employeeDao from '../../../dao/employee.dao.js';
import { generateTemporaryPassword } from '../../../utils/auth.utils.js';
import { sendEmail } from '../../../services/mail/mail.service.js';
import { sendResponse } from '../../../utils/response.utlis.js';
import bcrypt from 'bcryptjs';

/**
 * Activate employee account (Admin/HR only)
 */
export async function activateAccount(req, res, next) {
    try {
        const employeeId = req.params.employeeId || req.params.id;
        const result = await employeeDao.updateEmployeeStatus(
            employeeId,
            true, // isActive
            req.user.id,
            req.ip,
            req.headers['user-agent'],
        );

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Employee account activated successfully.',
            success: true,
            data: {
                employeeId: result.employee.id,
                userId: result.user.id,
                isActive: result.user.isActive,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Deactivate employee account (Admin/HR only)
 */
export async function deactivateAccount(req, res, next) {
    try {
        const employeeId = req.params.employeeId || req.params.id;
        const result = await employeeDao.updateEmployeeStatus(
            employeeId,
            false, // isActive
            req.user.id,
            req.ip,
            req.headers['user-agent'],
        );

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Employee account deactivated successfully.',
            success: true,
            data: {
                employeeId: result.employee.id,
                userId: result.user.id,
                isActive: result.user.isActive,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Reset employee password to a new system-generated temporary password (Admin/HR only)
 */
export async function resetPassword(req, res, next) {
    try {
        const employeeId = req.params.employeeId || req.params.id;
        const employee = await employeeDao.getEmployeeById(employeeId);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee not found',
                success: false,
            });
        }

        const tempPassword = generateTemporaryPassword(employee.workEmail);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const result = await employeeDao.resetEmployeePassword(
            employeeId,
            hashedPassword,
            req.user.id,
            req.ip,
            req.headers['user-agent'],
        );

        // Send reset email to work email
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #2c3e50; text-align: center;">Password Reset Request</h2>
                <p>Dear ${employee.firstName},</p>
                <p>Your password has been reset by the administrator. Use the new temporary password below to log in:</p>
                <div style="background-color: #f7f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Employee ID (Login ID):</strong> <code style="background-color: #eef1f5; padding: 2px 6px; border-radius: 4px;">${employee.employeeCode}</code></p>
                    <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <code style="background-color: #eef1f5; padding: 2px 6px; border-radius: 4px;">${tempPassword}</code></p>
                </div>
                <p style="color: #e74c3c;"><strong>Note:</strong> You will be required to change this temporary password upon logging in.</p>
                <hr style="border: 0; border-top: 1px solid #e0e0e0; margin-top: 30px;">
                <p style="font-size: 12px; color: #7f8c8d; text-align: center;">This is an automated message. Please do not reply directly to this email.</p>
            </div>
        `;

        try {
            await sendEmail({
                to: employee.workEmail,
                subject: 'Dayflow Password Reset - Temporary Credentials',
                html: emailHtml,
                text: `Hello ${employee.firstName},\n\nYour temporary password is: ${tempPassword}\n\nPlease change your password on login.`,
            });
        } catch (emailError) {
            console.error('Failed to send reset email:', emailError);
        }

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Employee password reset successfully.',
            success: true,
            data: {
                employeeId: result.employee.id,
                userId: result.user.id,
                temporaryPassword: tempPassword, // Return for convenience/testing if needed
            },
        });
    } catch (error) {
        next(error);
    }
}

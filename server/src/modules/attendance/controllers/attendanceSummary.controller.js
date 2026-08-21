import * as attendanceDao from '../../../dao/attendance.dao.js';
import { sendResponse } from '../../../utils/response.utlis.js';

/**
 * Get organization-wide attendance summary & metrics (Admin/HR)
 */
export async function getCompanySummary(req, res, next) {
    try {
        const { date, departmentId } = req.query;
        const targetDate = date || new Date().toISOString().split('T')[0];

        const summary = await attendanceDao.getCompanyAttendanceSummary(
            req.user.organizationId,
            targetDate,
            departmentId || null,
        );

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Company attendance summary retrieved',
            success: true,
            data: summary,
        });
    } catch (error) {
        next(error);
    }
}

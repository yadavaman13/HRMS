import * as attendanceDao from '../../../dao/attendance.dao.js';
import { getEmployeeByUserId, getEmployeeById } from '../../../dao/employee.dao.js';
import {
    calculateSessionWorkedMinutes,
    calculateShiftMetrics,
} from '../../../utils/attendance.utils.js';
import { sendResponse } from '../../../utils/response.utlis.js';

/**
 * Employee Check-In (Punch In)
 */
export async function checkIn(req, res, next) {
    try {
        const employee = await getEmployeeByUserId(req.user.id);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee profile not found for the authenticated user',
                success: false,
            });
        }

        const checkInAt = req.body?.checkInTime ? new Date(req.body.checkInTime) : new Date();
        const attendanceDate = checkInAt.toISOString().split('T')[0];

        // 1. Get or create today's attendance record
        let record = await attendanceDao.getAttendanceRecordByEmployeeAndDate(
            employee.id,
            attendanceDate,
        );

        if (!record) {
            // Check shift schedule for default scheduled work minutes
            const schedule = await attendanceDao.getEmployeeActiveSchedule(
                employee.id,
                employee.organizationId,
                attendanceDate,
            );

            let scheduledWorkMinutes = 480;
            if (
                schedule?.scheduleDay?.isWorkingDay &&
                schedule.scheduleDay.startTime &&
                schedule.scheduleDay.endTime
            ) {
                const [sH, sM] = schedule.scheduleDay.startTime.split(':').map(Number);
                const [eH, eM] = schedule.scheduleDay.endTime.split(':').map(Number);
                const rawShift = eH * 60 + eM - (sH * 60 + sM);
                scheduledWorkMinutes = Math.max(
                    0,
                    rawShift - (Number(schedule.scheduleDay.breakMinutes) || 0),
                );
            }

            record = await attendanceDao.createAttendanceRecord({
                employeeId: employee.id,
                attendanceDate,
                status: 'present',
                scheduledWorkMinutes,
                source: 'system',
                remarks: req.body?.remarks || null,
            });
        }

        // 2. Check for active unclosed session
        const activeSession = await attendanceDao.getActiveSession(record.id);
        if (activeSession) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'Active check-in session already in progress. Please check out first.',
                success: false,
                data: { activeSession },
            });
        }

        // 3. Create new check-in session
        const session = await attendanceDao.createAttendanceSession({
            attendanceRecordId: record.id,
            checkInAt,
            breakMinutes: 0,
        });

        // 4. Ensure record status is at least 'present'
        if (record.status === 'absent' || record.status === 'incomplete') {
            record = await attendanceDao.updateAttendanceRecord(record.id, {
                status: 'present',
            });
        }

        return sendResponse({
            res,
            statusCode: 201,
            message: 'Checked in successfully',
            success: true,
            data: {
                record,
                session,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Employee Check-Out (Punch Out)
 */
export async function checkOut(req, res, next) {
    try {
        const employee = await getEmployeeByUserId(req.user.id);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee profile not found for the authenticated user',
                success: false,
            });
        }

        const checkOutAt = req.body?.checkOutTime ? new Date(req.body.checkOutTime) : new Date();
        const attendanceDate = checkOutAt.toISOString().split('T')[0];
        const breakMinutes = Number(req.body?.breakMinutes) || 0;

        // 1. Get attendance record for today
        const record = await attendanceDao.getAttendanceRecordByEmployeeAndDate(
            employee.id,
            attendanceDate,
        );

        if (!record) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'No attendance record found for today. Please check in first.',
                success: false,
            });
        }

        // 2. Find the active session
        const activeSession = await attendanceDao.getActiveSession(record.id);
        if (!activeSession) {
            return sendResponse({
                res,
                statusCode: 400,
                message: 'No active check-in session found to check out from.',
                success: false,
            });
        }

        // 3. Close the session and calculate worked minutes
        const workedMinutes = calculateSessionWorkedMinutes(
            activeSession.checkInAt,
            checkOutAt,
            breakMinutes,
        );

        const updatedSession = await attendanceDao.updateAttendanceSession(activeSession.id, {
            checkOutAt,
            breakMinutes,
            workedMinutes,
        });

        // 4. Fetch all sessions for this record to recalculate daily totals
        const allSessions = await attendanceDao.getSessionsByRecordId(record.id);

        // 5. Fetch shift schedule
        const schedule = await attendanceDao.getEmployeeActiveSchedule(
            employee.id,
            employee.organizationId,
            attendanceDate,
        );

        // 6. Calculate day metrics
        const metrics = calculateShiftMetrics({
            sessions: allSessions,
            shiftScheduleDay: schedule?.scheduleDay || null,
        });

        const updatedRecord = await attendanceDao.updateAttendanceRecord(record.id, {
            totalWorkMinutes: metrics.totalWorkMinutes,
            scheduledWorkMinutes: metrics.scheduledWorkMinutes,
            overtimeMinutes: metrics.overtimeMinutes,
            lateMinutes: metrics.lateMinutes,
            earlyCheckoutMinutes: metrics.earlyCheckoutMinutes,
            status: metrics.status,
            remarks: req.body?.remarks || record.remarks,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Checked out successfully',
            success: true,
            data: {
                record: updatedRecord,
                session: updatedSession,
                metrics,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get current employee's attendance records (with date/month filtering)
 */
export async function getMyAttendance(req, res, next) {
    try {
        const employee = await getEmployeeByUserId(req.user.id);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee profile not found',
                success: false,
            });
        }

        let { startDate, endDate, month, year, status, limit, offset } = req.query;

        if (month) {
            const [mYear, mMonth] = month.split('-').map(Number);
            const daysInMonth = new Date(mYear, mMonth, 0).getDate();
            startDate = `${month}-01`;
            endDate = `${month}-${String(daysInMonth).padStart(2, '0')}`;
        } else if (year && !startDate && !endDate) {
            startDate = `${year}-01-01`;
            endDate = `${year}-12-31`;
        }

        const result = await attendanceDao.getAttendanceRecords({
            employeeId: employee.id,
            startDate,
            endDate,
            status,
            limit: limit ? +limit : 50,
            offset: offset ? +offset : 0,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Attendance records retrieved',
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get current employee's monthly summary and statistics
 */
export async function getMySummary(req, res, next) {
    try {
        const employee = await getEmployeeByUserId(req.user.id);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee profile not found',
                success: false,
            });
        }

        let { month, year } = req.query;
        const now = new Date();
        const selectedYear = year ? +year : now.getFullYear();
        const selectedMonth = month
            ? month
            : `${selectedYear}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const [y, m] = selectedMonth.split('-').map(Number);
        const daysInMonth = new Date(y, m, 0).getDate();
        const startDate = `${selectedMonth}-01`;
        const endDate = `${selectedMonth}-${String(daysInMonth).padStart(2, '0')}`;

        const summary = await attendanceDao.getEmployeeAttendanceSummary(
            employee.id,
            startDate,
            endDate,
        );

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Attendance monthly summary retrieved',
            success: true,
            data: {
                month: selectedMonth,
                startDate,
                endDate,
                ...summary,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get all attendance records (Admin / HR oversight)
 */
export async function getAttendanceRecords(req, res, next) {
    try {
        let { startDate, endDate, date, month, status, departmentId, employeeId, limit, offset } =
            req.query;

        if (month) {
            const [mYear, mMonth] = month.split('-').map(Number);
            const daysInMonth = new Date(mYear, mMonth, 0).getDate();
            startDate = `${month}-01`;
            endDate = `${month}-${String(daysInMonth).padStart(2, '0')}`;
        }

        const data = await attendanceDao.getAttendanceRecords({
            organizationId: req.user.organizationId,
            employeeId,
            date,
            startDate,
            endDate,
            status,
            departmentId,
            limit: limit ? +limit : 50,
            offset: offset ? +offset : 0,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Attendance records retrieved',
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get a single attendance record by ID (with sessions and adjustments)
 */
export async function getAttendanceById(req, res, next) {
    try {
        const { attendanceId } = req.params;
        const record = await attendanceDao.getAttendanceRecordById(attendanceId);

        if (!record) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Attendance record not found',
                success: false,
            });
        }

        // Authorization check: User can view if Admin/HR or the record belongs to the user
        if (req.user.role === 'employee' || req.user.role === 'user') {
            const myEmployee = await getEmployeeByUserId(req.user.id);
            if (!myEmployee || myEmployee.id !== record.employeeId) {
                return sendResponse({
                    res,
                    statusCode: 403,
                    message: 'You do not have permission to view this attendance record',
                    success: false,
                });
            }
        }

        const sessions = await attendanceDao.getSessionsByRecordId(attendanceId);
        const adjustments = await attendanceDao.getAdjustments({
            employeeId: record.employeeId,
        });

        return sendResponse({
            res,
            statusCode: 200,
            message: 'Attendance record retrieved',
            success: true,
            data: {
                ...record,
                sessions,
                adjustments: adjustments.adjustments.filter(
                    (a) => a.attendanceRecordId === attendanceId,
                ),
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get attendance records for a specific employee (Admin / HR)
 */
export async function getEmployeeAttendance(req, res, next) {
    try {
        const { employeeId } = req.params;
        const employee = await getEmployeeById(employeeId);
        if (!employee) {
            return sendResponse({
                res,
                statusCode: 404,
                message: 'Employee not found',
                success: false,
            });
        }

        let { startDate, endDate, month, year, status, limit, offset } = req.query;

        if (month) {
            const [mYear, mMonth] = month.split('-').map(Number);
            const daysInMonth = new Date(mYear, mMonth, 0).getDate();
            startDate = `${month}-01`;
            endDate = `${month}-${String(daysInMonth).padStart(2, '0')}`;
        } else if (year && !startDate && !endDate) {
            startDate = `${year}-01-01`;
            endDate = `${year}-12-31`;
        }

        const result = await attendanceDao.getAttendanceRecords({
            organizationId: req.user.organizationId,
            employeeId,
            startDate,
            endDate,
            status,
            limit: limit ? +limit : 50,
            offset: offset ? +offset : 0,
        });

        const summary = await attendanceDao.getEmployeeAttendanceSummary(
            employeeId,
            startDate,
            endDate,
        );

        return sendResponse({
            res,
            statusCode: 200,
            message: `Attendance records for ${employee.displayName} retrieved`,
            success: true,
            data: {
                employee: {
                    id: employee.id,
                    employeeCode: employee.employeeCode,
                    displayName: employee.displayName,
                    workEmail: employee.workEmail,
                },
                summary,
                ...result,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Export attendance timesheets as CSV (Admin/HR or Employee self-export)
 */
export async function exportAttendance(req, res, next) {
    try {
        let { startDate, endDate, month, status, departmentId, employeeId } = req.query;

        // If not Admin/HR, scope to employee's own record
        if (req.user.role !== 'admin' && req.user.role !== 'hr') {
            const employee = await getEmployeeByUserId(req.user.id);
            if (!employee) {
                return sendResponse({
                    res,
                    statusCode: 404,
                    message: 'No employee record linked to this user account',
                    success: false,
                });
            }
            employeeId = employee.id;
        }

        if (month) {
            let mYear, mMonth;
            if (String(month).includes('-')) {
                [mYear, mMonth] = String(month).split('-').map(Number);
            } else {
                mMonth = Number(month);
                mYear = Number(req.query.year) || new Date().getFullYear();
            }
            const daysInMonth = new Date(mYear, mMonth, 0).getDate();
            const padMonth = String(mMonth).padStart(2, '0');
            startDate = `${mYear}-${padMonth}-01`;
            endDate = `${mYear}-${padMonth}-${String(daysInMonth).padStart(2, '0')}`;
        }

        const data = await attendanceDao.getAttendanceRecords({
            organizationId: req.user.organizationId,
            employeeId,
            startDate,
            endDate,
            status,
            departmentId,
            limit: 5000,
            offset: 0,
        });

        const records = data.records || [];

        // Build CSV string
        const headers = [
            'Employee Code',
            'Employee Name',
            'Work Email',
            'Department',
            'Date',
            'Status',
            'Work Hours',
            'Overtime Hours',
            'Late (Minutes)',
            'Early Checkout (Minutes)',
            'Source',
            'Remarks',
        ];

        const escapeCsv = (val) => {
            if (val === null || val === undefined) return '""';
            const str = String(val).replace(/"/g, '""');
            return `"${str}"`;
        };

        const rows = records.map((r) => [
            escapeCsv(r.employeeCode),
            escapeCsv(r.displayName || `${r.firstName || ''} ${r.lastName || ''}`.trim()),
            escapeCsv(r.workEmail),
            escapeCsv(r.departmentName || 'N/A'),
            escapeCsv(r.attendanceDate),
            escapeCsv(r.status),
            escapeCsv(((r.totalWorkMinutes || 0) / 60).toFixed(2)),
            escapeCsv(((r.overtimeMinutes || 0) / 60).toFixed(2)),
            escapeCsv(r.lateMinutes || 0),
            escapeCsv(r.earlyCheckoutMinutes || 0),
            escapeCsv(r.source || 'system'),
            escapeCsv(r.remarks || ''),
        ]);

        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

        const fileName = `attendance-export-${startDate || 'all'}-to-${endDate || 'now'}.csv`;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        return res.status(200).send(csvContent);
    } catch (error) {
        next(error);
    }
}

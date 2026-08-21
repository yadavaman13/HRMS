/**
 * Utility functions for Attendance business calculations, time conversions,
 * shift evaluation, and status determinations.
 */

/**
 * Calculates duration in minutes between two dates/timestamps, minus breaks.
 *
 * @param {Date|string} checkInAt
 * @param {Date|string} checkOutAt
 * @param {number} [breakMinutes=0]
 * @returns {number} net worked minutes (non-negative integer)
 */
export function calculateSessionWorkedMinutes(checkInAt, checkOutAt, breakMinutes = 0) {
    if (!checkInAt || !checkOutAt) return 0;
    const start = new Date(checkInAt).getTime();
    const end = new Date(checkOutAt).getTime();
    if (isNaN(start) || isNaN(end) || end < start) return 0;

    const diffMinutes = Math.round((end - start) / (1000 * 60));
    const breakDeduction = Math.max(0, Number(breakMinutes) || 0);
    return Math.max(0, diffMinutes - breakDeduction);
}

/**
 * Converts a time string "HH:MM:SS" or "HH:MM" on a given date to a Date object.
 *
 * @param {string} dateStr - 'YYYY-MM-DD'
 * @param {string} timeStr - 'HH:MM:SS' or 'HH:MM'
 * @returns {Date|null}
 */
export function parseDateTime(dateStr, timeStr) {
    if (!dateStr || !timeStr) return null;
    const [hours, minutes, seconds] = timeStr.split(':').map((v) => parseInt(v, 10) || 0);
    const d = new Date(dateStr);
    d.setHours(hours, minutes, seconds || 0, 0);
    return d;
}

/**
 * Evaluates shift metrics and status for an attendance day.
 *
 * @param {object} params
 * @param {Array<{checkInAt: Date|string, checkOutAt?: Date|string, workedMinutes?: number, breakMinutes?: number}>} params.sessions
 * @param {object|null} params.shiftScheduleDay - { startTime, endTime, breakMinutes, isWorkingDay }
 * @param {number} [params.halfDayThresholdRatio=0.5]
 * @returns {object} { totalWorkMinutes, scheduledWorkMinutes, overtimeMinutes, lateMinutes, earlyCheckoutMinutes, status }
 */
export function calculateShiftMetrics({
    sessions = [],
    shiftScheduleDay = null,
    halfDayThresholdRatio = 0.5,
}) {
    // 1. Calculate total worked minutes across all completed/active sessions
    let totalWorkMinutes = 0;
    let firstCheckIn = null;
    let lastCheckOut = null;

    for (const session of sessions) {
        if (session.workedMinutes !== null && session.workedMinutes !== undefined) {
            totalWorkMinutes += Number(session.workedMinutes) || 0;
        } else if (session.checkInAt && session.checkOutAt) {
            totalWorkMinutes += calculateSessionWorkedMinutes(
                session.checkInAt,
                session.checkOutAt,
                session.breakMinutes || 0,
            );
        }

        if (session.checkInAt) {
            const checkInDate = new Date(session.checkInAt);
            if (!firstCheckIn || checkInDate < firstCheckIn) {
                firstCheckIn = checkInDate;
            }
        }

        if (session.checkOutAt) {
            const checkOutDate = new Date(session.checkOutAt);
            if (!lastCheckOut || checkOutDate > lastCheckOut) {
                lastCheckOut = checkOutDate;
            }
        }
    }

    // 2. Scheduled Work Minutes
    let scheduledWorkMinutes = 480; // Default 8 hours (480 minutes) if no shift specified
    let lateMinutes = 0;
    let earlyCheckoutMinutes = 0;

    if (shiftScheduleDay && shiftScheduleDay.isWorkingDay) {
        if (shiftScheduleDay.startTime && shiftScheduleDay.endTime) {
            const [startH, startM] = shiftScheduleDay.startTime.split(':').map(Number);
            const [endH, endM] = shiftScheduleDay.endTime.split(':').map(Number);
            const rawShiftMinutes = endH * 60 + endM - (startH * 60 + startM);
            const breakM = Number(shiftScheduleDay.breakMinutes) || 0;
            scheduledWorkMinutes = Math.max(0, rawShiftMinutes - breakM);

            // Calculate Late Minutes from first check-in
            if (firstCheckIn) {
                const checkInMinutesOfDay =
                    firstCheckIn.getHours() * 60 + firstCheckIn.getMinutes();
                const scheduledStartMinutesOfDay = startH * 60 + startM;
                if (checkInMinutesOfDay > scheduledStartMinutesOfDay) {
                    lateMinutes = checkInMinutesOfDay - scheduledStartMinutesOfDay;
                }
            }

            // Calculate Early Checkout Minutes from last check-out
            if (lastCheckOut) {
                const checkOutMinutesOfDay =
                    lastCheckOut.getHours() * 60 + lastCheckOut.getMinutes();
                const scheduledEndMinutesOfDay = endH * 60 + endM;
                if (checkOutMinutesOfDay < scheduledEndMinutesOfDay) {
                    earlyCheckoutMinutes = scheduledEndMinutesOfDay - checkOutMinutesOfDay;
                }
            }
        }
    }

    // 3. Overtime: max(0, totalWorkMinutes - scheduledWorkMinutes)
    const overtimeMinutes = Math.max(0, totalWorkMinutes - scheduledWorkMinutes);

    // 4. Status Determination
    let status;
    const halfDayMinutes = Math.round(scheduledWorkMinutes * halfDayThresholdRatio);

    if (totalWorkMinutes >= scheduledWorkMinutes) {
        status = 'present';
    } else if (totalWorkMinutes >= halfDayMinutes) {
        status = 'half_day';
    } else if (totalWorkMinutes > 0) {
        status = 'incomplete';
    } else {
        status = 'absent';
    }

    return {
        totalWorkMinutes,
        scheduledWorkMinutes,
        overtimeMinutes,
        lateMinutes,
        earlyCheckoutMinutes,
        status,
    };
}

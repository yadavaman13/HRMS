/**
 * Leave Calculation and Validation Utilities
 */

/**
 * Formats a Date object to 'YYYY-MM-DD' in local/UTC date string
 * @param {Date|string} d
 * @returns {string}
 */
export function formatDate(d) {
    if (typeof d === 'string') return d.split('T')[0];
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Generates an array of date strings between startDate and endDate inclusive.
 * @param {string} startDate - 'YYYY-MM-DD'
 * @param {string} endDate - 'YYYY-MM-DD'
 * @returns {string[]}
 */
export function getDateRangeArray(startDate, endDate) {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
        dates.push(formatDate(current));
        current.setDate(current.getDate() + 1);
    }
    return dates;
}

/**
 * Calculates net working days for a leave application taking into account
 * employee schedule weekly offs, organization holidays, and half-day boundary flags.
 *
 * @param {object} params
 * @param {string} params.startDate - 'YYYY-MM-DD'
 * @param {string} params.endDate - 'YYYY-MM-DD'
 * @param {'none'|'first_half'|'second_half'} [params.startHalf='none']
 * @param {'none'|'first_half'|'second_half'} [params.endHalf='none']
 * @param {Array<{weekday: number, isWorkingDay: boolean}>} [params.scheduleDays=[]] - 0 (Sun) to 6 (Sat)
 * @param {Array<{holidayDate: string}>} [params.holidays=[]]
 * @returns {{ totalDays: number, workingDates: string[], breakdown: Array<{ date: string, weekday: number, isWorkingDay: boolean, isHoliday: boolean, dayFraction: number }> }}
 */
export function calculateLeaveWorkingDays({
    startDate,
    endDate,
    startHalf = 'none',
    endHalf = 'none',
    scheduleDays = [],
    holidays = [],
}) {
    if (!startDate || !endDate) {
        return { totalDays: 0, workingDates: [], breakdown: [] };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
        return { totalDays: 0, workingDates: [], breakdown: [] };
    }

    // Build map of schedule working days: weekday (0-6) -> isWorkingDay (boolean)
    const scheduleMap = new Map();
    if (scheduleDays && scheduleDays.length > 0) {
        for (const sd of scheduleDays) {
            scheduleMap.set(Number(sd.weekday), Boolean(sd.isWorkingDay));
        }
    } else {
        // Default: Monday(1) - Friday(5) are working days
        for (let i = 0; i <= 6; i++) {
            scheduleMap.set(i, i >= 1 && i <= 5);
        }
    }

    // Build holiday date set
    const holidaySet = new Set();
    if (holidays && holidays.length > 0) {
        for (const h of holidays) {
            const hDate = typeof h === 'string' ? h : h.holidayDate;
            if (hDate) holidaySet.add(formatDate(hDate));
        }
    }

    const dateRange = getDateRangeArray(startDate, endDate);
    const isSingleDay = startDate === endDate;
    const breakdown = [];
    const workingDates = [];
    let totalDays = 0;

    for (let i = 0; i < dateRange.length; i++) {
        const currentDateStr = dateRange[i];
        const currentDate = new Date(currentDateStr);
        const weekday = currentDate.getDay(); // 0 = Sun, 6 = Sat

        const isScheduleWorking = scheduleMap.has(weekday)
            ? scheduleMap.get(weekday)
            : weekday >= 1 && weekday <= 5;
        const isHoliday = holidaySet.has(currentDateStr);
        const isWorking = isScheduleWorking && !isHoliday;

        let dayFraction = 0;

        if (isWorking) {
            if (isSingleDay) {
                if (startHalf !== 'none' || endHalf !== 'none') {
                    dayFraction = 0.5;
                } else {
                    dayFraction = 1.0;
                }
            } else {
                if (i === 0 && startHalf !== 'none') {
                    dayFraction = 0.5;
                } else if (i === dateRange.length - 1 && endHalf !== 'none') {
                    dayFraction = 0.5;
                } else {
                    dayFraction = 1.0;
                }
            }
            workingDates.push(currentDateStr);
        }

        totalDays += dayFraction;

        breakdown.push({
            date: currentDateStr,
            weekday,
            isWorkingDay: isScheduleWorking,
            isHoliday,
            dayFraction,
        });
    }

    return {
        totalDays: Number(totalDays.toFixed(2)),
        workingDates,
        breakdown,
    };
}

/**
 * Checks whether a given date range overlaps with any existing leave request.
 *
 * @param {Array<{startDate: string, endDate: string, status: string, id: string}>} existingRequests
 * @param {string} startDate
 * @param {string} endDate
 * @param {string|null} [excludeRequestId=null]
 * @returns {object|null} The conflicting leave request or null
 */
export function findOverlappingLeave(
    existingRequests = [],
    startDate,
    endDate,
    excludeRequestId = null,
) {
    const targetStart = new Date(startDate);
    const targetEnd = new Date(endDate);

    for (const req of existingRequests) {
        if (excludeRequestId && req.id === excludeRequestId) continue;
        if (req.status === 'rejected' || req.status === 'cancelled') continue;

        const reqStart = new Date(req.startDate);
        const reqEnd = new Date(req.endDate);

        // Standard date range overlap condition: StartA <= EndB && EndA >= StartB
        if (targetStart <= reqEnd && targetEnd >= reqStart) {
            return req;
        }
    }
    return null;
}

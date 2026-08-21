import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
    calculateSessionWorkedMinutes,
    parseDateTime,
    calculateShiftMetrics,
} from '../../utils/attendance.utils.js';

describe('Attendance Calculation Utilities', () => {
    describe('calculateSessionWorkedMinutes', () => {
        test('calculates exact difference in minutes between check-in and check-out', () => {
            const checkIn = '2026-08-21T09:00:00.000Z';
            const checkOut = '2026-08-21T18:00:00.000Z';
            const minutes = calculateSessionWorkedMinutes(checkIn, checkOut, 0);
            assert.equal(minutes, 540); // 9 hours = 540 minutes
        });

        test('deducts break minutes properly', () => {
            const checkIn = '2026-08-21T09:00:00.000Z';
            const checkOut = '2026-08-21T18:00:00.000Z';
            const minutes = calculateSessionWorkedMinutes(checkIn, checkOut, 60);
            assert.equal(minutes, 480); // 540 - 60 = 480 minutes (8 hours net)
        });

        test('returns 0 if checkOut is before checkIn', () => {
            const checkIn = '2026-08-21T18:00:00.000Z';
            const checkOut = '2026-08-21T09:00:00.000Z';
            const minutes = calculateSessionWorkedMinutes(checkIn, checkOut, 0);
            assert.equal(minutes, 0);
        });

        test('returns 0 for null or invalid timestamps', () => {
            assert.equal(calculateSessionWorkedMinutes(null, '2026-08-21T18:00:00.000Z'), 0);
            assert.equal(calculateSessionWorkedMinutes('2026-08-21T09:00:00.000Z', null), 0);
            assert.equal(calculateSessionWorkedMinutes('invalid-date', 'another-invalid'), 0);
        });

        test('handles break minutes greater than total worked time without negative values', () => {
            const checkIn = '2026-08-21T09:00:00.000Z';
            const checkOut = '2026-08-21T09:30:00.000Z'; // 30 minutes
            const minutes = calculateSessionWorkedMinutes(checkIn, checkOut, 60);
            assert.equal(minutes, 0);
        });
    });

    describe('parseDateTime', () => {
        test('parses date and time string into a valid Date object', () => {
            const date = parseDateTime('2026-08-21', '09:30:00');
            assert.ok(date instanceof Date);
            assert.equal(date.getFullYear(), 2026);
            assert.equal(date.getHours(), 9);
            assert.equal(date.getMinutes(), 30);
        });

        test('returns null for missing inputs', () => {
            assert.equal(parseDateTime(null, '09:00:00'), null);
            assert.equal(parseDateTime('2026-08-21', null), null);
        });
    });

    describe('calculateShiftMetrics & Status Determination', () => {
        const standardShift = {
            startTime: '09:00:00',
            endTime: '18:00:00',
            breakMinutes: 60,
            isWorkingDay: true,
        };

        test('evaluates status as PRESENT when worked minutes meet scheduled hours', () => {
            const sessions = [
                {
                    checkInAt: '2026-08-21T09:00:00.000Z',
                    checkOutAt: '2026-08-21T18:00:00.000Z',
                    breakMinutes: 60,
                    workedMinutes: 480, // 8 hours net
                },
            ];

            const metrics = calculateShiftMetrics({
                sessions,
                shiftScheduleDay: standardShift,
            });

            assert.equal(metrics.totalWorkMinutes, 480);
            assert.equal(metrics.scheduledWorkMinutes, 480);
            assert.equal(metrics.overtimeMinutes, 0);
            assert.equal(metrics.status, 'present');
        });

        test('calculates OVERTIME when worked minutes exceed scheduled shift hours', () => {
            const sessions = [
                {
                    checkInAt: '2026-08-21T09:00:00.000Z',
                    checkOutAt: '2026-08-21T20:00:00.000Z',
                    breakMinutes: 60,
                    workedMinutes: 600, // 10 hours net
                },
            ];

            const metrics = calculateShiftMetrics({
                sessions,
                shiftScheduleDay: standardShift,
            });

            assert.equal(metrics.totalWorkMinutes, 600);
            assert.equal(metrics.scheduledWorkMinutes, 480);
            assert.equal(metrics.overtimeMinutes, 120); // 2 hours overtime
            assert.equal(metrics.status, 'present');
        });

        test('evaluates status as HALF_DAY when worked >= 50% of scheduled hours but < 100%', () => {
            const sessions = [
                {
                    checkInAt: '2026-08-21T09:00:00.000Z',
                    checkOutAt: '2026-08-21T14:00:00.000Z',
                    breakMinutes: 0,
                    workedMinutes: 300, // 5 hours net
                },
            ];

            const metrics = calculateShiftMetrics({
                sessions,
                shiftScheduleDay: standardShift,
            });

            assert.equal(metrics.totalWorkMinutes, 300);
            assert.equal(metrics.status, 'half_day');
            assert.equal(metrics.overtimeMinutes, 0);
        });

        test('evaluates status as INCOMPLETE when worked < 50% of scheduled hours', () => {
            const sessions = [
                {
                    checkInAt: '2026-08-21T09:00:00.000Z',
                    checkOutAt: '2026-08-21T11:00:00.000Z',
                    breakMinutes: 0,
                    workedMinutes: 120, // 2 hours net (< 240 min half day)
                },
            ];

            const metrics = calculateShiftMetrics({
                sessions,
                shiftScheduleDay: standardShift,
            });

            assert.equal(metrics.totalWorkMinutes, 120);
            assert.equal(metrics.status, 'incomplete');
        });

        test('evaluates status as ABSENT when 0 minutes worked', () => {
            const metrics = calculateShiftMetrics({
                sessions: [],
                shiftScheduleDay: standardShift,
            });

            assert.equal(metrics.totalWorkMinutes, 0);
            assert.equal(metrics.status, 'absent');
        });

        test('aggregates multiple split sessions on the same day', () => {
            const sessions = [
                {
                    checkInAt: '2026-08-21T09:00:00.000Z',
                    checkOutAt: '2026-08-21T13:00:00.000Z',
                    workedMinutes: 240,
                },
                {
                    checkInAt: '2026-08-21T14:00:00.000Z',
                    checkOutAt: '2026-08-21T18:00:00.000Z',
                    workedMinutes: 240,
                },
            ];

            const metrics = calculateShiftMetrics({
                sessions,
                shiftScheduleDay: standardShift,
            });

            assert.equal(metrics.totalWorkMinutes, 480);
            assert.equal(metrics.status, 'present');
        });
    });
});

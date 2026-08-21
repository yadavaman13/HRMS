import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
    calculateLeaveWorkingDays,
    findOverlappingLeave,
    formatDate,
    getDateRangeArray,
} from '../../utils/leave.utils.js';

describe('Leave Management Utilities', () => {
    describe('formatDate & getDateRangeArray', () => {
        test('formats Date object and ISO string to YYYY-MM-DD', () => {
            const d = new Date(2026, 7, 21); // August 21, 2026
            assert.equal(formatDate(d), '2026-08-21');
            assert.equal(formatDate('2026-08-21T10:00:00.000Z'), '2026-08-21');
        });

        test('generates inclusive date range array', () => {
            const dates = getDateRangeArray('2026-08-21', '2026-08-24');
            assert.deepEqual(dates, ['2026-08-21', '2026-08-22', '2026-08-23', '2026-08-24']);
        });
    });

    describe('calculateLeaveWorkingDays', () => {
        // Standard Mon-Fri schedule
        const standardScheduleDays = [
            { weekday: 0, isWorkingDay: false }, // Sunday
            { weekday: 1, isWorkingDay: true }, // Monday
            { weekday: 2, isWorkingDay: true }, // Tuesday
            { weekday: 3, isWorkingDay: true }, // Wednesday
            { weekday: 4, isWorkingDay: true }, // Thursday
            { weekday: 5, isWorkingDay: true }, // Friday
            { weekday: 6, isWorkingDay: false }, // Saturday
        ];

        test('calculates single full working day', () => {
            // 2026-08-21 is Friday (weekday 5)
            const result = calculateLeaveWorkingDays({
                startDate: '2026-08-21',
                endDate: '2026-08-21',
                scheduleDays: standardScheduleDays,
            });

            assert.equal(result.totalDays, 1.0);
            assert.equal(result.workingDates.length, 1);
            assert.equal(result.workingDates[0], '2026-08-21');
        });

        test('calculates single half-day leave', () => {
            // Friday half-day
            const result = calculateLeaveWorkingDays({
                startDate: '2026-08-21',
                endDate: '2026-08-21',
                startHalf: 'first_half',
                scheduleDays: standardScheduleDays,
            });

            assert.equal(result.totalDays, 0.5);
            assert.equal(result.workingDates.length, 1);
        });

        test('excludes weekend days across a multi-day span', () => {
            // 2026-08-21 (Fri) to 2026-08-24 (Mon) -> Fri + Mon = 2 working days (Sat & Sun excluded)
            const result = calculateLeaveWorkingDays({
                startDate: '2026-08-21',
                endDate: '2026-08-24',
                scheduleDays: standardScheduleDays,
            });

            assert.equal(result.totalDays, 2.0);
            assert.deepEqual(result.workingDates, ['2026-08-21', '2026-08-24']);
        });

        test('excludes organization holidays from working days', () => {
            // 2026-08-21 (Fri) to 2026-08-25 (Tue) -> 3 working days (Fri, Mon, Tue)
            // If Monday 2026-08-24 is a Holiday -> 2 working days (Fri, Tue)
            const holidays = [{ holidayDate: '2026-08-24' }];

            const result = calculateLeaveWorkingDays({
                startDate: '2026-08-21',
                endDate: '2026-08-25',
                scheduleDays: standardScheduleDays,
                holidays,
            });

            assert.equal(result.totalDays, 2.0);
            assert.deepEqual(result.workingDates, ['2026-08-21', '2026-08-25']);
        });

        test('handles half-day start and half-day end across multi-day span', () => {
            // 2026-08-17 (Mon) to 2026-08-19 (Wed): 3 days
            // startHalf = second_half (0.5), Tue (1.0), endHalf = first_half (0.5) -> total 2.0 days
            const result = calculateLeaveWorkingDays({
                startDate: '2026-08-17',
                endDate: '2026-08-19',
                startHalf: 'second_half',
                endHalf: 'first_half',
                scheduleDays: standardScheduleDays,
            });

            assert.equal(result.totalDays, 2.0);
            assert.equal(result.workingDates.length, 3);
        });

        test('returns 0 working days when entire range falls on weekend/holidays', () => {
            // 2026-08-22 (Sat) to 2026-08-23 (Sun)
            const result = calculateLeaveWorkingDays({
                startDate: '2026-08-22',
                endDate: '2026-08-23',
                scheduleDays: standardScheduleDays,
            });

            assert.equal(result.totalDays, 0);
            assert.equal(result.workingDates.length, 0);
        });

        test('handles inverted or invalid date ranges safely', () => {
            const result = calculateLeaveWorkingDays({
                startDate: '2026-08-25',
                endDate: '2026-08-20',
                scheduleDays: standardScheduleDays,
            });

            assert.equal(result.totalDays, 0);
            assert.equal(result.workingDates.length, 0);
        });
    });

    describe('findOverlappingLeave', () => {
        const existingRequests = [
            {
                id: 'req-1',
                startDate: '2026-08-10',
                endDate: '2026-08-15',
                status: 'approved',
            },
            {
                id: 'req-2',
                startDate: '2026-08-20',
                endDate: '2026-08-22',
                status: 'pending',
            },
            {
                id: 'req-3',
                startDate: '2026-08-25',
                endDate: '2026-08-28',
                status: 'rejected',
            },
            {
                id: 'req-4',
                startDate: '2026-09-01',
                endDate: '2026-09-05',
                status: 'cancelled',
            },
        ];

        test('detects overlap with approved request', () => {
            const overlap = findOverlappingLeave(existingRequests, '2026-08-12', '2026-08-14');
            assert.ok(overlap);
            assert.equal(overlap.id, 'req-1');
        });

        test('detects overlap with pending request', () => {
            const overlap = findOverlappingLeave(existingRequests, '2026-08-21', '2026-08-24');
            assert.ok(overlap);
            assert.equal(overlap.id, 'req-2');
        });

        test('ignores rejected and cancelled requests', () => {
            const overlap1 = findOverlappingLeave(existingRequests, '2026-08-26', '2026-08-27');
            assert.equal(overlap1, null);

            const overlap2 = findOverlappingLeave(existingRequests, '2026-09-02', '2026-09-03');
            assert.equal(overlap2, null);
        });

        test('returns null when no dates intersect', () => {
            const overlap = findOverlappingLeave(existingRequests, '2026-08-16', '2026-08-19');
            assert.equal(overlap, null);
        });

        test('allows excluding self request ID for updates', () => {
            const overlap = findOverlappingLeave(
                existingRequests,
                '2026-08-20',
                '2026-08-22',
                'req-2',
            );
            assert.equal(overlap, null);
        });
    });
});

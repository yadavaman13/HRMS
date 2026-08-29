import {
    formatDate,
    getDateRangeArray,
    calculateLeaveWorkingDays,
    findOverlappingLeave,
} from '../../utils/leave.utils.js';

describe('Date Overlap & Scheduling Utilities (Unit Tests)', () => {
    describe('formatDate and getDateRangeArray', () => {
        it('should format Date object to YYYY-MM-DD', () => {
            const d = new Date(2026, 7, 30); // Aug 30, 2026
            expect(formatDate(d)).toBe('2026-08-30');
        });

        it('should return continuous dates between start and end inclusive', () => {
            const range = getDateRangeArray('2026-08-01', '2026-08-05');
            expect(range).toEqual([
                '2026-08-01',
                '2026-08-02',
                '2026-08-03',
                '2026-08-04',
                '2026-08-05',
            ]);
        });
    });

    describe('findOverlappingLeave', () => {
        const existingRequests = [
            { id: 'req-1', startDate: '2026-09-10', endDate: '2026-09-15', status: 'approved' },
            { id: 'req-2', startDate: '2026-09-20', endDate: '2026-09-25', status: 'pending' },
            { id: 'req-3', startDate: '2026-09-01', endDate: '2026-09-05', status: 'rejected' },
        ];

        it('should return conflicting request when dates overlap', () => {
            // Overlapping with req-1 (Sept 10-15)
            const overlap1 = findOverlappingLeave(existingRequests, '2026-09-12', '2026-09-18');
            expect(overlap1).toBeDefined();
            expect(overlap1.id).toBe('req-1');

            // Exact boundary match
            const overlap2 = findOverlappingLeave(existingRequests, '2026-09-15', '2026-09-16');
            expect(overlap2).toBeDefined();
            expect(overlap2.id).toBe('req-1');
        });

        it('should ignore rejected or cancelled requests', () => {
            // Dates match req-3 (rejected)
            const overlap = findOverlappingLeave(existingRequests, '2026-09-02', '2026-09-04');
            expect(overlap).toBeNull();
        });

        it('should return null when no conflict exists', () => {
            const overlap = findOverlappingLeave(existingRequests, '2026-09-16', '2026-09-19');
            expect(overlap).toBeNull();
        });

        it('should allow excluding self ID during update operations', () => {
            const overlap = findOverlappingLeave(
                existingRequests,
                '2026-09-10',
                '2026-09-15',
                'req-1',
            );
            expect(overlap).toBeNull();
        });
    });

    describe('calculateLeaveWorkingDays', () => {
        it('should exclude weekends for standard Monday-Friday schedule', () => {
            // 2026-08-07 is Friday, 2026-08-10 is Monday (Aug 8-9 are Sat-Sun)
            const result = calculateLeaveWorkingDays({
                startDate: '2026-08-07',
                endDate: '2026-08-10',
            });
            expect(result.totalDays).toBe(2);
            expect(result.workingDates).toEqual(['2026-08-07', '2026-08-10']);
        });

        it('should deduct public holidays from working days', () => {
            const holidays = [{ holidayDate: '2026-08-07' }];
            const result = calculateLeaveWorkingDays({
                startDate: '2026-08-07',
                endDate: '2026-08-10',
                holidays,
            });
            expect(result.totalDays).toBe(1);
            expect(result.workingDates).toEqual(['2026-08-10']);
        });

        it('should handle half-day leave calculations properly', () => {
            const result = calculateLeaveWorkingDays({
                startDate: '2026-08-10',
                endDate: '2026-08-10',
                startHalf: 'first_half',
            });
            expect(result.totalDays).toBe(0.5);
        });
    });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AttendancePunchWidget from '@/app/features/attendance/components/AttendancePunchWidget/AttendancePunchWidget';
import AttendanceProvider from '@/app/features/attendance/context/attendance.context';

describe('AttendancePunchWidget Component', () => {
    it('renders in initial unpunched state', () => {
        render(
            <AttendanceProvider>
                <AttendancePunchWidget />
            </AttendanceProvider>,
        );

        expect(screen.getByText('Daily Work Session')).toBeInTheDocument();
        expect(screen.getByText('Ready to Clock In')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Clock In Now/i })).toBeInTheDocument();
    });
});

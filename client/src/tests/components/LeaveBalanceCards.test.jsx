import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LeaveBalanceCards from '@/app/features/leave/components/LeaveBalanceCards/LeaveBalanceCards';

describe('LeaveBalanceCards Component', () => {
    it('renders all standard leave types with default values when empty array is passed', () => {
        render(<LeaveBalanceCards balances={[]} />);

        expect(screen.getByText('Paid Time Off')).toBeInTheDocument();
        expect(screen.getByText('Sick Leave')).toBeInTheDocument();
        expect(screen.getByText('Casual Leave')).toBeInTheDocument();
        expect(screen.getByText('Unpaid Leave (LWP)')).toBeInTheDocument();
    });

    it('renders customized balances when provided from API', () => {
        const mockBalances = [
            { code: 'PTO', availableDays: 20, usedDays: 2, total: 22 },
            { code: 'SICK', availableDays: 8, usedDays: 4, total: 12 },
        ];

        render(<LeaveBalanceCards balances={mockBalances} />);

        expect(screen.getByText('20')).toBeInTheDocument();
        expect(screen.getByText('8')).toBeInTheDocument();
        expect(screen.getByText('2 Used / 22 Total')).toBeInTheDocument();
    });

    it('handles non-array / undefined balances defensively without crashing', () => {
        render(<LeaveBalanceCards balances={undefined} />);
        expect(screen.getByText('Paid Time Off')).toBeInTheDocument();
    });
});

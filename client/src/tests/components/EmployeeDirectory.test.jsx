import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import EmployeeStatusDot from '@/app/features/employees/components/EmployeeStatusDot/EmployeeStatusDot';
import EmployeeCard from '@/app/features/employees/components/EmployeeCard/EmployeeCard';

describe('Employee Directory Components', () => {
    it('renders EmployeeStatusDot with PRESENT status', () => {
        render(<EmployeeStatusDot status="PRESENT" showLabel={true} />);
        expect(screen.getByText('Present')).toBeInTheDocument();
    });

    it('renders EmployeeStatusDot with ON_LEAVE status', () => {
        render(<EmployeeStatusDot status="ON_LEAVE" showLabel={true} />);
        expect(screen.getByText('On Leave')).toBeInTheDocument();
    });

    it('renders EmployeeStatusDot with ABSENT status by default', () => {
        render(<EmployeeStatusDot status="ABSENT" showLabel={true} />);
        expect(screen.getByText('Absent')).toBeInTheDocument();
    });

    it('renders EmployeeCard with full details', () => {
        const mockEmployee = {
            id: 'emp-123',
            firstName: 'Aman',
            lastName: 'Yadav',
            employeeCode: 'OIJODO20260001',
            department: 'Engineering',
            designation: 'Senior Architect',
            workEmail: 'aman.yadav@dayflow.io',
            phone: '+91 98765 43210',
            todayStatus: 'PRESENT',
        };

        render(
            <MemoryRouter>
                <EmployeeCard employee={mockEmployee} />
            </MemoryRouter>,
        );

        expect(screen.getByText('Aman Yadav')).toBeInTheDocument();
        expect(screen.getByText('OIJODO20260001')).toBeInTheDocument();
        expect(screen.getByText('Engineering')).toBeInTheDocument();
        expect(screen.getByText('Senior Architect')).toBeInTheDocument();
        expect(screen.getByText('aman.yadav@dayflow.io')).toBeInTheDocument();
    });

    it('handles null/undefined employee gracefully in EmployeeCard', () => {
        const { container } = render(
            <MemoryRouter>
                <EmployeeCard employee={null} />
            </MemoryRouter>,
        );
        expect(container.firstChild).toBeNull();
    });
});

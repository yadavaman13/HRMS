import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PayslipDetailModal from '@/app/features/payroll/components/PayslipDetailModal/PayslipDetailModal';
import PayrollProvider from '@/app/features/payroll/context/payroll.context';

describe('PayslipDetailModal Component', () => {
    it('renders payslip itemized breakdown and 1-Click PDF Download button', () => {
        const mockPayslip = {
            id: 'slip-101',
            periodName: 'January 2026',
            employeeName: 'Aman Yadav',
            employeeCode: 'OIJODO20260001',
            department: 'Engineering',
            status: 'FINALIZED',
            totalWorkingDays: 22,
            payableDays: 22,
            unpaidAbsences: 0,
            basicSalary: 25000,
            hra: 12500,
            standardAllowance: 4167,
            performanceBonus: 2083,
            lta: 2083,
            fixedAllowance: 4167,
            employeePf: 3000,
            professionalTax: 200,
            netPay: 46800,
        };

        render(
            <PayrollProvider>
                <PayslipDetailModal isOpen={true} onClose={() => {}} payslip={mockPayslip} />
            </PayrollProvider>,
        );

        expect(screen.getByText('Aman Yadav')).toBeInTheDocument();
        expect(screen.getByText('OIJODO20260001')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Download PDF Payslip/i })).toBeInTheDocument();
        expect(screen.getByText('Basic Salary')).toBeInTheDocument();
        expect(screen.getByText('₹46,800')).toBeInTheDocument();
    });

    it('returns null when payslip is null', () => {
        const { container } = render(
            <PayrollProvider>
                <PayslipDetailModal isOpen={true} onClose={() => {}} payslip={null} />
            </PayrollProvider>,
        );
        expect(container.firstChild).toBeNull();
    });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SalaryStructureEditor from '@/app/features/payroll/components/SalaryStructureEditor/SalaryStructureEditor';

describe('SalaryStructureEditor Component', () => {
    it('renders with default ₹50,000 monthly wage and computes correct residual balancing', () => {
        render(<SalaryStructureEditor initialData={{ monthlyWage: 50000 }} />);

        // Check header summary cards
        expect(screen.getByText('Monthly Base Wage')).toBeInTheDocument();
        expect(screen.getAllByText('Fixed Allowance (Residual)').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Net Take-Home Salary').length).toBeGreaterThan(0);

        // Basic salary: 50% of 50000 = 25000
        expect(screen.getByText('Basic Salary')).toBeInTheDocument();
        expect(screen.getByText('50% of Wage')).toBeInTheDocument();

        // HRA: 50% of Basic (25000) = 12500
        expect(screen.getByText('HRA')).toBeInTheDocument();
        expect(screen.getByText('50% of Basic')).toBeInTheDocument();

        // Deductions: PF (12% of 25000 = 3000) and PT (200)
        expect(screen.getByText('Employee PF (12%)')).toBeInTheDocument();
        expect(screen.getByText('Professional Tax (PT)')).toBeInTheDocument();
    });

    it('renders the save action button', () => {
        render(<SalaryStructureEditor initialData={{ monthlyWage: 60000 }} />);
        expect(
            screen.getByRole('button', { name: /Save & Apply Salary Structure/i }),
        ).toBeInTheDocument();
    });
});

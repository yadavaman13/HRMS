import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResumeTab from '@/app/features/employees/components/EmployeeProfileTabs/ResumeTab';
import PrivateInfoTab from '@/app/features/employees/components/EmployeeProfileTabs/PrivateInfoTab';
import SalaryTab from '@/app/features/employees/components/EmployeeProfileTabs/SalaryTab';
import DocumentsTab from '@/app/features/employees/components/EmployeeProfileTabs/DocumentsTab';

describe('Employee Profile Tab Components', () => {
    it('renders ResumeTab with skills and certifications defensively', () => {
        const mockProfile = {
            about: 'Passionate full stack developer',
            skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
            certifications: [
                {
                    id: 1,
                    name: 'AWS Certified Solutions Architect',
                    issuer: 'Amazon',
                    year: '2025',
                },
            ],
        };

        render(<ResumeTab profile={mockProfile} />);

        expect(screen.getByText('Passionate full stack developer')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('AWS Certified Solutions Architect')).toBeInTheDocument();
    });

    it('renders PrivateInfoTab and respects canViewSensitive permissions', () => {
        const mockPrivateInfo = {
            dob: '1995-05-15',
            gender: 'Male',
            maritalStatus: 'Single',
            address: 'Bangalore, India',
            bankName: 'HDFC Bank',
            pan: 'ABCDE1234F',
        };

        // When canViewSensitive is false, bank section is hidden
        const { rerender } = render(
            <PrivateInfoTab privateInfo={mockPrivateInfo} canViewSensitive={false} />,
        );
        expect(screen.getByText('Male')).toBeInTheDocument();
        expect(screen.queryByText('Bank & Statutory (Restricted)')).not.toBeInTheDocument();

        // When canViewSensitive is true, bank section is visible
        rerender(<PrivateInfoTab privateInfo={mockPrivateInfo} canViewSensitive={true} />);
        expect(screen.getByText('Bank & Statutory (Restricted)')).toBeInTheDocument();
        expect(screen.getByText('ABCDE1234F')).toBeInTheDocument();
    });

    it('renders SalaryTab for Admin and hides for non-admin', () => {
        const mockSalary = {
            monthlyWage: 75000,
        };

        const { rerender } = render(<SalaryTab salaryStructure={mockSalary} isAdmin={false} />);
        expect(screen.getByText('Salary Information Restricted')).toBeInTheDocument();

        rerender(<SalaryTab salaryStructure={mockSalary} isAdmin={true} />);
        expect(screen.getByText('Earnings Breakdown (Residual Model)')).toBeInTheDocument();
        expect(screen.getByText('Monthly Base Wage')).toBeInTheDocument();
    });

    it('renders DocumentsTab with default documents or empty list defensively', () => {
        render(<DocumentsTab documents={[]} />);
        expect(screen.getByText('Signed_Offer_Letter.pdf')).toBeInTheDocument();
    });
});

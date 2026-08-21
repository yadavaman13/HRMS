import 'dotenv/config';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateSalaryComponents } from '../../services/payroll.service.js';
import { payslipTemplate } from '../../templates/pdf.template.js';

describe('Payroll & Salary Calculation Engine Tests', () => {
    describe('calculateSalaryComponents', () => {
        const mockSettings = {
            pfEnabled: true,
            employeePfRate: '12.00',
            employerPfRate: '12.00',
            professionalTaxEnabled: true,
            professionalTaxAmount: '200.00',
        };

        const mockComponents = [
            {
                componentDefinitionId: 'd0d46d0a-9d93-4a1e-84a1-7c5efae4a501',
                code: 'BASIC',
                name: 'Basic Salary',
                componentType: 'earning',
                calculationType: 'percentage_of_wage',
                percentage: '50.00',
                fixedAmount: '0.00',
                sequence: 1,
                isResidual: false,
            },
            {
                componentDefinitionId: 'd0d46d0a-9d93-4a1e-84a1-7c5efae4a502',
                code: 'HRA',
                name: 'House Rent Allowance',
                componentType: 'earning',
                calculationType: 'percentage_of_component',
                calculationBase: 'BASIC',
                percentage: '50.00',
                fixedAmount: '0.00',
                sequence: 2,
                isResidual: false,
            },
            {
                componentDefinitionId: 'd0d46d0a-9d93-4a1e-84a1-7c5efae4a503',
                code: 'FIXED_ALLOWANCE',
                name: 'Fixed Allowance',
                componentType: 'earning',
                calculationType: 'residual',
                percentage: null,
                fixedAmount: '0.00',
                sequence: 3,
                isResidual: true,
            },
            {
                componentDefinitionId: 'd0d46d0a-9d93-4a1e-84a1-7c5efae4a504',
                code: 'EMPLOYEE_PF',
                name: 'Employee PF',
                componentType: 'employee_deduction',
                calculationType: 'percentage_of_component',
                calculationBase: 'BASIC',
                percentage: '12.00',
                sequence: 4,
                isResidual: false,
            },
            {
                componentDefinitionId: 'd0d46d0a-9d93-4a1e-84a1-7c5efae4a505',
                code: 'PROFESSIONAL_TAX',
                name: 'Professional Tax',
                componentType: 'employee_deduction',
                calculationType: 'fixed',
                fixedAmount: '200.00',
                sequence: 5,
                isResidual: false,
            },
            {
                componentDefinitionId: 'd0d46d0a-9d93-4a1e-84a1-7c5efae4a506',
                code: 'EMPLOYER_PF',
                name: 'Employer PF Contribution',
                componentType: 'employer_contribution',
                calculationType: 'percentage_of_component',
                calculationBase: 'BASIC',
                percentage: '12.00',
                sequence: 6,
                isResidual: false,
            },
        ];

        test('calculates correct earnings and deductions based on a 50,000 monthly wage', () => {
            const wage = 50000;
            const { lines, grossEarnings, totalEmployeeDeductions, employerContributions } =
                calculateSalaryComponents(wage, mockComponents, mockSettings);

            // Basic: 50% of 50000 = 25000
            const basicLine = lines.find((l) => l.code === 'BASIC');
            assert.ok(basicLine);
            assert.equal(basicLine.amount, 25000);

            // HRA: 50% of Basic (25000) = 12500
            const hraLine = lines.find((l) => l.code === 'HRA');
            assert.ok(hraLine);
            assert.equal(hraLine.amount, 12500);

            // Fixed Allowance (Residual): 50000 - (Basic + HRA) = 50000 - 37500 = 12500
            const residualLine = lines.find((l) => l.code === 'FIXED_ALLOWANCE');
            assert.ok(residualLine);
            assert.equal(residualLine.amount, 12500);

            // Gross = 25000 + 12500 + 12500 = 50000
            assert.equal(grossEarnings, 50000);

            // Employee PF: 12% of Basic (25000) = 3000
            const pfLine = lines.find((l) => l.code === 'EMPLOYEE_PF');
            assert.ok(pfLine);
            assert.equal(pfLine.amount, 3000);

            // Professional Tax: Fixed 200
            const ptLine = lines.find((l) => l.code === 'PROFESSIONAL_TAX');
            assert.ok(ptLine);
            assert.equal(ptLine.amount, 200);

            // Deductions = 3000 + 200 = 3200
            assert.equal(totalEmployeeDeductions, 3200);

            // Employer PF: 12% of Basic = 3000
            const employerPfLine = lines.find((l) => l.code === 'EMPLOYER_PF');
            assert.ok(employerPfLine);
            assert.equal(employerPfLine.amount, 3000);
            assert.equal(employerContributions, 3000);
        });

        test('handles fixed earning components correctly alongside residuals', () => {
            const wage = 60000;
            const componentsWithFixed = [
                ...mockComponents.filter((c) => c.code !== 'HRA'),
                {
                    componentDefinitionId: 'd0d46d0a-9d93-4a1e-84a1-7c5efae4a510',
                    code: 'TRAVEL_ALLOWANCE',
                    name: 'Travel Allowance',
                    componentType: 'earning',
                    calculationType: 'fixed',
                    fixedAmount: '5000.00',
                    sequence: 2,
                    isResidual: false,
                },
            ];

            const { lines, grossEarnings } = calculateSalaryComponents(
                wage,
                componentsWithFixed,
                mockSettings,
            );

            // Basic: 50% of 60000 = 30000
            // Travel Allowance: Fixed 5000
            // Fixed Allowance (Residual): 60000 - (30000 + 5000) = 25000
            const residualLine = lines.find((l) => l.code === 'FIXED_ALLOWANCE');
            assert.ok(residualLine);
            assert.equal(residualLine.amount, 25000);
            assert.equal(grossEarnings, 60000);
        });

        test('calculates 0 residual if sum of other earnings exceeds or equals wage', () => {
            const wage = 30000;
            // Basic is 50% of 30000 = 15000
            // Suppose we have a fixed component of 20000 (total = 35000, which exceeds 30000)
            const componentsWithHighFixed = [
                mockComponents[0], // Basic (15000)
                mockComponents[2], // Fixed Allowance (residual)
                {
                    componentDefinitionId: 'd0d46d0a-9d93-4a1e-84a1-7c5efae4a511',
                    code: 'SPECIAL_ALLOWANCE',
                    name: 'Special Allowance',
                    componentType: 'earning',
                    calculationType: 'fixed',
                    fixedAmount: '20000.00',
                    sequence: 2,
                    isResidual: false,
                },
            ];

            const { lines, grossEarnings } = calculateSalaryComponents(
                wage,
                componentsWithHighFixed,
                mockSettings,
            );

            const residualLine = lines.find((l) => l.code === 'FIXED_ALLOWANCE');
            assert.ok(residualLine);
            assert.equal(residualLine.amount, 0); // Residual capped at 0
            assert.equal(grossEarnings, 35000);
        });
    });

    describe('payslipTemplate html renderer', () => {
        test('renders correct employee metadata and net take-home pay values', () => {
            const mockData = {
                payslip: {
                    status: 'calculated',
                    grossEarnings: '50000.00',
                    totalEmployeeDeductions: '3200.00',
                    unpaidDeduction: '4545.45',
                    netPay: '42254.55',
                },
                lines: [
                    { componentName: 'Basic Salary', amount: '25000.00', componentType: 'earning' },
                    {
                        componentName: 'House Rent Allowance',
                        amount: '12500.00',
                        componentType: 'earning',
                    },
                    {
                        componentName: 'Fixed Allowance',
                        amount: '12500.00',
                        componentType: 'earning',
                    },
                    {
                        componentName: 'Employee PF',
                        amount: '3000.00',
                        componentType: 'employee_deduction',
                    },
                    {
                        componentName: 'Professional Tax',
                        amount: '200.00',
                        componentType: 'employee_deduction',
                    },
                ],
                attendanceSummary: {
                    totalCalendarDays: 31,
                    scheduledDays: 22,
                    presentDays: 20,
                    paidLeaveDays: 0,
                    unpaidLeaveDays: 2,
                    absentDays: 0,
                    halfDays: 0,
                    holidayDays: 0,
                    weekendDays: 9,
                    payableDays: 20,
                },
                employee: {
                    firstName: 'Aman',
                    lastName: 'Yadav',
                    employeeCode: 'OIAY20260001',
                    departmentName: 'Engineering',
                    jobPositionName: 'Software Engineer',
                    joiningDate: '2026-01-01',
                },
                organization: {
                    name: 'Apex Org',
                    email: 'hr@apex.co',
                    phone: '1234567890',
                    currency: 'INR',
                },
                period: {
                    periodStart: '2026-08-01',
                    periodEnd: '2026-08-31',
                },
            };

            const html = payslipTemplate(mockData);

            assert.ok(typeof html === 'string');
            assert.ok(html.includes('Payslip - Aman Yadav'));
            assert.ok(html.includes('OIAY20260001'));
            assert.ok(html.includes('Engineering'));
            assert.ok(html.includes('Software Engineer'));
            assert.ok(html.includes('Basic Salary'));
            assert.ok(html.includes('House Rent Allowance'));
            assert.ok(html.includes('Employee PF'));
            assert.ok(html.includes('Professional Tax'));
            assert.ok(html.includes('42,254.55')); // formatted net pay check
        });
    });
});

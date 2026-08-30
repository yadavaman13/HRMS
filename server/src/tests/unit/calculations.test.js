/**
 * Payroll compensation breakdown calculator
 */
export function calculateSalaryBreakdown({
    ctcMonthly,
    pfRate = 0.12,
    professionalTax = 200,
    includeGratuity = false,
}) {
    const basic = Math.round(ctcMonthly * 0.5); // 50% Basic
    const hra = Math.round(basic * 0.4); // 40% HRA
    const specialAllowance = Math.max(0, ctcMonthly - (basic + hra));

    const employeePf = Math.round(basic * pfRate);
    const employerPf = Math.round(basic * pfRate);
    const gratuity = includeGratuity ? Math.round(basic * 0.0481) : 0;

    const totalDeductions = employeePf + professionalTax;
    const netSalary = ctcMonthly - totalDeductions - gratuity;

    return {
        ctcMonthly,
        basic,
        hra,
        specialAllowance,
        employeePf,
        employerPf,
        professionalTax,
        gratuity,
        totalDeductions,
        netSalary,
    };
}

/**
 * Pro-rated salary calculation for partial month working
 */
export function calculateProratedSalary({ monthlySalary, totalMonthDays, payableDays }) {
    if (totalMonthDays <= 0 || payableDays <= 0) return 0;
    const perDayRate = monthlySalary / totalMonthDays;
    return Math.round(perDayRate * Math.min(payableDays, totalMonthDays));
}

describe('Compensation & Salary Mathematics (Unit Tests)', () => {
    describe('calculateSalaryBreakdown', () => {
        it('should correctly divide monthly CTC into Basic, HRA, Allowance, and Deductions', () => {
            const breakdown = calculateSalaryBreakdown({
                ctcMonthly: 50000,
                pfRate: 0.12,
                professionalTax: 200,
            });

            expect(breakdown.basic).toBe(25000);
            expect(breakdown.hra).toBe(10000);
            expect(breakdown.specialAllowance).toBe(15000);
            expect(breakdown.employeePf).toBe(3000); // 12% of 25000
            expect(breakdown.professionalTax).toBe(200);
            expect(breakdown.totalDeductions).toBe(3200);
            expect(breakdown.netSalary).toBe(46800);
        });
    });

    describe('calculateProratedSalary', () => {
        it('should compute exact prorated salary based on payable days', () => {
            // Salary 60000 in a 30-day month, worked 15 days = 30000
            const prorated = calculateProratedSalary({
                monthlySalary: 60000,
                totalMonthDays: 30,
                payableDays: 15,
            });
            expect(prorated).toBe(30000);
        });

        it('should return 0 when payable days is 0', () => {
            const prorated = calculateProratedSalary({
                monthlySalary: 60000,
                totalMonthDays: 30,
                payableDays: 0,
            });
            expect(prorated).toBe(0);
        });
    });
});

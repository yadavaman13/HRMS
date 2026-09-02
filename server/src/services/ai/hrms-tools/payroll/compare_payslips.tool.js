import { tool } from 'langchain';
import * as z from 'zod';
import { toolSuccess, toolError } from '../hrms-tool.result.js';
import { getPayslipByEmployeeAndPeriod, getPayslipLines } from '../../../../dao/payroll.dao.js';

export function createComparePayslipsTool(hrmsContext) {
    return tool(
        async ({ employeeId, currentPeriodId, previousPeriodId }) => {
            if (hrmsContext.role === 'user') return toolError('FORBIDDEN', 'Access denied.');
            let targetId = employeeId;
            if (hrmsContext.role === 'employee') {
                if (!hrmsContext.employeeId)
                    return toolError('NOT_AN_EMPLOYEE', 'No linked employee record.');
                targetId = hrmsContext.employeeId;
            }
            if (!targetId) return toolError('NOT_AN_EMPLOYEE', 'Please provide an employeeId.');
            const [current, previous] = await Promise.all([
                getPayslipByEmployeeAndPeriod(targetId, currentPeriodId),
                getPayslipByEmployeeAndPeriod(targetId, previousPeriodId),
            ]);
            if (!current)
                return toolError('PAYROLL_NOT_FOUND', 'Current period payslip not found.');
            if (!previous)
                return toolError('PAYROLL_NOT_FOUND', 'Previous period payslip not found.');
            const [currentLines, previousLines] = await Promise.all([
                getPayslipLines(current.id),
                getPayslipLines(previous.id),
            ]);

            const curGross = Number(current.grossEarnings ?? current.grossPay ?? 0);
            const prevGross = Number(previous.grossEarnings ?? previous.grossPay ?? 0);
            const curNet = Number(current.netPay ?? 0);
            const prevNet = Number(previous.netPay ?? 0);
            const curDeductions = Number(
                current.totalEmployeeDeductions ?? current.totalDeductions ?? 0,
            );
            const prevDeductions = Number(
                previous.totalEmployeeDeductions ?? previous.totalDeductions ?? 0,
            );
            const curDays = Number(current.payableDays ?? 0);
            const prevDays = Number(previous.payableDays ?? 0);

            const diff = {
                grossPay: {
                    current: current.grossEarnings ?? current.grossPay,
                    previous: previous.grossEarnings ?? previous.grossPay,
                    delta: curGross - prevGross,
                },
                netPay: {
                    current: current.netPay,
                    previous: previous.netPay,
                    delta: curNet - prevNet,
                },
                totalDeductions: {
                    current: current.totalEmployeeDeductions ?? current.totalDeductions,
                    previous: previous.totalEmployeeDeductions ?? previous.totalDeductions,
                    delta: curDeductions - prevDeductions,
                },
                payableDays: {
                    current: current.payableDays,
                    previous: previous.payableDays,
                    delta: curDays - prevDays,
                },
                lineChanges: currentLines.map((cl) => {
                    const pl = previousLines.find((l) => l.componentCode === cl.componentCode);
                    const curAmt = Number(cl.amount ?? 0);
                    const prevAmt = Number(pl?.amount ?? 0);
                    return {
                        componentCode: cl.componentCode,
                        componentName: cl.componentName,
                        current: cl.amount,
                        previous: pl?.amount ?? 0,
                        delta: curAmt - prevAmt,
                    };
                }),
            };
            return toolSuccess(diff);
        },
        {
            name: 'compare_payslips',
            description:
                'Compare two payslips to explain salary differences. Returns delta for gross, net, deductions, and each component.',
            schema: z.object({
                employeeId: z.string().uuid().optional(),
                currentPeriodId: z.string().uuid(),
                previousPeriodId: z.string().uuid(),
            }),
        },
    );
}

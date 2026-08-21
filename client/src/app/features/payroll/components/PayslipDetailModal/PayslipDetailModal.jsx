import { useState } from 'react';
import { usePayroll } from '../../hooks/usePayroll';
import Dialog from '@/components/Shared/Feedback/Dialog/Dialog';
import Button from '@/components/Shared/Buttons/Button/Button';
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import { Download } from 'lucide-react';
import './PayslipDetailModal.scss';

export default function PayslipDetailModal({ isOpen, onClose, payslip }) {
    const { handleDownloadPdf } = usePayroll();
    const [downloading, setDownloading] = useState(false);

    if (!payslip) return null;

    const formatInr = (num) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(num || 0);

    const onDownload = async () => {
        setDownloading(true);
        try {
            const filename = `Payslip_${payslip?.employeeCode || 'EMP'}_${payslip?.periodName || 'Cycle'}.pdf`;
            await handleDownloadPdf(payslip?.id, filename);
        } catch (err) {
            console.error('Download PDF failed:', err);
        } finally {
            setDownloading(false);
        }
    };

    const earnings = Array.isArray(payslip?.earningsLines || payslip?.earnings)
        ? payslip.earningsLines || payslip.earnings
        : [
              { name: 'Basic Salary', amount: payslip?.basicSalary || 25000 },
              { name: 'House Rent Allowance (HRA)', amount: payslip?.hra || 12500 },
              { name: 'Standard Allowance', amount: payslip?.standardAllowance || 4167 },
              { name: 'Performance Bonus', amount: payslip?.performanceBonus || 2083 },
              { name: 'Leave Travel Allowance (LTA)', amount: payslip?.lta || 2083 },
              { name: 'Fixed Allowance (Residual)', amount: payslip?.fixedAllowance || 4167 },
          ];

    const deductions = Array.isArray(payslip?.deductionsLines || payslip?.deductions)
        ? payslip.deductionsLines || payslip.deductions
        : [
              { name: 'Employee Provident Fund (PF)', amount: payslip?.employeePf || 3000 },
              { name: 'Professional Tax (PT)', amount: payslip?.professionalTax || 200 },
              ...(payslip?.lwpDeduction
                  ? [{ name: 'Unpaid Leave (LWP) Deduction', amount: payslip.lwpDeduction }]
                  : []),
          ];

    const totalEarnings = earnings.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const totalDeductions = deductions.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const netSalary = payslip?.netPay || payslip?.netSalary || totalEarnings - totalDeductions;

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title={`Payslip — ${payslip?.periodName || payslip?.period || 'Monthly Cycle'}`}
            size="lg"
        >
            <div className="payslip-detail-modal">
                <div className="payslip-header-bar">
                    <div className="payslip-emp-info">
                        <h3>{payslip?.employeeName || 'Employee Name'}</h3>
                        <span className="code font-mono">{payslip?.employeeCode || 'EMP-N/A'}</span>
                        <span className="dept">{payslip?.department || 'Engineering'}</span>
                    </div>

                    <div className="payslip-status-download">
                        <Badge
                            variant={payslip?.status === 'PAID' ? 'success' : 'primary'}
                            size="sm"
                        >
                            {payslip?.status || 'FINALIZED'}
                        </Badge>
                        <Button
                            variant="primary"
                            size="sm"
                            icon={Download}
                            onClick={onDownload}
                            loading={downloading}
                            disabled={downloading}
                        >
                            Download PDF Payslip
                        </Button>
                    </div>
                </div>

                <div className="payslip-attendance-summary">
                    <div className="metric">
                        <span className="label">Scheduled Days:</span>
                        <span className="val font-mono">{payslip?.totalWorkingDays || 22}</span>
                    </div>
                    <div className="metric">
                        <span className="label">Payable Days:</span>
                        <span className="val font-mono font-bold text-primary">
                            {payslip?.payableDays || 22}
                        </span>
                    </div>
                    <div className="metric">
                        <span className="label">Unpaid Absences:</span>
                        <span className="val font-mono text-danger">
                            {payslip?.unpaidAbsences || 0}
                        </span>
                    </div>
                </div>

                <div className="payslip-breakdown-grid">
                    <div className="breakdown-col">
                        <h4 className="col-title">Earnings</h4>
                        <table className="mini-table">
                            <tbody>
                                {(earnings || []).map((line, idx) => (
                                    <tr key={idx}>
                                        <td>{line.name}</td>
                                        <td className="text-right font-mono">
                                            {formatInr(line.amount)}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="total-tr">
                                    <td>
                                        <strong>Total Gross Earnings</strong>
                                    </td>
                                    <td className="text-right font-mono font-bold">
                                        {formatInr(totalEarnings)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="breakdown-col">
                        <h4 className="col-title">Deductions</h4>
                        <table className="mini-table">
                            <tbody>
                                {(deductions || []).map((line, idx) => (
                                    <tr key={idx}>
                                        <td>{line.name}</td>
                                        <td className="text-right font-mono text-danger">
                                            −{formatInr(line.amount)}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="total-tr">
                                    <td>
                                        <strong>Total Deductions</strong>
                                    </td>
                                    <td className="text-right font-mono font-bold text-danger">
                                        −{formatInr(totalDeductions)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="payslip-net-box">
                    <span className="net-label">Net Disbursed Take-Home</span>
                    <span className="net-val font-mono font-bold text-success">
                        {formatInr(netSalary)}
                    </span>
                </div>
            </div>
        </Dialog>
    );
}

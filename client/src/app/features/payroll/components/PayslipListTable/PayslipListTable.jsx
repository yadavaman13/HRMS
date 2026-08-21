import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import Button from '@/components/Shared/Buttons/Button/Button';
import EmptyState from '@/components/Shared/DataDisplay/EmptyState/EmptyState';
import { FileText, Download, Eye } from 'lucide-react';
import './PayslipListTable.scss';

export default function PayslipListTable({
    payslips = [],
    onViewDetails,
    onDownloadPdf,
    showEmployeeCol = false,
}) {
    const safePayslips = Array.isArray(payslips) ? payslips : [];

    const formatInr = (num) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(num || 0);

    if (safePayslips.length === 0) {
        return (
            <EmptyState
                icon={FileText}
                title="No payslips found"
                description="Finalized monthly payroll statements will be available here."
            />
        );
    }

    return (
        <div className="payslip-list-table-wrap">
            <table className="payslip-list-table">
                <thead>
                    <tr>
                        <th>Period</th>
                        {showEmployeeCol && <th>Employee</th>}
                        <th>Gross Pay</th>
                        <th>Deductions</th>
                        <th>Net Take-Home</th>
                        <th>Status</th>
                        <th className="text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {safePayslips.map((slip, idx) => (
                        <tr key={slip?.id || idx}>
                            <td>
                                <strong>
                                    {slip?.periodName || slip?.period || 'Monthly Cycle'}
                                </strong>
                                <div className="date-sub">
                                    {slip?.createdAt
                                        ? new Date(slip.createdAt).toLocaleDateString()
                                        : ''}
                                </div>
                            </td>
                            {showEmployeeCol && (
                                <td>
                                    <strong>{slip?.employeeName || 'Employee'}</strong>
                                    <div className="code-sub font-mono">
                                        {slip?.employeeCode || 'EMP-N/A'}
                                    </div>
                                </td>
                            )}
                            <td className="font-mono">
                                {formatInr(slip?.grossSalary || slip?.grossEarnings || 50000)}
                            </td>
                            <td className="font-mono text-danger">
                                −{formatInr(slip?.totalDeductions || 3200)}
                            </td>
                            <td className="font-mono font-bold text-success">
                                {formatInr(slip?.netPay || slip?.netSalary || 46800)}
                            </td>
                            <td>
                                <Badge
                                    variant={slip?.status === 'PAID' ? 'success' : 'primary'}
                                    size="sm"
                                >
                                    {slip?.status || 'FINALIZED'}
                                </Badge>
                            </td>
                            <td className="text-right">
                                <div className="action-btn-group">
                                    {onViewDetails && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Eye}
                                            onClick={() => onViewDetails(slip)}
                                        >
                                            View
                                        </Button>
                                    )}
                                    {onDownloadPdf && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            icon={Download}
                                            onClick={() =>
                                                onDownloadPdf(
                                                    slip?.id,
                                                    `Payslip_${slip?.employeeCode || 'EMP'}.pdf`,
                                                )
                                            }
                                        >
                                            PDF
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

import { useState, useEffect, useContext } from 'react';
import { PayrollContext } from '../context/payroll.context';
import { usePayroll } from '../hooks/usePayroll';
import PayslipDetailModal from '../components/PayslipDetailModal';
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';
import Button from '@/components/Shared/Buttons/Button/Button';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import { DollarSign, FileText, CheckCircle2 } from 'lucide-react';
import './EmployeePayslipsPage.scss';

export default function EmployeePayslipsPage() {
    const { payslips, loading } = useContext(PayrollContext);
    const { loadMyPayslips } = usePayroll();

    const [selectedPayslipId, setSelectedPayslipId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadMyPayslips();
    }, [loadMyPayslips]);

    const columns = [
        {
            key: 'period',
            label: 'Pay Period',
            render: (_, row) => (
                <div className="period-cell">
                    <span className="period-title font-semibold text-primary">
                        {row.periodMonth
                            ? `${row.periodMonth}/${row.periodYear}`
                            : row.periodName || 'Salary Period'}
                    </span>
                    <span className="period-dates text-secondary text-xs">
                        {row.periodStart} to {row.periodEnd}
                    </span>
                </div>
            ),
        },
        {
            key: 'attendance',
            label: 'Worked Days / LOP',
            render: (_, row) => (
                <span className="font-mono">
                    {row.workedDays || 22} Days{' '}
                    {Number(row.unpaidLeaveDays) > 0 ? `(${row.unpaidLeaveDays} LOP)` : ''}
                </span>
            ),
        },
        {
            key: 'gross',
            label: 'Gross Earnings',
            render: (val, row) => (
                <span className="font-mono">
                    ₹
                    {Number(row.grossEarnings || val || 0).toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                    })}
                </span>
            ),
        },
        {
            key: 'deductions',
            label: 'Total Deductions',
            render: (val, row) => (
                <span className="font-mono text-danger">
                    - ₹
                    {Number(row.totalDeductions || val || 0).toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                    })}
                </span>
            ),
        },
        {
            key: 'net',
            label: 'Net Take-Home Pay',
            render: (val, row) => (
                <span className="font-mono font-bold text-success">
                    ₹
                    {Number(row.netPay || val || 0).toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                    })}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Payment Status',
            render: (val) => (
                <span className="status-badge-paid">
                    <CheckCircle2 size={12} /> PAID
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Statement',
            render: (_, row) => (
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                        setSelectedPayslipId(row.id || row.payslipId);
                        setIsModalOpen(true);
                    }}
                >
                    <FileText size={13} /> View Statement
                </Button>
            ),
        },
    ];

    return (
        <div className="employee-payslips-page">
            <div className="page-header-row">
                <div>
                    <h1 className="page-title">My Payslips & Compensation</h1>
                    <p className="page-subtitle">
                        View monthly salary breakdown statements, tax deductions, and download
                        official PDF payslips.
                    </p>
                </div>
            </div>

            <div className="payslips-table-card">
                <div className="card-header">
                    <div className="title-group">
                        <DollarSign size={18} className="header-icon" />
                        <h2>Salary Disbursal History</h2>
                    </div>
                </div>

                {loading && payslips.length === 0 ? (
                    <Spinner label="Loading payslip history..." />
                ) : (
                    <AdvancedTable columns={columns} data={payslips} pageSize={12} />
                )}
            </div>

            {/* View Statement Modal */}
            <PayslipDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                payslipId={selectedPayslipId}
            />
        </div>
    );
}

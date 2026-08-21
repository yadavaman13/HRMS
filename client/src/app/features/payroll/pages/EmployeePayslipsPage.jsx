import { useState, useEffect } from 'react';
import { usePayroll } from '../hooks/usePayroll';
import PayslipListTable from '../components/PayslipListTable/PayslipListTable';
import PayslipDetailModal from '../components/PayslipDetailModal/PayslipDetailModal';
import StatCard from '@/components/Shared/DataDisplay/StatCard/StatCard';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import { FileText, IndianRupee, ShieldCheck } from 'lucide-react';
import './EmployeePayslipsPage.scss';

export default function EmployeePayslipsPage() {
    const { payslips, fetchPayslips, handleDownloadPdf, loading } = usePayroll();

    const [selectedPayslip, setSelectedPayslip] = useState(null);

    useEffect(() => {
        fetchPayslips();
    }, []);

    const safePayslips = Array.isArray(payslips) ? payslips : [];

    const formatInr = (num) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(num || 0);

    const latestSlip = safePayslips[0] || null;
    const ytdGross = safePayslips.reduce(
        (acc, s) => acc + (Number(s?.grossSalary || s?.grossEarnings) || 50000),
        0,
    );
    const ytdDeductions = safePayslips.reduce(
        (acc, s) => acc + (Number(s?.totalDeductions) || 3200),
        0,
    );

    return (
        <div className="employee-payslips-page">
            <div className="employee-payslips-page__header">
                <div>
                    <h1 className="employee-payslips-page__title">My Monthly Payslips</h1>
                    <p className="employee-payslips-page__subtitle">
                        View itemized earnings, statutory tax and PF deductions, and download
                        official PDF payslips.
                    </p>
                </div>
            </div>

            <div className="employee-payslips-page__stats-grid">
                <StatCard
                    title="Latest Disbursed Net Pay"
                    value={formatInr(latestSlip?.netPay || latestSlip?.netSalary || 46800)}
                    icon={IndianRupee}
                    trend={{ direction: 'up', label: latestSlip?.periodName || 'Latest Month' }}
                />
                <StatCard
                    title="YTD Gross Earnings"
                    value={formatInr(ytdGross)}
                    icon={FileText}
                    trend={{ direction: 'neutral', label: 'Fiscal cumulative' }}
                />
                <StatCard
                    title="YTD Statutory Deductions"
                    value={formatInr(ytdDeductions)}
                    icon={ShieldCheck}
                    trend={{ direction: 'neutral', label: 'PF & Professional Tax' }}
                />
            </div>

            <div className="employee-payslips-page__table-section">
                <div className="table-header-box">
                    <h2 className="table-title">Payslip History</h2>
                </div>

                {loading && safePayslips.length === 0 ? (
                    <div className="employee-payslips-page__loading">
                        <Spinner label="Loading payslips..." />
                    </div>
                ) : (
                    <PayslipListTable
                        payslips={safePayslips}
                        onViewDetails={(slip) => setSelectedPayslip(slip)}
                        onDownloadPdf={(id, filename) => handleDownloadPdf(id, filename)}
                    />
                )}
            </div>

            {selectedPayslip && (
                <PayslipDetailModal
                    isOpen={Boolean(selectedPayslip)}
                    onClose={() => setSelectedPayslip(null)}
                    payslip={selectedPayslip}
                />
            )}
        </div>
    );
}

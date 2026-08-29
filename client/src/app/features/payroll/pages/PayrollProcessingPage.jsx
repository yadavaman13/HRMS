import { useState, useEffect, useContext, useMemo } from 'react';
import { PayrollContext } from '../context/payroll.context';
import { usePayroll } from '../hooks/usePayroll';
import PayslipDetailModal from '../components/PayslipDetailModal';
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';
import Button from '@/components/Shared/Buttons/Button/Button';
import Dialog from '@/components/Shared/Feedback/Dialog';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import DatePicker from '@/components/Shared/Form/DatePicker/DatePicker';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import { useToast } from '@/components/Shared/Feedback/Toast';
import { getAvatarUrl } from '@/utils/avatar';
import { Calculator, Lock, Unlock, CheckCircle2, Plus, FileText } from 'lucide-react';
import './PayrollProcessingPage.scss';

export default function PayrollProcessingPage() {
    const { periods, activePeriod, batches, loading } = useContext(PayrollContext);
    const {
        loadPeriods,
        handleCreatePeriod,
        handleCalculatePayroll,
        handleLockPayroll,
        handleUnlockPayroll,
        handleMarkPaid,
        loadBatches,
        loadPayslipById,
    } = usePayroll();
    const { success, error: toastError } = useToast();

    // Modal & Dialog States
    const [isCreatePeriodOpen, setIsCreatePeriodOpen] = useState(false);
    const [periodMonth, setPeriodMonth] = useState('8');
    const [periodYear, setPeriodYear] = useState('2026');
    const [periodStart, setPeriodStart] = useState('2026-08-01');
    const [periodEnd, setPeriodEnd] = useState('2026-08-31');
    const [isSubmittingPeriod, setIsSubmittingPeriod] = useState(false);

    const [isCalculating, setIsCalculating] = useState(false);
    const [isActionPending, setIsActionPending] = useState(false);

    // View Payslip Modal
    const [selectedPayslipId, setSelectedPayslipId] = useState(null);
    const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);

    useEffect(() => {
        loadPeriods();
    }, [loadPeriods]);

    useEffect(() => {
        if (activePeriod?.id) {
            loadBatches(activePeriod.id);
        }
    }, [activePeriod, loadBatches]);

    const handleCreatePeriodSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingPeriod(true);
        try {
            await handleCreatePeriod({
                month: Number(periodMonth),
                year: Number(periodYear),
                periodStart,
                periodEnd,
            });
            success('New payroll processing period initialized.');
            setIsCreatePeriodOpen(false);
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to create period';
            toastError(msg);
        } finally {
            setIsSubmittingPeriod(false);
        }
    };

    const handleRunCalculation = async () => {
        if (!activePeriod) return;
        setIsCalculating(true);
        try {
            await handleCalculatePayroll(activePeriod.id);
            success('Attendance-derived payroll calculation completed for all active employees!');
            loadBatches(activePeriod.id);
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Calculation failed';
            toastError(msg);
        } finally {
            setIsCalculating(false);
        }
    };

    const handleToggleLock = async () => {
        if (!activePeriod) return;
        setIsActionPending(true);
        try {
            if (activePeriod.status === 'locked' || activePeriod.isLocked) {
                await handleUnlockPayroll(activePeriod.id);
                success('Payroll run unlocked for adjustments.');
            } else {
                await handleLockPayroll(activePeriod.id);
                success('Payroll run finalized and locked.');
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Lock toggle failed';
            toastError(msg);
        } finally {
            setIsActionPending(false);
        }
    };

    const handleMarkDisbursed = async () => {
        if (!activePeriod) return;
        setIsActionPending(true);
        try {
            await handleMarkPaid(activePeriod.id);
            success(
                'Payroll run marked as Paid and official salary statements released to employee portals!',
            );
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Payment mark failed';
            toastError(msg);
        } finally {
            setIsActionPending(false);
        }
    };

    const periodOptions = useMemo(() => {
        return periods.map((p) => ({
            value: p.id,
            label: `${p.month}/${p.year} (${p.periodStart} to ${p.periodEnd}) - ${p.status?.toUpperCase() || 'DRAFT'}`,
        }));
    }, [periods]);

    const periodStatus = (activePeriod?.status || 'draft').toLowerCase();
    const isLocked = periodStatus === 'locked' || activePeriod?.isLocked;
    const isPaid = periodStatus === 'paid';

    // Summary totals of current batch
    const batchSummary = useMemo(() => {
        let totalGross = 0;
        let totalNet = 0;
        let totalDeductions = 0;
        batches.forEach((b) => {
            totalGross += Number(b.grossEarnings || b.gross || 0);
            totalNet += Number(b.netPay || b.net || 0);
            totalDeductions += Number(b.totalDeductions || 0);
        });
        return { totalGross, totalNet, totalDeductions, count: batches.length };
    }, [batches]);

    const columns = [
        {
            key: 'employee',
            label: 'Employee',
            render: (_, row) => (
                <div className="emp-cell">
                    <img
                        src={getAvatarUrl(row.profileImage)}
                        alt={row.employeeName}
                        className="emp-avatar"
                    />
                    <div className="emp-names">
                        <span className="emp-name font-semibold">
                            {row.employeeName || `${row.firstName} ${row.lastName}`}
                        </span>
                        <span className="emp-code">{row.employeeCode}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'attendance',
            label: 'Attendance & LOP',
            render: (_, row) => (
                <div className="attendance-cell">
                    <span className="days-worked font-mono font-medium">
                        {row.workedDays || 0} / {row.totalWorkingDays || 22} Days
                    </span>
                    {Number(row.unpaidLeaveDays || row.lopDays) > 0 && (
                        <span className="lop-tag font-mono">
                            LOP: {row.unpaidLeaveDays || row.lopDays}d
                        </span>
                    )}
                </div>
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
            label: 'Deductions (PF+PT+LOP)',
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
            label: 'Net Payable',
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
            key: 'actions',
            label: 'Payslip',
            render: (_, row) => (
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                        setSelectedPayslipId(row.id || row.payslipId);
                        setIsPayslipModalOpen(true);
                    }}
                >
                    <FileText size={13} /> Statement
                </Button>
            ),
        },
    ];

    return (
        <div className="payroll-processing-page">
            {/* Header row */}
            <div className="page-header-row">
                <div>
                    <h1 className="page-title">Payroll Processing Engine</h1>
                    <p className="page-subtitle">
                        Automated monthly salary calculation factoring attendance timesheets, unpaid
                        LOP, and statutory compliance.
                    </p>
                </div>
                <Button variant="primary" onClick={() => setIsCreatePeriodOpen(true)}>
                    <Plus size={16} /> New Pay Period
                </Button>
            </div>

            {/* Period Control Panel */}
            <div className="period-control-card">
                <div className="period-selector-row">
                    <div className="selector-group">
                        <label className="group-label">Active Processing Period</label>
                        <Dropdown
                            options={periodOptions}
                            value={activePeriod?.id || ''}
                            onChange={(val) => {
                                const found = periods.find((p) => p.id === val);
                                if (found) loadBatches(found.id);
                            }}
                            placeholder="Select a pay period"
                        />
                    </div>

                    <div className="period-status-pill-group">
                        <span className={`period-status-badge ${periodStatus}`}>
                            Status: {periodStatus.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Processing Actions Toolbar */}
                <div className="processing-actions-toolbar">
                    <Button
                        variant="primary"
                        onClick={handleRunCalculation}
                        disabled={isCalculating || isLocked || isPaid}
                        loading={isCalculating}
                    >
                        <Calculator size={16} /> Calculate Attendance Payroll
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={handleToggleLock}
                        disabled={isActionPending || isPaid || batches.length === 0}
                        loading={isActionPending}
                    >
                        {isLocked ? (
                            <>
                                <Unlock size={16} /> Unlock Run
                            </>
                        ) : (
                            <>
                                <Lock size={16} /> Lock & Finalize
                            </>
                        )}
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={handleMarkDisbursed}
                        disabled={isActionPending || !isLocked || isPaid}
                        className="disburse-btn"
                    >
                        <CheckCircle2 size={16} /> Release Payslips & Mark Paid
                    </Button>
                </div>

                {/* Batch Aggregates Summary */}
                <div className="batch-summary-tiles-row">
                    <div className="sum-tile">
                        <span className="tile-label">Employees in Batch</span>
                        <span className="tile-value font-mono">{batchSummary.count}</span>
                    </div>
                    <div className="sum-tile">
                        <span className="tile-label">Total Gross Earnings</span>
                        <span className="tile-value font-mono">
                            ₹
                            {batchSummary.totalGross.toLocaleString('en-IN', {
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>
                    <div className="sum-tile">
                        <span className="tile-label">Total Statutory Deductions</span>
                        <span className="tile-value font-mono text-danger">
                            - ₹
                            {batchSummary.totalDeductions.toLocaleString('en-IN', {
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>
                    <div className="sum-tile highlight-tile">
                        <span className="tile-label">Total Net Disbursable</span>
                        <span className="tile-value font-mono text-success">
                            ₹
                            {batchSummary.totalNet.toLocaleString('en-IN', {
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Batches Table Card */}
            <div className="batches-table-card">
                <div className="card-header">
                    <h2>Calculated Salary Statements ({batches.length})</h2>
                </div>

                {loading && batches.length === 0 ? (
                    <Spinner label="Loading payroll batches..." />
                ) : (
                    <AdvancedTable columns={columns} data={batches} pageSize={15} />
                )}
            </div>

            {/* Create Pay Period Dialog */}
            <Dialog
                isOpen={isCreatePeriodOpen}
                onClose={() => setIsCreatePeriodOpen(false)}
                title="Initialize New Pay Period"
                size="md"
                showFooter={false}
            >
                <form onSubmit={handleCreatePeriodSubmit} className="create-period-form">
                    <div className="form-row-2col">
                        <InputField
                            label="Month (1-12)"
                            type="number"
                            value={periodMonth}
                            onChange={(e) => setPeriodMonth(e.target.value)}
                            required
                        />
                        <InputField
                            label="Year"
                            type="number"
                            value={periodYear}
                            onChange={(e) => setPeriodYear(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-row-2col">
                        <DatePicker
                            label="Period Start Date"
                            value={periodStart}
                            onChange={setPeriodStart}
                            required
                        />
                        <DatePicker
                            label="Period End Date"
                            value={periodEnd}
                            onChange={setPeriodEnd}
                            required
                        />
                    </div>

                    <div className="modal-actions-row">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setIsCreatePeriodOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" loading={isSubmittingPeriod}>
                            Create Pay Period
                        </Button>
                    </div>
                </form>
            </Dialog>

            {/* Payslip View Modal */}
            <PayslipDetailModal
                isOpen={isPayslipModalOpen}
                onClose={() => setIsPayslipModalOpen(false)}
                payslipId={selectedPayslipId}
            />
        </div>
    );
}

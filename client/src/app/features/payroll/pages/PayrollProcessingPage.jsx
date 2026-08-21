import { useState, useEffect } from 'react';
import { usePayroll } from '../hooks/usePayroll';
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import Button from '@/components/Shared/Buttons/Button/Button';
import Dialog from '@/components/Shared/Feedback/Dialog/Dialog';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import EmptyState from '@/components/Shared/DataDisplay/EmptyState/EmptyState';
import ToastNotification from '@/components/Shared/Feedback/ToastNotification/ToastNotification';
import { Play, Lock, PlusCircle, Calendar } from 'lucide-react';
import './PayrollProcessingPage.scss';

export default function PayrollProcessingPage() {
    const {
        periods,
        fetchPeriods,
        handleCreatePeriod,
        handleProcessPeriod,
        handleFinalizePeriod,
        loading,
    } = usePayroll();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [actionError, setActionError] = useState('');
    const [actionSuccess, setActionSuccess] = useState('');

    useEffect(() => {
        fetchPeriods();
    }, []);

    const safePeriods = Array.isArray(periods) ? periods : [];

    const monthOptions = [
        { label: 'January', value: 1 },
        { label: 'February', value: 2 },
        { label: 'March', value: 3 },
        { label: 'April', value: 4 },
        { label: 'May', value: 5 },
        { label: 'June', value: 6 },
        { label: 'July', value: 7 },
        { label: 'August', value: 8 },
        { label: 'September', value: 9 },
        { label: 'October', value: 10 },
        { label: 'November', value: 11 },
        { label: 'December', value: 12 },
    ];

    const onCreateSubmit = async (e) => {
        e.preventDefault();
        setActionError('');
        try {
            await handleCreatePeriod({
                month: Number(month),
                year: Number(year),
                name: `${monthOptions.find((m) => m.value === Number(month))?.label} ${year}`,
            });
            setIsCreateModalOpen(false);
            setActionSuccess('Payroll cycle created successfully.');
        } catch (err) {
            setActionError(err.response?.data?.message || err.message || 'Failed to create cycle');
        }
    };

    const onProcessRun = async (periodId) => {
        setActionError('');
        try {
            await handleProcessPeriod(periodId);
            setActionSuccess('Attendance sync & pro-rata payroll calculation completed.');
        } catch (err) {
            setActionError(
                err.response?.data?.message || err.message || 'Payroll calculation failed',
            );
        }
    };

    const onFinalizeRun = async (periodId) => {
        setActionError('');
        try {
            await handleFinalizePeriod(periodId);
            setActionSuccess(
                'Payroll cycle frozen and finalized into immutable payslip snapshots.',
            );
        } catch (err) {
            setActionError(err.response?.data?.message || err.message || 'Finalization failed');
        }
    };

    const formatInr = (num) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(num || 0);

    return (
        <div className="payroll-processing-page">
            <div className="payroll-processing-page__header">
                <div>
                    <h1 className="payroll-processing-page__title">
                        Payroll Processing & Finalization
                    </h1>
                    <p className="payroll-processing-page__subtitle">
                        Attendance-derived compensation engine with automated unpaid absence (LWP)
                        deduction and immutable snapshot state machine.
                    </p>
                </div>

                <Button
                    variant="primary"
                    icon={PlusCircle}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Create Monthly Cycle
                </Button>
            </div>

            {actionSuccess && (
                <ToastNotification
                    variant="success"
                    title="Success"
                    message={actionSuccess}
                    onClose={() => setActionSuccess('')}
                />
            )}
            {actionError && (
                <ToastNotification
                    variant="error"
                    title="Notice"
                    message={actionError}
                    onClose={() => setActionError('')}
                />
            )}

            <div className="payroll-processing-page__content">
                {loading && safePeriods.length === 0 ? (
                    <div className="payroll-processing-page__loading">
                        <Spinner label="Loading payroll cycles..." />
                    </div>
                ) : safePeriods.length === 0 ? (
                    <EmptyState
                        icon={Calendar}
                        title="No payroll periods"
                        description="Start a new monthly payroll run by clicking the button above."
                        action={
                            <Button
                                variant="primary"
                                icon={PlusCircle}
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                Create First Cycle
                            </Button>
                        }
                    />
                ) : (
                    <div className="periods-table-wrap">
                        <table className="periods-table">
                            <thead>
                                <tr>
                                    <th>Cycle Name</th>
                                    <th>Headcount</th>
                                    <th>Gross Disbursed</th>
                                    <th>Total Deductions</th>
                                    <th>Net Payout</th>
                                    <th>State Machine</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {safePeriods.map((p, idx) => (
                                    <tr key={p?.id || idx}>
                                        <td>
                                            <strong>{p?.name || `${p?.month}/${p?.year}`}</strong>
                                            <div className="cycle-sub">
                                                Working Days: {p?.workingDays || 22}
                                            </div>
                                        </td>
                                        <td className="font-mono">
                                            {p?.employeeCount || p?.totalEmployees || 0}
                                        </td>
                                        <td className="font-mono">
                                            {formatInr(p?.totalGross || p?.grossSalary || 0)}
                                        </td>
                                        <td className="font-mono text-danger">
                                            −{formatInr(p?.totalDeductions || 0)}
                                        </td>
                                        <td className="font-mono font-bold text-success">
                                            {formatInr(p?.totalNet || p?.netSalary || 0)}
                                        </td>
                                        <td>
                                            <Badge
                                                variant={
                                                    p?.status === 'FINALIZED' ||
                                                    p?.status === 'LOCKED'
                                                        ? 'success'
                                                        : p?.status === 'CALCULATED'
                                                          ? 'info'
                                                          : 'warning'
                                                }
                                                size="sm"
                                            >
                                                {p?.status || 'DRAFT'}
                                            </Badge>
                                        </td>
                                        <td className="text-right">
                                            <div className="period-action-group">
                                                {p?.status !== 'FINALIZED' &&
                                                    p?.status !== 'LOCKED' && (
                                                        <>
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                icon={Play}
                                                                onClick={() => onProcessRun(p?.id)}
                                                                loading={loading}
                                                            >
                                                                {p?.status === 'CALCULATED'
                                                                    ? 'Recalculate'
                                                                    : 'Process Run'}
                                                            </Button>
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                icon={Lock}
                                                                onClick={() => onFinalizeRun(p?.id)}
                                                                loading={loading}
                                                            >
                                                                Finalize & Lock
                                                            </Button>
                                                        </>
                                                    )}
                                                {(p?.status === 'FINALIZED' ||
                                                    p?.status === 'LOCKED') && (
                                                    <span className="frozen-tag">
                                                        🔒 Frozen Snapshot
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isCreateModalOpen && (
                <Dialog
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    title="Initialize Monthly Payroll Cycle"
                    size="sm"
                >
                    <form onSubmit={onCreateSubmit} className="create-period-form">
                        <Dropdown
                            label="Month *"
                            options={monthOptions}
                            value={month}
                            onChange={(val) => setMonth(val)}
                        />
                        <InputField
                            label="Year *"
                            type="number"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            required
                        />

                        <div className="create-period-actions">
                            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary">
                                Create Cycle
                            </Button>
                        </div>
                    </form>
                </Dialog>
            )}
        </div>
    );
}

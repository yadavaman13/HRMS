import { useState, useEffect, useContext } from 'react';
import { AttendanceContext } from '../context/attendance.context';
import { useAttendance } from '../hooks/useAttendance';
import AttendancePunchWidget from '../components/AttendancePunchWidget';
import StatCard from '@/components/Shared/DataDisplay/StatCard/StatCard';
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';
import Dialog from '@/components/Shared/Feedback/Dialog';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Button from '@/components/Shared/Buttons/Button/Button';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import { useToast } from '@/components/Shared/Feedback/Toast';
import { Clock, CalendarOff, Calendar, PlusCircle, CheckCircle2, FileEdit } from 'lucide-react';
import './EmployeeAttendancePage.scss';

export default function EmployeeAttendancePage() {
    const { myRecords, mySummary, loading } = useContext(AttendanceContext);
    const { loadMyAttendance, loadMySummary, handleRequestAdjustment } = useAttendance();
    const { success, error: toastError } = useToast();

    const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
    const [selectedRecordForAdjustment, setSelectedRecordForAdjustment] = useState(null);
    const [adjustedCheckIn, setAdjustedCheckIn] = useState('');
    const [adjustedCheckOut, setAdjustedCheckOut] = useState('');
    const [adjustmentReason, setAdjustmentReason] = useState('');
    const [isSubmittingAdjustment, setIsSubmittingAdjustment] = useState(false);

    useEffect(() => {
        loadMyAttendance();
        loadMySummary();
    }, [loadMyAttendance, loadMySummary]);

    const handleOpenAdjustment = (record = null) => {
        setSelectedRecordForAdjustment(record);
        if (record) {
            setAdjustedCheckIn(record.firstCheckIn ? record.firstCheckIn.slice(11, 16) : '09:30');
            setAdjustedCheckOut(record.lastCheckOut ? record.lastCheckOut.slice(11, 16) : '18:30');
        } else {
            setAdjustedCheckIn('09:30');
            setAdjustedCheckOut('18:30');
        }
        setAdjustmentReason('');
        setIsAdjustmentModalOpen(true);
    };

    const handleSubmitAdjustment = async (e) => {
        e.preventDefault();
        if (!adjustmentReason.trim()) {
            toastError('Please provide a reason for the attendance adjustment.');
            return;
        }

        const attendanceId = selectedRecordForAdjustment?.id || myRecords[0]?.id;
        if (!attendanceId) {
            toastError('No attendance record selected for adjustment.');
            return;
        }

        setIsSubmittingAdjustment(true);
        try {
            await handleRequestAdjustment(attendanceId, {
                proposedCheckIn: adjustedCheckIn,
                proposedCheckOut: adjustedCheckOut,
                reason: adjustmentReason.trim(),
            });
            success('Attendance regularization request submitted for supervisor review!');
            setIsAdjustmentModalOpen(false);
            loadMyAttendance();
        } catch (err) {
            const msg =
                err.response?.data?.message || err.message || 'Regularization request failed';
            toastError(msg);
        } finally {
            setIsSubmittingAdjustment(false);
        }
    };

    const formatMinutesToHours = (minutes) => {
        if (!minutes || isNaN(minutes)) return '0h 0m';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    const columns = [
        {
            key: 'attendanceDate',
            label: 'Date',
            render: (val) => (
                <span className="date-text font-medium">
                    {new Date(val).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </span>
            ),
        },
        {
            key: 'checkIn',
            label: 'Check-In',
            render: (_, row) => (
                <span className="time-text">
                    {row.firstCheckIn
                        ? new Date(row.firstCheckIn).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                          })
                        : '—'}
                </span>
            ),
        },
        {
            key: 'checkOut',
            label: 'Check-Out',
            render: (_, row) => (
                <span className="time-text">
                    {row.lastCheckOut
                        ? new Date(row.lastCheckOut).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                          })
                        : '—'}
                </span>
            ),
        },
        {
            key: 'totalWorkMinutes',
            label: 'Net Work Duration',
            render: (val) => (
                <span className="duration-text font-semibold">{formatMinutesToHours(val)}</span>
            ),
        },
        {
            key: 'overtimeMinutes',
            label: 'Overtime',
            render: (val) => (
                <span className={`overtime-text ${Number(val) > 0 ? 'has-ot' : ''}`}>
                    {val && Number(val) > 0 ? formatMinutesToHours(val) : '0h'}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (val) => {
                const s = (val || 'absent').toLowerCase();
                const isPresent = s === 'present';
                const isLeave = s === 'leave' || s === 'on_leave';
                const isHalf = s === 'half_day';
                const badgeClass = isPresent
                    ? 'badge-present'
                    : isLeave
                      ? 'badge-leave'
                      : isHalf
                        ? 'badge-half'
                        : 'badge-absent';
                const label = isPresent
                    ? 'Present'
                    : isLeave
                      ? 'On Leave'
                      : isHalf
                        ? 'Half Day'
                        : 'Absent';

                return (
                    <span className={`attendance-badge ${badgeClass}`}>
                        <span className="badge-dot" />
                        {label}
                    </span>
                );
            },
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <Button variant="ghost" size="xs" onClick={() => handleOpenAdjustment(row)}>
                    <FileEdit size={13} /> Regularize
                </Button>
            ),
        },
    ];

    const summary = mySummary || {};

    return (
        <div className="employee-attendance-page">
            {/* Page Header */}
            <div className="attendance-header-row">
                <div>
                    <h1 className="page-title">My Attendance & Timesheets</h1>
                    <p className="page-subtitle">
                        Track daily punch hours, monthly shifts, working duration, and request
                        attendance regularization.
                    </p>
                </div>
                <Button variant="primary" onClick={() => handleOpenAdjustment()}>
                    <PlusCircle size={16} /> Request Regularization
                </Button>
            </div>

            {/* Top Grid: Punch Widget & Monthly Aggregates */}
            <div className="attendance-top-grid">
                <div className="punch-column">
                    <AttendancePunchWidget onPunchSuccess={loadMyAttendance} />
                </div>

                <div className="summary-cards-column">
                    <div className="stat-cards-grid">
                        <StatCard
                            title="Total Worked Hours"
                            value={`${summary.totalWorkedHours || 0} hrs`}
                            icon={<Clock />}
                            subtitle={`${summary.presentDays || 0} days present this month`}
                        />
                        <StatCard
                            title="Overtime Hours"
                            value={`${summary.totalOvertimeHours || 0} hrs`}
                            icon={<CheckCircle2 />}
                            subtitle="Recorded overtime"
                        />
                        <StatCard
                            title="Leave Days Taken"
                            value={summary.leaveDays || 0}
                            icon={<CalendarOff />}
                            subtitle="Approved paid & unpaid leaves"
                        />
                    </div>
                </div>
            </div>

            {/* Daily Timesheet Table Card */}
            <div className="timesheet-table-card">
                <div className="card-header">
                    <div className="title-group">
                        <Calendar size={18} className="header-icon" />
                        <h2>Monthly Timesheet History</h2>
                    </div>
                </div>

                {loading && myRecords.length === 0 ? (
                    <Spinner label="Loading attendance timesheets..." />
                ) : (
                    <AdvancedTable columns={columns} data={myRecords} pageSize={15} />
                )}
            </div>

            {/* Regularization Modal Dialog */}
            <Dialog
                isOpen={isAdjustmentModalOpen}
                onClose={() => setIsAdjustmentModalOpen(false)}
                title="Request Attendance Regularization"
                size="md"
                showFooter={false}
            >
                <form onSubmit={handleSubmitAdjustment} className="regularization-form">
                    <p className="dialog-desc">
                        Submit a correction request for missed check-ins, early clock-outs, or
                        on-duty client visits.
                    </p>

                    <div className="form-row-2col">
                        <InputField
                            label="Corrected Check-In Time"
                            type="time"
                            value={adjustedCheckIn}
                            onChange={(e) => setAdjustedCheckIn(e.target.value)}
                            required
                        />
                        <InputField
                            label="Corrected Check-Out Time"
                            type="time"
                            value={adjustedCheckOut}
                            onChange={(e) => setAdjustedCheckOut(e.target.value)}
                            required
                        />
                    </div>

                    <InputField
                        label="Reason for Regularization"
                        value={adjustmentReason}
                        onChange={(e) => setAdjustmentReason(e.target.value)}
                        placeholder="e.g. Device biometric glitch, on-site client visit, biometric forgotten"
                        required
                    />

                    <div className="dialog-actions-row">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setIsAdjustmentModalOpen(false)}
                            disabled={isSubmittingAdjustment}
                        >
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" loading={isSubmittingAdjustment}>
                            Submit Regularization Request
                        </Button>
                    </div>
                </form>
            </Dialog>
        </div>
    );
}

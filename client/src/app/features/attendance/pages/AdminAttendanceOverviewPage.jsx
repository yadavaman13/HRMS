import { useState, useEffect, useContext } from 'react';
import { AttendanceContext } from '../context/attendance.context';
import { useAttendance } from '../hooks/useAttendance';
import StatCard from '@/components/Shared/DataDisplay/StatCard/StatCard';
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';
import DatePicker from '@/components/Shared/Form/DatePicker/DatePicker';
import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import Dialog from '@/components/Shared/Feedback/Dialog';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import { useToast } from '@/components/Shared/Feedback/Toast';
import { getAvatarUrl } from '@/utils/avatar';
import { Users, UserCheck, Clock, CalendarOff, Check, X } from 'lucide-react';
import './AdminAttendanceOverviewPage.scss';

export default function AdminAttendanceOverviewPage() {
    const { companyRecords, companySummary, adjustments, loading } = useContext(AttendanceContext);
    const { loadCompanyAttendance, loadCompanySummary, loadAdjustments, handleReviewAdjustment } =
        useAttendance();
    const { success, error: toastError } = useToast();

    const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'adjustments'
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [selectedStatus, setSelectedStatus] = useState('');

    // Review adjustment dialog state
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedAdjustment, setSelectedAdjustment] = useState(null);
    const [reviewAction, setReviewAction] = useState('approved'); // 'approved' | 'rejected'
    const [reviewRemarks, setReviewRemarks] = useState('');
    const [isReviewing, setIsReviewing] = useState(false);

    useEffect(() => {
        loadCompanyAttendance({ date: selectedDate, status: selectedStatus || undefined });
        loadCompanySummary();
        loadAdjustments();
    }, [selectedDate, selectedStatus, loadCompanyAttendance, loadCompanySummary, loadAdjustments]);

    const handleOpenReview = (adj, action) => {
        setSelectedAdjustment(adj);
        setReviewAction(action);
        setReviewRemarks('');
        setReviewModalOpen(true);
    };

    const handleConfirmReview = async () => {
        if (!selectedAdjustment) return;

        setIsReviewing(true);
        try {
            await handleReviewAdjustment(selectedAdjustment.id, {
                status: reviewAction,
                reviewRemarks: reviewRemarks.trim() || undefined,
            });
            success(`Regularization request ${reviewAction} successfully.`);
            setReviewModalOpen(false);
            loadAdjustments();
            loadCompanyAttendance({ date: selectedDate });
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to review adjustment';
            toastError(msg);
        } finally {
            setIsReviewing(false);
        }
    };

    const formatMinutesToHours = (minutes) => {
        if (!minutes || isNaN(minutes)) return '0h 0m';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    // Daily Attendance Columns
    const dailyColumns = [
        {
            key: 'employee',
            label: 'Employee',
            render: (_, row) => (
                <div className="emp-meta-cell">
                    <img
                        src={getAvatarUrl(row.profileImage)}
                        alt={row.employeeName}
                        className="emp-avatar"
                    />
                    <div className="emp-names">
                        <span className="emp-full-name">
                            {row.employeeName || `${row.firstName} ${row.lastName}`}
                        </span>
                        <span className="emp-code">{row.employeeCode}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'department',
            label: 'Department',
            render: (_, row) => (
                <span className="dept-text">{row.departmentName || 'General'}</span>
            ),
        },
        {
            key: 'checkIn',
            label: 'Check-In',
            render: (_, row) => (
                <span className="time-text font-mono">
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
                <span className="time-text font-mono">
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
            key: 'workDuration',
            label: 'Work Duration',
            render: (_, row) => (
                <span className="duration-text font-mono font-medium">
                    {formatMinutesToHours(row.totalWorkMinutes)}
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
                    <span className={`status-pill ${badgeClass}`}>
                        <span className="pill-dot" />
                        {label}
                    </span>
                );
            },
        },
    ];

    // Regularization Requests Columns
    const adjustmentColumns = [
        {
            key: 'employee',
            label: 'Employee',
            render: (_, row) => (
                <div className="emp-names">
                    <span className="emp-full-name">{row.employeeName}</span>
                    <span className="emp-code">{row.employeeCode}</span>
                </div>
            ),
        },
        {
            key: 'date',
            label: 'Attendance Date',
            render: (_, row) => (
                <span className="font-medium">
                    {new Date(row.attendanceDate).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                    })}
                </span>
            ),
        },
        {
            key: 'proposedTimes',
            label: 'Requested Punch Times',
            render: (_, row) => (
                <span className="font-mono">
                    {row.proposedCheckIn || '—'} to {row.proposedCheckOut || '—'}
                </span>
            ),
        },
        {
            key: 'reason',
            label: 'Reason for Adjustment',
            render: (val) => <span className="reason-text">{val}</span>,
        },
        {
            key: 'status',
            label: 'Review Status',
            render: (val) => {
                const isPending = val === 'pending';
                const isApproved = val === 'approved';
                return (
                    <span
                        className={`review-badge ${isPending ? 'pending' : isApproved ? 'approved' : 'rejected'}`}
                    >
                        {val ? val.toUpperCase() : 'PENDING'}
                    </span>
                );
            },
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => {
                if (row.status !== 'pending' && row.status !== undefined) {
                    return <span className="text-secondary text-xs">Reviewed</span>;
                }
                return (
                    <div className="review-action-btns">
                        <button
                            className="review-btn approve-btn"
                            title="Approve"
                            onClick={() => handleOpenReview(row, 'approved')}
                        >
                            <Check size={14} /> Approve
                        </button>
                        <button
                            className="review-btn reject-btn"
                            title="Reject"
                            onClick={() => handleOpenReview(row, 'rejected')}
                        >
                            <X size={14} /> Reject
                        </button>
                    </div>
                );
            },
        },
    ];

    const sum = companySummary || {};

    return (
        <div className="admin-attendance-page">
            {/* Page Title & KPI Cards */}
            <div className="page-header-block">
                <div>
                    <h1 className="page-title">Company Attendance Oversight</h1>
                    <p className="page-subtitle">
                        Monitor daily workforce punctuality, shift hours, and approve attendance
                        regularization requests.
                    </p>
                </div>
            </div>

            <div className="attendance-kpi-grid">
                <StatCard
                    title="Total Scheduled Today"
                    value={sum.totalEmployees || 0}
                    icon={<Users />}
                    subtitle="Active workforce"
                />
                <StatCard
                    title="Present Today"
                    value={sum.presentCount || 0}
                    icon={<UserCheck />}
                    subtitle={`${sum.attendanceRate || 0}% attendance rate`}
                />
                <StatCard
                    title="Late Arrivals"
                    value={sum.lateCount || 0}
                    icon={<Clock />}
                    subtitle="Clocked after shift grace"
                />
                <StatCard
                    title="Regularization Queue"
                    value={adjustments.filter((a) => a.status === 'pending' || !a.status).length}
                    icon={<CalendarOff />}
                    subtitle="Awaiting HR approval"
                    highlight={Boolean(adjustments.some((a) => a.status === 'pending'))}
                />
            </div>

            {/* Sub-Tabs Bar */}
            <div className="tabs-navigation-bar">
                <button
                    className={`nav-tab-btn ${activeTab === 'daily' ? 'active' : ''}`}
                    onClick={() => setActiveTab('daily')}
                >
                    <Clock size={16} /> Daily Attendance Feed
                </button>
                <button
                    className={`nav-tab-btn ${activeTab === 'adjustments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('adjustments')}
                >
                    <CalendarOff size={16} /> Regularization Requests (
                    {adjustments.filter((a) => a.status === 'pending' || !a.status).length})
                </button>
            </div>

            {/* Tab 1: Daily Attendance Feed */}
            {activeTab === 'daily' && (
                <div className="tab-pane-container">
                    <div className="filter-controls-row">
                        <div className="date-picker-wrap">
                            <DatePicker value={selectedDate} onChange={setSelectedDate} />
                        </div>
                        <div className="status-dropdown-wrap">
                            <Dropdown
                                options={[
                                    { value: '', label: 'All Statuses' },
                                    { value: 'present', label: 'Present' },
                                    { value: 'absent', label: 'Absent' },
                                    { value: 'leave', label: 'On Leave' },
                                    { value: 'half_day', label: 'Half Day' },
                                ]}
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                                placeholder="Status Filter"
                            />
                        </div>
                    </div>

                    <div className="table-card">
                        {loading && companyRecords.length === 0 ? (
                            <Spinner label="Loading company attendance records..." />
                        ) : (
                            <AdvancedTable
                                columns={dailyColumns}
                                data={companyRecords}
                                pageSize={15}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Tab 2: Regularization Requests */}
            {activeTab === 'adjustments' && (
                <div className="tab-pane-container">
                    <div className="table-card">
                        {loading && adjustments.length === 0 ? (
                            <Spinner label="Loading regularization requests..." />
                        ) : (
                            <AdvancedTable
                                columns={adjustmentColumns}
                                data={adjustments}
                                pageSize={15}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Review Regularization Modal */}
            <Dialog
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                title={`${reviewAction === 'approved' ? 'Approve' : 'Reject'} Regularization Request?`}
                variant={reviewAction === 'approved' ? 'default' : 'danger'}
                confirmText={reviewAction === 'approved' ? 'Approve Correction' : 'Reject Request'}
                onConfirm={handleConfirmReview}
            >
                <div className="review-dialog-content">
                    <p>
                        Are you sure you want to <strong>{reviewAction}</strong> the regularization
                        request for <strong>{selectedAdjustment?.employeeName}</strong> on{' '}
                        {selectedAdjustment?.attendanceDate}?
                    </p>
                    <InputField
                        label="Review Remarks (Optional)"
                        value={reviewRemarks}
                        onChange={(e) => setReviewRemarks(e.target.value)}
                        placeholder="e.g. Approved per supervisor confirmation"
                    />
                </div>
            </Dialog>
        </div>
    );
}

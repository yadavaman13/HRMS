import { useState, useEffect } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import StatCard from '@/components/Shared/DataDisplay/StatCard/StatCard';
import EmployeeStatusDot from '@/app/features/employees/components/EmployeeStatusDot/EmployeeStatusDot';
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import Button from '@/components/Shared/Buttons/Button/Button';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import EmptyState from '@/components/Shared/DataDisplay/EmptyState/EmptyState';
import { Users, CheckCircle, Clock, AlertTriangle, Calendar, Check, X } from 'lucide-react';
import './AdminAttendanceOverviewPage.scss';

export default function AdminAttendanceOverviewPage() {
    const {
        companySummary,
        companyRecords,
        adjustments,
        fetchCompanySummary,
        fetchCompanyAttendance,
        fetchAdjustments,
        handleReviewAdjustment,
        loading,
    } = useAttendance();

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedDept, setSelectedDept] = useState('');
    const [activeView, setActiveView] = useState('logs'); // 'logs' | 'adjustments'

    useEffect(() => {
        fetchCompanySummary();
        fetchCompanyAttendance({ date: selectedDate, department: selectedDept || undefined });
        fetchAdjustments();
    }, [selectedDate, selectedDept]);

    const safeRecords = Array.isArray(companyRecords) ? companyRecords : [];
    const safeAdjustments = Array.isArray(adjustments) ? adjustments : [];

    const departmentOptions = [
        { label: 'All Departments', value: '' },
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Product & Design', value: 'Product & Design' },
        { label: 'Human Resources', value: 'Human Resources' },
        { label: 'Finance & Accounts', value: 'Finance & Accounts' },
    ];

    const presentCount =
        companySummary?.present ??
        safeRecords.filter((r) => (r?.status || '').toUpperCase() === 'PRESENT').length;
    const leaveCount =
        companySummary?.leave ??
        safeRecords.filter((r) => ['ON_LEAVE', 'LEAVE'].includes((r?.status || '').toUpperCase()))
            .length;
    const absentCount =
        companySummary?.absent ??
        safeRecords.filter((r) => (r?.status || '').toUpperCase() === 'ABSENT').length;
    const totalHeadcount =
        companySummary?.totalHeadcount ?? (presentCount + leaveCount + absentCount || 10);

    const onApproveAdjustment = async (id) => {
        try {
            await handleReviewAdjustment(id, { status: 'APPROVED' });
        } catch (err) {
            console.error(err);
        }
    };

    const onRejectAdjustment = async (id) => {
        try {
            await handleReviewAdjustment(id, { status: 'REJECTED' });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="admin-attendance-page">
            <div className="admin-attendance-page__header">
                <div>
                    <h1 className="admin-attendance-page__title">Company Attendance Overview</h1>
                    <p className="admin-attendance-page__subtitle">
                        Real-time workforce presence monitoring, daily timesheet logs, and
                        regularization approvals.
                    </p>
                </div>

                <div className="admin-attendance-page__view-tabs">
                    <button
                        className={`view-tab-btn ${activeView === 'logs' ? 'active' : ''}`}
                        onClick={() => setActiveView('logs')}
                    >
                        Attendance Records
                    </button>
                    <button
                        className={`view-tab-btn ${activeView === 'adjustments' ? 'active' : ''}`}
                        onClick={() => setActiveView('adjustments')}
                    >
                        Regularization Requests (
                        {safeAdjustments.filter((a) => a?.status === 'PENDING').length})
                    </button>
                </div>
            </div>

            <div className="admin-attendance-page__stats-grid">
                <StatCard
                    title="Total Workforce"
                    value={totalHeadcount}
                    icon={Users}
                    trend={{ direction: 'neutral', label: 'Active employees' }}
                />
                <StatCard
                    title="Present Today"
                    value={presentCount}
                    icon={CheckCircle}
                    trend={{
                        direction: 'up',
                        label: `${Math.round((presentCount / (totalHeadcount || 1)) * 100)}% attendance rate`,
                    }}
                />
                <StatCard
                    title="On Approved Leave"
                    value={leaveCount}
                    icon={Calendar}
                    trend={{ direction: 'neutral', label: 'Authorized absence' }}
                />
                <StatCard
                    title="Unexcused Absences"
                    value={absentCount}
                    icon={AlertTriangle}
                    trend={{
                        direction: absentCount > 0 ? 'down' : 'up',
                        label: absentCount === 0 ? 'Zero unexcused' : 'Action required',
                    }}
                />
            </div>

            {activeView === 'logs' ? (
                <div className="admin-attendance-page__table-section">
                    <div className="table-toolbar">
                        <div className="filters-row">
                            <InputField
                                label="Date"
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                            <Dropdown
                                label="Department"
                                options={departmentOptions}
                                value={selectedDept}
                                onChange={(val) => setSelectedDept(val)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="admin-attendance-page__loading">
                            <Spinner label="Loading records..." />
                        </div>
                    ) : safeRecords.length === 0 ? (
                        <EmptyState
                            icon={Calendar}
                            title="No attendance entries found"
                            description="No employee clock-in events recorded for this selected date and filter."
                        />
                    ) : (
                        <div className="records-table-wrap">
                            <table className="admin-records-table">
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>Employee</th>
                                        <th>Department</th>
                                        <th>Check In</th>
                                        <th>Check Out</th>
                                        <th>Net Hours</th>
                                        <th>Overtime</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {safeRecords.map((r, idx) => (
                                        <tr key={r?.id || idx}>
                                            <td>
                                                <EmployeeStatusDot
                                                    status={r?.status || 'PRESENT'}
                                                    showLabel
                                                />
                                            </td>
                                            <td>
                                                <strong>
                                                    {r?.employeeName ||
                                                        r?.employee?.fullName ||
                                                        `${r?.employee?.firstName || ''} ${r?.employee?.lastName || ''}`.trim() ||
                                                        'Employee'}
                                                </strong>
                                                <div className="code-sub font-mono">
                                                    {r?.employeeCode ||
                                                        r?.employee?.employeeCode ||
                                                        'EMP-N/A'}
                                                </div>
                                            </td>
                                            <td>
                                                {r?.department ||
                                                    r?.employee?.department ||
                                                    'General'}
                                            </td>
                                            <td className="font-mono">
                                                {r?.checkIn
                                                    ? new Date(r.checkIn).toLocaleTimeString([], {
                                                          hour: '2-digit',
                                                          minute: '2-digit',
                                                      })
                                                    : '--:--'}
                                            </td>
                                            <td className="font-mono">
                                                {r?.checkOut
                                                    ? new Date(r.checkOut).toLocaleTimeString([], {
                                                          hour: '2-digit',
                                                          minute: '2-digit',
                                                      })
                                                    : '--:--'}
                                            </td>
                                            <td className="font-mono font-medium">
                                                {r?.workDurationMinutes
                                                    ? `${Math.floor(r.workDurationMinutes / 60)}h ${r.workDurationMinutes % 60}m`
                                                    : '--'}
                                            </td>
                                            <td className="font-mono">
                                                {r?.overtimeMinutes > 0
                                                    ? `${Math.floor(r.overtimeMinutes / 60)}h ${r.overtimeMinutes % 60}m`
                                                    : '0h 0m'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <div className="admin-attendance-page__adjustments-section">
                    {safeAdjustments.length === 0 ? (
                        <EmptyState
                            icon={Clock}
                            title="No pending adjustment requests"
                            description="All employee regularization requests have been reviewed."
                        />
                    ) : (
                        <div className="records-table-wrap">
                            <table className="admin-records-table">
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Date</th>
                                        <th>Proposed In/Out</th>
                                        <th>Reason</th>
                                        <th>Status</th>
                                        <th className="text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {safeAdjustments.map((adj, idx) => (
                                        <tr key={adj?.id || idx}>
                                            <td>
                                                <strong>
                                                    {adj?.employeeName ||
                                                        `${adj?.employee?.firstName || ''} ${adj?.employee?.lastName || ''}`.trim() ||
                                                        'Employee'}
                                                </strong>
                                            </td>
                                            <td>{adj?.date || 'N/A'}</td>
                                            <td className="font-mono">
                                                {adj?.proposedCheckIn
                                                    ? new Date(
                                                          adj.proposedCheckIn,
                                                      ).toLocaleTimeString([], {
                                                          hour: '2-digit',
                                                          minute: '2-digit',
                                                      })
                                                    : '--:--'}
                                                {' → '}
                                                {adj?.proposedCheckOut
                                                    ? new Date(
                                                          adj.proposedCheckOut,
                                                      ).toLocaleTimeString([], {
                                                          hour: '2-digit',
                                                          minute: '2-digit',
                                                      })
                                                    : '--:--'}
                                            </td>
                                            <td>{adj?.reason || 'No reason specified'}</td>
                                            <td>
                                                <Badge
                                                    variant={
                                                        adj?.status === 'APPROVED'
                                                            ? 'success'
                                                            : adj?.status === 'REJECTED'
                                                              ? 'danger'
                                                              : 'warning'
                                                    }
                                                    size="sm"
                                                >
                                                    {adj?.status || 'PENDING'}
                                                </Badge>
                                            </td>
                                            <td className="text-right">
                                                {adj?.status === 'PENDING' && (
                                                    <div className="action-btn-group">
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            icon={Check}
                                                            onClick={() =>
                                                                onApproveAdjustment(adj?.id)
                                                            }
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            icon={X}
                                                            onClick={() =>
                                                                onRejectAdjustment(adj?.id)
                                                            }
                                                        >
                                                            Reject
                                                        </Button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

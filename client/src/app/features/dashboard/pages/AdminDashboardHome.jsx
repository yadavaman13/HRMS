import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { DashboardContext } from '../context/dashboard.context';
import { useDashboard } from '../hooks/useDashboard';
import StatCard from '@/components/Shared/DataDisplay/StatCard/StatCard';
import Button from '@/components/Shared/Buttons/Button/Button';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import {
    Users,
    UserCheck,
    CalendarOff,
    Clock,
    DollarSign,
    CheckCircle2,
    Calendar,
    ArrowRight,
    Building2,
} from 'lucide-react';
import './AdminDashboardHome.scss';

export default function AdminDashboardHome() {
    const navigate = useNavigate();
    const { adminMetrics, loading, error } = useContext(DashboardContext);
    const { loadAdminDashboard } = useDashboard();

    useEffect(() => {
        loadAdminDashboard();
    }, [loadAdminDashboard]);

    if (loading && !adminMetrics) {
        return <Spinner label="Loading Executive Dashboard..." fullScreen={false} />;
    }

    const {
        headcount = {},
        todayAttendance = {},
        pendingQueues = {},
        payrollMetrics = null,
        upcomingHolidays = [],
        departmentBreakdown = [],
        past7DaysAttendance = [],
    } = adminMetrics || {};

    const presentCount = todayAttendance.present || 0;
    const absentCount = todayAttendance.absent || 0;
    const onLeaveCount = todayAttendance.onLeave || 0;
    const halfDayCount = todayAttendance.halfDay || 0;
    const lateCount = todayAttendance.late || 0;
    const totalTodayRecords = todayAttendance.totalRecords || headcount.active || 0;
    const attendancePercentage =
        totalTodayRecords > 0 ? Math.round((presentCount / totalTodayRecords) * 100) : 0;

    return (
        <div className="admin-dashboard-container">
            {/* Header section */}
            <div className="dashboard-header-bar">
                <div className="welcome-text">
                    <h1 className="page-title">Executive Workforce Dashboard</h1>
                    <p className="page-subtitle">
                        Real-time overview of attendance, team headcount, leave requests, and
                        payroll operations.
                    </p>
                </div>
                <div className="quick-actions">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/dashboard/admin/attendance')}
                    >
                        <Clock size={16} /> Attendance Oversight
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => navigate('/dashboard/admin/employees')}
                    >
                        <Users size={16} /> Manage Employees
                    </Button>
                </div>
            </div>

            {/* Top KPI Cards Grid */}
            <div className="kpi-grid">
                <StatCard
                    title="Total Employees"
                    value={headcount.total || 0}
                    icon={<Users />}
                    subtitle={`${headcount.active || 0} active • ${headcount.probation || 0} probation`}
                />
                <StatCard
                    title="Today's Present Rate"
                    value={`${attendancePercentage}%`}
                    icon={<UserCheck />}
                    subtitle={`${presentCount} present of ${totalTodayRecords} scheduled`}
                />
                <StatCard
                    title="Pending Leave Requests"
                    value={pendingQueues.leavesCount || 0}
                    icon={<CalendarOff />}
                    subtitle="Requires HR / Manager review"
                    highlight={Boolean(pendingQueues.leavesCount > 0)}
                />
                <StatCard
                    title="Active Payroll Period"
                    value={
                        payrollMetrics?.period?.status
                            ? payrollMetrics.period.status.toUpperCase()
                            : 'NO RUN'
                    }
                    icon={<DollarSign />}
                    subtitle={
                        payrollMetrics?.summary?.totalNetPay
                            ? `Net: ₹${Number(payrollMetrics.summary.totalNetPay).toLocaleString('en-IN')}`
                            : 'Awaiting calculation'
                    }
                />
            </div>

            {/* Mid Section: Today's Live Attendance & Pending Approvals */}
            <div className="dashboard-mid-grid">
                {/* Live Attendance Breakdown Card */}
                <div className="dashboard-card live-attendance-card">
                    <div className="card-header">
                        <div className="title-group">
                            <Clock className="header-icon" size={18} />
                            <h2>Today's Attendance Status</h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/dashboard/admin/attendance')}
                        >
                            View All <ArrowRight size={14} />
                        </Button>
                    </div>

                    <div className="attendance-pills-row">
                        <div className="attendance-pill status-present">
                            <span className="dot" />
                            <span className="count">{presentCount}</span>
                            <span className="label">Present</span>
                        </div>
                        <div className="attendance-pill status-leave">
                            <span className="dot" />
                            <span className="count">{onLeaveCount}</span>
                            <span className="label">On Leave</span>
                        </div>
                        <div className="attendance-pill status-absent">
                            <span className="dot" />
                            <span className="count">{absentCount}</span>
                            <span className="label">Absent</span>
                        </div>
                        <div className="attendance-pill status-halfday">
                            <span className="dot" />
                            <span className="count">{halfDayCount}</span>
                            <span className="label">Half Day</span>
                        </div>
                        <div className="attendance-pill status-late">
                            <span className="dot" />
                            <span className="count">{lateCount}</span>
                            <span className="label">Late Clock-in</span>
                        </div>
                    </div>

                    {/* Visual Proportion Bar */}
                    <div className="proportion-bar-wrapper">
                        <div className="proportion-bar">
                            <div
                                className="segment present"
                                style={{
                                    width: `${totalTodayRecords ? (presentCount / totalTodayRecords) * 100 : 0}%`,
                                }}
                                title={`Present: ${presentCount}`}
                            />
                            <div
                                className="segment leave"
                                style={{
                                    width: `${totalTodayRecords ? (onLeaveCount / totalTodayRecords) * 100 : 0}%`,
                                }}
                                title={`On Leave: ${onLeaveCount}`}
                            />
                            <div
                                className="segment halfday"
                                style={{
                                    width: `${totalTodayRecords ? (halfDayCount / totalTodayRecords) * 100 : 0}%`,
                                }}
                                title={`Half Day: ${halfDayCount}`}
                            />
                            <div
                                className="segment absent"
                                style={{
                                    width: `${totalTodayRecords ? (absentCount / totalTodayRecords) * 100 : 0}%`,
                                }}
                                title={`Absent: ${absentCount}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Pending Actions Inbox Card */}
                <div className="dashboard-card pending-inbox-card">
                    <div className="card-header">
                        <div className="title-group">
                            <CalendarOff className="header-icon" size={18} />
                            <h2>Pending Leave Queue ({pendingQueues.leavesCount || 0})</h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/dashboard/admin/leave-approvals')}
                        >
                            Open Inbox <ArrowRight size={14} />
                        </Button>
                    </div>

                    <div className="pending-list">
                        {pendingQueues.recentPendingLeaves &&
                        pendingQueues.recentPendingLeaves.length > 0 ? (
                            pendingQueues.recentPendingLeaves.map((req) => (
                                <div key={req.id} className="pending-item">
                                    <div className="pending-info">
                                        <span className="emp-name">{req.employeeName}</span>
                                        <span className="leave-details">
                                            {req.leaveTypeName} • {req.requestedDays} day(s) (
                                            {req.startDate} to {req.endDate})
                                        </span>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        size="xs"
                                        onClick={() => navigate('/dashboard/admin/leave-approvals')}
                                    >
                                        Review
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="empty-pending">
                                <CheckCircle2 size={24} className="check-icon" />
                                <span>No pending leave requests to approve</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Department Breakdown & Upcoming Holidays */}
            <div className="dashboard-bottom-grid">
                {/* Department Distribution */}
                <div className="dashboard-card department-card">
                    <div className="card-header">
                        <div className="title-group">
                            <Building2 className="header-icon" size={18} />
                            <h2>Department Distribution</h2>
                        </div>
                    </div>
                    <div className="department-list">
                        {departmentBreakdown && departmentBreakdown.length > 0 ? (
                            departmentBreakdown.map((dept) => (
                                <div key={dept.departmentId} className="department-row">
                                    <div className="dept-label-group">
                                        <span className="dept-name">{dept.departmentName}</span>
                                        <span className="dept-count">
                                            {dept.employeeCount} members
                                        </span>
                                    </div>
                                    <div className="dept-progress-track">
                                        <div
                                            className="dept-progress-fill"
                                            style={{
                                                width: `${headcount.total ? (dept.employeeCount / headcount.total) * 100 : 0}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-text">No active department records found.</p>
                        )}
                    </div>
                </div>

                {/* Upcoming Holidays */}
                <div className="dashboard-card holidays-card">
                    <div className="card-header">
                        <div className="title-group">
                            <Calendar className="header-icon" size={18} />
                            <h2>Upcoming Holidays</h2>
                        </div>
                    </div>
                    <div className="holidays-list">
                        {upcomingHolidays && upcomingHolidays.length > 0 ? (
                            upcomingHolidays.map((h) => (
                                <div key={h.id} className="holiday-item">
                                    <div className="holiday-date-badge">
                                        <span className="holiday-day">
                                            {new Date(h.holidayDate).getDate()}
                                        </span>
                                        <span className="holiday-month">
                                            {new Date(h.holidayDate).toLocaleDateString(undefined, {
                                                month: 'short',
                                            })}
                                        </span>
                                    </div>
                                    <div className="holiday-details">
                                        <span className="holiday-name">{h.name}</span>
                                        <span className="holiday-weekday">
                                            {new Date(h.holidayDate).toLocaleDateString(undefined, {
                                                weekday: 'long',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-text">
                                No upcoming holidays scheduled in the next 30 days.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { DashboardContext } from '../context/dashboard.context';
import { useDashboard } from '../hooks/useDashboard';
import AttendancePunchWidget from '@/app/features/attendance/components/AttendancePunchWidget';
import StatCard from '@/components/Shared/DataDisplay/StatCard/StatCard';
import Button from '@/components/Shared/Buttons/Button/Button';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import {
    CalendarOff,
    Clock,
    DollarSign,
    Calendar,
    ArrowRight,
    Briefcase,
    Building,
    FileText,
    Download,
    Clock3,
} from 'lucide-react';
import './EmployeeDashboardHome.scss';

export default function EmployeeDashboardHome() {
    const navigate = useNavigate();
    const { employeeMetrics, loading } = useContext(DashboardContext);
    const { loadEmployeeDashboard } = useDashboard();

    useEffect(() => {
        loadEmployeeDashboard();
    }, [loadEmployeeDashboard]);

    if (loading && !employeeMetrics) {
        return <Spinner label="Loading Employee Dashboard..." fullScreen={false} />;
    }

    const {
        profile = {},
        today = {},
        leaveBalances = [],
        monthSummary = {},
        recentAttendance = [],
        recentLeaves = [],
        latestPayslip = null,
        upcomingHolidays = [],
    } = employeeMetrics || {};

    const displayName =
        profile.displayName || `${profile.firstName || 'Employee'} ${profile.lastName || ''}`;

    return (
        <div className="employee-dashboard-container">
            {/* Header Greeting Banner */}
            <div className="welcome-banner">
                <div className="banner-text">
                    <h1 className="greeting-title">Welcome back, {displayName}!</h1>
                    <div className="profile-meta-chips">
                        {profile.employeeCode && (
                            <span className="meta-chip code-chip">ID: {profile.employeeCode}</span>
                        )}
                        {profile.jobPositionName && (
                            <span className="meta-chip">
                                <Briefcase size={13} /> {profile.jobPositionName}
                            </span>
                        )}
                        {profile.departmentName && (
                            <span className="meta-chip">
                                <Building size={13} /> {profile.departmentName}
                            </span>
                        )}
                    </div>
                </div>
                <div className="banner-actions">
                    <Button variant="secondary" onClick={() => navigate('/dashboard/user/leave')}>
                        <CalendarOff size={16} /> Apply Time Off
                    </Button>
                </div>
            </div>

            {/* Top Grid: Attendance Punch Widget & Monthly Work Hours */}
            <div className="top-dashboard-grid">
                <div className="punch-widget-column">
                    <AttendancePunchWidget
                        initialStatus={today}
                        onPunchSuccess={loadEmployeeDashboard}
                    />
                </div>

                <div className="monthly-stats-column">
                    <div className="kpi-mini-grid">
                        <StatCard
                            title="Worked This Month"
                            value={`${monthSummary.totalWorkedHours || 0} hrs`}
                            icon={<Clock />}
                            subtitle={`${monthSummary.presentDays || 0} days present`}
                        />
                        <StatCard
                            title="Overtime"
                            value={`${monthSummary.totalOvertimeHours || 0} hrs`}
                            icon={<TrendingUpIcon />}
                            subtitle="Logged beyond shift"
                        />
                    </div>
                </div>
            </div>

            {/* Leave Balance Counters */}
            <div className="leave-balances-card">
                <div className="card-header">
                    <div className="title-group">
                        <CalendarOff size={18} className="header-icon" />
                        <h2>Leave Balances</h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/dashboard/user/leave')}
                    >
                        View Details <ArrowRight size={14} />
                    </Button>
                </div>

                <div className="leave-balance-pills-grid">
                    {leaveBalances && leaveBalances.length > 0 ? (
                        leaveBalances.map((bal) => (
                            <div key={bal.leaveTypeId} className="balance-pill-card">
                                <div className="balance-name">{bal.leaveTypeName}</div>
                                <div className="balance-days">
                                    <span className="available-count">{bal.availableDays}</span>
                                    <span className="total-entitled">
                                        / {bal.totalEntitled} available
                                    </span>
                                </div>
                                <div className="balance-usage-meta">
                                    <span>Used: {bal.usedDays}</span>
                                    {Number(bal.pendingDays) > 0 && (
                                        <span className="pending-tag">
                                            Pending: {bal.pendingDays}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="empty-text">No active leave allocations found.</p>
                    )}
                </div>
            </div>

            {/* Bottom 2-Column Grid: Latest Payslip & Upcoming Holidays */}
            <div className="bottom-dashboard-grid">
                {/* Latest Payslip Card */}
                <div className="dashboard-card payslip-card">
                    <div className="card-header">
                        <div className="title-group">
                            <DollarSign size={18} className="header-icon" />
                            <h2>Latest Payslip</h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/dashboard/user/payslips')}
                        >
                            All Payslips <ArrowRight size={14} />
                        </Button>
                    </div>

                    {latestPayslip ? (
                        <div className="payslip-preview-content">
                            <div className="payslip-period-info">
                                <FileText className="file-icon" size={24} />
                                <div className="period-dates">
                                    <span className="period-title">Monthly Salary Statement</span>
                                    <span className="period-range">
                                        {latestPayslip.periodStart} to {latestPayslip.periodEnd}
                                    </span>
                                </div>
                            </div>
                            <div className="payslip-amounts">
                                <div className="amount-col">
                                    <span className="amount-label">Gross Earnings</span>
                                    <span className="amount-val">
                                        ₹
                                        {Number(latestPayslip.grossEarnings).toLocaleString(
                                            'en-IN',
                                        )}
                                    </span>
                                </div>
                                <div className="amount-col">
                                    <span className="amount-label">Net Payable</span>
                                    <span className="amount-val net-highlight">
                                        ₹{Number(latestPayslip.netPay).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="view-payslip-cta"
                                onClick={() => navigate('/dashboard/user/payslips')}
                            >
                                <Download size={14} /> View Official Breakdown
                            </Button>
                        </div>
                    ) : (
                        <div className="empty-state-box">
                            <DollarSign size={24} className="empty-icon" />
                            <span>No finalized payslips available yet</span>
                        </div>
                    )}
                </div>

                {/* Upcoming Holidays Card */}
                <div className="dashboard-card holidays-card">
                    <div className="card-header">
                        <div className="title-group">
                            <Calendar size={18} className="header-icon" />
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
                                No company holidays scheduled in the next 30 days.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function TrendingUpIcon() {
    return <Clock3 />;
}

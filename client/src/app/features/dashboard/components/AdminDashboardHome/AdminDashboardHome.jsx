import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import StatCard from '@/components/Shared/DataDisplay/StatCard/StatCard';
import Button from '@/components/Shared/Buttons/Button/Button';
import {
    Users,
    CheckCircle,
    Calendar,
    DollarSign,
    ArrowRight,
    UserPlus,
    Clock,
} from 'lucide-react';
import './AdminDashboardHome.scss';

export default function AdminDashboardHome() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalEmployees: 12,
        presentToday: 10,
        onLeaveToday: 1,
        absentToday: 1,
        pendingLeaves: 2,
        monthlyPayrollTotal: 600000,
        payrollCycleStatus: 'CALCULATED',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get('/api/dashboard/admin', { withCredentials: true });
                if (res.data?.data) {
                    setStats((prev) => ({ ...prev, ...res.data.data }));
                }
            } catch (err) {
                // fallback to default initial state
            }
        };
        fetchDashboardData();
    }, []);

    const formatInr = (num) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(num || 0);

    const attendanceRate = Math.round((stats.presentToday / (stats.totalEmployees || 1)) * 100);

    return (
        <div className="admin-dashboard-home">
            <div className="admin-dashboard-home__header">
                <div>
                    <h1 className="admin-dashboard-home__title">Executive HRMS Overview</h1>
                    <p className="admin-dashboard-home__subtitle">
                        Real-time analytics across workforce presence, approval queues, and payroll
                        cycles.
                    </p>
                </div>

                <div className="admin-dashboard-home__quick-actions">
                    <Button
                        variant="primary"
                        icon={UserPlus}
                        onClick={() => navigate('/dashboard/admin/employees')}
                    >
                        Directory & Onboarding
                    </Button>
                </div>
            </div>

            <div className="admin-dashboard-home__stats-grid">
                <StatCard
                    title="Active Headcount"
                    value={stats.totalEmployees}
                    icon={Users}
                    trend={{ direction: 'neutral', label: 'Company-wide' }}
                />
                <StatCard
                    title="Present Today"
                    value={`${stats.presentToday} (${attendanceRate}%)`}
                    icon={CheckCircle}
                    trend={{ direction: 'up', label: 'Active in office/remote' }}
                />
                <StatCard
                    title="Pending Leave Approvals"
                    value={stats.pendingLeaves}
                    icon={Calendar}
                    trend={{
                        direction: stats.pendingLeaves > 0 ? 'down' : 'neutral',
                        label: 'Requires HR decision',
                    }}
                />
                <StatCard
                    title="Monthly Payroll Budget"
                    value={formatInr(stats.monthlyPayrollTotal)}
                    icon={DollarSign}
                    trend={{ direction: 'neutral', label: `Status: ${stats.payrollCycleStatus}` }}
                />
            </div>

            <div className="admin-dashboard-home__action-cards-grid">
                <div
                    className="action-banner-card action-banner-card--blue"
                    onClick={() => navigate('/dashboard/admin/attendance')}
                >
                    <div className="banner-icon-box">
                        <Clock size={24} />
                    </div>
                    <div className="banner-content">
                        <h3>Attendance & Presence</h3>
                        <p>
                            Monitor live punch clock logs and review employee regularization
                            adjustments.
                        </p>
                        <span className="banner-link">
                            View Attendance <ArrowRight size={14} />
                        </span>
                    </div>
                </div>

                <div
                    className="action-banner-card action-banner-card--purple"
                    onClick={() => navigate('/dashboard/admin/leave')}
                >
                    <div className="banner-icon-box">
                        <Calendar size={24} />
                    </div>
                    <div className="banner-content">
                        <h3>Leave Approval Inbox</h3>
                        <p>
                            Review submitted time-off requests with real-time double-entry ledger
                            checks.
                        </p>
                        <span className="banner-link">
                            Open Inbox <ArrowRight size={14} />
                        </span>
                    </div>
                </div>

                <div
                    className="action-banner-card action-banner-card--green"
                    onClick={() => navigate('/dashboard/admin/payroll')}
                >
                    <div className="banner-icon-box">
                        <DollarSign size={24} />
                    </div>
                    <div className="banner-content">
                        <h3>Payroll & Payslips</h3>
                        <p>
                            Process monthly payroll runs, compute attendance deductions, and lock
                            immutable snapshots.
                        </p>
                        <span className="banner-link">
                            Manage Payroll <ArrowRight size={14} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

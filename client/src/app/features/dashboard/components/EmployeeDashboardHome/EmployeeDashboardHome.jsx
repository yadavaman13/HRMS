import { useNavigate } from 'react-router';
import { useAuth } from '@/app/features/auth/hooks/useAuth';
import AttendanceProvider from '@/app/features/attendance/context/attendance.context';
import LeaveProvider from '@/app/features/leave/context/leave.context';
import AttendancePunchWidget from '@/app/features/attendance/components/AttendancePunchWidget/AttendancePunchWidget';
import LeaveBalanceCards from '@/app/features/leave/components/LeaveBalanceCards/LeaveBalanceCards';
import Button from '@/components/Shared/Buttons/Button/Button';
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import { Clock, Calendar, FileText, User, Bot, ArrowRight } from 'lucide-react';
import './EmployeeDashboardHome.scss';

export default function EmployeeDashboardHome() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Team Member';
    const employeeCode = user?.employeeCode || user?.code || 'EMP-N/A';

    return (
        <div className="employee-dashboard-home">
            <div className="employee-dashboard-home__welcome-banner">
                <div className="welcome-content">
                    <span className="welcome-greeting">👋 Welcome back,</span>
                    <h1 className="welcome-name">{fullName}</h1>
                    <div className="welcome-meta">
                        <span className="welcome-code font-mono">{employeeCode}</span>
                        <Badge variant="primary" size="sm">
                            {user?.role?.toUpperCase() || 'EMPLOYEE'}
                        </Badge>
                    </div>
                </div>

                <div className="welcome-cta">
                    <Button
                        variant="secondary"
                        size="sm"
                        icon={Bot}
                        onClick={() => navigate('/dashboard/user/ai')}
                    >
                        Ask Dayflow AI
                    </Button>
                </div>
            </div>

            <div className="employee-dashboard-home__main-grid">
                <div className="main-left-col">
                    <div className="section-block">
                        <h2 className="section-title">
                            <Clock size={18} /> Daily Work Session
                        </h2>
                        <AttendanceProvider>
                            <AttendancePunchWidget />
                        </AttendanceProvider>
                    </div>

                    <div className="section-block">
                        <div className="section-title-between">
                            <h2 className="section-title">
                                <Calendar size={18} /> Leave Entitlements
                            </h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/dashboard/user/leave')}
                            >
                                View History
                            </Button>
                        </div>
                        <LeaveProvider>
                            <LeaveBalanceCards />
                        </LeaveProvider>
                    </div>
                </div>

                <div className="main-right-col">
                    <div className="shortcuts-card">
                        <h3 className="shortcuts-title">Quick Actions</h3>
                        <div className="shortcuts-list">
                            <button
                                className="shortcut-btn"
                                onClick={() => navigate('/dashboard/user/attendance')}
                            >
                                <div className="shortcut-icon-box">
                                    <Clock size={16} />
                                </div>
                                <div className="shortcut-text">
                                    <span className="shortcut-name">Monthly Timesheet</span>
                                    <span className="shortcut-desc">View check-ins & overtime</span>
                                </div>
                                <ArrowRight size={14} className="arrow" />
                            </button>

                            <button
                                className="shortcut-btn"
                                onClick={() => navigate('/dashboard/user/leave')}
                            >
                                <div className="shortcut-icon-box icon-purple">
                                    <Calendar size={16} />
                                </div>
                                <div className="shortcut-text">
                                    <span className="shortcut-name">Apply for Time Off</span>
                                    <span className="shortcut-desc">Submit PTO or Sick leave</span>
                                </div>
                                <ArrowRight size={14} className="arrow" />
                            </button>

                            <button
                                className="shortcut-btn"
                                onClick={() => navigate('/dashboard/user/payroll')}
                            >
                                <div className="shortcut-icon-box icon-green">
                                    <FileText size={16} />
                                </div>
                                <div className="shortcut-text">
                                    <span className="shortcut-name">Payslips & Salary</span>
                                    <span className="shortcut-desc">
                                        Download official PDF slips
                                    </span>
                                </div>
                                <ArrowRight size={14} className="arrow" />
                            </button>

                            <button
                                className="shortcut-btn"
                                onClick={() => navigate('/dashboard/user/profile')}
                            >
                                <div className="shortcut-icon-box icon-blue">
                                    <User size={16} />
                                </div>
                                <div className="shortcut-text">
                                    <span className="shortcut-name">My Profile</span>
                                    <span className="shortcut-desc">
                                        Update resume, skills & info
                                    </span>
                                </div>
                                <ArrowRight size={14} className="arrow" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

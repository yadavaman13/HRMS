import { useState, useEffect } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import AttendancePunchWidget from '../components/AttendancePunchWidget/AttendancePunchWidget';
import TimesheetTable from '../components/TimesheetTable/TimesheetTable';
import AttendanceRegularizationModal from '../components/AttendanceRegularizationModal/AttendanceRegularizationModal';
import StatCard from '@/components/Shared/DataDisplay/StatCard/StatCard';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import { CheckCircle2, AlertCircle, Clock, CalendarDays } from 'lucide-react';
import './EmployeeAttendancePage.scss';

export default function EmployeeAttendancePage() {
    const { timesheets, summary, fetchMyAttendance, fetchMySummary, loading } = useAttendance();

    const [selectedRecordForAdjustment, setSelectedRecordForAdjustment] = useState(null);

    useEffect(() => {
        fetchMyAttendance();
        fetchMySummary();
    }, []);

    const safeTimesheets = Array.isArray(timesheets) ? timesheets : [];

    // Calculate quick stats from records
    const presentCount = safeTimesheets.filter(
        (r) => (r?.status || '').toUpperCase() === 'PRESENT',
    ).length;
    const leaveCount = safeTimesheets.filter((r) =>
        ['ON_LEAVE', 'LEAVE'].includes((r?.status || '').toUpperCase()),
    ).length;
    const absentCount = safeTimesheets.filter(
        (r) => (r?.status || '').toUpperCase() === 'ABSENT',
    ).length;
    const totalOvertimeMinutes = safeTimesheets.reduce(
        (acc, r) => acc + (Number(r?.overtimeMinutes) || 0),
        0,
    );
    const overtimeHours = `${Math.floor(totalOvertimeMinutes / 60)}h ${totalOvertimeMinutes % 60}m`;

    return (
        <div className="employee-attendance-page">
            <div className="employee-attendance-page__header">
                <div>
                    <h1 className="employee-attendance-page__title">My Attendance & Timesheet</h1>
                    <p className="employee-attendance-page__subtitle">
                        Record daily work sessions, monitor work hours, and review monthly
                        attendance logs.
                    </p>
                </div>
            </div>

            <div className="employee-attendance-page__stats-grid">
                <StatCard
                    title="Present Days"
                    value={summary?.presentDays ?? presentCount}
                    icon={CheckCircle2}
                    trend={{ direction: 'up', label: 'Active this month' }}
                />
                <StatCard
                    title="Approved Leaves"
                    value={summary?.leaveDays ?? leaveCount}
                    icon={CalendarDays}
                    trend={{ direction: 'neutral', label: 'Paid quota used' }}
                />
                <StatCard
                    title="Absences"
                    value={summary?.absentDays ?? absentCount}
                    icon={AlertCircle}
                    trend={{
                        direction: absentCount > 0 ? 'down' : 'up',
                        label: absentCount === 0 ? 'Perfect record' : 'Unpaid days',
                    }}
                />
                <StatCard
                    title="Overtime Logged"
                    value={summary?.overtimeHours ?? overtimeHours}
                    icon={Clock}
                    trend={{ direction: 'up', label: 'Extra hours' }}
                />
            </div>

            <div className="employee-attendance-page__content-grid">
                <div className="employee-attendance-page__punch-col">
                    <AttendancePunchWidget />
                </div>

                <div className="employee-attendance-page__timesheet-col">
                    <div className="timesheet-header-box">
                        <h2 className="timesheet-title">Monthly Attendance Records</h2>
                    </div>

                    {loading && safeTimesheets.length === 0 ? (
                        <div className="employee-attendance-page__loading">
                            <Spinner label="Loading timesheet..." />
                        </div>
                    ) : (
                        <TimesheetTable
                            records={safeTimesheets}
                            onRequestAdjustment={(rec) => setSelectedRecordForAdjustment(rec)}
                        />
                    )}
                </div>
            </div>

            {selectedRecordForAdjustment && (
                <AttendanceRegularizationModal
                    isOpen={Boolean(selectedRecordForAdjustment)}
                    onClose={() => setSelectedRecordForAdjustment(null)}
                    attendanceRecord={selectedRecordForAdjustment}
                />
            )}
        </div>
    );
}

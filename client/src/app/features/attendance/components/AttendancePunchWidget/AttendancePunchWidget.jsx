import { useState, useEffect } from 'react';
import { useAttendance } from '../../hooks/useAttendance';
import Button from '@/components/Shared/Buttons/Button/Button';
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import ToastNotification from '@/components/Shared/Feedback/ToastNotification/ToastNotification';
import { Clock, Play, Square, CheckCircle } from 'lucide-react';
import './AttendancePunchWidget.scss';

export default function AttendancePunchWidget() {
    const { todayAttendance, handleCheckIn, handleCheckOut, loading, error } = useAttendance();

    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [actionError, setActionError] = useState('');

    const isCheckedIn = Boolean(todayAttendance?.checkIn && !todayAttendance?.checkOut);
    const isCompleted = Boolean(todayAttendance?.checkIn && todayAttendance?.checkOut);

    // Live timer calculation when clocked in
    useEffect(() => {
        if (!isCheckedIn || !todayAttendance?.checkIn) {
            if (todayAttendance?.workDurationMinutes) {
                setElapsedSeconds(todayAttendance.workDurationMinutes * 60);
            } else if (todayAttendance?.checkIn && todayAttendance?.checkOut) {
                const start = new Date(todayAttendance.checkIn).getTime();
                const end = new Date(todayAttendance.checkOut).getTime();
                setElapsedSeconds(Math.max(0, Math.floor((end - start) / 1000)));
            } else {
                setElapsedSeconds(0);
            }
            return;
        }

        const checkInTime = new Date(todayAttendance.checkIn).getTime();

        const updateTimer = () => {
            const now = Date.now();
            const diffSec = Math.max(0, Math.floor((now - checkInTime) / 1000));
            setElapsedSeconds(diffSec);
        };

        updateTimer();
        const intervalId = setInterval(updateTimer, 1000);
        return () => clearInterval(intervalId);
    }, [todayAttendance, isCheckedIn]);

    const formatTimer = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const onPunchAction = async () => {
        setActionError('');
        try {
            if (isCheckedIn) {
                await handleCheckOut();
            } else {
                await handleCheckIn();
            }
        } catch (err) {
            setActionError(err.response?.data?.message || err.message || 'Action failed');
        }
    };

    return (
        <div className="attendance-punch-widget">
            {(actionError || error) && (
                <ToastNotification
                    variant="error"
                    title="Attendance Notice"
                    message={actionError || error}
                    onClose={() => setActionError('')}
                />
            )}

            <div className="attendance-punch-widget__header">
                <div className="attendance-punch-widget__title-box">
                    <Clock className="attendance-punch-widget__icon" size={20} />
                    <span className="attendance-punch-widget__title">Daily Work Session</span>
                </div>
                <Badge
                    variant={isCheckedIn ? 'success' : isCompleted ? 'neutral' : 'warning'}
                    size="sm"
                >
                    {isCheckedIn ? '🟢 Active Session' : isCompleted ? 'Completed' : 'Not Started'}
                </Badge>
            </div>

            <div className="attendance-punch-widget__timer-display">
                <span className="attendance-punch-widget__timer-val" aria-label="Work duration">
                    {formatTimer(elapsedSeconds)}
                </span>
                <span className="attendance-punch-widget__timer-label">
                    {isCheckedIn
                        ? 'Net Time Elapsed Today'
                        : isCompleted
                          ? 'Total Time Recorded'
                          : 'Ready to Clock In'}
                </span>
            </div>

            <div className="attendance-punch-widget__punch-details">
                <div className="attendance-punch-widget__detail-col">
                    <span className="detail-label">Check In</span>
                    <span className="detail-val">
                        {todayAttendance?.checkIn
                            ? new Date(todayAttendance.checkIn).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                              })
                            : '--:--'}
                    </span>
                </div>
                <div className="attendance-punch-widget__detail-divider" />
                <div className="attendance-punch-widget__detail-col">
                    <span className="detail-label">Check Out</span>
                    <span className="detail-val">
                        {todayAttendance?.checkOut
                            ? new Date(todayAttendance.checkOut).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                              })
                            : '--:--'}
                    </span>
                </div>
            </div>

            <div className="attendance-punch-widget__action">
                <Button
                    variant={isCheckedIn ? 'danger' : 'primary'}
                    icon={isCheckedIn ? Square : isCompleted ? CheckCircle : Play}
                    onClick={onPunchAction}
                    loading={loading}
                    disabled={loading || isCompleted}
                    fullWidth
                >
                    {isCheckedIn
                        ? 'Clock Out for Today'
                        : isCompleted
                          ? 'Work Session Completed'
                          : 'Clock In Now'}
                </Button>
            </div>
        </div>
    );
}

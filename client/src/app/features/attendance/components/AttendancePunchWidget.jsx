import { useState, useEffect, useRef, useContext } from 'react';
import { AttendanceContext } from '../context/attendance.context';
import { useAttendance } from '../hooks/useAttendance';
import Button from '@/components/Shared/Buttons/Button/Button';
import { useToast } from '@/components/Shared/Feedback/Toast';
import { LogIn, LogOut, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import './AttendancePunchWidget.scss';

export default function AttendancePunchWidget({ initialStatus, onPunchSuccess }) {
    const { todayStatus, loading } = useContext(AttendanceContext);
    const { handleCheckIn, handleCheckOut } = useAttendance();
    const { success, error: toastError } = useToast();

    // Use context status if available, fallback to props
    const currentStatus = todayStatus || initialStatus || {};
    const isCheckedIn = Boolean(
        currentStatus.isCheckedIn || (currentStatus.session && !currentStatus.session.checkOutAt),
    );
    const checkInTime = currentStatus.session?.checkInAt
        ? new Date(currentStatus.session.checkInAt)
        : null;

    const [currentTime, setCurrentTime] = useState(new Date());
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isActionPending, setIsActionPending] = useState(false);
    const timerRef = useRef(null);

    // Current real-time clock
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Elapsed work duration timer
    useEffect(() => {
        if (isCheckedIn && checkInTime) {
            const updateElapsed = () => {
                const now = new Date();
                const diffSecs = Math.max(
                    0,
                    Math.floor((now.getTime() - checkInTime.getTime()) / 1000),
                );
                setElapsedSeconds(diffSecs);
            };

            updateElapsed();
            timerRef.current = setInterval(updateElapsed, 1000);
        } else {
            setElapsedSeconds(0);
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isCheckedIn, checkInTime]);

    const formatStopwatch = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleTogglePunch = async () => {
        setIsActionPending(true);
        try {
            if (isCheckedIn) {
                await handleCheckOut();
                success('Successfully clocked out! Great work today.');
            } else {
                await handleCheckIn();
                success('Successfully clocked in! Have a productive day.');
            }
            if (onPunchSuccess) onPunchSuccess();
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Attendance action failed';
            toastError(msg);
        } finally {
            setIsActionPending(false);
        }
    };

    return (
        <div className={`attendance-punch-widget ${isCheckedIn ? 'is-active' : 'is-idle'}`}>
            <div className="widget-header">
                <div className="time-info">
                    <span className="live-time">
                        <Clock size={16} className="clock-icon" />
                        {currentTime.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        })}
                    </span>
                    <span className="live-date">
                        <Calendar size={14} />
                        {currentTime.toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </span>
                </div>
                <div
                    className={`status-indicator-pill ${isCheckedIn ? 'status-online' : 'status-offline'}`}
                >
                    <span className="status-dot" />
                    <span>{isCheckedIn ? 'Checked In' : 'Not Checked In'}</span>
                </div>
            </div>

            <div className="widget-body">
                <div className="stopwatch-display">
                    <span className="stopwatch-label">
                        {isCheckedIn ? 'Working Hours Today' : 'Shift Duration'}
                    </span>
                    <span className="stopwatch-digits">{formatStopwatch(elapsedSeconds)}</span>
                    {checkInTime && isCheckedIn && (
                        <span className="checkin-time-tag">
                            <CheckCircle2 size={13} /> Checked in at{' '}
                            {checkInTime.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    )}
                </div>

                <div className="punch-cta-container">
                    {isCheckedIn ? (
                        <Button
                            variant="secondary"
                            className="punch-button punch-out"
                            onClick={handleTogglePunch}
                            disabled={isActionPending || loading}
                            loading={isActionPending}
                        >
                            <LogOut size={16} />
                            <span>Clock Out</span>
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            className="punch-button punch-in"
                            onClick={handleTogglePunch}
                            disabled={isActionPending || loading}
                            loading={isActionPending}
                        >
                            <LogIn size={16} />
                            <span>Clock In</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

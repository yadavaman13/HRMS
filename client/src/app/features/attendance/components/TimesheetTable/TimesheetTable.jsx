import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import Button from '@/components/Shared/Buttons/Button/Button';
import EmptyState from '@/components/Shared/DataDisplay/EmptyState/EmptyState';
import { Calendar, Edit3 } from 'lucide-react';
import './TimesheetTable.scss';

export default function TimesheetTable({ records = [], onRequestAdjustment }) {
    const safeRecords = Array.isArray(records) ? records : [];

    const getStatusBadge = (status) => {
        const s = (status || 'PRESENT').toUpperCase();
        switch (s) {
            case 'PRESENT':
                return (
                    <Badge variant="success" size="sm">
                        Present
                    </Badge>
                );
            case 'ON_LEAVE':
            case 'LEAVE':
                return (
                    <Badge variant="primary" size="sm">
                        On Leave
                    </Badge>
                );
            case 'ABSENT':
                return (
                    <Badge variant="danger" size="sm">
                        Absent
                    </Badge>
                );
            case 'HALF_DAY':
                return (
                    <Badge variant="warning" size="sm">
                        Half Day
                    </Badge>
                );
            case 'HOLIDAY':
            case 'WEEK_OFF':
                return (
                    <Badge variant="neutral" size="sm">
                        {s === 'HOLIDAY' ? 'Holiday' : 'Weekend'}
                    </Badge>
                );
            default:
                return (
                    <Badge variant="neutral" size="sm">
                        {s}
                    </Badge>
                );
        }
    };

    const formatTime = (ts) => {
        if (!ts) return '--:--';
        return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatHours = (mins) => {
        if (mins === undefined || mins === null) return '--';
        const num = Number(mins);
        if (isNaN(num)) return '--';
        const h = Math.floor(num / 60);
        const m = num % 60;
        return `${h}h ${m}m`;
    };

    if (safeRecords.length === 0) {
        return (
            <EmptyState
                icon={Calendar}
                title="No attendance records"
                description="Your daily attendance logs for this billing period will appear here."
            />
        );
    }

    return (
        <div className="timesheet-table-wrap">
            <table className="timesheet-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Net Hours</th>
                        <th>Overtime</th>
                        <th className="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {safeRecords.map((rec, idx) => {
                        const dateStr =
                            rec?.date ||
                            (rec?.checkIn
                                ? new Date(rec.checkIn).toLocaleDateString()
                                : `Day ${idx + 1}`);
                        return (
                            <tr key={rec?.id || idx}>
                                <td className="font-medium">{dateStr}</td>
                                <td>{getStatusBadge(rec?.status)}</td>
                                <td className="font-mono">{formatTime(rec?.checkIn)}</td>
                                <td className="font-mono">{formatTime(rec?.checkOut)}</td>
                                <td className="font-mono font-medium">
                                    {formatHours(rec?.netWorkMinutes || rec?.workDurationMinutes)}
                                </td>
                                <td className="font-mono">
                                    {rec?.overtimeMinutes > 0
                                        ? formatHours(rec.overtimeMinutes)
                                        : '0h 0m'}
                                </td>
                                <td className="text-right">
                                    {onRequestAdjustment && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={Edit3}
                                            onClick={() => onRequestAdjustment(rec)}
                                        >
                                            Adjust
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import Button from '@/components/Shared/Buttons/Button/Button';
import EmptyState from '@/components/Shared/DataDisplay/EmptyState/EmptyState';
import { Palmtree, XCircle } from 'lucide-react';
import './LeaveRequestTable.scss';

export default function LeaveRequestTable({ requests = [], onCancelRequest }) {
    const safeRequests = Array.isArray(requests) ? requests : [];

    const getStatusBadge = (status) => {
        const s = (status || 'PENDING').toUpperCase();
        switch (s) {
            case 'APPROVED':
                return (
                    <Badge variant="success" size="sm">
                        Approved
                    </Badge>
                );
            case 'REJECTED':
                return (
                    <Badge variant="danger" size="sm">
                        Rejected
                    </Badge>
                );
            case 'CANCELLED':
                return (
                    <Badge variant="neutral" size="sm">
                        Cancelled
                    </Badge>
                );
            case 'PENDING':
            default:
                return (
                    <Badge variant="warning" size="sm">
                        Pending Approval
                    </Badge>
                );
        }
    };

    if (safeRequests.length === 0) {
        return (
            <EmptyState
                icon={Palmtree}
                title="No leave requests"
                description="You haven't submitted any time-off applications yet."
            />
        );
    }

    return (
        <div className="leave-request-table-wrap">
            <table className="leave-request-table">
                <thead>
                    <tr>
                        <th>Leave Type</th>
                        <th>Dates</th>
                        <th>Working Days</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th className="text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {safeRequests.map((req, idx) => (
                        <tr key={req?.id || idx}>
                            <td>
                                <strong>
                                    {req?.leaveType?.name || req?.type || 'Paid Time Off'}
                                </strong>
                            </td>
                            <td className="font-mono">
                                {req?.startDate} → {req?.endDate}
                            </td>
                            <td className="font-mono font-medium">
                                {req?.workingDays || req?.daysCount || 1} Days
                            </td>
                            <td>
                                <span className="reason-text" title={req?.reason}>
                                    {req?.reason || 'Personal'}
                                </span>
                            </td>
                            <td>{getStatusBadge(req?.status)}</td>
                            <td className="text-right">
                                {req?.status === 'PENDING' && onCancelRequest && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={XCircle}
                                        onClick={() => onCancelRequest(req?.id)}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

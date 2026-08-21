import { useState, useEffect } from 'react';
import { useLeave } from '../hooks/useLeave';
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import Button from '@/components/Shared/Buttons/Button/Button';
import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import EmptyState from '@/components/Shared/DataDisplay/EmptyState/EmptyState';
import Dialog from '@/components/Shared/Feedback/Dialog/Dialog';
import Textarea from '@/components/Shared/Form/Textarea/Textarea';
import { Inbox, Check, X } from 'lucide-react';
import './LeaveApprovalInboxPage.scss';

export default function LeaveApprovalInboxPage() {
    const { allRequests, fetchAllRequests, handleApproveRequest, handleRejectRequest, loading } =
        useLeave();

    const [statusFilter, setStatusFilter] = useState('PENDING');
    const [actionModal, setActionModal] = useState(null); // { type: 'approve' | 'reject', request: {...} }
    const [comments, setComments] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchAllRequests({ status: statusFilter || undefined });
    }, [statusFilter]);

    const filterOptions = [
        { label: 'Pending Review', value: 'PENDING' },
        { label: 'Approved Requests', value: 'APPROVED' },
        { label: 'Rejected Requests', value: 'REJECTED' },
        { label: 'All Requests', value: '' },
    ];

    const safeRequests = Array.isArray(allRequests) ? allRequests : [];

    const handleConfirmAction = async () => {
        if (!actionModal?.request?.id) return;
        setActionLoading(true);
        try {
            if (actionModal.type === 'approve') {
                await handleApproveRequest(actionModal.request.id, comments);
            } else {
                await handleRejectRequest(actionModal.request.id, comments);
            }
            setActionModal(null);
            setComments('');
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="leave-approval-page">
            <div className="leave-approval-page__header">
                <div>
                    <h1 className="leave-approval-page__title">Leave Approval Inbox</h1>
                    <p className="leave-approval-page__subtitle">
                        Review, authorize, or decline employee time-off applications with balance
                        reconciliation.
                    </p>
                </div>

                <div className="filter-dropdown-wrap">
                    <Dropdown
                        options={filterOptions}
                        value={statusFilter}
                        onChange={(val) => setStatusFilter(val)}
                    />
                </div>
            </div>

            {loading && safeRequests.length === 0 ? (
                <div className="leave-approval-page__loading">
                    <Spinner label="Loading leave requests..." />
                </div>
            ) : safeRequests.length === 0 ? (
                <EmptyState
                    icon={Inbox}
                    title="No leave applications found"
                    description={`There are currently no ${statusFilter ? statusFilter.toLowerCase() : ''} leave applications to display.`}
                />
            ) : (
                <div className="inbox-table-wrap">
                    <table className="inbox-table">
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Type</th>
                                <th>Duration</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th className="text-right">Decision</th>
                            </tr>
                        </thead>
                        <tbody>
                            {safeRequests.map((req, idx) => (
                                <tr key={req?.id || idx}>
                                    <td>
                                        <strong>
                                            {req?.employeeName ||
                                                req?.employee?.fullName ||
                                                `${req?.employee?.firstName || ''} ${req?.employee?.lastName || ''}`.trim() ||
                                                'Employee'}
                                        </strong>
                                        <div className="code-sub font-mono">
                                            {req?.employeeCode ||
                                                req?.employee?.employeeCode ||
                                                'EMP-N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <Badge variant="neutral" size="sm">
                                            {req?.leaveType?.name || req?.type || 'Paid Leave'}
                                        </Badge>
                                    </td>
                                    <td className="font-mono">
                                        {req?.startDate} → {req?.endDate}
                                        <div className="font-medium text-primary">
                                            {req?.workingDays || req?.daysCount || 1} Working Days
                                        </div>
                                    </td>
                                    <td>
                                        <span className="reason-text" title={req?.reason}>
                                            {req?.reason || 'Personal time-off'}
                                        </span>
                                    </td>
                                    <td>
                                        <Badge
                                            variant={
                                                req?.status === 'APPROVED'
                                                    ? 'success'
                                                    : req?.status === 'REJECTED'
                                                      ? 'danger'
                                                      : 'warning'
                                            }
                                            size="sm"
                                        >
                                            {req?.status || 'PENDING'}
                                        </Badge>
                                    </td>
                                    <td className="text-right">
                                        {req?.status === 'PENDING' ? (
                                            <div className="action-btn-group">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    icon={Check}
                                                    onClick={() =>
                                                        setActionModal({
                                                            type: 'approve',
                                                            request: req,
                                                        })
                                                    }
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    icon={X}
                                                    onClick={() =>
                                                        setActionModal({
                                                            type: 'reject',
                                                            request: req,
                                                        })
                                                    }
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className="decided-label">Processed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {actionModal && (
                <Dialog
                    isOpen={Boolean(actionModal)}
                    onClose={() => setActionModal(null)}
                    title={
                        actionModal.type === 'approve'
                            ? 'Approve Leave Request'
                            : 'Reject Leave Request'
                    }
                    size="sm"
                >
                    <div className="action-modal-body">
                        <p className="action-modal-desc">
                            {actionModal.type === 'approve'
                                ? `Confirm approval for ${actionModal.request?.employeeName || 'employee'}'s leave of ${actionModal.request?.workingDays || 1} days.`
                                : `Confirm rejection for ${actionModal.request?.employeeName || 'employee'}'s leave request.`}
                        </p>

                        <Textarea
                            label="Manager Comments / Notes (Optional)"
                            placeholder="Add reason or guidance for the employee..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={3}
                        />

                        <div className="action-modal-actions">
                            <Button variant="ghost" onClick={() => setActionModal(null)}>
                                Cancel
                            </Button>
                            <Button
                                variant={actionModal.type === 'approve' ? 'primary' : 'danger'}
                                onClick={handleConfirmAction}
                                loading={actionLoading}
                                disabled={actionLoading}
                            >
                                {actionModal.type === 'approve'
                                    ? 'Confirm Approval'
                                    : 'Confirm Rejection'}
                            </Button>
                        </div>
                    </div>
                </Dialog>
            )}
        </div>
    );
}

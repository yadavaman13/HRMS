import { useState, useEffect, useContext } from 'react';
import { LeaveContext } from '../context/leave.context';
import { useLeave } from '../hooks/useLeave';
import ApplyLeaveModal from '../components/ApplyLeaveModal';
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';
import Button from '@/components/Shared/Buttons/Button/Button';
import Dialog from '@/components/Shared/Feedback/Dialog';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import { useToast } from '@/components/Shared/Feedback/Toast';
import { CalendarOff, PlusCircle, Clock, Trash2 } from 'lucide-react';
import './LeaveDashboardPage.scss';

export default function LeaveDashboardPage() {
    const { leaveTypes, leaveBalances, myRequests, loading } = useContext(LeaveContext);
    const { loadLeaveTypes, loadMyBalances, loadMyRequests, handleCancelRequest } = useLeave();
    const { success, error: toastError } = useToast();

    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [cancellingRequestId, setCancellingRequestId] = useState(null);
    const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

    useEffect(() => {
        loadLeaveTypes();
        loadMyBalances();
        loadMyRequests();
    }, [loadLeaveTypes, loadMyBalances, loadMyRequests]);

    const handleConfirmCancel = async () => {
        if (!cancellingRequestId) return;
        try {
            await handleCancelRequest(cancellingRequestId);
            success('Time off request cancelled successfully.');
            setIsConfirmCancelOpen(false);
            setCancellingRequestId(null);
            loadMyBalances();
        } catch (err) {
            const msg =
                err.response?.data?.message || err.message || 'Failed to cancel leave request';
            toastError(msg);
        }
    };

    const columns = [
        {
            key: 'leaveType',
            label: 'Leave Type',
            render: (_, row) => (
                <span className="font-semibold text-primary">
                    {row.leaveTypeName || 'Time Off'}
                </span>
            ),
        },
        {
            key: 'duration',
            label: 'Dates & Duration',
            render: (_, row) => (
                <div className="duration-cell">
                    <span className="dates-range">
                        {row.startDate} {row.endDate !== row.startDate && `to ${row.endDate}`}
                    </span>
                    <span className="days-tag font-mono">
                        {row.isHalfDay ? '0.5 Day (Half Day)' : `${row.requestedDays || 1} Days`}
                    </span>
                </div>
            ),
        },
        {
            key: 'reason',
            label: 'Reason',
            render: (val) => <span className="reason-text">{val}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            render: (val) => {
                const s = (val || 'pending').toLowerCase();
                const isApproved = s === 'approved';
                const isPending = s === 'pending';
                const isRejected = s === 'rejected';

                return (
                    <span
                        className={`leave-status-pill ${isApproved ? 'approved' : isPending ? 'pending' : isRejected ? 'rejected' : 'cancelled'}`}
                    >
                        {val ? val.toUpperCase() : 'PENDING'}
                    </span>
                );
            },
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => {
                if (row.status?.toLowerCase() === 'pending') {
                    return (
                        <Button
                            variant="ghost"
                            size="xs"
                            className="cancel-btn"
                            onClick={() => {
                                setCancellingRequestId(row.id);
                                setIsConfirmCancelOpen(true);
                            }}
                        >
                            <Trash2 size={13} /> Cancel
                        </Button>
                    );
                }
                return <span className="text-secondary text-xs">—</span>;
            },
        },
    ];

    return (
        <div className="leave-dashboard-page">
            {/* Page Header */}
            <div className="page-header-row">
                <div>
                    <h1 className="page-title">Time Off & Leave Balances</h1>
                    <p className="page-subtitle">
                        Manage your vacation allowances, sick leaves, track pending approval
                        statuses, and request time off.
                    </p>
                </div>
                <Button variant="primary" onClick={() => setIsApplyModalOpen(true)}>
                    <PlusCircle size={16} /> Request Time Off
                </Button>
            </div>

            {/* Leave Balance Cards Grid */}
            <div className="balances-cards-grid">
                {leaveBalances && leaveBalances.length > 0 ? (
                    leaveBalances.map((bal) => (
                        <div key={bal.leaveTypeId} className="balance-hero-card">
                            <div className="card-top">
                                <span className="type-title">{bal.leaveTypeName}</span>
                                <CalendarOff size={18} className="type-icon" />
                            </div>
                            <div className="card-numbers">
                                <span className="available-num font-mono">{bal.availableDays}</span>
                                <span className="total-label">/ {bal.totalEntitled} available</span>
                            </div>
                            <div className="card-breakdown-row">
                                <span className="used-stat">Used: {bal.usedDays}</span>
                                {Number(bal.pendingDays) > 0 && (
                                    <span className="pending-stat">Pending: {bal.pendingDays}</span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-balances-box">
                        <p>No leave balances assigned to your employee account.</p>
                    </div>
                )}
            </div>

            {/* Leave Requests History Table */}
            <div className="requests-history-card">
                <div className="card-header">
                    <div className="title-group">
                        <Clock size={18} className="header-icon" />
                        <h2>My Time Off History</h2>
                    </div>
                </div>

                {loading && myRequests.length === 0 ? (
                    <Spinner label="Loading leave history..." />
                ) : (
                    <AdvancedTable columns={columns} data={myRequests} pageSize={10} />
                )}
            </div>

            {/* Apply Leave Modal */}
            <ApplyLeaveModal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                leaveTypes={leaveTypes}
                leaveBalances={leaveBalances}
                onSuccess={() => {
                    loadMyRequests();
                    loadMyBalances();
                }}
            />

            {/* Cancel Confirmation Dialog */}
            <Dialog
                isOpen={isConfirmCancelOpen}
                onClose={() => setIsConfirmCancelOpen(false)}
                title="Cancel Time Off Request?"
                variant="danger"
                confirmText="Yes, Cancel Request"
                onConfirm={handleConfirmCancel}
            >
                <p>
                    Are you sure you want to cancel this pending time off request? This action
                    cannot be undone.
                </p>
            </Dialog>
        </div>
    );
}

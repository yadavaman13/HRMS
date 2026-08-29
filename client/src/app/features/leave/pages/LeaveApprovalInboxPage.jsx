import { useState, useEffect, useContext, useMemo } from 'react';
import { LeaveContext } from '../context/leave.context';
import { useLeave } from '../hooks/useLeave';
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';
import Dialog from '@/components/Shared/Feedback/Dialog';
import InputField from '@/components/Shared/Form/InputField/InputField';
import SearchBar from '@/components/Shared/Form/SearchBar/SearchBar';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import { useToast } from '@/components/Shared/Feedback/Toast';
import { getAvatarUrl } from '@/utils/avatar';
import { Check, X, Clock, CheckCircle2 } from 'lucide-react';
import './LeaveApprovalInboxPage.scss';

export default function LeaveApprovalInboxPage() {
    const { approvalQueue, loading } = useContext(LeaveContext);
    const { loadApprovalQueue, handleReviewLeave } = useLeave();
    const { success, error: toastError } = useToast();

    const [statusFilter, setStatusFilter] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
    const [searchQuery, setSearchQuery] = useState('');

    // Review Modal States
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [reviewAction, setReviewAction] = useState('approved'); // 'approved' | 'rejected'
    const [reviewRemarks, setReviewRemarks] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    useEffect(() => {
        loadApprovalQueue({ status: statusFilter === 'all' ? undefined : statusFilter });
    }, [statusFilter, loadApprovalQueue]);

    const handleOpenReview = (req, action) => {
        setSelectedRequest(req);
        setReviewAction(action);
        setReviewRemarks('');
        setReviewModalOpen(true);
    };

    const handleConfirmReview = async () => {
        if (!selectedRequest) return;

        setIsSubmittingReview(true);
        try {
            await handleReviewLeave(selectedRequest.id, {
                status: reviewAction,
                reviewRemarks: reviewRemarks.trim() || undefined,
            });
            success(`Leave request ${reviewAction} successfully.`);
            setReviewModalOpen(false);
            loadApprovalQueue({ status: statusFilter === 'all' ? undefined : statusFilter });
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Review action failed';
            toastError(msg);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    // Filter queue
    const filteredRequests = useMemo(() => {
        return approvalQueue.filter((req) => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
                (req.employeeName && req.employeeName.toLowerCase().includes(query)) ||
                (req.employeeCode && req.employeeCode.toLowerCase().includes(query)) ||
                (req.departmentName && req.departmentName.toLowerCase().includes(query))
            );
        });
    }, [approvalQueue, searchQuery]);

    const pendingCount = approvalQueue.filter((r) => r.status?.toLowerCase() === 'pending').length;

    const columns = [
        {
            key: 'applicant',
            label: 'Applicant',
            render: (_, row) => (
                <div className="applicant-cell">
                    <img
                        src={getAvatarUrl(row.profileImage)}
                        alt={row.employeeName}
                        className="applicant-avatar"
                    />
                    <div className="applicant-info">
                        <span className="applicant-name">{row.employeeName}</span>
                        <span className="applicant-meta">
                            {row.employeeCode} • {row.departmentName || 'General'}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: 'leaveType',
            label: 'Leave Type',
            render: (_, row) => (
                <div className="type-cell">
                    <span className="type-title">{row.leaveTypeName}</span>
                    {row.balanceRemaining !== undefined && (
                        <span className="balance-hint">Bal: {row.balanceRemaining}d left</span>
                    )}
                </div>
            ),
        },
        {
            key: 'dates',
            label: 'Requested Period',
            render: (_, row) => (
                <div className="dates-cell">
                    <span className="dates-range">
                        {row.startDate} {row.endDate !== row.startDate && `to ${row.endDate}`}
                    </span>
                    <span className="days-calc font-mono font-semibold">
                        {row.isHalfDay ? '0.5 Day' : `${row.requestedDays || 1} Days`}
                    </span>
                </div>
            ),
        },
        {
            key: 'reason',
            label: 'Applicant Note / Reason',
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
                        className={`status-chip ${isApproved ? 'chip-approved' : isPending ? 'chip-pending' : isRejected ? 'chip-rejected' : 'chip-cancelled'}`}
                    >
                        {val ? val.toUpperCase() : 'PENDING'}
                    </span>
                );
            },
        },
        {
            key: 'actions',
            label: 'Decision',
            render: (_, row) => {
                const isPending = row.status?.toLowerCase() === 'pending';
                if (!isPending) {
                    return <span className="reviewed-tag">Processed</span>;
                }

                return (
                    <div className="decision-actions">
                        <button
                            className="decision-btn approve"
                            title="Approve Leave"
                            onClick={() => handleOpenReview(row, 'approved')}
                        >
                            <Check size={14} /> Approve
                        </button>
                        <button
                            className="decision-btn reject"
                            title="Reject Leave"
                            onClick={() => handleOpenReview(row, 'rejected')}
                        >
                            <X size={14} /> Reject
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="leave-approval-inbox-page">
            {/* Page Header */}
            <div className="page-header-row">
                <div>
                    <h1 className="page-title">Leave Approval Inbox</h1>
                    <p className="page-subtitle">
                        Review, validate balances, check team overlaps, and process employee time
                        off requests.
                    </p>
                </div>
            </div>

            {/* Top Status Tabs */}
            <div className="status-tabs-bar">
                <button
                    className={`tab-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('pending')}
                >
                    <Clock size={16} /> Pending Queue
                    {pendingCount > 0 && <span className="badge-count">{pendingCount}</span>}
                </button>
                <button
                    className={`tab-btn ${statusFilter === 'approved' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('approved')}
                >
                    <CheckCircle2 size={16} /> Approved
                </button>
                <button
                    className={`tab-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('rejected')}
                >
                    <X size={16} /> Rejected
                </button>
                <button
                    className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('all')}
                >
                    All Requests
                </button>
            </div>

            {/* Filter Search Bar */}
            <div className="search-filter-row">
                <SearchBar
                    placeholder="Search applicant name, ID code, or department..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                />
            </div>

            {/* Table Container */}
            <div className="queue-table-card">
                {loading && approvalQueue.length === 0 ? (
                    <Spinner label="Loading leave requests queue..." />
                ) : (
                    <AdvancedTable columns={columns} data={filteredRequests} pageSize={15} />
                )}
            </div>

            {/* Review Leave Modal */}
            <Dialog
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                title={`${reviewAction === 'approved' ? 'Approve' : 'Reject'} Time Off Request?`}
                variant={reviewAction === 'approved' ? 'default' : 'danger'}
                confirmText={reviewAction === 'approved' ? 'Approve Leave' : 'Reject Leave'}
                onConfirm={handleConfirmReview}
            >
                <div className="review-dialog-content">
                    <p>
                        Are you sure you want to <strong>{reviewAction}</strong> the time off
                        request for <strong>{selectedRequest?.employeeName}</strong> (
                        {selectedRequest?.requestedDays} days from {selectedRequest?.startDate} to{' '}
                        {selectedRequest?.endDate})?
                    </p>
                    <InputField
                        label="Manager / HR Remarks (Optional)"
                        value={reviewRemarks}
                        onChange={(e) => setReviewRemarks(e.target.value)}
                        placeholder="e.g. Approved. Please ensure task handover is completed."
                    />
                </div>
            </Dialog>
        </div>
    );
}

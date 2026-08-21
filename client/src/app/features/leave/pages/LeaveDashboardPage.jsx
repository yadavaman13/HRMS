import { useState, useEffect } from 'react';
import { useLeave } from '../hooks/useLeave';
import LeaveBalanceCards from '../components/LeaveBalanceCards/LeaveBalanceCards';
import LeaveRequestTable from '../components/LeaveRequestTable/LeaveRequestTable';
import ApplyLeaveModal from '../components/ApplyLeaveModal/ApplyLeaveModal';
import Button from '@/components/Shared/Buttons/Button/Button';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import { PlusCircle } from 'lucide-react';
import './LeaveDashboardPage.scss';

export default function LeaveDashboardPage() {
    const { balances, myRequests, fetchMyBalances, fetchMyRequests, handleCancelLeave, loading } =
        useLeave();

    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    useEffect(() => {
        fetchMyBalances();
        fetchMyRequests();
    }, []);

    const safeRequests = Array.isArray(myRequests) ? myRequests : [];

    return (
        <div className="leave-dashboard-page">
            <div className="leave-dashboard-page__header">
                <div>
                    <h1 className="leave-dashboard-page__title">Time-Off & Leave Balances</h1>
                    <p className="leave-dashboard-page__subtitle">
                        Track quota entitlements, submit time-off requests, and review approval
                        status.
                    </p>
                </div>

                <Button
                    variant="primary"
                    icon={PlusCircle}
                    onClick={() => setIsApplyModalOpen(true)}
                >
                    Apply for Time Off
                </Button>
            </div>

            <div className="leave-dashboard-page__balances-section">
                <LeaveBalanceCards balances={balances} />
            </div>

            <div className="leave-dashboard-page__history-section">
                <div className="history-header">
                    <h2 className="history-title">My Leave Applications</h2>
                </div>

                {loading && safeRequests.length === 0 ? (
                    <div className="leave-dashboard-page__loading">
                        <Spinner label="Loading leave requests..." />
                    </div>
                ) : (
                    <LeaveRequestTable
                        requests={safeRequests}
                        onCancelRequest={(id) => handleCancelLeave(id)}
                    />
                )}
            </div>

            {isApplyModalOpen && (
                <ApplyLeaveModal
                    isOpen={isApplyModalOpen}
                    onClose={() => setIsApplyModalOpen(false)}
                />
            )}
        </div>
    );
}

import { useState, useMemo } from 'react';
import { useLeave } from '../../hooks/useLeave';
import Dialog from '@/components/Shared/Feedback/Dialog/Dialog';
import Button from '@/components/Shared/Buttons/Button/Button';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import Textarea from '@/components/Shared/Form/Textarea/Textarea';
import ToastNotification from '@/components/Shared/Feedback/ToastNotification/ToastNotification';
import { Send, AlertCircle } from 'lucide-react';
import './ApplyLeaveModal.scss';

export default function ApplyLeaveModal({ isOpen, onClose }) {
    const { handleApplyLeave, loading } = useLeave();

    const [leaveType, setLeaveType] = useState('PTO');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const leaveTypeOptions = [
        { label: 'Paid Time Off (PTO)', value: 'PTO' },
        { label: 'Sick Leave (Medical)', value: 'SICK' },
        { label: 'Casual Leave', value: 'CASUAL' },
        { label: 'Leave Without Pay (LWP)', value: 'LWP' },
    ];

    // Compute working days (excluding weekends)
    const workingDaysCount = useMemo(() => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start > end) return 0;

        let count = 0;
        const cur = new Date(start);
        while (cur <= end) {
            const dayOfWeek = cur.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                // Not Sunday (0) and not Saturday (6)
                count++;
            }
            cur.setDate(cur.getDate() + 1);
        }
        return count;
    }, [startDate, endDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!startDate || !endDate) {
            setError('Please select both start and end dates');
            return;
        }

        if (workingDaysCount <= 0) {
            setError('Selected date range contains 0 working days');
            return;
        }

        if (!reason.trim()) {
            setError('Please provide a reason for the leave');
            return;
        }

        try {
            await handleApplyLeave({
                type: leaveType,
                leaveTypeCode: leaveType,
                startDate,
                endDate,
                workingDays: workingDaysCount,
                reason,
            });
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1200);
        } catch (err) {
            setError(
                err.response?.data?.message || err.message || 'Failed to submit leave application',
            );
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Apply for Time Off" size="md">
            <div className="apply-leave-modal">
                {error && (
                    <ToastNotification
                        variant="error"
                        title="Application Notice"
                        message={error}
                        onClose={() => setError('')}
                    />
                )}

                {success && (
                    <ToastNotification
                        variant="success"
                        title="Application Submitted"
                        message="Your leave request has been submitted to your manager/HR for review."
                    />
                )}

                <form onSubmit={handleSubmit} className="apply-leave-modal__form">
                    <Dropdown
                        label="Leave Type *"
                        options={leaveTypeOptions}
                        value={leaveType}
                        onChange={(val) => setLeaveType(val)}
                    />

                    <div className="apply-leave-modal__row">
                        <InputField
                            label="Start Date *"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                        <InputField
                            label="End Date *"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="apply-leave-modal__summary-box">
                        <div className="summary-col">
                            <span className="summary-label">Net Working Days Deducted:</span>
                            <span className="summary-val font-mono">{workingDaysCount} Days</span>
                        </div>
                        <span className="summary-note">
                            Excludes weekends and scheduled holidays
                        </span>
                    </div>

                    <Textarea
                        label="Reason for Time Off *"
                        placeholder="Briefly state reason for leave..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        rows={3}
                    />

                    {leaveType === 'SICK' && (
                        <div className="apply-leave-modal__note">
                            <AlertCircle size={14} />
                            <span>
                                Medical certificates can be submitted upon return or uploaded in
                                profile documents.
                            </span>
                        </div>
                    )}

                    <div className="apply-leave-modal__actions">
                        <Button variant="ghost" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            icon={Send}
                            loading={loading}
                            disabled={loading || success || workingDaysCount <= 0}
                        >
                            Submit Leave Application
                        </Button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
}

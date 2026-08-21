import { useState } from 'react';
import { useAttendance } from '../../hooks/useAttendance';
import Dialog from '@/components/Shared/Feedback/Dialog/Dialog';
import Button from '@/components/Shared/Buttons/Button/Button';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Textarea from '@/components/Shared/Form/Textarea/Textarea';
import ToastNotification from '@/components/Shared/Feedback/ToastNotification/ToastNotification';
import { Send } from 'lucide-react';
import './AttendanceRegularizationModal.scss';

export default function AttendanceRegularizationModal({ isOpen, onClose, attendanceRecord }) {
    const { handleRequestAdjustment, loading } = useAttendance();

    const [checkInTime, setCheckInTime] = useState('');
    const [checkOutTime, setCheckOutTime] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!reason.trim()) {
            setError('Please provide a reason for regularization');
            return;
        }

        if (!checkInTime && !checkOutTime) {
            setError('Please specify revised check-in or check-out times');
            return;
        }

        try {
            await handleRequestAdjustment(attendanceRecord?.id, {
                proposedCheckIn: checkInTime
                    ? `${attendanceRecord?.date}T${checkInTime}:00`
                    : undefined,
                proposedCheckOut: checkOutTime
                    ? `${attendanceRecord?.date}T${checkOutTime}:00`
                    : undefined,
                reason,
            });
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1200);
        } catch (err) {
            setError(
                err.response?.data?.message || err.message || 'Failed to submit regularization',
            );
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="Attendance Regularization Request"
            size="md"
        >
            <div className="attendance-reg-modal">
                {error && (
                    <ToastNotification
                        variant="error"
                        title="Error"
                        message={error}
                        onClose={() => setError('')}
                    />
                )}

                {success && (
                    <ToastNotification
                        variant="success"
                        title="Submitted"
                        message="Regularization request submitted to HR for approval."
                    />
                )}

                <div className="attendance-reg-modal__info">
                    <span className="attendance-reg-modal__date-label">Date:</span>
                    <span className="attendance-reg-modal__date-val">
                        {attendanceRecord?.date || 'Selected Day'}
                    </span>
                </div>

                <form onSubmit={handleSubmit} className="attendance-reg-modal__form">
                    <div className="attendance-reg-modal__row">
                        <InputField
                            label="Proposed Check-In Time"
                            type="time"
                            value={checkInTime}
                            onChange={(e) => setCheckInTime(e.target.value)}
                        />
                        <InputField
                            label="Proposed Check-Out Time"
                            type="time"
                            value={checkOutTime}
                            onChange={(e) => setCheckOutTime(e.target.value)}
                        />
                    </div>

                    <Textarea
                        label="Reason for Adjustment *"
                        placeholder="Explain why punch was missed (e.g. system connectivity issue, offsite meeting)..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        rows={3}
                    />

                    <div className="attendance-reg-modal__actions">
                        <Button variant="ghost" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            icon={Send}
                            loading={loading}
                            disabled={loading || success}
                        >
                            Submit Request
                        </Button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
}

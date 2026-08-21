import { useState, useMemo } from 'react';
import Dialog from '@/components/Shared/Feedback/Dialog';
import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import DatePicker from '@/components/Shared/Form/DatePicker/DatePicker';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Button from '@/components/Shared/Buttons/Button/Button';
import { useToast } from '@/components/Shared/Feedback/Toast';
import { useLeave } from '../hooks/useLeave';
import { Calendar, AlertCircle } from 'lucide-react';
import './ApplyLeaveModal.scss';

export default function ApplyLeaveModal({
    isOpen,
    onClose,
    leaveTypes = [],
    leaveBalances = [],
    onSuccess,
}) {
    const { handleApplyLeave } = useLeave();
    const { success, error: toastError } = useToast();

    const [selectedTypeId, setSelectedTypeId] = useState('');
    const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [isHalfDay, setIsHalfDay] = useState(false);
    const [halfDaySession, setHalfDaySession] = useState('first_half'); // 'first_half' | 'second_half'
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dropdown options with remaining balance badge
    const typeOptions = useMemo(() => {
        return leaveTypes.map((t) => {
            const bal = leaveBalances.find((b) => b.leaveTypeId === t.id);
            const remaining = bal ? bal.availableDays : '0';
            return {
                value: t.id,
                label: `${t.name} (${remaining} days available)`,
            };
        });
    }, [leaveTypes, leaveBalances]);

    // Live working days calculation (excluding Sat & Sun)
    const calculatedDays = useMemo(() => {
        if (!startDate || !endDate) return 0;
        if (isHalfDay) return 0.5;

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) return 0;

        let workingDays = 0;
        const cur = new Date(start);
        while (cur <= end) {
            const dayOfWeek = cur.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                workingDays++;
            }
            cur.setDate(cur.getDate() + 1);
        }
        return workingDays;
    }, [startDate, endDate, isHalfDay]);

    // Check selected balance sufficiency
    const selectedBalance = useMemo(() => {
        return leaveBalances.find((b) => b.leaveTypeId === selectedTypeId);
    }, [leaveBalances, selectedTypeId]);

    const isExceedingBalance = useMemo(() => {
        if (!selectedBalance) return false;
        const available = Number(selectedBalance.availableDays || 0);
        return calculatedDays > available;
    }, [selectedBalance, calculatedDays]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTypeId) {
            toastError('Please select a leave type.');
            return;
        }
        if (!reason.trim()) {
            toastError('Please provide a reason for taking leave.');
            return;
        }
        if (calculatedDays <= 0) {
            toastError('End date must be equal to or after start date.');
            return;
        }

        setIsSubmitting(true);
        try {
            await handleApplyLeave({
                leaveTypeId: selectedTypeId,
                startDate,
                endDate: isHalfDay ? startDate : endDate,
                isHalfDay,
                halfDaySession: isHalfDay ? halfDaySession : undefined,
                reason: reason.trim(),
            });

            success('Time off request submitted successfully!');
            onClose();
            if (onSuccess) onSuccess();
            setReason('');
        } catch (err) {
            const msg =
                err.response?.data?.message || err.message || 'Failed to submit leave request';
            toastError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="Apply for Time Off"
            size="md"
            showFooter={false}
        >
            <form onSubmit={handleSubmit} className="apply-leave-form">
                <Dropdown
                    label="Leave Type"
                    id="leave-type-select"
                    options={typeOptions}
                    value={selectedTypeId}
                    onChange={setSelectedTypeId}
                    placeholder="Select Leave Type"
                    required
                />

                <div className="half-day-toggle-row">
                    <label className="toggle-label">
                        <input
                            type="checkbox"
                            checked={isHalfDay}
                            onChange={(e) => setIsHalfDay(e.target.checked)}
                        />
                        <span>Apply for Half Day only</span>
                    </label>

                    {isHalfDay && (
                        <div className="session-pill-selector">
                            <button
                                type="button"
                                className={`session-pill ${halfDaySession === 'first_half' ? 'active' : ''}`}
                                onClick={() => setHalfDaySession('first_half')}
                            >
                                First Half (Morning)
                            </button>
                            <button
                                type="button"
                                className={`session-pill ${halfDaySession === 'second_half' ? 'active' : ''}`}
                                onClick={() => setHalfDaySession('second_half')}
                            >
                                Second Half (Afternoon)
                            </button>
                        </div>
                    )}
                </div>

                <div className="form-row-2col">
                    <DatePicker
                        label="Start Date"
                        id="leave-start-date"
                        value={startDate}
                        onChange={setStartDate}
                        required
                    />
                    {!isHalfDay && (
                        <DatePicker
                            label="End Date"
                            id="leave-end-date"
                            value={endDate}
                            onChange={setEndDate}
                            required
                        />
                    )}
                </div>

                {/* Live Working Days Duration Card */}
                <div className={`duration-summary-box ${isExceedingBalance ? 'is-warning' : ''}`}>
                    <div className="duration-left">
                        <Calendar size={16} className="cal-icon" />
                        <span>Calculated Working Duration:</span>
                    </div>
                    <span className="days-number font-mono font-bold">
                        {calculatedDays} {calculatedDays === 1 ? 'Working Day' : 'Working Days'}
                    </span>
                </div>

                {isExceedingBalance && (
                    <div className="balance-warning-alert">
                        <AlertCircle size={15} />
                        <span>
                            Warning: Requested {calculatedDays} days exceed your remaining balance
                            of {selectedBalance?.availableDays || 0} days. Excess will be logged as
                            Unpaid Leave.
                        </span>
                    </div>
                )}

                <InputField
                    label="Reason for Time Off"
                    id="leave-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Brief explanation for your manager..."
                    required
                />

                <div className="modal-actions-bar">
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" loading={isSubmitting}>
                        Submit Leave Request
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}

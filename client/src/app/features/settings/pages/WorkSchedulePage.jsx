import { useState, useEffect, useContext } from 'react';
import { SettingsContext } from '../context/settings.context';
import { useSettings } from '../hooks/useSettings';
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';
import Button from '@/components/Shared/Buttons/Button/Button';
import Dialog from '@/components/Shared/Feedback/Dialog';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import { useToast } from '@/components/Shared/Feedback/Toast';
import { Plus, Trash2 } from 'lucide-react';
import './WorkSchedulePage.scss';

export default function WorkSchedulePage() {
    const { schedules, loading } = useContext(SettingsContext);
    const { loadWorkSchedules, handleCreateSchedule, handleDeleteSchedule } = useSettings();
    const { success, error: toastError } = useToast();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [name, setName] = useState('Standard General Shift');
    const [startTime, setStartTime] = useState('09:30');
    const [endTime, setEndTime] = useState('18:30');
    const [graceMinutes, setGraceMinutes] = useState('15');
    const [halfDayHours, setHalfDayHours] = useState('4.5');
    const [workDays, setWorkDays] = useState([
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadWorkSchedules();
    }, [loadWorkSchedules]);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await handleCreateSchedule({
                name: name.trim(),
                startTime,
                endTime,
                graceMinutes: Number(graceMinutes),
                halfDayHours: Number(halfDayHours),
                workDays,
            });
            success('Work schedule shift created successfully.');
            setIsCreateModalOpen(false);
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to create schedule';
            toastError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleWorkDay = (day) => {
        if (workDays.includes(day)) {
            setWorkDays(workDays.filter((d) => d !== day));
        } else {
            setWorkDays([...workDays, day]);
        }
    };

    const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const columns = [
        {
            key: 'name',
            label: 'Shift Name',
            render: (val) => <span className="font-semibold text-primary">{val}</span>,
        },
        {
            key: 'hours',
            label: 'Shift Hours',
            render: (_, row) => (
                <span className="font-mono">
                    {row.startTime} to {row.endTime}
                </span>
            ),
        },
        {
            key: 'grace',
            label: 'Grace Period',
            render: (_, row) => <span>{row.graceMinutes || 15} mins</span>,
        },
        {
            key: 'halfDay',
            label: 'Half Day Min',
            render: (_, row) => <span>{row.halfDayHours || 4.5} hrs</span>,
        },
        {
            key: 'workDays',
            label: 'Working Days',
            render: (_, row) => {
                const days = Array.isArray(row.workDays)
                    ? row.workDays
                    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
                return (
                    <div className="days-tags">
                        {days.map((d, idx) => (
                            <span key={idx} className="day-pill">
                                {d.slice(0, 3)}
                            </span>
                        ))}
                    </div>
                );
            },
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <Button
                    variant="ghost"
                    size="xs"
                    className="delete-btn"
                    onClick={() => handleDeleteSchedule(row.id)}
                >
                    <Trash2 size={13} />
                </Button>
            ),
        },
    ];

    return (
        <div className="work-schedule-page">
            <div className="page-header-row">
                <div>
                    <h1 className="page-title">Work Schedules & Shifts</h1>
                    <p className="page-subtitle">
                        Define working hours, punch grace intervals, half-day thresholds, and
                        working week schedules.
                    </p>
                </div>
                <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={16} /> New Work Schedule
                </Button>
            </div>

            <div className="table-card">
                {loading && schedules.length === 0 ? (
                    <Spinner label="Loading work schedules..." />
                ) : (
                    <AdvancedTable columns={columns} data={schedules} pageSize={10} />
                )}
            </div>

            {/* Create Schedule Modal */}
            <Dialog
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create Work Schedule"
                size="md"
                showFooter={false}
            >
                <form onSubmit={handleCreateSubmit} className="create-schedule-form">
                    <InputField
                        label="Shift Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Standard General Shift (9:30 - 18:30)"
                        required
                    />

                    <div className="form-row-2col">
                        <InputField
                            label="Start Time"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                        <InputField
                            label="End Time"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-row-2col">
                        <InputField
                            label="Grace Period (Minutes)"
                            type="number"
                            value={graceMinutes}
                            onChange={(e) => setGraceMinutes(e.target.value)}
                            required
                        />
                        <InputField
                            label="Half-Day Min (Hours)"
                            type="number"
                            step="0.5"
                            value={halfDayHours}
                            onChange={(e) => setHalfDayHours(e.target.value)}
                            required
                        />
                    </div>

                    <div className="days-picker-group">
                        <label className="picker-label">Weekly Working Days</label>
                        <div className="days-button-row">
                            {daysList.map((day) => {
                                const selected = workDays.includes(day);
                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        className={`day-toggle-btn ${selected ? 'is-selected' : ''}`}
                                        onClick={() => toggleWorkDay(day)}
                                    >
                                        {day.slice(0, 3)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="modal-actions-bar">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" loading={isSubmitting}>
                            Save Schedule
                        </Button>
                    </div>
                </form>
            </Dialog>
        </div>
    );
}

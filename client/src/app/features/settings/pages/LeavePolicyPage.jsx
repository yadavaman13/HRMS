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
import './LeavePolicyPage.scss';

export default function LeavePolicyPage() {
    const { leavePolicies, loading } = useContext(SettingsContext);
    const { loadLeavePolicies, handleCreatePolicy, handleDeletePolicy } = useSettings();
    const { success, error: toastError } = useToast();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [daysAllowed, setDaysAllowed] = useState('18');
    const [carryForwardLimit, setCarryForwardLimit] = useState('5');
    const [isUnpaid, setIsUnpaid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadLeavePolicies();
    }, [loadLeavePolicies]);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await handleCreatePolicy({
                name: name.trim(),
                daysAllowed: Number(daysAllowed),
                carryForwardLimit: Number(carryForwardLimit),
                isUnpaid,
            });
            success('Leave policy type registered.');
            setIsCreateModalOpen(false);
            setName('');
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to create policy';
            toastError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Leave Type Policy',
            render: (val) => <span className="font-semibold text-primary">{val}</span>,
        },
        {
            key: 'days',
            label: 'Annual Quota',
            render: (_, row) => (
                <span className="font-mono">{row.daysAllowed || row.days} Days / Year</span>
            ),
        },
        {
            key: 'carryForward',
            label: 'Carry Forward Max',
            render: (_, row) => <span>{row.carryForwardLimit || 0} Days</span>,
        },
        {
            key: 'isUnpaid',
            label: 'Pay Type',
            render: (val) => (
                <span className={`policy-badge ${val ? 'unpaid' : 'paid'}`}>
                    {val ? 'Unpaid (LOP)' : 'Paid Leave'}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <Button
                    variant="ghost"
                    size="xs"
                    className="delete-btn"
                    onClick={() => handleDeletePolicy(row.id)}
                >
                    <Trash2 size={13} />
                </Button>
            ),
        },
    ];

    return (
        <div className="leave-policy-page">
            <div className="page-header-row">
                <div>
                    <h1 className="page-title">Leave Policies & Quotas</h1>
                    <p className="page-subtitle">
                        Configure company leave categories, annual entitlement allocations, and
                        carry-over limits.
                    </p>
                </div>
                <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={16} /> New Leave Policy
                </Button>
            </div>

            <div className="table-card">
                {loading && leavePolicies.length === 0 ? (
                    <Spinner label="Loading leave policies..." />
                ) : (
                    <AdvancedTable columns={columns} data={leavePolicies} pageSize={10} />
                )}
            </div>

            {/* Create Policy Dialog */}
            <Dialog
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create Leave Policy"
                size="md"
                showFooter={false}
            >
                <form onSubmit={handleCreateSubmit} className="create-policy-form">
                    <InputField
                        label="Leave Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Earned Paid Leave, Casual Leave"
                        required
                    />

                    <div className="form-row-2col">
                        <InputField
                            label="Annual Quota (Days)"
                            type="number"
                            value={daysAllowed}
                            onChange={(e) => setDaysAllowed(e.target.value)}
                            required
                        />
                        <InputField
                            label="Carry Forward Limit"
                            type="number"
                            value={carryForwardLimit}
                            onChange={(e) => setCarryForwardLimit(e.target.value)}
                            required
                        />
                    </div>

                    <div className="checkbox-row">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={isUnpaid}
                                onChange={(e) => setIsUnpaid(e.target.checked)}
                            />
                            <span>This is an Unpaid / Loss of Pay (LOP) category</span>
                        </label>
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
                            Save Policy
                        </Button>
                    </div>
                </form>
            </Dialog>
        </div>
    );
}

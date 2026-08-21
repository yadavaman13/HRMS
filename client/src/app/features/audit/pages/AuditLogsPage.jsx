import { useState, useEffect, useContext, useMemo } from 'react';
import { AuditContext } from '../context/audit.context';
import { useAudit } from '../hooks/useAudit';
import StatCard from '@/components/Shared/DataDisplay/StatCard/StatCard';
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';
import SearchBar from '@/components/Shared/Form/SearchBar/SearchBar';
import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import Button from '@/components/Shared/Buttons/Button/Button';
import Dialog from '@/components/Shared/Feedback/Dialog';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import { Activity, Lock, DollarSign, UserCheck, Eye } from 'lucide-react';
import './AuditLogsPage.scss';

export default function AuditLogsPage() {
    const { logs, stats, loading } = useContext(AuditContext);
    const { loadAuditLogs, loadAuditStats } = useAudit();

    const [actionFilter, setActionFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLogForJson, setSelectedLogForJson] = useState(null);
    const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

    useEffect(() => {
        loadAuditLogs({ action: actionFilter || undefined });
        loadAuditStats();
    }, [actionFilter, loadAuditLogs, loadAuditStats]);

    const filteredLogs = useMemo(() => {
        return logs.filter((log) => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return (
                (log.actorName && log.actorName.toLowerCase().includes(q)) ||
                (log.action && log.action.toLowerCase().includes(q)) ||
                (log.entityType && log.entityType.toLowerCase().includes(q)) ||
                (log.ipAddress && log.ipAddress.includes(q))
            );
        });
    }, [logs, searchQuery]);

    const handleViewJson = (log) => {
        setSelectedLogForJson(log);
        setIsJsonModalOpen(true);
    };

    const columns = [
        {
            key: 'timestamp',
            label: 'Timestamp',
            render: (val) => (
                <span className="font-mono text-xs">
                    {new Date(val).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    })}
                </span>
            ),
        },
        {
            key: 'actor',
            label: 'Actor / User',
            render: (_, row) => (
                <div className="actor-cell">
                    <span className="actor-name font-semibold">
                        {row.actorName || row.userName || 'System'}
                    </span>
                    <span className="actor-role text-xs text-secondary">
                        {row.actorRole || row.userRole || 'Admin'}
                    </span>
                </div>
            ),
        },
        {
            key: 'action',
            label: 'Action Event',
            render: (val) => {
                const act = (val || '').toUpperCase();
                const isAuth =
                    act.includes('LOGIN') || act.includes('LOGOUT') || act.includes('PASSWORD');
                const isPayroll = act.includes('PAYROLL') || act.includes('SALARY');
                const isLeave = act.includes('LEAVE');
                const badgeClass = isAuth
                    ? 'badge-auth'
                    : isPayroll
                      ? 'badge-payroll'
                      : isLeave
                        ? 'badge-leave'
                        : 'badge-system';

                return <span className={`audit-action-badge ${badgeClass}`}>{act}</span>;
            },
        },
        {
            key: 'entityType',
            label: 'Entity Affected',
            render: (_, row) => (
                <div className="entity-cell">
                    <span className="entity-type font-medium">{row.entityType || 'General'}</span>
                    {row.entityId && (
                        <span className="entity-id font-mono text-xs text-secondary">
                            #{String(row.entityId).slice(-6)}
                        </span>
                    )}
                </div>
            ),
        },
        {
            key: 'ipAddress',
            label: 'IP Address',
            render: (val) => (
                <span className="font-mono text-xs text-secondary">{val || '127.0.0.1'}</span>
            ),
        },
        {
            key: 'details',
            label: 'Payload',
            render: (_, row) => (
                <Button variant="ghost" size="xs" onClick={() => handleViewJson(row)}>
                    <Eye size={13} /> Inspect JSON
                </Button>
            ),
        },
    ];

    const st = stats || {};

    return (
        <div className="audit-logs-page">
            <div className="page-header-row">
                <div>
                    <h1 className="page-title">Security & System Audit Trail</h1>
                    <p className="page-subtitle">
                        Immutable event logging for authentication attempts, payroll calculations,
                        employee records, and administrative actions.
                    </p>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="audit-kpi-grid">
                <StatCard
                    title="Total Audit Events"
                    value={st.totalEvents || logs.length || 0}
                    icon={<Activity />}
                    subtitle="System activities recorded"
                />
                <StatCard
                    title="Auth & Security"
                    value={
                        st.authEvents ||
                        logs.filter(
                            (l) => l.action?.includes('LOGIN') || l.action?.includes('PASSWORD'),
                        ).length
                    }
                    icon={<Lock />}
                    subtitle="Logins & credentials changes"
                />
                <StatCard
                    title="Payroll Modifications"
                    value={
                        st.payrollEvents ||
                        logs.filter(
                            (l) => l.action?.includes('PAYROLL') || l.action?.includes('SALARY'),
                        ).length
                    }
                    icon={<DollarSign />}
                    subtitle="Salary & batch calculations"
                />
                <StatCard
                    title="Workforce Changes"
                    value={
                        st.employeeEvents ||
                        logs.filter((l) => l.action?.includes('EMPLOYEE')).length
                    }
                    icon={<UserCheck />}
                    subtitle="Employee onboarding & profiles"
                />
            </div>

            {/* Filters Bar */}
            <div className="audit-filters-bar">
                <div className="search-wrap">
                    <SearchBar
                        placeholder="Search audit actor, action type, IP..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                </div>
                <div className="action-dropdown-wrap">
                    <Dropdown
                        options={[
                            { value: '', label: 'All Action Types' },
                            { value: 'LOGIN', label: 'Auth: Login' },
                            { value: 'CHANGE_PASSWORD', label: 'Auth: Password Change' },
                            { value: 'EMPLOYEE_CREATE', label: 'Employee: Onboard' },
                            { value: 'EMPLOYEE_UPDATE', label: 'Employee: Update' },
                            { value: 'PAYROLL_CALCULATE', label: 'Payroll: Calculate' },
                            { value: 'LEAVE_APPROVE', label: 'Leave: Approve' },
                        ]}
                        value={actionFilter}
                        onChange={setActionFilter}
                        placeholder="Filter by Action"
                    />
                </div>
            </div>

            {/* Audit Logs Table Card */}
            <div className="audit-table-card">
                {loading && logs.length === 0 ? (
                    <Spinner label="Loading security audit records..." />
                ) : (
                    <AdvancedTable columns={columns} data={filteredLogs} pageSize={20} />
                )}
            </div>

            {/* JSON Metadata Inspection Modal */}
            <Dialog
                isOpen={isJsonModalOpen}
                onClose={() => setIsJsonModalOpen(false)}
                title="Audit Event Payload Inspection"
                size="md"
                showFooter={false}
            >
                <div className="json-modal-content">
                    <div className="event-meta-banner">
                        <div>
                            <strong>Action:</strong> {selectedLogForJson?.action}
                        </div>
                        <div>
                            <strong>Actor:</strong> {selectedLogForJson?.actorName} (
                            {selectedLogForJson?.ipAddress})
                        </div>
                    </div>
                    <pre className="json-code-block font-mono">
                        {JSON.stringify(
                            selectedLogForJson?.details || selectedLogForJson || {},
                            null,
                            2,
                        )}
                    </pre>
                    <div className="dialog-close-row">
                        <Button variant="secondary" onClick={() => setIsJsonModalOpen(false)}>
                            Close
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

import { useCallback, useContext } from 'react';
import { AuditContext } from '../context/audit.context';
import * as auditApi from '../services/audit.api';

export const useAudit = () => {
    const context = useContext(AuditContext);
    if (!context) {
        throw new Error('useAudit must be used within an AuditProvider');
    }

    const { setLogs, setStats, setFilters, setLoading, setError } = context;

    const loadAuditLogs = useCallback(
        async (params = {}) => {
            setLoading(true);
            setError(null);
            try {
                const data = await auditApi.fetchAuditLogs(params);
                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data?.logs)
                      ? data.data.logs
                      : Array.isArray(data.data?.auditLogs)
                        ? data.data.auditLogs
                        : Array.isArray(data.data)
                          ? data.data
                          : Array.isArray(data.logs)
                            ? data.logs
                            : [];
                setLogs(list);
                return list;
            } catch (err) {
                console.error('Error loading audit logs:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to load audit logs',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setLogs],
    );

    const loadAuditStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await auditApi.fetchAuditStats();
            const statsData = data.data || data;
            setStats(statsData);
            return statsData;
        } catch (err) {
            console.error('Error loading audit stats:', err);
            const errObj = err.response?.data || { message: err.message || 'Failed to load stats' };
            setError(errObj);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading, setStats]);

    const handleFilterChange = useCallback(
        (key, value) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        [setFilters],
    );

    // Export ACTION HANDLERS ONLY
    return {
        loadAuditLogs,
        loadAuditStats,
        handleFilterChange,
    };
};

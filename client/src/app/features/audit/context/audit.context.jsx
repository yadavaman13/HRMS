import { createContext, useState, useMemo } from 'react';

export const AuditContext = createContext(null);

export const AuditProvider = ({ children }) => {
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [filters, setFilters] = useState({ action: '', entityType: '', search: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const value = useMemo(
        () => ({
            // Read-only state (consumed by UI via useContext)
            logs,
            stats,
            filters,
            loading,
            error,

            // Setters (consumed strictly by Hooks layer)
            setLogs,
            setStats,
            setFilters,
            setLoading,
            setError,
        }),
        [logs, stats, filters, loading, error],
    );

    return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>;
};

export default AuditProvider;

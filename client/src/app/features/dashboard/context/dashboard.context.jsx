import { createContext, useState, useMemo } from 'react';

export const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
    const [adminMetrics, setAdminMetrics] = useState(null);
    const [employeeMetrics, setEmployeeMetrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const value = useMemo(
        () => ({
            // Read-only state (consumed by UI via useContext)
            adminMetrics,
            employeeMetrics,
            loading,
            error,

            // Setters (consumed strictly by Hooks layer)
            setAdminMetrics,
            setEmployeeMetrics,
            setLoading,
            setError,
        }),
        [adminMetrics, employeeMetrics, loading, error],
    );

    return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export default DashboardProvider;

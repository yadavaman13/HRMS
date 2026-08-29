import { createContext, useState, useMemo } from 'react';

export const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
    const [company, setCompany] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [leavePolicies, setLeavePolicies] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const value = useMemo(
        () => ({
            // Read-only state (consumed by UI via useContext)
            company,
            schedules,
            leavePolicies,
            holidays,
            loading,
            error,

            // Setters (consumed strictly by Hooks layer)
            setCompany,
            setSchedules,
            setLeavePolicies,
            setHolidays,
            setLoading,
            setError,
        }),
        [company, schedules, leavePolicies, holidays, loading, error],
    );

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export default SettingsProvider;

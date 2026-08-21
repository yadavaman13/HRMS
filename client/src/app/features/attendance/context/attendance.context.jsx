import { createContext, useState, useMemo } from 'react';

export const AttendanceContext = createContext(null);

export const AttendanceProvider = ({ children }) => {
    const [todayStatus, setTodayStatus] = useState(null); // { isCheckedIn, record, session, status }
    const [myRecords, setMyRecords] = useState([]);
    const [mySummary, setMySummary] = useState(null);
    const [companyRecords, setCompanyRecords] = useState([]);
    const [companySummary, setCompanySummary] = useState(null);
    const [adjustments, setAdjustments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const value = useMemo(
        () => ({
            // Read-only state (consumed by UI via useContext)
            todayStatus,
            myRecords,
            mySummary,
            companyRecords,
            companySummary,
            adjustments,
            loading,
            error,

            // Setters (consumed strictly by Hooks layer)
            setTodayStatus,
            setMyRecords,
            setMySummary,
            setCompanyRecords,
            setCompanySummary,
            setAdjustments,
            setLoading,
            setError,
        }),
        [
            todayStatus,
            myRecords,
            mySummary,
            companyRecords,
            companySummary,
            adjustments,
            loading,
            error,
        ],
    );

    return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
};

export default AttendanceProvider;

import { createContext, useState, useMemo } from 'react';

export const AttendanceContext = createContext(null);

export default function AttendanceProvider({ children }) {
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [timesheets, setTimesheets] = useState([]);
    const [summary, setSummary] = useState(null);
    const [companySummary, setCompanySummary] = useState(null);
    const [companyRecords, setCompanyRecords] = useState([]);
    const [adjustments, setAdjustments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const value = useMemo(
        () => ({
            todayAttendance,
            setTodayAttendance,
            timesheets: Array.isArray(timesheets) ? timesheets : [],
            setTimesheets,
            summary,
            setSummary,
            companySummary,
            setCompanySummary,
            companyRecords: Array.isArray(companyRecords) ? companyRecords : [],
            setCompanyRecords,
            adjustments: Array.isArray(adjustments) ? adjustments : [],
            setAdjustments,
            loading,
            setLoading,
            error,
            setError,
        }),
        [
            todayAttendance,
            timesheets,
            summary,
            companySummary,
            companyRecords,
            adjustments,
            loading,
            error,
        ],
    );

    return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
}

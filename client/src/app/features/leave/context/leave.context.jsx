import { createContext, useState, useMemo } from 'react';

export const LeaveContext = createContext(null);

export default function LeaveProvider({ children }) {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [balances, setBalances] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [allRequests, setAllRequests] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const value = useMemo(
        () => ({
            leaveTypes: Array.isArray(leaveTypes) ? leaveTypes : [],
            setLeaveTypes,
            balances: Array.isArray(balances) ? balances : [],
            setBalances,
            myRequests: Array.isArray(myRequests) ? myRequests : [],
            setMyRequests,
            allRequests: Array.isArray(allRequests) ? allRequests : [],
            setAllRequests,
            transactions: Array.isArray(transactions) ? transactions : [],
            setTransactions,
            loading,
            setLoading,
            error,
            setError,
        }),
        [leaveTypes, balances, myRequests, allRequests, transactions, loading, error],
    );

    return <LeaveContext.Provider value={value}>{children}</LeaveContext.Provider>;
}

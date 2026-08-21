import { createContext, useState, useMemo } from 'react';

export const LeaveContext = createContext(null);

export const LeaveProvider = ({ children }) => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveBalances, setLeaveBalances] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [approvalQueue, setApprovalQueue] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const value = useMemo(
        () => ({
            // Read-only state (consumed by UI via useContext)
            leaveTypes,
            leaveBalances,
            myRequests,
            approvalQueue,
            loading,
            error,

            // Setters (consumed strictly by Hooks layer)
            setLeaveTypes,
            setLeaveBalances,
            setMyRequests,
            setApprovalQueue,
            setLoading,
            setError,
        }),
        [leaveTypes, leaveBalances, myRequests, approvalQueue, loading, error],
    );

    return <LeaveContext.Provider value={value}>{children}</LeaveContext.Provider>;
};

export default LeaveProvider;

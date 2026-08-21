import { useCallback, useContext } from 'react';
import { LeaveContext } from '../context/leave.context';
import * as leaveApi from '../services/leave.api';

export const useLeave = () => {
    const context = useContext(LeaveContext);
    if (!context) {
        throw new Error('useLeave must be used within a LeaveProvider');
    }

    const {
        setLeaveTypes,
        setLeaveBalances,
        setMyRequests,
        setApprovalQueue,
        setLoading,
        setError,
    } = context;

    const loadLeaveTypes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await leaveApi.fetchLeaveTypes();
            const types = Array.isArray(data)
                ? data
                : Array.isArray(data.data?.leaveTypes)
                  ? data.data.leaveTypes
                  : Array.isArray(data.data?.types)
                    ? data.data.types
                    : Array.isArray(data.data)
                      ? data.data
                      : Array.isArray(data.leaveTypes)
                        ? data.leaveTypes
                        : [];
            setLeaveTypes(types);
            return types;
        } catch (err) {
            console.error('Error loading leave types:', err);
            const errObj = err.response?.data || {
                message: err.message || 'Failed to load leave types',
            };
            setError(errObj);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading, setLeaveTypes]);

    const loadMyBalances = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await leaveApi.fetchMyLeaveBalances();
            const balances = Array.isArray(data)
                ? data
                : Array.isArray(data.data?.balances)
                  ? data.data.balances
                  : Array.isArray(data.data)
                    ? data.data
                    : Array.isArray(data.balances)
                      ? data.balances
                      : [];
            setLeaveBalances(balances);
            return balances;
        } catch (err) {
            console.error('Error loading leave balances:', err);
            const errObj = err.response?.data || {
                message: err.message || 'Failed to load balances',
            };
            setError(errObj);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading, setLeaveBalances]);

    const loadMyRequests = useCallback(
        async (params = {}) => {
            setLoading(true);
            setError(null);
            try {
                const data = await leaveApi.fetchMyLeaveRequests(params);
                const requests = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data?.requests)
                      ? data.data.requests
                      : Array.isArray(data.data)
                        ? data.data
                        : Array.isArray(data.requests)
                          ? data.requests
                          : [];
                setMyRequests(requests);
                return requests;
            } catch (err) {
                console.error('Error loading leave requests:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to load requests',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setMyRequests],
    );

    const handleApplyLeave = useCallback(
        async (leaveData) => {
            setLoading(true);
            setError(null);
            try {
                const data = await leaveApi.applyLeaveRequest(leaveData);
                const newReq = data.data?.request || data.data || data;
                setMyRequests((prev) => [newReq, ...prev]);
                return data;
            } catch (err) {
                console.error('Error applying for leave:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to submit leave request',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setMyRequests],
    );

    const handleCancelRequest = useCallback(
        async (leaveRequestId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await leaveApi.cancelMyLeaveRequest(leaveRequestId);
                setMyRequests((prev) => prev.filter((req) => req.id !== leaveRequestId));
                return data;
            } catch (err) {
                console.error('Error cancelling leave request:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to cancel request',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setMyRequests],
    );

    const loadApprovalQueue = useCallback(
        async (params = {}) => {
            setLoading(true);
            setError(null);
            try {
                const data = await leaveApi.fetchLeaveApprovalQueue(params);
                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data?.requests)
                      ? data.data.requests
                      : Array.isArray(data.data)
                        ? data.data
                        : Array.isArray(data.requests)
                          ? data.requests
                          : [];
                setApprovalQueue(list);
                return list;
            } catch (err) {
                console.error('Error loading leave approval queue:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to load approval queue',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setApprovalQueue],
    );

    const handleReviewLeave = useCallback(
        async (leaveRequestId, reviewData) => {
            setLoading(true);
            setError(null);
            try {
                const data = await leaveApi.reviewLeaveRequest(leaveRequestId, reviewData);
                setApprovalQueue((prev) =>
                    prev.map((req) =>
                        req.id === leaveRequestId
                            ? {
                                  ...req,
                                  status: reviewData.status,
                                  reviewRemarks: reviewData.reviewRemarks,
                              }
                            : req,
                    ),
                );
                return data;
            } catch (err) {
                console.error('Error reviewing leave request:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Review action failed',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setApprovalQueue, setError, setLoading],
    );

    // Export ACTION HANDLERS ONLY
    return {
        loadLeaveTypes,
        loadMyBalances,
        loadMyRequests,
        handleApplyLeave,
        handleCancelRequest,
        loadApprovalQueue,
        handleReviewLeave,
    };
};

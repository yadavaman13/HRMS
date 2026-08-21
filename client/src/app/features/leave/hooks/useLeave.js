import { useContext } from 'react';
import { LeaveContext } from '../context/leave.context';
import * as leaveApi from '../services/leave.api';

export function useLeave() {
    const context = useContext(LeaveContext);
    if (!context) {
        throw new Error('useLeave must be used within a LeaveProvider');
    }

    const {
        leaveTypes,
        setLeaveTypes,
        balances,
        setBalances,
        myRequests,
        setMyRequests,
        allRequests,
        setAllRequests,
        transactions,
        setTransactions,
        loading,
        setLoading,
        error,
        setError,
    } = context;

    const fetchLeaveTypes = async () => {
        try {
            const res = await leaveApi.getLeaveTypes();
            const list = Array.isArray(res?.data) ? res.data : [];
            setLeaveTypes(list);
            return list;
        } catch (err) {
            console.error('Failed to fetch leave types:', err);
            setLeaveTypes([]);
        }
    };

    const fetchMyBalances = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await leaveApi.getMyBalances();
            const list = Array.isArray(res?.data) ? res.data : [];
            setBalances(list);
            return list;
        } catch (err) {
            console.error('Failed to fetch balances:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch balances');
            setBalances([]);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchMyRequests = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await leaveApi.getMyRequests(params);
            const list = Array.isArray(res?.data?.requests)
                ? res.data.requests
                : Array.isArray(res?.data)
                  ? res.data
                  : [];
            setMyRequests(list);
            return list;
        } catch (err) {
            console.error('Failed to fetch requests:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch leave history');
            setMyRequests([]);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleApplyLeave = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await leaveApi.applyLeave(formData);
            await fetchMyBalances();
            await fetchMyRequests();
            return res?.data;
        } catch (err) {
            console.error('Failed to apply leave:', err);
            setError(
                err.response?.data?.message || err.message || 'Failed to submit leave request',
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleCancelLeave = async (requestId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await leaveApi.cancelLeaveRequest(requestId);
            await fetchMyBalances();
            await fetchMyRequests();
            return res?.data;
        } catch (err) {
            console.error('Failed to cancel leave:', err);
            setError(
                err.response?.data?.message || err.message || 'Failed to cancel leave request',
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchAllRequests = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await leaveApi.getAllRequests(params);
            const list = Array.isArray(res?.data?.requests)
                ? res.data.requests
                : Array.isArray(res?.data)
                  ? res.data
                  : [];
            setAllRequests(list);
            return list;
        } catch (err) {
            console.error('Failed to fetch all requests:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch leave inbox');
            setAllRequests([]);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleApproveRequest = async (requestId, comments = '') => {
        setLoading(true);
        setError(null);
        try {
            const res = await leaveApi.approveRequest(requestId, { comments });
            await fetchAllRequests();
            return res?.data;
        } catch (err) {
            console.error('Failed to approve request:', err);
            setError(err.response?.data?.message || err.message || 'Approval failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleRejectRequest = async (requestId, comments = '') => {
        setLoading(true);
        setError(null);
        try {
            const res = await leaveApi.rejectRequest(requestId, { comments });
            await fetchAllRequests();
            return res?.data;
        } catch (err) {
            console.error('Failed to reject request:', err);
            setError(err.response?.data?.message || err.message || 'Rejection failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        leaveTypes: Array.isArray(leaveTypes) ? leaveTypes : [],
        balances: Array.isArray(balances) ? balances : [],
        myRequests: Array.isArray(myRequests) ? myRequests : [],
        allRequests: Array.isArray(allRequests) ? allRequests : [],
        transactions: Array.isArray(transactions) ? transactions : [],
        loading,
        error,
        fetchLeaveTypes,
        fetchMyBalances,
        fetchMyRequests,
        handleApplyLeave,
        handleCancelLeave,
        fetchAllRequests,
        handleApproveRequest,
        handleRejectRequest,
    };
}

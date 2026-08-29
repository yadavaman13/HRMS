import { useCallback, useContext } from 'react';
import { AttendanceContext } from '../context/attendance.context';
import * as attendanceApi from '../services/attendance.api';

export const useAttendance = () => {
    const context = useContext(AttendanceContext);
    if (!context) {
        throw new Error('useAttendance must be used within an AttendanceProvider');
    }

    const {
        setTodayStatus,
        setMyRecords,
        setMySummary,
        setCompanyRecords,
        setCompanySummary,
        setAdjustments,
        setLoading,
        setError,
    } = context;

    const handleCheckIn = useCallback(
        async (notes = '') => {
            setLoading(true);
            setError(null);
            try {
                const data = await attendanceApi.checkIn(notes);
                const sessionData = data.data || data;
                setTodayStatus({
                    isCheckedIn: true,
                    session: sessionData.session || sessionData,
                    record: sessionData.record || null,
                    status: 'present',
                });
                return data;
            } catch (err) {
                console.error('Error during check-in:', err);
                const errObj = err.response?.data || { message: err.message || 'Check-in failed' };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setTodayStatus],
    );

    const handleCheckOut = useCallback(
        async (notes = '') => {
            setLoading(true);
            setError(null);
            try {
                const data = await attendanceApi.checkOut(notes);
                const sessionData = data.data || data;
                setTodayStatus({
                    isCheckedIn: false,
                    session: sessionData.session || sessionData,
                    record: sessionData.record || null,
                    status: sessionData.record?.status || 'completed',
                });
                return data;
            } catch (err) {
                console.error('Error during check-out:', err);
                const errObj = err.response?.data || { message: err.message || 'Check-out failed' };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setTodayStatus],
    );

    const loadMyAttendance = useCallback(
        async (params = {}) => {
            setLoading(true);
            setError(null);
            try {
                const data = await attendanceApi.fetchMyAttendance(params);
                const records = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data?.records)
                      ? data.data.records
                      : Array.isArray(data.data?.attendance)
                        ? data.data.attendance
                        : Array.isArray(data.data)
                          ? data.data
                          : Array.isArray(data.records)
                            ? data.records
                            : [];
                setMyRecords(records);
                return records;
            } catch (err) {
                console.error('Error loading personal attendance:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to load attendance',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setMyRecords],
    );

    const loadMySummary = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await attendanceApi.fetchMySummary();
            const summary = data.data?.summary || data.data || data || {};
            setMySummary(summary);
            if (summary.today) {
                setTodayStatus(summary.today);
            }
            return summary;
        } catch (err) {
            console.error('Error loading attendance summary:', err);
            const errObj = err.response?.data || {
                message: err.message || 'Failed to load summary',
            };
            setError(errObj);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading, setMySummary, setTodayStatus]);

    const loadCompanyAttendance = useCallback(
        async (params = {}) => {
            setLoading(true);
            setError(null);
            try {
                const data = await attendanceApi.fetchCompanyAttendance(params);
                const records = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data?.records)
                      ? data.data.records
                      : Array.isArray(data.data?.attendance)
                        ? data.data.attendance
                        : Array.isArray(data.data)
                          ? data.data
                          : Array.isArray(data.records)
                            ? data.records
                            : [];
                setCompanyRecords(records);
                return records;
            } catch (err) {
                console.error('Error loading company attendance:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to load company attendance',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setCompanyRecords],
    );

    const loadCompanySummary = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await attendanceApi.fetchCompanySummary();
            const summary = data.data?.summary || data.data || data || {};
            setCompanySummary(summary);
            return summary;
        } catch (err) {
            console.error('Error loading company summary:', err);
            const errObj = err.response?.data || {
                message: err.message || 'Failed to load company summary',
            };
            setError(errObj);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading, setCompanySummary]);

    const handleRequestAdjustment = useCallback(
        async (attendanceId, adjustmentData) => {
            setLoading(true);
            setError(null);
            try {
                const data = await attendanceApi.requestAdjustment(attendanceId, adjustmentData);
                return data;
            } catch (err) {
                console.error('Error requesting adjustment:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to request adjustment',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading],
    );

    const loadAdjustments = useCallback(
        async (params = {}) => {
            setLoading(true);
            setError(null);
            try {
                const data = await attendanceApi.fetchAdjustments(params);
                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data?.adjustments)
                      ? data.data.adjustments
                      : Array.isArray(data.data)
                        ? data.data
                        : Array.isArray(data.adjustments)
                          ? data.adjustments
                          : [];
                setAdjustments(list);
                return list;
            } catch (err) {
                console.error('Error loading adjustments:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to load adjustments',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setAdjustments],
    );

    const handleReviewAdjustment = useCallback(
        async (adjustmentId, reviewData) => {
            setLoading(true);
            setError(null);
            try {
                const data = await attendanceApi.reviewAdjustment(adjustmentId, reviewData);
                setAdjustments((prev) =>
                    prev.map((adj) =>
                        adj.id === adjustmentId
                            ? { ...adj, ...reviewData, status: reviewData.status }
                            : adj,
                    ),
                );
                return data;
            } catch (err) {
                console.error('Error reviewing adjustment:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to review adjustment',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setAdjustments, setError, setLoading],
    );

    // Export ACTION HANDLERS ONLY
    return {
        handleCheckIn,
        handleCheckOut,
        loadMyAttendance,
        loadMySummary,
        loadCompanyAttendance,
        loadCompanySummary,
        handleRequestAdjustment,
        loadAdjustments,
        handleReviewAdjustment,
    };
};

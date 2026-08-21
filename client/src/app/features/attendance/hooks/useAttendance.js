import { useContext } from 'react';
import { AttendanceContext } from '../context/attendance.context';
import * as attendanceApi from '../services/attendance.api';

export function useAttendance() {
    const context = useContext(AttendanceContext);
    if (!context) {
        throw new Error('useAttendance must be used within an AttendanceProvider');
    }

    const {
        todayAttendance,
        setTodayAttendance,
        timesheets,
        setTimesheets,
        summary,
        setSummary,
        companySummary,
        setCompanySummary,
        companyRecords,
        setCompanyRecords,
        adjustments,
        setAdjustments,
        loading,
        setLoading,
        error,
        setError,
    } = context;

    const handleCheckIn = async (data = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await attendanceApi.checkIn(data);
            const record = res?.data || null;
            setTodayAttendance(record);
            await fetchMySummary();
            return record;
        } catch (err) {
            console.error('Check-in failed:', err);
            setError(err.response?.data?.message || err.message || 'Check-in failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async (data = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await attendanceApi.checkOut(data);
            const record = res?.data || null;
            setTodayAttendance(record);
            await fetchMySummary();
            return record;
        } catch (err) {
            console.error('Check-out failed:', err);
            setError(err.response?.data?.message || err.message || 'Check-out failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchMyAttendance = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await attendanceApi.getMyAttendance(params);
            const list = Array.isArray(res?.data?.records)
                ? res.data.records
                : Array.isArray(res?.data)
                  ? res.data
                  : [];
            setTimesheets(list);

            // If today's record exists, set todayAttendance
            const todayStr = new Date().toISOString().split('T')[0];
            const todayRec = list.find(
                (r) => r?.date === todayStr || (r?.createdAt && r.createdAt.startsWith(todayStr)),
            );
            if (todayRec) {
                setTodayAttendance(todayRec);
            }
            return list;
        } catch (err) {
            console.error('Failed to fetch attendance:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch attendance');
            setTimesheets([]);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchMySummary = async () => {
        try {
            const res = await attendanceApi.getMySummary();
            const sumData = res?.data || null;
            setSummary(sumData);
            if (sumData?.today) {
                setTodayAttendance(sumData.today);
            }
            return sumData;
        } catch (err) {
            console.error('Failed to fetch summary:', err);
        }
    };

    const fetchCompanySummary = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await attendanceApi.getCompanySummary();
            setCompanySummary(res?.data || null);
            return res?.data;
        } catch (err) {
            console.error('Failed to fetch company summary:', err);
            setError(
                err.response?.data?.message || err.message || 'Failed to fetch company summary',
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanyAttendance = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await attendanceApi.getAttendanceRecords(params);
            const list = Array.isArray(res?.data?.records)
                ? res.data.records
                : Array.isArray(res?.data)
                  ? res.data
                  : [];
            setCompanyRecords(list);
            return list;
        } catch (err) {
            console.error('Failed to fetch company records:', err);
            setError(
                err.response?.data?.message || err.message || 'Failed to fetch attendance records',
            );
            setCompanyRecords([]);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleRequestAdjustment = async (attendanceId, data) => {
        setLoading(true);
        setError(null);
        try {
            const res = await attendanceApi.requestAdjustment(attendanceId, data);
            await fetchMyAttendance();
            return res?.data;
        } catch (err) {
            console.error('Failed to request adjustment:', err);
            setError(err.response?.data?.message || err.message || 'Adjustment request failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchAdjustments = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await attendanceApi.getAdjustments(params);
            const list = Array.isArray(res?.data) ? res.data : [];
            setAdjustments(list);
            return list;
        } catch (err) {
            console.error('Failed to fetch adjustments:', err);
            setAdjustments([]);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleReviewAdjustment = async (adjustmentId, data) => {
        setLoading(true);
        setError(null);
        try {
            const res = await attendanceApi.reviewAdjustment(adjustmentId, data);
            await fetchAdjustments();
            return res?.data;
        } catch (err) {
            console.error('Failed to review adjustment:', err);
            setError(err.response?.data?.message || err.message || 'Adjustment review failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        todayAttendance,
        timesheets: Array.isArray(timesheets) ? timesheets : [],
        summary,
        companySummary,
        companyRecords: Array.isArray(companyRecords) ? companyRecords : [],
        adjustments: Array.isArray(adjustments) ? adjustments : [],
        loading,
        error,
        handleCheckIn,
        handleCheckOut,
        fetchMyAttendance,
        fetchMySummary,
        fetchCompanySummary,
        fetchCompanyAttendance,
        handleRequestAdjustment,
        fetchAdjustments,
        handleReviewAdjustment,
    };
}

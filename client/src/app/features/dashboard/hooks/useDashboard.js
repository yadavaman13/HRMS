import { useCallback, useContext } from 'react';
import { DashboardContext } from '../context/dashboard.context';
import * as dashboardApi from '../services/dashboard.api';

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }

    const { setAdminMetrics, setEmployeeMetrics, setLoading, setError } = context;

    const loadDashboardOverview = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await dashboardApi.fetchDashboardOverview();
            const payload = data.data || data;
            if (payload.role === 'admin' || payload.role === 'hr') {
                setAdminMetrics(payload.dashboard || payload);
            } else {
                setEmployeeMetrics(payload.dashboard || payload);
            }
            return payload;
        } catch (err) {
            console.error('Error loading dashboard overview:', err);
            const errorObj = err.response?.data || {
                message: err.message || 'Failed to load dashboard',
            };
            setError(errorObj);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setAdminMetrics, setEmployeeMetrics, setError, setLoading]);

    const loadAdminDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await dashboardApi.fetchAdminDashboard();
            const metrics = data.data || data;
            setAdminMetrics(metrics);
            return metrics;
        } catch (err) {
            console.error('Error loading admin dashboard:', err);
            const errorObj = err.response?.data || {
                message: err.message || 'Failed to load admin dashboard',
            };
            setError(errorObj);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setAdminMetrics, setError, setLoading]);

    const loadEmployeeDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await dashboardApi.fetchEmployeeDashboard();
            const metrics = data.data || data;
            setEmployeeMetrics(metrics);
            return metrics;
        } catch (err) {
            console.error('Error loading employee dashboard:', err);
            const errorObj = err.response?.data || {
                message: err.message || 'Failed to load employee dashboard',
            };
            setError(errorObj);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setEmployeeMetrics, setError, setLoading]);

    // Export ACTION HANDLERS ONLY
    return {
        loadDashboardOverview,
        loadAdminDashboard,
        loadEmployeeDashboard,
    };
};

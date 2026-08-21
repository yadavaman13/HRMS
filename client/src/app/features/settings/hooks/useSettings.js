import { useCallback, useContext } from 'react';
import { SettingsContext } from '../context/settings.context';
import * as settingsApi from '../services/settings.api';

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }

    const { setCompany, setSchedules, setLeavePolicies, setHolidays, setLoading, setError } =
        context;

    const loadCompanyProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await settingsApi.fetchCompanyProfile();
            const comp = data.data || data;
            setCompany(comp);
            return comp;
        } catch (err) {
            console.error('Error loading company profile:', err);
            const errObj = err.response?.data || {
                message: err.message || 'Failed to load company',
            };
            setError(errObj);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setCompany, setError, setLoading]);

    const handleUpdateCompany = useCallback(
        async (updateData) => {
            setLoading(true);
            setError(null);
            try {
                const data = await settingsApi.updateCompanyProfile(updateData);
                const updated = data.data || data;
                setCompany((prev) => ({ ...prev, ...updated }));
                return data;
            } catch (err) {
                console.error('Error updating company:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to update company',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setCompany, setError, setLoading],
    );

    const loadWorkSchedules = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await settingsApi.fetchWorkSchedules();
            const list = Array.isArray(data)
                ? data
                : Array.isArray(data.data?.schedules)
                  ? data.data.schedules
                  : Array.isArray(data.data)
                    ? data.data
                    : Array.isArray(data.schedules)
                      ? data.schedules
                      : [];
            setSchedules(list);
            return list;
        } catch (err) {
            console.error('Error loading work schedules:', err);
            const errObj = err.response?.data || {
                message: err.message || 'Failed to load schedules',
            };
            setError(errObj);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading, setSchedules]);

    const handleCreateSchedule = useCallback(
        async (scheduleData) => {
            setLoading(true);
            setError(null);
            try {
                const data = await settingsApi.createWorkSchedule(scheduleData);
                const newSched = data.data?.schedule || data.data || data;
                setSchedules((prev) => [...prev, newSched]);
                return data;
            } catch (err) {
                console.error('Error creating schedule:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to create schedule',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setSchedules],
    );

    const handleUpdateSchedule = useCallback(
        async (scheduleId, scheduleData) => {
            setLoading(true);
            setError(null);
            try {
                const data = await settingsApi.updateWorkSchedule(scheduleId, scheduleData);
                const updated = data.data || data;
                setSchedules((prev) =>
                    prev.map((s) => (s.id === scheduleId ? { ...s, ...updated } : s)),
                );
                return data;
            } catch (err) {
                console.error('Error updating schedule:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to update schedule',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setSchedules],
    );

    const handleDeleteSchedule = useCallback(
        async (scheduleId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await settingsApi.deleteWorkSchedule(scheduleId);
                setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
                return data;
            } catch (err) {
                console.error('Error deleting schedule:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to delete schedule',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setSchedules],
    );

    const loadLeavePolicies = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await settingsApi.fetchLeavePolicies();
            const list = Array.isArray(data)
                ? data
                : Array.isArray(data.data?.leaveTypes)
                  ? data.data.leaveTypes
                  : Array.isArray(data.data?.policies)
                    ? data.data.policies
                    : Array.isArray(data.data)
                      ? data.data
                      : Array.isArray(data.leaveTypes)
                        ? data.leaveTypes
                        : [];
            setLeavePolicies(list);
            return list;
        } catch (err) {
            console.error('Error loading leave policies:', err);
            const errObj = err.response?.data || {
                message: err.message || 'Failed to load policies',
            };
            setError(errObj);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading, setLeavePolicies]);

    const handleCreatePolicy = useCallback(
        async (policyData) => {
            setLoading(true);
            setError(null);
            try {
                const data = await settingsApi.createLeavePolicy(policyData);
                const newPol = data.data?.leaveType || data.data || data;
                setLeavePolicies((prev) => [...prev, newPol]);
                return data;
            } catch (err) {
                console.error('Error creating policy:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to create policy',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setLeavePolicies],
    );

    const handleUpdatePolicy = useCallback(
        async (policyId, policyData) => {
            setLoading(true);
            setError(null);
            try {
                const data = await settingsApi.updateLeavePolicy(policyId, policyData);
                const updated = data.data || data;
                setLeavePolicies((prev) =>
                    prev.map((p) => (p.id === policyId ? { ...p, ...updated } : p)),
                );
                return data;
            } catch (err) {
                console.error('Error updating policy:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to update policy',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setLeavePolicies],
    );

    const handleDeletePolicy = useCallback(
        async (policyId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await settingsApi.deleteLeavePolicy(policyId);
                setLeavePolicies((prev) => prev.filter((p) => p.id !== policyId));
                return data;
            } catch (err) {
                console.error('Error deleting policy:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to delete policy',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setLeavePolicies],
    );

    const loadHolidays = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await settingsApi.fetchPublicHolidays();
            const list = Array.isArray(data)
                ? data
                : Array.isArray(data.data?.holidays)
                  ? data.data.holidays
                  : Array.isArray(data.data)
                    ? data.data
                    : Array.isArray(data.holidays)
                      ? data.holidays
                      : [];
            setHolidays(list);
            return list;
        } catch (err) {
            console.error('Error loading holidays:', err);
            const errObj = err.response?.data || {
                message: err.message || 'Failed to load holidays',
            };
            setError(errObj);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading, setHolidays]);

    const handleCreateHoliday = useCallback(
        async (holidayData) => {
            setLoading(true);
            setError(null);
            try {
                const data = await settingsApi.createPublicHoliday(holidayData);
                const newHol = data.data?.holiday || data.data || data;
                setHolidays((prev) => [...prev, newHol]);
                return data;
            } catch (err) {
                console.error('Error creating holiday:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to create holiday',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setHolidays],
    );

    const handleDeleteHoliday = useCallback(
        async (holidayId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await settingsApi.deletePublicHoliday(holidayId);
                setHolidays((prev) => prev.filter((h) => h.id !== holidayId));
                return data;
            } catch (err) {
                console.error('Error deleting holiday:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to delete holiday',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setHolidays],
    );

    // Export ACTION HANDLERS ONLY
    return {
        loadCompanyProfile,
        handleUpdateCompany,
        loadWorkSchedules,
        handleCreateSchedule,
        handleUpdateSchedule,
        handleDeleteSchedule,
        loadLeavePolicies,
        handleCreatePolicy,
        handleUpdatePolicy,
        handleDeletePolicy,
        loadHolidays,
        handleCreateHoliday,
        handleDeleteHoliday,
    };
};

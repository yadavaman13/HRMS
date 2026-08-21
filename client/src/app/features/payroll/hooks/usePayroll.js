import { useCallback, useContext } from 'react';
import { PayrollContext } from '../context/payroll.context';
import * as payrollApi from '../services/payroll.api';

export const usePayroll = () => {
    const context = useContext(PayrollContext);
    if (!context) {
        throw new Error('usePayroll must be used within a PayrollProvider');
    }

    const {
        setPeriods,
        setActivePeriod,
        setBatches,
        setPayslips,
        setSelectedPayslip,
        setSalaryStructure,
        setLoading,
        setError,
    } = context;

    const loadPeriods = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await payrollApi.fetchPayrollPeriods();
            const list = Array.isArray(data)
                ? data
                : Array.isArray(data.data?.periods)
                  ? data.data.periods
                  : Array.isArray(data.data)
                    ? data.data
                    : Array.isArray(data.periods)
                      ? data.periods
                      : [];
            setPeriods(list);
            if (list.length > 0) {
                setActivePeriod(list[0]);
            }
            return list;
        } catch (err) {
            console.error('Error loading payroll periods:', err);
            const errObj = err.response?.data || {
                message: err.message || 'Failed to load periods',
            };
            setError(errObj);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading, setPeriods, setActivePeriod]);

    const handleCreatePeriod = useCallback(
        async (periodData) => {
            setLoading(true);
            setError(null);
            try {
                const data = await payrollApi.createPayrollPeriod(periodData);
                const newPeriod = data.data?.period || data.data || data;
                setPeriods((prev) => [newPeriod, ...prev]);
                setActivePeriod(newPeriod);
                return data;
            } catch (err) {
                console.error('Error creating payroll period:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to create period',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setActivePeriod, setError, setLoading, setPeriods],
    );

    const handleCalculatePayroll = useCallback(
        async (periodId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await payrollApi.calculatePayroll(periodId);
                const batchList = data.data?.batches || data.data || [];
                setBatches(batchList);
                setPeriods((prev) =>
                    prev.map((p) => (p.id === periodId ? { ...p, status: 'calculated' } : p)),
                );
                setActivePeriod((prev) =>
                    prev?.id === periodId ? { ...prev, status: 'calculated' } : prev,
                );
                return data;
            } catch (err) {
                console.error('Error calculating payroll:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Payroll calculation failed',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setActivePeriod, setBatches, setError, setLoading, setPeriods],
    );

    const handleLockPayroll = useCallback(
        async (periodId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await payrollApi.lockPayroll(periodId);
                setPeriods((prev) =>
                    prev.map((p) =>
                        p.id === periodId ? { ...p, status: 'locked', isLocked: true } : p,
                    ),
                );
                setActivePeriod((prev) =>
                    prev?.id === periodId ? { ...prev, status: 'locked', isLocked: true } : prev,
                );
                return data;
            } catch (err) {
                console.error('Error locking payroll:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to lock payroll',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setActivePeriod, setError, setLoading, setPeriods],
    );

    const handleUnlockPayroll = useCallback(
        async (periodId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await payrollApi.unlockPayroll(periodId);
                setPeriods((prev) =>
                    prev.map((p) =>
                        p.id === periodId ? { ...p, status: 'calculated', isLocked: false } : p,
                    ),
                );
                setActivePeriod((prev) =>
                    prev?.id === periodId
                        ? { ...prev, status: 'calculated', isLocked: false }
                        : prev,
                );
                return data;
            } catch (err) {
                console.error('Error unlocking payroll:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to unlock payroll',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setActivePeriod, setError, setLoading, setPeriods],
    );

    const handleMarkPaid = useCallback(
        async (periodId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await payrollApi.markPayrollPaid(periodId);
                setPeriods((prev) =>
                    prev.map((p) => (p.id === periodId ? { ...p, status: 'paid' } : p)),
                );
                setActivePeriod((prev) =>
                    prev?.id === periodId ? { ...prev, status: 'paid' } : prev,
                );
                return data;
            } catch (err) {
                console.error('Error marking payroll as paid:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to mark paid',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setActivePeriod, setError, setLoading, setPeriods],
    );

    const loadBatches = useCallback(
        async (periodId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await payrollApi.fetchPayrollBatches(periodId);
                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data?.batches)
                      ? data.data.batches
                      : Array.isArray(data.data)
                        ? data.data
                        : Array.isArray(data.batches)
                          ? data.batches
                          : [];
                setBatches(list);
                return list;
            } catch (err) {
                console.error('Error loading payroll batches:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to load batches',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setBatches, setError, setLoading],
    );

    const loadMyPayslips = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await payrollApi.fetchMyPayslips();
            const list = Array.isArray(data)
                ? data
                : Array.isArray(data.data?.payslips)
                  ? data.data.payslips
                  : Array.isArray(data.data)
                    ? data.data
                    : Array.isArray(data.payslips)
                      ? data.payslips
                      : [];
            setPayslips(list);
            return list;
        } catch (err) {
            console.error('Error loading payslips:', err);
            const errObj = err.response?.data || {
                message: err.message || 'Failed to load payslips',
            };
            setError(errObj);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading, setPayslips]);

    const loadPayslipById = useCallback(
        async (payslipId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await payrollApi.fetchPayslipById(payslipId);
                const slip = data.data || data;
                setSelectedPayslip(slip);
                return slip;
            } catch (err) {
                console.error('Error loading payslip details:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to load payslip',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setSelectedPayslip],
    );

    const loadSalaryStructure = useCallback(
        async (employeeId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await payrollApi.fetchSalaryStructure(employeeId);
                const structure = data.data || data;
                setSalaryStructure(structure);
                return structure;
            } catch (err) {
                console.error('Error loading salary structure:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to load salary structure',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setSalaryStructure],
    );

    const handleUpdateSalaryStructure = useCallback(
        async (employeeId, structureData) => {
            setLoading(true);
            setError(null);
            try {
                const data = await payrollApi.updateSalaryStructure(employeeId, structureData);
                setSalaryStructure(data.data || data);
                return data;
            } catch (err) {
                console.error('Error updating salary structure:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to update salary structure',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setSalaryStructure],
    );

    // Export ACTION HANDLERS ONLY
    return {
        loadPeriods,
        handleCreatePeriod,
        handleCalculatePayroll,
        handleLockPayroll,
        handleUnlockPayroll,
        handleMarkPaid,
        loadBatches,
        loadMyPayslips,
        loadPayslipById,
        loadSalaryStructure,
        handleUpdateSalaryStructure,
    };
};

import { useContext } from 'react';
import { PayrollContext } from '../context/payroll.context';
import * as payrollApi from '../services/payroll.api';

export function usePayroll() {
    const context = useContext(PayrollContext);
    if (!context) {
        throw new Error('usePayroll must be used within a PayrollProvider');
    }

    const {
        salaryStructure,
        setSalaryStructure,
        periods,
        setPeriods,
        payslips,
        setPayslips,
        selectedPayslip,
        setSelectedPayslip,
        components,
        setComponents,
        settings,
        setSettings,
        loading,
        setLoading,
        error,
        setError,
    } = context;

    const fetchSalaryStructure = async (employeeId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await payrollApi.getSalaryStructure(employeeId);
            const struct = res?.data || null;
            setSalaryStructure(struct);
            return struct;
        } catch (err) {
            console.error('Failed to fetch salary structure:', err);
            setError(
                err.response?.data?.message || err.message || 'Failed to load salary structure',
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSalaryStructure = async (employeeId, data) => {
        setLoading(true);
        setError(null);
        try {
            const res = await payrollApi.setSalaryStructure(employeeId, data);
            setSalaryStructure(res?.data || null);
            return res?.data;
        } catch (err) {
            console.error('Failed to save salary structure:', err);
            setError(
                err.response?.data?.message || err.message || 'Failed to save salary structure',
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchPeriods = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await payrollApi.listPeriods();
            const list = Array.isArray(res?.data?.periods)
                ? res.data.periods
                : Array.isArray(res?.data)
                  ? res.data
                  : [];
            setPeriods(list);
            return list;
        } catch (err) {
            console.error('Failed to fetch periods:', err);
            setError(
                err.response?.data?.message || err.message || 'Failed to load payroll periods',
            );
            setPeriods([]);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePeriod = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await payrollApi.createPeriod(formData);
            await fetchPeriods();
            return res?.data;
        } catch (err) {
            console.error('Failed to create period:', err);
            setError(err.response?.data?.message || err.message || 'Failed to create period');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleProcessPeriod = async (periodId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await payrollApi.processPeriod(periodId);
            await fetchPeriods();
            return res?.data;
        } catch (err) {
            console.error('Failed to process period:', err);
            setError(
                err.response?.data?.message || err.message || 'Failed to run payroll calculation',
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleFinalizePeriod = async (periodId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await payrollApi.finalizePeriod(periodId);
            await fetchPeriods();
            return res?.data;
        } catch (err) {
            console.error('Failed to finalize period:', err);
            setError(
                err.response?.data?.message ||
                    err.message ||
                    'Failed to lock and finalize payroll period',
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchPayslips = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await payrollApi.listPayslips(params);
            const list = Array.isArray(res?.data?.payslips)
                ? res.data.payslips
                : Array.isArray(res?.data)
                  ? res.data
                  : [];
            setPayslips(list);
            return list;
        } catch (err) {
            console.error('Failed to fetch payslips:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load payslips');
            setPayslips([]);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchPayslipDetails = async (payslipId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await payrollApi.getPayslipDetails(payslipId);
            const slip = res?.data || null;
            setSelectedPayslip(slip);
            return slip;
        } catch (err) {
            console.error('Failed to fetch payslip details:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load payslip');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPdf = async (payslipId, filename = 'Payslip.pdf') => {
        try {
            const blob = await payrollApi.downloadPayslipPdf(payslipId);
            const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download PDF:', err);
            throw err;
        }
    };

    return {
        salaryStructure,
        periods: Array.isArray(periods) ? periods : [],
        payslips: Array.isArray(payslips) ? payslips : [],
        selectedPayslip,
        setSelectedPayslip,
        components: Array.isArray(components) ? components : [],
        settings,
        loading,
        error,
        fetchSalaryStructure,
        handleSaveSalaryStructure,
        fetchPeriods,
        handleCreatePeriod,
        handleProcessPeriod,
        handleFinalizePeriod,
        fetchPayslips,
        fetchPayslipDetails,
        handleDownloadPdf,
    };
}

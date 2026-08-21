import { createContext, useState, useMemo } from 'react';

export const PayrollContext = createContext(null);

export default function PayrollProvider({ children }) {
    const [salaryStructure, setSalaryStructure] = useState(null);
    const [periods, setPeriods] = useState([]);
    const [payslips, setPayslips] = useState([]);
    const [selectedPayslip, setSelectedPayslip] = useState(null);
    const [components, setComponents] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const value = useMemo(
        () => ({
            salaryStructure,
            setSalaryStructure,
            periods: Array.isArray(periods) ? periods : [],
            setPeriods,
            payslips: Array.isArray(payslips) ? payslips : [],
            setPayslips,
            selectedPayslip,
            setSelectedPayslip,
            components: Array.isArray(components) ? components : [],
            setComponents,
            settings,
            setSettings,
            loading,
            setLoading,
            error,
            setError,
        }),
        [salaryStructure, periods, payslips, selectedPayslip, components, settings, loading, error],
    );

    return <PayrollContext.Provider value={value}>{children}</PayrollContext.Provider>;
}

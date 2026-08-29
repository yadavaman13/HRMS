import { createContext, useState, useMemo } from 'react';

export const PayrollContext = createContext(null);

export const PayrollProvider = ({ children }) => {
    const [periods, setPeriods] = useState([]);
    const [activePeriod, setActivePeriod] = useState(null);
    const [batches, setBatches] = useState([]);
    const [payslips, setPayslips] = useState([]);
    const [selectedPayslip, setSelectedPayslip] = useState(null);
    const [salaryStructure, setSalaryStructure] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const value = useMemo(
        () => ({
            // Read-only state (consumed by UI via useContext)
            periods,
            activePeriod,
            batches,
            payslips,
            selectedPayslip,
            salaryStructure,
            loading,
            error,

            // Setters (consumed strictly by Hooks layer)
            setPeriods,
            setActivePeriod,
            setBatches,
            setPayslips,
            setSelectedPayslip,
            setSalaryStructure,
            setLoading,
            setError,
        }),
        [
            periods,
            activePeriod,
            batches,
            payslips,
            selectedPayslip,
            salaryStructure,
            loading,
            error,
        ],
    );

    return <PayrollContext.Provider value={value}>{children}</PayrollContext.Provider>;
};

export default PayrollProvider;

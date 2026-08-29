import { createContext, useState, useMemo } from 'react';

export const EmployeesContext = createContext(null);

export const EmployeesProvider = ({ children }) => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [privateInfo, setPrivateInfo] = useState(null);
    const [filters, setFilters] = useState({ search: '', department: '', status: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const value = useMemo(
        () => ({
            // Read-only state (consumed by UI via useContext)
            employees,
            selectedEmployee,
            profileData,
            privateInfo,
            filters,
            loading,
            error,

            // Setters (consumed strictly by Hooks layer)
            setEmployees,
            setSelectedEmployee,
            setProfileData,
            setPrivateInfo,
            setFilters,
            setLoading,
            setError,
        }),
        [employees, selectedEmployee, profileData, privateInfo, filters, loading, error],
    );

    return <EmployeesContext.Provider value={value}>{children}</EmployeesContext.Provider>;
};

export default EmployeesProvider;

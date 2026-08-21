import { createContext, useState, useMemo } from 'react';

export const EmployeeContext = createContext(null);

export default function EmployeeProvider({ children }) {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [myProfile, setMyProfile] = useState(null);
    const [myPrivateInfo, setMyPrivateInfo] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
    const [filters, setFilters] = useState({ search: '', department: '', status: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const value = useMemo(
        () => ({
            employees: Array.isArray(employees) ? employees : [],
            setEmployees,
            selectedEmployee,
            setSelectedEmployee,
            myProfile,
            setMyProfile,
            myPrivateInfo,
            setMyPrivateInfo,
            pagination,
            setPagination,
            filters,
            setFilters,
            loading,
            setLoading,
            error,
            setError,
        }),
        [
            employees,
            selectedEmployee,
            myProfile,
            myPrivateInfo,
            pagination,
            filters,
            loading,
            error,
        ],
    );

    return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
}

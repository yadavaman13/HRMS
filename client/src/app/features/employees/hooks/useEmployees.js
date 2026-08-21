import { useCallback, useContext } from 'react';
import { EmployeesContext } from '../context/employees.context';
import * as employeesApi from '../services/employees.api';

export const useEmployees = () => {
    const context = useContext(EmployeesContext);
    if (!context) {
        throw new Error('useEmployees must be used within an EmployeesProvider');
    }

    const {
        setEmployees,
        setSelectedEmployee,
        setProfileData,
        setPrivateInfo,
        setFilters,
        setLoading,
        setError,
    } = context;

    const loadEmployees = useCallback(
        async (params = {}) => {
            setLoading(true);
            setError(null);
            try {
                const data = await employeesApi.fetchEmployees(params);
                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data.data?.employees)
                      ? data.data.employees
                      : Array.isArray(data.data)
                        ? data.data
                        : Array.isArray(data.employees)
                          ? data.employees
                          : [];
                setEmployees(list);
                return list;
            } catch (err) {
                console.error('Error loading employees:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to load employees',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setEmployees],
    );

    const loadEmployeeById = useCallback(
        async (employeeId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await employeesApi.fetchEmployeeById(employeeId);
                const emp = data.data || data;
                setSelectedEmployee(emp);
                return emp;
            } catch (err) {
                console.error('Error loading employee details:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to load employee',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setSelectedEmployee],
    );

    const handleCreateEmployee = useCallback(
        async (employeeData) => {
            setLoading(true);
            setError(null);
            try {
                const data = await employeesApi.createEmployee(employeeData);
                const newEmp = data.data?.employee || data.data || data;
                setEmployees((prev) => [newEmp, ...prev]);
                return data;
            } catch (err) {
                console.error('Error creating employee:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to create employee',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setEmployees],
    );

    const handleUpdateEmployee = useCallback(
        async (employeeId, updateData) => {
            setLoading(true);
            setError(null);
            try {
                const data = await employeesApi.updateEmployee(employeeId, updateData);
                const updated = data.data || data;
                setEmployees((prev) =>
                    prev.map((emp) => (emp.id === employeeId ? { ...emp, ...updated } : emp)),
                );
                setSelectedEmployee((prev) =>
                    prev?.id === employeeId ? { ...prev, ...updated } : prev,
                );
                return data;
            } catch (err) {
                console.error('Error updating employee:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to update employee',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setEmployees, setSelectedEmployee],
    );

    const handleDeleteEmployee = useCallback(
        async (employeeId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await employeesApi.deleteEmployee(employeeId);
                setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
                return data;
            } catch (err) {
                console.error('Error deleting employee:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to delete employee',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setEmployees],
    );

    const handleToggleActivation = useCallback(
        async (employeeId, currentStatus) => {
            setLoading(true);
            setError(null);
            try {
                const isCurrentlyActive = currentStatus === 'active' || currentStatus === true;
                const data = isCurrentlyActive
                    ? await employeesApi.deactivateEmployee(employeeId)
                    : await employeesApi.activateEmployee(employeeId);
                const nextStatus = isCurrentlyActive ? 'inactive' : 'active';
                setEmployees((prev) =>
                    prev.map((emp) =>
                        emp.id === employeeId
                            ? { ...emp, employmentStatus: nextStatus, isActive: !isCurrentlyActive }
                            : emp,
                    ),
                );
                return data;
            } catch (err) {
                console.error('Error toggling activation:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Activation toggle failed',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setEmployees],
    );

    const handleResetPassword = useCallback(
        async (employeeId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await employeesApi.resetEmployeePassword(employeeId);
                return data;
            } catch (err) {
                console.error('Error resetting password:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Password reset failed',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading],
    );

    const loadProfileData = useCallback(
        async (employeeId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await employeesApi.fetchEmployeeProfile(employeeId);
                const profile = data.data || data;
                setProfileData(profile);
                return profile;
            } catch (err) {
                console.error('Error loading employee profile:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to load profile',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setProfileData],
    );

    const loadPrivateInfo = useCallback(
        async (employeeId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await employeesApi.fetchPrivateInfo(employeeId);
                const info = data.data || data;
                setPrivateInfo(info);
                return info;
            } catch (err) {
                console.error('Error loading private info:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to load private info',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setPrivateInfo],
    );

    const handleUpdatePrivateInfo = useCallback(
        async (employeeId, dataToUpdate) => {
            setLoading(true);
            setError(null);
            try {
                const data = await employeesApi.updatePrivateInfo(employeeId, dataToUpdate);
                setPrivateInfo((prev) => ({ ...prev, ...dataToUpdate }));
                return data;
            } catch (err) {
                console.error('Error updating private info:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to update private info',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setPrivateInfo],
    );

    const handleUpdateBankAccount = useCallback(
        async (employeeId, bankData) => {
            setLoading(true);
            setError(null);
            try {
                const data = await employeesApi.updateBankAccount(employeeId, bankData);
                return data;
            } catch (err) {
                console.error('Error updating bank account:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to update bank account',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading],
    );

    const handleUpdateIdentifiers = useCallback(
        async (employeeId, identifierData) => {
            setLoading(true);
            setError(null);
            try {
                const data = await employeesApi.updateIdentifiers(employeeId, identifierData);
                return data;
            } catch (err) {
                console.error('Error updating identifiers:', err);
                const errObj = err.response?.data || {
                    message: err.message || 'Failed to update identifiers',
                };
                setError(errObj);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading],
    );

    const handleFilterChange = useCallback(
        (key, value) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        [setFilters],
    );

    // Export ACTION HANDLERS ONLY
    return {
        loadEmployees,
        loadEmployeeById,
        handleCreateEmployee,
        handleUpdateEmployee,
        handleDeleteEmployee,
        handleToggleActivation,
        handleResetPassword,
        loadProfileData,
        loadPrivateInfo,
        handleUpdatePrivateInfo,
        handleUpdateBankAccount,
        handleUpdateIdentifiers,
        handleFilterChange,
    };
};

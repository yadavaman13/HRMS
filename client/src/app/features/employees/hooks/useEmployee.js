import { useContext } from 'react';
import { EmployeeContext } from '../context/employee.context';
import * as employeeApi from '../services/employee.api';

export function useEmployee() {
    const context = useContext(EmployeeContext);
    if (!context) {
        throw new Error('useEmployee must be used within an EmployeeProvider');
    }

    const {
        employees,
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
    } = context;

    const fetchEmployees = async (overrideParams = {}) => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = {
                page: pagination?.page || 1,
                limit: pagination?.limit || 20,
                search: filters?.search || undefined,
                department: filters?.department || undefined,
                status: filters?.status || undefined,
                ...overrideParams,
            };
            const res = await employeeApi.listEmployees(queryParams);
            const list = Array.isArray(res?.data?.employees)
                ? res.data.employees
                : Array.isArray(res?.data)
                  ? res.data
                  : [];
            setEmployees(list);
            if (res?.data?.pagination) {
                setPagination(res.data.pagination);
            }
            return list;
        } catch (err) {
            console.error('Failed to fetch employees:', err);
            setError(err.response?.data?.message || err.message || 'Failed to fetch employees');
            setEmployees([]);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployeeById = async (employeeId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await employeeApi.getEmployeeById(employeeId);
            const employeeData = res?.data || null;
            setSelectedEmployee(employeeData);
            return employeeData;
        } catch (err) {
            console.error('Failed to fetch employee details:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load employee');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEmployee = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await employeeApi.createEmployee(formData);
            await fetchEmployees();
            return res?.data;
        } catch (err) {
            console.error('Failed to create employee:', err);
            setError(err.response?.data?.message || err.message || 'Failed to create employee');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEmployee = async (employeeId, formData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await employeeApi.updateEmployee(employeeId, formData);
            if (selectedEmployee?.id === employeeId) {
                setSelectedEmployee((prev) => ({ ...prev, ...res?.data }));
            }
            await fetchEmployees();
            return res?.data;
        } catch (err) {
            console.error('Failed to update employee:', err);
            setError(err.response?.data?.message || err.message || 'Failed to update employee');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEmployee = async (employeeId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await employeeApi.deleteEmployee(employeeId);
            setEmployees((prev) =>
                Array.isArray(prev) ? prev.filter((e) => e?.id !== employeeId) : [],
            );
            return res?.data;
        } catch (err) {
            console.error('Failed to delete employee:', err);
            setError(err.response?.data?.message || err.message || 'Failed to delete employee');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchMyProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await employeeApi.getMyProfile();
            const profileData = res?.data || null;
            setMyProfile(profileData);
            return profileData;
        } catch (err) {
            console.error('Failed to load profile:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load profile');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateMyProfile = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await employeeApi.updateMyProfile(formData);
            const updated = res?.data || null;
            setMyProfile((prev) => ({ ...prev, ...updated }));
            return updated;
        } catch (err) {
            console.error('Failed to update profile:', err);
            setError(err.response?.data?.message || err.message || 'Failed to update profile');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchMyPrivateInfo = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await employeeApi.getMyPrivateInfo();
            const info = res?.data || null;
            setMyPrivateInfo(info);
            return info;
        } catch (err) {
            console.error('Failed to load private info:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load private info');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateMyPrivateInfo = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await employeeApi.updateMyPrivateInfo(formData);
            const updated = res?.data || null;
            setMyPrivateInfo((prev) => ({ ...prev, ...updated }));
            return updated;
        } catch (err) {
            console.error('Failed to update private info:', err);
            setError(err.response?.data?.message || err.message || 'Failed to update private info');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        employees: Array.isArray(employees) ? employees : [],
        selectedEmployee,
        setSelectedEmployee,
        myProfile,
        myPrivateInfo,
        pagination,
        setPagination,
        filters,
        setFilters,
        loading,
        error,
        fetchEmployees,
        fetchEmployeeById,
        handleCreateEmployee,
        handleUpdateEmployee,
        handleDeleteEmployee,
        fetchMyProfile,
        handleUpdateMyProfile,
        fetchMyPrivateInfo,
        handleUpdateMyPrivateInfo,
    };
}

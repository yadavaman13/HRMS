import { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router';
import { EmployeesContext } from '../context/employees.context';
import { useEmployees } from '../hooks/useEmployees';
import CreateEmployeeModal from '../components/CreateEmployeeModal';
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';
import ViewToggle from '@/components/Shared/Buttons/ViewToggle/ViewToggle';
import Button from '@/components/Shared/Buttons/Button/Button';
import SearchBar from '@/components/Shared/Form/SearchBar/SearchBar';
import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import Dialog from '@/components/Shared/Feedback/Dialog';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import { useToast } from '@/components/Shared/Feedback/Toast';
import { getAvatarUrl } from '@/utils/avatar';
import {
    UserPlus,
    Eye,
    KeyRound,
    UserCheck,
    UserX,
    Mail,
    Building2,
    Briefcase,
} from 'lucide-react';
import './EmployeeDirectoryPage.scss';

export default function EmployeeDirectoryPage() {
    const navigate = useNavigate();
    const { employees, loading } = useContext(EmployeesContext);
    const { loadEmployees, handleToggleActivation, handleResetPassword } = useEmployees();
    const { success, error: toastError } = useToast();

    const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Confirmation dialog states
    const [activeActionEmp, setActiveActionEmp] = useState(null);
    const [actionType, setActionType] = useState(null); // 'toggle' | 'reset-password'
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    useEffect(() => {
        loadEmployees();
    }, [loadEmployees]);

    const empList = useMemo(() => {
        if (Array.isArray(employees)) return employees;
        if (Array.isArray(employees?.employees)) return employees.employees;
        if (Array.isArray(employees?.data)) return employees.data;
        return [];
    }, [employees]);

    // Extract unique departments from employees list
    const departmentOptions = useMemo(() => {
        const set = new Set();
        const list = [{ value: '', label: 'All Departments' }];
        empList.forEach((emp) => {
            if (emp.departmentName && !set.has(emp.departmentName)) {
                set.add(emp.departmentName);
                list.push({ value: emp.departmentName, label: emp.departmentName });
            }
        });
        return list;
    }, [empList]);

    // Filter employees based on search & dropdowns
    const filteredEmployees = useMemo(() => {
        return empList.filter((emp) => {
            const matchesSearch =
                !searchQuery ||
                `${emp.firstName || ''} ${emp.lastName || ''}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                (emp.employeeCode &&
                    emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (emp.workEmail && emp.workEmail.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesDept = !selectedDepartment || emp.departmentName === selectedDepartment;

            const matchesStatus =
                !selectedStatus ||
                (selectedStatus === 'active' && emp.employmentStatus === 'active') ||
                (selectedStatus === 'inactive' && emp.employmentStatus !== 'active');

            return matchesSearch && matchesDept && matchesStatus;
        });
    }, [empList, searchQuery, selectedDepartment, selectedStatus]);

    const handleExecuteAction = async () => {
        if (!activeActionEmp) return;

        try {
            if (actionType === 'toggle') {
                await handleToggleActivation(activeActionEmp.id, activeActionEmp.employmentStatus);
                success(`Employee status updated successfully.`);
            } else if (actionType === 'reset-password') {
                const res = await handleResetPassword(activeActionEmp.id);
                success(
                    `Temporary password generated for ${activeActionEmp.displayName || activeActionEmp.firstName}.`,
                );
            }
            setIsConfirmDialogOpen(false);
            setActiveActionEmp(null);
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Action failed';
            toastError(msg);
        }
    };

    // Table columns definition
    const tableColumns = [
        {
            key: 'employee',
            label: 'Employee',
            render: (_, row) => (
                <div className="emp-cell">
                    <img
                        src={getAvatarUrl(row.profileImage)}
                        alt={row.displayName}
                        className="emp-avatar-circle"
                    />
                    <div className="emp-names">
                        <span className="emp-full-name">
                            {row.displayName || `${row.firstName} ${row.lastName}`}
                        </span>
                        <span className="emp-code">{row.employeeCode}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'department',
            label: 'Department & Role',
            render: (_, row) => (
                <div className="dept-cell">
                    <span className="dept-name">{row.departmentName || 'General'}</span>
                    <span className="position-name">{row.jobPositionName || 'Associate'}</span>
                </div>
            ),
        },
        {
            key: 'contact',
            label: 'Contact',
            render: (_, row) => (
                <div className="contact-cell">
                    <span className="email">{row.workEmail}</span>
                    {row.phone && <span className="phone">{row.phone}</span>}
                </div>
            ),
        },
        {
            key: 'attendanceStatus',
            label: "Today's Status",
            render: (_, row) => {
                const status = (
                    row.todayAttendanceStatus ||
                    row.todayStatus ||
                    'NOT_LOGGED'
                ).toLowerCase();
                const isPresent = status === 'present';
                const isLeave = status === 'leave' || status === 'on_leave';
                const dotClass = isPresent ? 'dot-present' : isLeave ? 'dot-leave' : 'dot-absent';
                const label = isPresent ? 'Present' : isLeave ? 'On Leave' : 'Absent / Not Logged';

                return (
                    <div className="attendance-status-cell">
                        <span className={`live-dot ${dotClass}`} />
                        <span className="status-label">{label}</span>
                    </div>
                );
            },
        },
        {
            key: 'employmentStatus',
            label: 'Account Status',
            render: (_, row) => {
                const isActive = row.employmentStatus === 'active' || row.isActive;
                return (
                    <span
                        className={`status-badge ${isActive ? 'badge-active' : 'badge-inactive'}`}
                    >
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                );
            },
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <div className="table-row-actions">
                    <button
                        className="action-icon-btn view-btn"
                        title="View Profile"
                        onClick={() => navigate(`/dashboard/admin/employees/${row.id}`)}
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        className="action-icon-btn reset-btn"
                        title="Reset Password"
                        onClick={() => {
                            setActiveActionEmp(row);
                            setActionType('reset-password');
                            setIsConfirmDialogOpen(true);
                        }}
                    >
                        <KeyRound size={16} />
                    </button>
                    <button
                        className={`action-icon-btn toggle-btn ${row.employmentStatus === 'active' ? 'danger' : 'success'}`}
                        title={
                            row.employmentStatus === 'active'
                                ? 'Deactivate Account'
                                : 'Activate Account'
                        }
                        onClick={() => {
                            setActiveActionEmp(row);
                            setActionType('toggle');
                            setIsConfirmDialogOpen(true);
                        }}
                    >
                        {row.employmentStatus === 'active' ? (
                            <UserX size={16} />
                        ) : (
                            <UserCheck size={16} />
                        )}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="employee-directory-page">
            {/* Page Header */}
            <div className="page-header-row">
                <div className="title-area">
                    <h1 className="page-title">Employee Directory</h1>
                    <p className="page-subtitle">
                        Manage all employee records, department allocations, credentials, and
                        profile structures.
                    </p>
                </div>
                <div className="header-actions">
                    <ViewToggle view={viewMode} onChange={setViewMode} />
                    <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                        <UserPlus size={16} /> Onboard Employee
                    </Button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="filters-bar">
                <div className="search-field-wrapper">
                    <SearchBar
                        placeholder="Search by name, ID code, or email..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                </div>
                <div className="dropdown-filter">
                    <Dropdown
                        options={departmentOptions}
                        value={selectedDepartment}
                        onChange={setSelectedDepartment}
                        placeholder="Filter by Department"
                    />
                </div>
                <div className="dropdown-filter">
                    <Dropdown
                        options={[
                            { value: '', label: 'All Statuses' },
                            { value: 'active', label: 'Active Only' },
                            { value: 'inactive', label: 'Inactive / Terminated' },
                        ]}
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        placeholder="Account Status"
                    />
                </div>
            </div>

            {/* Content Area (Table or Grid View) */}
            {loading && empList.length === 0 ? (
                <Spinner label="Loading employee directory..." />
            ) : viewMode === 'table' ? (
                <div className="table-container-card">
                    <AdvancedTable columns={tableColumns} data={filteredEmployees} pageSize={10} />
                </div>
            ) : (
                <div className="employee-cards-grid">
                    {filteredEmployees && filteredEmployees.length > 0 ? (
                        filteredEmployees.map((emp) => {
                            const isPresent = emp.todayAttendanceStatus === 'present';
                            const isLeave = emp.todayAttendanceStatus === 'leave';
                            const dotClass = isPresent
                                ? 'dot-present'
                                : isLeave
                                  ? 'dot-leave'
                                  : 'dot-absent';

                            return (
                                <div key={emp.id} className="employee-card">
                                    <div className="card-top">
                                        <div className="avatar-wrapper">
                                            <img
                                                src={getAvatarUrl(emp.profileImage)}
                                                alt={emp.displayName}
                                                className="card-avatar"
                                            />
                                            <span
                                                className={`live-status-dot ${dotClass}`}
                                                title="Today's Attendance"
                                            />
                                        </div>
                                        <div className="card-titles">
                                            <h3 className="card-emp-name">
                                                {emp.displayName ||
                                                    `${emp.firstName} ${emp.lastName}`}
                                            </h3>
                                            <span className="card-emp-code">
                                                {emp.employeeCode}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="card-details">
                                        <div className="detail-line">
                                            <Briefcase size={14} className="detail-icon" />
                                            <span>{emp.jobPositionName || 'Position Unset'}</span>
                                        </div>
                                        <div className="detail-line">
                                            <Building2 size={14} className="detail-icon" />
                                            <span>{emp.departmentName || 'General'}</span>
                                        </div>
                                        <div className="detail-line">
                                            <Mail size={14} className="detail-icon" />
                                            <span className="text-truncate">{emp.workEmail}</span>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="profile-cta"
                                            onClick={() =>
                                                navigate(`/dashboard/admin/employees/${emp.id}`)
                                            }
                                        >
                                            View Full Profile
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="empty-results-box">
                            <p>No employees match your search criteria.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Onboarding Wizard Modal */}
            <CreateEmployeeModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {/* Confirm Action Dialog */}
            <Dialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                title={
                    actionType === 'reset-password'
                        ? 'Reset Employee Password?'
                        : 'Change Account Status?'
                }
                variant={actionType === 'reset-password' ? 'warning' : 'danger'}
                confirmText={actionType === 'reset-password' ? 'Reset Password' : 'Confirm Change'}
                onConfirm={handleExecuteAction}
            >
                <p>
                    {actionType === 'reset-password'
                        ? `Are you sure you want to generate a new temporary password for ${activeActionEmp?.displayName || activeActionEmp?.firstName}? They will be forced to update it on their next login.`
                        : `Are you sure you want to toggle the status for ${activeActionEmp?.displayName || activeActionEmp?.firstName}?`}
                </p>
            </Dialog>
        </div>
    );
}

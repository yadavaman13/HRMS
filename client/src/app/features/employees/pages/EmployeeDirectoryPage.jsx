import { useState, useEffect } from 'react';
import { useEmployee } from '../hooks/useEmployee';
import { useAuth } from '@/app/features/auth/hooks/useAuth';
import EmployeeCard from '../components/EmployeeCard/EmployeeCard';
import CreateEmployeeModal from '../components/CreateEmployeeModal/CreateEmployeeModal';
import EmployeeStatusDot from '../components/EmployeeStatusDot/EmployeeStatusDot';
import Button from '@/components/Shared/Buttons/Button/Button';
import ViewToggle from '@/components/Shared/Buttons/ViewToggle/ViewToggle';
import SearchBar from '@/components/Shared/Form/SearchBar/SearchBar';
import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import EmptyState from '@/components/Shared/DataDisplay/EmptyState/EmptyState';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import { UserPlus, Users } from 'lucide-react';
import './EmployeeDirectoryPage.scss';

export default function EmployeeDirectoryPage() {
    const { employees, loading, error, fetchEmployees, filters, setFilters } = useEmployee();
    const { user } = useAuth();

    const [viewMode, setViewMode] = useState('grid');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('');

    const isAdminOrHr = user?.role === 'admin' || user?.role === 'hr';

    useEffect(() => {
        fetchEmployees({ search: searchTerm || undefined, department: selectedDept || undefined });
    }, [searchTerm, selectedDept]);

    const departmentOptions = [
        { label: 'All Departments', value: '' },
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Product & Design', value: 'Product & Design' },
        { label: 'Human Resources', value: 'Human Resources' },
        { label: 'Finance & Accounts', value: 'Finance & Accounts' },
        { label: 'Marketing & Sales', value: 'Marketing & Sales' },
    ];

    const safeEmployees = Array.isArray(employees) ? employees : [];

    return (
        <div className="employee-directory-page">
            <div className="employee-directory-page__header">
                <div>
                    <h1 className="employee-directory-page__title">Employee Directory</h1>
                    <p className="employee-directory-page__subtitle">
                        Browse, search, and manage team members across all departments.
                    </p>
                </div>

                <div className="employee-directory-page__header-actions">
                    {isAdminOrHr && (
                        <Button
                            variant="primary"
                            icon={UserPlus}
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Onboard Employee
                        </Button>
                    )}
                </div>
            </div>

            <div className="employee-directory-page__toolbar">
                <div className="employee-directory-page__filters">
                    <div className="search-input-wrap">
                        <SearchBar
                            placeholder="Search by name, email, code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="dept-dropdown-wrap">
                        <Dropdown
                            options={departmentOptions}
                            value={selectedDept}
                            onChange={(val) => setSelectedDept(val)}
                            placeholder="Filter Department"
                        />
                    </div>
                </div>

                <div className="employee-directory-page__view-switch">
                    <ViewToggle view={viewMode} onViewChange={(v) => setViewMode(v)} />
                </div>
            </div>

            {loading ? (
                <div className="employee-directory-page__loading">
                    <Spinner label="Loading directory..." />
                </div>
            ) : safeEmployees.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No employees found"
                    description={
                        searchTerm || selectedDept
                            ? 'Try adjusting your search filters to find what you are looking for.'
                            : 'Start by onboarding your first employee to populate the directory.'
                    }
                    action={
                        isAdminOrHr && (
                            <Button
                                variant="primary"
                                icon={UserPlus}
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                Add First Employee
                            </Button>
                        )
                    }
                />
            ) : viewMode === 'grid' ? (
                <div className="employee-directory-page__grid">
                    {safeEmployees.map((emp, idx) => (
                        <EmployeeCard key={emp?.id || emp?._id || idx} employee={emp} />
                    ))}
                </div>
            ) : (
                <div className="employee-directory-page__table-wrap">
                    <table className="employee-directory-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Employee</th>
                                <th>Code</th>
                                <th>Department</th>
                                <th>Designation</th>
                                <th>Work Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {safeEmployees.map((emp, idx) => (
                                <tr key={emp?.id || emp?._id || idx}>
                                    <td>
                                        <EmployeeStatusDot
                                            status={emp?.todayStatus || 'PRESENT'}
                                            showLabel
                                        />
                                    </td>
                                    <td>
                                        <strong>
                                            {`${emp?.firstName || ''} ${emp?.lastName || ''}`.trim() ||
                                                'Employee'}
                                        </strong>
                                    </td>
                                    <td className="font-mono">
                                        {emp?.employeeCode || emp?.code || 'N/A'}
                                    </td>
                                    <td>{emp?.department || 'General'}</td>
                                    <td>{emp?.designation || emp?.role || 'Team Member'}</td>
                                    <td>{emp?.workEmail || emp?.email || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isCreateModalOpen && (
                <CreateEmployeeModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                />
            )}
        </div>
    );
}

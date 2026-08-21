import { useState } from 'react';
import { useEmployee } from '../../hooks/useEmployee';
import Dialog from '@/components/Shared/Feedback/Dialog/Dialog';
import Button from '@/components/Shared/Buttons/Button/Button';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import ToastNotification from '@/components/Shared/Feedback/ToastNotification/ToastNotification';
import { UserPlus, Sparkles } from 'lucide-react';
import './CreateEmployeeModal.scss';

export default function CreateEmployeeModal({ isOpen, onClose }) {
    const { handleCreateEmployee, loading } = useEmployee();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('Engineering');
    const [designation, setDesignation] = useState('Software Engineer');
    const [role, setRole] = useState('employee');
    const [phone, setPhone] = useState('');
    const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');
    const [createdResult, setCreatedResult] = useState(null);

    const departmentOptions = [
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Product & Design', value: 'Product & Design' },
        { label: 'Human Resources', value: 'Human Resources' },
        { label: 'Finance & Accounts', value: 'Finance & Accounts' },
        { label: 'Marketing & Sales', value: 'Marketing & Sales' },
        { label: 'Operations', value: 'Operations' },
    ];

    const roleOptions = [
        { label: 'Employee (Self-Service)', value: 'employee' },
        { label: 'HR Officer', value: 'hr' },
        { label: 'System Admin', value: 'admin' },
    ];

    const predictedCode = () => {
        const fn = (firstName || 'XX').substring(0, 2).toUpperCase();
        const ln = (lastName || 'XX').substring(0, 2).toUpperCase();
        const year = joiningDate ? new Date(joiningDate).getFullYear() : new Date().getFullYear();
        return `OI${fn}${ln}${year}####`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!firstName || !lastName || !email) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            const res = await handleCreateEmployee({
                firstName,
                lastName,
                email,
                department,
                designation,
                role,
                phone,
                joiningDate,
            });
            setCreatedResult(res);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to create employee');
        }
    };

    const handleModalClose = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setError('');
        setCreatedResult(null);
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleModalClose}
            title={createdResult ? 'Employee Onboarded Successfully' : 'Onboard New Employee'}
            size="md"
        >
            <div className="create-employee-modal">
                {error && (
                    <ToastNotification
                        variant="error"
                        title="Error"
                        message={error}
                        onClose={() => setError('')}
                    />
                )}

                {createdResult ? (
                    <div className="create-employee-modal__success">
                        <div className="create-employee-modal__success-badge">
                            <Sparkles size={28} />
                        </div>
                        <h3>Employee Account Created</h3>
                        <p className="create-employee-modal__success-desc">
                            The initial login credentials and employee sequence ID have been
                            atomically generated.
                        </p>

                        <div className="create-employee-modal__cred-box">
                            <div className="create-employee-modal__cred-row">
                                <span className="create-employee-modal__cred-label">
                                    Employee Code:
                                </span>
                                <span className="create-employee-modal__cred-value">
                                    {createdResult?.employeeCode ||
                                        createdResult?.code ||
                                        predictedCode()}
                                </span>
                            </div>
                            <div className="create-employee-modal__cred-row">
                                <span className="create-employee-modal__cred-label">
                                    Login Email:
                                </span>
                                <span className="create-employee-modal__cred-value">{email}</span>
                            </div>
                            {createdResult?.tempPassword && (
                                <div className="create-employee-modal__cred-row">
                                    <span className="create-employee-modal__cred-label">
                                        Initial Password:
                                    </span>
                                    <span className="create-employee-modal__cred-value code-highlight">
                                        {createdResult.tempPassword}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="create-employee-modal__actions">
                            <Button variant="primary" onClick={handleModalClose} fullWidth>
                                Done
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="create-employee-modal__form">
                        <div className="create-employee-modal__preview-id">
                            <span className="create-employee-modal__preview-label">
                                Atomic ID Preview:
                            </span>
                            <span className="create-employee-modal__preview-code">
                                {predictedCode()}
                            </span>
                        </div>

                        <div className="create-employee-modal__row">
                            <InputField
                                label="First Name *"
                                placeholder="e.g. John"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <InputField
                                label="Last Name *"
                                placeholder="e.g. Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="create-employee-modal__row">
                            <InputField
                                label="Work Email *"
                                type="email"
                                placeholder="john.doe@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <InputField
                                label="Phone Number"
                                placeholder="+91 98765 43210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="create-employee-modal__row">
                            <Dropdown
                                label="Department"
                                options={departmentOptions}
                                value={department}
                                onChange={(val) => setDepartment(val)}
                            />
                            <InputField
                                label="Designation / Position"
                                placeholder="e.g. Senior Frontend Engineer"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                            />
                        </div>

                        <div className="create-employee-modal__row">
                            <Dropdown
                                label="System Role"
                                options={roleOptions}
                                value={role}
                                onChange={(val) => setRole(val)}
                            />
                            <InputField
                                label="Joining Date"
                                type="date"
                                value={joiningDate}
                                onChange={(e) => setJoiningDate(e.target.value)}
                            />
                        </div>

                        <div className="create-employee-modal__actions">
                            <Button variant="ghost" onClick={handleModalClose} disabled={loading}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                disabled={loading}
                                icon={UserPlus}
                            >
                                Provision Employee Account
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </Dialog>
    );
}

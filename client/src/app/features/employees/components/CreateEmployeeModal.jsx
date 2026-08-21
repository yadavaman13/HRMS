import { useState, useMemo } from 'react';
import Dialog from '@/components/Shared/Feedback/Dialog';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import DatePicker from '@/components/Shared/Form/DatePicker/DatePicker';
import Button from '@/components/Shared/Buttons/Button/Button';
import { useToast } from '@/components/Shared/Feedback/Toast';
import { useEmployees } from '../hooks/useEmployees';
import { UserPlus, Sparkles } from 'lucide-react';
import './CreateEmployeeModal.scss';

export default function CreateEmployeeModal({
    isOpen,
    onClose,
    departments = [],
    jobPositions = [],
}) {
    const { handleCreateEmployee } = useEmployees();
    const { success, error: toastError } = useToast();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [jobPositionId, setJobPositionId] = useState('');
    const [employmentType, setEmploymentType] = useState('full_time');
    const [joiningDate, setJoiningDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [baseWage, setBaseWage] = useState('50000');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Live atomic ID code preview generator
    const codePreview = useMemo(() => {
        const fn = (firstName.trim().slice(0, 2) || 'XX').toUpperCase();
        const ln = (lastName.trim().slice(0, 2) || 'XX').toUpperCase();
        const year = joiningDate ? new Date(joiningDate).getFullYear() || 2026 : 2026;
        return `OI${fn}${ln}${year}XXXX`;
    }, [firstName, lastName, joiningDate]);

    const departmentOptions = useMemo(
        () => departments.map((d) => ({ value: d.id, label: d.name })),
        [departments],
    );

    const jobPositionOptions = useMemo(
        () => jobPositions.map((j) => ({ value: j.id, label: j.name })),
        [jobPositions],
    );

    const employmentTypeOptions = [
        { value: 'full_time', label: 'Full Time' },
        { value: 'part_time', label: 'Part Time' },
        { value: 'contract', label: 'Contractor' },
        { value: 'intern', label: 'Intern' },
    ];

    const validate = () => {
        const errors = {};
        if (!firstName.trim()) errors.firstName = 'First name is required';
        if (!lastName.trim()) errors.lastName = 'Last name is required';
        if (!email.trim() || !email.includes('@')) errors.email = 'Valid work email is required';
        if (!joiningDate) errors.joiningDate = 'Joining date is required';
        if (!baseWage || isNaN(Number(baseWage)) || Number(baseWage) <= 0) {
            errors.baseWage = 'Valid base wage amount is required';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const payload = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim() || undefined,
                departmentId: departmentId || undefined,
                jobPositionId: jobPositionId || undefined,
                employmentType,
                joiningDate,
                baseWage: Number(baseWage),
            };

            await handleCreateEmployee(payload);
            success('Employee account provisioned successfully!');
            onClose();
            // Reset form
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhone('');
            setFormErrors({});
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to onboard employee';
            toastError(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="Onboard New Employee"
            size="lg"
            showFooter={false}
        >
            <form onSubmit={handleSubmit} className="create-employee-form">
                {/* Employee ID Code Preview Banner */}
                <div className="id-preview-banner">
                    <div className="preview-label">
                        <Sparkles size={15} className="sparkle-icon" />
                        <span>System Generated ID Preview</span>
                    </div>
                    <span className="preview-code-tag">{codePreview}</span>
                </div>

                <div className="form-row-2col">
                    <InputField
                        label="First Name"
                        id="emp-first-name"
                        placeholder="e.g. John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        error={formErrors.firstName}
                        required
                    />
                    <InputField
                        label="Last Name"
                        id="emp-last-name"
                        placeholder="e.g. Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        error={formErrors.lastName}
                        required
                    />
                </div>

                <div className="form-row-2col">
                    <InputField
                        label="Work Email"
                        id="emp-email"
                        type="email"
                        placeholder="john.doe@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={formErrors.email}
                        required
                    />
                    <InputField
                        label="Phone Number"
                        id="emp-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <div className="form-row-2col">
                    <Dropdown
                        label="Department"
                        id="emp-department"
                        options={departmentOptions}
                        value={departmentId}
                        onChange={(val) => setDepartmentId(val)}
                        placeholder="Select Department"
                    />
                    <Dropdown
                        label="Job Position"
                        id="emp-position"
                        options={jobPositionOptions}
                        value={jobPositionId}
                        onChange={(val) => setJobPositionId(val)}
                        placeholder="Select Job Position"
                    />
                </div>

                <div className="form-row-3col">
                    <Dropdown
                        label="Employment Type"
                        id="emp-type"
                        options={employmentTypeOptions}
                        value={employmentType}
                        onChange={(val) => setEmploymentType(val)}
                    />
                    <DatePicker
                        label="Joining Date"
                        id="emp-joining-date"
                        value={joiningDate}
                        onChange={(val) => setJoiningDate(val)}
                        error={formErrors.joiningDate}
                        required
                    />
                    <InputField
                        label="Monthly Base Wage (₹)"
                        id="emp-wage"
                        type="number"
                        placeholder="50000"
                        value={baseWage}
                        onChange={(e) => setBaseWage(e.target.value)}
                        error={formErrors.baseWage}
                        required
                    />
                </div>

                <div className="modal-actions-footer">
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" loading={isSubmitting}>
                        <UserPlus size={16} /> Complete Provisioning
                    </Button>
                </div>
            </form>
        </Dialog>
    );
}

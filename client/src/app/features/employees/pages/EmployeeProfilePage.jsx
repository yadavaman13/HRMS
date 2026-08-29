import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { AuthContext } from '@/app/features/auth/context/AuthContext';
import { EmployeesContext } from '../context/employees.context';
import { useEmployees } from '../hooks/useEmployees';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import Button from '@/components/Shared/Buttons/Button/Button';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import { useToast } from '@/components/Shared/Feedback/Toast';
import { getAvatarUrl } from '@/utils/avatar';
import {
    User,
    Shield,
    CreditCard,
    DollarSign,
    FileText,
    Camera,
    Save,
    ArrowLeft,
    Building2,
    Briefcase,
    Mail,
    Calendar,
} from 'lucide-react';
import './EmployeeProfilePage.scss';

export default function EmployeeProfilePage({ isSelf = false }) {
    const { id: routeParamId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useContext(AuthContext);
    const { profileData, privateInfo, loading } = useContext(EmployeesContext);
    const {
        loadProfileData,
        loadPrivateInfo,
        handleUpdateProfile,
        handleUpdatePrivateInfo,
        handleUpdateBankAccount,
    } = useEmployees();
    const { success, error: toastError } = useToast();

    const isAdmin =
        currentUser?.role?.toLowerCase() === 'admin' || currentUser?.role?.toLowerCase() === 'hr';
    const targetEmployeeId = isSelf ? currentUser?.id : routeParamId || currentUser?.id;

    const [activeTab, setActiveTab] = useState('resume'); // 'resume' | 'private' | 'bank' | 'salary' | 'docs'
    const [isSaving, setIsSaving] = useState(false);

    // Tab 1: Resume / Overview States
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');

    // Tab 2: Private Info States
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('other');
    const [maritalStatus, setMaritalStatus] = useState('single');
    const [address, setAddress] = useState('');
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

    // Tab 3: Bank & Statutory States
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [panNumber, setPanNumber] = useState('');
    const [uanNumber, setUanNumber] = useState('');

    useEffect(() => {
        if (targetEmployeeId) {
            loadProfileData(targetEmployeeId).then((data) => {
                if (data) {
                    setBio(data.bio || '');
                    setSkills(
                        Array.isArray(data.skills) ? data.skills.join(', ') : data.skills || '',
                    );
                }
            });
            loadPrivateInfo(targetEmployeeId).then((data) => {
                if (data) {
                    setDob(data.dateOfBirth || '');
                    setGender(data.gender || 'other');
                    setMaritalStatus(data.maritalStatus || 'single');
                    setAddress(data.residentialAddress || '');
                    setEmergencyContactName(data.emergencyContactName || '');
                    setEmergencyContactPhone(data.emergencyContactPhone || '');
                    setBankName(data.bankName || '');
                    setAccountNumber(data.accountNumber || '');
                    setIfscCode(data.ifscCode || '');
                    setPanNumber(data.panNumber || '');
                    setUanNumber(data.uanNumber || '');
                }
            });
        }
    }, [targetEmployeeId, loadProfileData, loadPrivateInfo]);

    const handleSavePrivateInfo = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await handleUpdatePrivateInfo(targetEmployeeId, {
                dateOfBirth: dob || undefined,
                gender,
                maritalStatus,
                residentialAddress: address,
                emergencyContactName,
                emergencyContactPhone,
            });
            success('Private information updated successfully.');
        } catch (err) {
            const msg =
                err.response?.data?.message || err.message || 'Failed to update private info';
            toastError(msg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveBankInfo = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await handleUpdateBankAccount(targetEmployeeId, {
                bankName,
                accountNumber,
                ifscCode,
                panNumber,
                uanNumber,
            });
            success('Bank & statutory details updated successfully.');
        } catch (err) {
            const msg =
                err.response?.data?.message || err.message || 'Failed to update bank details';
            toastError(msg);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading && !profileData) {
        return <Spinner label="Loading employee profile..." />;
    }

    const emp = profileData || {};
    const displayName = emp.displayName || `${emp.firstName || ''} ${emp.lastName || ''}`;

    return (
        <div className="employee-profile-page">
            {/* Back CTA if in admin view */}
            {!isSelf && (
                <div className="back-navigation">
                    <button
                        className="back-btn"
                        onClick={() => navigate('/dashboard/admin/employees')}
                    >
                        <ArrowLeft size={16} /> Back to Employee Directory
                    </button>
                </div>
            )}

            {/* Profile Header Card */}
            <div className="profile-header-card">
                <div className="profile-avatar-section">
                    <div className="avatar-container">
                        <img
                            src={getAvatarUrl(emp.profileImage)}
                            alt={displayName}
                            className="profile-hero-avatar"
                        />
                        <button className="avatar-edit-badge" title="Upload new photo">
                            <Camera size={14} />
                        </button>
                    </div>
                </div>

                <div className="profile-summary-section">
                    <div className="summary-title-row">
                        <h1 className="profile-full-name">{displayName || 'Employee Profile'}</h1>
                        {emp.employeeCode && (
                            <span className="profile-code-tag">{emp.employeeCode}</span>
                        )}
                        <span
                            className={`status-pill ${emp.employmentStatus === 'active' ? 'status-active' : 'status-inactive'}`}
                        >
                            {emp.employmentStatus ? emp.employmentStatus.toUpperCase() : 'ACTIVE'}
                        </span>
                    </div>

                    <div className="summary-meta-grid">
                        <div className="meta-item">
                            <Briefcase size={14} className="meta-icon" />
                            <span>{emp.jobPositionName || 'Designation Unset'}</span>
                        </div>
                        <div className="meta-item">
                            <Building2 size={14} className="meta-icon" />
                            <span>{emp.departmentName || 'General Department'}</span>
                        </div>
                        <div className="meta-item">
                            <Mail size={14} className="meta-icon" />
                            <span>{emp.workEmail || currentUser?.email}</span>
                        </div>
                        {emp.joiningDate && (
                            <div className="meta-item">
                                <Calendar size={14} className="meta-icon" />
                                <span>Joined {emp.joiningDate}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Tab Switcher */}
            <div className="profile-tabs-bar">
                <button
                    className={`tab-btn ${activeTab === 'resume' ? 'is-active' : ''}`}
                    onClick={() => setActiveTab('resume')}
                >
                    <User size={16} /> Overview & Resume
                </button>
                <button
                    className={`tab-btn ${activeTab === 'private' ? 'is-active' : ''}`}
                    onClick={() => setActiveTab('private')}
                >
                    <Shield size={16} /> Private Information
                </button>
                {isAdmin && (
                    <button
                        className={`tab-btn ${activeTab === 'bank' ? 'is-active' : ''}`}
                        onClick={() => setActiveTab('bank')}
                    >
                        <CreditCard size={16} /> Bank & Statutory
                    </button>
                )}
                {isAdmin && (
                    <button
                        className={`tab-btn ${activeTab === 'salary' ? 'is-active' : ''}`}
                        onClick={() => setActiveTab('salary')}
                    >
                        <DollarSign size={16} /> Compensation Structure
                    </button>
                )}
                <button
                    className={`tab-btn ${activeTab === 'docs' ? 'is-active' : ''}`}
                    onClick={() => setActiveTab('docs')}
                >
                    <FileText size={16} /> Documents & Files
                </button>
            </div>

            {/* Tab 1: Overview & Resume */}
            {activeTab === 'resume' && (
                <div className="tab-pane-card">
                    <div className="pane-header">
                        <h2>Professional Background & Skills</h2>
                    </div>
                    <div className="pane-content">
                        <div className="info-group">
                            <label className="info-label">Professional Summary / Bio</label>
                            <p className="info-text">
                                {bio || 'No professional bio provided yet.'}
                            </p>
                        </div>
                        <div className="info-group">
                            <label className="info-label">Skills & Competencies</label>
                            <div className="skills-chips">
                                {skills ? (
                                    skills.split(',').map((s, idx) => (
                                        <span key={idx} className="skill-chip">
                                            {s.trim()}
                                        </span>
                                    ))
                                ) : (
                                    <p className="info-text">No skills tags listed.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 2: Private Info */}
            {activeTab === 'private' && (
                <form onSubmit={handleSavePrivateInfo} className="tab-pane-card">
                    <div className="pane-header">
                        <h2>Personal & Emergency Details</h2>
                        <Button variant="primary" size="sm" type="submit" loading={isSaving}>
                            <Save size={14} /> Save Private Info
                        </Button>
                    </div>

                    <div className="pane-form-grid">
                        <InputField
                            label="Date of Birth"
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />
                        <Dropdown
                            label="Gender"
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'other', label: 'Other' },
                            ]}
                            value={gender}
                            onChange={setGender}
                        />
                        <Dropdown
                            label="Marital Status"
                            options={[
                                { value: 'single', label: 'Single' },
                                { value: 'married', label: 'Married' },
                                { value: 'divorced', label: 'Divorced' },
                            ]}
                            value={maritalStatus}
                            onChange={setMaritalStatus}
                        />
                        <div className="full-width-field">
                            <InputField
                                label="Residential Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="House / Flat No, Street, City, State, PIN"
                            />
                        </div>
                        <InputField
                            label="Emergency Contact Name"
                            value={emergencyContactName}
                            onChange={(e) => setEmergencyContactName(e.target.value)}
                            placeholder="Full name of contact"
                        />
                        <InputField
                            label="Emergency Contact Phone"
                            type="tel"
                            value={emergencyContactPhone}
                            onChange={(e) => setEmergencyContactPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                        />
                    </div>
                </form>
            )}

            {/* Tab 3: Bank & Statutory Details (Admin Only) */}
            {activeTab === 'bank' && isAdmin && (
                <form onSubmit={handleSaveBankInfo} className="tab-pane-card">
                    <div className="pane-header">
                        <h2>Bank Account & Statutory Identifiers</h2>
                        <Button variant="primary" size="sm" type="submit" loading={isSaving}>
                            <Save size={14} /> Save Bank Details
                        </Button>
                    </div>

                    <div className="pane-form-grid">
                        <InputField
                            label="Bank Name"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="e.g. HDFC Bank, ICICI Bank"
                        />
                        <InputField
                            label="Account Number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="Account Number"
                        />
                        <InputField
                            label="IFSC Code"
                            value={ifscCode}
                            onChange={(e) => setIfscCode(e.target.value)}
                            placeholder="e.g. HDFC0001234"
                        />
                        <InputField
                            label="PAN Number"
                            value={panNumber}
                            onChange={(e) => setPanNumber(e.target.value)}
                            placeholder="ABCDE1234F"
                        />
                        <InputField
                            label="UAN / PF Number"
                            value={uanNumber}
                            onChange={(e) => setUanNumber(e.target.value)}
                            placeholder="101234567890"
                        />
                    </div>
                </form>
            )}

            {/* Tab 4: Compensation Structure (Admin Only) */}
            {activeTab === 'salary' && isAdmin && (
                <div className="tab-pane-card">
                    <div className="pane-header">
                        <h2>Compensation & Wage Overview</h2>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate('/dashboard/admin/payroll/salary-structure')}
                        >
                            Open Formula Builder
                        </Button>
                    </div>

                    <div className="salary-breakdown-card">
                        <div className="wage-row-highlight">
                            <span className="wage-label">Monthly Gross Wage</span>
                            <span className="wage-val">
                                ₹{Number(emp.baseWage || 50000).toLocaleString('en-IN')}
                            </span>
                        </div>

                        <div className="components-table">
                            <div className="comp-row">
                                <span>Basic Salary (50% of Wage)</span>
                                <span>
                                    ₹{(Number(emp.baseWage || 50000) * 0.5).toLocaleString('en-IN')}
                                </span>
                            </div>
                            <div className="comp-row">
                                <span>House Rent Allowance (HRA - 50% of Basic)</span>
                                <span>
                                    ₹
                                    {(Number(emp.baseWage || 50000) * 0.25).toLocaleString('en-IN')}
                                </span>
                            </div>
                            <div className="comp-row">
                                <span>Performance Bonus (8.33% of Basic)</span>
                                <span>
                                    ₹{(Number(emp.baseWage || 50000) * 0.5 * 0.0833).toFixed(2)}
                                </span>
                            </div>
                            <div className="comp-row">
                                <span>Leave Travel Allowance (LTA - 8.33% of Basic)</span>
                                <span>
                                    ₹{(Number(emp.baseWage || 50000) * 0.5 * 0.0833).toFixed(2)}
                                </span>
                            </div>
                            <div className="comp-row residual-row">
                                <span>Fixed Allowance (Residual Balancing)</span>
                                <span>
                                    ₹
                                    {Math.max(
                                        0,
                                        Number(emp.baseWage || 50000) -
                                            (Number(emp.baseWage || 50000) * 0.5 +
                                                Number(emp.baseWage || 50000) * 0.25 +
                                                2 * (Number(emp.baseWage || 50000) * 0.5 * 0.0833)),
                                    ).toFixed(2)}
                                </span>
                            </div>
                            <div className="comp-row deduction-row">
                                <span>Employee PF (12% of Basic)</span>
                                <span>
                                    - ₹{(Number(emp.baseWage || 50000) * 0.5 * 0.12).toFixed(2)}
                                </span>
                            </div>
                            <div className="comp-row deduction-row">
                                <span>Professional Tax (PT)</span>
                                <span>- ₹200.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 5: Documents */}
            {activeTab === 'docs' && (
                <div className="tab-pane-card">
                    <div className="pane-header">
                        <h2>Attached Documents & Certificates</h2>
                    </div>
                    <div className="documents-list">
                        <div className="document-item">
                            <FileText size={20} className="doc-icon" />
                            <div className="doc-meta">
                                <span className="doc-name">Appointment_Letter.pdf</span>
                                <span className="doc-size">Official Employment Offer • PDF</span>
                            </div>
                            <Button variant="ghost" size="sm">
                                Download
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

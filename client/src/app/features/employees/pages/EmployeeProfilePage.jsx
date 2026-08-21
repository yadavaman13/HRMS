import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useEmployee } from '../hooks/useEmployee';
import { useAuth } from '@/app/features/auth/hooks/useAuth';
import CircularAvatar from '@/components/Shared/DataDisplay/CircularAvatar/CircularAvatar';
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import Button from '@/components/Shared/Buttons/Button/Button';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import EmployeeStatusDot from '../components/EmployeeStatusDot/EmployeeStatusDot';
import ResumeTab from '../components/EmployeeProfileTabs/ResumeTab';
import PrivateInfoTab from '../components/EmployeeProfileTabs/PrivateInfoTab';
import SalaryTab from '../components/EmployeeProfileTabs/SalaryTab';
import DocumentsTab from '../components/EmployeeProfileTabs/DocumentsTab';
import { ArrowLeft, Mail, Phone, Building, Briefcase, Calendar } from 'lucide-react';
import './EmployeeProfilePage.scss';

export default function EmployeeProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { selectedEmployee, fetchEmployeeById, myProfile, fetchMyProfile, loading } =
        useEmployee();

    const [activeTab, setActiveTab] = useState('resume');

    const isAdminOrHr = user?.role === 'admin' || user?.role === 'hr';

    useEffect(() => {
        if (id) {
            fetchEmployeeById(id);
        } else {
            fetchMyProfile();
        }
    }, [id]);

    const profileData = id ? selectedEmployee : myProfile || user;
    const fullName =
        `${profileData?.firstName || ''} ${profileData?.lastName || ''}`.trim() ||
        'Employee Profile';
    const employeeCode = profileData?.employeeCode || profileData?.code || 'EMP-N/A';
    const designation = profileData?.designation || profileData?.role || 'Team Member';
    const department = profileData?.department || 'General';
    const email = profileData?.workEmail || profileData?.email || 'N/A';
    const phone = profileData?.phone || profileData?.privateInfo?.phone || 'N/A';
    const joiningDate = profileData?.joiningDate
        ? new Date(profileData.joiningDate).toLocaleDateString()
        : 'N/A';

    const tabs = [
        { key: 'resume', label: 'Resume & Skills' },
        { key: 'private-info', label: 'Private Info' },
        ...(isAdminOrHr ? [{ key: 'salary', label: 'Salary Structure (Admin)' }] : []),
        { key: 'documents', label: 'Documents' },
    ];

    if (loading && !profileData) {
        return (
            <div className="employee-profile-page__loading">
                <Spinner label="Loading employee profile..." />
            </div>
        );
    }

    return (
        <div className="employee-profile-page">
            <div className="employee-profile-page__top-nav">
                <Button
                    variant="ghost"
                    size="sm"
                    icon={ArrowLeft}
                    onClick={() => navigate('/dashboard/user/employees')}
                >
                    Back to Directory
                </Button>
            </div>

            <div className="employee-profile-hero">
                <div className="employee-profile-hero__main">
                    <div className="employee-profile-hero__avatar-wrap">
                        <CircularAvatar
                            src={profileData?.profileImage || profileData?.avatar}
                            name={fullName}
                            size="xl"
                        />
                        <div className="employee-profile-hero__status">
                            <EmployeeStatusDot status={profileData?.todayStatus || 'PRESENT'} />
                        </div>
                    </div>

                    <div className="employee-profile-hero__details">
                        <div className="employee-profile-hero__title-row">
                            <h1 className="employee-profile-hero__name">{fullName}</h1>
                            <span className="employee-profile-hero__code">{employeeCode}</span>
                            <Badge variant="primary" size="sm">
                                {profileData?.role?.toUpperCase() || 'EMPLOYEE'}
                            </Badge>
                        </div>

                        <div className="employee-profile-hero__meta-row">
                            <span className="meta-item">
                                <Briefcase size={14} /> {designation}
                            </span>
                            <span className="meta-item">
                                <Building size={14} /> {department}
                            </span>
                            <span className="meta-item">
                                <Calendar size={14} /> Joined {joiningDate}
                            </span>
                        </div>

                        <div className="employee-profile-hero__contact-row">
                            <span className="contact-item">
                                <Mail size={14} /> {email}
                            </span>
                            {phone !== 'N/A' && (
                                <span className="contact-item">
                                    <Phone size={14} /> {phone}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="employee-profile-tabs-header">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        className={`employee-profile-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="employee-profile-tabs-body">
                {activeTab === 'resume' && <ResumeTab profile={profileData} />}
                {activeTab === 'private-info' && (
                    <PrivateInfoTab
                        privateInfo={profileData?.privateInfo || profileData}
                        canViewSensitive={isAdminOrHr}
                    />
                )}
                {activeTab === 'salary' && (
                    <SalaryTab
                        salaryStructure={profileData?.salaryStructure || profileData?.salary}
                        isAdmin={isAdminOrHr}
                    />
                )}
                {activeTab === 'documents' && (
                    <DocumentsTab documents={profileData?.documents || []} />
                )}
            </div>
        </div>
    );
}

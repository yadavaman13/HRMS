import { useNavigate } from 'react-router';
import CircularAvatar from '@/components/Shared/DataDisplay/CircularAvatar/CircularAvatar';
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import EmployeeStatusDot from '../EmployeeStatusDot/EmployeeStatusDot';
import { Mail, Phone, Building, Briefcase } from 'lucide-react';
import './EmployeeCard.scss';

export default function EmployeeCard({ employee }) {
    const navigate = useNavigate();
    if (!employee) return null;

    const fullName =
        `${employee?.firstName || ''} ${employee?.lastName || ''}`.trim() || 'Unnamed Employee';
    const employeeCode = employee?.employeeCode || employee?.code || 'EMP-N/A';
    const department = employee?.department || 'General';
    const designation = employee?.designation || employee?.role || 'Team Member';
    const email = employee?.workEmail || employee?.email || 'N/A';
    const phone = employee?.phone || employee?.privateInfo?.phone || 'N/A';
    const status = employee?.todayStatus || employee?.attendanceStatus || 'PRESENT';

    const handleCardClick = () => {
        navigate(`/dashboard/user/employees/${employee?.id || employee?._id}`);
    };

    return (
        <div className="employee-card" onClick={handleCardClick} role="button" tabIndex={0}>
            <div className="employee-card__header">
                <div className="employee-card__avatar-wrap">
                    <CircularAvatar
                        src={employee?.profileImage || employee?.avatar}
                        name={fullName}
                        size="lg"
                    />
                    <div className="employee-card__status-indicator">
                        <EmployeeStatusDot status={status} />
                    </div>
                </div>

                <div className="employee-card__identity">
                    <h3 className="employee-card__name">{fullName}</h3>
                    <span className="employee-card__code">{employeeCode}</span>
                </div>
            </div>

            <div className="employee-card__body">
                <div className="employee-card__info-row">
                    <Briefcase size={14} className="employee-card__icon" />
                    <span className="employee-card__designation">{designation}</span>
                </div>
                <div className="employee-card__info-row">
                    <Building size={14} className="employee-card__icon" />
                    <Badge variant="neutral" size="sm">
                        {department}
                    </Badge>
                </div>
            </div>

            <div className="employee-card__footer">
                <div className="employee-card__contact-row" title={email}>
                    <Mail size={13} className="employee-card__icon" />
                    <span className="employee-card__contact-text">{email}</span>
                </div>
                {phone !== 'N/A' && (
                    <div className="employee-card__contact-row" title={phone}>
                        <Phone size={13} className="employee-card__icon" />
                        <span className="employee-card__contact-text">{phone}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

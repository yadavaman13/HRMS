import { User, MapPin, PhoneCall, Landmark } from 'lucide-react';
import './ProfileTabs.scss';

export default function PrivateInfoTab({ privateInfo, canViewSensitive = false }) {
    const dob =
        privateInfo?.dob || privateInfo?.dateOfBirth
            ? new Date(privateInfo?.dob || privateInfo?.dateOfBirth).toLocaleDateString()
            : 'Not provided';
    const gender = privateInfo?.gender || 'Not specified';
    const maritalStatus = privateInfo?.maritalStatus || 'Not specified';
    const address = privateInfo?.residentialAddress || privateInfo?.address || 'Not provided';
    const emergencyName =
        privateInfo?.emergencyContactName || privateInfo?.emergencyContact?.name || 'Not provided';
    const emergencyPhone =
        privateInfo?.emergencyContactPhone ||
        privateInfo?.emergencyContact?.phone ||
        'Not provided';
    const emergencyRelation =
        privateInfo?.emergencyContactRelation || privateInfo?.emergencyContact?.relation || '';

    return (
        <div className="profile-tab-content">
            <div className="profile-section-card">
                <div className="profile-section-card__header">
                    <User size={18} className="profile-section-card__icon" />
                    <h4 className="profile-section-card__title">Personal Details</h4>
                </div>
                <div className="profile-details-grid">
                    <div className="profile-detail-item">
                        <span className="profile-detail-item__label">Date of Birth</span>
                        <span className="profile-detail-item__value">{dob}</span>
                    </div>
                    <div className="profile-detail-item">
                        <span className="profile-detail-item__label">Gender</span>
                        <span className="profile-detail-item__value">{gender}</span>
                    </div>
                    <div className="profile-detail-item">
                        <span className="profile-detail-item__label">Marital Status</span>
                        <span className="profile-detail-item__value">{maritalStatus}</span>
                    </div>
                </div>
            </div>

            <div className="profile-section-card">
                <div className="profile-section-card__header">
                    <MapPin size={18} className="profile-section-card__icon" />
                    <h4 className="profile-section-card__title">Residential Address</h4>
                </div>
                <p className="profile-section-card__text">{address}</p>
            </div>

            <div className="profile-section-card">
                <div className="profile-section-card__header">
                    <PhoneCall size={18} className="profile-section-card__icon" />
                    <h4 className="profile-section-card__title">Emergency Contact</h4>
                </div>
                <div className="profile-details-grid">
                    <div className="profile-detail-item">
                        <span className="profile-detail-item__label">Contact Person</span>
                        <span className="profile-detail-item__value">
                            {emergencyName} {emergencyRelation ? `(${emergencyRelation})` : ''}
                        </span>
                    </div>
                    <div className="profile-detail-item">
                        <span className="profile-detail-item__label">Contact Number</span>
                        <span className="profile-detail-item__value">{emergencyPhone}</span>
                    </div>
                </div>
            </div>

            {canViewSensitive && (
                <div className="profile-section-card profile-section-card--highlight">
                    <div className="profile-section-card__header">
                        <Landmark size={18} className="profile-section-card__icon" />
                        <h4 className="profile-section-card__title">
                            Bank & Statutory (Restricted)
                        </h4>
                    </div>
                    <div className="profile-details-grid">
                        <div className="profile-detail-item">
                            <span className="profile-detail-item__label">Bank Name</span>
                            <span className="profile-detail-item__value">
                                {privateInfo?.bankName || 'HDFC Bank'}
                            </span>
                        </div>
                        <div className="profile-detail-item">
                            <span className="profile-detail-item__label">Account Number</span>
                            <span className="profile-detail-item__value font-mono">
                                {privateInfo?.bankAccountNumber || '•••• •••• 4912'}
                            </span>
                        </div>
                        <div className="profile-detail-item">
                            <span className="profile-detail-item__label">IFSC Code</span>
                            <span className="profile-detail-item__value font-mono">
                                {privateInfo?.ifscCode || 'HDFC0001234'}
                            </span>
                        </div>
                        <div className="profile-detail-item">
                            <span className="profile-detail-item__label">PAN Card</span>
                            <span className="profile-detail-item__value font-mono">
                                {privateInfo?.pan || 'ABCDE1234F'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import Button from '@/components/Shared/Buttons/Button/Button';
import InputField from '@/components/Shared/Form/InputField/InputField';
import ToastNotification from '@/components/Shared/Feedback/ToastNotification/ToastNotification';
import { ShieldCheck, Lock } from 'lucide-react';
import './ChangePasswordPage.scss';

export default function ChangePasswordPage() {
    const { user, handleChangePassword, loading, error: authError } = useAuth();
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setSuccessMessage('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setFormError('Please fill in all fields');
            return;
        }

        if (newPassword.length < 8) {
            setFormError('New password must be at least 8 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            setFormError('New passwords do not match');
            return;
        }

        try {
            await handleChangePassword({ currentPassword, newPassword });
            setSuccessMessage('Password changed successfully! Redirecting...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1200);
        } catch (err) {
            setFormError(err.response?.data?.message || err.message || 'Failed to update password');
        }
    };

    return (
        <div className="change-password-page">
            <div className="change-password-card">
                <div className="change-password-card__header">
                    <div className="change-password-card__icon-wrapper">
                        <ShieldCheck className="change-password-card__icon" size={32} />
                    </div>
                    <h2 className="change-password-card__title">
                        {user?.mustChangePassword
                            ? 'First-Time Password Change'
                            : 'Change Password'}
                    </h2>
                    <p className="change-password-card__subtitle">
                        {user?.mustChangePassword
                            ? 'Your administrator requires you to set a new password before proceeding.'
                            : 'Update your account credentials to keep your workspace secure.'}
                    </p>
                </div>

                {(formError || authError) && (
                    <ToastNotification
                        variant="error"
                        title="Action Required"
                        message={formError || authError}
                        onClose={() => setFormError('')}
                    />
                )}

                {successMessage && (
                    <ToastNotification variant="success" title="Success" message={successMessage} />
                )}

                <form onSubmit={handleSubmit} className="change-password-card__form">
                    <InputField
                        label="Current / Temporary Password"
                        type="password"
                        placeholder="Enter your current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        icon={Lock}
                    />

                    <InputField
                        label="New Password"
                        type="password"
                        placeholder="At least 8 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        icon={Lock}
                    />

                    <InputField
                        label="Confirm New Password"
                        type="password"
                        placeholder="Re-enter your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        icon={Lock}
                    />

                    <div className="change-password-card__actions">
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            disabled={loading}
                            fullWidth
                        >
                            Update Password & Continue
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

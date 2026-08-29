import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';
import HeroPanel from '@/components/Shared/HeroPanel/HeroPanel';
import Logo from '@/components/Shared/DataDisplay/Logo/Logo';
import FormHeader from '@/components/Shared/DataDisplay/FormHeader/FormHeader';
import InputField from '@/components/Shared/Form/InputField/InputField';
import Button from '@/components/Shared/Buttons/Button/Button';
import { useToast } from '@/components/Shared/Feedback/Toast';
import { KeyRound, ShieldCheck } from 'lucide-react';
import './ChangePasswordPage.scss';

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const { success, error: toastError } = useToast();
    const { user, loading } = useContext(AuthContext);
    const { handleChangePassword, handleLogout } = useAuth();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [currentPasswordError, setCurrentPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const validateForm = () => {
        let isValid = true;
        setCurrentPasswordError('');
        setNewPasswordError('');
        setConfirmPasswordError('');

        if (!currentPassword) {
            setCurrentPasswordError('Current password is required');
            isValid = false;
        }

        if (!newPassword) {
            setNewPasswordError('New password is required');
            isValid = false;
        } else if (newPassword.length < 6) {
            setNewPasswordError('New password must be at least 6 characters');
            isValid = false;
        } else if (newPassword === currentPassword) {
            setNewPasswordError('New password must be different from current password');
            isValid = false;
        }

        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your new password');
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await handleChangePassword({ currentPassword, newPassword });
            success('Password updated successfully! Welcome to Dayflow HRMS.');
            const role = (user?.role || '').toLowerCase();
            if (role === 'admin' || role === 'hr') {
                navigate('/dashboard/admin', { replace: true });
            } else {
                navigate('/dashboard/user', { replace: true });
            }
        } catch (err) {
            const message =
                err.response?.data?.message || err.message || 'Failed to update password';
            toastError(message);
            if (message.toLowerCase().includes('current')) {
                setCurrentPasswordError(message);
            } else {
                setNewPasswordError(message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await handleLogout();
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
            navigate('/login');
        }
    };

    return (
        <div className="main-layout change-password-layout">
            <HeroPanel />
            <div className="form-panel">
                <div className="form-wrapper">
                    <Logo />
                    <FormHeader
                        title="Set New Password"
                        subtitle={
                            user?.mustChangePassword || user?.must_change_password
                                ? 'Your account was provisioned with temporary credentials. Please choose a strong personal password to continue.'
                                : 'Update your account password'
                        }
                    />

                    <div className="security-notice-card">
                        <ShieldCheck size={20} className="notice-icon" />
                        <span className="notice-text">
                            Choose a password of at least 6 characters with a combination of letters
                            and numbers.
                        </span>
                    </div>

                    <form onSubmit={handleSubmit} noValidate autoComplete="off">
                        <InputField
                            label="Current / Temporary Password"
                            id="current-password"
                            type="password"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => {
                                setCurrentPassword(e.target.value);
                                if (currentPasswordError) setCurrentPasswordError('');
                            }}
                            error={currentPasswordError}
                            autoComplete="current-password"
                            disabled={isSubmitting}
                        />

                        <InputField
                            label="New Password"
                            id="new-password"
                            type="password"
                            placeholder="Enter new password (min. 6 characters)"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (newPasswordError) setNewPasswordError('');
                            }}
                            error={newPasswordError}
                            autoComplete="new-password"
                            disabled={isSubmitting}
                        />

                        <InputField
                            label="Confirm New Password"
                            id="confirm-password"
                            type="password"
                            placeholder="Re-enter new password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (confirmPasswordError) setConfirmPasswordError('');
                            }}
                            error={confirmPasswordError}
                            autoComplete="new-password"
                            disabled={isSubmitting}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            className="change-password-submit-btn"
                            disabled={isSubmitting}
                            loading={isSubmitting || loading}
                        >
                            <KeyRound size={16} />
                            Save New Password & Continue
                        </Button>

                        <div className="change-password-footer">
                            <button type="button" className="signout-link" onClick={handleSignOut}>
                                Sign out and return to login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

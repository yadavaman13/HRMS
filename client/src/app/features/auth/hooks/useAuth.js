import { useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as authService from '../services/api';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const { setUser, setLoading, setError } = context;

    const handleGetMe = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.getMe();
            const userData = data?.user || data?.data?.user || null;
            setUser(userData);
            return userData;
        } catch (err) {
            console.error('Error in handleGetMe:', err);
            setUser(null);
            setError(err.response?.data?.message || err.message || 'Session expired');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setError, setLoading, setUser]);

    const handleLogin = useCallback(
        async (email, password, rememberMe) => {
            setLoading(true);
            setError(null);
            try {
                const data = await authService.login({ email, password, rememberMe });
                const userData = data?.user || data?.data?.user || null;
                setUser(userData);
                return data;
            } catch (err) {
                console.error('Error in handleLogin:', err);
                const formattedError = err.response?.data || {
                    message: err.message || 'Login failed',
                };
                setError(formattedError);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setUser],
    );

    const handleLogout = useCallback(async () => {
        setLoading(true);
        try {
            await authService.logout();
        } catch (err) {
            console.error('Error in handleLogout:', err);
        } finally {
            setUser(null);
            setLoading(false);
        }
    }, [setLoading, setUser]);

    const handleRequestRecovery = useCallback(
        async (email) => {
            setError(null);
            try {
                return await authService.requestAccountRecovery({ email });
            } catch (err) {
                console.error('Error in handleRequestRecovery:', err);
                setError(err.response?.data?.message || err.message || 'Recovery request failed');
                throw err;
            }
        },
        [setError],
    );

    const handleVerifyRecovery = useCallback(
        async (email, otp) => {
            setError(null);
            try {
                return await authService.verifyAccountRecovery({ email, otp });
            } catch (err) {
                console.error('Error in handleVerifyRecovery:', err);
                setError(
                    err.response?.data?.message || err.message || 'Recovery verification failed',
                );
                throw err;
            }
        },
        [setError],
    );

    const handleSendVerificationOtp = useCallback(
        async (email) => {
            setError(null);
            try {
                return await authService.sendVerificationOtp({ email });
            } catch (err) {
                console.error('Error in handleSendVerificationOtp:', err);
                setError(
                    err.response?.data?.message || err.message || 'Failed to send verification OTP',
                );
                throw err;
            }
        },
        [setError],
    );

    const handleVerifyEmail = useCallback(
        async (email, otp) => {
            setError(null);
            try {
                return await authService.verifyEmail({ email, otp });
            } catch (err) {
                console.error('Error in handleVerifyEmail:', err);
                setError(err.response?.data?.message || err.message || 'OTP verification failed');
                throw err;
            }
        },
        [setError],
    );

    const handleRegister = useCallback(
        async ({ firstName, lastName, email, password, role, profileImage }) => {
            setLoading(true);
            setError(null);
            try {
                const data = await authService.register({
                    firstName,
                    lastName,
                    email,
                    password,
                    role,
                    profileImage,
                });
                const userData = data.user || data.data?.user || null;
                setUser(userData);
                return data;
            } catch (err) {
                console.error('Error in handleRegister:', err);
                setError(err.response?.data?.message || err.message || 'Registration failed');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setUser],
    );

    const handleUpdateProfile = useCallback(
        async ({ firstName, lastName, profileImage }) => {
            setLoading(true);
            setError(null);
            try {
                const data = await authService.updateProfile({ firstName, lastName, profileImage });
                const userData = data.user || data.data?.user || null;
                if (userData) {
                    setUser((prev) => ({
                        ...prev,
                        ...userData,
                    }));
                }
                return data;
            } catch (err) {
                console.error('Error in handleUpdateProfile:', err);
                setError(err.response?.data?.message || err.message || 'Profile update failed');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setUser],
    );

    const handleUploadAvatar = useCallback(
        async (file) => {
            setLoading(true);
            setError(null);
            try {
                const data = await authService.uploadAvatar(file);
                const userData = data.user || data.data?.user || null;
                if (userData) {
                    setUser((prev) => ({
                        ...prev,
                        ...userData,
                        profileImage: userData.profileImage || data.imageUrl || prev?.profileImage,
                    }));
                }
                return data;
            } catch (err) {
                console.error('Error in handleUploadAvatar:', err);
                setError(err.response?.data?.message || err.message || 'Avatar upload failed');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setUser],
    );

    const handleRequestPasswordReset = useCallback(
        async (email) => {
            setError(null);
            try {
                return await authService.requestPasswordReset({ email });
            } catch (err) {
                console.error('Error in handleRequestPasswordReset:', err);
                setError(
                    err.response?.data?.message ||
                        err.message ||
                        'Failed to send password reset OTP',
                );
                throw err;
            }
        },
        [setError],
    );

    const handleVerifyForgotPasswordOtp = useCallback(
        async ({ email, otp }) => {
            setError(null);
            try {
                return await authService.verifyForgotPasswordOtp({ email, otp });
            } catch (err) {
                console.error('Error in handleVerifyForgotPasswordOtp:', err);
                setError(err.response?.data?.message || err.message || 'OTP verification failed');
                throw err;
            }
        },
        [setError],
    );

    const handleResetPassword = useCallback(
        async ({ email, otp, password, confirmPassword }) => {
            setError(null);
            try {
                return await authService.resetPassword({ email, otp, password, confirmPassword });
            } catch (err) {
                console.error('Error in handleResetPassword:', err);
                setError(err.response?.data?.message || err.message || 'Password reset failed');
                throw err;
            }
        },
        [setError],
    );

    const handleChangePassword = useCallback(
        async ({ currentPassword, newPassword }) => {
            setLoading(true);
            setError(null);
            try {
                const data = await authService.changePassword({ currentPassword, newPassword });
                // If user was required to change password, clear that flag in state
                setUser((prev) =>
                    prev
                        ? { ...prev, mustChangePassword: false, must_change_password: false }
                        : prev,
                );
                return data;
            } catch (err) {
                console.error('Error in handleChangePassword:', err);
                const errorPayload = err.response?.data || {
                    message: err.message || 'Change password failed',
                };
                setError(errorPayload);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setUser],
    );

    const handleDeleteAccount = useCallback(
        async ({ password }) => {
            setLoading(true);
            setError(null);
            try {
                const data = await authService.deleteAccount({ password });
                setUser(null);
                return data;
            } catch (err) {
                console.error('Error in handleDeleteAccount:', err);
                setError(err.response?.data?.message || err.message || 'Delete account failed');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setError, setLoading, setUser],
    );

    // Export ACTION HANDLERS ONLY
    return {
        handleGetMe,
        handleLogin,
        handleLogout,
        handleRequestRecovery,
        handleVerifyRecovery,
        handleSendVerificationOtp,
        handleVerifyEmail,
        handleRegister,
        handleUpdateProfile,
        handleUploadAvatar,
        handleRequestPasswordReset,
        handleVerifyForgotPasswordOtp,
        handleResetPassword,
        handleChangePassword,
        handleDeleteAccount,
    };
};

import { useState, useEffect, useRef, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import * as authService from '../services/api';

export { AuthContext };

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasInitializedRef = useRef(false);

    // Load initial user on mount
    useEffect(() => {
        if (hasInitializedRef.current) return;
        hasInitializedRef.current = true;

        const initializeAuth = async () => {
            try {
                const data = await authService.getMe();
                const userData = data.user || data.data?.user || null;
                setUser(userData);
            } catch (err) {
                console.error('Error in initialization:', err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initializeAuth();
    }, []);

    const value = useMemo(
        () => ({
            // Read-only state (consumed by UI via useContext)
            user,
            isAuthenticated: Boolean(user),
            mustChangePassword: Boolean(user?.mustChangePassword || user?.must_change_password),
            loading,
            error,

            // Setters (consumed strictly by Hooks layer)
            setUser,
            setLoading,
            setError,
        }),
        [user, loading, error],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

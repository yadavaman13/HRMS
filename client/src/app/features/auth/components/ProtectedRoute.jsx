import { useContext } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import ForbiddenPage from '@/components/Shared/ErrorPages/ForbiddenPage/ForbiddenPage';

/**
 * ProtectedRoute Component with Multi-Role Access Control and Password Change Gate
 *
 * @param {React.ReactNode} children - Component to render when authorized
 * @param {string[]} [allowedRoles] - Optional list of authorized roles (case-insensitive)
 * @param {string} [fallbackPath] - Optional redirect route if unauthorized
 */
const ProtectedRoute = ({ children, allowedRoles, fallbackPath }) => {
    const { user, loading, error, mustChangePassword } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Loading state while checking active session
    if (loading && !error && !user) {
        return <Spinner label="Checking authentication..." fullScreen />;
    }

    // 2. Unauthenticated user -> redirect to login
    if (!user && !loading) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Forced Password Change Check (Dayflow HRMS Rule)
    if (user && mustChangePassword && location.pathname !== '/change-password') {
        return <Navigate to="/change-password" replace />;
    }

    // 4. Multi-Role RBAC check (case-insensitive)
    if (allowedRoles && user) {
        const userRole = (user.role || '').toLowerCase();
        // Normalize 'user' role to 'employee' if needed
        const normalizedRole = userRole === 'user' ? 'employee' : userRole;

        const hasRoleAccess = allowedRoles.some((role) => {
            const r = role.toLowerCase();
            return (
                r === userRole || r === normalizedRole || (r === 'user' && userRole === 'employee')
            );
        });

        if (!hasRoleAccess) {
            if (fallbackPath) {
                return <Navigate to={fallbackPath} replace />;
            }
            return (
                <ForbiddenPage
                    title="Access Forbidden"
                    message={`Your current role (${user.role || 'User'}) does not have permission to view this section.`}
                    onActionClick={() => navigate('/dashboard')}
                />
            );
        }
    }

    return children;
};

export default ProtectedRoute;

import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading, error } = useAuth();

    if (loading && !error && !user) {
        return <Spinner label="Checking authentication..." fullScreen />;
    }

    if (!user && !loading) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;

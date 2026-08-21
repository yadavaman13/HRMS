import { useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '@/app/features/auth/context/AuthContext';

export default function DashboardIndex() {
    const { user } = useContext(AuthContext);
    const role = (user?.role || '').toLowerCase();
    const target = role === 'admin' || role === 'hr' ? 'admin/home' : 'user/home';
    return <Navigate to={target} replace />;
}

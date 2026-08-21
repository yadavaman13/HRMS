import { NavLink, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/app/features/auth/hooks/useAuth';
import { Sliders, User, Building } from 'lucide-react';
import './SettingsLayout.scss';

export default function SettingsLayout() {
    const { user } = useAuth();
    const location = useLocation();

    const isAdminOrHr = user?.role === 'admin' || user?.role === 'hr';
    const basePath = location.pathname.includes('/admin/')
        ? '/dashboard/admin/settings'
        : '/dashboard/user/settings';

    return (
        <div className="settings-module-page">
            <div className="settings-module-page__header">
                <h1 className="settings-module-page__title">Settings & Preferences</h1>
                <p className="settings-module-page__subtitle">
                    Manage your personal account preferences, workspace themes, and organization
                    policies.
                </p>
            </div>

            <div className="settings-nav-tabs">
                <NavLink
                    to={`${basePath}/general`}
                    className={({ isActive }) => `settings-nav-tab ${isActive ? 'active' : ''}`}
                >
                    <Sliders size={16} />
                    <span>General Settings</span>
                </NavLink>

                <NavLink
                    to={`${basePath}/account`}
                    className={({ isActive }) => `settings-nav-tab ${isActive ? 'active' : ''}`}
                >
                    <User size={16} />
                    <span>Account & Security</span>
                </NavLink>

                {isAdminOrHr && (
                    <NavLink
                        to="/dashboard/admin/settings/organization"
                        className={({ isActive }) => `settings-nav-tab ${isActive ? 'active' : ''}`}
                    >
                        <Building size={16} />
                        <span>Organization Settings (Admin)</span>
                    </NavLink>
                )}
            </div>

            <div className="settings-tab-outlet">
                <Outlet />
            </div>
        </div>
    );
}

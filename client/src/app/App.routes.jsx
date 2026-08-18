import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import App from './App';
import LoginLayout from '@/app/features/auth/login/LoginLayout/LoginLayout';
import RegisterLayout from '@/app/features/auth/register/RegisterLayout/RegisterLayout';
import DashboardLayout from '@/app/features/dashboard/DashboardLayout/DashboardLayout';
import ComponentsShowcase from '@/app/features/showcase/ComponentsShowcase/ComponentsShowcase';
import InsightsPage from '@/app/features/analytics/Insights/InsightsPage';
import GeneralSettings from '@/app/features/settings/GeneralSettings';
import AccountSettings from '@/app/features/settings/AccountSettings';
import ProtectedRoute from '@/app/features/auth/components/ProtectedRoute';
import AiChat from '@/app/features/ai/AiChat';
import DashboardIndex from '@/app/features/dashboard/DashboardIndex';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Navigate to="/login" replace />,
            },
            {
                path: 'login',
                element: <LoginLayout />,
            },
            {
                path: 'reset-password',
                element: <LoginLayout />,
            },
            {
                path: 'recover-account',
                element: <LoginLayout />,
            },
            {
                path: 'register',
                element: <RegisterLayout />,
            },
            {
                path: 'dashboard',
                element: (
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <DashboardIndex />,
                    },
                    {
                        path: 'user',
                        children: [
                            {
                                index: true,
                                element: <Navigate to="analytics" replace />,
                            },
                            {
                                path: 'home',
                                element: (
                                    <div className="main-dashboard-placeholder">
                                        This is main dashboard
                                    </div>
                                ),
                            },
                            {
                                path: 'ai',
                                element: <AiChat />,
                            },
                            {
                                path: 'analytics',
                                children: [
                                    {
                                        index: true,
                                        element: <Navigate to="insight" replace />,
                                    },
                                    {
                                        path: 'insight',
                                        element: <InsightsPage />,
                                    },
                                    {
                                        path: 'reports',
                                        element: (
                                            <div className="reports-section-placeholder">
                                                This is Reports Section
                                            </div>
                                        ),
                                    },
                                ],
                            },
                            {
                                path: 'settings',
                                children: [
                                    {
                                        index: true,
                                        element: <Navigate to="general" replace />,
                                    },
                                    {
                                        path: 'general',
                                        element: <GeneralSettings />,
                                    },
                                    {
                                        path: 'account',
                                        element: <AccountSettings />,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: 'admin',
                        element: (
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Outlet />
                            </ProtectedRoute>
                        ),
                        children: [
                            {
                                index: true,
                                element: <Navigate to="analytics" replace />,
                            },
                            {
                                path: 'home',
                                element: (
                                    <div className="main-dashboard-placeholder">
                                        This is Admin dashboard
                                    </div>
                                ),
                            },
                            {
                                path: 'ai',
                                element: <AiChat />,
                            },
                            {
                                path: 'analytics',
                                children: [
                                    {
                                        index: true,
                                        element: <Navigate to="insight" replace />,
                                    },
                                    {
                                        path: 'insight',
                                        element: <InsightsPage />,
                                    },
                                    {
                                        path: 'reports',
                                        element: (
                                            <div className="reports-section-placeholder">
                                                This is Reports Section
                                            </div>
                                        ),
                                    },
                                ],
                            },
                            {
                                path: 'settings',
                                children: [
                                    {
                                        index: true,
                                        element: <Navigate to="general" replace />,
                                    },
                                    {
                                        path: 'general',
                                        element: <GeneralSettings />,
                                    },
                                    {
                                        path: 'account',
                                        element: <AccountSettings />,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                path: 'components',
                element: <ComponentsShowcase />,
            },
            {
                path: '*',
                element: <Navigate to="/login" replace />,
            },
        ],
    },
]);

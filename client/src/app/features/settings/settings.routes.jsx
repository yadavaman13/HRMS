import { Navigate } from 'react-router';
import SettingsLayout from './SettingsLayout';
import GeneralSettings from './GeneralSettings';
import AccountSettings from './AccountSettings';
import OrganizationSettings from './OrganizationSettings';

export default {
    userRoutes: [
        {
            path: 'settings',
            element: <SettingsLayout />,
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
    adminRoutes: [
        {
            path: 'settings',
            element: <SettingsLayout />,
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
                {
                    path: 'organization',
                    element: <OrganizationSettings />,
                },
            ],
        },
    ],
};

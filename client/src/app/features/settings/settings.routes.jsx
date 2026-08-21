import { SettingsProvider } from './context/settings.context';
import CompanySettingsPage from './pages/CompanySettingsPage';
import WorkSchedulePage from './pages/WorkSchedulePage';
import LeavePolicyPage from './pages/LeavePolicyPage';
import GeneralSettings from './GeneralSettings';

export default {
    adminRoutes: [
        {
            path: 'settings',
            element: (
                <SettingsProvider>
                    <CompanySettingsPage />
                </SettingsProvider>
            ),
        },
        {
            path: 'settings/general',
            element: (
                <SettingsProvider>
                    <CompanySettingsPage />
                </SettingsProvider>
            ),
        },
        {
            path: 'settings/schedules',
            element: (
                <SettingsProvider>
                    <WorkSchedulePage />
                </SettingsProvider>
            ),
        },
        {
            path: 'settings/policies',
            element: (
                <SettingsProvider>
                    <LeavePolicyPage />
                </SettingsProvider>
            ),
        },
    ],
    userRoutes: [
        {
            path: 'settings',
            element: (
                <SettingsProvider>
                    <GeneralSettings />
                </SettingsProvider>
            ),
        },
        {
            path: 'settings/general',
            element: (
                <SettingsProvider>
                    <GeneralSettings />
                </SettingsProvider>
            ),
        },
    ],
};

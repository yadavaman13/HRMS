import { AuditProvider } from './context/audit.context';
import AuditLogsPage from './pages/AuditLogsPage';

export default {
    adminRoutes: [
        {
            path: 'audit',
            element: (
                <AuditProvider>
                    <AuditLogsPage />
                </AuditProvider>
            ),
        },
    ],
};

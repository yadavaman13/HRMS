import { LeaveProvider } from './context/leave.context';
import LeaveDashboardPage from './pages/LeaveDashboardPage';
import LeaveApprovalInboxPage from './pages/LeaveApprovalInboxPage';

export default {
    adminRoutes: [
        {
            path: 'leave-approvals',
            element: (
                <LeaveProvider>
                    <LeaveApprovalInboxPage />
                </LeaveProvider>
            ),
        },
    ],
    userRoutes: [
        {
            path: 'leave',
            element: (
                <LeaveProvider>
                    <LeaveDashboardPage />
                </LeaveProvider>
            ),
        },
    ],
};

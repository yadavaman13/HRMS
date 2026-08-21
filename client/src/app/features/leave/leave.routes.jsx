import LeaveProvider from './context/leave.context';
import LeaveDashboardPage from './pages/LeaveDashboardPage';
import LeaveApprovalInboxPage from './pages/LeaveApprovalInboxPage';

export default {
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
    adminRoutes: [
        {
            path: 'leave',
            element: (
                <LeaveProvider>
                    <LeaveApprovalInboxPage />
                </LeaveProvider>
            ),
        },
    ],
};

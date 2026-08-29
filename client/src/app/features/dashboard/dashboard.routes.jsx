import { DashboardProvider } from './context/dashboard.context';
import { AttendanceProvider } from '@/app/features/attendance/context/attendance.context';
import AdminDashboardHome from './pages/AdminDashboardHome';
import EmployeeDashboardHome from './pages/EmployeeDashboardHome';

export default {
    userRoutes: [
        {
            path: 'home',
            element: (
                <DashboardProvider>
                    <AttendanceProvider>
                        <EmployeeDashboardHome />
                    </AttendanceProvider>
                </DashboardProvider>
            ),
        },
    ],
    adminRoutes: [
        {
            path: 'home',
            element: (
                <DashboardProvider>
                    <AdminDashboardHome />
                </DashboardProvider>
            ),
        },
    ],
};

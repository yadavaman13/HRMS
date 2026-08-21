import { AttendanceProvider } from './context/attendance.context';
import AdminAttendanceOverviewPage from './pages/AdminAttendanceOverviewPage';
import EmployeeAttendancePage from './pages/EmployeeAttendancePage';

export default {
    adminRoutes: [
        {
            path: 'attendance',
            element: (
                <AttendanceProvider>
                    <AdminAttendanceOverviewPage />
                </AttendanceProvider>
            ),
        },
    ],
    userRoutes: [
        {
            path: 'attendance',
            element: (
                <AttendanceProvider>
                    <EmployeeAttendancePage />
                </AttendanceProvider>
            ),
        },
    ],
};

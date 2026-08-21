import AttendanceProvider from './context/attendance.context';
import EmployeeAttendancePage from './pages/EmployeeAttendancePage';
import AdminAttendanceOverviewPage from './pages/AdminAttendanceOverviewPage';

export default {
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
};

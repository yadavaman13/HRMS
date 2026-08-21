import EmployeeDashboardHome from './components/EmployeeDashboardHome/EmployeeDashboardHome';
import AdminDashboardHome from './components/AdminDashboardHome/AdminDashboardHome';

export default {
    userRoutes: [
        {
            path: 'home',
            element: <EmployeeDashboardHome />,
        },
    ],
    adminRoutes: [
        {
            path: 'home',
            element: <AdminDashboardHome />,
        },
    ],
};

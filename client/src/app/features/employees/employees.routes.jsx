import EmployeeProvider from './context/employee.context';
import EmployeeDirectoryPage from './pages/EmployeeDirectoryPage';
import EmployeeProfilePage from './pages/EmployeeProfilePage';

export default {
    userRoutes: [
        {
            path: 'employees',
            element: (
                <EmployeeProvider>
                    <EmployeeDirectoryPage />
                </EmployeeProvider>
            ),
        },
        {
            path: 'employees/:id',
            element: (
                <EmployeeProvider>
                    <EmployeeProfilePage />
                </EmployeeProvider>
            ),
        },
        {
            path: 'profile',
            element: (
                <EmployeeProvider>
                    <EmployeeProfilePage />
                </EmployeeProvider>
            ),
        },
    ],
    adminRoutes: [
        {
            path: 'employees',
            element: (
                <EmployeeProvider>
                    <EmployeeDirectoryPage />
                </EmployeeProvider>
            ),
        },
        {
            path: 'employees/:id',
            element: (
                <EmployeeProvider>
                    <EmployeeProfilePage />
                </EmployeeProvider>
            ),
        },
    ],
};

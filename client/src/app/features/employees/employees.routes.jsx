import { EmployeesProvider } from './context/employees.context';
import EmployeeDirectoryPage from './pages/EmployeeDirectoryPage';
import EmployeeProfilePage from './pages/EmployeeProfilePage';

export default {
    adminRoutes: [
        {
            path: 'employees',
            element: (
                <EmployeesProvider>
                    <EmployeeDirectoryPage />
                </EmployeesProvider>
            ),
        },
        {
            path: 'employees/:id',
            element: (
                <EmployeesProvider>
                    <EmployeeProfilePage />
                </EmployeesProvider>
            ),
        },
    ],
    userRoutes: [
        {
            path: 'profile',
            element: (
                <EmployeesProvider>
                    <EmployeeProfilePage isSelf={true} />
                </EmployeesProvider>
            ),
        },
    ],
};

import PayrollProvider from './context/payroll.context';
import EmployeeProvider from '@/app/features/employees/context/employee.context';
import EmployeePayslipsPage from './pages/EmployeePayslipsPage';
import PayrollProcessingPage from './pages/PayrollProcessingPage';
import SalaryStructureEditorPage from './pages/SalaryStructureEditorPage';

export default {
    userRoutes: [
        {
            path: 'payroll',
            element: (
                <PayrollProvider>
                    <EmployeePayslipsPage />
                </PayrollProvider>
            ),
        },
        {
            path: 'payslips',
            element: (
                <PayrollProvider>
                    <EmployeePayslipsPage />
                </PayrollProvider>
            ),
        },
    ],
    adminRoutes: [
        {
            path: 'payroll',
            element: (
                <PayrollProvider>
                    <PayrollProcessingPage />
                </PayrollProvider>
            ),
        },
        {
            path: 'salary-structure',
            element: (
                <EmployeeProvider>
                    <PayrollProvider>
                        <SalaryStructureEditorPage />
                    </PayrollProvider>
                </EmployeeProvider>
            ),
        },
    ],
};

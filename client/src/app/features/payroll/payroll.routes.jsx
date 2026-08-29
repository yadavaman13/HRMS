import { PayrollProvider } from './context/payroll.context';
import PayrollProcessingPage from './pages/PayrollProcessingPage';
import SalaryStructureEditorPage from './pages/SalaryStructureEditorPage';
import EmployeePayslipsPage from './pages/EmployeePayslipsPage';

export default {
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
            path: 'payroll/salary-structure',
            element: (
                <PayrollProvider>
                    <SalaryStructureEditorPage />
                </PayrollProvider>
            ),
        },
    ],
    userRoutes: [
        {
            path: 'payslips',
            element: (
                <PayrollProvider>
                    <EmployeePayslipsPage />
                </PayrollProvider>
            ),
        },
    ],
};

import LoginLayout from './login/LoginLayout/LoginLayout';
import RegisterLayout from './register/RegisterLayout/RegisterLayout';
import ChangePasswordPage from './login/ChangePasswordPage';

export default {
    publicRoutes: [
        {
            path: 'login',
            element: <LoginLayout />,
        },
        {
            path: 'change-password',
            element: <ChangePasswordPage />,
        },
        {
            path: 'reset-password',
            element: <LoginLayout />,
        },
        {
            path: 'recover-account',
            element: <LoginLayout />,
        },
        {
            path: 'register',
            element: <RegisterLayout />,
        },
    ],
};

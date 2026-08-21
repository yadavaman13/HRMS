import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ChangePasswordPage from '@/app/features/auth/pages/ChangePasswordPage';
import AuthProvider from '@/app/features/auth/context/auth.context';

describe('ChangePasswordPage Component', () => {
    it('renders change password form elements', () => {
        render(
            <MemoryRouter>
                <AuthProvider>
                    <ChangePasswordPage />
                </AuthProvider>
            </MemoryRouter>,
        );

        expect(screen.getByText('Change Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your current password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('At least 8 characters')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Re-enter your new password')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Update Password & Continue/i }),
        ).toBeInTheDocument();
    });

    it('validates password mismatch on submit', () => {
        const { container } = render(
            <MemoryRouter>
                <AuthProvider>
                    <ChangePasswordPage />
                </AuthProvider>
            </MemoryRouter>,
        );

        fireEvent.change(screen.getByPlaceholderText('Enter your current password'), {
            target: { value: 'OldPass123!' },
        });
        fireEvent.change(screen.getByPlaceholderText('At least 8 characters'), {
            target: { value: 'NewPass123!' },
        });
        fireEvent.change(screen.getByPlaceholderText('Re-enter your new password'), {
            target: { value: 'DifferentPass123!' },
        });

        fireEvent.submit(container.querySelector('form'));

        expect(screen.getByText(/New passwords do not match/i)).toBeInTheDocument();
    });
});

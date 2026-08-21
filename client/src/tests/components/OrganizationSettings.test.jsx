import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrganizationSettings from '@/app/features/settings/OrganizationSettings';

describe('OrganizationSettings Component', () => {
    it('renders company identity and shift parameter inputs', () => {
        render(<OrganizationSettings />);

        expect(screen.getByText('Organization Master Settings')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Dayflow Technologies Pvt Ltd')).toBeInTheDocument();
        expect(screen.getByDisplayValue('OI')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Save Organization Settings/i }),
        ).toBeInTheDocument();
    });
});

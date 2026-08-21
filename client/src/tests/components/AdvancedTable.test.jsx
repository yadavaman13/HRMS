import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';

describe('AdvancedTable Component', () => {
    const mockColumns = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'role', label: 'Role', sortable: true },
        { key: 'department', label: 'Department' },
    ];

    const mockData = [
        { id: '1', name: 'Alice Smith', role: 'Engineer', department: 'Engineering' },
        { id: '2', name: 'Bob Jones', role: 'Designer', department: 'Product' },
        { id: '3', name: 'Charlie Brown', role: 'HR Lead', department: 'People' },
    ];

    it('renders in minimal default mode without controls bar or checkboxes', () => {
        const { container } = render(<AdvancedTable columns={mockColumns} data={mockData} />);

        // Headers and data rows render
        expect(screen.getByText('Alice Smith')).toBeInTheDocument();
        expect(screen.getByText('Bob Jones')).toBeInTheDocument();
        expect(screen.getByText('Charlie Brown')).toBeInTheDocument();

        // Checkboxes should not exist by default
        expect(container.querySelector('.checkbox-cell')).not.toBeInTheDocument();
        // Serial number column should not exist by default
        expect(screen.queryByText('#')).not.toBeInTheDocument();
        // Search bar should not exist by default
        expect(container.querySelector('.advanced-table-search-box')).not.toBeInTheDocument();
        // Filter button should not exist by default
        expect(screen.queryByText('Filter')).not.toBeInTheDocument();
    });

    it('renders serial number (#) column with correct indexing when showSerialNumber=true', () => {
        render(
            <AdvancedTable
                columns={mockColumns}
                data={mockData}
                showSerialNumber={true}
                initialRowsPerPage={5}
            />,
        );

        // Header "#" should exist
        expect(screen.getByText('#')).toBeInTheDocument();

        // Rows should have 1, 2, 3 serial numbers
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders sort by dropdown and filter when enabled', () => {
        render(
            <AdvancedTable
                columns={mockColumns}
                data={mockData}
                showSortDropdown={true}
                showFilter={true}
                filterConfig={[{ key: 'department', label: 'Department', type: 'select' }]}
            />,
        );

        expect(screen.getByText('Sort by')).toBeInTheDocument();
        expect(screen.getByText('Filter')).toBeInTheDocument();
    });
});

# AdvancedTable

A high-performance enterprise data table component supporting multi-column sorting, column collapse/reorder (drag-and-drop), animated search placeholder cycles, multi-select bulk actions, numeric/date range filtering, inline cell editing, context menus, custom scrollbars, and Table/Grid view modes.

---

## 1. Import Path

```javascript
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';
```

---

## 2. Props Specification

| Prop Name              | Type                                                   | Default               | Required | Description                                                  |
| ---------------------- | ------------------------------------------------------ | --------------------- | -------- | ------------------------------------------------------------ |
| `data`                 | `Array<object>`                                        | `[]`                  | Yes      | Array of record objects.                                     |
| `columns`              | `Array<ColumnConfig>`                                  | `[]`                  | No       | Column definitions (auto-inferred from data if omitted).     |
| `tabs`                 | `Array<{ id: string, label: string, count?: number }>` | `[]`                  | No       | Filter tabs rendered at the top of the table.                |
| `tabFilterKey`         | `string`                                               | `'status'`            | No       | Field key mapped to tab filtering.                           |
| `searchable`           | `boolean`                                              | `true`                | No       | Enables the animated search input bar.                       |
| `searchPlaceholder`    | `string`                                               | `'Search records...'` | No       | Default search placeholder text.                             |
| `initialRowsPerPage`   | `number`                                               | `5`                   | No       | Initial pagination page size.                                |
| `selectable`           | `boolean`                                              | `true`                | No       | Shows row selection checkboxes and bulk action bar.          |
| `selectedRows`         | `Array<string \| number>`                              | `[]`                  | No       | Controlled selected row IDs.                                 |
| `onSelectedRowsChange` | `function`                                             | —                     | No       | Selection callback: `(selectedIds) => void`.                 |
| `onDataChange`         | `function`                                             | —                     | No       | Fired when rows are edited inline or deleted.                |
| `onBulkAction`         | `function`                                             | —                     | No       | Bulk action callback: `(action, selectedIds, data) => void`. |
| `loading`              | `boolean`                                              | `false`               | No       | Displays skeleton loading rows.                              |
| `serverSide`           | `boolean`                                              | `false`               | No       | Enables server-side search, sort, and pagination delegation. |
| `totalCount`           | `number`                                               | —                     | No       | Total record count for server-side pagination.               |
| `onTableChange`        | `function`                                             | —                     | No       | Callback on page/sort/search change: `(state) => void`.      |
| `showRefresh`          | `boolean`                                              | `true`                | No       | Shows table refresh trigger button.                          |
| `showExport`           | `boolean`                                              | `true`                | No       | Shows CSV/Excel/PDF export dropdown menu.                    |
| `viewMode`             | `'table' \| 'grid'`                                    | `'table'`             | No       | Renders as tabular data or responsive card grid.             |
| `gridColumns`          | `number`                                               | `4`                   | No       | Column count when rendered in grid view.                     |

---

## 3. Column Configuration Schema (`ColumnConfig`)

```typescript
interface ColumnConfig {
  key: string; // Field property key in row object
  label: string; // Column header title
  sortable?: boolean; // Enables ascending/descending column sorting
  width?: string; // Fixed width (e.g. '200px')
  type?: 'text' | 'numeric' | 'date' | 'badge';
  render?: (value: any, row: object) => ReactNode; // Custom cell renderer
}
```

---

## 4. Usage Example

```jsx
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';

const columns = [
  { key: 'invoiceId', label: 'Invoice #', sortable: true },
  { key: 'clientName', label: 'Client', sortable: true },
  {
    key: 'amount',
    label: 'Amount',
    sortable: true,
    render: (val) => `₹${val.toLocaleString()}`,
  },
  {
    key: 'status',
    label: 'Status',
    render: (val) => <Badge variant={val === 'Paid' ? 'success' : 'warning'}>{val}</Badge>,
  },
];

export default function InvoicesTable({ invoices, isLoading, onRefresh }) {
  return (
    <AdvancedTable
      data={invoices}
      columns={columns}
      searchPlaceholder="Search invoices..."
      initialRowsPerPage={10}
      loading={isLoading}
      onRefresh={onRefresh}
      showExport
    />
  );
}
```

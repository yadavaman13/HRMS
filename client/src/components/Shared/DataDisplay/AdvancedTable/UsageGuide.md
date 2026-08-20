# AdvancedTable — Usage Guide

A powerful, fully modular data table component with built-in search, tabs, sorting, pagination, and an advanced filter panel (date range, numeric range, and multi-select column filters). Drop it in anywhere with zero configuration, or fully customise every aspect.

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [Component Architecture & Structure](#2-component-architecture--structure)
3. [Props Reference](#3-props-reference)
4. [Column Definition](#4-column-definition)
5. [Tab Definition](#5-tab-definition)
6. [Filter Configuration](#6-filter-configuration)
7. [Auto-Inference Behaviour](#7-auto-inference-behaviour)
8. [Row Selection](#8-row-selection)
9. [Server-Side Mode](#9-server-side-mode)
10. [Loading State](#10-loading-state)
11. [Header Actions](#11-header-actions)
12. [Advanced Filter Panel](#12-advanced-filter-panel)
13. [Full Real-World Example](#13-full-real-world-example)
14. [Notes and Gotchas](#14-notes-and-gotchas)

---

## 1. Quick Start

```jsx
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';

// Minimal — columns and filters are auto-inferred from data shape
<AdvancedTable data={myData} />;
```

That single line gives you:

- ✅ Auto-inferred column headers from object keys
- ✅ Full-text search across all columns
- ✅ Column sorting by clicking headers
- ✅ Pagination with configurable rows-per-page
- ✅ Auto-detected filter panel (select / date / numeric)
- ✅ Animated skeleton loading state
- ✅ Refresh button
- ✅ "No results" empty state with illustration

---

## 2. Component Architecture & Structure

`AdvancedTable` is designed with a clean, modular architecture split into single-responsibility subcomponents, custom hooks, and utility functions:

```
AdvancedTable/
├── AdvancedTable.jsx              # Main container orchestrating subcomponents & hooks
├── AdvancedTable.scss             # Component styles
├── UsageGuide.md                  # Usage documentation
├── utils/
│   ├── tableUtils.js              # Pure date and numeric parsing helpers
│   └── searchHighlightUtils.jsx   # Search query matching & recursive React tree text highlighting
├── hooks/
│   ├── useTableFilters.js         # State & logic for filter panel, date/numeric/column filters, and chips
│   ├── useTablePagination.js      # State & logic for page bounds, pagination calculation, and rows options
│   └── useTableSelection.js       # Controlled/uncontrolled row selection & select-all state
└── subcomponents/
    ├── InlineColumnFilter.jsx     # Multi-select dropdown list for column filter values
    ├── TableControls.jsx          # Search bar, filter toggle button, refresh button, result counter & dropdown
    ├── TableFilterPanel.jsx       # Accordion filter panel (Select, Date, Numeric filters)
    ├── TableFilterChips.jsx       # Active filter chips bar & clear-all button
    ├── TableHeader.jsx            # <thead> header row with select-all checkbox & sortable column headers
    ├── TableBody.jsx              # <tbody> element container
    ├── TableRow.jsx               # Individual data row <tr> with selection, badge, and custom cell renders
    ├── TableSkeletonRows.jsx      # Skeleton row rendering during loading state
    └── TableEmptyState.jsx        # Empty state display when no rows match criteria
```

---

## 3. Props Reference

| Prop                        | Type          | Default               | Description                                                                 |
| --------------------------- | ------------- | --------------------- | --------------------------------------------------------------------------- |
| `data`                      | `object[]`    | `[]`                  | Array of row objects. Each object **should** have a unique `id` field       |
| `columns`                   | `ColumnDef[]` | `[]`                  | Column definitions. Auto-inferred from `data[0]` keys if omitted            |
| `tabs`                      | `TabDef[]`    | `[]`                  | Tab definitions. Auto-generated from `tabFilterKey` values if omitted       |
| `tabFilterKey`              | `string`      | `'status'`            | Data key used to auto-generate tabs when `tabs` is empty                    |
| `searchable`                | `boolean`     | `true`                | Show or hide the search bar                                                 |
| `searchPlaceholder`         | `string`      | `'Search records...'` | Static search bar placeholder text                                          |
| `searchPlaceholderPrefix`   | `string`      | `'Search by '`        | Prefix before each animated placeholder option                              |
| `searchOptions`             | `string[]`    | `null`                | Animated placeholder options. Auto-built from column labels if `null`       |
| `searchPlaceholderInterval` | `number`      | `3500`                | Interval in ms between animated placeholder transitions                     |
| `initialRowsPerPage`        | `number`      | `5`                   | Default rows per page on first render                                       |
| `selectable`                | `boolean`     | `true`                | Show row checkboxes and enable row selection                                |
| `selectedRows`              | `string[]`    | `[]`                  | **Controlled** selection — array of selected row `id` values                |
| `onSelectedRowsChange`      | `function`    | `undefined`           | Fires when selection changes. Presence enables controlled mode              |
| `headerActions`             | `ReactNode`   | `null`                | Custom elements rendered top-right in the tabs bar                          |
| `loading`                   | `boolean`     | `false`               | Shows animated skeleton shimmer rows when `true`                            |
| `skeletonRows`              | `number`      | `null`                | Override skeleton row count                                                 |
| `serverSide`                | `boolean`     | `false`               | Disables client-side filtering, sorting, and pagination                     |
| `totalCount`                | `number`      | `null`                | Total row count for server-side pagination display                          |
| `onTableChange`             | `function`    | `null`                | Fires on every page / sort / search / tab change                            |
| `onRefresh`                 | `function`    | `null`                | Callback triggered by the refresh icon button                               |
| `showRefresh`               | `boolean`     | `true`                | Show or hide the refresh button                                             |
| `showColumnToggle`          | `boolean`     | `true`                | Show or hide the Columns toggle button and popover panel                    |
| `defaultHiddenColumns`      | `string[]`    | `[]`                  | Array of column keys to hide by default on initial load                     |
| `visibleColumns`            | `string[]`    | `null`                | **Controlled** visible column keys list                                     |
| `onColumnVisibilityChange`  | `function`    | `null`                | Callback `(visibleKeys, hiddenKeys) => void` when column visibility changes |
| `filterConfig`              | `FilterDef[]` | `null`                | Manual filter definitions. Auto-inferred from data if `null`                |
| `className`                 | `string`      | `''`                  | Extra CSS class appended to the root wrapper                                |

---

## 4. Column Definition

Each entry in the `columns` array is a **ColumnDef** object:

```ts
{
  key: string                          // Required. Maps to a row data property name
  label: string                        // Required. Column header display text
  sortable?: boolean                   // Default: false. Enables click-to-sort
  width?: string                       // CSS width e.g. '150px', '20%', 'auto'
  hidable?: boolean                    // Default: true. Set false to lock column as mandatory (cannot hide)
  hideable?: boolean                   // Alias for hidable
  render?: (value, row) => ReactNode   // Custom cell renderer
}
```

### Example

```jsx
const columns = [
    {
        key: 'name',
        label: 'Full Name',
        sortable: true,
        width: '200px',
    },
    {
        key: 'status',
        label: 'Status',
        width: '130px',
        render: (status) => (
            <Badge variant={status === 'Active' ? 'success' : 'warning'} type="light">
                {status}
            </Badge>
        ),
    },
    {
        key: 'amount',
        label: 'Amount',
        sortable: true,
        width: '130px',
        // Currency values like '₹12,450' sort numerically automatically
    },
    {
        key: 'actions',
        label: '',
        width: '60px',
        render: (_, row) => <IconButton icon={<MoreIcon />} onClick={() => handleAction(row)} />,
    },
];
```

> **Note:** Columns with `key: 'action'` or `key: 'actions'` are **automatically excluded** from sorting and the filter panel.

---

## 5. Tab Definition

Each entry in the `tabs` array is a **TabDef** object:

```ts
{
  id: string                       // Unique tab identifier. Use 'all' for the "show all" tab
  label: string                    // Display text shown on the tab pill
  filterFn?: (row) => boolean      // Custom filter function — takes priority over key-matching
}
```

### Example

```jsx
const tabs = [
  { id: 'all',       label: 'All Orders' },
  { id: 'pending',   label: 'Pending',   filterFn: (row) => row.status === 'Pending' },
  { id: 'shipped',   label: 'Shipped',   filterFn: (row) => row.status === 'Shipped' },
  { id: 'delivered', label: 'Delivered', filterFn: (row) => row.status === 'Delivered' },
  { id: 'cancelled', label: 'Cancelled', filterFn: (row) => row.status === 'Cancelled' }
]

<AdvancedTable data={orders} tabs={tabs} />
```

Tab counts are computed from the **full unfiltered dataset** and shown as badges on each tab.

---

## 6. Filter Configuration

Each entry in `filterConfig` is a **FilterDef** object:

```ts
{
    key: string; // Must match a column key in your data
    label: string; // Human-readable label in the filter panel
    type: 'select' | 'date' | 'numeric'; // Which filter control to render
}
```

### Filter Type Guide

| Type        | UI Control                        | Best Used For                              |
| ----------- | --------------------------------- | ------------------------------------------ |
| `'select'`  | Searchable multi-select checklist | Status, category, tags, any enum column    |
| `'date'`    | Two DatePickers — From and To     | Created date, due date, any date/timestamp |
| `'numeric'` | Min / Max number inputs           | Amount, price, quantity, score, any number |

### Example

```jsx
<AdvancedTable
    data={invoices}
    filterConfig={[
        { key: 'status', label: 'Status', type: 'select' },
        { key: 'totalAmount', label: 'Total Amount', type: 'numeric' },
        { key: 'dueDate', label: 'Due Date', type: 'date' },
        { key: 'client', label: 'Client', type: 'select' },
    ]}
/>
```

> **Tip:** If `filterConfig` is `null` (the default), filters are **auto-inferred** from your data. See §7 below.

---

## 7. Auto-Inference Behaviour

When props are omitted, the table applies smart defaults automatically:

### Columns (when `columns` is empty)

| Rule     | Behaviour                                          |
| -------- | -------------------------------------------------- |
| Source   | Keys read from `data[0]`                           |
| Excluded | `id` and `_id` fields are skipped                  |
| Labels   | `camelCase` / `snake_case` converted to Title Case |
| Sortable | All primitive-value columns marked sortable        |

### Tabs (when `tabs` is empty)

- Reads all unique values from `data[n][tabFilterKey]` (default: `'status'`)
- Creates one tab per unique value + an **"All Records"** tab
- Tab counts are computed from the full dataset

### Filter Config (when `filterConfig` is null)

| Data Value Pattern                                           | Inferred Filter Type |
| ------------------------------------------------------------ | -------------------- |
| Numeric or currency string (`'₹12,450'`, `'$300'`)           | `'numeric'`          |
| Date-parseable string (`'15-01-2025'`, `'January 10, 2025'`) | `'date'`             |
| String with **2–20** unique values across dataset            | `'select'`           |
| Native JS `number` type                                      | `'numeric'`          |
| `key: 'action'` or `key: 'actions'`                          | Excluded entirely    |

> For production use, always provide an explicit `filterConfig` for predictable behaviour.

---

## 8. Row Selection

### Uncontrolled (internal state — simplest)

```jsx
// The table manages selection internally
<AdvancedTable data={users} selectable={true} />
```

### Controlled (external state — for bulk actions)

```jsx
const [selected, setSelected] = useState([])

<AdvancedTable
  data={users}
  selectable={true}
  selectedRows={selected}
  onSelectedRowsChange={setSelected}
/>

{/* Use selected IDs elsewhere */}
<button onClick={() => bulkDelete(selected)} disabled={selected.length === 0}>
  Delete {selected.length} selected
</button>
```

> **Important:** Every row object **must** have a unique `id` field for selection to work correctly. The `id` value is used as the selection key.

---

## 9. Server-Side Mode

When `serverSide={true}`, the table **does not** filter, sort, or paginate data locally. Use `onTableChange` to fetch from your backend on every state change:

```jsx
const [rows, setRows] = useState([]);
const [total, setTotal] = useState(0);
const [loading, setLoading] = useState(false);

const handleTableChange = async ({ page, rowsPerPage, searchTerm, activeTab, sortConfig }) => {
    setLoading(true);
    const result = await api.fetchInvoices({
        page,
        limit: rowsPerPage,
        search: searchTerm,
        status: activeTab !== 'all' ? activeTab : undefined,
        sortBy: sortConfig.key,
        sortDir: sortConfig.direction, // 'asc' | 'desc' | null
    });
    setRows(result.data);
    setTotal(result.total);
    setLoading(false);
};

<AdvancedTable
    data={rows}
    columns={myColumns}
    tabs={myTabs}
    serverSide={true}
    totalCount={total}
    loading={loading}
    onTableChange={handleTableChange}
/>;
```

### `onTableChange` Payload

```ts
{
    page: number;
    rowsPerPage: number;
    searchTerm: string;
    activeTab: string;
    sortConfig: {
        key: string | null;
        direction: 'asc' | 'desc' | null;
    }
}
```

---

## 10. Loading State

```jsx
// Basic usage — skeleton rows shown while fetching
<AdvancedTable data={data} loading={isLoading} />

// Override skeleton row count
<AdvancedTable data={data} loading={isLoading} skeletonRows={10} />
```

Skeleton row count defaults to: current page row count → `data.length` → `initialRowsPerPage`.

---

## 11. Header Actions

Inject custom elements into the top-right of the tab bar row:

```jsx
const headerActions = (
  <>
    <button className="table-action-btn" onClick={exportToCSV}>
      <DownloadIcon size={12} />
      Export
    </button>
    <button className="table-action-btn" onClick={openImportDialog}>
      <UploadIcon size={12} />
      Import
    </button>
  </>
)

<AdvancedTable data={data} headerActions={headerActions} />
```

> Use the **`.table-action-btn`** class (defined in `AdvancedTable.scss`) for styling that matches the table's design language automatically.

---

## 12. Advanced Filter Panel

The filter panel is toggled by a **"Filters"** button placed next to the search bar.

When filters are active:

- The Filters button turns **blue** with a count badge (e.g. `Filters 2`)
- A **chips bar** appears below the controls row — one dismissible pill per active filter
- Each chip has an `×` to remove that individual filter
- **"Clear all"** resets every filter at once

### Filter Types in Detail

#### `'select'` — Multi-Select Dropdown

- Opens a searchable checklist panel
- Multiple values can be selected simultaneously
- Logic within one column: **OR** (show rows matching any selected value)
- Example: `Status = Paid OR Status = Overdue`

#### `'date'` — Date Range

- Two `DatePicker` components: **From** and **To**
- Either bound can be used alone (open-ended range)
- Supported input formats:
    - `DD-MM-YYYY` → `15-01-2025`
    - `YYYY-MM-DD` → `2025-01-15`
    - Natural language → `January 15, 2025`

#### `'numeric'` — Min / Max Range

- Two labelled number inputs: **Min** and **Max**
- Currency symbols (`₹`, `$`, `€`, `£`) and commas are stripped before comparison
- Either bound can be used alone
- Spinner arrows hidden for a clean UI

### Filter Execution Pipeline (in order)

1. Tab filter
2. Full-text search
3. Column select filters _(AND across columns, OR within one column)_
4. Date range filters
5. Numeric range filters
6. Sorting

---

## 13. Full Real-World Example

```jsx
import React, { useState } from 'react';
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';
import Badge from '@/components/Shared/DataDisplay/Badge/Badge';
import IconButton from '@/components/Shared/Buttons/IconButton/IconButton';
import { MoreHorizontal as MoreIcon, Download as DownloadIcon } from 'lucide-react';

// ── Column definitions ────────────────────────────────────────────────────────
const invoiceColumns = [
    {
        key: 'invoiceId',
        label: 'Invoice',
        sortable: true,
        width: '150px',
    },
    {
        key: 'client',
        label: 'Client',
        sortable: true,
        width: '200px',
        render: (val, row) => (
            <div>
                <div style={{ fontWeight: 600 }}>{val}</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{row.company}</div>
            </div>
        ),
    },
    {
        key: 'totalAmount',
        label: 'Total Amount',
        sortable: true,
        width: '130px',
    },
    {
        key: 'dueDate',
        label: 'Due Date',
        sortable: true,
        width: '130px',
    },
    {
        key: 'status',
        label: 'Status',
        width: '120px',
        render: (status) => {
            const variantMap = {
                Paid: 'success',
                Due: 'warning',
                Overdue: 'danger',
                Draft: 'neutral',
                Recurring: 'info',
            };
            return (
                <Badge variant={variantMap[status] || 'neutral'} type="light">
                    {status}
                </Badge>
            );
        },
    },
    {
        key: 'action',
        label: '',
        width: '60px',
        render: (_, row) => (
            <IconButton
                icon={<MoreIcon size={16} />}
                variant="plain"
                onClick={(e) => {
                    e.stopPropagation();
                    openContextMenu(row);
                }}
            />
        ),
    },
];

// ── Tab definitions ───────────────────────────────────────────────────────────
const invoiceTabs = [
    { id: 'all', label: 'All Invoices' },
    { id: 'Draft', label: 'Draft', filterFn: (row) => row.status === 'Draft' },
    { id: 'Paid', label: 'Paid', filterFn: (row) => row.status === 'Paid' },
    { id: 'Due', label: 'Due', filterFn: (row) => row.status === 'Due' },
    { id: 'Overdue', label: 'Overdue', filterFn: (row) => row.status === 'Overdue' },
    { id: 'Recurring', label: 'Recurring', filterFn: (row) => row.status === 'Recurring' },
];

// ── Filter definitions ────────────────────────────────────────────────────────
const invoiceFilters = [
    { key: 'status', label: 'Status', type: 'select' },
    { key: 'totalAmount', label: 'Total Amount', type: 'numeric' },
    { key: 'dueDate', label: 'Due Date', type: 'date' },
];

// ── Page component ────────────────────────────────────────────────────────────
export default function InvoicesPage() {
    const [selected, setSelected] = useState([]);

    const headerActions = (
        <button
            className="table-action-btn"
            onClick={() => exportToCSV(selected)}
            disabled={selected.length === 0}
        >
            <DownloadIcon size={12} />
            Export {selected.length > 0 ? `(${selected.length})` : ''}
        </button>
    );

    return (
        <AdvancedTable
            data={invoiceData}
            columns={invoiceColumns}
            tabs={invoiceTabs}
            filterConfig={invoiceFilters}
            searchable={true}
            searchPlaceholder="Search invoices..."
            initialRowsPerPage={10}
            selectable={true}
            selectedRows={selected}
            onSelectedRowsChange={setSelected}
            headerActions={headerActions}
            showRefresh={true}
            onRefresh={() => refetchInvoices()}
        />
    );
}
```

---

## 14. Notes and Gotchas

### Row `id` Field Is Required

Every row object must have a unique `id` field. It powers selection, the `isNew` badge, and React key management.

```js
// ✅ Correct
{ id: 1,       name: 'Alice', status: 'Active' }
{ id: 'inv-1', name: 'INV-001', status: 'Paid' }

// ❌ Avoid — missing id breaks selection and key tracking
{ name: 'Alice', status: 'Active' }
```

### `isNew` Row Badge

Set `isNew: true` on a row to show a green **"New"** vertical badge in the row's leftmost cell. The badge is automatically cleared when the table is refreshed.

```js
{ id: 5, invoiceId: 'INV-018', status: 'Draft', isNew: true }
```

### Currency Column Sorting

Values like `'₹12,450'` and `'$3,200.00'` are sorted **numerically** — the currency symbol and commas are stripped automatically before comparison. No extra configuration needed.

### Search Normalisation

The search bar strips currency formatting during comparison, so typing `12450` will match `₹12,450.00`. Search is **case-insensitive** and matches any substring across all visible columns.

### Date Parsing in Filters

The date range filter supports these formats:

| Format           | Example                              |
| ---------------- | ------------------------------------ |
| `DD-MM-YYYY`     | `15-01-2025`                         |
| `DD/MM/YYYY`     | `15/01/2025`                         |
| `YYYY-MM-DD`     | `2025-01-15`                         |
| Natural language | `January 15, 2025` or `15 Jan, 2025` |

> Rows with date values that **cannot be parsed** are excluded from results when a date filter is active. Use explicit `filterConfig` to control which columns appear as date filters.

### Filter AND / OR Logic Summary

| Scope                                  | Logic Applied                                     |
| -------------------------------------- | ------------------------------------------------- |
| Multiple values in one `select` filter | **OR** — row matches if it has any selected value |
| Two different column filters active    | **AND** — row must pass both                      |
| Select + Date + Numeric together       | **AND** — row must pass all three                 |
| Tab + Search + Filters together        | **AND** — row must pass everything                |

### Disabling Individual Features

```jsx
// Disable filter panel entirely
<AdvancedTable data={data} filterConfig={[]} />

// Hide the refresh button
<AdvancedTable data={data} showRefresh={false} />

// Disable row checkboxes
<AdvancedTable data={data} selectable={false} />

// Hide the search bar
<AdvancedTable data={data} searchable={false} />
```

---

_Component: [AdvancedTable.jsx](./AdvancedTable.jsx) — `src/components/Shared/DataDisplay/AdvancedTable/`_

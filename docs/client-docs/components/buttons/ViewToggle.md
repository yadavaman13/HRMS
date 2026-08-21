# ViewToggle

A segmented icon-button toggle control used for switching between Table view and Grid/Card view across data layouts.

---

## 1. Import Path

```javascript
import ViewToggle from '@/components/Shared/Buttons/ViewToggle/ViewToggle';
```

---

## 2. Props Specification

| Prop Name      | Type                | Default   | Required | Description                                                                     |
| -------------- | ------------------- | --------- | -------- | ------------------------------------------------------------------------------- |
| `view`         | `'table' \| 'grid'` | `'table'` | Yes      | Active view mode.                                                               |
| `onViewChange` | `function`          | —         | Yes      | Callback fired when user switches view: `(newView: 'table' \| 'grid') => void`. |
| `size`         | `'sm' \| 'md'`      | `'md'`    | No       | Button dimensions preset.                                                       |
| `className`    | `string`            | `''`      | No       | Additional custom CSS class name.                                               |

---

## 3. Usage Example

```jsx
import { useState } from 'react';
import ViewToggle from '@/components/Shared/Buttons/ViewToggle/ViewToggle';
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';
import GridView from '@/components/Shared/DataDisplay/DataView/components/GridView/GridView';

export default function LeadsViewContainer({ data, columns }) {
    const [viewMode, setViewMode] = useState('table');

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <ViewToggle view={viewMode} onViewChange={setViewMode} />
            </div>

            {viewMode === 'table' ? (
                <AdvancedTable data={data} columns={columns} />
            ) : (
                <GridView data={data} />
            )}
        </div>
    );
}
```

# DataView

A modular view orchestrator that wraps `AdvancedTable` and `GridView` with an integrated `ViewToggle` segmented button, allowing users to switch seamlessly between Table and Grid card layouts.

---

## 1. Import Path

```javascript
import DataView from '@/components/Shared/DataDisplay/DataView/DataView';
```

---

## 2. Props Specification

| Prop Name         | Type                  | Default   | Required | Description                                    |
| ----------------- | --------------------- | --------- | -------- | ---------------------------------------------- |
| `data`            | `Array<object>`       | `[]`      | Yes      | List of records.                               |
| `columns`         | `Array<ColumnConfig>` | `[]`      | Yes      | Column layout schema.                          |
| `defaultView`     | `'table' \| 'grid'`   | `'table'` | No       | Initial active view mode.                      |
| `cardTitleKey`    | `string`              | —         | No       | Key in row object for GridCard title.          |
| `cardSubtitleKey` | `string`              | —         | No       | Key in row object for GridCard subtitle.       |
| `cardImageKey`    | `string`              | —         | No       | Key in row object for GridCard avatar.         |
| `cardStatusKey`   | `string`              | —         | No       | Key in row object for GridCard status badge.   |
| `cardBodyKeys`    | `Array<string>`       | `[]`      | No       | Additional key-value pairs shown in card body. |
| `gridColumns`     | `number`              | `3`       | No       | Grid column count (e.g. 2, 3, 4).              |
| `loading`         | `boolean`             | `false`   | No       | Loading indicator.                             |

---

## 3. Usage Example

```jsx
import DataView from '@/components/Shared/DataDisplay/DataView/DataView';

export default function CRMContactsView({ contacts, loading }) {
    const columns = [
        { key: 'name', label: 'Contact Name' },
        { key: 'company', label: 'Company' },
        { key: 'email', label: 'Email' },
        { key: 'status', label: 'Status' },
    ];

    return (
        <DataView
            data={contacts}
            columns={columns}
            defaultView="grid"
            cardTitleKey="name"
            cardSubtitleKey="company"
            cardStatusKey="status"
            cardBodyKeys={['email']}
            loading={loading}
        />
    );
}
```

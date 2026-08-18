# SearchBar — Component Guide & Architecture

A modular, feature-rich search bar component with animated cycling placeholders, recent search history dropdown, and full history modal with date range filtering and sorting.

---

## 1. Directory & File Architecture

```
src/components/Shared/Form/SearchBar/
├── SearchBar.jsx                       # Main orchestrator component
├── SearchBar.scss                      # Component SCSS styles
├── UsageGuide.md                       # Component documentation
├── utils/
│   └── searchBarUtils.js               # Time formatting & seed history helpers
├── hooks/
│   ├── useAnimatedPlaceholder.js      # Animated placeholder option cycling hook
│   └── useSearchHistoryFilters.js      # Modal date range, text filter & sort hook
└── subcomponents/
    ├── SearchInputRow.jsx              # Main search input bar & clear button
    ├── SearchHistoryDropdown.jsx       # Recent search history inline dropdown list
    ├── SearchHistoryModal.jsx          # Full history dialog modal with filters & sorting
    └── SearchHistoryItem.jsx           # Individual history item row
```

---

## 2. Quick Start

```jsx
import SearchBar from '@/components/Shared/Form/SearchBar/SearchBar';

function MyComponent() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholderOptions={['Invoice Number', 'Client Name', 'Status']}
            placeholderPrefix="Search by "
        />
    );
}
```

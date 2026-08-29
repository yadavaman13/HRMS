# AdvancedScrollbar

A custom scrollbar primitive supporting horizontal and vertical scrolling, smooth click/drag navigation, and dynamic number tooltips displaying visible row positions (e.g. `82 of 107`).

---

## 1. Import Path

```javascript
import AdvancedScrollbar from '@/components/Shared/DataDisplay/AdvancedScrollbar/AdvancedScrollbar';
```

---

## 2. Props Specification

| Prop Name              | Type        | Default | Required | Description                                                      |
| ---------------------- | ----------- | ------- | -------- | ---------------------------------------------------------------- |
| `targetRef`            | `RefObject` | —       | Yes      | React ref attached to the scrollable viewport container element. |
| `vertical`             | `boolean`   | `true`  | No       | Enables vertical scrollbar track and thumb.                      |
| `horizontal`           | `boolean`   | `false` | No       | Enables horizontal scrollbar track and thumb.                    |
| `showVerticalTooltip`  | `boolean`   | `false` | No       | Renders dynamic live item index tooltips during scrolling.       |
| `verticalHeaderOffset` | `number`    | `0`     | No       | Top margin offset to align below sticky table headers.           |

---

## 3. Usage Example

```jsx
import { useRef } from 'react';
import AdvancedScrollbar from '@/components/Shared/DataDisplay/AdvancedScrollbar/AdvancedScrollbar';

export default function CustomScrollContainer({ children }) {
  const scrollRef = useRef(null);

  return (
    <div style={{ position: 'relative', height: '400px' }}>
      <div ref={scrollRef} style={{ overflow: 'hidden', height: '100%' }}>
        {children}
      </div>
      <AdvancedScrollbar targetRef={scrollRef} vertical={true} showVerticalTooltip={true} />
    </div>
  );
}
```

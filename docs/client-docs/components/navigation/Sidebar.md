# Sidebar

The primary application navigation sidebar supporting collapsible states (desktop `260px` → collapsed `64px`), flyout sub-menu popovers on hover, logo collapse interactions, active route highlighting via React Router `useLocation()`, role-based menu filtering, and mobile drawer overlays.

---

## 1. Import Path

```javascript
import Sidebar from '@/components/Shared/Navigation/Sidebar/Sidebar';
```

---

## 2. Component Architecture & Subcomponents

The `Sidebar` is composed of three modular subcomponents:

- **SidebarLogo**: Displays company branding and houses the collapse toggle trigger button.
- **SidebarNav**: Maps active routes, highlights selected items, handles pin/unpin toggles, and renders flyout sub-tabs on hover when collapsed.
- **ProfileCard**: Renders active user information (avatar, name, role) and contains the settings/logout action menu.

---

## 3. Props Specification

| Prop Name          | Type        | Default | Required | Description                                         |
| ------------------ | ----------- | ------- | -------- | --------------------------------------------------- |
| `isCollapsed`      | `boolean`   | `false` | Yes      | Collapsed sidebar state (`64px` icon-only view).    |
| `onToggleCollapse` | `function`  | —       | Yes      | Toggle collapse callback: `() => void`.             |
| `isMobileOpen`     | `boolean`   | `false` | No       | Controls mobile slide-in drawer overlay.            |
| `onMobileClose`    | `function`  | —       | No       | Callback to close mobile slide-out view.            |
| `onLogoutRequest`  | `function`  | —       | No       | Callback triggered when user clicks logout.         |
| `pinnedTabs`       | `string[]`  | `[]`    | No       | List of pinned route keys/identifiers.              |
| `onPinToggle`      | `function`  | —       | No       | Handler for pinning/unpinning nav items.            |
| `navItems`         | `NavItem[]` | `null`  | No       | Optional custom navigation items override for RBAC. |

---

## 4. Full-Stack State & URL Sync Strategy

To ensure seamless navigation and browser history/bookmark support, sidebar active state is synchronized with the browser location URL via React Router v7.

### URL Mapping Structure

```
/dashboard/home                ==> activeTab="Home"
/dashboard/analytics           ==> activeTab="Analytics"
/dashboard/analytics/insights  ==> activeTab="Analytics", activeSubTab="Insights"
/dashboard/settings/general    ==> activeTab="Settings", activeSubTab="General"
/dashboard/settings/account    ==> activeTab="Settings", activeSubTab="Account"
```

### Layout Integration Example

```jsx
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import Sidebar from '@/components/Shared/Navigation/Sidebar/Sidebar';
import { useAuth } from '@/app/features/auth/hooks/useAuth';

export default function DashboardLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="dashboard-layout">
            <Sidebar
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                isMobileOpen={isMobileOpen}
                onMobileClose={() => setIsMobileOpen(false)}
                onLogoutRequest={async () => {
                    await handleLogout();
                    navigate('/login');
                }}
            />
            <main className="dashboard-main">
                <Outlet />
            </main>
        </div>
    );
}
```

---

## 5. Role-Based Access Control (RBAC)

When defining navigation items, filter items based on the authenticated user's permissions:

```javascript
const allNavItems = [
    {
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'LayoutDashboard',
        roles: ['admin', 'manager', 'user'],
    },
    {
        label: 'Analytics',
        path: '/analytics',
        icon: 'BarChart2',
        subTabs: ['Insights', 'Reports'],
        roles: ['admin', 'manager'],
    },
    { label: 'Settings', path: '/settings', icon: 'Settings', roles: ['admin'] },
];

// In layout / container:
const visibleNavItems = allNavItems.filter((item) => item.roles.includes(user.role));
```

---

## 6. Session Lifecycle & Logout

```mermaid
sequenceDiagram
    autonumber
    actor User as Client User
    participant Sidebar as Sidebar (ProfileCard)
    participant AuthContext as AuthContext / useAuth
    participant API as Backend Express Server

    User->>Sidebar: Clicks "Logout"
    Sidebar->>AuthContext: onLogoutRequest()
    AuthContext->>API: POST /api/auth/logout
    API-->>AuthContext: HTTP 200 OK
    AuthContext->>User: Clear session & navigate('/login')
```

---

## 7. SCSS & Styling Rules

- **Stylesheet**: `client/src/components/Shared/Navigation/Sidebar/Sidebar.scss`
- **Widths**: Full `260px`, Collapsed `64px`, Mobile `100%` (drawer overlay).
- **Flyout sub-tabs**: When collapsed, hovering over parent items (e.g. Analytics) renders a right-positioned popover flyout menu for immediate sub-route navigation without expanding the sidebar.
- **Micro-interactions**: Logo transitions to an expand chevron icon on hover when collapsed.

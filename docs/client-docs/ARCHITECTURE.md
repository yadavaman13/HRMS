# Frontend Architecture Overview

**Apex Template - Dual-Purpose React Architecture**

---

## 1. Architecture Philosophy

The Apex Template is a **dual-purpose** frontend architecture supporting:

1. **Public-Facing Websites** - Marketing sites, landing pages, consumer web applications
2. **Internal Dashboards** - Admin panels, CRM systems, analytics tools

### Key Principle: Pattern Selection

**Before building any feature, determine the correct pattern:**

- **Public Website Pattern** → Full-width layouts, top navigation, card-based content
- **Dashboard Pattern** → Sidebar + topbar, data tables, analytics widgets

**📖 Read:** `START_HERE.md` and `AI_DECISION_TREE.md` for pattern selection guidance.

---

## 2. Directory Structure

```
client/src/
├── app/
│   ├── App.jsx                    # Root application component
│   ├── App.routes.jsx             # Main router configuration
│   ├── routes.loader.js           # Auto-discovery of feature routes
│   │
│   └── features/                  # Feature modules (modular architecture)
│       ├── auth/                  # Authentication (public routes)
│       ├── website-demo/          # Public website example ✨
│       ├── dashboard/             # Dashboard layout & views
│       ├── analytics/             # Analytics dashboards
│       ├── settings/              # User settings
│       ├── ai/                    # AI Copilot chatbot
│       ├── showcase/              # Component showcase
│       └── maps-showcase/         # Maps integration demo
│
├── components/
│   ├── Shared/                    # Reusable design system components
│   │   ├── Buttons/
│   │   ├── Form/
│   │   ├── Cards/
│   │   ├── Modals/
│   │   ├── Tables/
│   │   ├── Charts/
│   │   └── ...
│   │
│   └── ai-elements/               # AI-specific UI components
│
├── context/                       # Global contexts (if any)
├── hooks/                         # Global custom hooks
├── infrastructure/                # Infrastructure services (maps, etc.)
├── lib/                           # Third-party library configurations
├── styles/                        # Global SCSS styles & design tokens
├── utils/                         # Utility functions
│
└── main.jsx                       # Application entry point
```

---

## 3. Dual-Purpose Architecture Patterns

### A. Public Website Pattern

**Use for:** Marketing sites, landing pages, e-commerce, travel planners, consumer apps

**Structure:**

```
src/app/features/your-feature/
├── layouts/
│   ├── PublicLayout.jsx       # Header + Content + Footer
│   ├── Header.jsx             # Top navigation
│   └── Footer.jsx             # Site footer
├── pages/
│   ├── LandingPage.jsx        # Hero + Features + CTA
│   ├── AboutPage.jsx
│   └── ContactPage.jsx
├── components/
│   ├── HeroSection/
│   ├── FeatureCard/
│   └── CTASection/
├── services/
│   └── api.js
├── context/
│   └── FeatureContext.jsx
├── hooks/
│   └── useFeature.js
└── feature.routes.jsx
```

**Key Characteristics:**

- ✅ Top navigation only (NO sidebar)
- ✅ Full-width layouts with max-width containers
- ✅ Card-based content display
- ✅ Hero sections and marketing components
- ✅ Public routes (no auth required for main pages)
- ✅ SEO optimization

**Example:** See `src/app/features/website-demo/`

---

### B. Dashboard Pattern

**Use for:** Admin panels, CRM systems, analytics dashboards, internal tools

**Structure:**

```
src/app/features/your-feature/
├── components/
│   ├── DataTable.jsx
│   ├── FilterPanel.jsx
│   └── StatCards.jsx
├── pages/
│   ├── FeaturePage.jsx        # Main dashboard view
│   ├── DetailPage.jsx
│   └── SettingsPage.jsx
├── services/
│   └── api.js
├── context/
│   └── FeatureContext.jsx
├── hooks/
│   └── useFeature.js
└── feature.routes.jsx
```

**Key Characteristics:**

- ✅ Sidebar + topbar navigation (DashboardLayout)
- ✅ Data tables for records
- ✅ KPI cards and analytics widgets
- ✅ Form-heavy CRUD operations
- ✅ Protected routes (auth required)
- ✅ Role-based access control (RBAC)

**Example:** See `src/app/features/analytics/`, `src/app/features/dashboard/`

---

## 4. Feature Module Structure (4-Layer Model)

Every feature follows a clean **4-layer architecture**:

```
┌─────────────────────────────────────────────┐
│  1. UI Layer (Presentation)                 │
│     pages/ + components/                    │
│     - Renders JSX                           │
│     - Reads state via useContext            │
│     - Calls action handlers from hooks      │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  2. Hooks Layer (Orchestration)             │
│     hooks/                                  │
│     - Coordinates async flows               │
│     - Calls API services                    │
│     - Updates state via setters             │
│     - Exports action handlers only          │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  3. State Layer (Memory)                    │
│     context/                                │
│     - Holds shared state                    │
│     - Provides read-only values to UI       │
│     - Provides setters to hooks             │
│     - Pure storage, no async logic          │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│  4. API Layer (Backend Communication)       │
│     services/                               │
│     - Pure HTTP client functions            │
│     - Axios/fetch wrappers                  │
│     - No React hooks or state               │
└─────────────────────────────────────────────┘
```

**📖 Deep Dive:** See `DASHBOARD_ARCHITECTURE.md` for detailed 4-layer implementation patterns.

---

## 5. Routing Architecture

### A. Auto-Discovery System

The template uses **zero-conflict route discovery** to avoid merge conflicts:

- **Engine:** `routes.loader.js` scans all `*.routes.jsx` files
- **Developer Flow:** Add routes in feature-specific `*.routes.jsx` files
- **No Central Editing:** Never edit `App.routes.jsx` manually

### B. Route Types

```javascript
// feature.routes.jsx example
export default {
  // Public routes (no auth required)
  publicRoutes: [
    {
      path: 'your-feature',
      element: <PublicLayout />,
      children: [{ index: true, element: <LandingPage /> }],
    },
  ],

  // User routes (auth required, under /dashboard/user)
  userRoutes: [
    {
      path: 'your-feature',
      element: <FeaturePage />,
    },
  ],

  // Admin routes (admin role required, under /dashboard/admin)
  adminRoutes: [
    {
      path: 'your-feature',
      element: <AdminFeaturePage />,
    },
  ],
};
```

### C. Route Structure

```
/                                  → Redirects to /login
/login                             → Public auth page
/register                          → Public registration
/demo/website                      → Public website demo

/dashboard                         → Dashboard index (protected)
├── /dashboard/user                → User features
│   ├── /dashboard/user/analytics
│   ├── /dashboard/user/settings
│   └── /dashboard/user/ai
│
└── /dashboard/admin               → Admin features (RBAC)
    └── /dashboard/admin/analytics
```

---

## 6. Layout Components

### A. Public Website Layouts

**Location:** `src/app/features/*/layouts/`

```jsx
// PublicLayout.jsx
<div className="public-layout">
  <Header /> {/* Top navigation */}
  <main>
    <Outlet /> {/* Page content */}
  </main>
  <Footer /> {/* Site footer */}
</div>
```

**Components:**

- `Header.jsx` - Top navigation with logo, menu, auth buttons
- `Footer.jsx` - Site footer with links and social icons
- No sidebar navigation

---

### B. Dashboard Layouts

**Location:** `src/app/features/dashboard/DashboardLayout/`

```jsx
// DashboardLayout.jsx
<div className="dashboard-layout">
  <Sidebar /> {/* Persistent sidebar navigation */}
  <div className="dashboard-main">
    <Topbar /> {/* User menu, notifications */}
    <main>
      <Outlet /> {/* Dashboard content */}
    </main>
  </div>
</div>
```

**Components:**

- `Sidebar.jsx` - Persistent sidebar with feature navigation
- `Topbar.jsx` - User profile, notifications, search
- `DashboardLayout.jsx` - Combined layout wrapper

---

## 7. Shared Component Library

**Location:** `src/components/Shared/`

The template includes a comprehensive design system of reusable components that work for **both** patterns:

### Universal Components (Use in Both)

| Category     | Components                                                       |
| ------------ | ---------------------------------------------------------------- |
| **Buttons**  | Button, IconButton, ButtonGroup                                  |
| **Forms**    | InputField, Textarea, Dropdown, Checkbox, RadioGroup, DatePicker |
| **Cards**    | Card, StatCard, MetricCard                                       |
| **Feedback** | Modal, Toast, Alert, Spinner, ProgressBar                        |
| **Layout**   | Container, Grid, Flexbox helpers                                 |

### Website-Specific Usage

- Use Card components for content grids
- StatCard for feature highlights
- MetricCard for pricing tiers
- Modal for login/signup forms

### Dashboard-Specific Usage

- AdvancedTable for data records
- StatCard for KPIs
- KanbanBoard for task management
- Charts for analytics visualization

**📖 Full Reference:** See `COMPONENTS_CATALOG.md`

---

## 8. Styling System

### A. SCSS Architecture

**Location:** `src/styles/`

```
styles/
├── foundation/
│   ├── _reset.scss           # CSS reset
│   ├── _typography.scss      # Font system
│   └── _colors.scss          # Color palette
│
├── _variables.scss            # Design tokens (spacing, colors, etc.)
├── _mixins.scss              # Reusable SCSS mixins
└── global.scss               # Global styles
```

### B. Design Tokens

Use design tokens for consistency:

```scss
@use '@/styles/variables' as v;

.component {
  padding: v.$spacing-lg;
  color: v.$color-text-primary;
  font-size: v.$font-size-base;
  border-radius: v.$radius-medium;
}
```

**📖 Details:** See `DESIGN_SYSTEM_SCSS.md`

---

## 9. State Management Patterns

### A. Context-Based State

Each feature manages its own state via React Context:

```jsx
// context/FeatureContext.jsx
export const FeatureContext = createContext();

export function FeatureProvider({ children }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const value = useMemo(
    () => ({
      // Read-only values (for UI)
      data,
      loading,
      error,

      // Setters (for hooks only)
      setData,
      setLoading,
      setError,
    }),
    [data, loading, error]
  );

  return <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>;
}
```

### B. Custom Hooks Pattern

```javascript
// hooks/useFeature.js
export function useFeature() {
  const { setData, setLoading, setError } = useContext(FeatureContext);

  const handleCreate = useCallback(
    async (input) => {
      setLoading(true);
      setError(null);
      try {
        const result = await featureService.create(input);
        setData((prev) => [...prev, result]);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setData, setLoading, setError]
  );

  return { handleCreate };
}
```

**📖 Deep Dive:** See `DASHBOARD_ARCHITECTURE.md` for complete 4-layer pattern details.

---

## 10. API Integration

### A. Service Layer Pattern

**Location:** `src/app/features/*/services/`

```javascript
// services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

export const featureService = {
  getAll: () => apiClient.get('/feature'),
  getById: (id) => apiClient.get(`/feature/${id}`),
  create: (data) => apiClient.post('/feature', data),
  update: (id, data) => apiClient.put(`/feature/${id}`, data),
  delete: (id) => apiClient.delete(`/feature/${id}`),
};
```

### B. Environment Configuration

```bash
# .env.example
VITE_API_URL=http://localhost:3000/api
VITE_MAP_PROVIDER=google
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

---

## 11. Authentication & Authorization

### A. Authentication Flow

**Pattern:** Cookie-based JWT with secure httpOnly cookies

```
1. User logs in → POST /api/auth/login
2. Server sets httpOnly cookie with JWT
3. Frontend stores user data in AuthContext
4. Protected routes check auth state
5. API requests automatically include cookie
```

### B. Role-Based Access Control (RBAC)

```jsx
// Protected route with role check
<ProtectedRoute allowedRoles={['admin', 'manager']}>
  <AdminFeature />
</ProtectedRoute>
```

**Roles:**

- `admin` - Full system access
- `manager` - Team management access
- `user` - Standard user access

---

## 12. Infrastructure Services

### Pluggable Services Pattern

**Example:** Maps service with provider switching

```
src/infrastructure/maps/
├── components/
│   ├── MapView.jsx           # Provider-agnostic map component
│   └── PlaceAutocomplete.jsx # Search component
├── context/
│   └── MapsContext.jsx       # Provider interface
├── providers/
│   ├── google/               # Google Maps implementation
│   └── osm/                  # OpenStreetMap implementation
└── config.js
```

**Usage:**

```jsx
import { MapView, MapMarker } from '@/infrastructure/maps';

<MapView center={[lat, lng]} zoom={12}>
  <MapMarker position={[lat, lng]} />
</MapView>;
```

The system automatically uses the provider specified in `VITE_MAP_PROVIDER`.

---

## 13. Development Workflow

### A. Adding a New Public Website Feature

```bash
# 1. Create feature directory
mkdir -p src/app/features/my-feature/{pages,layouts,components,services,context,hooks}

# 2. Create PublicLayout
# Copy from website-demo/layouts/PublicLayout.jsx

# 3. Create pages
# Create LandingPage.jsx, AboutPage.jsx, etc.

# 4. Create routes file
# Create my-feature.routes.jsx with publicRoutes

# 5. Test
# Routes auto-discovered, no manual registration needed
```

### B. Adding a New Dashboard Feature

```bash
# 1. Create feature directory
mkdir -p src/app/features/my-feature/{pages,components,services,context,hooks}

# 2. Create feature pages
# Create pages using Shared components (AdvancedTable, StatCard, etc.)

# 3. Create routes file
# Create my-feature.routes.jsx with userRoutes or adminRoutes

# 4. Add sidebar navigation (optional)
# Add navItem in routes file for automatic sidebar entry

# 5. Test
# Navigate to /dashboard/user/my-feature
```

**📖 Detailed Guide:** See `FEATURE_DEVELOPMENT_GUIDE.md`

---

## 14. Testing Strategy

### A. Component Testing

- **Unit Tests:** Individual component logic
- **Integration Tests:** Component + context + hooks
- **E2E Tests:** Full user flows

### B. Tools

- **Vitest** - Unit and integration testing
- **React Testing Library** - Component testing
- **Playwright/Cypress** - E2E testing

**📖 Guide:** See `MockingDirectory.md` for mock data patterns

---

## 15. Performance Optimization

### Best Practices

1. **Code Splitting:** Lazy load routes and heavy components
2. **Memoization:** Use `React.memo`, `useMemo`, `useCallback`
3. **Virtual Scrolling:** For long lists (AdvancedTable uses this)
4. **Image Optimization:** Lazy loading, WebP format
5. **Bundle Analysis:** Regular checks with `vite build --analyze`

---

## 16. Accessibility (a11y)

All shared components follow WCAG 2.1 AA standards:

- ✅ Keyboard navigation support
- ✅ ARIA labels and roles
- ✅ Focus management
- ✅ Screen reader compatibility
- ✅ Color contrast compliance

**📖 Guide:** See `web-design-guidelines` skill for complete a11y checklist

---

## 17. Quick Decision Matrix

| Question                     | Answer          | Pattern   | Read Guide                |
| ---------------------------- | --------------- | --------- | ------------------------- |
| Building a travel planner?   | Public users    | WEBSITE   | WEBSITE_CONTEXT.md        |
| Building an e-commerce site? | Public shoppers | WEBSITE   | WEBSITE_CONTEXT.md        |
| Building a CRM system?       | Internal staff  | DASHBOARD | DASHBOARD_ARCHITECTURE.md |
| Building admin analytics?    | Admin users     | DASHBOARD | DASHBOARD_ARCHITECTURE.md |
| Building a portfolio site?   | Public visitors | WEBSITE   | WEBSITE_CONTEXT.md        |
| Building user management?    | Admin staff     | DASHBOARD | DASHBOARD_ARCHITECTURE.md |

**⚠️ Still unsure? Read `START_HERE.md` and `AI_DECISION_TREE.md` first!**

---

## 18. File Naming Conventions

### Components

- PascalCase: `MyComponent.jsx`
- Styles: `MyComponent.scss`
- Tests: `MyComponent.test.jsx`

### Utilities & Services

- camelCase: `apiService.js`, `formatDate.js`

### Routes

- kebab-case: `feature-name.routes.jsx`

### Styles

- kebab-case: `public-layout.scss`

---

## 19. Key Architectural Principles

### ✅ DO

1. **Choose the right pattern** - Website vs Dashboard
2. **Separate concerns** - Follow 4-layer architecture
3. **Reuse components** - Check Shared/ before creating new
4. **Keep features modular** - Self-contained feature folders
5. **Follow naming conventions** - Consistency matters
6. **Use design tokens** - Import from `_variables.scss`
7. **Implement accessibility** - a11y from the start

### ❌ DON'T

1. **Mix patterns** - Don't use Sidebar on public websites
2. **Hardcode styles** - Use design token variables
3. **Call APIs from UI** - Use hooks + services
4. **Ignore TypeScript** - Add JSDoc comments for better DX
5. **Create duplicate components** - Check catalog first
6. **Skip authentication** - Use ProtectedRoute for protected pages
7. **Forget mobile** - Test responsive design

---

## 20. Related Documentation

### Pattern Selection

- `START_HERE.md` - Critical entry point (⚠️ **Read first!**)
- `AI_DECISION_TREE.md` - Decision framework

### Pattern Guides

- `WEBSITE_CONTEXT.md` - Public website patterns
- `PUBLIC_LAYOUT_PATTERNS.md` - Website code examples
- `DASHBOARD_ARCHITECTURE.md` - Dashboard 4-layer architecture

### Component Reference

- `COMPONENTS_CATALOG.md` - All available components
- `DESIGN_SYSTEM_SCSS.md` - Styling guidelines
- `ValidationGuide.md` - Form validation patterns
- `ChartsGuide.md` - Data visualization

### Development

- `FEATURE_DEVELOPMENT_GUIDE.md` - Development workflow
- `FRONTEND_AGENT_PLAYBOOK.md` - AI agent workflow
- `MockingDirectory.md` - Testing patterns

### Implementation Specs

- `GLOBETROTTER_IMPLEMENTATION.md` - Travel app example

---

## 21. Architecture Evolution

**Current State (v2.0):**

- ✅ Dual-purpose architecture (websites + dashboards)
- ✅ Auto-discovery routing system
- ✅ 4-layer modular architecture
- ✅ Comprehensive shared component library
- ✅ Role-based access control
- ✅ Pluggable infrastructure services

**Previous State (v1.0):**

- Dashboard-only focus (Odoo CRM template)
- Manual route registration
- Monolithic component structure

**Future Considerations:**

- Server-side rendering (SSR) with React Router v7
- Progressive Web App (PWA) support
- Advanced animation library integration
- Micro-frontend architecture for large teams

---

## 22. Getting Started

### For New Developers

1. **Understand the system:** Read this document
2. **Learn pattern selection:** Read START_HERE.md + AI_DECISION_TREE.md
3. **Explore components:** Browse COMPONENTS_CATALOG.md
4. **Study an example:**
   - Website: Check `src/app/features/website-demo/`
   - Dashboard: Check `src/app/features/analytics/`
5. **Build something:** Follow FEATURE_DEVELOPMENT_GUIDE.md

### For AI Agents

1. **Read START_HERE.md** - Understand dashboard vs website bias
2. **Read AI_DECISION_TREE.md** - Learn pattern selection
3. **Determine pattern** - Is this public or internal?
4. **Read pattern guide:**
   - Public → WEBSITE_CONTEXT.md
   - Dashboard → DASHBOARD_ARCHITECTURE.md
5. **Reference components** - COMPONENTS_CATALOG.md
6. **Implement** - Follow the appropriate pattern strictly

---

## Summary

The Apex Template provides a **production-ready, dual-purpose React architecture** that supports both public-facing websites and internal dashboards using a clean, modular structure.

**Key Takeaways:**

- ✅ Always determine pattern first (website vs dashboard)
- ✅ Follow 4-layer architecture for clean separation
- ✅ Reuse shared components extensively
- ✅ Keep features modular and self-contained
- ✅ Use auto-discovery routing (never edit App.routes.jsx)
- ✅ Follow accessibility best practices

**Ready to build!** 🚀

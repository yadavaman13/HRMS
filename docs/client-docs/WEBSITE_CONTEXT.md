# Website Context: Building Marketing Sites & Public Web Apps

This document provides guidance for building **marketing websites, landing pages, and public-facing web applications** using the Apex Template. This is distinct from dashboard/admin applications.

---

## 1. When to Use Website Patterns (NOT Dashboard)

Use full-page website layouts when building:

### Public-Facing Applications

- **Travel planners** (like GlobeTrotter)
- **E-commerce storefronts**
- **Social platforms**
- **Booking systems**
- **Portfolio sites**
- **Community forums**

### Marketing & Content Sites

- **Landing pages** with hero sections
- **Product pages**
- **Company websites**
- **Blog platforms**
- **Documentation sites**

### Consumer Applications

- **Mobile-first web apps**
- **Progressive Web Apps (PWAs)**
- **Sharable public views**
- **Onboarding flows**

**⚠️ DO NOT use dashboard/sidebar layouts for these applications.**

---

## 2. Website Architecture Patterns

### A. Landing Page Layout

```
┌─────────────────────────────────────┐
│         Navigation Bar              │  <- Topbar only (no sidebar)
├─────────────────────────────────────┤
│                                     │
│         Hero Section                │  <- Full-width
│      (Headline + CTA)               │
│                                     │
├─────────────────────────────────────┤
│         Features Grid               │  <- Card-based layout
├─────────────────────────────────────┤
│         Testimonials                │
├─────────────────────────────────────┤
│         Footer                      │
└─────────────────────────────────────┘
```

### B. Public Web App Layout (e.g., GlobeTrotter)

```
┌─────────────────────────────────────┐
│    Header Nav (Logo + Menu)        │  <- Fixed header, no sidebar
├─────────────────────────────────────┤
│                                     │
│    Main Content Area                │  <- Full-width content
│    (Trip Cards, Forms, etc.)        │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### C. Multi-Page Website Structure

```
/
├── / (home/landing)
├── /about
├── /features
├── /pricing
├── /contact
├── /login
└── /signup
```

**Key Difference from Dashboard:**

- No persistent sidebar
- Top navigation only
- Full-width content areas
- Page-to-page navigation (not tabs)

---

## 3. Component Selection for Websites

### ✅ Use These Components for Websites

#### Navigation

- **`Topbar`** - Simplified for public navigation (Logo + Menu + Auth buttons)
- **Custom Header** - Build lightweight header with logo and menu

#### Layout

- **Full-width containers** - No dashboard grid
- **Card-based grids** - Use CSS Grid/Flexbox for feature sections
- **Hero sections** - Large visual areas with CTAs

#### Content Display

- **`StatCard`** - Repurpose for feature highlights
- **`MetricCard`** - Use for pricing tiers or stats
- **Card components** - Build custom cards for trips, products, posts

#### Forms

- **`InputField`**, **`Textarea`**, **`Dropdown`** - All form components work
- **`Button`** - Primary/secondary CTAs
- **`DatePicker`** - For booking/planning features

#### Feedback

- **`Modal`** (`Dialog`) - Confirmations, login modals
- **`Toast`** - Success/error notifications
- **`Alert`** - Banners and notices

#### Marketing-Specific

- Create hero sections with images/gradients
- Build feature cards with icons
- Testimonial sliders
- Pricing tables
- FAQ accordions

### ❌ DO NOT Use These for Public Websites

- **`Sidebar`** - Only for admin/dashboard views
- **`DashboardLayout`** - Admin-only pattern
- **`AdvancedTable`** - Use card grids instead
- **`KanbanBoard`** - Admin/internal tool only
- **`AdvancedScrollbar`** - Unnecessary for public sites

---

## 4. Routing for Websites vs Dashboards

### Website Routing Pattern

```jsx
// app/App.routes.jsx - Website structure

const routes = [
  {
    path: '/',
    element: <PublicLayout />, // Header + Outlet + Footer
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'features', element: <FeaturesPage /> },
      { path: 'pricing', element: <PricingPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
  {
    path: '/trips',
    element: <ProtectedLayout />, // Auth required, but NO sidebar
    children: [
      { index: true, element: <TripListPage /> },
      { path: 'new', element: <CreateTripPage /> },
      { path: ':id', element: <TripDetailPage /> },
      { path: ':id/edit', element: <EditTripPage /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
    ],
  },
];
```

### Dashboard Routing Pattern (Admin Only)

```jsx
// Only use this for actual admin/internal tools
const routes = [
  {
    path: '/admin',
    element: <DashboardLayout />, // Sidebar + Topbar
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'users', element: <UsersTable /> },
      { path: 'analytics', element: <AnalyticsPage /> },
    ],
  },
];
```

---

## 5. Styling Guidelines for Websites

### A. Use Full-Width Layouts

```scss
@use '@/styles/variables' as v;

.landing-page {
  width: 100%;
  min-height: 100vh;
}

.hero-section {
  width: 100%;
  padding: v.$spacing-8xl v.$spacing-xl;
  background: linear-gradient(135deg, v.$color-primary, v.$color-secondary);
}

.content-container {
  max-width: 1200px; // Center content, not dashboard grid
  margin: 0 auto;
  padding: 0 v.$spacing-lg;
}
```

### B. Card-Based Feature Grids

```scss
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: v.$spacing-xl;
  padding: v.$spacing-4xl 0;
}

.feature-card {
  background: v.$color-surface;
  border: 1px solid v.$color-border;
  border-radius: v.$radius-large;
  padding: v.$spacing-xl;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: v.$shadow-large;
  }
}
```

### C. Responsive Typography

```scss
.hero-title {
  font-size: v.$font-size-5xl;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: v.$spacing-lg;

  @include v.mobile {
    font-size: v.$font-size-3xl;
  }
}

.hero-subtitle {
  font-size: v.$font-size-xl;
  color: v.$color-text-secondary;
  max-width: 600px;
}
```

---

## 6. Example: GlobeTrotter Website Structure

### Pages & Their Purposes

```
/                           → Landing page (Hero + Features + CTA)
/login                      → Authentication (HeroPanel + LoginForm)
/signup                     → Registration (HeroPanel + SignupForm)

/dashboard                  → User's trip dashboard (NO SIDEBAR)
                             Shows trip cards, "Create New Trip" button

/trips/new                  → Create trip form (Full-width, step-by-step)
/trips/:id                  → View single trip (Timeline/itinerary view)
/trips/:id/edit             → Edit trip details
/trips/:id/public           → Public sharable trip view (no auth)

/profile                    → User profile settings
```

### Component Usage

- **Landing page:** Custom hero + feature cards + footer
- **Trip list:** Grid of trip cards (NOT DataTable)
- **Trip detail:** Custom timeline layout (NOT KanbanBoard)
- **Trip form:** Multi-step form with InputField components

---

## 7. Common Anti-Patterns to Avoid

### ❌ Wrong: Using Dashboard Layout for Public App

```jsx
// DON'T DO THIS
<DashboardLayout>
  {' '}
  {/* Has sidebar - wrong for public app */}
  <TripListPage />
</DashboardLayout>
```

### ✅ Right: Full-Width Public Layout

```jsx
// DO THIS
<PublicLayout>
  {' '}
  {/* Header + Footer only */}
  <TripListPage />
</PublicLayout>
```

### ❌ Wrong: DataTable for Trip Cards

```jsx
// DON'T DO THIS - Tables are for admin views
<AdvancedTable data={trips} columns={tripColumns} />
```

### ✅ Right: Card Grid for Trips

```jsx
// DO THIS - Cards are for public content
<div className="trip-grid">
  {trips.map((trip) => (
    <TripCard key={trip.id} trip={trip} />
  ))}
</div>
```

---

## 8. Layout Component Guide

### Create `PublicLayout.jsx` for Websites

```jsx
// src/app/layouts/PublicLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

```scss
// PublicLayout.scss
.public-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  width: 100%;
}
```

### Create Simple `Header.jsx`

```jsx
// src/app/layouts/Header.jsx
import { Link } from 'react-router-dom';
import Button from '@/components/Shared/Buttons/Button/Button';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src="/logo.svg" alt="Logo" />
        </Link>

        <nav className="main-nav">
          <Link to="/features">Features</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/about">About</Link>
        </nav>

        <div className="header-actions">
          <Button variant="secondary" to="/login">
            Login
          </Button>
          <Button variant="primary" to="/signup">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
```

---

## 9. Performance & SEO for Public Sites

### Meta Tags & SEO

```jsx
// Use react-helmet-async for meta tags
import { Helmet } from 'react-helmet-async';

export default function LandingPage() {
  return (
    <>
      <Helmet>
        <title>GlobeTrotter - Plan Your Perfect Trip</title>
        <meta name="description" content="Create personalized travel itineraries..." />
        <meta property="og:title" content="GlobeTrotter" />
        <meta property="og:image" content="/og-image.jpg" />
      </Helmet>

      <div className="landing-page">{/* Content */}</div>
    </>
  );
}
```

### Image Optimization

- Use lazy loading: `<img loading="lazy" />`
- Optimize hero images (WebP format)
- Use responsive images with `srcset`

### Code Splitting

```jsx
// Lazy load pages
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
```

---

## 10. Checklist for Building Public Web Apps

Before building any public-facing application, confirm:

- [ ] **No persistent sidebar** - Only header navigation
- [ ] **Full-width layouts** - Not constrained dashboard grids
- [ ] **Card-based content** - Not data tables
- [ ] **Public routes** - Landing, features, pricing pages
- [ ] **Sharable URLs** - Public trip views, profiles
- [ ] **Mobile-first** - Responsive design priority
- [ ] **SEO optimized** - Meta tags, semantic HTML
- [ ] **Fast loading** - Lazy loading, optimized images
- [ ] **Clear CTAs** - Primary actions visible
- [ ] **Hero sections** - Compelling visual entry points

---

## 11. Real-World Examples

### Travel Planner (GlobeTrotter)

- Landing page with hero + features
- Trip cards in responsive grid
- Full-width trip builder form
- Public sharable trip pages
- NO dashboard sidebar

### E-Commerce Site

- Product landing page
- Product grid with filters
- Product detail pages
- Cart and checkout flows
- NO admin dashboard for customers

### SaaS Landing

- Hero with pricing tiers
- Feature comparison table
- Customer testimonials
- Free trial signup form
- Dashboard only AFTER login (for actual app)

---

## 12. Key Takeaway

**The Apex Template components are NOT dashboard-only.**

They are **design system primitives** that work for:

- ✅ Marketing websites
- ✅ Landing pages
- ✅ Public web applications
- ✅ Admin dashboards
- ✅ Internal tools

**Your job as an AI agent:** Identify what type of application is being built, then choose the appropriate layout pattern and component composition.

**When in doubt:** Ask the user: "Is this a public-facing website or an internal admin dashboard?"

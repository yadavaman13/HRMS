# AI Decision Tree: Dashboard vs Website

**Purpose:** Help AI agents determine the correct layout pattern before building.

---

## 🎯 Quick Decision Flowchart

```
User Request
     ↓
Is it public-facing?
     ↓
    YES → Is the primary user anonymous/public?
     ↓         ↓
    YES       NO → Requires login for all features?
     ↓              ↓
 WEBSITE          YES → Is it data management/admin?
                   ↓         ↓
                  YES       NO
                   ↓         ↓
               DASHBOARD  WEBSITE
```

---

## 📋 Decision Matrix

### Use **WEBSITE** Pattern When:

| Indicator                      | Examples                                      |
| ------------------------------ | --------------------------------------------- |
| **Primary audience is public** | Landing pages, marketing sites, portfolios    |
| **Content-first experience**   | Blogs, documentation, company sites           |
| **E-commerce/booking**         | Product catalogs, trip planning, reservations |
| **Social/community**           | Forums, profiles, sharing features            |
| **Marketing goals**            | Lead generation, conversions, signups         |
| **Mobile-first priority**      | Consumer apps, PWAs                           |
| **SEO important**              | Need to rank in search engines                |
| **Sharable URLs**              | Public trip pages, product pages, articles    |

### Use **DASHBOARD** Pattern When:

| Indicator                  | Examples                                    |
| -------------------------- | ------------------------------------------- |
| **Internal tools**         | Admin panels, CRM systems, management tools |
| **Data-heavy operations**  | Analytics, reports, user management         |
| **Complex workflows**      | Multi-step processes, task management       |
| **Power users**            | Users need quick access to many tools       |
| **Private/authenticated**  | No public access, login required            |
| **CRUD operations**        | Heavy data creation/editing                 |
| **Multiple tool sections** | Sidebar navigation makes sense              |

---

## 🔍 Analysis Questions to Ask

### Step 1: Identify the User Type

- **Who is the primary user?**
  - Anonymous visitors → WEBSITE
  - Registered consumers → WEBSITE (authenticated)
  - Admin/staff/power users → DASHBOARD

### Step 2: Identify the Use Case

- **What is the main goal?**
  - Browse/discover/learn → WEBSITE
  - Buy/book/plan → WEBSITE
  - Manage/analyze/administrate → DASHBOARD

### Step 3: Check Navigation Needs

- **How many sections?**
  - 3-7 pages (Home, About, Features, etc.) → WEBSITE (top nav)
  - 8+ sections with frequent switching → DASHBOARD (sidebar)

### Step 4: Check Content Type

- **What's being displayed?**
  - Marketing content, images, text → WEBSITE
  - Data tables, forms, charts → DASHBOARD
  - Mix of both → WEBSITE for public, DASHBOARD for admin

---

## 🎨 Real-World Scenario Examples

### ✅ WEBSITE Examples

#### Scenario 1: Travel Planning App (GlobeTrotter)

```
User request: "Build a travel planning app where users can create trips"

Analysis:
- Primary users: Public travelers (consumers)
- Goal: Browse destinations, plan trips, share itineraries
- Navigation: Home, Features, Pricing, My Trips, Login
- Content: Trip cards, forms, timelines

Decision: WEBSITE ✓
Pattern: Public landing + authenticated trip management
Layout: Header navigation, no sidebar
```

#### Scenario 2: E-Commerce Store

```
User request: "Build an online store for selling products"

Analysis:
- Primary users: Shoppers (public + registered)
- Goal: Browse products, add to cart, checkout
- Navigation: Home, Products, About, Cart, Account
- Content: Product grids, detail pages, cart

Decision: WEBSITE ✓
Pattern: Public storefront + user account area
Layout: Top nav, full-width content
```

#### Scenario 3: SaaS Landing Page

```
User request: "Create a landing page for our SaaS product"

Analysis:
- Primary users: Potential customers (anonymous)
- Goal: Learn about product, see pricing, sign up
- Navigation: Home, Features, Pricing, Contact
- Content: Hero, features, testimonials, CTAs

Decision: WEBSITE ✓
Pattern: Marketing site
Layout: Top nav, hero sections
```

### ✅ DASHBOARD Examples

#### Scenario 4: CRM System

```
User request: "Build a CRM for managing customer relationships"

Analysis:
- Primary users: Sales team (internal staff)
- Goal: Manage leads, track deals, view reports
- Navigation: Dashboard, Leads, Contacts, Deals, Reports, Settings
- Content: Data tables, forms, analytics charts

Decision: DASHBOARD ✓
Pattern: Admin tool
Layout: Sidebar + topbar, data tables
```

#### Scenario 5: Content Management System

```
User request: "Create a CMS for blog administrators"

Analysis:
- Primary users: Content editors (internal)
- Goal: Write posts, manage media, moderate comments
- Navigation: Posts, Pages, Media, Comments, Users, Settings
- Content: Forms, tables, rich text editors

Decision: DASHBOARD ✓
Pattern: Admin panel
Layout: Sidebar navigation, CRUD operations
```

### 🔀 HYBRID Examples (Both Patterns)

#### Scenario 6: Social Platform

```
User request: "Build a social network"

Analysis:
- Public side: Landing, explore, profiles → WEBSITE
- User side: Feed, messages, settings → WEBSITE (authenticated, no sidebar)
- Admin side: User management, moderation → DASHBOARD

Decision: HYBRID ✓
Pattern:
  - Public pages: WEBSITE layout
  - User area: WEBSITE layout (authenticated)
  - Admin panel: DASHBOARD layout
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Mistake 1: Dashboard for Everything

```
User: "Build GlobeTrotter travel app"
AI: *Creates sidebar with Dashboard, Analytics, Settings*

Problem: Travelers don't need a dashboard sidebar
Fix: Use top nav + full-width trip cards
```

### ❌ Mistake 2: Website for Admin Tools

```
User: "Build a CRM to manage 10,000 customer records"
AI: *Creates marketing-style card grid*

Problem: Cards don't scale for data management
Fix: Use dashboard with data tables and filters
```

### ❌ Mistake 3: Assuming Dashboard = React App

```
User: "Build a web app"
AI: *Defaults to dashboard layout*

Problem: "Web app" doesn't mean "dashboard"
Fix: Ask: "Is this for public users or internal admin?"
```

---

## 🎓 Pattern Recognition Training

### Keywords That Suggest WEBSITE:

- Landing page
- Marketing site
- Storefront
- Public-facing
- Consumer app
- Portfolio
- Blog
- E-commerce
- Booking system
- Social platform (public side)
- Campaign page
- Lead generation

### Keywords That Suggest DASHBOARD:

- Admin panel
- CRM
- Management system
- Internal tool
- Analytics platform
- Back office
- Control panel
- Data management
- Power user tool
- CRUD application
- Staff portal

### Ambiguous Keywords (Need Clarification):

- "Web app" → Ask who the users are
- "Platform" → Ask if public or internal
- "Portal" → Ask user vs admin portal
- "System" → Ask management system vs public system

---

## 💬 When to Ask the User

If you're uncertain, ask directly:

### Template Questions:

**Option 1: Direct Question**

```
"Is this application primarily for:
A) Public users (consumers/visitors), or
B) Internal users (admin/staff/power users)?"
```

**Option 2: Use Case Question**

```
"Will the main users be:
A) Browsing, shopping, or consuming content, or
B) Managing data, analyzing metrics, or performing admin tasks?"
```

**Option 3: Layout Question**

```
"Should this have:
A) A marketing website feel (top navigation, landing page), or
B) An admin dashboard feel (sidebar navigation, data tables)?"
```

---

## 📝 Decision Template

Use this template before starting any project:

```markdown
## Project Analysis

**User Request:** [Copy user's request]

**Primary Users:** [Public / Registered Consumers / Internal Staff]

**Main Goal:** [What users want to accomplish]

**Key Pages:** [List expected pages/sections]

**Content Type:** [Marketing / Data / Mixed]

**Navigation Needs:** [Simple top nav / Complex sidebar nav]

**DECISION:** [WEBSITE / DASHBOARD / HYBRID]

**Layout Pattern:**

- Public routes: [Layout choice]
- Authenticated routes: [Layout choice]
- Admin routes: [Layout choice]

**Rationale:** [Why this decision was made]
```

---

## ✅ Final Checklist

Before writing any code, confirm:

- [ ] I understand who the primary users are
- [ ] I know if the content is public or private
- [ ] I've identified the main use case (browse vs manage)
- [ ] I've chosen the appropriate layout pattern
- [ ] I've confirmed with user if uncertain
- [ ] I'm using the right components for the pattern

---

## 🎯 Remember

**Default Assumption = WRONG**

Don't assume:

- ❌ "Web app" = Dashboard
- ❌ "React app" = Dashboard
- ❌ "Platform" = Dashboard
- ❌ "System" = Dashboard

**Always analyze the use case first.**

When in doubt, **ask the user** rather than defaulting to dashboard layout.

**The template supports both patterns equally well.** Your job is to pick the right one for the project.

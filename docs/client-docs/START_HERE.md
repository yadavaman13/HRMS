# ⚠️ CRITICAL: Read This Before Building Anything

**For AI Agents Working on Apex Template Frontend Projects**

---

## 🚨 The #1 Mistake That Causes Hackathon Failures

**Problem:** AI agents default to building **dashboard layouts** (sidebar + admin panel) for **public-facing websites and consumer apps**.

**Result:** Travel planners, e-commerce sites, and marketing pages end up looking like CRM admin panels.

**Why it happens:** The original context files were written for Odoo CRM dashboards and never updated for general-purpose use.

---

## ✅ Your First Step (MANDATORY)

**Before writing ANY code, answer this question:**

### "Is this a PUBLIC website or an INTERNAL dashboard?"

#### Choose: **PUBLIC WEBSITE** if:

- Marketing/landing pages
- E-commerce stores
- Travel planners (like GlobeTrotter)
- Social platforms (public side)
- Portfolio sites
- Booking systems
- Consumer web apps

**→ Read `WEBSITE_CONTEXT.md`**

#### Choose: **INTERNAL DASHBOARD** if:

- CRM systems
- Admin panels
- Analytics dashboards
- Data management tools
- Staff/internal tools

**→ Read `ARCHITECTURE.md` (dashboard sections)**

### Not sure? ASK THE USER!

```
"Is this application for:
A) Public users (website/consumer app), or
B) Internal staff (admin/dashboard)?"
```

---

## 📋 Quick Pattern Guide

### PUBLIC WEBSITE Pattern

```
✅ Top navigation bar only (NO SIDEBAR)
✅ Full-width hero sections
✅ Card-based layouts for content
✅ Landing page with features/pricing
✅ Public routes (no auth required for main pages)

❌ NO sidebar navigation
❌ NO dashboard layout
❌ NO data tables for main content
❌ NO admin-style UI
```

### INTERNAL DASHBOARD Pattern

```
✅ Sidebar + topbar navigation
✅ Data tables for records
✅ KPI cards and analytics widgets
✅ Form-heavy CRUD operations
✅ Auth required for all routes

❌ NO hero sections
❌ NO marketing content
❌ NO public landing pages
```

---

## 🎯 Real Example: GlobeTrotter

**User Request:** "Build a travel planning app"

### ❌ WRONG Approach

```jsx
// DON'T DO THIS
<DashboardLayout>
  {/* Sidebar navigation */}
  <Sidebar>
    <NavItem>Dashboard</NavItem>
    <NavItem>Analytics</NavItem>
    <NavItem>Settings</NavItem>
  </Sidebar>
  <AdvancedTable data={trips} /> {/* Data table */}
</DashboardLayout>
```

**Problem:** Travelers don't need admin dashboards!

### ✅ CORRECT Approach

```jsx
// DO THIS
<PublicLayout>
  {/* Top nav only */}
  <Header>
    <Logo />
    <Nav>
      <Link to="/">Home</Link>
      <Link to="/features">Features</Link>
    </Nav>
  </Header>

  <main>
    <HeroSection>
      <h1>Plan Your Perfect Trip</h1>
      <Button>Get Started</Button>
    </HeroSection>

    <div className="trip-grid">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  </main>
</PublicLayout>
```

**Result:** Clean, public-facing travel app ✓

---

## 📖 Required Reading Order

1. **This file** (you're here) ← Start here
2. **`AI_DECISION_TREE.md`** ← Decision framework
3. **`WEBSITE_CONTEXT.md`** OR **`ARCHITECTURE.md`** ← Pattern guide
4. **`COMPONENTS_CATALOG.md`** ← Available components
5. **`FRONTEND_AGENT_PLAYBOOK.md`** ← Development workflow

---

## 🔴 Red Flags (Stop and Reconsider)

If you catch yourself doing any of these, **STOP**:

- [ ] Adding `<Sidebar>` to a consumer app
- [ ] Using `DashboardLayout` for a public website
- [ ] Creating admin-style navigation for shoppers/travelers
- [ ] Using data tables to display public content (trips, products, posts)
- [ ] Assuming "web app" means "dashboard"
- [ ] Building before reading `AI_DECISION_TREE.md`

---

## ✅ Success Criteria

Your implementation is correct if:

- [ ] Layout matches user expectations (public vs admin)
- [ ] Navigation style fits the audience
- [ ] Components match the content type
- [ ] User can accomplish their goal intuitively
- [ ] No sidebar on public-facing pages (unless it's actually an admin tool)

---

## 🆘 Quick Help

### "User said 'build a web app' - which pattern?"

→ **ASK THEM.** "Web app" is ambiguous.

### "It has both public and admin sections?"

→ **HYBRID.** Public pages use website pattern, admin uses dashboard.

### "They want a 'platform' - which pattern?"

→ **ASK.** Platform for consumers (website) or internal staff (dashboard)?

### "I'm still not sure..."

→ **Read `AI_DECISION_TREE.md` - Section 2: Decision Matrix**

---

## 💡 Remember

**The Apex Template is NOT dashboard-only.**

It's a **full-stack boilerplate** that supports:

- ✅ Marketing websites
- ✅ E-commerce stores
- ✅ Consumer apps
- ✅ Social platforms
- ✅ Admin dashboards
- ✅ Internal tools

**Your job:** Pick the right pattern for the right use case.

---

## 🎓 Final Checklist

Before writing code:

- [ ] I determined: PUBLIC website or INTERNAL dashboard
- [ ] I read the appropriate context guide
- [ ] I chose the correct layout pattern
- [ ] I selected appropriate components
- [ ] I asked clarifying questions if uncertain

---

**Now proceed to `AI_DECISION_TREE.md` for detailed decision framework.**

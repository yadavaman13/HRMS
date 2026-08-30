# Client Documentation Index

**Comprehensive documentation for frontend development in the Apex Template**

---

## 🚀 Quick Start

### For AI Agents Starting a New Project

1. **READ FIRST:** `START_HERE.md` - Critical context about dashboard vs website patterns
2. **DECIDE:** Use `AI_DECISION_TREE.md` to determine the correct pattern
3. **BUILD:** Follow the appropriate guide:
   - **Public Websites:** `WEBSITE_CONTEXT.md` + `PUBLIC_LAYOUT_PATTERNS.md`
   - **Admin Dashboards:** `ARCHITECTURE.md`
4. **REFERENCE:** Use `COMPONENTS_CATALOG.md` for available components

---

## 📚 Documentation Files

### Critical Entry Points

| File                    | Purpose                                  | When to Read          |
| ----------------------- | ---------------------------------------- | --------------------- |
| **START_HERE.md**       | Critical warning about dashboard bias    | **ALWAYS READ FIRST** |
| **AI_DECISION_TREE.md** | Decision framework for pattern selection | Before any project    |

### Pattern-Specific Guides

| File                          | Purpose                                       | Pattern         |
| ----------------------------- | --------------------------------------------- | --------------- |
| **ARCHITECTURE.md**           | Complete frontend architecture overview       | Both patterns   |
| **WEBSITE_CONTEXT.md**        | Complete guide for building public websites   | Public websites |
| **PUBLIC_LAYOUT_PATTERNS.md** | Code examples for website layouts             | Public websites |
| **DASHBOARD_ARCHITECTURE.md** | Deep dive into dashboard 4-layer architecture | Dashboards      |

### Component Reference

| File                      | Purpose                                      |
| ------------------------- | -------------------------------------------- |
| **COMPONENTS_CATALOG.md** | Complete list of available shared components |
| **DESIGN_SYSTEM_SCSS.md** | SCSS design system documentation             |
| **ValidationGuide.md**    | Form validation patterns                     |
| **ChartsGuide.md**        | Data visualization with ECharts              |

### Development Workflows

| File                             | Purpose                            |
| -------------------------------- | ---------------------------------- |
| **FRONTEND_AGENT_PLAYBOOK.md**   | AI agent development workflow      |
| **FEATURE_DEVELOPMENT_GUIDE.md** | Feature development best practices |
| **MockingDirectory.md**          | Mock data and testing patterns     |

### Project-Specific Guides

| File                               | Purpose                                   |
| ---------------------------------- | ----------------------------------------- |
| **GLOBETROTTER_IMPLEMENTATION.md** | Complete GlobeTrotter implementation spec |

---

## 🎯 Common Scenarios

### Scenario 1: Building a Marketing Website

```
1. Read: START_HERE.md
2. Confirm: This is a PUBLIC WEBSITE
3. Read: WEBSITE_CONTEXT.md
4. Reference: PUBLIC_LAYOUT_PATTERNS.md
5. Use: Components from COMPONENTS_CATALOG.md
```

**Key Points:**

- ✅ Use top navigation only (NO SIDEBAR)
- ✅ Full-width hero sections
- ✅ Card-based layouts
- ✅ PublicLayout component

### Scenario 2: Building a Travel Planning App (GlobeTrotter)

```
1. Read: START_HERE.md
2. Confirm: This is a PUBLIC WEB APP
3. Read: GLOBETROTTER_IMPLEMENTATION.md
4. Reference: WEBSITE_CONTEXT.md
5. Reference: PUBLIC_LAYOUT_PATTERNS.md
```

**Key Points:**

- ✅ Public website pattern (not dashboard)
- ✅ Trip cards in grid layout
- ✅ Full-width forms and timelines
- ✅ Share functionality

### Scenario 3: Building an Admin Dashboard

```
1. Read: START_HERE.md
2. Confirm: This is an INTERNAL DASHBOARD
3. Read: ARCHITECTURE.md
4. Reference: COMPONENTS_CATALOG.md (use AdvancedTable, Sidebar)
```

**Key Points:**

- ✅ Sidebar + topbar navigation
- ✅ Data tables for records
- ✅ KPI cards and analytics
- ✅ DashboardLayout component

### Scenario 4: Building an E-Commerce Site

```
1. Read: START_HERE.md
2. Confirm: This is a PUBLIC WEBSITE
3. Read: WEBSITE_CONTEXT.md
4. Adapt patterns for product grids
5. Reference: PUBLIC_LAYOUT_PATTERNS.md
```

**Key Points:**

- ✅ Product grids (not data tables)
- ✅ Top navigation with cart
- ✅ Full-width product pages
- ✅ PublicLayout component

---

## 🔍 Decision Tree

```
New Project Request
       ↓
Is it PUBLIC or INTERNAL?
       ↓
   ┌───┴────┐
   ↓        ↓
PUBLIC   INTERNAL
   ↓        ↓
WEBSITE  DASHBOARD
   ↓        ↓
Read:    Read:
• WEBSITE_CONTEXT.md    • ARCHITECTURE.md
• PUBLIC_LAYOUT_PATTERNS.md
```

---

## 📖 Reading Order by Role

### For AI Agents (LLM)

**Every Project:**

1. START_HERE.md
2. AI_DECISION_TREE.md
3. [Pattern-specific guide]

**Public Website Projects:**

1. START_HERE.md _(required)_
2. AI_DECISION_TREE.md _(required)_
3. WEBSITE_CONTEXT.md _(required)_
4. PUBLIC_LAYOUT_PATTERNS.md _(reference)_
5. COMPONENTS_CATALOG.md _(reference)_
6. GLOBETROTTER_IMPLEMENTATION.md _(if building travel app)_

**Dashboard Projects:**

1. START_HERE.md _(required)_
2. AI_DECISION_TREE.md _(required)_
3. ARCHITECTURE.md _(overview)_
4. DASHBOARD_ARCHITECTURE.md _(detailed)_
5. COMPONENTS_CATALOG.md _(reference)_

### For Human Developers

**Getting Started:**

1. ARCHITECTURE.md - Understand the system
2. COMPONENTS_CATALOG.md - Know what's available
3. FEATURE_DEVELOPMENT_GUIDE.md - Development workflow

**Building Features:**

1. Identify pattern (website vs dashboard)
2. Read appropriate context guide
3. Reference component catalog
4. Follow development guide

---

## 🎨 Component Selection Guide

### For Public Websites (Use These)

| Component                      | Purpose                          |
| ------------------------------ | -------------------------------- |
| PublicLayout                   | Base layout with header + footer |
| Header                         | Top navigation                   |
| Footer                         | Site footer                      |
| Button                         | CTAs and actions                 |
| InputField, Textarea, Dropdown | Forms                            |
| Modal                          | Confirmations, login             |
| Toast                          | Notifications                    |
| Card components                | Content display                  |

### For Dashboards (Use These)

| Component            | Purpose                 |
| -------------------- | ----------------------- |
| DashboardLayout      | Sidebar + topbar layout |
| Sidebar              | Main navigation         |
| Topbar               | User actions            |
| AdvancedTable        | Data tables             |
| StatCard, MetricCard | KPIs                    |
| KanbanBoard          | Task management         |
| Charts               | Analytics visualization |

### Universal (Use in Both)

| Component  | Purpose       |
| ---------- | ------------- |
| Button     | Actions       |
| InputField | Form inputs   |
| Dropdown   | Selections    |
| Modal      | Dialogs       |
| Toast      | Notifications |
| Alert      | Banners       |

---

## ⚠️ Common Mistakes

### ❌ Wrong: Dashboard for Public App

```jsx
// DON'T DO THIS for travel planners, e-commerce, etc.
<DashboardLayout>
  <Sidebar>...</Sidebar>
  <AdvancedTable data={trips} />
</DashboardLayout>
```

### ✅ Right: Website Layout for Public App

```jsx
// DO THIS for public-facing apps
<PublicLayout>
  <Header />
  <main>
    <div className="trips-grid">
      {trips.map((trip) => (
        <TripCard trip={trip} />
      ))}
    </div>
  </main>
  <Footer />
</PublicLayout>
```

---

## 🔧 Quick Reference

### File Locations

```
docs/client-docs/
├── START_HERE.md                    # ⚠️ READ FIRST
├── README.md                        # This file - documentation index
├── AI_DECISION_TREE.md              # Decision framework
│
├── ARCHITECTURE.md                  # Complete frontend architecture (NEW)
├── WEBSITE_CONTEXT.md               # Public website guide
├── PUBLIC_LAYOUT_PATTERNS.md        # Website code examples
├── DASHBOARD_ARCHITECTURE.md        # Dashboard 4-layer deep dive
├── GLOBETROTTER_IMPLEMENTATION.md   # GlobeTrotter spec
│
├── COMPONENTS_CATALOG.md            # Component reference
├── DESIGN_SYSTEM_SCSS.md            # SCSS guidelines
├── FEATURE_DEVELOPMENT_GUIDE.md     # Development workflow
├── FRONTEND_AGENT_PLAYBOOK.md       # AI agent workflow
├── ValidationGuide.md               # Form validation
├── ChartsGuide.md                   # Data visualization
└── MockingDirectory.md              # Testing patterns
```

### Component Locations

```
client/src/components/
├── Layouts/              # Layout components
│   ├── PublicLayout.jsx      # For public websites
│   ├── DashboardLayout.jsx   # For admin dashboards
│   ├── Header.jsx            # Top navigation
│   ├── Footer.jsx            # Site footer
│   ├── Sidebar.jsx           # Dashboard sidebar
│   └── Topbar.jsx            # Dashboard topbar
│
├── Shared/               # Reusable components
│   ├── Buttons/
│   ├── Inputs/
│   ├── Cards/
│   ├── Modals/
│   ├── Tables/
│   └── Charts/
│
└── [Feature]/            # Feature-specific components
    └── GlobeTrotter/
```

---

## 🚦 Status Indicators

| Symbol | Meaning                |
| ------ | ---------------------- |
| ⚠️     | Critical - Must read   |
| ✅     | Correct approach       |
| ❌     | Wrong approach - avoid |
| 📖     | Reference document     |
| 🎯     | Decision point         |

---

## 📞 Getting Help

### When Uncertain

1. **Re-read START_HERE.md** - Most confusion comes from pattern mismatch
2. **Check AI_DECISION_TREE.md** - Use the decision framework
3. **Ask the user** - "Is this for public users or internal admin?"

### Common Questions

**Q: User said "build a web app" - which pattern?**  
A: ASK! "Web app" is ambiguous. Use AI_DECISION_TREE.md questions.

**Q: Should I use a sidebar for a travel planner?**  
A: NO! Travel planners are public websites. Use top navigation only.

**Q: Can I use AdvancedTable for displaying trips?**  
A: NO! For public content, use card grids. Tables are for admin views.

**Q: When should I use DashboardLayout?**  
A: Only for actual admin/internal tools, NOT for public websites.

---

## 🎯 Success Checklist

Before starting implementation:

- [ ] Read START_HERE.md
- [ ] Determined: PUBLIC WEBSITE or INTERNAL DASHBOARD
- [ ] Read appropriate pattern guide
- [ ] Reviewed available components
- [ ] Confirmed understanding with user if uncertain
- [ ] Chose correct layout component
- [ ] Selected appropriate display components (cards vs tables)

---

## 📊 Documentation Stats

- **Total Files:** 13
- **Critical Entry Points:** 2 (START_HERE.md, AI_DECISION_TREE.md)
- **Pattern Guides:** 3 (WEBSITE_CONTEXT.md, PUBLIC_LAYOUT_PATTERNS.md, ARCHITECTURE.md)
- **Reference Docs:** 5 (Components, Design System, Validation, Charts, Mocking)
- **Workflow Guides:** 2 (Agent Playbook, Feature Development)
- **Implementation Specs:** 1 (GlobeTrotter)

---

## 🔄 Documentation Updates

**Last Updated:** 2026-08-28

**Recent Changes:**

- Added START_HERE.md critical entry point
- Added AI_DECISION_TREE.md decision framework
- Added WEBSITE_CONTEXT.md for public websites
- Added PUBLIC_LAYOUT_PATTERNS.md with code examples
- Added GLOBETROTTER_IMPLEMENTATION.md complete spec
- Updated this index with clear navigation paths

**Purpose of Updates:**

- Fix dashboard bias problem in AI agents
- Provide clear guidance for public website development
- Enable successful hackathon implementations

---

## 🎓 Learning Path

### Day 1: Understand the System

1. Read ARCHITECTURE.md
2. Browse COMPONENTS_CATALOG.md
3. Understand design system basics

### Day 2: Learn Patterns

1. Read START_HERE.md
2. Study AI_DECISION_TREE.md
3. Review WEBSITE_CONTEXT.md and PUBLIC_LAYOUT_PATTERNS.md

### Day 3: Build Something

1. Choose a simple feature
2. Follow FEATURE_DEVELOPMENT_GUIDE.md
3. Reference component catalog as needed

### Day 4+: Master Advanced Features

1. Deep dive into specific components
2. Learn validation patterns
3. Implement data visualization
4. Build complete features

---

**Ready to build? Start with START_HERE.md! 🚀**

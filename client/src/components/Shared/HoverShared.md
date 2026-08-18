# HoverShared.md — Shared Components Architecture & Quick-Reference Index

This document acts as an AI agent and developer directory map for all reusable components inside `src/components/Shared/`. AI agents MUST review this guide before scanning or modifying shared components to quickly locate existing primitives, component paths, styling, and recent updates.

---

## 1. Directory Architecture

The `src/components/Shared/` directory contains all global, reusable UI components for the application:

```
src/components/Shared/
├── HoverShared.md                          <-- THIS FILE (AI Agent Index & Map)
│
├── AnalyticsLineChartCard/                 <-- Reusable analytics line chart card
│   ├── AnalyticsLineChartCard.jsx
│   ├── AnalyticsLineChartCard.scss
│   └── components/
│       ├── AnalyticsCardHeader.jsx
│       ├── AnalyticsCardValue.jsx
│       └── AnalyticsLineChart.jsx
│
├── Buttons/                                <-- Reusable button primitives
│   ├── AIAssistantButton/                  (AI trigger action button)
│   ├── Button/                             (Standard primary/secondary button)
│   ├── CancelButton/                       (Reusable secondary cancel button)
│   ├── DeleteButton/                       (Destructive action button)
│   ├── EditButton/                         (Edit trigger button)
│   ├── IconButton/                         (Icon-only action button)
│   ├── NextButton/                         (Pagination/wizard forward trigger)
│   ├── PrevButton/                         (Pagination/wizard backward trigger)
│   ├── SaveDetailsButton/                  (Primary save/confirm/proceed button)
│   ├── ToggleButton/                       (Controlled on/off toggle switch)
│   └── ViewToggle/                         (Segmented Table | Grid view-mode switcher)
│
├── DataDisplay/                            <-- Data presentation & UI widgets
│   ├── ActivitiesFeed/                     (Activity feed list container)
│   │   ├── ActivitiesFeedCard.jsx
│   │   ├── ActivitiesFeedCard.scss
│   │   ├── ActivityDetailCard/
│   │   └── ActivityFeedItem/
│   ├── AdvancedScrollbar/                  (Custom scrollbars with number tooltips)
│   ├── AdvancedTable/                      (Complex data table with sorting/filtering)
│   ├── Badge/                              (Status pills & count badges)
│   ├── Card/                               (Generic card layout wrapper)
│   ├── Carousel/                           (Embla-based item slider)
│   ├── Collapsible/                        (Controlled collapsible containers)
├── CircularAvatar/                     (User avatar circle display)
│   ├── DataTable/                          (Standard structured data grid)
│   ├── DataView/                           (Table/Grid view switcher wrapper)
│   │   ├── DataView.jsx
│   │   ├── DataView.scss
│   │   └── components/
│   │       ├── GridView/                   (Responsive card grid renderer)
│   │       │   ├── GridView.jsx
│   │       │   ├── GridView.scss
│   │       │   └── components/
│   │       │       └── GridCard/           (Individual data card)
│   │       │           ├── GridCard.jsx
│   │       │           └── GridCard.scss
│   ├── EmptyStateCard/                     (Generic fallback display component)
│   ├── FilterTable/                        (Table with integrated filter bar)
│   ├── FormHeader/                         (Form title & subtitle header)
│   ├── KanbanBoard/                        (Interactive drag-and-drop task status board)
│   ├── KpiLineChartCard/                   (Dedicated metric trend chart with KPI details)
│   ├── Logo/                               (Application branding logo)
│   ├── MetricCard/                         (Standalone numerical metric display card)
│   ├── ProgressBar/                        (Linear percentage progress bar)
│   ├── StatCard/                           (KPI metric summary card)
│   ├── StepProgress/                       (Multi-step progress/wizard indicator)
│   ├── Timeline/                           (Activity/event timeline stream)
│   ├── Tooltip/                            (Contextual popover tooltip)
│   ├── TreeView/                           (Nested hierarchical directory tree)
│   ├── VerticalBadge/                      (Vertical status indicator badge)
│   └── assets/                             (Display assets and SVG icons)
│
├── ErrorPages/                             <-- Full-page system error views
│   ├── ForbiddenPage/                      (403 Access Denied view)
│   ├── NotFoundPage/                       (404 Not Found view)
│   └── ServerErrorPage/                    (500 Internal Error view)
│
├── Feedback/                               <-- Modals, dialogs, and toast notifications
│   ├── Alert/                              (Inline status alerts)
│   ├── DeleteToast/                        (Delete confirmation toast)
│   ├── Dialog/                             (Modal dialog popups)
│   ├── Popover/                            (Trigger popover containers)
│   ├── Spinner/                            (Loading indicators)
│   └── Toast/                              (System notification toast)
│
├── Form/                                   <-- Form controls & input fields
│   ├── Calendar/                           (Calendar view & date picker widget)
│   ├── Checkbox/                           (Custom styled checkbox control)
│   ├── Command/                            (Input search lists)
│   ├── DatePicker/                         (Standalone date input picker with calendar popover)
│   ├── DateTimePicker/                     (Date and time selector)
│   ├── Dropdown/                           (Custom select dropdown)
│   ├── DropdownMenu/                       (Action context menus)
│   ├── InputField/                         (Text/password input field with toggle)
│   ├── InputGroup/                         (Grouped inputs with action buttons)
│   ├── SearchBar/                          (Search input with quick clear)
│   ├── Textarea/                           (Multi-line text input with char count & auto-resize)
│   └── Upload/                             (Drag-and-drop file upload zone)
│
├── HeroPanel/                              <-- Shared hero branding panel
│   ├── HeroPanel.jsx
│   └── HeroPanel.scss
│
└── Navigation/                             <-- Header, sidebar, and tab navigation
    ├── Pagination/                         (Page navigation controls)
    ├── Sidebar/                            (App sidebar menu navigation)
    │   └── UseSidebar.md                   <-- Full-stack integration guide for Sidebar
    ├── TableTabs/                          (Tab filters for tables and views)
    └── Topbar/                             (App header topbar navigation)
```

---

## 2. Component Customization & Location Matrix

Refer to this matrix to find which file to inspect or modify for common UI tasks:

| Purpose / Function                    | JSX File                                                                                                                                                                                                    | Stylesheet / Export                                                                                                                |
| :------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| **Dedicated Analytics Line Chart**    | [AnalyticsLineChartCard.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/AnalyticsLineChartCard/AnalyticsLineChartCard.jsx)                                                                            | [AnalyticsLineChartCard.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/AnalyticsLineChartCard/AnalyticsLineChartCard.scss) |
| **Analytics Line Chart Subcomponent** | [AnalyticsLineChart.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/AnalyticsLineChartCard/components/AnalyticsLineChart.jsx)                                                                         | Handled by parent wrapper / inline SVG styling                                                                                     |
| **Activities Feed Card**              | [ActivitiesFeedCard.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/ActivitiesFeed/ActivitiesFeedCard.jsx)                                                                                | [ActivitiesFeedCard.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/ActivitiesFeed/ActivitiesFeedCard.scss)     |
| **Empty State Card**                  | [EmptyStateCard.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/EmptyStateCard/EmptyStateCard.jsx)                                                                                        | [EmptyStateCard.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/EmptyStateCard/EmptyStateCard.scss)             |
| **Kanban Board**                      | [KanbanBoard.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/KanbanBoard/KanbanBoard.jsx)                                                                                                 | [KanbanBoard.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/KanbanBoard/KanbanBoard.scss)                      |
| **KPI Line Chart Card**               | [KpiLineChartCard.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/KpiLineChartCard/KpiLineChartCard.jsx)                                                                                  | [KpiLineChartCard.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/KpiLineChartCard/KpiLineChartCard.scss)       |
| **Metric Card**                       | [MetricCard.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/MetricCard/MetricCard.jsx)                                                                                                    | [MetricCard.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/MetricCard/MetricCard.scss)                         |
| **Step Progress**                     | [StepProgress.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/StepProgress/StepProgress.jsx)                                                                                              | [StepProgress.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/StepProgress/StepProgress.scss)                   |
| **Primary / Secondary Button**        | [Button.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/Button/Button.jsx)                                                                                                                    | [Button.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/Button/Button.scss)                                         |
| **AI Action Button**                  | [AIAssistantButton.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/AIAssistantButton/AIAssistantButton.jsx)                                                                                   | [AIAssistantButton.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/AIAssistantButton/AIAssistantButton.scss)        |
| **Save Details Button**               | [SaveDetailsButton.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/SaveDetailsButton/SaveDetailsButton.jsx)                                                                                   | Inherited styling                                                                                                                  |
| **Cancel Button**                     | [CancelButton.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/CancelButton/CancelButton.jsx)                                                                                                  | [CancelButton.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/CancelButton/CancelButton.scss)                       |
| **Delete Button**                     | [DeleteButton.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/DeleteButton/DeleteButton.jsx)                                                                                                  | [DeleteButton.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/DeleteButton/DeleteButton.scss)                       |
| **Edit Button**                       | [EditButton.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/EditButton/EditButton.jsx)                                                                                                        | [EditButton.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/EditButton/EditButton.scss)                             |
| **Icon Button Container**             | [IconButton.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/IconButton/IconButton.jsx)                                                                                                        | [IconButton.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/IconButton/IconButton.scss)                             |
| **Next / Prev Nav Buttons**           | [NextButton.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/NextButton/NextButton.jsx) / [PrevButton.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/PrevButton/PrevButton.jsx) | Associated `.scss`                                                                                                                 |
| **Toggle Switch**                     | [ToggleButton.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/ToggleButton/ToggleButton.jsx)                                                                                                  | [ToggleButton.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/ToggleButton/ToggleButton.scss)                       |
| **View Mode Toggle**                  | [ViewToggle.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/ViewToggle/ViewToggle.jsx)                                                                                                        | [ViewToggle.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Buttons/ViewToggle/ViewToggle.scss)                             |
| **Table / Grid View Switcher**        | [DataView.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/DataView/DataView.jsx)                                                                                                          | [DataView.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/DataView/DataView.scss)                               |
| **Grid Card**                         | [GridCard.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/DataView/components/GridCard/GridCard.jsx)                                                                                      | [GridCard.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/DataView/components/GridCard/GridCard.scss)           |
| **Text / Password Input Field**       | [InputField.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Form/InputField/InputField.jsx)                                                                                                           | [InputField.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Form/InputField/InputField.scss)                                |
| **Multi-line Textarea**               | [Textarea.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Form/Textarea/Textarea.jsx)                                                                                                                 | [Textarea.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Form/Textarea/Textarea.scss)                                      |
| **Search Bar Input**                  | [SearchBar.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Form/SearchBar/SearchBar.jsx)                                                                                                              | [SearchBar.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Form/SearchBar/SearchBar.scss)                                   |
| **Date Input Picker**                 | [DatePicker.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Form/DatePicker/DatePicker.jsx)                                                                                                           | [DatePicker.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Form/DatePicker/DatePicker.scss)                                |
| **Dropdown Select**                   | [Dropdown.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Form/Dropdown/Dropdown.jsx)                                                                                                                 | [Dropdown.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Form/Dropdown/Dropdown.scss)                                      |
| **Checkbox Control**                  | [Checkbox.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Form/Checkbox/Checkbox.jsx)                                                                                                                 | [Checkbox.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Form/Checkbox/Checkbox.scss)                                      |
| **File Upload Target**                | [Upload.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Form/Upload/Upload.jsx)                                                                                                                       | [Upload.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Form/Upload/Upload.scss)                                            |
| **Date & Time Controls**              | [Calendar.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Form/Calendar/Calendar.jsx) / [DateTimePicker.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Form/DateTimePicker/DateTimePicker.jsx) | Associated `.scss`                                                                                                                 |
| **Advanced Table**                    | [AdvancedTable.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/AdvancedTable/AdvancedTable.jsx)                                                                                           | Associated `.scss`                                                                                                                 |
| **KPI Stat Card**                     | [StatCard.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/StatCard/StatCard.jsx)                                                                                                          | [StatCard.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/StatCard/StatCard.scss)                               |
| **Logo Component**                    | [Logo.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/Logo/Logo.jsx)                                                                                                                      | [Logo.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/Logo/Logo.scss)                                           |
| **Form Header Component**             | [FormHeader.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/FormHeader/FormHeader.jsx)                                                                                                    | [FormHeader.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/DataDisplay/FormHeader/FormHeader.scss)                         |
| **Dialog Modal**                      | [Dialog.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Feedback/Dialog/Dialog.jsx)                                                                                                                   | [Dialog.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Feedback/Dialog/Dialog.scss)                                        |
| **Toast Notifications**               | [Toast.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Feedback/Toast/Toast.jsx) / [DeleteToast.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Feedback/DeleteToast/DeleteToast.jsx)           | Associated `.scss`                                                                                                                 |
| **Sidebar Navigation**                | [Sidebar.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Navigation/Sidebar/Sidebar.jsx)                                                                                                              | [Sidebar.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Navigation/Sidebar/Sidebar.scss)                                   |
| **Topbar Navigation**                 | [Topbar.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/Navigation/Topbar/Topbar.jsx)                                                                                                                 | [Topbar.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Navigation/Topbar/Topbar.scss)                                      |
| **Hero Panel**                        | [HeroPanel.jsx](file:///d:/Hackathon-UI/UI/src/components/Shared/HeroPanel/HeroPanel.jsx)                                                                                                                   | [HeroPanel.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/HeroPanel/HeroPanel.scss)                                        |

---

## 3. Key Agent Guidelines

1. **Reusability First**: Check if a component already exists in `src/components/Shared/` before introducing new primitives.
2. **Chart Selection & Interactive Rules**: Always refer to [ChartsGuide.md](file:///d:/Hackathon-UI/DOC/ChartsGuide.md) and [ChartsMetaData.md](file:///d:/Hackathon-UI/DOC/ChartsMetaData.md) in the `DOC/` directory before building or implementing chart features.
3. **Styling Rules**: Keep component SCSS scoped to its matching JSX component file.
4. **Maintenance Rule**:
    > [!IMPORTANT]
    > Whenever subcomponents in `src/components/Shared/` are added, modified, renamed, or refactored, please update this `HoverShared.md` file to keep the agent context index up to date.

---

## 4. Change & Maintenance Log

### 2026-07-26

- **Updated `OtpVerificationForm` with Resend Code & Live Countdown**: Added `onResend` callback support, live 30-second countdown timer (`resendCooldown`), and a styled "Resend Code" action link. Integrated into `RegisterForm` and `ForgotPasswordForm`.
- **Created `DataView` component system**: Built `src/components/Shared/DataDisplay/DataView/` — a modular Table/Grid view switcher. Includes `DataView.jsx` (main orchestrator with `activeView` state), `ViewToggle.jsx` (new shared segmented button in `Buttons/`), `GridView.jsx` (responsive CSS-grid card renderer), and `GridCard.jsx` (individual card with CircularAvatar, Badge, and key-value body). All AdvancedTable props forwarded verbatim. Registered in `ComponentsShowcase.jsx` using the invoice dataset.
- **Created `ViewToggle` shared button**: Built `src/components/Shared/Buttons/ViewToggle/` — reusable segmented Table|Grid icon-button group with active state shadow-card highlight. Size variants: `sm`, `md`.
- **Created `Textarea` shared component**: Built `src/components/Shared/Form/Textarea/` — a multi-line text input matching InputField's visual language (gray-100 background, transparent border, radius-small, Plus Jakarta Sans). Supports `rows`, `maxLength` with live char counter (warning at 85%, danger at limit), `resize` mode (`none`/`vertical`/`horizontal`/`both`), `autoResize` (JS-driven height growth), `error` state, `hint` text, `disabled`, and `required` asterisk. Registered in `ComponentsShowcase.jsx`.
- **Created `ToggleButton` shared component**: Built `src/components/Shared/Buttons/ToggleButton/` — a fully controlled on/off toggle switch supporting 5 variants (`primary`, `success`, `danger`, `warning`, `default`), 3 sizes (`sm`, `md`, `lg`), optional label with configurable position (`left`/`right`), disabled state, keyboard focus ring, and smooth CSS transitions. Registered in `ComponentsShowcase.jsx` under a dedicated section showing all variants, sizes, label positions, and disabled states.
- **Created `AdvancedScrollbar` with Shared Number Tooltip**: Implemented `src/components/Shared/DataDisplay/AdvancedScrollbar/` supporting both horizontal and vertical scrollbars, drag & click navigation, and live number tooltips (e.g. `82 of 107`) built using the shared `Tooltip` primitive. Integrated into `AdvancedTable` and added a live section in `ComponentsShowcase.jsx`.

### 2026-07-25

- **Sidebar Collapse Logo Hover Interaction**: Modified `SidebarLogo.jsx`, `SidebarLogo.scss`, and `Sidebar.scss` to toggle between the logo icon and the size 24 expand icon on hovering over the collapsed sidebar.
- **Dynamic Form Input Error Layout**: Configured `InputField.jsx`, `InputField.scss`, `Dropdown.jsx`, and `Dropdown.scss` to render validation errors dynamically (pushing subsequent elements down when active).
- **Narrower Collapsed Sidebar**: Decreased the collapsed sidebar width from 80px to 64px (and updated padding to 8px) in [Sidebar.scss](file:///d:/Hackathon-UI/UI/src/components/Shared/Navigation/Sidebar/Sidebar.scss) for both collapsed and tablet viewport states.
- **Collapsed Sidebar Hover Sub-Tabs**: Restructured `SidebarNav.jsx` and `Sidebar.scss` to render sub-tabs as a right-side, absolute-positioned flyout popover menu when hovering over collapsed items (like Analytics), allowing sub-tabs selection without expanding the sidebar.
- **Equal Spacing for Dropdown & Inputs**: Set `margin-bottom: 20px` on both inputs and dropdowns to achieve a clean, uniform gap between Role, Email, and Password inputs under normal states.

### 2026-07-22

- **Interactive Chart Guidelines & Selection Trees**: Documented new standards for data visualization and interaction guides in [ChartsGuide.md](file:///d:/Hackathon-UI/DOC/ChartsGuide.md) and [ChartsMetaData.md](file:///d:/Hackathon-UI/DOC/ChartsMetaData.md).
- **Corrected Shared Directory Map**: Cleaned up the nonexistent `Analytics/` and `Charts/` low-level directories in Section 1 and Section 2.
- **Mapped New DataDisplay Components**: Added architecture and location mappings for `ActivitiesFeed`, `EmptyStateCard`, `KanbanBoard`, `KpiLineChartCard`, `MetricCard`, and `StepProgress`.
- **Mapped Save & Cancel Buttons**: Registered `SaveDetailsButton` and `CancelButton` in the matrix and tree directory list.
- **Created UseSidebar.md**: Documented the full-stack integration of the collapsible navigation Sidebar, including props, path/URL mappings, session token destruction flows, and RBAC visibility configurations.

### 2026-07-21

- **Numeric & Currency Search Normalization**: Enhanced search filtering pipeline in `AdvancedTable` and `DataTable` to automatically strip formatting symbols (`₹`, `$`, `€`, `£`, `,`, spaces) during search comparison, allowing users to type plain numbers (e.g. `12450` or `18600`) to directly match formatted values (e.g. `₹12,450.00`).
- **Created `DatePicker` component**: Built `src/components/Shared/Form/DatePicker/` featuring Indian date format (`DD-MM-YYYY`), custom date display box matching login input fields (`$color-gray-100` / `#f3f4f6`), borderless design, dropdown calendar popover, quick 'Today' selector, clear button, and error state.
- **`AdvancedTable.scss` Header Styling**: Darkened `thead` background color from `$color-gray-50` (`#fafafb`) to `$color-gray-100` (`#f3f4f6`) to match tab/sidebar neutral tone, updated hover/sorted state background to `$color-gray-200` (`#e5e7eb`), and removed header cell borders/outlines.
- **Created `HoverShared.md`**: Initialized agent index map for all shared components across Analytics, Buttons, Charts, DataDisplay, ErrorPages, Feedback, Form, HeroPanel, and Navigation.

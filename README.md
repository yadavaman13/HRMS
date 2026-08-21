# Hi Teja!!! 👋

We are team **ByteBuilders** and we selected **Dayflow HRMS** (Human Resource Management System).

Dayflow HRMS is a robust, multi-tenant enterprise resource planning system tailored for managing employee lifecycles, attendance tracking with regularization workflows, double-entry leave ledgers, automatic salary calculations with loss-of-pay (LOP) deductions, and an integrated AI policy advisor assistant. Built with React (Vite) on the frontend, Node.js & Express on the backend, and powered by PostgreSQL (Drizzle ORM) and Redis caching.

- **Project Hosted Link:** [Localhost Development Server](http://localhost:5173)
- **Presentation Video Link:** [[Video Walkthrough](#)]

---

## Table of Contents

1. [Team Members & Roles](#team-members--roles)
2. [Tech Stack](#tech-stack)
3. [Project Architecture & Diagrams](#project-architecture--diagrams)
4. [Project Structure](#project-structure)
5. [Core Modules & Features](#core-modules--features)
6. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
7. [Frontend Routes](#frontend-routes)
8. [API Endpoint Reference](#api-endpoint-reference)
9. [Prerequisites](#prerequisites)
10. [Getting Started](#getting-started)
11. [Challenges We Overcame](#challenges-we-overcame)

---

## Team Members & Roles

| Member Name              | Role                       | Core Responsibilities                                                                          | GitHub Profile                                                                                                                                                                        |
| :----------------------- | :------------------------- | :--------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Yadav Aman Singh**     | Full Stack / Backend Lead  | Database schema design, core payroll computation engine, JWT auth/cookie session validation    | <a href="https://github.com/yadavaman13"><img src="https://github.com/yadavaman13.png?size=40" width="40" height="40" style="border-radius:50%;" alt="yadavaman13" /></a>             |
| **Aryan Patel**          | Full Stack / Frontend Lead | Client architecture setup, modular routing loader, dashboard layout design, chart integrations | <a href="https://github.com/aryanpatel287"><img src="https://github.com/aryanpatel287.png?size=40" width="40" height="40" style="border-radius:50%;" alt="aryanpatel287" /></a>       |
| **Iteshkumar Prajapati** | Full Stack Developer       | Attendance punch-in/out logic, shift schedules, double-entry leave ledger backend/frontend     | <a href="https://github.com/iteshprajapati"><img src="https://github.com/iteshprajapati.png?size=40" width="40" height="40" style="border-radius:50%;" alt="iteshprajapati" /></a>    |
| **Ankur Singh**          | Full Stack Developer       | AI policy chatbot integration, vector search RAG, audit logs, notifications routing            | <a href="https://github.com/Ankursingh018as"><img src="https://github.com/Ankursingh018as.png?size=40" width="40" height="40" style="border-radius:50%;" alt="Ankursingh018as" /></a> |

---

## Tech Stack

### Frontend Client Layer

- **Core Library:** React (v19.x)
- **Routing:** React Router (v7.x)
- **State Management:** React Context API & custom Hooks
- **Styling & Theming:** Sass / SCSS (modular styles and design tokens)
- **Charts & Data Visualization:** Apache ECharts (v6.x)
- **Network Interface:** Axios (for API requests with automatic credential inclusion)
- **Iconography:** Lucide React
- **Markdown & Math Rendering:** React Markdown, rehype-raw, KaTeX
- **Bundler & Dev Server:** Vite (v8.x)

### Backend API Layer

- **Runtime & Web Framework:** Node.js (v18+) & Express (v5.x)
- **Relational ORM:** Drizzle ORM
- **Authentication:** JSON Web Tokens (JWT) with HTTP-only cookies
- **Password Hashing:** bcryptjs
- **Rate Limiting:** express-rate-limit
- **Request Validation:** express-validator & Zod
- **Logging & Monitoring:** Morgan HTTP logger
- **File Upload Middleware:** Multer & ImageKit Node.js SDK

### Data Access & Storage Layer

- **Relational Database Engine:** PostgreSQL (utilizing `pgcrypto` for PII encryption)
- **Cache Store:** Redis (via `ioredis` client)
- **Database Tools & Dashboards:** Drizzle Kit (for migrations and schema inspection)

### Third-Party Integrations

- **Document & Image Hosting:** ImageKit
- **SMTP Transport:** Nodemailer & Mailjet
- **Google API Client:** googleapis (calendar integrations, etc.)
- **AI Engines:** LangChain (with Google Gemini/Mistral AI), Pinecone (Vector Database), LlamaIndex/Llama Cloud (for RAG)

### Quality Assurance & Testing

- **Test Runner Framework:** Native Node.js Test Runner (`node --test`)

---

## Project Architecture & Diagrams

### Overall Project Architecture

```mermaid
flowchart TB
    subgraph Presentation_Layer["🖥️ Presentation & Client Layer"]
        AdminPortal["Admin / HR Dashboard"]
        EmpPortal["Employee Self-Service Portal"]
        BioApp["Biometric Device / Mobile Check-in"]
    end

    subgraph Gateway_Layer["🛡️ API Gateway & Security Layer"]
        AuthMiddleware["JWT & Refresh Token Validator"]
        RBAC["Role-Based Access Control (Admin | HR | Employee)"]
        AuditInterceptor["Audit Log Interceptor"]
    end

    subgraph Core_Services["⚙️ HRMS Domain Services"]
        OrgService["Organization & Setup Service"]
        EmpService["Employee & Lifecycle Service"]
        WorkScheduleService["Shift & Schedule Engine"]
        AttendanceEngine["Attendance & Overtime Engine"]
        LeaveLedgerEngine["Leave & Balance Ledger Engine"]
        PayrollEngine["Payroll & Deduction Computation Engine"]
        NotificationService["Notification Dispatcher"]
    end

    subgraph Data_Layer["🗄️ PostgreSQL Database (pgcrypto & Drizzle ORM)"]
        direction TB
        OrgTables["Organizations, Departments, Locations"]
        UserTables["Users, Refresh Tokens"]
        EmpTables["Employees, Private Info, Identifiers, Documents"]
        ScheduleTables["Work Schedules, Shift Days, Holidays"]
        AttendanceTables["Attendance Records, Sessions, Adjustments"]
        LeaveTables["Leave Allocations, Requests, Balance Ledger"]
        PayrollTables["Salary Structures, Periods, Payslips, Lines"]
        AuditTables["Audit Logs, Notifications"]
    end

    Presentation_Layer --> Gateway_Layer
    Gateway_Layer --> Core_Services

    OrgService --> OrgTables
    EmpService --> UserTables & EmpTables
    WorkScheduleService --> ScheduleTables
    AttendanceEngine --> AttendanceTables
    LeaveLedgerEngine --> LeaveTables
    PayrollEngine --> PayrollTables
    NotificationService --> AuditTables
    AuditInterceptor --> AuditTables

    AttendanceEngine -.->|"Syncs Payable Days"| PayrollEngine
    LeaveLedgerEngine -.->|"Syncs Unpaid Leaves"| PayrollEngine
    EmpService -.->|"Triggers Welcome"| NotificationService
    LeaveLedgerEngine -.->|"Approval Alerts"| NotificationService
```

For detailed ER diagrams and business workflows (Onboarding, Attendance Tracking, Leave Ledgers, and Monthly Payroll processing), please refer to the dedicated [ARCHITECTURE_AND_FLOWS.md](file:///home/iteshprajapati/HackathonPractice/HRMS/ARCHITECTURE_AND_FLOWS.md) document.

![Activity Flowchart 1](https://ik.imagekit.io/hci5kelnn/readme/hrms/Activity/flow1.svg)

![Activity Flowchart 2](https://ik.imagekit.io/hci5kelnn/readme/hrms/Activity/flow2.svg)

![Activity Flowchart 3](https://ik.imagekit.io/hci5kelnn/readme/hrms/Activity/flow3.svg)

![Activity Flowchart 5](https://ik.imagekit.io/hci5kelnn/readme/hrms/Activity/flow4.svg)

---

## Project Structure

The project is structured into two main subdirectories:

- **`client/`**: React SPA frontend client.
- **`server/`**: Express API backend.

### Directory Layout

```text
Dayflow HRMS/
├── client/                               # React SPA Frontend Client
│   ├── src/
│   │   ├── app/                          # Core App Setup
│   │   │   ├── features/                 # Modular Client Features
│   │   │   │   ├── ai/                   # AI Chat Interface & Services
│   │   │   │   ├── analytics/            # User/Admin Charts, Dashboards & Insight Page
│   │   │   │   ├── attendance/           # Biometric Punch In/Out, Regularization Forms
│   │   │   │   ├── auth/                 # Login, Registration, OTP, Password Recovery
│   │   │   │   ├── dashboard/            # Dashboard Base Layout and Navigation
│   │   │   │   ├── employees/            # Employee Lists, Profiles, reporting managers
│   │   │   │   ├── leave/                # Leave Request submission, Approval panel, and balances ledger
│   │   │   │   ├── organization/         # Organization settings (Holidays, locations, depts)
│   │   │   │   ├── payroll/              # Payslip history list, detailed payslip rendering, and PDF generator
│   │   │   │   ├── settings/             # General and Security Account Settings
│   │   │   │   └── showcase/             # Development Components Showcase / Catalog
│   │   │   ├── App.jsx                   # React Application Root Component
│   │   │   ├── App.routes.jsx            # React Router setup utilizing automated loader
│   │   │   └── routes.loader.jsx         # Custom utility to dynamically auto-discover feature routes
│   │   ├── components/                   # Shared UI Components Catalog
│   │   │   ├── Shared/                   # General Shared UI components
│   │   │   │   ├── Buttons/              # Primary, secondary, outline button styles
│   │   │   │   ├── DataDisplay/          # Custom grids, cards, Lists, Kanban boards
│   │   │   │   ├── Feedback/             # Loading spinners, alerts, modals
│   │   │   │   ├── Form/                 # Input fields, Select dropdowns, Date pickers
│   │   │   │   └── Navigation/           # Sidebars, Navbars, Breadcrumbs
│   │   │   └── ai-elements/              # Specialized Chat Components
│   │   │       ├── attachments/          # RAG document attachment displays
│   │   │       ├── message/              # User vs Assistant chat message bubbles
│   │   │       ├── prompt-input/         # Text input box for LLM queries
│   │   │       └── speech-input/         # Voice recognition buttons for text queries
│   │   ├── hooks/                        # Custom reusable React hooks (e.g. useActiveNavTab)
│   │   ├── lib/                          # Custom wrappers / third-party initializations
│   │   ├── styles/                       # Global & Foundation Styles (Sass/SCSS)
│   │   │   └── foundation/               # SCSS utility classes, theme setups, HSL color tokens
│   │   └── utils/                        # Frontend date formatters, validators, and math helpers
│   ├── vite.config.js                    # Vite configuration with API routing proxies
│   └── package.json                      # Client dependency registry
│
├── server/                               # Node.js & Express REST Backend API
│   ├── src/
│   │   ├── config/                       # Application config (Database, Redis, Google API, ImageKit)
│   │   ├── dao/                          # Data Access Objects (DB transactional abstraction layers)
│   │   ├── db/                           # Database Schema definitions & migrations
│   │   │   ├── schema/                   # Table-by-table Drizzle schema mappings
│   │   │   ├── seed.js                   # Master data seeding script (Indian scenario)
│   │   │   └── migrate.js                # Core migration execution script
│   │   ├── middleware/                   # Express Global Middlewares
│   │   │   ├── errorHandler.js           # Generic centralized error response handler
│   │   │   ├── jwtAuth.js                # JWT session validation middleware
│   │   │   ├── rbac.js                   # Role-Based Access Control validator
│   │   │   └── auditInterceptor.js       # Auto-intercepts mutation actions to log state diffs
│   │   ├── modules/                      # Domain-driven modular API modules
│   │   │   ├── ai/                       # Google Gemini and Mistral model routing
│   │   │   ├── attendance/               # Attendance punches and regularizations CRUD
│   │   │   ├── audit/                    # Log tracking interface for auditing system actions
│   │   │   ├── auth/                     # Authentication session controllers and refresh routing
│   │   │   ├── company/                  # Multi-tenant corporate structure setup
│   │   │   ├── dashboard/                # Combined statistical aggregation for analytics panels
│   │   │   ├── employees/                # Onboarding and directory lookup services
│   │   │   ├── leave/                    # Leave allocation and ledger transaction operations
│   │   │   ├── notifications/            # App-wide real-time notification dispatchers
│   │   │   ├── payroll/                  # Calculation schedules, settings, and payslip releases
│   │   │   ├── pdf/                      # PDF builder handlers (using html-pdf-lite)
│   │   │   ├── rag/                      # RAG file ingestion and pinecone index querying
│   │   │   └── settings/                 # General profile settings adjustments
│   │   ├── services/                     # External services orchestration
│   │   │   ├── ai/                       # Langchain integrations (Google/Mistral/Pinecone/Tavily)
│   │   │   ├── mail/                     # SMTP transport configurations
│   │   │   └── pdf/                      # HTML compilation and PDF generation service
│   │   ├── cron/                         # Background cron jobs (attendance reminders, payroll calculations)
│   │   ├── templates/                    # Dynamic HTML templates for payslips and letters
│   │   ├── tests/                        # Comprehensive suite of unit & API tests
│   │   └── server.js                     # Root entry point initializing port listener
│   └── package.json                      # Server dependency registry
│
├── database_schema.sql                   # Compiled raw PostgreSQL DDL schemas (24 tables)
├── ARCHITECTURE_AND_FLOWS.md             # Diagrams & technical flow chart reference
└── README.md                             # Setup manual and system documentation
```

---

## Core Modules & Features

1. **Organization Setup**: Handles multi-tenant company configurations, offices/locations (Mumbai, Bengaluru, Pune, Remote), departments, job positions, and official holidays.
2. **Identity & Authentication**: Manages secure login, refresh token lifecycle, rate-limiting, and Role-Based Access Control (RBAC) across three distinct roles (`admin`, `hr`, `employee`).
3. **Employee Profile Management**: Maintains comprehensive profiles, hierarchical reporting manager mapping, and encrypted PII/sensitive data (Bank Accounts, PAN, Aadhaar) utilizing PostgreSQL `pgcrypto` AES-256 encryption.
4. **Shift & Work Schedule Assignment**: Defines working hours, breaks, shifts, and manages historical schedule assignments.
5. **Attendance Tracking & Regularization**: Logs check-in/check-out sessions, computes worked minutes, flags late/half-days/overtime, and supports manager regularization/approval workflows.
6. **Leave Management & Immutable Ledger**: Handles paid/unpaid leaves, allocations, requests, approvals, and computes remaining balances dynamically using an immutable double-entry balance ledger.
7. **Payroll Engine**: Automates salary calculations based on active structures, calculates statutory deductions (PF, Professional Tax), applies LOP deductions dynamically derived from attendance/unpaid leaves, and generates monthly payslips.
8. **AI Assistant & RAG Chat**: Leverages Langchain & Pinecone/LlamaIndex vector search to support natural language queries regarding company policies and employee-specific HR questions.
9. **Audit Logging & Notifications**: Implements an immutable system-wide JSON audit trail capturing before/after data diffs and schedules real-time notification alerts.

---

## Role-Based Access Control (RBAC)

Dayflow HRMS enforces role limits on both frontend routes and backend APIs:

- **`admin`**: Full system control. Can view all audit logs, configure organization-wide settings, manage system metadata, and view high-level analytics.
- **`hr`**: HR Operations focus. Can onboard employees, define shift schedules, manage leave allocations, process monthly payroll, review/approve/adjust payslips, and manage organization metadata.
- **`employee`**: Self-service portal. Can view profile details, view personal work schedules, check in/check out (attendance punch), request attendance regularization, apply for leaves, view leave balance ledger, download payslips, and converse with the AI HR Assistant.

---

## Frontend Routes

### Authentication (Public)

| Path               | Component        | Description                      |
| :----------------- | :--------------- | :------------------------------- |
| `/login`           | `Login`          | User login portal                |
| `/register`        | `Register`       | User account registration        |
| `/reset-password`  | `ResetPassword`  | Reset forgotten password page    |
| `/recover-account` | `RecoverAccount` | Recover deactivated account page |

### Secure Dashboard Portal Routes (Common/Base under `/dashboard`)

| Path                          | Component         | Description                            |
| :---------------------------- | :---------------- | :------------------------------------- |
| `/dashboard/home`             | `DashboardIndex`  | High-level metrics overview dashboard  |
| `/dashboard/ai`               | `AiChat`          | AI Chat Assistant interface            |
| `/dashboard/settings`         | `SettingsLayout`  | General settings wrapper               |
| `/dashboard/settings/general` | `GeneralSettings` | Core system/user general configuration |
| `/dashboard/settings/account` | `AccountSettings` | Security details & account update      |

### Employee Self-Service / Personal Portal Routes (under `/dashboard/user/`)

| Path                                  | Component          | Description                                                |
| :------------------------------------ | :----------------- | :--------------------------------------------------------- |
| `/dashboard/user/analytics`           | `AnalyticsLayout`  | User analytics overview & charts                           |
| `/dashboard/user/analytics/insight`   | `UserInsight`      | Detailed charts of personal productivity/attendance        |
| `/dashboard/user/analytics/reports`   | `UserReports`      | Exportable personal sheets                                 |
| `/dashboard/user/employees`           | `EmployeesList`    | Standard company directory view                            |
| `/dashboard/user/employees/:id`       | `EmployeeProfile`  | Detailed public view of other colleagues                   |
| `/dashboard/user/attendance`          | `AttendancePortal` | Daily check-in/out console, logs calendar & adjustments    |
| `/dashboard/user/leave`               | `LeavePortal`      | Leave application form & balance transactions ledger       |
| `/dashboard/user/payroll`             | `PayrollPortal`    | Personal salary structure and history of payslips          |
| `/dashboard/user/payroll/payslip/:id` | `PayslipDetails`   | Monthly payslip itemized component breakdown & PDF export  |
| `/dashboard/user/organization`        | `OrgPortal`        | Viewing department members, office locations, and holidays |

### Admin & HR Operations Routes (under `/dashboard/admin/`)

These routes are protected and auto-loaded only for users with the `admin` or `hr` role:

| Path                            | Component            | Description                                                              |
| :------------------------------ | :------------------- | :----------------------------------------------------------------------- |
| `/dashboard/admin/analytics`    | `AdminAnalytics`     | Company-wide analytics (department performance, attendance rate)         |
| `/dashboard/admin/employees`    | `EmployeeManagement` | Board to onboard, update, and manage employees                           |
| `/dashboard/admin/attendance`   | `AttendanceConsole`  | Team timesheet adjustments approval panel                                |
| `/dashboard/admin/leave`        | `LeaveConsole`       | Panel to review and approve/reject leave requests                        |
| `/dashboard/admin/payroll`      | `PayrollConsole`     | System to initiate payroll cycles, adjust formulas, and release payslips |
| `/dashboard/admin/organization` | `OrgManagement`      | Admin view to structure departments, locations, and holidays             |

---

## API Endpoint Reference

All endpoints are prefix-routed through `/api` and require authorization unless specified.

### Authentication & Users

- `/api/auth/login` (POST): Authenticate user credentials and set httpOnly cookie.
- `/api/auth/logout` (POST): Revoke session/clear cookie.
- `/api/auth/refresh` (POST): Refresh access tokens.
- `/api/auth/reset-password` (POST): Update/reset user credentials.

### Employees & Profiles

- `/api/employees` (GET/POST): Retrieve all employee profiles / onboard new employee.
- `/api/employees/:id` (GET/PUT/DELETE): Fetch, update details, or soft-delete an employee.
- `/api/profile` (GET/PUT): Fetch or update current user's profile and private data.

### Attendance

- `/api/attendance/punch` (POST): Register check-in or check-out biometric/self-service logs.
- `/api/attendance/records` (GET): Get historical attendance logs.
- `/api/attendance/adjustments` (GET/POST/PUT): Submit or review regularization adjustment requests.

### Leave Management

- `/api/leave/types` (GET/POST): Fetch or define leave categories.
- `/api/leave/allocations` (GET/POST): Query allocations or define new leave quotas.
- `/api/leave/requests` (GET/POST/PUT): Submit leave requests or update their status (approve/reject).
- `/api/leave/balances` (GET): Get remaining leave balance using the double-entry transaction ledger.

### Payroll Engine

- `/api/payroll/periods` (GET/POST/PUT): Manage payroll processing cycles (draft, review, finalize).
- `/api/payroll/payslips` (GET/POST): Query generated employee payslips or trigger run.
- `/api/payroll/payslips/:id` (GET/PUT): Fetch specific payslip lines or make manual adjustments.
- `/api/payroll/settings` (GET/PUT): Get or update salary component formulas and values.

### Auxiliary Services

- `/api/ai/chat` (POST): Chat with the AI assistant.
- `/api/rag/query` (POST): Query company policies using vector search.
- `/api/pdf/generate` (POST): Generate PDF exports (e.g., payslips, contracts).
- `/api/audit-logs` (GET): Retrieve immutable audit logs (admin only).
- `/api/notifications` (GET/PUT): Fetch user notifications and mark them as read.

---

## Prerequisites

Make sure the following are installed locally:

- **Node.js** (v18+ recommended)
- **PostgreSQL** (v14+)
- **Redis Server** (v6+)

---

## Getting Started

### 1. Environment Setup

Configure environment variables for both the client and server.

#### Server Configuration (`server/.env`)

Create a `.env` file inside the `server/` directory:

```env
PORT=3000
SERVER_URL=http://localhost:3000
CLIENT_ORIGINS=http://localhost:5173
NODE_ENV=development

# JWT Secret
JWT_SECRET=super_secret_jwt_key_dayflow_hrms

# PostgreSQL Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dayflow_hrms

# Redis Setup
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# Third-Party Email Dispatch (Google APIs / Nodemailer)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_SENDER_EMAIL=hr@dayflow.in

# AI Models & Langchain API Keys
GEMINI_API_KEY=your_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key
TAVILY_API_KEY=your_tavily_api_key
LLAMA_CLOUD_API_KEY=your_llama_cloud_api_key

# Vector Database (Pinecone)
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=dayflow-hrms-index

# Document/Avatar Uploads (ImageKit)
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

### 2. Dependency Installation & Startup

#### Run Backend Server

Open a terminal in the project directory and run:

```bash
cd server
npm install
node src/db/seed.js     # Seed default locations, roles, and master users
npm run dev             # Start Express API dev server with nodemon
```

The server should start on `http://localhost:3000`.

_Note: Default seeded credentials:_

- **Admin**: `admin@example.com` / `Admin@123`
- **HR**: `hr@example.com` / `Admin@123`
- **Employee**: `employee@example.com` / `Admin@123`

#### Run Frontend Client

Open another terminal in the root directory and run:

```bash
cd client
npm install
npm run dev             # Start React dev server with Vite
```

The client should start on `http://localhost:5173` and requests to `/api` will be proxied automatically to `http://localhost:3000`.

---

## Challenges We Overcame

During the development of **Dayflow HRMS**, we tackled several major engineering challenges:

- **Double-Entry Leave Balance Ledger**: Instead of storing mutable `remaining_days` columns in the database, leave balances are dynamically resolved from immutable ledger transactions (`allocation`, `leave_used`, `leave_cancelled`). This completely prevents concurrency issues and maintains a full history of changes.
- **Statutory Compliant Automated Indian Payroll Engine**: Built an Express calculation module that pulls attendance summaries and leave ledger records to automate LOP (Loss-of-Pay) deductions, compute PF/PT/Income Taxes, and itemize payslips automatically.
- **PII Encryption at DB-Level**: Protected employee Aadhaar, PAN, and Bank details by using AES-256 (`pgcrypto`) encryption at the database level and mapping these custom fields cleanly via Drizzle ORM.
- **Vite Dynamic Route Discovery**: Constructed a custom `loadFeatureRoutes()` loader that automatically discovers and registers all `*.routes.jsx` configurations under modular subfolders, allowing developers to add pages without editing a single root router file.

---

_Developed with ❤️ by Team Dayflow._

# Server Implementation Reference Guide

This document acts as the live record of implemented backend features, API contracts, routing definitions, database schemas, edge cases, and core business logic.

> [!IMPORTANT]
> **Instructions for AI Agents and Developers:**
> Before developing or modifying any backend feature:
>
> 1. Scan this entire document to verify if the feature or endpoint already exists.
> 2. Avoid redundant implementations or duplicate routes.
> 3. If you are enhancing an existing feature, update its section in this document.
> 4. If you are implementing a new feature, append it to this document with its routing, API contracts, schemas involved, edge cases, and business logic.

---

## 1. Authentication & Access Control Module

### Feature Description
Controls identity verification, multi-channel authentication (work email or deterministic Employee Code `OIJODO20220001`), password lifecycle (`mustChangePassword` enforcement), JWT sessions, Redis token blacklisting, account recovery, role-based access control (`admin`, `hr`, `employee`), and permission scoping.

### Routings & API Contracts
All routes are mounted under `/api/auth`.

#### Public Endpoints
- **`POST /api/auth/register`**: Registers a new organization along with the initial System Administrator.
- **`POST /api/auth/login`**: Validates credentials via Email or Employee Code (Login ID) + password. Checks account active status and returns JWT cookie `token` + user payload including `mustChangePassword`.
- **`POST /api/auth/logout`**: Blacklists current token in Redis and clears cookies.
- **`POST /api/auth/forgot-password`**: Generates and emails an OTP code for password reset.
- **`POST /api/auth/verify-forgot-password-otp`**: Verifies password reset OTP.
- **`POST /api/auth/reset-password`**: Resets password using verified token.
- **`POST /api/auth/recover-account/request`** & **`POST /api/auth/recover-account/verify`**: Self-service recovery of soft-deleted accounts within the 15-day recovery window.

#### Authenticated Endpoints (`protect` middleware required)
- **`GET /api/auth/me`** (also `GET /api/auth/get-me`): Returns the current authenticated user record with profile summary and organization ID.
- **`POST /api/auth/change-password`** (also `PATCH /api/auth/change-password`): Rotates the user's password, automatically clears `mustChangePassword: false`, and invalidates cache.
- **`GET /api/auth/roles`**: Returns system roles descriptions (`admin`, `hr`, `employee`).
- **`GET /api/auth/permissions`**: Returns the granular module permission matrix for the active user role.

### Schemas Involved
- `users` ([`src/db/schema/users.schema.js`](../../server/src/db/schema/users.schema.js))
- `organizations` ([`src/db/schema/organizations.schema.js`](../../server/src/db/schema/organizations.schema.js))

---

## 2. Employee & Account Management Module

### Feature Description
Manages end-to-end employee lifecycle. Normal employees cannot self-register; accounts are provisioned exclusively by Admin or HR. Automatically generates standard company Login IDs, assigns temporary credentials, sends welcome emails, provisions initial leave allocations, and manages activation states.

### Routings & API Contracts
All routes are mounted under `/api/employees`.

- **`POST /api/employees`** (Admin/HR): Creates employee record, generates deterministic Login ID (`OIJODO20220001`) via atomic sequence, hashes temporary password, creates linked user account with `mustChangePassword: true`, initializes default leave balances, and sends welcome email.
- **`GET /api/employees`**: Search and filter employee directory with pagination, supporting `search` (name, email, code), `department`, `status`, `managerId`.
- **`GET /api/employees/:employeeId`**: Retrieves employee record by ID.
- **`PATCH /api/employees/:employeeId`** (Admin/HR): Updates employee administrative fields.
- **`DELETE /api/employees/:employeeId`** (Admin/HR): Soft-deletes employee, marks linked user account deleted, and records audit trail.
- **`POST /api/employees/:employeeId/activate`** (Admin/HR): Activates account.
- **`POST /api/employees/:employeeId/deactivate`** (Admin/HR): Deactivates account, preventing login.
- **`POST /api/employees/:employeeId/reset-password`** (Admin/HR): Generates new temporary password, resets `mustChangePassword: true`, and emails credentials to employee.

### Schemas Involved
- `employees`, `employeeCodeSequences`, `employeePrivateInfo` ([`src/db/schema/employees.schema.js`](../../server/src/db/schema/employees.schema.js))

---

## 3. Employee Profile Management Module

### Feature Description
Provides self-service profile access for employees and comprehensive administrative profile oversight for HR/Admins. Enforces strict field-level write permissions (e.g. employees can edit phone, avatar, bio, skills, but cannot modify salary, department, or manager).

### Routings & API Contracts
Mounted under `/api/profile` (self-service) and `/api/employees/:employeeId` (administrative).

- **`GET /api/profile/me`**: Returns current employee profile, work details, skills, and resume.
- **`PATCH /api/profile/me`**: Self-service profile updates restricted to allowed personal fields.
- **`POST /api/profile/me/avatar`**: Uploads profile picture to ImageKit CDN storage.
- **`DELETE /api/profile/me/avatar`**: Resets avatar to default.
- **`GET /api/profile/me/private-info`**: Retrieves residential address, personal email, nationality, emergency contact, and masked bank/identifier details.
- **`PATCH /api/profile/me/private-info`**: Updates personal private details.
- **`GET /api/employees/:employeeId/profile`** (Admin/HR): Complete admin view of employee.
- **`PATCH /api/employees/:employeeId/profile`** (Admin/HR): Admin update of employee details.
- **`GET /api/employees/:employeeId/private-info`** (Admin/HR): View sensitive employee identifiers & bank info.
- **`PATCH /api/employees/:employeeId/bank-account`** (Admin/HR): Upserts bank account details.
- **`PATCH /api/employees/:employeeId/identifiers`** (Admin/HR): Upserts PAN, UAN, Aadhaar securely.

---

## 4. Attendance Management Module

### Feature Description
Captures employee time logs (check-in / check-out), calculates net work duration, breaks, and overtime against assigned work schedules. Provides regularization workflows for missing punches and admin corrections. Directly supplies attendance metrics to the payroll calculation engine.

### Routings & API Contracts
Mounted under `/api/attendance`.

- **`POST /api/attendance/check-in`**: Records punch-in for today with late arrival tracking. Prevents duplicate check-ins.
- **`POST /api/attendance/check-out`**: Closes active session, computes work minutes, break minutes, overtime, and final status (`present`, `half_day`, `incomplete`).
- **`GET /api/attendance/me`**: Retrieves current employee's monthly attendance logs.
- **`GET /api/attendance/me/summary`**: Returns monthly totals (present, absent, leaves, overtime).
- **`GET /api/attendance`** (Admin/HR): Organization-wide attendance ledger with date range & department filters.
- **`GET /api/attendance/summary`** (Admin/HR): Organization-wide attendance statistics for today.
- **`GET /api/attendance/employee/:employeeId`** (Admin/HR): Specific employee's attendance history.
- **`GET /api/attendance/:attendanceId`**: Single attendance session details.
- **`POST /api/attendance/:attendanceId/adjust`**: Submits attendance adjustment request for manager/HR review.
- **`GET /api/attendance/adjustments/me`**: Lists employee's adjustment requests.
- **`GET /api/attendance/adjustments`** (Admin/HR): Inbox of pending regularization requests.
- **`PATCH /api/attendance/adjustments/:adjustmentId`** (Admin/HR): Approves or rejects adjustment, updating attendance record accordingly.
- **`PATCH /api/attendance/:attendanceId`** (Admin/HR): Direct manual correction of attendance records.

### Schemas Involved
- `attendanceRecords`, `attendanceSessions`, `attendanceAdjustments` ([`src/db/schema/attendance.schema.js`](../../server/src/db/schema/attendance.schema.js))

---

## 5. Time-Off / Leave Management Module

### Feature Description
Manages leave types (Paid Time Off, Sick Leave, Unpaid Leave), allocations, multi-day requests, balance deductions, overlapping date validations, and ledger transaction tracking. Balance is deducted **only upon approval** and restored upon cancellation.

### Routings & API Contracts
Mounted under `/api/leave`.

- **`GET /api/leave/types`**: Lists active leave types and rules.
- **`POST /api/leave/types`** (Admin/HR): Creates new leave type definition.
- **`PATCH /api/leave/types/:typeId`** (Admin/HR): Updates leave type rules.
- **`GET /api/leave/balances/me`**: Retrieves current employee leave balances (allocated, used, remaining).
- **`GET /api/leave/balances/employee/:employeeId`** (Admin/HR): Retrieves employee leave balances.
- **`POST /api/leave/allocations`** (Admin/HR): Credits leave days to employee allocation account.
- **`POST /api/leave/requests`**: Submits leave request with date range, half-day specifier, and reason. Validates sufficient balance and checks for date overlaps.
- **`GET /api/leave/requests/me`**: Current employee's leave requests history.
- **`GET /api/leave/requests/:requestId`**: Leave request details.
- **`PATCH /api/leave/requests/:requestId/cancel`**: Cancels pending or approved leave (restores allocated balance if approved).
- **`GET /api/leave/requests`** (Admin/HR): Approval inbox of leave requests.
- **`POST /api/leave/requests/:requestId/approve`** (Admin/HR): Approves leave request, decrements balance, and records transaction in ledger within DB transaction.
- **`POST /api/leave/requests/:requestId/reject`** (Admin/HR): Rejects leave request with comments.

### Schemas Involved
- `leaveTypes`, `leaveAllocations`, `leaveRequests`, `leaveTransactions` ([`src/db/schema/leave.schema.js`](../../server/src/db/schema/leave.schema.js))

---

## 6. Salary & Compensation Management Module

### Feature Description
Configures sensitive employee salary structures, fixed/hourly wage components, dynamic calculation rules (Basic % of wage, HRA % of basic, standard allowances, bonuses, LTA, residual Fixed allowance), and statutory deductions (Employee PF, Employer PF, Professional Tax). Access is strictly restricted to Admin role.

### Routings & API Contracts
Mounted under `/api/payroll` and `/api/employees/:employeeId/salary`.

- **`GET /api/payroll/components`** (Admin/HR): Lists organization salary component definitions.
- **`POST /api/payroll/components`** (Admin/HR): Defines salary component (earning, deduction, employer contribution).
- **`GET /api/payroll/salary/:employeeId`** (or `GET /api/employees/:employeeId/salary`): Retrieves active salary structure and component breakdown for employee.
- **`POST /api/payroll/salary/:employeeId`** (or `POST /api/employees/:employeeId/salary`) (Admin): Sets or updates salary structure. Validates earnings sum does not exceed monthly wage and saves revision history.

### Calculation Engine Rules
1. **Basic**: Percentage of monthly wage (default 50%).
2. **HRA**: Percentage of Basic (default 50%).
3. **Allowances**: Standard allowance, Performance bonus, LTA.
4. **Fixed Allowance (Residual)**: `Wage - Sum(defined earnings)`.
5. **Employee PF**: 12% of Basic.
6. **Employer PF**: 12% of Basic.
7. **Professional Tax**: ₹200/month.

---

## 7. Payroll & Payslip Management Module

### Feature Description
Executes monthly payroll runs, bridges attendance and approved leaves to compute payable days vs unpaid days, applies proportional salary deductions, calculates net pay, transitions run states (`draft` -> `processing` -> `calculated` -> `finalized` -> `paid`), and compiles chromium-free PDF payslips.

### Routings & API Contracts
Mounted under `/api/payroll`.

- **`GET /api/payroll/periods`** (Admin/HR): Lists payroll cycles.
- **`POST /api/payroll/periods`** (Admin/HR): Creates new payroll cycle for period (e.g. `2026-08-01` to `2026-08-31`).
- **`POST /api/payroll/periods/:id/process`** (Admin/HR): Processes period: queries attendance and leave summaries, calculates payable days, computes salary components, generates payslip records and itemized line breakdown.
- **`POST /api/payroll/periods/:id/finalize`** (Admin/HR): Locks period and payslips to finalized state.
- **`GET /api/payroll/payslips`**: Lists payslips (filtered for employee self-service or across organization for Admin/HR).
- **`GET /api/payroll/payslips/:id`**: Itemized payslip breakdown, employee metadata, and attendance statistics.
- **`GET /api/payroll/payslips/:id/download`**: Streams or downloads compiled PDF payslip (`?inline=true` for browser preview).

### Payable Days Formulation
$$\text{Payable Days} = \text{Present Days} + \text{Paid Leave Days} + \text{Holidays} + \text{Weekends}$$
$$\text{Unpaid Days} = \text{Absent Days} + \text{Unpaid Leave Days} + \text{Half Days (unpaid portion)}$$
$$\text{Unpaid Day Deduction} = \left(\frac{\text{Monthly Wage}}{\text{Working Days Basis}}\right) \times \text{Unpaid Days}$$
$$\text{Net Pay} = \text{Gross Earnings} - \text{Total Employee Deductions} - \text{Unpaid Day Deduction}$$

---

## 8. Dashboard & Workforce Overview Module

### Feature Description
Provides executive analytics for Admin/HR and self-service status overview for employees. Includes dedicated granular endpoints for Attendance, Leaves, Employees headcount, and Payroll trends.

### Routings & API Contracts
Mounted under `/api/dashboard`.

- **`GET /api/dashboard`**: Smart root endpoint returning executive analytics for Admin/HR or self-service dashboard for Employees.
- **`GET /api/dashboard/admin`** (Admin/HR): Master executive overview.
- **`GET /api/dashboard/employee`**: Employee self-service punch, balance, and notification stats.
- **`GET /api/dashboard/attendance`** (Admin/HR): Today's attendance counters, 7-day trend, pending adjustments.
- **`GET /api/dashboard/leave`** (Admin/HR): Pending leave approvals, annual leave distribution by type.
- **`GET /api/dashboard/employees`** (Admin/HR): Headcount summary (active, probation, on-leave), department breakdown, employment type split.
- **`GET /api/dashboard/payroll`** (Admin/HR): Latest payroll period metrics, total gross, deductions, and net payouts.

---

## 9. Company & HR Configuration Module

### Feature Description
Manages organizational entities, locations, departments, job positions, customizable work schedules (shift times, working days, weekends), company holidays calendar, leave policies, and payroll settings.

### Routings & API Contracts
Mounted under `/api/companies`, `/api/company`, and `/api/settings`.

- **`GET /api/companies/my`** (or `GET /api/company/my`): Returns active company details.
- **`PATCH /api/companies/:id`** (Admin/HR): Updates company details.
- **`GET /api/companies/:id/locations`** & **`POST /api/companies/:id/locations`**: Locations management.
- **`GET /api/companies/:id/departments`** & **`POST /api/companies/:id/departments`**: Departments management.
- **`GET /api/companies/:id/job-positions`** & **`POST /api/companies/:id/job-positions`**: Job positions management.
- **`GET /api/companies/:id/schedules`** & **`POST /api/companies/:id/schedules`**: Shift & work schedule configuration.
- **`GET /api/companies/:id/holidays`** & **`POST /api/companies/:id/holidays`**: Holiday calendar management.
- **`GET /api/settings/payroll`** & **`PATCH /api/settings/payroll`** (Admin): Organization payroll rules (currency, payday, working days basis, PF rates, PT enabled).

---

## 10. Audit, Notifications & System Controls Module

### Feature Description
Records immutable audit trails for sensitive operations (employee creation, salary structure updates, attendance corrections, leave reviews, payroll finalizations) with actor IDs and IP addresses. Dispatches in-app notifications and email alerts.

### Routings & API Contracts
Mounted under `/api/audit-logs` and `/api/notifications`.

- **`GET /api/audit-logs`** (Admin/HR): Filterable audit log list.
- **`GET /api/audit-logs/stats`** (Admin/HR): Top actions and activity distribution.
- **`GET /api/audit-logs/entity/:entityType/:entityId`** (Admin/HR): Lifecycle change history for specific entity.
- **`GET /api/notifications`**: Lists user's notifications.
- **`GET /api/notifications/unread-count`**: Number of unread notifications.
- **`PATCH /api/notifications/:id/read`**: Marks notification as read.
- **`PATCH /api/notifications/read-all`**: Marks all notifications as read.
- **`POST /api/notifications/broadcast`** (Admin/HR): Dispatches announcement notification to all organization employees.

### Schemas Involved
- `auditLogs` ([`src/db/schema/audit.schema.js`](../../server/src/db/schema/audit.schema.js))
- `notifications` ([`src/db/schema/notifications.schema.js`](../../server/src/db/schema/notifications.schema.js))

---

## 11. AI Conversational Chat Module

### Feature Description
Provides real-time conversational streaming and chat replies utilizing Google Gemini models, integrated search capabilities (Tavily), message history logging, and file attachment handling.

### Routings & API Contracts
Mounted under `/api/ai`.

- **`POST /api/ai/chat/stream`**: Starts real-time streaming response for a conversational query (SSE).
- **`POST /api/ai/chat/once`**: Returns a full non-streaming AI response block.
- **`GET /api/ai/chats`**: Retrieves all conversations associated with the logged-in user.
- **`GET /api/ai/chats/:chatId`**: Retrieves a specific chat thread containing all messages.
- **`PATCH /api/ai/chats/:chatId`**: Renames the conversation thread title.
- **`DELETE /api/ai/chats/:chatId`**: Permanently deletes a chat conversation.
- **`POST /api/ai/chat/upload`**: Uploads message attachments to CDN storage (ImageKit).

---

## 12. RAG Ingestion & Vector Retrieval Module

### Feature Description
Converts uploaded reference documents into structured semantic markdown, splits them into indexed chunks, embeds texts, and executes localized vector searches in Pinecone.

### Routings & API Contracts
Mounted under `/api/rag`.

- **`POST /api/rag/admin/upload`**: Uploads administrative reference document for global RAG lookup.
- **`DELETE /api/rag/admin/chunks`**: Clears global and user-uploaded chunks from database caches and vector indices.

---

## 13. Chromium-Free PDF Generation Module

### Feature Description
Compiles application data and HTML layouts into static lightweight PDF document streams without the overhead of heavy headless web browsers using `html-pdf-lite` and `@resvg/resvg-js`.

### Routings & API Contracts
Mounted under `/api/pdf`.

- **`GET /api/pdf/invoice/:id`**: Compiles transaction details and generates invoice PDF (`?inline=true` supported).
- **`GET /api/pdf/invoice/:id/preview`**: HTML markup preview.
- **`GET /api/pdf/receipt/:id`**: Payment receipt PDF.
- **`POST /api/pdf/render`**: Compiles raw custom HTML template into a PDF buffer.

# Feature 07: Payroll & Payslip Management API

> Covers monthly payroll cycles, attendance-derived payable days computation, payslip generation, finalizing runs, and PDF downloads.

## 📋 Endpoints Overview

| Method | Endpoint                                                             | Scenario                        | Status |
| :----- | :------------------------------------------------------------------- | :------------------------------ | :----- |
| `POST` | `/api/payroll/periods`                                               | Create Payroll Period (Admin)   | `201`  |
| `GET`  | `/api/payroll/periods`                                               | List Payroll Periods (Admin)    | `200`  |
| `POST` | `/api/payroll/periods/50b93a88-cf43-48d4-a519-70f21a44a73c/process`  | Process Payroll Period (Admin)  | `500`  |
| `POST` | `/api/payroll/periods/50b93a88-cf43-48d4-a519-70f21a44a73c/finalize` | Finalize Payroll Period (Admin) | `500`  |
| `GET`  | `/api/payroll/payslips`                                              | List Period Payslips (Admin)    | `200`  |

---

## 🔍 Detailed Scenarios & Outputs

### 1. Create Payroll Period (Admin)

- **Endpoint**: `POST /api/payroll/periods`
- **Expected Status**: `201`
- **Headers**:

```json
{
  "Cookie": "token=JWT_ADMIN_TOKEN"
}
```

- **Request Body**:

```json
{
  "periodStart": "2077-01-01",
  "periodEnd": "2077-01-31"
}
```

- **Response Body**:

```json
{
  "message": "Payroll period created successfully",
  "success": true,
  "error": null,
  "data": {
    "period": {
      "id": "50b93a88-cf43-48d4-a519-70f21a44a73c",
      "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
      "periodStart": "2077-01-01",
      "periodEnd": "2077-01-31",
      "status": "draft",
      "processedAt": null,
      "finalizedAt": null,
      "createdBy": "9b4c687e-7bef-4121-9c2e-3e588504f25e",
      "createdAt": "2026-08-29T10:07:47.027Z"
    }
  }
}
```

> **Note**: Initializes new payroll processing cycle in draft state.

---

### 2. List Payroll Periods (Admin)

- **Endpoint**: `GET /api/payroll/periods`
- **Expected Status**: `200`
- **Headers**:

```json
{
  "Cookie": "token=JWT_ADMIN_TOKEN"
}
```

- **Response Body**:

```json
{
  "message": "Payroll periods retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "periods": [
      {
        "id": "50b93a88-cf43-48d4-a519-70f21a44a73c",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "periodStart": "2077-01-01",
        "periodEnd": "2077-01-31",
        "status": "draft",
        "processedAt": null,
        "finalizedAt": null,
        "createdBy": "9b4c687e-7bef-4121-9c2e-3e588504f25e",
        "createdAt": "2026-08-29T10:07:47.027Z"
      },
      {
        "id": "f928ff0c-ee1a-45b2-a13d-d2b974b697dd",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "periodStart": "2071-01-01",
        "periodEnd": "2071-01-31",
        "status": "draft",
        "processedAt": null,
        "finalizedAt": null,
        "createdBy": "bdcb12bf-63e1-4010-b4ab-27c4caff2d64",
        "createdAt": "2026-08-29T09:19:41.351Z"
      },
      {
        "id": "3c893b2e-e6e7-441c-ac5e-e75aed97a741",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "periodStart": "2069-01-01",
        "periodEnd": "2069-01-31",
        "status": "draft",
        "processedAt": null,
        "finalizedAt": null,
        "createdBy": "537eafc2-3a67-43ef-8e01-9609910fe772",
        "createdAt": "2026-08-29T10:05:21.012Z"
      },
      {
        "id": "02684ef8-f29d-4e63-a225-02069f8d3faf",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "periodStart": "2060-01-01",
        "periodEnd": "2060-01-31",
        "status": "draft",
        "processedAt": null,
        "finalizedAt": null,
        "createdBy": "0ca154d2-5e5d-46b2-986c-f432d422cedc",
        "createdAt": "2026-08-29T09:29:24.654Z"
      }
    ]
  }
}
```

> **Note**: Retrieves all historical and upcoming payroll cycles.

---

### 3. Process Payroll Period (Admin)

- **Endpoint**: `POST /api/payroll/periods/50b93a88-cf43-48d4-a519-70f21a44a73c/process`
- **Expected Status**: `500`
- **Headers**:

```json
{
  "Cookie": "token=JWT_ADMIN_TOKEN"
}
```

- **Response Body**:

```json
{
  "message": "values() must be called with at least one value",
  "success": false,
  "error": "Error: values() must be called with at least one value\n    at PgInsertBuilder.values (C:\\Users\\Aman\\Desktop\\HRMS\\server\\node_modules\\src\\pg-core\\query-builders\\insert.ts:89:10)\n    at Module.createPayslipLines (C:\\Users\\Aman\\Desktop\\HRMS\\server\\src\\dao\\payroll.dao.js:298:46)\n    at C:\\Users\\Aman\\Desktop\\HRMS\\server\\src\\services\\payroll.service.js:632:30\n    at processTicksAndRejections (node:internal/process/task_queues:105:5)\n    at NodePgSession.transaction (C:\\Users\\Aman\\Desktop\\HRMS\\server\\node_modules\\src\\node-postgres\\session.ts:259:19)\n    at Module.processPayrollPeriod (C:\\Users\\Aman\\Desktop\\HRMS\\server\\src\\services\\payroll.service.js:490:12)\n    at processPeriod (C:\\Users\\Aman\\Desktop\\HRMS\\server\\src\\modules\\payroll\\controllers\\payroll.controller.js:328:24)"
}
```

> **Note**: Executes payroll engine: aggregates attendance and leaves, computes payable days, applies unpaid deductions, and computes net pay.

---

### 4. Finalize Payroll Period (Admin)

- **Endpoint**: `POST /api/payroll/periods/50b93a88-cf43-48d4-a519-70f21a44a73c/finalize`
- **Expected Status**: `500`
- **Headers**:

```json
{
  "Cookie": "token=JWT_ADMIN_TOKEN"
}
```

- **Response Body**:

```json
{
  "message": "Only calculated or processing payroll periods can be finalized",
  "success": false,
  "error": "Error: Only calculated or processing payroll periods can be finalized\n    at C:\\Users\\Aman\\Desktop\\HRMS\\server\\src\\services\\payroll.service.js:674:19\n    at processTicksAndRejections (node:internal/process/task_queues:105:5)\n    at NodePgSession.transaction (C:\\Users\\Aman\\Desktop\\HRMS\\server\\node_modules\\src\\node-postgres\\session.ts:259:19)\n    at Module.finalizePayrollPeriod (C:\\Users\\Aman\\Desktop\\HRMS\\server\\src\\services\\payroll.service.js:668:12)\n    at finalizePeriod (C:\\Users\\Aman\\Desktop\\HRMS\\server\\src\\modules\\payroll\\controllers\\payroll.controller.js:344:24)"
}
```

> **Note**: Locks payroll run and transitions all payslips to finalized status.

---

### 5. List Period Payslips (Admin)

- **Endpoint**: `GET /api/payroll/payslips`
- **Expected Status**: `200`
- **Headers**:

```json
{
  "Cookie": "token=JWT_ADMIN_TOKEN"
}
```

- **Query Parameters**:

```json
{
  "payrollPeriodId": "50b93a88-cf43-48d4-a519-70f21a44a73c"
}
```

- **Response Body**:

```json
{
  "message": "Payslips retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "payslips": []
  }
}
```

> **Note**: Retrieves all generated payslips for the target payroll cycle.

---

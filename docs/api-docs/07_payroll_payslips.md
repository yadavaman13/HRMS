# Feature 07: Payroll & Payslip Management API

> Covers monthly payroll cycles, attendance-derived payable days computation, payslip generation, finalizing runs, and PDF downloads.

## 📋 Endpoints Overview

| Method | Endpoint               | Scenario                      | Status |
| :----- | :--------------------- | :---------------------------- | :----- |
| `POST` | `/api/payroll/periods` | Create Payroll Period (Admin) | `500`  |
| `GET`  | `/api/payroll/periods` | List Payroll Periods (Admin)  | `200`  |

---

## 🔍 Detailed Scenarios & Outputs

### 1. Create Payroll Period (Admin)

- **Endpoint**: `POST /api/payroll/periods`
- **Expected Status**: `500`
- **Headers**:

```json
{
  "Cookie": "token=JWT_ADMIN_TOKEN"
}
```

- **Request Body**:

```json
{
  "periodStart": "2051-01-01",
  "periodEnd": "2051-01-31"
}
```

- **Response Body**:

```json
{
  "message": "Failed query: insert into \"payroll_periods\" (\"id\", \"organization_id\", \"period_start\", \"period_end\", \"status\", \"processed_at\", \"finalized_at\", \"created_by\", \"created_at\") values (default, $1, $2, $3, $4, default, default, $5, default) returning \"id\", \"organization_id\", \"period_start\", \"period_end\", \"status\", \"processed_at\", \"finalized_at\", \"created_by\", \"created_at\"\nparams: 144f96a2-86b3-422d-88b1-9fd2a825e9e1,2051-01-01,2051-01-31,draft,0ae4c1ff-a37f-42cc-bb95-8e4de98e255b",
  "success": false,
  "error": "Error: Failed query: insert into \"payroll_periods\" (\"id\", \"organization_id\", \"period_start\", \"period_end\", \"status\", \"processed_at\", \"finalized_at\", \"created_by\", \"created_at\") values (default, $1, $2, $3, $4, default, default, $5, default) returning \"id\", \"organization_id\", \"period_start\", \"period_end\", \"status\", \"processed_at\", \"finalized_at\", \"created_by\", \"created_at\"\nparams: 144f96a2-86b3-422d-88b1-9fd2a825e9e1,2051-01-01,2051-01-31,draft,0ae4c1ff-a37f-42cc-bb95-8e4de98e255b\n    at NodePgPreparedQuery.queryWithCache (/home/aryan-patel/workspace/hackathon/HRMS/server/node_modules/src/pg-core/session.ts:73:11)\n    at processTicksAndRejections (node:internal/process/task_queues:104:5)\n    at /home/aryan-patel/workspace/hackathon/HRMS/server/node_modules/src/node-postgres/session.ts:154:19\n    at Module.createPayrollPeriod (/home/aryan-patel/workspace/hackathon/HRMS/server/src/dao/payroll.dao.js:198:22)\n    at createPeriod (/home/aryan-patel/workspace/hackathon/HRMS/server/src/modules/payroll/controllers/payroll.controller.js:357:24)"
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
        "id": "a29c0425-6d43-4580-b5bb-e752fb240114",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2077-01-01",
        "periodEnd": "2077-01-31",
        "status": "draft",
        "processedAt": null,
        "finalizedAt": null,
        "createdBy": "87aace39-8caf-4bc5-83a3-2c418c7b4385",
        "createdAt": "2026-08-30T16:04:59.039Z"
      },
      {
        "id": "24a3d937-56b8-43bc-a2ca-dc96a834a53b",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2076-01-01",
        "periodEnd": "2076-01-31",
        "status": "draft",
        "processedAt": null,
        "finalizedAt": null,
        "createdBy": "12601b5d-e5c0-4e21-b2e9-d3e5c52df21f",
        "createdAt": "2026-08-30T15:51:31.430Z"
      },
      {
        "id": "2abeac56-ec02-4c01-9ab0-db52bd67dc89",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2071-01-01",
        "periodEnd": "2071-01-31",
        "status": "draft",
        "processedAt": null,
        "finalizedAt": null,
        "createdBy": "f7aa068b-c3d4-4b0f-9595-0e0ac43152e7",
        "createdAt": "2026-08-30T16:39:53.532Z"
      },
      {
        "id": "2af8ac9b-7a13-44f3-af83-e422d955b7fd",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2068-01-01",
        "periodEnd": "2068-01-31",
        "status": "draft",
        "processedAt": null,
        "finalizedAt": null,
        "createdBy": "e739ba6f-9e86-466d-b9fd-312e7b32428f",
        "createdAt": "2026-08-30T16:19:41.581Z"
      },
      {
        "id": "f95f1cd3-202a-42e5-b10b-b1fdb1fb89db",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2067-01-01",
        "periodEnd": "2067-01-31",
        "status": "calculated",
        "processedAt": "2026-08-30T17:05:47.804Z",
        "finalizedAt": null,
        "createdBy": "48345896-5f38-41bd-a8ee-050c4244125a",
        "createdAt": "2026-08-30T17:03:56.530Z"
      },
      {
        "id": "0584f63a-f7a5-4acc-96d5-f194e93e2665",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2066-01-01",
        "periodEnd": "2066-01-31",
        "status": "finalized",
        "processedAt": "2026-08-30T15:40:57.472Z",
        "finalizedAt": "2026-08-30T15:40:58.769Z",
        "createdBy": "e20a274c-b9ef-4838-b24c-09ffde590de6",
        "createdAt": "2026-08-30T15:39:58.886Z"
      },
      {
        "id": "9f560cd9-9227-474d-835a-4b35b94d5067",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2062-01-01",
        "periodEnd": "2062-01-31",
        "status": "draft",
        "processedAt": null,
        "finalizedAt": null,
        "createdBy": "8ccee290-01f1-4868-83ee-73b980345663",
        "createdAt": "2026-08-30T17:02:31.359Z"
      },
      {
        "id": "6d0868d6-ed9e-4865-a741-9bb4edcb4166",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2061-01-01",
        "periodEnd": "2061-01-31",
        "status": "draft",
        "processedAt": null,
        "finalizedAt": null,
        "createdBy": "7d4bcebc-81ad-428c-ad42-50ae77b9ae1e",
        "createdAt": "2026-08-30T09:42:23.245Z"
      },
      {
        "id": "a4433c77-47ac-4495-aaa9-2014c7d07109",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2059-01-01",
        "periodEnd": "2059-01-31",
        "status": "finalized",
        "processedAt": "2026-08-30T15:01:33.063Z",
        "finalizedAt": "2026-08-30T15:01:35.317Z",
        "createdBy": "12292c89-4864-44da-bf87-abb0a686a72a",
        "createdAt": "2026-08-30T15:00:37.422Z"
      },
      {
        "id": "12562ec7-31f9-4174-a576-d5138fbd5cd5",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2057-01-01",
        "periodEnd": "2057-01-31",
        "status": "finalized",
        "processedAt": "2026-08-30T10:17:36.190Z",
        "finalizedAt": "2026-08-30T10:17:37.555Z",
        "createdBy": "099ef189-d0ba-40c0-877c-87486c9b95d6",
        "createdAt": "2026-08-30T10:17:12.683Z"
      },
      {
        "id": "13d9316e-d30d-48e9-bad4-8fe63e1df602",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2054-01-01",
        "periodEnd": "2054-01-31",
        "status": "draft",
        "processedAt": null,
        "finalizedAt": null,
        "createdBy": "9543a836-1afe-4e29-a038-018eb1cce799",
        "createdAt": "2026-08-30T09:52:53.396Z"
      },
      {
        "id": "fa02f5f9-8ff7-4f30-9a1b-cbb4d97941fc",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2051-01-01",
        "periodEnd": "2051-01-31",
        "status": "finalized",
        "processedAt": "2026-08-30T15:15:31.024Z",
        "finalizedAt": "2026-08-30T15:15:32.254Z",
        "createdBy": "d64f5753-afdb-4c45-86f4-2b6a9f4c180e",
        "createdAt": "2026-08-30T15:14:29.204Z"
      },
      {
        "id": "a5bda2b8-c373-497a-a7e8-aa89190e1588",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2050-01-01",
        "periodEnd": "2050-01-31",
        "status": "finalized",
        "processedAt": "2026-08-30T10:30:25.618Z",
        "finalizedAt": "2026-08-30T10:30:27.044Z",
        "createdBy": "a6747a74-d260-4619-b24a-9bce284efa27",
        "createdAt": "2026-08-30T10:29:56.015Z"
      },
      {
        "id": "9f9b98e2-8e6a-4853-80f6-cd412c682343",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2047-01-01",
        "periodEnd": "2047-01-31",
        "status": "draft",
        "processedAt": null,
        "finalizedAt": null,
        "createdBy": "799fc205-3d93-4a37-a7d1-80060c800908",
        "createdAt": "2026-08-30T16:33:14.532Z"
      },
      {
        "id": "10b50039-7f69-4bc8-91bb-ad3b1f0d6294",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2042-01-01",
        "periodEnd": "2042-01-31",
        "status": "calculated",
        "processedAt": "2026-08-30T15:30:29.941Z",
        "finalizedAt": null,
        "createdBy": "b3347858-ac22-4203-a790-8dabba225fe4",
        "createdAt": "2026-08-30T15:29:27.113Z"
      },
      {
        "id": "36e57691-89a3-4fa2-ba6f-4657df3f1918",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2040-01-01",
        "periodEnd": "2040-01-31",
        "status": "draft",
        "processedAt": null,
        "finalizedAt": null,
        "createdBy": "c4785ad6-f438-4ae2-b3a7-7d90052aaa71",
        "createdAt": "2026-08-30T17:00:03.714Z"
      },
      {
        "id": "ef3a07ab-38b1-4bd5-abec-5d1b2e2f3642",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2037-01-01",
        "periodEnd": "2037-01-31",
        "status": "draft",
        "processedAt": null,
        "finalizedAt": null,
        "createdBy": "b4ea4acc-67ef-4e2f-9ec4-03bdc60d5734",
        "createdAt": "2026-08-30T10:04:05.561Z"
      },
      {
        "id": "2b20c2d9-ff6e-4f2a-bc22-25d81a9ddbc5",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2030-01-01",
        "periodEnd": "2030-01-31",
        "status": "finalized",
        "processedAt": "2026-08-30T15:04:21.440Z",
        "finalizedAt": "2026-08-30T15:04:23.144Z",
        "createdBy": "9528c461-e4ec-4e9d-9445-10715b408576",
        "createdAt": "2026-08-30T15:03:20.028Z"
      }
    ]
  }
}
```

> **Note**: Retrieves all historical and upcoming payroll cycles.

---

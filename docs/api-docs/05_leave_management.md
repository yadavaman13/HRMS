# Feature 05: Time-Off / Leave Management API

> Covers leave types configuration, double-entry balance allocations, ledger transactions, leave applications, date overlap validation, and manager approval/rejection workflows.

## 📋 Endpoints Overview

| Method  | Endpoint                                                                | Scenario                                   | Status |
| :------ | :---------------------------------------------------------------------- | :----------------------------------------- | :----- |
| `GET`   | `/api/leave/types`                                                      | List Leave Types (Success)                 | `200`  |
| `POST`  | `/api/leave/types`                                                      | Create Leave Type (Admin)                  | `201`  |
| `GET`   | `/api/leave/types/c2a2927a-35ab-4415-827b-f280f5587bcf`                 | Get Leave Type by ID (Success)             | `200`  |
| `PATCH` | `/api/leave/types/c2a2927a-35ab-4415-827b-f280f5587bcf`                 | Update Leave Type (Admin)                  | `200`  |
| `GET`   | `/api/leave/balances/me`                                                | Get My Leave Balances (Success)            | `200`  |
| `GET`   | `/api/leave/balances/employee/5ccb9d8b-d6e2-467b-8d6c-d083800dba46`     | Get Employee Leave Balances (Admin)        | `200`  |
| `POST`  | `/api/leave/allocations`                                                | Allocate Leave Days (Admin)                | `201`  |
| `GET`   | `/api/leave/allocations/me`                                             | Get My Allocations History (Success)       | `200`  |
| `GET`   | `/api/leave/allocations/employee/5ccb9d8b-d6e2-467b-8d6c-d083800dba46`  | Get Employee Allocations (Admin)           | `200`  |
| `GET`   | `/api/leave/transactions/me`                                            | Get My Leave Ledger Transactions (Success) | `200`  |
| `GET`   | `/api/leave/transactions/employee/5ccb9d8b-d6e2-467b-8d6c-d083800dba46` | Get Employee Leave Ledger (Admin)          | `200`  |
| `POST`  | `/api/leave/requests`                                                   | Apply for Leave (Success)                  | `201`  |
| `GET`   | `/api/leave/requests/me`                                                | Get My Leave Requests (Success)            | `200`  |
| `GET`   | `/api/leave/requests`                                                   | Get Leave Approvals Inbox (Admin)          | `200`  |

---

## 🔍 Detailed Scenarios & Outputs

### 1. List Leave Types (Success)

- **Endpoint**: `GET /api/leave/types`
- **Expected Status**: `200`
- **Headers**:

```json
{
  "Cookie": "token=JWT_EMPLOYEE_TOKEN"
}
```

- **Response Body**:

```json
{
  "message": "Leave types retrieved successfully",
  "success": true,
  "error": null,
  "data": [
    {
      "id": "a82e825b-df23-4a21-9157-b924aa120560",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "CASUAL_1788082885746",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-30T09:41:26.408Z",
      "updatedAt": "2026-08-30T09:41:28.134Z"
    },
    {
      "id": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "CASUAL_1788083523308",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-30T09:52:03.954Z",
      "updatedAt": "2026-08-30T09:52:06.269Z"
    },
    {
      "id": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "CASUAL_1788083768714",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-30T09:56:09.382Z",
      "updatedAt": "2026-08-30T09:56:11.155Z"
    },
    {
      "id": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "CASUAL_1788084091667",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-30T10:01:32.279Z",
      "updatedAt": "2026-08-30T10:01:33.989Z"
    },
    {
      "id": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "CASUAL_1788084773277",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-30T10:12:53.921Z",
      "updatedAt": "2026-08-30T10:12:55.697Z"
    },
    {
      "id": "744a13fd-1838-4771-acd9-275285edb589",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "CASUAL_1788085737574",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-30T10:28:58.342Z",
      "updatedAt": "2026-08-30T10:29:00.156Z"
    },
    {
      "id": "f65f4aa5-28a3-4db5-9f67-0ac999df0c6e",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "CASUAL_1788099236806",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-30T14:13:57.499Z",
      "updatedAt": "2026-08-30T14:13:59.535Z"
    },
    {
      "id": "b431df60-253a-41a4-a822-946a11ede30e",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "CASUAL_1788101953267",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-30T14:59:13.940Z",
      "updatedAt": "2026-08-30T14:59:16.263Z"
    },
    {
      "id": "c3de17eb-687b-4b37-9feb-84a981c035ab",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "CASUAL_1788102118247",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-30T15:01:58.930Z",
      "updatedAt": "2026-08-30T15:02:00.753Z"
    },
    {
      "id": "41c1e56b-57d7-453c-9566-8214b2e155ac",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "CASUAL_1788102782922",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-30T15:13:03.721Z",
      "updatedAt": "2026-08-30T15:13:05.896Z"
    },
    {
      "id": "1d5c27f2-1e76-414a-9f3a-6251192b6700",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "CASUAL_1788103701714",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-30T15:28:22.366Z",
      "updatedAt": "2026-08-30T15:28:24.147Z"
    },
    {
      "id": "67033965-e743-4b4f-8a22-e83963669659",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "CASUAL_1788104338205",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-30T15:38:58.926Z",
      "updatedAt": "2026-08-30T15:39:00.609Z"
    },
    {
      "id": "e59e317a-e99b-4447-8422-e165162090bb",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "CASUAL_1788104986171",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-30T15:49:46.876Z",
      "updatedAt": "2026-08-30T15:49:49.059Z"
    },
    {
      "id": "031dfa32-ec1d-4e53-9b79-3293238a216b",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "CASUAL_1788105822180",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-30T16:03:42.865Z",
      "updatedAt": "2026-08-30T16:03:44.892Z"
    },
    {
      "id": "5d906089-6b69-4d04-beaf-f3c98e52204f",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "CASUAL_1788106684722",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-30T16:18:05.738Z",
      "updatedAt": "2026-08-30T16:18:07.867Z"
    },
    {
      "id": "31d51bf6-2a08-4608-b41a-a0c962da0bb5",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "CASUAL_1788107526856",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-30T16:32:07.476Z",
      "updatedAt": "2026-08-30T16:32:09.173Z"
    }
  ]
}
```

> **Note**: Returns active leave policies (Paid Time Off, Sick Leave, Unpaid Leave).

---

### 2. Create Leave Type (Admin)

- **Endpoint**: `POST /api/leave/types`
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
  "code": "CASUAL_1788110486141",
  "name": "Casual Leave",
  "isPaid": true,
  "maxConsecutiveDays": 5,
  "requiresAllocation": true
}
```

- **Response Body**:

```json
{
  "message": "Leave type created successfully",
  "success": true,
  "error": null,
  "data": {
    "id": "c2a2927a-35ab-4415-827b-f280f5587bcf",
    "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
    "code": "CASUAL_1788110486141",
    "name": "Casual Leave",
    "isPaid": true,
    "requiresAllocation": true,
    "requiresAttachment": false,
    "requiresApproval": true,
    "unit": "day",
    "isActive": true,
    "createdAt": "2026-08-30T17:21:27.893Z",
    "updatedAt": "2026-08-30T17:21:27.893Z"
  }
}
```

> **Note**: Defines new leave policy rules and allocations.

---

### 3. Get Leave Type by ID (Success)

- **Endpoint**: `GET /api/leave/types/c2a2927a-35ab-4415-827b-f280f5587bcf`
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
  "message": "Leave type retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "id": "c2a2927a-35ab-4415-827b-f280f5587bcf",
    "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
    "code": "CASUAL_1788110486141",
    "name": "Casual Leave",
    "isPaid": true,
    "requiresAllocation": true,
    "requiresAttachment": false,
    "requiresApproval": true,
    "unit": "day",
    "isActive": true,
    "createdAt": "2026-08-30T17:21:27.893Z",
    "updatedAt": "2026-08-30T17:21:27.893Z"
  }
}
```

> **Note**: Retrieves leave type definition and configuration parameters.

---

### 4. Update Leave Type (Admin)

- **Endpoint**: `PATCH /api/leave/types/c2a2927a-35ab-4415-827b-f280f5587bcf`
- **Expected Status**: `200`
- **Headers**:

```json
{
  "Cookie": "token=JWT_ADMIN_TOKEN"
}
```

- **Request Body**:

```json
{
  "maxConsecutiveDays": 7
}
```

- **Response Body**:

```json
{
  "message": "Leave type updated successfully",
  "success": true,
  "error": null,
  "data": {
    "id": "c2a2927a-35ab-4415-827b-f280f5587bcf",
    "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
    "code": "CASUAL_1788110486141",
    "name": "Casual Leave",
    "isPaid": true,
    "requiresAllocation": true,
    "requiresAttachment": false,
    "requiresApproval": true,
    "unit": "day",
    "isActive": true,
    "createdAt": "2026-08-30T17:21:27.893Z",
    "updatedAt": "2026-08-30T17:21:30.837Z"
  }
}
```

> **Note**: Updates constraints on maximum consecutive days and policy options.

---

### 5. Get My Leave Balances (Success)

- **Endpoint**: `GET /api/leave/balances/me`
- **Expected Status**: `200`
- **Headers**:

```json
{
  "Cookie": "token=JWT_EMPLOYEE_TOKEN"
}
```

- **Response Body**:

```json
{
  "message": "Leave balances retrieved successfully",
  "success": true,
  "error": null,
  "data": [
    {
      "leaveTypeId": "a82e825b-df23-4a21-9157-b924aa120560",
      "code": "CASUAL_1788082885746",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "unit": "day",
      "allocatedDays": 12,
      "usedDays": 0,
      "pendingDays": 0,
      "creditedDays": 0,
      "carryForwardDays": 0,
      "netBalance": 12,
      "availableBalance": 12
    },
    {
      "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
      "code": "CASUAL_1788083523308",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "unit": "day",
      "allocatedDays": 12,
      "usedDays": 0,
      "pendingDays": 0,
      "creditedDays": 0,
      "carryForwardDays": 0,
      "netBalance": 12,
      "availableBalance": 12
    },
    {
      "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
      "code": "CASUAL_1788083768714",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "unit": "day",
      "allocatedDays": 12,
      "usedDays": 0,
      "pendingDays": 0,
      "creditedDays": 0,
      "carryForwardDays": 0,
      "netBalance": 12,
      "availableBalance": 12
    },
    {
      "leaveTypeId": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
      "code": "CASUAL_1788084091667",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "unit": "day",
      "allocatedDays": 12,
      "usedDays": 0,
      "pendingDays": 0,
      "creditedDays": 0,
      "carryForwardDays": 0,
      "netBalance": 12,
      "availableBalance": 12
    },
    {
      "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
      "code": "CASUAL_1788084773277",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "unit": "day",
      "allocatedDays": 12,
      "usedDays": 0,
      "pendingDays": 0,
      "creditedDays": 0,
      "carryForwardDays": 0,
      "netBalance": 12,
      "availableBalance": 12
    },
    {
      "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
      "code": "CASUAL_1788085737574",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "unit": "day",
      "allocatedDays": 12,
      "usedDays": 0,
      "pendingDays": 0,
      "creditedDays": 0,
      "carryForwardDays": 0,
      "netBalance": 12,
      "availableBalance": 12
    },
    {
      "leaveTypeId": "f65f4aa5-28a3-4db5-9f67-0ac999df0c6e",
      "code": "CASUAL_1788099236806",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "unit": "day",
      "allocatedDays": 12,
      "usedDays": 0,
      "pendingDays": 0,
      "creditedDays": 0,
      "carryForwardDays": 0,
      "netBalance": 12,
      "availableBalance": 12
    },
    {
      "leaveTypeId": "b431df60-253a-41a4-a822-946a11ede30e",
      "code": "CASUAL_1788101953267",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "unit": "day",
      "allocatedDays": 12,
      "usedDays": 0,
      "pendingDays": 0,
      "creditedDays": 0,
      "carryForwardDays": 0,
      "netBalance": 12,
      "availableBalance": 12
    },
    {
      "leaveTypeId": "c3de17eb-687b-4b37-9feb-84a981c035ab",
      "code": "CASUAL_1788102118247",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "unit": "day",
      "allocatedDays": 12,
      "usedDays": 0,
      "pendingDays": 0,
      "creditedDays": 0,
      "carryForwardDays": 0,
      "netBalance": 12,
      "availableBalance": 12
    },
    {
      "leaveTypeId": "41c1e56b-57d7-453c-9566-8214b2e155ac",
      "code": "CASUAL_1788102782922",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "unit": "day",
      "allocatedDays": 12,
      "usedDays": 0,
      "pendingDays": 0,
      "creditedDays": 0,
      "carryForwardDays": 0,
      "netBalance": 12,
      "availableBalance": 12
    },
    {
      "leaveTypeId": "1d5c27f2-1e76-414a-9f3a-6251192b6700",
      "code": "CASUAL_1788103701714",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "unit": "day",
      "allocatedDays": 12,
      "usedDays": 0,
      "pendingDays": 0,
      "creditedDays": 0,
      "carryForwardDays": 0,
      "netBalance": 12,
      "availableBalance": 12
    },
    {
      "leaveTypeId": "67033965-e743-4b4f-8a22-e83963669659",
      "code": "CASUAL_1788104338205",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "unit": "day",
      "allocatedDays": 12,
      "usedDays": 0,
      "pendingDays": 0,
      "creditedDays": 0,
      "carryForwardDays": 0,
      "netBalance": 12,
      "availableBalance": 12
    },
    {
      "leaveTypeId": "e59e317a-e99b-4447-8422-e165162090bb",
      "code": "CASUAL_1788104986171",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "unit": "day",
      "allocatedDays": 12,
      "usedDays": 0,
      "pendingDays": 0,
      "creditedDays": 0,
      "carryForwardDays": 0,
      "netBalance": 12,
      "availableBalance": 12
    },
    {
      "leaveTypeId": "031dfa32-ec1d-4e53-9b79-3293238a216b",
      "code": "CASUAL_1788105822180",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "unit": "day",
      "allocatedDays": 12,
      "usedDays": 0,
      "pendingDays": 0,
      "creditedDays": 0,
      "carryForwardDays": 0,
      "netBalance": 12,
      "availableBalance": 12
    },
    {
      "leaveTypeId": "5d906089-6b69-4d04-beaf-f3c98e52204f",
      "code": "CASUAL_1788106684722",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "unit": "day",
      "allocatedDays": 12,
      "usedDays": 0,
      "pendingDays": 0,
      "creditedDays": 0,
      "carryForwardDays": 0,
      "netBalance": 12,
      "availableBalance": 12
    },
    {
      "leaveTypeId": "31d51bf6-2a08-4608-b41a-a0c962da0bb5",
      "code": "CASUAL_1788107526856",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "unit": "day",
      "allocatedDays": 12,
      "usedDays": 0,
      "pendingDays": 0,
      "creditedDays": 0,
      "carryForwardDays": 0,
      "netBalance": 12,
      "availableBalance": 12
    },
    {
      "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
      "code": "CASUAL_1788110486141",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "unit": "day",
      "allocatedDays": 0,
      "usedDays": 0,
      "pendingDays": 0,
      "creditedDays": 0,
      "carryForwardDays": 0,
      "netBalance": 0,
      "availableBalance": 0
    }
  ]
}
```

> **Note**: Returns remaining balances per leave category for the current year.

---

### 6. Get Employee Leave Balances (Admin)

- **Endpoint**: `GET /api/leave/balances/employee/5ccb9d8b-d6e2-467b-8d6c-d083800dba46`
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
  "message": "Employee leave balances retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "employee": {
      "id": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "firstName": "Diana",
      "lastName": "Prince",
      "employeeCode": "TESTDIPR20260117"
    },
    "balances": [
      {
        "leaveTypeId": "a82e825b-df23-4a21-9157-b924aa120560",
        "code": "CASUAL_1788082885746",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
        "code": "CASUAL_1788083523308",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
        "code": "CASUAL_1788083768714",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
        "code": "CASUAL_1788084091667",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
        "code": "CASUAL_1788084773277",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
        "code": "CASUAL_1788085737574",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "f65f4aa5-28a3-4db5-9f67-0ac999df0c6e",
        "code": "CASUAL_1788099236806",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "b431df60-253a-41a4-a822-946a11ede30e",
        "code": "CASUAL_1788101953267",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "c3de17eb-687b-4b37-9feb-84a981c035ab",
        "code": "CASUAL_1788102118247",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "41c1e56b-57d7-453c-9566-8214b2e155ac",
        "code": "CASUAL_1788102782922",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "1d5c27f2-1e76-414a-9f3a-6251192b6700",
        "code": "CASUAL_1788103701714",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "67033965-e743-4b4f-8a22-e83963669659",
        "code": "CASUAL_1788104338205",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "e59e317a-e99b-4447-8422-e165162090bb",
        "code": "CASUAL_1788104986171",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "031dfa32-ec1d-4e53-9b79-3293238a216b",
        "code": "CASUAL_1788105822180",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "5d906089-6b69-4d04-beaf-f3c98e52204f",
        "code": "CASUAL_1788106684722",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "31d51bf6-2a08-4608-b41a-a0c962da0bb5",
        "code": "CASUAL_1788107526856",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
        "code": "CASUAL_1788110486141",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 0,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 0,
        "availableBalance": 0
      }
    ]
  }
}
```

> **Note**: Allows HR/Admin to inspect leave balances for any employee.

---

### 7. Allocate Leave Days (Admin)

- **Endpoint**: `POST /api/leave/allocations`
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
  "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
  "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
  "daysAllocated": 12,
  "reason": "Annual policy allotment",
  "year": 2026
}
```

- **Response Body**:

```json
{
  "message": "Leave quota allocated successfully",
  "success": true,
  "error": null,
  "data": {
    "id": "f62740bd-47b7-42d5-a471-3ef92ef37299",
    "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
    "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
    "periodStart": "2026-01-01",
    "periodEnd": "2026-12-31",
    "allocatedDays": "12.00",
    "carriedForwardDays": "0.00",
    "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
    "createdAt": "2026-08-30T17:21:36.783Z",
    "updatedAt": "2026-08-30T17:21:36.783Z"
  }
}
```

> **Note**: Credits employee balance and registers double-entry allocation transaction in ledger.

---

### 8. Get My Allocations History (Success)

- **Endpoint**: `GET /api/leave/allocations/me`
- **Expected Status**: `200`
- **Headers**:

```json
{
  "Cookie": "token=JWT_EMPLOYEE_TOKEN"
}
```

- **Response Body**:

```json
{
  "message": "Allocations retrieved successfully",
  "success": true,
  "error": null,
  "data": [
    {
      "id": "75ed700c-fbcb-47a2-9a41-99269a8a331f",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "a82e825b-df23-4a21-9157-b924aa120560",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788082885746",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "efedb7b8-db11-4533-8072-60def127431c",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788083523308",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "5e8693b4-1b9d-41cb-84e4-e00058a85e30",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788083768714",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "04965b44-350b-44e1-b812-bea1a1270ca1",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084091667",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "a848855e-8a5d-4124-918c-5863dac49089",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084773277",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "305f778c-8f31-4c7c-8145-a29f3a168ab6",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788085737574",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "e196c2f7-df04-45d6-b46e-7089ab9f67c6",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "f65f4aa5-28a3-4db5-9f67-0ac999df0c6e",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788099236806",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "189103e6-da1b-471e-b7d6-22a341170533",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "b431df60-253a-41a4-a822-946a11ede30e",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788101953267",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "e89b7a0f-c548-4342-aee2-72948b423023",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "c3de17eb-687b-4b37-9feb-84a981c035ab",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788102118247",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "27ae864c-6aa5-4586-96b2-72f53c6a9693",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "41c1e56b-57d7-453c-9566-8214b2e155ac",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788102782922",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "0143fe44-24e3-4b2e-ad20-b8e8a5325232",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "1d5c27f2-1e76-414a-9f3a-6251192b6700",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788103701714",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "fba43734-4946-49a1-a7e9-03e9ca55077f",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "67033965-e743-4b4f-8a22-e83963669659",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788104338205",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "77769fe6-c76e-4d94-b474-834480334852",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "e59e317a-e99b-4447-8422-e165162090bb",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788104986171",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "d60cb4d0-4342-4baf-a37c-71c51e6aeea5",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "031dfa32-ec1d-4e53-9b79-3293238a216b",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788105822180",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "51668bfb-abc8-47ca-95d1-b7439f5fc588",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "5d906089-6b69-4d04-beaf-f3c98e52204f",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788106684722",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "8f0b28ee-f889-448f-b54e-645db6450852",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "31d51bf6-2a08-4608-b41a-a0c962da0bb5",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788107526856",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "f62740bd-47b7-42d5-a471-3ef92ef37299",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788110486141",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:36.783Z"
    }
  ]
}
```

> **Note**: Lists historical balance credits granted to employee.

---

### 9. Get Employee Allocations (Admin)

- **Endpoint**: `GET /api/leave/allocations/employee/5ccb9d8b-d6e2-467b-8d6c-d083800dba46`
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
  "message": "Employee allocations retrieved successfully",
  "success": true,
  "error": null,
  "data": [
    {
      "id": "75ed700c-fbcb-47a2-9a41-99269a8a331f",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "a82e825b-df23-4a21-9157-b924aa120560",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788082885746",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "efedb7b8-db11-4533-8072-60def127431c",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788083523308",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "5e8693b4-1b9d-41cb-84e4-e00058a85e30",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788083768714",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "04965b44-350b-44e1-b812-bea1a1270ca1",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084091667",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "a848855e-8a5d-4124-918c-5863dac49089",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084773277",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "305f778c-8f31-4c7c-8145-a29f3a168ab6",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788085737574",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "e196c2f7-df04-45d6-b46e-7089ab9f67c6",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "f65f4aa5-28a3-4db5-9f67-0ac999df0c6e",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788099236806",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "189103e6-da1b-471e-b7d6-22a341170533",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "b431df60-253a-41a4-a822-946a11ede30e",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788101953267",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "e89b7a0f-c548-4342-aee2-72948b423023",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "c3de17eb-687b-4b37-9feb-84a981c035ab",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788102118247",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "27ae864c-6aa5-4586-96b2-72f53c6a9693",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "41c1e56b-57d7-453c-9566-8214b2e155ac",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788102782922",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "0143fe44-24e3-4b2e-ad20-b8e8a5325232",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "1d5c27f2-1e76-414a-9f3a-6251192b6700",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788103701714",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "fba43734-4946-49a1-a7e9-03e9ca55077f",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "67033965-e743-4b4f-8a22-e83963669659",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788104338205",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "77769fe6-c76e-4d94-b474-834480334852",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "e59e317a-e99b-4447-8422-e165162090bb",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788104986171",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "d60cb4d0-4342-4baf-a37c-71c51e6aeea5",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "031dfa32-ec1d-4e53-9b79-3293238a216b",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788105822180",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "51668bfb-abc8-47ca-95d1-b7439f5fc588",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "5d906089-6b69-4d04-beaf-f3c98e52204f",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788106684722",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "8f0b28ee-f889-448f-b54e-645db6450852",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "31d51bf6-2a08-4608-b41a-a0c962da0bb5",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788107526856",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "f62740bd-47b7-42d5-a471-3ef92ef37299",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788110486141",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
      "createdAt": "2026-08-30T17:21:36.783Z"
    }
  ]
}
```

> **Note**: Administrative inspection of all granted allocations.

---

### 10. Get My Leave Ledger Transactions (Success)

- **Endpoint**: `GET /api/leave/transactions/me`
- **Expected Status**: `200`
- **Headers**:

```json
{
  "Cookie": "token=JWT_EMPLOYEE_TOKEN"
}
```

- **Response Body**:

```json
{
  "message": "Leave transactions retrieved successfully",
  "success": true,
  "error": null,
  "data": [
    {
      "id": "a93564a7-0596-4a5f-b9c8-75ddab10fe13",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788110486141",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "f62740bd-47b7-42d5-a471-3ef92ef37299",
      "description": "Annual policy allotment",
      "createdAt": "2026-08-30T17:21:36.783Z"
    },
    {
      "id": "002895bc-6ec7-45e0-afaa-cb51f5442b50",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788110486141",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "f62740bd-47b7-42d5-a471-3ef92ef37299",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:36.783Z"
    },
    {
      "id": "f82d6ac2-f328-40eb-aacb-f54eec389539",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788083768714",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "5e8693b4-1b9d-41cb-84e4-e00058a85e30",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "4d343f8e-f95d-4df0-a474-4a4aab15ade5",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084091667",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "04965b44-350b-44e1-b812-bea1a1270ca1",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "86bc56c2-9b1c-4c08-ad63-2aee846d4bda",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084773277",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "a848855e-8a5d-4124-918c-5863dac49089",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "bc12a152-6fdb-445a-a032-be2d1428235d",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788085737574",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "305f778c-8f31-4c7c-8145-a29f3a168ab6",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "5e6c48e5-f9b8-47b3-a66c-56e45ba4af3c",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "f65f4aa5-28a3-4db5-9f67-0ac999df0c6e",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788099236806",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "e196c2f7-df04-45d6-b46e-7089ab9f67c6",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "418895ab-029c-4dc9-864a-2505d3634262",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "b431df60-253a-41a4-a822-946a11ede30e",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788101953267",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "189103e6-da1b-471e-b7d6-22a341170533",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "aa49191e-1c7a-4633-a91d-52d72f07ec99",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "c3de17eb-687b-4b37-9feb-84a981c035ab",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788102118247",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "e89b7a0f-c548-4342-aee2-72948b423023",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "c70da013-f29f-4181-ac7f-1793905110f1",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "a82e825b-df23-4a21-9157-b924aa120560",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788082885746",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "75ed700c-fbcb-47a2-9a41-99269a8a331f",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "e89d6169-f9d8-4b24-8c50-644b3e53b979",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "1d5c27f2-1e76-414a-9f3a-6251192b6700",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788103701714",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "0143fe44-24e3-4b2e-ad20-b8e8a5325232",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "59368e9e-0c65-401b-8cc5-77ef87824602",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "67033965-e743-4b4f-8a22-e83963669659",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788104338205",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "fba43734-4946-49a1-a7e9-03e9ca55077f",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "4bc02a19-1664-4e7b-ae28-5f253028f9b8",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "e59e317a-e99b-4447-8422-e165162090bb",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788104986171",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "77769fe6-c76e-4d94-b474-834480334852",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "fbf3ed68-7702-40e0-8cd0-7ba6245ef77c",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "031dfa32-ec1d-4e53-9b79-3293238a216b",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788105822180",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "d60cb4d0-4342-4baf-a37c-71c51e6aeea5",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "39640960-dd35-4521-8a7f-a68a88c36f2a",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "5d906089-6b69-4d04-beaf-f3c98e52204f",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788106684722",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "51668bfb-abc8-47ca-95d1-b7439f5fc588",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "ac577cef-e1fc-4b56-ae6c-25aa121aca65",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "31d51bf6-2a08-4608-b41a-a0c962da0bb5",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788107526856",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "8f0b28ee-f889-448f-b54e-645db6450852",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "2ef9a8eb-be6d-42ae-acec-ed2707eab282",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "41c1e56b-57d7-453c-9566-8214b2e155ac",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788102782922",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "27ae864c-6aa5-4586-96b2-72f53c6a9693",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "bf0f245a-f259-4a06-b92e-ed7f29e768b9",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788083523308",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "efedb7b8-db11-4533-8072-60def127431c",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    }
  ]
}
```

> **Note**: Returns audit trail of balance debits and credits with reasons.

---

### 11. Get Employee Leave Ledger (Admin)

- **Endpoint**: `GET /api/leave/transactions/employee/5ccb9d8b-d6e2-467b-8d6c-d083800dba46`
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
  "message": "Employee leave transactions retrieved successfully",
  "success": true,
  "error": null,
  "data": [
    {
      "id": "a93564a7-0596-4a5f-b9c8-75ddab10fe13",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788110486141",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "f62740bd-47b7-42d5-a471-3ef92ef37299",
      "description": "Annual policy allotment",
      "createdAt": "2026-08-30T17:21:36.783Z"
    },
    {
      "id": "002895bc-6ec7-45e0-afaa-cb51f5442b50",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788110486141",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "f62740bd-47b7-42d5-a471-3ef92ef37299",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:36.783Z"
    },
    {
      "id": "f82d6ac2-f328-40eb-aacb-f54eec389539",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788083768714",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "5e8693b4-1b9d-41cb-84e4-e00058a85e30",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "4d343f8e-f95d-4df0-a474-4a4aab15ade5",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084091667",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "04965b44-350b-44e1-b812-bea1a1270ca1",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "86bc56c2-9b1c-4c08-ad63-2aee846d4bda",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084773277",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "a848855e-8a5d-4124-918c-5863dac49089",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "bc12a152-6fdb-445a-a032-be2d1428235d",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788085737574",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "305f778c-8f31-4c7c-8145-a29f3a168ab6",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "5e6c48e5-f9b8-47b3-a66c-56e45ba4af3c",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "f65f4aa5-28a3-4db5-9f67-0ac999df0c6e",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788099236806",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "e196c2f7-df04-45d6-b46e-7089ab9f67c6",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "418895ab-029c-4dc9-864a-2505d3634262",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "b431df60-253a-41a4-a822-946a11ede30e",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788101953267",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "189103e6-da1b-471e-b7d6-22a341170533",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "aa49191e-1c7a-4633-a91d-52d72f07ec99",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "c3de17eb-687b-4b37-9feb-84a981c035ab",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788102118247",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "e89b7a0f-c548-4342-aee2-72948b423023",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "c70da013-f29f-4181-ac7f-1793905110f1",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "a82e825b-df23-4a21-9157-b924aa120560",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788082885746",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "75ed700c-fbcb-47a2-9a41-99269a8a331f",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "e89d6169-f9d8-4b24-8c50-644b3e53b979",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "1d5c27f2-1e76-414a-9f3a-6251192b6700",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788103701714",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "0143fe44-24e3-4b2e-ad20-b8e8a5325232",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "59368e9e-0c65-401b-8cc5-77ef87824602",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "67033965-e743-4b4f-8a22-e83963669659",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788104338205",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "fba43734-4946-49a1-a7e9-03e9ca55077f",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "4bc02a19-1664-4e7b-ae28-5f253028f9b8",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "e59e317a-e99b-4447-8422-e165162090bb",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788104986171",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "77769fe6-c76e-4d94-b474-834480334852",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "fbf3ed68-7702-40e0-8cd0-7ba6245ef77c",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "031dfa32-ec1d-4e53-9b79-3293238a216b",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788105822180",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "d60cb4d0-4342-4baf-a37c-71c51e6aeea5",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "39640960-dd35-4521-8a7f-a68a88c36f2a",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "5d906089-6b69-4d04-beaf-f3c98e52204f",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788106684722",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "51668bfb-abc8-47ca-95d1-b7439f5fc588",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "ac577cef-e1fc-4b56-ae6c-25aa121aca65",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "31d51bf6-2a08-4608-b41a-a0c962da0bb5",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788107526856",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "8f0b28ee-f889-448f-b54e-645db6450852",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "2ef9a8eb-be6d-42ae-acec-ed2707eab282",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "41c1e56b-57d7-453c-9566-8214b2e155ac",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788102782922",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "27ae864c-6aa5-4586-96b2-72f53c6a9693",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    },
    {
      "id": "bf0f245a-f259-4a06-b92e-ed7f29e768b9",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788083523308",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "efedb7b8-db11-4533-8072-60def127431c",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T17:21:11.570Z"
    }
  ]
}
```

> **Note**: Administrative view of immutable double-entry ledger transactions.

---

### 12. Apply for Leave (Success)

- **Endpoint**: `POST /api/leave/requests`
- **Expected Status**: `201`
- **Headers**:

```json
{
  "Cookie": "token=JWT_EMPLOYEE_TOKEN"
}
```

- **Request Body**:

```json
{
  "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
  "startDate": "2026-09-10",
  "endDate": "2026-09-11",
  "reason": "Family wedding event"
}
```

- **Response Body**:

```json
{
  "message": "Leave request submitted successfully",
  "success": true,
  "error": null,
  "data": {
    "request": {
      "id": "17c5f430-67c9-432e-8968-5fa73d5f959d",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
      "startDate": "2026-09-10",
      "endDate": "2026-09-11",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Family wedding event",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T17:21:52.089Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T17:21:52.197Z",
      "updatedAt": "2026-08-30T17:21:52.197Z"
    },
    "workingDays": 2,
    "workingDates": ["2026-09-10", "2026-09-11"],
    "breakdown": [
      {
        "date": "2026-09-10",
        "weekday": 4,
        "isWorkingDay": true,
        "isHoliday": false,
        "dayFraction": 1
      },
      {
        "date": "2026-09-11",
        "weekday": 5,
        "isWorkingDay": true,
        "isHoliday": false,
        "dayFraction": 1
      }
    ]
  }
}
```

> **Note**: Submits pending leave request and validates non-overlapping dates.

---

### 13. Get My Leave Requests (Success)

- **Endpoint**: `GET /api/leave/requests/me`
- **Expected Status**: `200`
- **Headers**:

```json
{
  "Cookie": "token=JWT_EMPLOYEE_TOKEN"
}
```

- **Response Body**:

```json
{
  "message": "Leave requests retrieved successfully",
  "success": true,
  "error": null,
  "data": [
    {
      "id": "17c5f430-67c9-432e-8968-5fa73d5f959d",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
      "startDate": "2026-09-10",
      "endDate": "2026-09-11",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Family wedding event",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T17:21:52.089Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T17:21:52.197Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260117",
      "employeeWorkEmail": "diana.prince16@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788110486141",
      "isPaid": true
    }
  ]
}
```

> **Note**: Lists all pending, approved, and rejected leave requests for the employee.

---

### 14. Get Leave Approvals Inbox (Admin)

- **Endpoint**: `GET /api/leave/requests`
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
  "message": "Leave requests retrieved successfully",
  "success": true,
  "error": null,
  "data": [
    {
      "id": "17c5f430-67c9-432e-8968-5fa73d5f959d",
      "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
      "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
      "startDate": "2026-09-10",
      "endDate": "2026-09-11",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Family wedding event",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T17:21:52.089Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T17:21:52.197Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260117",
      "employeeWorkEmail": "diana.prince16@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788110486141",
      "isPaid": true
    },
    {
      "id": "4db4eb76-682f-4ed4-b29d-5c77e5922f16",
      "employeeId": "7adfe249-881f-4505-8119-59a9f960f41c",
      "leaveTypeId": "31d51bf6-2a08-4608-b41a-a0c962da0bb5",
      "startDate": "2026-10-01",
      "endDate": "2026-10-02",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Tentative plan",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T16:32:27.043Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T16:32:27.121Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260105",
      "employeeWorkEmail": "diana.prince15@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788107526856",
      "isPaid": true
    },
    {
      "id": "7aae9a81-ba84-48da-8683-d1074d3473d2",
      "employeeId": "7adfe249-881f-4505-8119-59a9f960f41c",
      "leaveTypeId": "31d51bf6-2a08-4608-b41a-a0c962da0bb5",
      "startDate": "2026-09-20",
      "endDate": "2026-09-21",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "1.0",
      "reason": "Weekend extension",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T16:32:24.622Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T16:32:24.701Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260105",
      "employeeWorkEmail": "diana.prince15@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788107526856",
      "isPaid": true
    },
    {
      "id": "8be4ddca-444b-403a-b4dc-4719802682ab",
      "employeeId": "7adfe249-881f-4505-8119-59a9f960f41c",
      "leaveTypeId": "31d51bf6-2a08-4608-b41a-a0c962da0bb5",
      "startDate": "2026-09-10",
      "endDate": "2026-09-11",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Family wedding event",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T16:32:19.728Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T16:32:19.816Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260105",
      "employeeWorkEmail": "diana.prince15@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788107526856",
      "isPaid": true
    },
    {
      "id": "e4a8dc25-d9cf-4b25-a758-0747f69340be",
      "employeeId": "a8504489-acb6-4717-bac9-49831fc50e16",
      "leaveTypeId": "5d906089-6b69-4d04-beaf-f3c98e52204f",
      "startDate": "2026-10-01",
      "endDate": "2026-10-02",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Tentative plan",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T16:18:49.916Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T16:18:50.007Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260098",
      "employeeWorkEmail": "diana.prince14@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788106684722",
      "isPaid": true
    },
    {
      "id": "834d07e6-e077-4e5b-8c98-ddfef04230da",
      "employeeId": "a8504489-acb6-4717-bac9-49831fc50e16",
      "leaveTypeId": "5d906089-6b69-4d04-beaf-f3c98e52204f",
      "startDate": "2026-09-20",
      "endDate": "2026-09-21",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "1.0",
      "reason": "Weekend extension",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T16:18:45.282Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T16:18:45.534Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260098",
      "employeeWorkEmail": "diana.prince14@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788106684722",
      "isPaid": true
    },
    {
      "id": "915b569d-c645-4a5c-a88f-672065979768",
      "employeeId": "a8504489-acb6-4717-bac9-49831fc50e16",
      "leaveTypeId": "5d906089-6b69-4d04-beaf-f3c98e52204f",
      "startDate": "2026-09-10",
      "endDate": "2026-09-11",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Family wedding event",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T16:18:30.466Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T16:18:30.978Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260098",
      "employeeWorkEmail": "diana.prince14@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788106684722",
      "isPaid": true
    },
    {
      "id": "4b2efe46-98ff-4a31-94b0-e8d575ffc305",
      "employeeId": "c0d5abca-4a37-4e84-be57-53379fcf686f",
      "leaveTypeId": "031dfa32-ec1d-4e53-9b79-3293238a216b",
      "startDate": "2026-10-01",
      "endDate": "2026-10-02",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Tentative plan",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T16:04:06.261Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T16:04:06.345Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260091",
      "employeeWorkEmail": "diana.prince13@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788105822180",
      "isPaid": true
    },
    {
      "id": "0714eaf3-7bc7-4c6b-8018-c54373fc41d7",
      "employeeId": "c0d5abca-4a37-4e84-be57-53379fcf686f",
      "leaveTypeId": "031dfa32-ec1d-4e53-9b79-3293238a216b",
      "startDate": "2026-09-20",
      "endDate": "2026-09-21",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "1.0",
      "reason": "Weekend extension",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T16:04:03.450Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T16:04:03.532Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260091",
      "employeeWorkEmail": "diana.prince13@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788105822180",
      "isPaid": true
    },
    {
      "id": "5c83761b-7f56-4b79-be27-6cdf79251d79",
      "employeeId": "c0d5abca-4a37-4e84-be57-53379fcf686f",
      "leaveTypeId": "031dfa32-ec1d-4e53-9b79-3293238a216b",
      "startDate": "2026-09-10",
      "endDate": "2026-09-11",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Family wedding event",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T16:03:57.460Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T16:03:57.534Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260091",
      "employeeWorkEmail": "diana.prince13@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788105822180",
      "isPaid": true
    },
    {
      "id": "55b01fc1-a19e-4c9d-b5cc-d37aee951593",
      "employeeId": "d6f90075-a07e-482b-9480-d6ff5b90adcf",
      "leaveTypeId": "e59e317a-e99b-4447-8422-e165162090bb",
      "startDate": "2026-10-01",
      "endDate": "2026-10-02",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Tentative plan",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T15:50:13.305Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T15:50:13.390Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260084",
      "employeeWorkEmail": "diana.prince12@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788104986171",
      "isPaid": true
    },
    {
      "id": "429d4c8e-264a-43f4-90b9-d2ba24455780",
      "employeeId": "d6f90075-a07e-482b-9480-d6ff5b90adcf",
      "leaveTypeId": "e59e317a-e99b-4447-8422-e165162090bb",
      "startDate": "2026-09-20",
      "endDate": "2026-09-21",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "1.0",
      "reason": "Weekend extension",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T15:50:10.112Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T15:50:10.246Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260084",
      "employeeWorkEmail": "diana.prince12@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788104986171",
      "isPaid": true
    },
    {
      "id": "cdd6ec46-7b83-45f9-91a9-817997e73791",
      "employeeId": "d6f90075-a07e-482b-9480-d6ff5b90adcf",
      "leaveTypeId": "e59e317a-e99b-4447-8422-e165162090bb",
      "startDate": "2026-09-10",
      "endDate": "2026-09-11",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Family wedding event",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T15:50:03.237Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T15:50:03.317Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260084",
      "employeeWorkEmail": "diana.prince12@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788104986171",
      "isPaid": true
    },
    {
      "id": "26c55779-7568-4bce-bee8-178518e49815",
      "employeeId": "e439e607-b032-4ea9-84b4-be0325c1f5ef",
      "leaveTypeId": "67033965-e743-4b4f-8a22-e83963669659",
      "startDate": "2026-10-01",
      "endDate": "2026-10-02",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Tentative plan",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T15:39:18.580Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T15:39:18.661Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260077",
      "employeeWorkEmail": "diana.prince11@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788104338205",
      "isPaid": true
    },
    {
      "id": "cade5743-ac40-47cf-8570-b47a075f7ead",
      "employeeId": "e439e607-b032-4ea9-84b4-be0325c1f5ef",
      "leaveTypeId": "67033965-e743-4b4f-8a22-e83963669659",
      "startDate": "2026-09-20",
      "endDate": "2026-09-21",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "1.0",
      "reason": "Weekend extension",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T15:39:15.911Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T15:39:15.991Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260077",
      "employeeWorkEmail": "diana.prince11@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788104338205",
      "isPaid": true
    },
    {
      "id": "64f26cd2-d874-406d-8b41-f6bc7dee1a71",
      "employeeId": "e439e607-b032-4ea9-84b4-be0325c1f5ef",
      "leaveTypeId": "67033965-e743-4b4f-8a22-e83963669659",
      "startDate": "2026-09-10",
      "endDate": "2026-09-11",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Family wedding event",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T15:39:11.270Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T15:39:11.336Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260077",
      "employeeWorkEmail": "diana.prince11@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788104338205",
      "isPaid": true
    },
    {
      "id": "ed577c3e-3e6d-4d60-a9a0-310e71dc80c1",
      "employeeId": "4fb4fcce-935a-4dda-a462-c886553ce452",
      "leaveTypeId": "1d5c27f2-1e76-414a-9f3a-6251192b6700",
      "startDate": "2026-10-01",
      "endDate": "2026-10-02",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Tentative plan",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T15:28:43.658Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T15:28:43.746Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260070",
      "employeeWorkEmail": "diana.prince10@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788103701714",
      "isPaid": true
    },
    {
      "id": "7b94bcd6-cf13-4e6c-a79a-0b157f6be7ce",
      "employeeId": "4fb4fcce-935a-4dda-a462-c886553ce452",
      "leaveTypeId": "1d5c27f2-1e76-414a-9f3a-6251192b6700",
      "startDate": "2026-09-20",
      "endDate": "2026-09-21",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "1.0",
      "reason": "Weekend extension",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T15:28:41.330Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T15:28:41.410Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260070",
      "employeeWorkEmail": "diana.prince10@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788103701714",
      "isPaid": true
    },
    {
      "id": "dddcf046-cea8-4f26-99d8-3a7071915b52",
      "employeeId": "4fb4fcce-935a-4dda-a462-c886553ce452",
      "leaveTypeId": "1d5c27f2-1e76-414a-9f3a-6251192b6700",
      "startDate": "2026-09-10",
      "endDate": "2026-09-11",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Family wedding event",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T15:28:36.570Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T15:28:36.646Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260070",
      "employeeWorkEmail": "diana.prince10@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788103701714",
      "isPaid": true
    },
    {
      "id": "20b516b9-5a80-4f68-a630-92224820ea50",
      "employeeId": "b55b834a-b9b8-49bc-a7dd-271d44b42dd6",
      "leaveTypeId": "41c1e56b-57d7-453c-9566-8214b2e155ac",
      "startDate": "2026-10-01",
      "endDate": "2026-10-02",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Tentative plan",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T15:13:41.209Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T15:13:41.386Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260063",
      "employeeWorkEmail": "diana.prince9@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788102782922",
      "isPaid": true
    },
    {
      "id": "2d127f73-be23-47b5-ab46-cafeba59687f",
      "employeeId": "b55b834a-b9b8-49bc-a7dd-271d44b42dd6",
      "leaveTypeId": "41c1e56b-57d7-453c-9566-8214b2e155ac",
      "startDate": "2026-09-20",
      "endDate": "2026-09-21",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "1.0",
      "reason": "Weekend extension",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T15:13:37.511Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T15:13:37.659Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260063",
      "employeeWorkEmail": "diana.prince9@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788102782922",
      "isPaid": true
    },
    {
      "id": "607811e6-a47d-4623-b5d8-7a92b854ff0a",
      "employeeId": "b55b834a-b9b8-49bc-a7dd-271d44b42dd6",
      "leaveTypeId": "41c1e56b-57d7-453c-9566-8214b2e155ac",
      "startDate": "2026-09-10",
      "endDate": "2026-09-11",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Family wedding event",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T15:13:23.053Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T15:13:23.187Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260063",
      "employeeWorkEmail": "diana.prince9@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788102782922",
      "isPaid": true
    },
    {
      "id": "7bb1d142-8bd6-4459-a91c-950b27ec98e3",
      "employeeId": "1d04324a-bf47-421e-9f15-2764ab707da3",
      "leaveTypeId": "c3de17eb-687b-4b37-9feb-84a981c035ab",
      "startDate": "2026-10-01",
      "endDate": "2026-10-02",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Tentative plan",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T15:02:33.422Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T15:02:33.657Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260056",
      "employeeWorkEmail": "diana.prince8@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788102118247",
      "isPaid": true
    },
    {
      "id": "c6a25b30-6810-4332-9064-b67d9ec0675c",
      "employeeId": "1d04324a-bf47-421e-9f15-2764ab707da3",
      "leaveTypeId": "c3de17eb-687b-4b37-9feb-84a981c035ab",
      "startDate": "2026-09-20",
      "endDate": "2026-09-21",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "1.0",
      "reason": "Weekend extension",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T15:02:27.586Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T15:02:27.922Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260056",
      "employeeWorkEmail": "diana.prince8@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788102118247",
      "isPaid": true
    },
    {
      "id": "0791d0a9-a6e4-4de2-8e4f-d0d802ae506a",
      "employeeId": "1d04324a-bf47-421e-9f15-2764ab707da3",
      "leaveTypeId": "c3de17eb-687b-4b37-9feb-84a981c035ab",
      "startDate": "2026-09-10",
      "endDate": "2026-09-11",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Family wedding event",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T15:02:16.131Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T15:02:16.302Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260056",
      "employeeWorkEmail": "diana.prince8@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788102118247",
      "isPaid": true
    },
    {
      "id": "4a4bfbcf-1dcd-480d-a406-cc1d0a70c00e",
      "employeeId": "010ae643-4235-4538-9ad0-725952587cd1",
      "leaveTypeId": "b431df60-253a-41a4-a822-946a11ede30e",
      "startDate": "2026-10-01",
      "endDate": "2026-10-02",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Tentative plan",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T14:59:36.976Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T14:59:37.078Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260050",
      "employeeWorkEmail": "diana.prince7@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788101953267",
      "isPaid": true
    },
    {
      "id": "84084304-5272-453c-b89d-425786f6fafd",
      "employeeId": "010ae643-4235-4538-9ad0-725952587cd1",
      "leaveTypeId": "b431df60-253a-41a4-a822-946a11ede30e",
      "startDate": "2026-09-20",
      "endDate": "2026-09-21",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "1.0",
      "reason": "Weekend extension",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T14:59:34.305Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T14:59:34.373Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260050",
      "employeeWorkEmail": "diana.prince7@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788101953267",
      "isPaid": true
    },
    {
      "id": "6ef9d46b-f81c-4563-b24a-d851d5cf4cdb",
      "employeeId": "010ae643-4235-4538-9ad0-725952587cd1",
      "leaveTypeId": "b431df60-253a-41a4-a822-946a11ede30e",
      "startDate": "2026-09-10",
      "endDate": "2026-09-11",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Family wedding event",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T14:59:29.049Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T14:59:29.116Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260050",
      "employeeWorkEmail": "diana.prince7@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788101953267",
      "isPaid": true
    },
    {
      "id": "87f44cee-1daf-4da2-bf5a-fd72a0fbdd49",
      "employeeId": "0208446f-46ef-49d4-b160-7b0e6c6160eb",
      "leaveTypeId": "f65f4aa5-28a3-4db5-9f67-0ac999df0c6e",
      "startDate": "2026-10-01",
      "endDate": "2026-10-02",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Tentative plan",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T14:14:19.796Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T14:14:19.875Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260043",
      "employeeWorkEmail": "diana.prince6@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788099236806",
      "isPaid": true
    },
    {
      "id": "642700dd-9e8d-426f-baba-b9eec4584c79",
      "employeeId": "0208446f-46ef-49d4-b160-7b0e6c6160eb",
      "leaveTypeId": "f65f4aa5-28a3-4db5-9f67-0ac999df0c6e",
      "startDate": "2026-09-20",
      "endDate": "2026-09-21",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "1.0",
      "reason": "Weekend extension",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T14:14:17.257Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T14:14:17.329Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260043",
      "employeeWorkEmail": "diana.prince6@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788099236806",
      "isPaid": true
    },
    {
      "id": "ff8cff7a-0509-4ca9-9bef-d242f4e7d5d0",
      "employeeId": "0208446f-46ef-49d4-b160-7b0e6c6160eb",
      "leaveTypeId": "f65f4aa5-28a3-4db5-9f67-0ac999df0c6e",
      "startDate": "2026-09-10",
      "endDate": "2026-09-11",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Family wedding event",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T14:14:12.334Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T14:14:12.399Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260043",
      "employeeWorkEmail": "diana.prince6@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788099236806",
      "isPaid": true
    },
    {
      "id": "934ae47e-f701-4b9e-9d64-be2f02beb4eb",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
      "startDate": "2026-10-01",
      "endDate": "2026-10-02",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Tentative plan",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T10:29:18.724Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T10:29:18.802Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260036",
      "employeeWorkEmail": "diana.prince5@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788085737574",
      "isPaid": true
    },
    {
      "id": "bc7c15e6-f032-4287-8a64-f48e1ac67aa8",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
      "startDate": "2026-09-20",
      "endDate": "2026-09-21",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "1.0",
      "reason": "Weekend extension",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T10:29:16.209Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T10:29:16.292Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260036",
      "employeeWorkEmail": "diana.prince5@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788085737574",
      "isPaid": true
    },
    {
      "id": "53299b28-6206-4c29-947e-081b64d7b628",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
      "startDate": "2026-09-10",
      "endDate": "2026-09-11",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Family wedding event",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T10:29:11.395Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T10:29:11.482Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260036",
      "employeeWorkEmail": "diana.prince5@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788085737574",
      "isPaid": true
    },
    {
      "id": "cd698ae7-5710-427f-95c4-b730e092c6d3",
      "employeeId": "f395ce56-3ce4-4c96-8dbe-5317f5e6f5e3",
      "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
      "startDate": "2026-10-01",
      "endDate": "2026-10-02",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Tentative plan",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T10:13:13.919Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T10:13:14.011Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260027",
      "employeeWorkEmail": "diana.prince4@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084773277",
      "isPaid": true
    },
    {
      "id": "bbe4705e-04af-4a75-a615-12c3a13d8283",
      "employeeId": "f395ce56-3ce4-4c96-8dbe-5317f5e6f5e3",
      "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
      "startDate": "2026-09-20",
      "endDate": "2026-09-21",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "1.0",
      "reason": "Weekend extension",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T10:13:11.553Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T10:13:11.621Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260027",
      "employeeWorkEmail": "diana.prince4@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084773277",
      "isPaid": true
    },
    {
      "id": "e6d27efa-2cac-406b-b70a-601ee85f5723",
      "employeeId": "f395ce56-3ce4-4c96-8dbe-5317f5e6f5e3",
      "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
      "startDate": "2026-09-10",
      "endDate": "2026-09-11",
      "startHalf": "none",
      "endHalf": "none",
      "requestedDays": "2.0",
      "reason": "Family wedding event",
      "status": "pending",
      "attachmentUrl": null,
      "submittedAt": "2026-08-30T10:13:06.867Z",
      "approvedAt": null,
      "rejectedAt": null,
      "approvedBy": null,
      "rejectedBy": null,
      "hrComment": null,
      "createdAt": "2026-08-30T10:13:06.941Z",
      "employeeFirstName": "Diana",
      "employeeLastName": "Prince",
      "employeeCode": "TESTDIPR20260027",
      "employeeWorkEmail": "diana.prince4@testorg.dayflow.com",
      "departmentName": null,
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084773277",
      "isPaid": true
    }
  ]
}
```

> **Note**: Lists pending leave applications awaiting approval.

---

# Feature 05: Time-Off / Leave Management API

> Covers leave types configuration, double-entry balance allocations, ledger transactions, leave applications, date overlap validation, and manager approval/rejection workflows.

## 📋 Endpoints Overview

| Method  | Endpoint                                                                | Scenario                                   | Status |
| :------ | :---------------------------------------------------------------------- | :----------------------------------------- | :----- |
| `GET`   | `/api/leave/types`                                                      | List Leave Types (Success)                 | `200`  |
| `POST`  | `/api/leave/types`                                                      | Create Leave Type (Admin)                  | `201`  |
| `GET`   | `/api/leave/types/744a13fd-1838-4771-acd9-275285edb589`                 | Get Leave Type by ID (Success)             | `200`  |
| `PATCH` | `/api/leave/types/744a13fd-1838-4771-acd9-275285edb589`                 | Update Leave Type (Admin)                  | `200`  |
| `GET`   | `/api/leave/balances/me`                                                | Get My Leave Balances (Success)            | `200`  |
| `GET`   | `/api/leave/balances/employee/b32f1d6a-efae-4957-adb5-b7514c803bbe`     | Get Employee Leave Balances (Admin)        | `200`  |
| `POST`  | `/api/leave/allocations`                                                | Allocate Leave Days (Admin)                | `201`  |
| `GET`   | `/api/leave/allocations/me`                                             | Get My Allocations History (Success)       | `200`  |
| `GET`   | `/api/leave/allocations/employee/b32f1d6a-efae-4957-adb5-b7514c803bbe`  | Get Employee Allocations (Admin)           | `200`  |
| `GET`   | `/api/leave/transactions/me`                                            | Get My Leave Ledger Transactions (Success) | `200`  |
| `GET`   | `/api/leave/transactions/employee/b32f1d6a-efae-4957-adb5-b7514c803bbe` | Get Employee Leave Ledger (Admin)          | `200`  |
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
  "code": "CASUAL_1788085737574",
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
    "updatedAt": "2026-08-30T10:28:58.342Z"
  }
}
```

> **Note**: Defines new leave policy rules and allocations.

---

### 3. Get Leave Type by ID (Success)

- **Endpoint**: `GET /api/leave/types/744a13fd-1838-4771-acd9-275285edb589`
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
    "updatedAt": "2026-08-30T10:28:58.342Z"
  }
}
```

> **Note**: Retrieves leave type definition and configuration parameters.

---

### 4. Update Leave Type (Admin)

- **Endpoint**: `PATCH /api/leave/types/744a13fd-1838-4771-acd9-275285edb589`
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

- **Endpoint**: `GET /api/leave/balances/employee/b32f1d6a-efae-4957-adb5-b7514c803bbe`
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
      "id": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "firstName": "Diana",
      "lastName": "Prince",
      "employeeCode": "TESTDIPR20260036"
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
  "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
  "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
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
    "id": "cf29855f-3a00-437a-b1af-203b5228b04c",
    "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
    "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
    "periodStart": "2026-01-01",
    "periodEnd": "2026-12-31",
    "allocatedDays": "12.00",
    "carriedForwardDays": "0.00",
    "createdBy": "b52678db-8a78-4e32-89c6-5b69e66b6214",
    "createdAt": "2026-08-30T10:29:04.252Z",
    "updatedAt": "2026-08-30T10:29:04.252Z"
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
      "id": "cf29855f-3a00-437a-b1af-203b5228b04c",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788085737574",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "b52678db-8a78-4e32-89c6-5b69e66b6214",
      "createdAt": "2026-08-30T10:29:04.252Z"
    },
    {
      "id": "7d6dc80d-b0e4-4d79-a1ff-78d209c1c454",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084773277",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "b52678db-8a78-4e32-89c6-5b69e66b6214",
      "createdAt": "2026-08-30T10:28:50.377Z"
    },
    {
      "id": "08528517-f4bb-4aa0-a0b3-2f5afade9ada",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084091667",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "b52678db-8a78-4e32-89c6-5b69e66b6214",
      "createdAt": "2026-08-30T10:28:50.377Z"
    },
    {
      "id": "9ff97421-7284-4fe2-b04f-cbc8033f2af9",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788083768714",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "b52678db-8a78-4e32-89c6-5b69e66b6214",
      "createdAt": "2026-08-30T10:28:50.377Z"
    },
    {
      "id": "4ecbbc97-3c55-4da7-9efb-e985f3c75c47",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788083523308",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "b52678db-8a78-4e32-89c6-5b69e66b6214",
      "createdAt": "2026-08-30T10:28:50.377Z"
    },
    {
      "id": "1675ad84-654b-4ab1-ad08-fc9d12cc50a5",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "a82e825b-df23-4a21-9157-b924aa120560",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788082885746",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "b52678db-8a78-4e32-89c6-5b69e66b6214",
      "createdAt": "2026-08-30T10:28:50.377Z"
    }
  ]
}
```

> **Note**: Lists historical balance credits granted to employee.

---

### 9. Get Employee Allocations (Admin)

- **Endpoint**: `GET /api/leave/allocations/employee/b32f1d6a-efae-4957-adb5-b7514c803bbe`
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
      "id": "cf29855f-3a00-437a-b1af-203b5228b04c",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788085737574",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "b52678db-8a78-4e32-89c6-5b69e66b6214",
      "createdAt": "2026-08-30T10:29:04.252Z"
    },
    {
      "id": "7d6dc80d-b0e4-4d79-a1ff-78d209c1c454",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084773277",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "b52678db-8a78-4e32-89c6-5b69e66b6214",
      "createdAt": "2026-08-30T10:28:50.377Z"
    },
    {
      "id": "08528517-f4bb-4aa0-a0b3-2f5afade9ada",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084091667",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "b52678db-8a78-4e32-89c6-5b69e66b6214",
      "createdAt": "2026-08-30T10:28:50.377Z"
    },
    {
      "id": "9ff97421-7284-4fe2-b04f-cbc8033f2af9",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788083768714",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "b52678db-8a78-4e32-89c6-5b69e66b6214",
      "createdAt": "2026-08-30T10:28:50.377Z"
    },
    {
      "id": "4ecbbc97-3c55-4da7-9efb-e985f3c75c47",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788083523308",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "b52678db-8a78-4e32-89c6-5b69e66b6214",
      "createdAt": "2026-08-30T10:28:50.377Z"
    },
    {
      "id": "1675ad84-654b-4ab1-ad08-fc9d12cc50a5",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "a82e825b-df23-4a21-9157-b924aa120560",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788082885746",
      "periodStart": "2026-01-01",
      "periodEnd": "2026-12-31",
      "allocatedDays": "12.00",
      "carriedForwardDays": "0.00",
      "createdBy": "b52678db-8a78-4e32-89c6-5b69e66b6214",
      "createdAt": "2026-08-30T10:28:50.377Z"
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
      "id": "8dc862f7-4526-4684-bc05-204843dc7402",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788085737574",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "cf29855f-3a00-437a-b1af-203b5228b04c",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T10:29:04.252Z"
    },
    {
      "id": "797bd023-7b85-4de9-9cbe-704ec2834e6f",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788085737574",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "cf29855f-3a00-437a-b1af-203b5228b04c",
      "description": "Annual policy allotment",
      "createdAt": "2026-08-30T10:29:04.252Z"
    },
    {
      "id": "86fe1387-4940-4169-82e3-782178546f2a",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084091667",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "08528517-f4bb-4aa0-a0b3-2f5afade9ada",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T10:28:50.377Z"
    },
    {
      "id": "4c6d6e91-6ce2-4515-ad73-8655b00a1738",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788083768714",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "9ff97421-7284-4fe2-b04f-cbc8033f2af9",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T10:28:50.377Z"
    },
    {
      "id": "e7f07a39-eb8c-440a-aad2-f9415478c116",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084773277",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "7d6dc80d-b0e4-4d79-a1ff-78d209c1c454",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T10:28:50.377Z"
    },
    {
      "id": "ff33514d-3e96-4960-927a-6815837cf497",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "a82e825b-df23-4a21-9157-b924aa120560",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788082885746",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "1675ad84-654b-4ab1-ad08-fc9d12cc50a5",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T10:28:50.377Z"
    },
    {
      "id": "ba48ed2b-a19a-4e3a-9933-b68fe297be67",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788083523308",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "4ecbbc97-3c55-4da7-9efb-e985f3c75c47",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T10:28:50.377Z"
    }
  ]
}
```

> **Note**: Returns audit trail of balance debits and credits with reasons.

---

### 11. Get Employee Leave Ledger (Admin)

- **Endpoint**: `GET /api/leave/transactions/employee/b32f1d6a-efae-4957-adb5-b7514c803bbe`
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
      "id": "8dc862f7-4526-4684-bc05-204843dc7402",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788085737574",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "cf29855f-3a00-437a-b1af-203b5228b04c",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T10:29:04.252Z"
    },
    {
      "id": "797bd023-7b85-4de9-9cbe-704ec2834e6f",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788085737574",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "cf29855f-3a00-437a-b1af-203b5228b04c",
      "description": "Annual policy allotment",
      "createdAt": "2026-08-30T10:29:04.252Z"
    },
    {
      "id": "86fe1387-4940-4169-82e3-782178546f2a",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084091667",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "08528517-f4bb-4aa0-a0b3-2f5afade9ada",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T10:28:50.377Z"
    },
    {
      "id": "4c6d6e91-6ce2-4515-ad73-8655b00a1738",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788083768714",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "9ff97421-7284-4fe2-b04f-cbc8033f2af9",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T10:28:50.377Z"
    },
    {
      "id": "e7f07a39-eb8c-440a-aad2-f9415478c116",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788084773277",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "7d6dc80d-b0e4-4d79-a1ff-78d209c1c454",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T10:28:50.377Z"
    },
    {
      "id": "ff33514d-3e96-4960-927a-6815837cf497",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "a82e825b-df23-4a21-9157-b924aa120560",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788082885746",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "1675ad84-654b-4ab1-ad08-fc9d12cc50a5",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T10:28:50.377Z"
    },
    {
      "id": "ba48ed2b-a19a-4e3a-9933-b68fe297be67",
      "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
      "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
      "leaveTypeName": "Casual Leave",
      "leaveTypeCode": "CASUAL_1788083523308",
      "transactionType": "allocation",
      "days": "12.00",
      "referenceType": "leave_allocation",
      "referenceId": "4ecbbc97-3c55-4da7-9efb-e985f3c75c47",
      "description": "Period: 2026-01-01 to 2026-12-31",
      "createdAt": "2026-08-30T10:28:50.377Z"
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
  "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
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
      "updatedAt": "2026-08-30T10:29:11.482Z"
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

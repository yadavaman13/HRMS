# Feature 05: Time-Off / Leave Management API

> Covers leave types configuration, balance allocations, leave applications, date overlap validation, and manager approvals.

## 📋 Endpoints Overview

| Method | Endpoint                 | Scenario                          | Status |
| :----- | :----------------------- | :-------------------------------- | :----- |
| `GET`  | `/api/leave/types`       | List Leave Types (Success)        | `200`  |
| `POST` | `/api/leave/types`       | Create Leave Type (Admin)         | `201`  |
| `GET`  | `/api/leave/balances/me` | Get My Leave Balances (Success)   | `200`  |
| `POST` | `/api/leave/requests`    | Apply for Leave (Success)         | `400`  |
| `GET`  | `/api/leave/requests`    | Get Leave Approvals Inbox (Admin) | `200`  |

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
      "id": "57e87d7b-50ec-4bce-9c22-720c5473aadb",
      "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
      "code": "CASUAL_1787995205725",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-29T09:20:07.234Z",
      "updatedAt": "2026-08-29T09:20:07.234Z"
    },
    {
      "id": "f544a4d9-e736-4db8-a0ff-518d157145c9",
      "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
      "code": "CASUAL_1787995735466",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-29T09:28:56.668Z",
      "updatedAt": "2026-08-29T09:28:56.668Z"
    },
    {
      "id": "6edbb793-9e48-494c-9053-6efc5df02c54",
      "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
      "code": "CASUAL_1787997139545",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-29T09:52:20.875Z",
      "updatedAt": "2026-08-29T09:52:20.875Z"
    },
    {
      "id": "7d7bf7e7-d942-447f-96e1-175366fd936d",
      "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
      "code": "CASUAL_1787997915667",
      "name": "Casual Leave",
      "isPaid": true,
      "requiresAllocation": true,
      "requiresAttachment": false,
      "requiresApproval": true,
      "unit": "day",
      "isActive": true,
      "createdAt": "2026-08-29T10:05:16.816Z",
      "updatedAt": "2026-08-29T10:05:16.816Z"
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
  "code": "CASUAL_1787998021296",
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
    "id": "7423d82e-97a1-4506-a298-9ecf514ac26b",
    "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
    "code": "CASUAL_1787998021296",
    "name": "Casual Leave",
    "isPaid": true,
    "requiresAllocation": true,
    "requiresAttachment": false,
    "requiresApproval": true,
    "unit": "day",
    "isActive": true,
    "createdAt": "2026-08-29T10:07:02.530Z",
    "updatedAt": "2026-08-29T10:07:02.530Z"
  }
}
```

> **Note**: Defines new leave policy rules and allocations.

---

### 3. Get My Leave Balances (Success)

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
      "leaveTypeId": "57e87d7b-50ec-4bce-9c22-720c5473aadb",
      "code": "CASUAL_1787995205725",
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
    },
    {
      "leaveTypeId": "f544a4d9-e736-4db8-a0ff-518d157145c9",
      "code": "CASUAL_1787995735466",
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
    },
    {
      "leaveTypeId": "6edbb793-9e48-494c-9053-6efc5df02c54",
      "code": "CASUAL_1787997139545",
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
    },
    {
      "leaveTypeId": "7d7bf7e7-d942-447f-96e1-175366fd936d",
      "code": "CASUAL_1787997915667",
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
    },
    {
      "leaveTypeId": "7423d82e-97a1-4506-a298-9ecf514ac26b",
      "code": "CASUAL_1787998021296",
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

### 4. Apply for Leave (Success)

- **Endpoint**: `POST /api/leave/requests`
- **Expected Status**: `400`
- **Headers**:

```json
{
  "Cookie": "token=JWT_EMPLOYEE_TOKEN"
}
```

- **Request Body**:

```json
{
  "leaveTypeId": "57e87d7b-50ec-4bce-9c22-720c5473aadb",
  "startDate": "2026-08-17",
  "endDate": "2026-08-18",
  "reason": "Family event"
}
```

- **Response Body**:

```json
{
  "message": "Insufficient leave balance for Casual Leave. Available: 0 day(s), Requested: 2 day(s)",
  "success": false,
  "error": null,
  "data": {
    "availableBalance": 0,
    "requestedDays": 2
  }
}
```

> **Note**: Submits pending leave request and validates non-overlapping dates.

---

### 5. Get Leave Approvals Inbox (Admin)

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
  "data": []
}
```

> **Note**: Lists pending leave applications awaiting approval.

---

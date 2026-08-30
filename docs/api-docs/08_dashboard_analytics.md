# Feature 08: Dashboard & Workforce Overview API

> Covers executive analytics, contextual single-employee inspection, employee self-service metrics, and modular attendance, leave, headcount, and payroll breakdowns.

## 📋 Endpoints Overview

| Method | Endpoint                                                       | Scenario                                         | Status |
| :----- | :------------------------------------------------------------- | :----------------------------------------------- | :----- |
| `GET`  | `/api/dashboard`                                               | Get Executive Dashboard via Root (Admin)         | `200`  |
| `GET`  | `/api/dashboard/admin`                                         | Get Explicit Admin Dashboard (Admin)             | `200`  |
| `GET`  | `/api/dashboard/employee`                                      | Get Employee Self-Service Dashboard (Success)    | `200`  |
| `GET`  | `/api/dashboard/me`                                            | Get My Dashboard Summary via Alias (Success)     | `200`  |
| `GET`  | `/api/dashboard/employee/b9b2baaf-41e0-48d6-aa56-72652785eae0` | Get Contextual Single-Employee Dashboard (Admin) | `200`  |
| `GET`  | `/api/dashboard/attendance`                                    | Get Attendance Dashboard Slice (Admin)           | `200`  |
| `GET`  | `/api/dashboard/leave`                                         | Get Leave Dashboard Slice (Admin)                | `200`  |
| `GET`  | `/api/dashboard/employees`                                     | Get Employees Headcount Slice (Admin)            | `200`  |
| `GET`  | `/api/dashboard/payroll`                                       | Get Payroll Dashboard Slice (Admin)              | `200`  |

---

## 🔍 Detailed Scenarios & Outputs

### 1. Get Executive Dashboard via Root (Admin)

- **Endpoint**: `GET /api/dashboard`
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
  "message": "Admin executive dashboard retrieved",
  "success": true,
  "error": null,
  "data": {
    "role": "admin",
    "dashboard": {
      "headcount": {
        "total": 38,
        "active": 38,
        "probation": 0,
        "onLeave": 0,
        "terminated": 0,
        "newJoinersThisMonth": 38
      },
      "departmentBreakdown": [],
      "employmentTypeBreakdown": [
        {
          "employmentType": "full_time",
          "count": 38
        }
      ],
      "todayAttendance": {
        "totalRecords": 3,
        "present": 3,
        "absent": 0,
        "onLeave": 0,
        "halfDay": 0,
        "late": 0,
        "incomplete": 0
      },
      "pendingQueues": {
        "leavesCount": 6,
        "adjustmentsCount": 3,
        "recentPendingLeaves": [
          {
            "id": "934ae47e-f701-4b9e-9d64-be2f02beb4eb",
            "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
            "employeeCode": "TESTDIPR20260036",
            "employeeName": "Diana Prince",
            "leaveTypeName": "Casual Leave",
            "leaveTypeCode": "CASUAL_1788085737574",
            "startDate": "2026-10-01",
            "endDate": "2026-10-02",
            "requestedDays": "2.0",
            "reason": "Tentative plan",
            "submittedAt": "2026-08-30T10:29:18.724Z"
          },
          {
            "id": "bc7c15e6-f032-4287-8a64-f48e1ac67aa8",
            "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
            "employeeCode": "TESTDIPR20260036",
            "employeeName": "Diana Prince",
            "leaveTypeName": "Casual Leave",
            "leaveTypeCode": "CASUAL_1788085737574",
            "startDate": "2026-09-20",
            "endDate": "2026-09-21",
            "requestedDays": "1.0",
            "reason": "Weekend extension",
            "submittedAt": "2026-08-30T10:29:16.209Z"
          },
          {
            "id": "53299b28-6206-4c29-947e-081b64d7b628",
            "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
            "employeeCode": "TESTDIPR20260036",
            "employeeName": "Diana Prince",
            "leaveTypeName": "Casual Leave",
            "leaveTypeCode": "CASUAL_1788085737574",
            "startDate": "2026-09-10",
            "endDate": "2026-09-11",
            "requestedDays": "2.0",
            "reason": "Family wedding event",
            "submittedAt": "2026-08-30T10:29:11.395Z"
          },
          {
            "id": "cd698ae7-5710-427f-95c4-b730e092c6d3",
            "employeeId": "f395ce56-3ce4-4c96-8dbe-5317f5e6f5e3",
            "employeeCode": "TESTDIPR20260027",
            "employeeName": "Diana Prince",
            "leaveTypeName": "Casual Leave",
            "leaveTypeCode": "CASUAL_1788084773277",
            "startDate": "2026-10-01",
            "endDate": "2026-10-02",
            "requestedDays": "2.0",
            "reason": "Tentative plan",
            "submittedAt": "2026-08-30T10:13:13.919Z"
          },
          {
            "id": "bbe4705e-04af-4a75-a615-12c3a13d8283",
            "employeeId": "f395ce56-3ce4-4c96-8dbe-5317f5e6f5e3",
            "employeeCode": "TESTDIPR20260027",
            "employeeName": "Diana Prince",
            "leaveTypeName": "Casual Leave",
            "leaveTypeCode": "CASUAL_1788084773277",
            "startDate": "2026-09-20",
            "endDate": "2026-09-21",
            "requestedDays": "1.0",
            "reason": "Weekend extension",
            "submittedAt": "2026-08-30T10:13:11.553Z"
          }
        ]
      },
      "payrollMetrics": {
        "period": {
          "id": "6d0868d6-ed9e-4865-a741-9bb4edcb4166",
          "periodStart": "2061-01-01",
          "periodEnd": "2061-01-31",
          "status": "draft",
          "processedAt": null,
          "finalizedAt": null
        },
        "summary": {
          "payslipsCount": 0,
          "totalGross": "0",
          "totalDeductions": "0",
          "totalNetPay": "0"
        }
      },
      "upcomingHolidays": [],
      "past7DaysAttendance": [
        {
          "date": "2026-08-30",
          "present": 3,
          "absent": 0,
          "onLeave": 0,
          "halfDay": 0
        }
      ],
      "leaveDistribution": [
        {
          "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
          "leaveTypeCode": "CASUAL_1788083768714",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        },
        {
          "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
          "leaveTypeCode": "CASUAL_1788083523308",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        },
        {
          "leaveTypeId": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
          "leaveTypeCode": "CASUAL_1788084091667",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        },
        {
          "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
          "leaveTypeCode": "CASUAL_1788085737574",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        },
        {
          "leaveTypeId": "a82e825b-df23-4a21-9157-b924aa120560",
          "leaveTypeCode": "CASUAL_1788082885746",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        },
        {
          "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
          "leaveTypeCode": "CASUAL_1788084773277",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        }
      ]
    }
  }
}
```

> **Note**: Smart root router detects Admin role and returns high-level company metrics.

---

### 2. Get Explicit Admin Dashboard (Admin)

- **Endpoint**: `GET /api/dashboard/admin`
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
  "message": "Admin dashboard analytics retrieved",
  "success": true,
  "error": null,
  "data": {
    "headcount": {
      "total": 38,
      "active": 38,
      "probation": 0,
      "onLeave": 0,
      "terminated": 0,
      "newJoinersThisMonth": 38
    },
    "departmentBreakdown": [],
    "employmentTypeBreakdown": [
      {
        "employmentType": "full_time",
        "count": 38
      }
    ],
    "todayAttendance": {
      "totalRecords": 3,
      "present": 3,
      "absent": 0,
      "onLeave": 0,
      "halfDay": 0,
      "late": 0,
      "incomplete": 0
    },
    "pendingQueues": {
      "leavesCount": 6,
      "adjustmentsCount": 3,
      "recentPendingLeaves": [
        {
          "id": "934ae47e-f701-4b9e-9d64-be2f02beb4eb",
          "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
          "employeeCode": "TESTDIPR20260036",
          "employeeName": "Diana Prince",
          "leaveTypeName": "Casual Leave",
          "leaveTypeCode": "CASUAL_1788085737574",
          "startDate": "2026-10-01",
          "endDate": "2026-10-02",
          "requestedDays": "2.0",
          "reason": "Tentative plan",
          "submittedAt": "2026-08-30T10:29:18.724Z"
        },
        {
          "id": "bc7c15e6-f032-4287-8a64-f48e1ac67aa8",
          "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
          "employeeCode": "TESTDIPR20260036",
          "employeeName": "Diana Prince",
          "leaveTypeName": "Casual Leave",
          "leaveTypeCode": "CASUAL_1788085737574",
          "startDate": "2026-09-20",
          "endDate": "2026-09-21",
          "requestedDays": "1.0",
          "reason": "Weekend extension",
          "submittedAt": "2026-08-30T10:29:16.209Z"
        },
        {
          "id": "53299b28-6206-4c29-947e-081b64d7b628",
          "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
          "employeeCode": "TESTDIPR20260036",
          "employeeName": "Diana Prince",
          "leaveTypeName": "Casual Leave",
          "leaveTypeCode": "CASUAL_1788085737574",
          "startDate": "2026-09-10",
          "endDate": "2026-09-11",
          "requestedDays": "2.0",
          "reason": "Family wedding event",
          "submittedAt": "2026-08-30T10:29:11.395Z"
        },
        {
          "id": "cd698ae7-5710-427f-95c4-b730e092c6d3",
          "employeeId": "f395ce56-3ce4-4c96-8dbe-5317f5e6f5e3",
          "employeeCode": "TESTDIPR20260027",
          "employeeName": "Diana Prince",
          "leaveTypeName": "Casual Leave",
          "leaveTypeCode": "CASUAL_1788084773277",
          "startDate": "2026-10-01",
          "endDate": "2026-10-02",
          "requestedDays": "2.0",
          "reason": "Tentative plan",
          "submittedAt": "2026-08-30T10:13:13.919Z"
        },
        {
          "id": "bbe4705e-04af-4a75-a615-12c3a13d8283",
          "employeeId": "f395ce56-3ce4-4c96-8dbe-5317f5e6f5e3",
          "employeeCode": "TESTDIPR20260027",
          "employeeName": "Diana Prince",
          "leaveTypeName": "Casual Leave",
          "leaveTypeCode": "CASUAL_1788084773277",
          "startDate": "2026-09-20",
          "endDate": "2026-09-21",
          "requestedDays": "1.0",
          "reason": "Weekend extension",
          "submittedAt": "2026-08-30T10:13:11.553Z"
        }
      ]
    },
    "payrollMetrics": {
      "period": {
        "id": "6d0868d6-ed9e-4865-a741-9bb4edcb4166",
        "periodStart": "2061-01-01",
        "periodEnd": "2061-01-31",
        "status": "draft",
        "processedAt": null,
        "finalizedAt": null
      },
      "summary": {
        "payslipsCount": 0,
        "totalGross": "0",
        "totalDeductions": "0",
        "totalNetPay": "0"
      }
    },
    "upcomingHolidays": [],
    "past7DaysAttendance": [
      {
        "date": "2026-08-30",
        "present": 3,
        "absent": 0,
        "onLeave": 0,
        "halfDay": 0
      }
    ],
    "leaveDistribution": [
      {
        "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
        "leaveTypeCode": "CASUAL_1788083768714",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
        "leaveTypeCode": "CASUAL_1788083523308",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
        "leaveTypeCode": "CASUAL_1788084091667",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
        "leaveTypeCode": "CASUAL_1788085737574",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "a82e825b-df23-4a21-9157-b924aa120560",
        "leaveTypeCode": "CASUAL_1788082885746",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
        "leaveTypeCode": "CASUAL_1788084773277",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      }
    ]
  }
}
```

> **Note**: Direct endpoint for organizational KPIs, headcount, and pending approval queues.

---

### 3. Get Employee Self-Service Dashboard (Success)

- **Endpoint**: `GET /api/dashboard/employee`
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
  "message": "Employee self-service dashboard retrieved",
  "success": true,
  "error": null,
  "data": {
    "profile": {
      "id": "b9b2baaf-41e0-48d6-aa56-72652785eae0",
      "employeeCode": "TESTGECL20260039",
      "firstName": "George",
      "lastName": "Clark",
      "displayName": "George Clark",
      "workEmail": "george.clark3@testorg.dayflow.com",
      "joiningDate": "2026-08-01",
      "employmentStatus": "active",
      "departmentName": null,
      "jobPositionName": null,
      "locationName": null
    },
    "employee": {
      "id": "b9b2baaf-41e0-48d6-aa56-72652785eae0",
      "employeeCode": "TESTGECL20260039",
      "firstName": "George",
      "lastName": "Clark",
      "displayName": "George Clark",
      "workEmail": "george.clark3@testorg.dayflow.com",
      "joiningDate": "2026-08-01",
      "employmentStatus": "active",
      "departmentName": null,
      "jobPositionName": null,
      "locationName": null
    },
    "today": {
      "record": null,
      "session": null,
      "isCheckedIn": null,
      "status": "NOT_LOGGED"
    },
    "leaveBalances": [
      {
        "leaveTypeId": "a82e825b-df23-4a21-9157-b924aa120560",
        "leaveTypeCode": "CASUAL_1788082885746",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      },
      {
        "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
        "leaveTypeCode": "CASUAL_1788083523308",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      },
      {
        "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
        "leaveTypeCode": "CASUAL_1788083768714",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      },
      {
        "leaveTypeId": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
        "leaveTypeCode": "CASUAL_1788084091667",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      },
      {
        "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
        "leaveTypeCode": "CASUAL_1788084773277",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      },
      {
        "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
        "leaveTypeCode": "CASUAL_1788085737574",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      }
    ],
    "monthSummary": {
      "presentDays": 0,
      "absentDays": 0,
      "leaveDays": 0,
      "halfDays": 0,
      "totalWorkedHours": "0",
      "totalOvertimeHours": "0"
    },
    "recentAttendance": [],
    "recentLeaves": [],
    "latestPayslip": null,
    "upcomingHolidays": [],
    "unreadNotificationsCount": 1
  }
}
```

> **Note**: Returns personal daily punch status, remaining leave counters, and latest payslip preview.

---

### 4. Get My Dashboard Summary via Alias (Success)

- **Endpoint**: `GET /api/dashboard/me`
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
  "message": "Employee self-service dashboard retrieved",
  "success": true,
  "error": null,
  "data": {
    "profile": {
      "id": "b9b2baaf-41e0-48d6-aa56-72652785eae0",
      "employeeCode": "TESTGECL20260039",
      "firstName": "George",
      "lastName": "Clark",
      "displayName": "George Clark",
      "workEmail": "george.clark3@testorg.dayflow.com",
      "joiningDate": "2026-08-01",
      "employmentStatus": "active",
      "departmentName": null,
      "jobPositionName": null,
      "locationName": null
    },
    "employee": {
      "id": "b9b2baaf-41e0-48d6-aa56-72652785eae0",
      "employeeCode": "TESTGECL20260039",
      "firstName": "George",
      "lastName": "Clark",
      "displayName": "George Clark",
      "workEmail": "george.clark3@testorg.dayflow.com",
      "joiningDate": "2026-08-01",
      "employmentStatus": "active",
      "departmentName": null,
      "jobPositionName": null,
      "locationName": null
    },
    "today": {
      "record": null,
      "session": null,
      "isCheckedIn": null,
      "status": "NOT_LOGGED"
    },
    "leaveBalances": [
      {
        "leaveTypeId": "a82e825b-df23-4a21-9157-b924aa120560",
        "leaveTypeCode": "CASUAL_1788082885746",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      },
      {
        "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
        "leaveTypeCode": "CASUAL_1788083523308",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      },
      {
        "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
        "leaveTypeCode": "CASUAL_1788083768714",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      },
      {
        "leaveTypeId": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
        "leaveTypeCode": "CASUAL_1788084091667",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      },
      {
        "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
        "leaveTypeCode": "CASUAL_1788084773277",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      },
      {
        "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
        "leaveTypeCode": "CASUAL_1788085737574",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      }
    ],
    "monthSummary": {
      "presentDays": 0,
      "absentDays": 0,
      "leaveDays": 0,
      "halfDays": 0,
      "totalWorkedHours": "0",
      "totalOvertimeHours": "0"
    },
    "recentAttendance": [],
    "recentLeaves": [],
    "latestPayslip": null,
    "upcomingHolidays": [],
    "unreadNotificationsCount": 1
  }
}
```

> **Note**: Convenience alias for current employee overview.

---

### 5. Get Contextual Single-Employee Dashboard (Admin)

- **Endpoint**: `GET /api/dashboard/employee/b9b2baaf-41e0-48d6-aa56-72652785eae0`
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
  "message": "Employee dashboard retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "profile": {
      "id": "b9b2baaf-41e0-48d6-aa56-72652785eae0",
      "employeeCode": "TESTGECL20260039",
      "firstName": "George",
      "lastName": "Clark",
      "displayName": "George Clark",
      "workEmail": "george.clark3@testorg.dayflow.com",
      "joiningDate": "2026-08-01",
      "employmentStatus": "active",
      "departmentName": null,
      "jobPositionName": null,
      "locationName": null
    },
    "employee": {
      "id": "b9b2baaf-41e0-48d6-aa56-72652785eae0",
      "employeeCode": "TESTGECL20260039",
      "firstName": "George",
      "lastName": "Clark",
      "displayName": "George Clark",
      "workEmail": "george.clark3@testorg.dayflow.com",
      "joiningDate": "2026-08-01",
      "employmentStatus": "active",
      "departmentName": null,
      "jobPositionName": null,
      "locationName": null
    },
    "today": {
      "record": null,
      "session": null,
      "isCheckedIn": null,
      "status": "NOT_LOGGED"
    },
    "leaveBalances": [
      {
        "leaveTypeId": "a82e825b-df23-4a21-9157-b924aa120560",
        "leaveTypeCode": "CASUAL_1788082885746",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      },
      {
        "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
        "leaveTypeCode": "CASUAL_1788083523308",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      },
      {
        "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
        "leaveTypeCode": "CASUAL_1788083768714",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      },
      {
        "leaveTypeId": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
        "leaveTypeCode": "CASUAL_1788084091667",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      },
      {
        "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
        "leaveTypeCode": "CASUAL_1788084773277",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      },
      {
        "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
        "leaveTypeCode": "CASUAL_1788085737574",
        "leaveTypeName": "Casual Leave",
        "isPaid": true,
        "allocatedDays": "12.00",
        "carriedForwardDays": "0.00",
        "usedDays": "0",
        "pendingDays": "0",
        "totalEntitled": 12,
        "availableDays": 12
      }
    ],
    "monthSummary": {
      "presentDays": 0,
      "absentDays": 0,
      "leaveDays": 0,
      "halfDays": 0,
      "totalWorkedHours": "0",
      "totalOvertimeHours": "0"
    },
    "recentAttendance": [],
    "recentLeaves": [],
    "latestPayslip": null,
    "upcomingHolidays": [],
    "unreadNotificationsCount": 1
  }
}
```

> **Note**: Allows HR/Admin to inspect any specific employee personal dashboard slice (impersonation view).

---

### 6. Get Attendance Dashboard Slice (Admin)

- **Endpoint**: `GET /api/dashboard/attendance`
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
  "message": "Attendance dashboard analytics retrieved",
  "success": true,
  "error": null,
  "data": {
    "todayAttendance": {
      "totalRecords": 3,
      "present": 3,
      "absent": 0,
      "onLeave": 0,
      "halfDay": 0,
      "late": 0,
      "incomplete": 0
    },
    "past7DaysAttendance": [
      {
        "date": "2026-08-30",
        "present": 3,
        "absent": 0,
        "onLeave": 0,
        "halfDay": 0
      }
    ],
    "upcomingHolidays": []
  }
}
```

> **Note**: Provides today attendance counts, 7-day trend, and pending regularization requests.

---

### 7. Get Leave Dashboard Slice (Admin)

- **Endpoint**: `GET /api/dashboard/leave`
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
  "message": "Leave dashboard analytics retrieved",
  "success": true,
  "error": null,
  "data": {
    "pendingLeaves": [
      {
        "id": "934ae47e-f701-4b9e-9d64-be2f02beb4eb",
        "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
        "employeeCode": "TESTDIPR20260036",
        "employeeName": "Diana Prince",
        "leaveTypeName": "Casual Leave",
        "leaveTypeCode": "CASUAL_1788085737574",
        "startDate": "2026-10-01",
        "endDate": "2026-10-02",
        "requestedDays": "2.0",
        "reason": "Tentative plan",
        "submittedAt": "2026-08-30T10:29:18.724Z"
      },
      {
        "id": "bc7c15e6-f032-4287-8a64-f48e1ac67aa8",
        "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
        "employeeCode": "TESTDIPR20260036",
        "employeeName": "Diana Prince",
        "leaveTypeName": "Casual Leave",
        "leaveTypeCode": "CASUAL_1788085737574",
        "startDate": "2026-09-20",
        "endDate": "2026-09-21",
        "requestedDays": "1.0",
        "reason": "Weekend extension",
        "submittedAt": "2026-08-30T10:29:16.209Z"
      },
      {
        "id": "53299b28-6206-4c29-947e-081b64d7b628",
        "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
        "employeeCode": "TESTDIPR20260036",
        "employeeName": "Diana Prince",
        "leaveTypeName": "Casual Leave",
        "leaveTypeCode": "CASUAL_1788085737574",
        "startDate": "2026-09-10",
        "endDate": "2026-09-11",
        "requestedDays": "2.0",
        "reason": "Family wedding event",
        "submittedAt": "2026-08-30T10:29:11.395Z"
      },
      {
        "id": "cd698ae7-5710-427f-95c4-b730e092c6d3",
        "employeeId": "f395ce56-3ce4-4c96-8dbe-5317f5e6f5e3",
        "employeeCode": "TESTDIPR20260027",
        "employeeName": "Diana Prince",
        "leaveTypeName": "Casual Leave",
        "leaveTypeCode": "CASUAL_1788084773277",
        "startDate": "2026-10-01",
        "endDate": "2026-10-02",
        "requestedDays": "2.0",
        "reason": "Tentative plan",
        "submittedAt": "2026-08-30T10:13:13.919Z"
      },
      {
        "id": "bbe4705e-04af-4a75-a615-12c3a13d8283",
        "employeeId": "f395ce56-3ce4-4c96-8dbe-5317f5e6f5e3",
        "employeeCode": "TESTDIPR20260027",
        "employeeName": "Diana Prince",
        "leaveTypeName": "Casual Leave",
        "leaveTypeCode": "CASUAL_1788084773277",
        "startDate": "2026-09-20",
        "endDate": "2026-09-21",
        "requestedDays": "1.0",
        "reason": "Weekend extension",
        "submittedAt": "2026-08-30T10:13:11.553Z"
      }
    ],
    "pendingLeavesCount": 6,
    "leaveDistribution": [
      {
        "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
        "leaveTypeCode": "CASUAL_1788083768714",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
        "leaveTypeCode": "CASUAL_1788083523308",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
        "leaveTypeCode": "CASUAL_1788084091667",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
        "leaveTypeCode": "CASUAL_1788085737574",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "a82e825b-df23-4a21-9157-b924aa120560",
        "leaveTypeCode": "CASUAL_1788082885746",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
        "leaveTypeCode": "CASUAL_1788084773277",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      }
    ],
    "upcomingHolidays": []
  }
}
```

> **Note**: Provides pending leave requests queue and leave distribution by type.

---

### 8. Get Employees Headcount Slice (Admin)

- **Endpoint**: `GET /api/dashboard/employees`
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
  "message": "Employees workforce dashboard analytics retrieved",
  "success": true,
  "error": null,
  "data": {
    "headcount": {
      "total": 38,
      "active": 38,
      "probation": 0,
      "onLeave": 0,
      "terminated": 0,
      "newJoinersThisMonth": 38
    },
    "departmentBreakdown": [],
    "employmentTypeBreakdown": [
      {
        "employmentType": "full_time",
        "count": 38
      }
    ]
  }
}
```

> **Note**: Provides total active, probation, and department breakdown.

---

### 9. Get Payroll Dashboard Slice (Admin)

- **Endpoint**: `GET /api/dashboard/payroll`
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
  "message": "Payroll overview dashboard retrieved",
  "success": true,
  "error": null,
  "data": {
    "payrollMetrics": {
      "period": {
        "id": "6d0868d6-ed9e-4865-a741-9bb4edcb4166",
        "periodStart": "2061-01-01",
        "periodEnd": "2061-01-31",
        "status": "draft",
        "processedAt": null,
        "finalizedAt": null
      },
      "summary": {
        "payslipsCount": 0,
        "totalGross": "0",
        "totalDeductions": "0",
        "totalNetPay": "0"
      }
    }
  }
}
```

> **Note**: Provides latest payroll period status and financial totals.

---

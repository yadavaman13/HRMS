# Feature 08: Dashboard & Workforce Overview API

> Covers executive analytics, contextual single-employee inspection, employee self-service metrics, and modular attendance, leave, headcount, and payroll breakdowns.

## 📋 Endpoints Overview

| Method | Endpoint                                                       | Scenario                                         | Status |
| :----- | :------------------------------------------------------------- | :----------------------------------------------- | :----- |
| `GET`  | `/api/dashboard`                                               | Get Executive Dashboard via Root (Admin)         | `200`  |
| `GET`  | `/api/dashboard/admin`                                         | Get Explicit Admin Dashboard (Admin)             | `200`  |
| `GET`  | `/api/dashboard/employee`                                      | Get Employee Self-Service Dashboard (Success)    | `200`  |
| `GET`  | `/api/dashboard/me`                                            | Get My Dashboard Summary via Alias (Success)     | `200`  |
| `GET`  | `/api/dashboard/employee/c02055a5-0107-42e8-8317-ba5d6c18da49` | Get Contextual Single-Employee Dashboard (Admin) | `200`  |
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
        "total": 109,
        "active": 109,
        "probation": 0,
        "onLeave": 0,
        "terminated": 0,
        "newJoinersThisMonth": 109
      },
      "departmentBreakdown": [],
      "employmentTypeBreakdown": [
        {
          "employmentType": "full_time",
          "count": 109
        }
      ],
      "todayAttendance": {
        "totalRecords": 14,
        "present": 14,
        "absent": 0,
        "onLeave": 0,
        "halfDay": 0,
        "late": 0,
        "incomplete": 0
      },
      "pendingQueues": {
        "leavesCount": 39,
        "adjustmentsCount": 14,
        "recentPendingLeaves": [
          {
            "id": "45f10beb-c7e6-4f78-8ba4-effb0416ff4c",
            "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
            "employeeCode": "TESTDIPR20260117",
            "employeeName": "Diana Prince",
            "leaveTypeName": "Casual Leave",
            "leaveTypeCode": "CASUAL_1788110486141",
            "startDate": "2026-10-01",
            "endDate": "2026-10-02",
            "requestedDays": "2.0",
            "reason": "Tentative plan",
            "submittedAt": "2026-08-30T17:22:02.527Z"
          },
          {
            "id": "9d9dbaba-6f35-4594-85e6-663b9e58d44f",
            "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
            "employeeCode": "TESTDIPR20260117",
            "employeeName": "Diana Prince",
            "leaveTypeName": "Casual Leave",
            "leaveTypeCode": "CASUAL_1788110486141",
            "startDate": "2026-09-20",
            "endDate": "2026-09-21",
            "requestedDays": "1.0",
            "reason": "Weekend extension",
            "submittedAt": "2026-08-30T17:21:57.523Z"
          },
          {
            "id": "17c5f430-67c9-432e-8968-5fa73d5f959d",
            "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
            "employeeCode": "TESTDIPR20260117",
            "employeeName": "Diana Prince",
            "leaveTypeName": "Casual Leave",
            "leaveTypeCode": "CASUAL_1788110486141",
            "startDate": "2026-09-10",
            "endDate": "2026-09-11",
            "requestedDays": "2.0",
            "reason": "Family wedding event",
            "submittedAt": "2026-08-30T17:21:52.089Z"
          },
          {
            "id": "4db4eb76-682f-4ed4-b29d-5c77e5922f16",
            "employeeId": "7adfe249-881f-4505-8119-59a9f960f41c",
            "employeeCode": "TESTDIPR20260105",
            "employeeName": "Diana Prince",
            "leaveTypeName": "Casual Leave",
            "leaveTypeCode": "CASUAL_1788107526856",
            "startDate": "2026-10-01",
            "endDate": "2026-10-02",
            "requestedDays": "2.0",
            "reason": "Tentative plan",
            "submittedAt": "2026-08-30T16:32:27.043Z"
          },
          {
            "id": "7aae9a81-ba84-48da-8683-d1074d3473d2",
            "employeeId": "7adfe249-881f-4505-8119-59a9f960f41c",
            "employeeCode": "TESTDIPR20260105",
            "employeeName": "Diana Prince",
            "leaveTypeName": "Casual Leave",
            "leaveTypeCode": "CASUAL_1788107526856",
            "startDate": "2026-09-20",
            "endDate": "2026-09-21",
            "requestedDays": "1.0",
            "reason": "Weekend extension",
            "submittedAt": "2026-08-30T16:32:24.622Z"
          }
        ]
      },
      "payrollMetrics": {
        "period": {
          "id": "a29c0425-6d43-4580-b5bb-e752fb240114",
          "periodStart": "2077-01-01",
          "periodEnd": "2077-01-31",
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
          "present": 14,
          "absent": 0,
          "onLeave": 0,
          "halfDay": 0
        }
      ],
      "leaveDistribution": [
        {
          "leaveTypeId": "f65f4aa5-28a3-4db5-9f67-0ac999df0c6e",
          "leaveTypeCode": "CASUAL_1788099236806",
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
          "leaveTypeId": "c3de17eb-687b-4b37-9feb-84a981c035ab",
          "leaveTypeCode": "CASUAL_1788102118247",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        },
        {
          "leaveTypeId": "031dfa32-ec1d-4e53-9b79-3293238a216b",
          "leaveTypeCode": "CASUAL_1788105822180",
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
          "leaveTypeId": "1d5c27f2-1e76-414a-9f3a-6251192b6700",
          "leaveTypeCode": "CASUAL_1788103701714",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        },
        {
          "leaveTypeId": "e59e317a-e99b-4447-8422-e165162090bb",
          "leaveTypeCode": "CASUAL_1788104986171",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        },
        {
          "leaveTypeId": "31d51bf6-2a08-4608-b41a-a0c962da0bb5",
          "leaveTypeCode": "CASUAL_1788107526856",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        },
        {
          "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
          "leaveTypeCode": "CASUAL_1788083768714",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        },
        {
          "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
          "leaveTypeCode": "CASUAL_1788110486141",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        },
        {
          "leaveTypeId": "67033965-e743-4b4f-8a22-e83963669659",
          "leaveTypeCode": "CASUAL_1788104338205",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        },
        {
          "leaveTypeId": "b431df60-253a-41a4-a822-946a11ede30e",
          "leaveTypeCode": "CASUAL_1788101953267",
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
        },
        {
          "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
          "leaveTypeCode": "CASUAL_1788083523308",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        },
        {
          "leaveTypeId": "5d906089-6b69-4d04-beaf-f3c98e52204f",
          "leaveTypeCode": "CASUAL_1788106684722",
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
          "leaveTypeId": "41c1e56b-57d7-453c-9566-8214b2e155ac",
          "leaveTypeCode": "CASUAL_1788102782922",
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
      "total": 109,
      "active": 109,
      "probation": 0,
      "onLeave": 0,
      "terminated": 0,
      "newJoinersThisMonth": 109
    },
    "departmentBreakdown": [],
    "employmentTypeBreakdown": [
      {
        "employmentType": "full_time",
        "count": 109
      }
    ],
    "todayAttendance": {
      "totalRecords": 14,
      "present": 14,
      "absent": 0,
      "onLeave": 0,
      "halfDay": 0,
      "late": 0,
      "incomplete": 0
    },
    "pendingQueues": {
      "leavesCount": 39,
      "adjustmentsCount": 14,
      "recentPendingLeaves": [
        {
          "id": "45f10beb-c7e6-4f78-8ba4-effb0416ff4c",
          "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
          "employeeCode": "TESTDIPR20260117",
          "employeeName": "Diana Prince",
          "leaveTypeName": "Casual Leave",
          "leaveTypeCode": "CASUAL_1788110486141",
          "startDate": "2026-10-01",
          "endDate": "2026-10-02",
          "requestedDays": "2.0",
          "reason": "Tentative plan",
          "submittedAt": "2026-08-30T17:22:02.527Z"
        },
        {
          "id": "9d9dbaba-6f35-4594-85e6-663b9e58d44f",
          "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
          "employeeCode": "TESTDIPR20260117",
          "employeeName": "Diana Prince",
          "leaveTypeName": "Casual Leave",
          "leaveTypeCode": "CASUAL_1788110486141",
          "startDate": "2026-09-20",
          "endDate": "2026-09-21",
          "requestedDays": "1.0",
          "reason": "Weekend extension",
          "submittedAt": "2026-08-30T17:21:57.523Z"
        },
        {
          "id": "17c5f430-67c9-432e-8968-5fa73d5f959d",
          "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
          "employeeCode": "TESTDIPR20260117",
          "employeeName": "Diana Prince",
          "leaveTypeName": "Casual Leave",
          "leaveTypeCode": "CASUAL_1788110486141",
          "startDate": "2026-09-10",
          "endDate": "2026-09-11",
          "requestedDays": "2.0",
          "reason": "Family wedding event",
          "submittedAt": "2026-08-30T17:21:52.089Z"
        },
        {
          "id": "4db4eb76-682f-4ed4-b29d-5c77e5922f16",
          "employeeId": "7adfe249-881f-4505-8119-59a9f960f41c",
          "employeeCode": "TESTDIPR20260105",
          "employeeName": "Diana Prince",
          "leaveTypeName": "Casual Leave",
          "leaveTypeCode": "CASUAL_1788107526856",
          "startDate": "2026-10-01",
          "endDate": "2026-10-02",
          "requestedDays": "2.0",
          "reason": "Tentative plan",
          "submittedAt": "2026-08-30T16:32:27.043Z"
        },
        {
          "id": "7aae9a81-ba84-48da-8683-d1074d3473d2",
          "employeeId": "7adfe249-881f-4505-8119-59a9f960f41c",
          "employeeCode": "TESTDIPR20260105",
          "employeeName": "Diana Prince",
          "leaveTypeName": "Casual Leave",
          "leaveTypeCode": "CASUAL_1788107526856",
          "startDate": "2026-09-20",
          "endDate": "2026-09-21",
          "requestedDays": "1.0",
          "reason": "Weekend extension",
          "submittedAt": "2026-08-30T16:32:24.622Z"
        }
      ]
    },
    "payrollMetrics": {
      "period": {
        "id": "a29c0425-6d43-4580-b5bb-e752fb240114",
        "periodStart": "2077-01-01",
        "periodEnd": "2077-01-31",
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
        "present": 14,
        "absent": 0,
        "onLeave": 0,
        "halfDay": 0
      }
    ],
    "leaveDistribution": [
      {
        "leaveTypeId": "f65f4aa5-28a3-4db5-9f67-0ac999df0c6e",
        "leaveTypeCode": "CASUAL_1788099236806",
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
        "leaveTypeId": "c3de17eb-687b-4b37-9feb-84a981c035ab",
        "leaveTypeCode": "CASUAL_1788102118247",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "031dfa32-ec1d-4e53-9b79-3293238a216b",
        "leaveTypeCode": "CASUAL_1788105822180",
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
        "leaveTypeId": "1d5c27f2-1e76-414a-9f3a-6251192b6700",
        "leaveTypeCode": "CASUAL_1788103701714",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "e59e317a-e99b-4447-8422-e165162090bb",
        "leaveTypeCode": "CASUAL_1788104986171",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "31d51bf6-2a08-4608-b41a-a0c962da0bb5",
        "leaveTypeCode": "CASUAL_1788107526856",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
        "leaveTypeCode": "CASUAL_1788083768714",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
        "leaveTypeCode": "CASUAL_1788110486141",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "67033965-e743-4b4f-8a22-e83963669659",
        "leaveTypeCode": "CASUAL_1788104338205",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "b431df60-253a-41a4-a822-946a11ede30e",
        "leaveTypeCode": "CASUAL_1788101953267",
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
      },
      {
        "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
        "leaveTypeCode": "CASUAL_1788083523308",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "5d906089-6b69-4d04-beaf-f3c98e52204f",
        "leaveTypeCode": "CASUAL_1788106684722",
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
        "leaveTypeId": "41c1e56b-57d7-453c-9566-8214b2e155ac",
        "leaveTypeCode": "CASUAL_1788102782922",
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
      "id": "c02055a5-0107-42e8-8317-ba5d6c18da49",
      "employeeCode": "TESTGECL20260120",
      "firstName": "George",
      "lastName": "Clark",
      "displayName": "George Clark",
      "workEmail": "george.clark14@testorg.dayflow.com",
      "joiningDate": "2026-08-01",
      "employmentStatus": "active",
      "departmentName": null,
      "jobPositionName": null,
      "locationName": null
    },
    "employee": {
      "id": "c02055a5-0107-42e8-8317-ba5d6c18da49",
      "employeeCode": "TESTGECL20260120",
      "firstName": "George",
      "lastName": "Clark",
      "displayName": "George Clark",
      "workEmail": "george.clark14@testorg.dayflow.com",
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
      },
      {
        "leaveTypeId": "f65f4aa5-28a3-4db5-9f67-0ac999df0c6e",
        "leaveTypeCode": "CASUAL_1788099236806",
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
        "leaveTypeId": "b431df60-253a-41a4-a822-946a11ede30e",
        "leaveTypeCode": "CASUAL_1788101953267",
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
        "leaveTypeId": "c3de17eb-687b-4b37-9feb-84a981c035ab",
        "leaveTypeCode": "CASUAL_1788102118247",
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
        "leaveTypeId": "41c1e56b-57d7-453c-9566-8214b2e155ac",
        "leaveTypeCode": "CASUAL_1788102782922",
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
        "leaveTypeId": "1d5c27f2-1e76-414a-9f3a-6251192b6700",
        "leaveTypeCode": "CASUAL_1788103701714",
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
        "leaveTypeId": "67033965-e743-4b4f-8a22-e83963669659",
        "leaveTypeCode": "CASUAL_1788104338205",
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
        "leaveTypeId": "e59e317a-e99b-4447-8422-e165162090bb",
        "leaveTypeCode": "CASUAL_1788104986171",
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
        "leaveTypeId": "031dfa32-ec1d-4e53-9b79-3293238a216b",
        "leaveTypeCode": "CASUAL_1788105822180",
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
        "leaveTypeId": "5d906089-6b69-4d04-beaf-f3c98e52204f",
        "leaveTypeCode": "CASUAL_1788106684722",
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
        "leaveTypeId": "31d51bf6-2a08-4608-b41a-a0c962da0bb5",
        "leaveTypeCode": "CASUAL_1788107526856",
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
        "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
        "leaveTypeCode": "CASUAL_1788110486141",
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
      "id": "c02055a5-0107-42e8-8317-ba5d6c18da49",
      "employeeCode": "TESTGECL20260120",
      "firstName": "George",
      "lastName": "Clark",
      "displayName": "George Clark",
      "workEmail": "george.clark14@testorg.dayflow.com",
      "joiningDate": "2026-08-01",
      "employmentStatus": "active",
      "departmentName": null,
      "jobPositionName": null,
      "locationName": null
    },
    "employee": {
      "id": "c02055a5-0107-42e8-8317-ba5d6c18da49",
      "employeeCode": "TESTGECL20260120",
      "firstName": "George",
      "lastName": "Clark",
      "displayName": "George Clark",
      "workEmail": "george.clark14@testorg.dayflow.com",
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
      },
      {
        "leaveTypeId": "f65f4aa5-28a3-4db5-9f67-0ac999df0c6e",
        "leaveTypeCode": "CASUAL_1788099236806",
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
        "leaveTypeId": "b431df60-253a-41a4-a822-946a11ede30e",
        "leaveTypeCode": "CASUAL_1788101953267",
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
        "leaveTypeId": "c3de17eb-687b-4b37-9feb-84a981c035ab",
        "leaveTypeCode": "CASUAL_1788102118247",
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
        "leaveTypeId": "41c1e56b-57d7-453c-9566-8214b2e155ac",
        "leaveTypeCode": "CASUAL_1788102782922",
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
        "leaveTypeId": "1d5c27f2-1e76-414a-9f3a-6251192b6700",
        "leaveTypeCode": "CASUAL_1788103701714",
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
        "leaveTypeId": "67033965-e743-4b4f-8a22-e83963669659",
        "leaveTypeCode": "CASUAL_1788104338205",
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
        "leaveTypeId": "e59e317a-e99b-4447-8422-e165162090bb",
        "leaveTypeCode": "CASUAL_1788104986171",
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
        "leaveTypeId": "031dfa32-ec1d-4e53-9b79-3293238a216b",
        "leaveTypeCode": "CASUAL_1788105822180",
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
        "leaveTypeId": "5d906089-6b69-4d04-beaf-f3c98e52204f",
        "leaveTypeCode": "CASUAL_1788106684722",
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
        "leaveTypeId": "31d51bf6-2a08-4608-b41a-a0c962da0bb5",
        "leaveTypeCode": "CASUAL_1788107526856",
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
        "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
        "leaveTypeCode": "CASUAL_1788110486141",
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

- **Endpoint**: `GET /api/dashboard/employee/c02055a5-0107-42e8-8317-ba5d6c18da49`
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
      "id": "c02055a5-0107-42e8-8317-ba5d6c18da49",
      "employeeCode": "TESTGECL20260120",
      "firstName": "George",
      "lastName": "Clark",
      "displayName": "George Clark",
      "workEmail": "george.clark14@testorg.dayflow.com",
      "joiningDate": "2026-08-01",
      "employmentStatus": "active",
      "departmentName": null,
      "jobPositionName": null,
      "locationName": null
    },
    "employee": {
      "id": "c02055a5-0107-42e8-8317-ba5d6c18da49",
      "employeeCode": "TESTGECL20260120",
      "firstName": "George",
      "lastName": "Clark",
      "displayName": "George Clark",
      "workEmail": "george.clark14@testorg.dayflow.com",
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
      },
      {
        "leaveTypeId": "f65f4aa5-28a3-4db5-9f67-0ac999df0c6e",
        "leaveTypeCode": "CASUAL_1788099236806",
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
        "leaveTypeId": "b431df60-253a-41a4-a822-946a11ede30e",
        "leaveTypeCode": "CASUAL_1788101953267",
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
        "leaveTypeId": "c3de17eb-687b-4b37-9feb-84a981c035ab",
        "leaveTypeCode": "CASUAL_1788102118247",
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
        "leaveTypeId": "41c1e56b-57d7-453c-9566-8214b2e155ac",
        "leaveTypeCode": "CASUAL_1788102782922",
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
        "leaveTypeId": "1d5c27f2-1e76-414a-9f3a-6251192b6700",
        "leaveTypeCode": "CASUAL_1788103701714",
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
        "leaveTypeId": "67033965-e743-4b4f-8a22-e83963669659",
        "leaveTypeCode": "CASUAL_1788104338205",
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
        "leaveTypeId": "e59e317a-e99b-4447-8422-e165162090bb",
        "leaveTypeCode": "CASUAL_1788104986171",
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
        "leaveTypeId": "031dfa32-ec1d-4e53-9b79-3293238a216b",
        "leaveTypeCode": "CASUAL_1788105822180",
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
        "leaveTypeId": "5d906089-6b69-4d04-beaf-f3c98e52204f",
        "leaveTypeCode": "CASUAL_1788106684722",
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
        "leaveTypeId": "31d51bf6-2a08-4608-b41a-a0c962da0bb5",
        "leaveTypeCode": "CASUAL_1788107526856",
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
        "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
        "leaveTypeCode": "CASUAL_1788110486141",
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
      "totalRecords": 14,
      "present": 14,
      "absent": 0,
      "onLeave": 0,
      "halfDay": 0,
      "late": 0,
      "incomplete": 0
    },
    "past7DaysAttendance": [
      {
        "date": "2026-08-30",
        "present": 14,
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
        "id": "45f10beb-c7e6-4f78-8ba4-effb0416ff4c",
        "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
        "employeeCode": "TESTDIPR20260117",
        "employeeName": "Diana Prince",
        "leaveTypeName": "Casual Leave",
        "leaveTypeCode": "CASUAL_1788110486141",
        "startDate": "2026-10-01",
        "endDate": "2026-10-02",
        "requestedDays": "2.0",
        "reason": "Tentative plan",
        "submittedAt": "2026-08-30T17:22:02.527Z"
      },
      {
        "id": "9d9dbaba-6f35-4594-85e6-663b9e58d44f",
        "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
        "employeeCode": "TESTDIPR20260117",
        "employeeName": "Diana Prince",
        "leaveTypeName": "Casual Leave",
        "leaveTypeCode": "CASUAL_1788110486141",
        "startDate": "2026-09-20",
        "endDate": "2026-09-21",
        "requestedDays": "1.0",
        "reason": "Weekend extension",
        "submittedAt": "2026-08-30T17:21:57.523Z"
      },
      {
        "id": "17c5f430-67c9-432e-8968-5fa73d5f959d",
        "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
        "employeeCode": "TESTDIPR20260117",
        "employeeName": "Diana Prince",
        "leaveTypeName": "Casual Leave",
        "leaveTypeCode": "CASUAL_1788110486141",
        "startDate": "2026-09-10",
        "endDate": "2026-09-11",
        "requestedDays": "2.0",
        "reason": "Family wedding event",
        "submittedAt": "2026-08-30T17:21:52.089Z"
      },
      {
        "id": "4db4eb76-682f-4ed4-b29d-5c77e5922f16",
        "employeeId": "7adfe249-881f-4505-8119-59a9f960f41c",
        "employeeCode": "TESTDIPR20260105",
        "employeeName": "Diana Prince",
        "leaveTypeName": "Casual Leave",
        "leaveTypeCode": "CASUAL_1788107526856",
        "startDate": "2026-10-01",
        "endDate": "2026-10-02",
        "requestedDays": "2.0",
        "reason": "Tentative plan",
        "submittedAt": "2026-08-30T16:32:27.043Z"
      },
      {
        "id": "7aae9a81-ba84-48da-8683-d1074d3473d2",
        "employeeId": "7adfe249-881f-4505-8119-59a9f960f41c",
        "employeeCode": "TESTDIPR20260105",
        "employeeName": "Diana Prince",
        "leaveTypeName": "Casual Leave",
        "leaveTypeCode": "CASUAL_1788107526856",
        "startDate": "2026-09-20",
        "endDate": "2026-09-21",
        "requestedDays": "1.0",
        "reason": "Weekend extension",
        "submittedAt": "2026-08-30T16:32:24.622Z"
      }
    ],
    "pendingLeavesCount": 39,
    "leaveDistribution": [
      {
        "leaveTypeId": "f65f4aa5-28a3-4db5-9f67-0ac999df0c6e",
        "leaveTypeCode": "CASUAL_1788099236806",
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
        "leaveTypeId": "c3de17eb-687b-4b37-9feb-84a981c035ab",
        "leaveTypeCode": "CASUAL_1788102118247",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "031dfa32-ec1d-4e53-9b79-3293238a216b",
        "leaveTypeCode": "CASUAL_1788105822180",
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
        "leaveTypeId": "1d5c27f2-1e76-414a-9f3a-6251192b6700",
        "leaveTypeCode": "CASUAL_1788103701714",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "e59e317a-e99b-4447-8422-e165162090bb",
        "leaveTypeCode": "CASUAL_1788104986171",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "31d51bf6-2a08-4608-b41a-a0c962da0bb5",
        "leaveTypeCode": "CASUAL_1788107526856",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
        "leaveTypeCode": "CASUAL_1788083768714",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "c2a2927a-35ab-4415-827b-f280f5587bcf",
        "leaveTypeCode": "CASUAL_1788110486141",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "67033965-e743-4b4f-8a22-e83963669659",
        "leaveTypeCode": "CASUAL_1788104338205",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "b431df60-253a-41a4-a822-946a11ede30e",
        "leaveTypeCode": "CASUAL_1788101953267",
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
      },
      {
        "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
        "leaveTypeCode": "CASUAL_1788083523308",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "5d906089-6b69-4d04-beaf-f3c98e52204f",
        "leaveTypeCode": "CASUAL_1788106684722",
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
        "leaveTypeId": "41c1e56b-57d7-453c-9566-8214b2e155ac",
        "leaveTypeCode": "CASUAL_1788102782922",
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
      "total": 109,
      "active": 109,
      "probation": 0,
      "onLeave": 0,
      "terminated": 0,
      "newJoinersThisMonth": 109
    },
    "departmentBreakdown": [],
    "employmentTypeBreakdown": [
      {
        "employmentType": "full_time",
        "count": 109
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
        "id": "a29c0425-6d43-4580-b5bb-e752fb240114",
        "periodStart": "2077-01-01",
        "periodEnd": "2077-01-31",
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

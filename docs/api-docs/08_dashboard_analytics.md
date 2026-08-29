# Feature 08: Dashboard & Workforce Overview API

> Covers executive analytics, employee self-service metrics, and modular attendance, leave, headcount, and payroll breakdowns.

## 📋 Endpoints Overview

| Method | Endpoint | Scenario | Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Get Executive Dashboard (Admin) | `200` |
| `GET` | `/api/dashboard/attendance` | Get Attendance Dashboard Slice (Admin) | `200` |
| `GET` | `/api/dashboard/leave` | Get Leave Dashboard Slice (Admin) | `200` |
| `GET` | `/api/dashboard/employees` | Get Employees Headcount Slice (Admin) | `200` |
| `GET` | `/api/dashboard/payroll` | Get Payroll Dashboard Slice (Admin) | `200` |

---

## 🔍 Detailed Scenarios & Outputs

### 1. Get Executive Dashboard (Admin)

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
        "total": 28,
        "active": 28,
        "probation": 0,
        "onLeave": 0,
        "terminated": 0,
        "newJoinersThisMonth": 28
      },
      "departmentBreakdown": [
        {
          "departmentId": "282fdfd2-b8cb-4c34-be62-8773ea17d1bc",
          "departmentName": "Engineering 1787995797181",
          "departmentCode": "ENG_1787995797181",
          "employeeCount": 0
        },
        {
          "departmentId": "9bff2d77-1ce7-4aeb-8166-56e663e97131",
          "departmentName": "Engineering 1787997490949",
          "departmentCode": "ENG_1787997490949",
          "employeeCount": 0
        },
        {
          "departmentId": "f094e735-bfd0-416f-b861-06d19fdcde32",
          "departmentName": "Engineering 1787995274781",
          "departmentCode": "ENG_1787995274781",
          "employeeCount": 0
        }
      ],
      "employmentTypeBreakdown": [
        {
          "employmentType": "full_time",
          "count": 28
        }
      ],
      "todayAttendance": {
        "totalRecords": 0,
        "present": 0,
        "absent": 0,
        "onLeave": 0,
        "halfDay": 0,
        "late": 0,
        "incomplete": 0
      },
      "pendingQueues": {
        "leavesCount": 0,
        "adjustmentsCount": 0,
        "recentPendingLeaves": []
      },
      "payrollMetrics": {
        "period": {
          "id": "50b93a88-cf43-48d4-a519-70f21a44a73c",
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
      "past7DaysAttendance": [],
      "leaveDistribution": [
        {
          "leaveTypeId": "57e87d7b-50ec-4bce-9c22-720c5473aadb",
          "leaveTypeCode": "CASUAL_1787995205725",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        },
        {
          "leaveTypeId": "6edbb793-9e48-494c-9053-6efc5df02c54",
          "leaveTypeCode": "CASUAL_1787997139545",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        },
        {
          "leaveTypeId": "7423d82e-97a1-4506-a298-9ecf514ac26b",
          "leaveTypeCode": "CASUAL_1787998021296",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        },
        {
          "leaveTypeId": "7d7bf7e7-d942-447f-96e1-175366fd936d",
          "leaveTypeCode": "CASUAL_1787997915667",
          "leaveTypeName": "Casual Leave",
          "totalDays": "0",
          "requestCount": 0
        },
        {
          "leaveTypeId": "f544a4d9-e736-4db8-a0ff-518d157145c9",
          "leaveTypeCode": "CASUAL_1787995735466",
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

### 2. Get Attendance Dashboard Slice (Admin)

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
      "totalRecords": 0,
      "present": 0,
      "absent": 0,
      "onLeave": 0,
      "halfDay": 0,
      "late": 0,
      "incomplete": 0
    },
    "past7DaysAttendance": [],
    "upcomingHolidays": []
  }
}
```

> **Note**: Provides today attendance counts, 7-day trend, and pending regularization requests.

---

### 3. Get Leave Dashboard Slice (Admin)

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
    "pendingLeaves": [],
    "pendingLeavesCount": 0,
    "leaveDistribution": [
      {
        "leaveTypeId": "57e87d7b-50ec-4bce-9c22-720c5473aadb",
        "leaveTypeCode": "CASUAL_1787995205725",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "6edbb793-9e48-494c-9053-6efc5df02c54",
        "leaveTypeCode": "CASUAL_1787997139545",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "7423d82e-97a1-4506-a298-9ecf514ac26b",
        "leaveTypeCode": "CASUAL_1787998021296",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "7d7bf7e7-d942-447f-96e1-175366fd936d",
        "leaveTypeCode": "CASUAL_1787997915667",
        "leaveTypeName": "Casual Leave",
        "totalDays": "0",
        "requestCount": 0
      },
      {
        "leaveTypeId": "f544a4d9-e736-4db8-a0ff-518d157145c9",
        "leaveTypeCode": "CASUAL_1787995735466",
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

### 4. Get Employees Headcount Slice (Admin)

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
      "total": 28,
      "active": 28,
      "probation": 0,
      "onLeave": 0,
      "terminated": 0,
      "newJoinersThisMonth": 28
    },
    "departmentBreakdown": [
      {
        "departmentId": "282fdfd2-b8cb-4c34-be62-8773ea17d1bc",
        "departmentName": "Engineering 1787995797181",
        "departmentCode": "ENG_1787995797181",
        "employeeCount": 0
      },
      {
        "departmentId": "9bff2d77-1ce7-4aeb-8166-56e663e97131",
        "departmentName": "Engineering 1787997490949",
        "departmentCode": "ENG_1787997490949",
        "employeeCount": 0
      },
      {
        "departmentId": "f094e735-bfd0-416f-b861-06d19fdcde32",
        "departmentName": "Engineering 1787995274781",
        "departmentCode": "ENG_1787995274781",
        "employeeCount": 0
      }
    ],
    "employmentTypeBreakdown": [
      {
        "employmentType": "full_time",
        "count": 28
      }
    ]
  }
}
```

> **Note**: Provides total active, probation, and department breakdown.

---

### 5. Get Payroll Dashboard Slice (Admin)

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
        "id": "50b93a88-cf43-48d4-a519-70f21a44a73c",
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


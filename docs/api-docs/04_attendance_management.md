# Feature 04: Attendance Tracking & Regularization API

> Covers punch-in, punch-out, overtime tracking, status computation, timesheet CSV export, regularization adjustment requests, and admin oversight.

## 📋 Endpoints Overview

| Method  | Endpoint                                                        | Scenario                                    | Status |
| :------ | :-------------------------------------------------------------- | :------------------------------------------ | :----- |
| `POST`  | `/api/attendance/check-in`                                      | Employee Check-In (Success)                 | `201`  |
| `POST`  | `/api/attendance/check-in`                                      | Duplicate Check-In (Rejected)               | `400`  |
| `POST`  | `/api/attendance/check-out`                                     | Employee Check-Out (Success)                | `200`  |
| `GET`   | `/api/attendance/me`                                            | Get My Attendance Records (Success)         | `200`  |
| `GET`   | `/api/attendance/me/summary`                                    | Get Attendance Summary Counters (Success)   | `200`  |
| `GET`   | `/api/attendance/export`                                        | Export Attendance Timesheet CSV (Success)   | `200`  |
| `POST`  | `/api/attendance/74049a1f-5952-4209-a6b0-d2ff32bedbf2/adjust`   | Request Attendance Regularization (Success) | `201`  |
| `GET`   | `/api/attendance/adjustments/me`                                | Get My Regularization Requests (Success)    | `200`  |
| `GET`   | `/api/attendance/adjustments`                                   | Get Regularization Inbox (Admin)            | `200`  |
| `GET`   | `/api/attendance/summary`                                       | Get Company Attendance Summary (Admin)      | `200`  |
| `GET`   | `/api/attendance/employee/d12015b5-c157-4634-8ed5-d69965fc5267` | Get Specific Employee Attendance (Admin)    | `200`  |
| `GET`   | `/api/attendance`                                               | List All Attendance Records (Admin)         | `200`  |
| `GET`   | `/api/attendance/74049a1f-5952-4209-a6b0-d2ff32bedbf2`          | Get Attendance Record by ID (Success)       | `200`  |
| `PATCH` | `/api/attendance/74049a1f-5952-4209-a6b0-d2ff32bedbf2`          | Manual Attendance Record Correction (Admin) | `200`  |

---

## 🔍 Detailed Scenarios & Outputs

### 1. Employee Check-In (Success)

- **Endpoint**: `POST /api/attendance/check-in`
- **Expected Status**: `201`
- **Headers**:

```json
{
  "Cookie": "token=JWT_EMPLOYEE_TOKEN"
}
```

- **Response Body**:

```json
{
  "message": "Checked in successfully",
  "success": true,
  "error": null,
  "data": {
    "record": {
      "id": "74049a1f-5952-4209-a6b0-d2ff32bedbf2",
      "employeeId": "d12015b5-c157-4634-8ed5-d69965fc5267",
      "attendanceDate": "2026-08-30",
      "status": "present",
      "totalWorkMinutes": 0,
      "scheduledWorkMinutes": 480,
      "overtimeMinutes": 0,
      "lateMinutes": 0,
      "earlyCheckoutMinutes": 0,
      "remarks": null,
      "source": "system",
      "createdAt": "2026-08-30T10:28:28.340Z",
      "updatedAt": "2026-08-30T10:28:28.340Z"
    },
    "session": {
      "id": "56dbb787-b524-4f67-a7c1-05ad0f4896c3",
      "attendanceRecordId": "74049a1f-5952-4209-a6b0-d2ff32bedbf2",
      "checkInAt": "2026-08-30T10:28:27.785Z",
      "checkOutAt": null,
      "workedMinutes": null,
      "breakMinutes": 0,
      "createdAt": "2026-08-30T10:28:28.690Z"
    }
  }
}
```

> **Note**: Records daily punch-in with schedule lookup and late arrival calculation.

---

### 2. Duplicate Check-In (Rejected)

- **Endpoint**: `POST /api/attendance/check-in`
- **Expected Status**: `400`
- **Headers**:

```json
{
  "Cookie": "token=JWT_EMPLOYEE_TOKEN"
}
```

- **Response Body**:

```json
{
  "message": "Active check-in session already in progress. Please check out first.",
  "success": false,
  "error": null,
  "data": {
    "activeSession": {
      "id": "56dbb787-b524-4f67-a7c1-05ad0f4896c3",
      "attendanceRecordId": "74049a1f-5952-4209-a6b0-d2ff32bedbf2",
      "checkInAt": "2026-08-30T10:28:27.785Z",
      "checkOutAt": null,
      "workedMinutes": null,
      "breakMinutes": 0,
      "createdAt": "2026-08-30T10:28:28.690Z"
    }
  }
}
```

> **Note**: Prevents double punch-in when an active session is already running.

---

### 3. Employee Check-Out (Success)

- **Endpoint**: `POST /api/attendance/check-out`
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
  "message": "Checked out successfully",
  "success": true,
  "error": null,
  "data": {
    "record": {
      "id": "74049a1f-5952-4209-a6b0-d2ff32bedbf2",
      "employeeId": "d12015b5-c157-4634-8ed5-d69965fc5267",
      "attendanceDate": "2026-08-30",
      "status": "absent",
      "totalWorkMinutes": 0,
      "scheduledWorkMinutes": 480,
      "overtimeMinutes": 0,
      "lateMinutes": 0,
      "earlyCheckoutMinutes": 0,
      "remarks": null,
      "source": "system",
      "createdAt": "2026-08-30T10:28:28.340Z",
      "updatedAt": "2026-08-30T10:28:32.050Z"
    },
    "session": {
      "id": "56dbb787-b524-4f67-a7c1-05ad0f4896c3",
      "attendanceRecordId": "74049a1f-5952-4209-a6b0-d2ff32bedbf2",
      "checkInAt": "2026-08-30T10:28:27.785Z",
      "checkOutAt": "2026-08-30T10:28:30.894Z",
      "workedMinutes": 0,
      "breakMinutes": 0,
      "createdAt": "2026-08-30T10:28:28.690Z"
    },
    "metrics": {
      "totalWorkMinutes": 0,
      "scheduledWorkMinutes": 480,
      "overtimeMinutes": 0,
      "lateMinutes": 0,
      "earlyCheckoutMinutes": 0,
      "status": "absent"
    }
  }
}
```

> **Note**: Closes punch session and computes work duration and overtime.

---

### 4. Get My Attendance Records (Success)

- **Endpoint**: `GET /api/attendance/me`
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
  "message": "Attendance records retrieved",
  "success": true,
  "error": null,
  "data": {
    "total": 1,
    "limit": 50,
    "offset": 0,
    "records": [
      {
        "id": "74049a1f-5952-4209-a6b0-d2ff32bedbf2",
        "employeeId": "d12015b5-c157-4634-8ed5-d69965fc5267",
        "attendanceDate": "2026-08-30",
        "status": "absent",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "system",
        "createdAt": "2026-08-30T10:28:28.340Z",
        "updatedAt": "2026-08-30T10:28:32.050Z",
        "employeeCode": "TESTCHDA20260035",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis7@testorg.dayflow.com",
        "departmentId": null,
        "departmentName": null
      }
    ]
  }
}
```

> **Note**: Retrieves current employee punch history for calendar rendering.

---

### 5. Get Attendance Summary Counters (Success)

- **Endpoint**: `GET /api/attendance/me/summary`
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
  "message": "Attendance monthly summary retrieved",
  "success": true,
  "error": null,
  "data": {
    "month": "2026-08",
    "startDate": "2026-08-01",
    "endDate": "2026-08-31",
    "totalRecords": 1,
    "presentDays": 0,
    "halfDays": 0,
    "absentDays": 1,
    "leaveDays": 0,
    "holidayDays": 0,
    "weeklyOffDays": 0,
    "incompleteDays": 0,
    "totalWorkMinutes": 0,
    "totalOvertimeMinutes": 0,
    "totalLateMinutes": 0,
    "lateDaysCount": 0,
    "totalWorkHours": 0,
    "totalOvertimeHours": 0
  }
}
```

> **Note**: Aggregates present days, absent days, and overtime totals.

---

### 6. Export Attendance Timesheet CSV (Success)

- **Endpoint**: `GET /api/attendance/export`
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
  "month": "8",
  "year": "2026"
}
```

- **Response Body**:

```json
{
  "contentType": "text/csv; charset=utf-8",
  "status": "CSV Stream"
}
```

> **Note**: Streams CSV formatted attendance timesheets for payroll validation and external reporting.

---

### 7. Request Attendance Regularization (Success)

- **Endpoint**: `POST /api/attendance/74049a1f-5952-4209-a6b0-d2ff32bedbf2/adjust`
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
  "requestedCheckIn": "2026-08-30T09:00:00.000Z",
  "requestedCheckOut": "2026-08-30T18:00:00.000Z",
  "reason": "Forgot to clock out on mobile device"
}
```

- **Response Body**:

```json
{
  "message": "Attendance regularization request submitted successfully",
  "success": true,
  "error": null,
  "data": {
    "id": "a2e4d234-db14-4fad-9a6e-09319784420a",
    "attendanceRecordId": "74049a1f-5952-4209-a6b0-d2ff32bedbf2",
    "requestedBy": "332e80b0-4fa9-4e14-a574-f346719f296b",
    "approvedBy": null,
    "oldValue": {
      "status": "absent",
      "remarks": null,
      "lateMinutes": 0,
      "overtimeMinutes": 0,
      "totalWorkMinutes": 0,
      "earlyCheckoutMinutes": 0,
      "scheduledWorkMinutes": 480
    },
    "newValue": {
      "status": "absent",
      "remarks": null,
      "checkInAt": null,
      "checkOutAt": null,
      "totalWorkMinutes": 0
    },
    "reason": "Forgot to clock out on mobile device",
    "status": "pending",
    "createdAt": "2026-08-30T10:28:36.570Z",
    "updatedAt": "2026-08-30T10:28:36.570Z"
  }
}
```

> **Note**: Submits attendance correction request for HR/Manager review.

---

### 8. Get My Regularization Requests (Success)

- **Endpoint**: `GET /api/attendance/adjustments/me`
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
  "message": "My adjustment requests retrieved",
  "success": true,
  "error": null,
  "data": {
    "total": 1,
    "limit": 50,
    "offset": 0,
    "adjustments": [
      {
        "id": "a2e4d234-db14-4fad-9a6e-09319784420a",
        "attendanceRecordId": "74049a1f-5952-4209-a6b0-d2ff32bedbf2",
        "requestedBy": "332e80b0-4fa9-4e14-a574-f346719f296b",
        "approvedBy": null,
        "oldValue": {
          "status": "absent",
          "remarks": null,
          "lateMinutes": 0,
          "overtimeMinutes": 0,
          "totalWorkMinutes": 0,
          "earlyCheckoutMinutes": 0,
          "scheduledWorkMinutes": 480
        },
        "newValue": {
          "status": "absent",
          "remarks": null,
          "checkInAt": null,
          "checkOutAt": null,
          "totalWorkMinutes": 0
        },
        "reason": "Forgot to clock out on mobile device",
        "status": "pending",
        "createdAt": "2026-08-30T10:28:36.570Z",
        "updatedAt": "2026-08-30T10:28:36.570Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "d12015b5-c157-4634-8ed5-d69965fc5267",
        "employeeCode": "TESTCHDA20260035",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis7@testorg.dayflow.com"
      }
    ]
  }
}
```

> **Note**: Returns history and pending review status of employee regularization requests.

---

### 9. Get Regularization Inbox (Admin)

- **Endpoint**: `GET /api/attendance/adjustments`
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
  "message": "Adjustment requests retrieved",
  "success": true,
  "error": null,
  "data": {
    "total": 3,
    "limit": 50,
    "offset": 0,
    "adjustments": [
      {
        "id": "a2e4d234-db14-4fad-9a6e-09319784420a",
        "attendanceRecordId": "74049a1f-5952-4209-a6b0-d2ff32bedbf2",
        "requestedBy": "332e80b0-4fa9-4e14-a574-f346719f296b",
        "approvedBy": null,
        "oldValue": {
          "status": "absent",
          "remarks": null,
          "lateMinutes": 0,
          "overtimeMinutes": 0,
          "totalWorkMinutes": 0,
          "earlyCheckoutMinutes": 0,
          "scheduledWorkMinutes": 480
        },
        "newValue": {
          "status": "absent",
          "remarks": null,
          "checkInAt": null,
          "checkOutAt": null,
          "totalWorkMinutes": 0
        },
        "reason": "Forgot to clock out on mobile device",
        "status": "pending",
        "createdAt": "2026-08-30T10:28:36.570Z",
        "updatedAt": "2026-08-30T10:28:36.570Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "d12015b5-c157-4634-8ed5-d69965fc5267",
        "employeeCode": "TESTCHDA20260035",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis7@testorg.dayflow.com"
      },
      {
        "id": "0c9eecec-a6c1-49b1-a664-086f40a95236",
        "attendanceRecordId": "1a937e05-02fc-4e5f-901e-28dd166588ed",
        "requestedBy": "92e03367-8f59-415d-99e4-51130d770092",
        "approvedBy": null,
        "oldValue": {
          "status": "absent",
          "remarks": null,
          "lateMinutes": 0,
          "overtimeMinutes": 0,
          "totalWorkMinutes": 0,
          "earlyCheckoutMinutes": 0,
          "scheduledWorkMinutes": 480
        },
        "newValue": {
          "status": "absent",
          "remarks": null,
          "checkInAt": null,
          "checkOutAt": null,
          "totalWorkMinutes": 0
        },
        "reason": "Forgot to clock out on mobile device",
        "status": "pending",
        "createdAt": "2026-08-30T10:11:14.801Z",
        "updatedAt": "2026-08-30T10:11:14.801Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "4d0de561-5947-413c-aa8b-f968e2c106b9",
        "employeeCode": "TESTCHDA20260026",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis6@testorg.dayflow.com"
      },
      {
        "id": "6860bb13-dd37-42eb-8e49-97f607168d9a",
        "attendanceRecordId": "412413b0-ebc5-49f2-a65d-a1cb2e7e8cac",
        "requestedBy": "d0eb99b4-0e69-4370-9855-7f373bb4346c",
        "approvedBy": null,
        "oldValue": {
          "status": "present",
          "remarks": null,
          "lateMinutes": 0,
          "overtimeMinutes": 0,
          "totalWorkMinutes": 0,
          "earlyCheckoutMinutes": 0,
          "scheduledWorkMinutes": 480
        },
        "newValue": {
          "status": "present",
          "remarks": null,
          "checkInAt": null,
          "checkOutAt": null,
          "totalWorkMinutes": 0
        },
        "reason": "Forgot to clock out on mobile device",
        "status": "pending",
        "createdAt": "2026-08-30T10:10:29.713Z",
        "updatedAt": "2026-08-30T10:10:29.713Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "7e7afab5-08de-4476-a6f4-cd450c0064a0",
        "employeeCode": "TESTCHDA20260025",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis5@testorg.dayflow.com"
      }
    ]
  }
}
```

> **Note**: Lists organization-wide pending attendance regularization tickets.

---

### 10. Get Company Attendance Summary (Admin)

- **Endpoint**: `GET /api/attendance/summary`
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
  "message": "Company attendance summary retrieved",
  "success": true,
  "error": null,
  "data": {
    "date": "2026-08-30",
    "totalActiveEmployees": 34,
    "recordedEmployees": 3,
    "present": 2,
    "halfDay": 0,
    "absent": 32,
    "leave": 0,
    "holiday": 0,
    "weeklyOff": 0,
    "incomplete": 0,
    "lateCount": 0,
    "attendancePercentage": 5.9
  }
}
```

> **Note**: Executive snapshot of today attendance across all departments.

---

### 11. Get Specific Employee Attendance (Admin)

- **Endpoint**: `GET /api/attendance/employee/d12015b5-c157-4634-8ed5-d69965fc5267`
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
  "message": "Attendance records for Charlie Davis retrieved",
  "success": true,
  "error": null,
  "data": {
    "employee": {
      "id": "d12015b5-c157-4634-8ed5-d69965fc5267",
      "employeeCode": "TESTCHDA20260035",
      "displayName": "Charlie Davis",
      "workEmail": "charlie.davis7@testorg.dayflow.com"
    },
    "summary": {
      "totalRecords": 1,
      "presentDays": 0,
      "halfDays": 0,
      "absentDays": 1,
      "leaveDays": 0,
      "holidayDays": 0,
      "weeklyOffDays": 0,
      "incompleteDays": 0,
      "totalWorkMinutes": 0,
      "totalOvertimeMinutes": 0,
      "totalLateMinutes": 0,
      "lateDaysCount": 0,
      "totalWorkHours": 0,
      "totalOvertimeHours": 0
    },
    "total": 1,
    "limit": 50,
    "offset": 0,
    "records": [
      {
        "id": "74049a1f-5952-4209-a6b0-d2ff32bedbf2",
        "employeeId": "d12015b5-c157-4634-8ed5-d69965fc5267",
        "attendanceDate": "2026-08-30",
        "status": "absent",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "system",
        "createdAt": "2026-08-30T10:28:28.340Z",
        "updatedAt": "2026-08-30T10:28:32.050Z",
        "employeeCode": "TESTCHDA20260035",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis7@testorg.dayflow.com",
        "departmentId": null,
        "departmentName": null
      }
    ]
  }
}
```

> **Note**: Allows HR/Admin to inspect timesheet records for any target employee.

---

### 12. List All Attendance Records (Admin)

- **Endpoint**: `GET /api/attendance`
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
  "message": "Attendance records retrieved",
  "success": true,
  "error": null,
  "data": {
    "total": 3,
    "limit": 50,
    "offset": 0,
    "records": [
      {
        "id": "412413b0-ebc5-49f2-a65d-a1cb2e7e8cac",
        "employeeId": "7e7afab5-08de-4476-a6f4-cd450c0064a0",
        "attendanceDate": "2026-08-30",
        "status": "present",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "manual",
        "createdAt": "2026-08-30T10:10:20.753Z",
        "updatedAt": "2026-08-30T10:10:38.173Z",
        "employeeCode": "TESTCHDA20260025",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis5@testorg.dayflow.com",
        "departmentId": null,
        "departmentName": null
      },
      {
        "id": "1a937e05-02fc-4e5f-901e-28dd166588ed",
        "employeeId": "4d0de561-5947-413c-aa8b-f968e2c106b9",
        "attendanceDate": "2026-08-30",
        "status": "present",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "manual",
        "createdAt": "2026-08-30T10:11:06.492Z",
        "updatedAt": "2026-08-30T10:11:23.412Z",
        "employeeCode": "TESTCHDA20260026",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis6@testorg.dayflow.com",
        "departmentId": null,
        "departmentName": null
      },
      {
        "id": "74049a1f-5952-4209-a6b0-d2ff32bedbf2",
        "employeeId": "d12015b5-c157-4634-8ed5-d69965fc5267",
        "attendanceDate": "2026-08-30",
        "status": "absent",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "system",
        "createdAt": "2026-08-30T10:28:28.340Z",
        "updatedAt": "2026-08-30T10:28:32.050Z",
        "employeeCode": "TESTCHDA20260035",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis7@testorg.dayflow.com",
        "departmentId": null,
        "departmentName": null
      }
    ]
  }
}
```

> **Note**: Filtered directory of attendance records with department and status filters.

---

### 13. Get Attendance Record by ID (Success)

- **Endpoint**: `GET /api/attendance/74049a1f-5952-4209-a6b0-d2ff32bedbf2`
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
  "message": "Attendance record retrieved",
  "success": true,
  "error": null,
  "data": {
    "id": "74049a1f-5952-4209-a6b0-d2ff32bedbf2",
    "employeeId": "d12015b5-c157-4634-8ed5-d69965fc5267",
    "attendanceDate": "2026-08-30",
    "status": "absent",
    "totalWorkMinutes": 0,
    "scheduledWorkMinutes": 480,
    "overtimeMinutes": 0,
    "lateMinutes": 0,
    "earlyCheckoutMinutes": 0,
    "remarks": null,
    "source": "system",
    "createdAt": "2026-08-30T10:28:28.340Z",
    "updatedAt": "2026-08-30T10:28:32.050Z",
    "employeeCode": "TESTCHDA20260035",
    "firstName": "Charlie",
    "lastName": "Davis",
    "displayName": "Charlie Davis",
    "workEmail": "charlie.davis7@testorg.dayflow.com",
    "departmentId": null,
    "departmentName": null,
    "sessions": [
      {
        "id": "56dbb787-b524-4f67-a7c1-05ad0f4896c3",
        "attendanceRecordId": "74049a1f-5952-4209-a6b0-d2ff32bedbf2",
        "checkInAt": "2026-08-30T10:28:27.785Z",
        "checkOutAt": "2026-08-30T10:28:30.894Z",
        "workedMinutes": 0,
        "breakMinutes": 0,
        "createdAt": "2026-08-30T10:28:28.690Z"
      }
    ],
    "adjustments": [
      {
        "id": "a2e4d234-db14-4fad-9a6e-09319784420a",
        "attendanceRecordId": "74049a1f-5952-4209-a6b0-d2ff32bedbf2",
        "requestedBy": "332e80b0-4fa9-4e14-a574-f346719f296b",
        "approvedBy": null,
        "oldValue": {
          "status": "absent",
          "remarks": null,
          "lateMinutes": 0,
          "overtimeMinutes": 0,
          "totalWorkMinutes": 0,
          "earlyCheckoutMinutes": 0,
          "scheduledWorkMinutes": 480
        },
        "newValue": {
          "status": "absent",
          "remarks": null,
          "checkInAt": null,
          "checkOutAt": null,
          "totalWorkMinutes": 0
        },
        "reason": "Forgot to clock out on mobile device",
        "status": "pending",
        "createdAt": "2026-08-30T10:28:36.570Z",
        "updatedAt": "2026-08-30T10:28:36.570Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "d12015b5-c157-4634-8ed5-d69965fc5267",
        "employeeCode": "TESTCHDA20260035",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis7@testorg.dayflow.com"
      }
    ]
  }
}
```

> **Note**: Retrieves itemized sessions, breaks, and computed work hours.

---

### 14. Manual Attendance Record Correction (Admin)

- **Endpoint**: `PATCH /api/attendance/74049a1f-5952-4209-a6b0-d2ff32bedbf2`
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
  "status": "present",
  "workHours": 8.5
}
```

- **Response Body**:

```json
{
  "message": "Attendance record updated successfully",
  "success": true,
  "error": null,
  "data": {
    "id": "74049a1f-5952-4209-a6b0-d2ff32bedbf2",
    "employeeId": "d12015b5-c157-4634-8ed5-d69965fc5267",
    "attendanceDate": "2026-08-30",
    "status": "present",
    "totalWorkMinutes": 0,
    "scheduledWorkMinutes": 480,
    "overtimeMinutes": 0,
    "lateMinutes": 0,
    "earlyCheckoutMinutes": 0,
    "remarks": null,
    "source": "manual",
    "createdAt": "2026-08-30T10:28:28.340Z",
    "updatedAt": "2026-08-30T10:28:45.200Z"
  }
}
```

> **Note**: Allows HR/Admin to perform direct adjustments on timesheet logs.

---

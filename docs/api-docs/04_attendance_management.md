# Feature 04: Attendance Management API

> Covers punch-in, punch-out, overtime tracking, status computation, admin overview, and regularization requests.

## 📋 Endpoints Overview

| Method | Endpoint                     | Scenario                                  | Status |
| :----- | :--------------------------- | :---------------------------------------- | :----- |
| `POST` | `/api/attendance/check-in`   | Employee Check-In (Success)               | `500`  |
| `POST` | `/api/attendance/check-in`   | Duplicate Check-In (Rejected)             | `500`  |
| `POST` | `/api/attendance/check-out`  | Employee Check-Out (Success)              | `400`  |
| `GET`  | `/api/attendance/me`         | Get My Attendance Records (Success)       | `200`  |
| `GET`  | `/api/attendance/me/summary` | Get Attendance Summary Counters (Success) | `200`  |
| `GET`  | `/api/attendance/summary`    | Get Company Attendance Summary (Admin)    | `200`  |

---

## 🔍 Detailed Scenarios & Outputs

### 1. Employee Check-In (Success)

- **Endpoint**: `POST /api/attendance/check-in`
- **Expected Status**: `500`
- **Headers**:

```json
{
  "Cookie": "token=JWT_EMPLOYEE_TOKEN"
}
```

- **Response Body**:

```json
{
  "message": "Cannot read properties of undefined (reading 'remarks')",
  "success": false,
  "error": "TypeError: Cannot read properties of undefined (reading 'remarks')\n    at checkIn (C:\\Users\\Aman\\Desktop\\HRMS\\server\\src\\modules\\attendance\\controllers\\attendance.controller.js:62:35)\n    at processTicksAndRejections (node:internal/process/task_queues:105:5)"
}
```

> **Note**: Records daily punch-in with schedule lookup and late arrival calculation.

---

### 2. Duplicate Check-In (Rejected)

- **Endpoint**: `POST /api/attendance/check-in`
- **Expected Status**: `500`
- **Headers**:

```json
{
  "Cookie": "token=JWT_EMPLOYEE_TOKEN"
}
```

- **Response Body**:

```json
{
  "message": "Cannot read properties of undefined (reading 'remarks')",
  "success": false,
  "error": "TypeError: Cannot read properties of undefined (reading 'remarks')\n    at checkIn (C:\\Users\\Aman\\Desktop\\HRMS\\server\\src\\modules\\attendance\\controllers\\attendance.controller.js:62:35)\n    at processTicksAndRejections (node:internal/process/task_queues:105:5)"
}
```

> **Note**: Prevents double punch-in when an active session is already running.

---

### 3. Employee Check-Out (Success)

- **Endpoint**: `POST /api/attendance/check-out`
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
  "message": "No attendance record found for today. Please check in first.",
  "success": false,
  "error": null
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
    "total": 0,
    "limit": 50,
    "offset": 0,
    "records": []
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
    "totalRecords": 0,
    "presentDays": 0,
    "halfDays": 0,
    "absentDays": 0,
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

### 6. Get Company Attendance Summary (Admin)

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
    "date": "2026-08-29",
    "totalActiveEmployees": 25,
    "recordedEmployees": 0,
    "present": 0,
    "halfDay": 0,
    "absent": 25,
    "leave": 0,
    "holiday": 0,
    "weeklyOff": 0,
    "incomplete": 0,
    "lateCount": 0,
    "attendancePercentage": 0
  }
}
```

> **Note**: Executive snapshot of today attendance across all departments.

---

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
| `POST`  | `/api/attendance/ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1/adjust`   | Request Attendance Regularization (Success) | `201`  |
| `GET`   | `/api/attendance/adjustments/me`                                | Get My Regularization Requests (Success)    | `200`  |
| `GET`   | `/api/attendance/adjustments`                                   | Get Regularization Inbox (Admin)            | `200`  |
| `GET`   | `/api/attendance/summary`                                       | Get Company Attendance Summary (Admin)      | `200`  |
| `GET`   | `/api/attendance/employee/38a90a3b-0ba9-4527-86cd-1f11d6db1768` | Get Specific Employee Attendance (Admin)    | `200`  |
| `GET`   | `/api/attendance`                                               | List All Attendance Records (Admin)         | `200`  |
| `GET`   | `/api/attendance/ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1`          | Get Attendance Record by ID (Success)       | `200`  |
| `PATCH` | `/api/attendance/ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1`          | Manual Attendance Record Correction (Admin) | `200`  |

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
      "id": "ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1",
      "employeeId": "38a90a3b-0ba9-4527-86cd-1f11d6db1768",
      "attendanceDate": "2026-08-30",
      "status": "present",
      "totalWorkMinutes": 0,
      "scheduledWorkMinutes": 480,
      "overtimeMinutes": 0,
      "lateMinutes": 0,
      "earlyCheckoutMinutes": 0,
      "remarks": null,
      "source": "system",
      "createdAt": "2026-08-30T17:20:06.339Z",
      "updatedAt": "2026-08-30T17:20:06.339Z"
    },
    "session": {
      "id": "b7f135a3-2615-4e1c-a598-38cca67673ce",
      "attendanceRecordId": "ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1",
      "checkInAt": "2026-08-30T17:20:05.298Z",
      "checkOutAt": null,
      "workedMinutes": null,
      "breakMinutes": 0,
      "createdAt": "2026-08-30T17:20:06.862Z"
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
      "id": "b7f135a3-2615-4e1c-a598-38cca67673ce",
      "attendanceRecordId": "ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1",
      "checkInAt": "2026-08-30T17:20:05.298Z",
      "checkOutAt": null,
      "workedMinutes": null,
      "breakMinutes": 0,
      "createdAt": "2026-08-30T17:20:06.862Z"
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
      "id": "ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1",
      "employeeId": "38a90a3b-0ba9-4527-86cd-1f11d6db1768",
      "attendanceDate": "2026-08-30",
      "status": "absent",
      "totalWorkMinutes": 0,
      "scheduledWorkMinutes": 480,
      "overtimeMinutes": 0,
      "lateMinutes": 0,
      "earlyCheckoutMinutes": 0,
      "remarks": null,
      "source": "system",
      "createdAt": "2026-08-30T17:20:06.339Z",
      "updatedAt": "2026-08-30T17:20:19.462Z"
    },
    "session": {
      "id": "b7f135a3-2615-4e1c-a598-38cca67673ce",
      "attendanceRecordId": "ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1",
      "checkInAt": "2026-08-30T17:20:05.298Z",
      "checkOutAt": "2026-08-30T17:20:12.830Z",
      "workedMinutes": 0,
      "breakMinutes": 0,
      "createdAt": "2026-08-30T17:20:06.862Z"
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
        "id": "ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1",
        "employeeId": "38a90a3b-0ba9-4527-86cd-1f11d6db1768",
        "attendanceDate": "2026-08-30",
        "status": "absent",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "system",
        "createdAt": "2026-08-30T17:20:06.339Z",
        "updatedAt": "2026-08-30T17:20:19.462Z",
        "employeeCode": "TESTCHDA20260116",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis18@testorg.dayflow.com",
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

- **Endpoint**: `POST /api/attendance/ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1/adjust`
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
    "id": "b5d55090-dd97-49f2-929a-56c2217bb642",
    "attendanceRecordId": "ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1",
    "requestedBy": "bef0158f-63ed-4f45-ad63-8a55e294c170",
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
    "createdAt": "2026-08-30T17:20:34.334Z",
    "updatedAt": "2026-08-30T17:20:34.334Z"
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
        "id": "b5d55090-dd97-49f2-929a-56c2217bb642",
        "attendanceRecordId": "ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1",
        "requestedBy": "bef0158f-63ed-4f45-ad63-8a55e294c170",
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
        "createdAt": "2026-08-30T17:20:34.334Z",
        "updatedAt": "2026-08-30T17:20:34.334Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "38a90a3b-0ba9-4527-86cd-1f11d6db1768",
        "employeeCode": "TESTCHDA20260116",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis18@testorg.dayflow.com"
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
    "total": 14,
    "limit": 50,
    "offset": 0,
    "adjustments": [
      {
        "id": "b5d55090-dd97-49f2-929a-56c2217bb642",
        "attendanceRecordId": "ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1",
        "requestedBy": "bef0158f-63ed-4f45-ad63-8a55e294c170",
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
        "createdAt": "2026-08-30T17:20:34.334Z",
        "updatedAt": "2026-08-30T17:20:34.334Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "38a90a3b-0ba9-4527-86cd-1f11d6db1768",
        "employeeCode": "TESTCHDA20260116",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis18@testorg.dayflow.com"
      },
      {
        "id": "e318a59a-523d-4c3a-873f-42116e3ca2c1",
        "attendanceRecordId": "b11c0e51-7f92-4e8d-9c5f-283e04a70cf5",
        "requestedBy": "dc0046ff-3d94-4dd7-98b2-453976c3d6cd",
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
        "createdAt": "2026-08-30T16:31:42.273Z",
        "updatedAt": "2026-08-30T16:31:42.273Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "0ed64fc4-b48f-4052-9b50-5cbd6327dea7",
        "employeeCode": "TESTCHDA20260104",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis17@testorg.dayflow.com"
      },
      {
        "id": "ec9e8016-e782-41f7-8fe3-16d0a4eedf9c",
        "attendanceRecordId": "0f84ac80-050c-4f62-84f9-65e6989baf57",
        "requestedBy": "78bd4359-2006-4f1f-89e8-a063bb3db750",
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
        "createdAt": "2026-08-30T16:17:30.087Z",
        "updatedAt": "2026-08-30T16:17:30.087Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "c94b6647-0317-4144-af10-68237486e395",
        "employeeCode": "TESTCHDA20260097",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis16@testorg.dayflow.com"
      },
      {
        "id": "a2811d45-272c-4219-9767-3a96d3d1d7b4",
        "attendanceRecordId": "ab49c009-deee-4608-b916-066b312b4ed0",
        "requestedBy": "f8a3acef-1dfa-437d-ac28-ed6c2db84894",
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
        "createdAt": "2026-08-30T16:03:11.351Z",
        "updatedAt": "2026-08-30T16:03:11.351Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "a509140b-6762-4c6e-9589-c9db7a006d6a",
        "employeeCode": "TESTCHDA20260090",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis15@testorg.dayflow.com"
      },
      {
        "id": "67ed4004-4e56-4f9b-879e-1513a38e2957",
        "attendanceRecordId": "685af0c0-be15-4d3d-ae06-8127634d79e9",
        "requestedBy": "a90c6712-a74d-4e01-80a7-4f85acd399d9",
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
        "createdAt": "2026-08-30T15:49:13.287Z",
        "updatedAt": "2026-08-30T15:49:13.287Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "d846b7aa-e3aa-4101-ab7f-e8f44a7d3d41",
        "employeeCode": "TESTCHDA20260083",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis14@testorg.dayflow.com"
      },
      {
        "id": "1fe58900-818b-4dff-8258-7828c82ff246",
        "attendanceRecordId": "750f622e-9d13-4ad1-9fcf-ee6f46dd778c",
        "requestedBy": "3e0ada78-bc98-407c-9e30-c7739b83f42b",
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
        "createdAt": "2026-08-30T15:38:34.672Z",
        "updatedAt": "2026-08-30T15:38:34.672Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "d5235df9-f48a-401b-9fd4-d8a4f5b7cecb",
        "employeeCode": "TESTCHDA20260076",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis13@testorg.dayflow.com"
      },
      {
        "id": "8f5b446c-bc72-4dcd-b49a-8d3dc105f22d",
        "attendanceRecordId": "a81c4318-3e08-43de-8509-5414b336d032",
        "requestedBy": "25d77199-494c-4e72-bd12-e018df4efb21",
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
        "createdAt": "2026-08-30T15:27:58.676Z",
        "updatedAt": "2026-08-30T15:27:58.676Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "139a0d0c-a435-4b88-b30e-033f3670668d",
        "employeeCode": "TESTCHDA20260069",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis12@testorg.dayflow.com"
      },
      {
        "id": "b4dac374-93d9-4daf-8a9e-6060dbda6028",
        "attendanceRecordId": "47faccaa-9313-486e-a324-160a762e18be",
        "requestedBy": "49d033ef-6932-4735-bafd-aa1d4cd6853e",
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
        "createdAt": "2026-08-30T15:12:27.804Z",
        "updatedAt": "2026-08-30T15:12:27.804Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "8f0c2776-7a56-4969-bc8d-b520872c59b0",
        "employeeCode": "TESTCHDA20260062",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis11@testorg.dayflow.com"
      },
      {
        "id": "1be0d6b1-7d78-407b-9c98-c53a04cf83e2",
        "attendanceRecordId": "64b6f356-eba3-449e-8458-ea81419f3656",
        "requestedBy": "2a478757-3164-4825-a4da-8d0611c0dc52",
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
        "createdAt": "2026-08-30T15:01:34.068Z",
        "updatedAt": "2026-08-30T15:01:34.068Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "6c831ac1-f189-441e-9e0d-539ea38f599f",
        "employeeCode": "TESTCHDA20260055",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis10@testorg.dayflow.com"
      },
      {
        "id": "15edeaa9-a3ea-403b-b8ae-0f39efbee40f",
        "attendanceRecordId": "1fe1db16-624e-486f-a73b-66d3be84cc05",
        "requestedBy": "fba8301a-c21a-41ae-a9d8-7ae74dbfd749",
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
        "createdAt": "2026-08-30T14:58:48.320Z",
        "updatedAt": "2026-08-30T14:58:48.320Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "4a6119fb-8cab-428c-8ad3-b5aa9a2cb01b",
        "employeeCode": "TESTCHDA20260049",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis9@testorg.dayflow.com"
      },
      {
        "id": "e1883541-9d7d-4223-95e5-923435d90d77",
        "attendanceRecordId": "73a37b77-57ab-4605-9d84-e2311e81ad78",
        "requestedBy": "362c47c1-d11e-4601-a255-f928edacf7f2",
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
        "createdAt": "2026-08-30T14:13:27.467Z",
        "updatedAt": "2026-08-30T14:13:27.467Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "78f90147-bccc-4e03-9094-8440397048fa",
        "employeeCode": "TESTCHDA20260042",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis8@testorg.dayflow.com"
      },
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
    "totalActiveEmployees": 105,
    "recordedEmployees": 14,
    "present": 13,
    "halfDay": 0,
    "absent": 92,
    "leave": 0,
    "holiday": 0,
    "weeklyOff": 0,
    "incomplete": 0,
    "lateCount": 0,
    "attendancePercentage": 12.4
  }
}
```

> **Note**: Executive snapshot of today attendance across all departments.

---

### 11. Get Specific Employee Attendance (Admin)

- **Endpoint**: `GET /api/attendance/employee/38a90a3b-0ba9-4527-86cd-1f11d6db1768`
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
      "id": "38a90a3b-0ba9-4527-86cd-1f11d6db1768",
      "employeeCode": "TESTCHDA20260116",
      "displayName": "Charlie Davis",
      "workEmail": "charlie.davis18@testorg.dayflow.com"
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
        "id": "ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1",
        "employeeId": "38a90a3b-0ba9-4527-86cd-1f11d6db1768",
        "attendanceDate": "2026-08-30",
        "status": "absent",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "system",
        "createdAt": "2026-08-30T17:20:06.339Z",
        "updatedAt": "2026-08-30T17:20:19.462Z",
        "employeeCode": "TESTCHDA20260116",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis18@testorg.dayflow.com",
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
    "total": 14,
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
        "status": "present",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "manual",
        "createdAt": "2026-08-30T10:28:28.340Z",
        "updatedAt": "2026-08-30T10:28:45.200Z",
        "employeeCode": "TESTCHDA20260035",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis7@testorg.dayflow.com",
        "departmentId": null,
        "departmentName": null
      },
      {
        "id": "73a37b77-57ab-4605-9d84-e2311e81ad78",
        "employeeId": "78f90147-bccc-4e03-9094-8440397048fa",
        "attendanceDate": "2026-08-30",
        "status": "present",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "manual",
        "createdAt": "2026-08-30T14:13:15.011Z",
        "updatedAt": "2026-08-30T14:13:41.224Z",
        "employeeCode": "TESTCHDA20260042",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis8@testorg.dayflow.com",
        "departmentId": null,
        "departmentName": null
      },
      {
        "id": "1fe1db16-624e-486f-a73b-66d3be84cc05",
        "employeeId": "4a6119fb-8cab-428c-8ad3-b5aa9a2cb01b",
        "attendanceDate": "2026-08-30",
        "status": "present",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "manual",
        "createdAt": "2026-08-30T14:58:39.233Z",
        "updatedAt": "2026-08-30T14:59:00.141Z",
        "employeeCode": "TESTCHDA20260049",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis9@testorg.dayflow.com",
        "departmentId": null,
        "departmentName": null
      },
      {
        "id": "64b6f356-eba3-449e-8458-ea81419f3656",
        "employeeId": "6c831ac1-f189-441e-9e0d-539ea38f599f",
        "attendanceDate": "2026-08-30",
        "status": "present",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "manual",
        "createdAt": "2026-08-30T15:01:24.389Z",
        "updatedAt": "2026-08-30T15:01:45.085Z",
        "employeeCode": "TESTCHDA20260055",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis10@testorg.dayflow.com",
        "departmentId": null,
        "departmentName": null
      },
      {
        "id": "47faccaa-9313-486e-a324-160a762e18be",
        "employeeId": "8f0c2776-7a56-4969-bc8d-b520872c59b0",
        "attendanceDate": "2026-08-30",
        "status": "present",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "manual",
        "createdAt": "2026-08-30T15:11:53.705Z",
        "updatedAt": "2026-08-30T15:12:38.494Z",
        "employeeCode": "TESTCHDA20260062",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis11@testorg.dayflow.com",
        "departmentId": null,
        "departmentName": null
      },
      {
        "id": "a81c4318-3e08-43de-8509-5414b336d032",
        "employeeId": "139a0d0c-a435-4b88-b30e-033f3670668d",
        "attendanceDate": "2026-08-30",
        "status": "present",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "manual",
        "createdAt": "2026-08-30T15:27:50.772Z",
        "updatedAt": "2026-08-30T15:28:07.622Z",
        "employeeCode": "TESTCHDA20260069",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis12@testorg.dayflow.com",
        "departmentId": null,
        "departmentName": null
      },
      {
        "id": "750f622e-9d13-4ad1-9fcf-ee6f46dd778c",
        "employeeId": "d5235df9-f48a-401b-9fd4-d8a4f5b7cecb",
        "attendanceDate": "2026-08-30",
        "status": "present",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "manual",
        "createdAt": "2026-08-30T15:38:24.631Z",
        "updatedAt": "2026-08-30T15:38:42.876Z",
        "employeeCode": "TESTCHDA20260076",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis13@testorg.dayflow.com",
        "departmentId": null,
        "departmentName": null
      },
      {
        "id": "685af0c0-be15-4d3d-ae06-8127634d79e9",
        "employeeId": "d846b7aa-e3aa-4101-ab7f-e8f44a7d3d41",
        "attendanceDate": "2026-08-30",
        "status": "present",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "manual",
        "createdAt": "2026-08-30T15:49:01.951Z",
        "updatedAt": "2026-08-30T15:49:24.977Z",
        "employeeCode": "TESTCHDA20260083",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis14@testorg.dayflow.com",
        "departmentId": null,
        "departmentName": null
      },
      {
        "id": "ab49c009-deee-4608-b916-066b312b4ed0",
        "employeeId": "a509140b-6762-4c6e-9589-c9db7a006d6a",
        "attendanceDate": "2026-08-30",
        "status": "present",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "manual",
        "createdAt": "2026-08-30T16:02:43.441Z",
        "updatedAt": "2026-08-30T16:03:21.326Z",
        "employeeCode": "TESTCHDA20260090",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis15@testorg.dayflow.com",
        "departmentId": null,
        "departmentName": null
      },
      {
        "id": "0f84ac80-050c-4f62-84f9-65e6989baf57",
        "employeeId": "c94b6647-0317-4144-af10-68237486e395",
        "attendanceDate": "2026-08-30",
        "status": "present",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "manual",
        "createdAt": "2026-08-30T16:17:18.223Z",
        "updatedAt": "2026-08-30T16:17:41.647Z",
        "employeeCode": "TESTCHDA20260097",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis16@testorg.dayflow.com",
        "departmentId": null,
        "departmentName": null
      },
      {
        "id": "b11c0e51-7f92-4e8d-9c5f-283e04a70cf5",
        "employeeId": "0ed64fc4-b48f-4052-9b50-5cbd6327dea7",
        "attendanceDate": "2026-08-30",
        "status": "present",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "manual",
        "createdAt": "2026-08-30T16:31:34.269Z",
        "updatedAt": "2026-08-30T16:31:50.439Z",
        "employeeCode": "TESTCHDA20260104",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis17@testorg.dayflow.com",
        "departmentId": null,
        "departmentName": null
      },
      {
        "id": "ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1",
        "employeeId": "38a90a3b-0ba9-4527-86cd-1f11d6db1768",
        "attendanceDate": "2026-08-30",
        "status": "absent",
        "totalWorkMinutes": 0,
        "scheduledWorkMinutes": 480,
        "overtimeMinutes": 0,
        "lateMinutes": 0,
        "earlyCheckoutMinutes": 0,
        "remarks": null,
        "source": "system",
        "createdAt": "2026-08-30T17:20:06.339Z",
        "updatedAt": "2026-08-30T17:20:19.462Z",
        "employeeCode": "TESTCHDA20260116",
        "firstName": "Charlie",
        "lastName": "Davis",
        "displayName": "Charlie Davis",
        "workEmail": "charlie.davis18@testorg.dayflow.com",
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

- **Endpoint**: `GET /api/attendance/ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1`
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
    "id": "ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1",
    "employeeId": "38a90a3b-0ba9-4527-86cd-1f11d6db1768",
    "attendanceDate": "2026-08-30",
    "status": "absent",
    "totalWorkMinutes": 0,
    "scheduledWorkMinutes": 480,
    "overtimeMinutes": 0,
    "lateMinutes": 0,
    "earlyCheckoutMinutes": 0,
    "remarks": null,
    "source": "system",
    "createdAt": "2026-08-30T17:20:06.339Z",
    "updatedAt": "2026-08-30T17:20:19.462Z",
    "employeeCode": "TESTCHDA20260116",
    "firstName": "Charlie",
    "lastName": "Davis",
    "displayName": "Charlie Davis",
    "workEmail": "charlie.davis18@testorg.dayflow.com",
    "departmentId": null,
    "departmentName": null,
    "sessions": [
      {
        "id": "b7f135a3-2615-4e1c-a598-38cca67673ce",
        "attendanceRecordId": "ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1",
        "checkInAt": "2026-08-30T17:20:05.298Z",
        "checkOutAt": "2026-08-30T17:20:12.830Z",
        "workedMinutes": 0,
        "breakMinutes": 0,
        "createdAt": "2026-08-30T17:20:06.862Z"
      }
    ],
    "adjustments": [
      {
        "id": "b5d55090-dd97-49f2-929a-56c2217bb642",
        "attendanceRecordId": "ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1",
        "requestedBy": "bef0158f-63ed-4f45-ad63-8a55e294c170",
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
        "createdAt": "2026-08-30T17:20:34.334Z",
        "updatedAt": "2026-08-30T17:20:34.334Z",
        "attendanceDate": "2026-08-30",
        "employeeId": "38a90a3b-0ba9-4527-86cd-1f11d6db1768",
        "employeeCode": "TESTCHDA20260116",
        "employeeName": "Charlie Davis",
        "requesterEmail": "charlie.davis18@testorg.dayflow.com"
      }
    ]
  }
}
```

> **Note**: Retrieves itemized sessions, breaks, and computed work hours.

---

### 14. Manual Attendance Record Correction (Admin)

- **Endpoint**: `PATCH /api/attendance/ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1`
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
    "id": "ce6e6bcc-bcaf-4d71-9acd-f0787f2b58d1",
    "employeeId": "38a90a3b-0ba9-4527-86cd-1f11d6db1768",
    "attendanceDate": "2026-08-30",
    "status": "present",
    "totalWorkMinutes": 0,
    "scheduledWorkMinutes": 480,
    "overtimeMinutes": 0,
    "lateMinutes": 0,
    "earlyCheckoutMinutes": 0,
    "remarks": null,
    "source": "manual",
    "createdAt": "2026-08-30T17:20:06.339Z",
    "updatedAt": "2026-08-30T17:20:59.893Z"
  }
}
```

> **Note**: Allows HR/Admin to perform direct adjustments on timesheet logs.

---

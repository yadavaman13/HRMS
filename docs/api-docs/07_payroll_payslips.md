# Feature 07: Payroll & Payslip Management API

> Covers monthly payroll cycles, attendance-derived payable days computation, payslip generation, finalizing runs, and PDF downloads.

## 📋 Endpoints Overview

| Method | Endpoint                                                              | Scenario                                | Status |
| :----- | :-------------------------------------------------------------------- | :-------------------------------------- | :----- |
| `POST` | `/api/payroll/periods`                                                | Create Payroll Period (Admin)           | `201`  |
| `GET`  | `/api/payroll/periods`                                                | List Payroll Periods (Admin)            | `200`  |
| `POST` | `/api/payroll/periods/a5bda2b8-c373-497a-a7e8-aa89190e1588/process`   | Process Payroll Period (Admin)          | `200`  |
| `POST` | `/api/payroll/periods/a5bda2b8-c373-497a-a7e8-aa89190e1588/finalize`  | Finalize Payroll Period (Admin)         | `200`  |
| `GET`  | `/api/payroll/payslips`                                               | List Period Payslips (Admin)            | `200`  |
| `GET`  | `/api/payroll/payslips/cc3f4e24-02ab-44ea-a594-abebd88500c3`          | Get Payslip Breakdown Details (Success) | `200`  |
| `GET`  | `/api/payroll/payslips/cc3f4e24-02ab-44ea-a594-abebd88500c3/download` | Download PDF Payslip (Success)          | `200`  |

---

## 🔍 Detailed Scenarios & Outputs

### 1. Create Payroll Period (Admin)

- **Endpoint**: `POST /api/payroll/periods`
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
  "periodStart": "2050-01-01",
  "periodEnd": "2050-01-31"
}
```

- **Response Body**:

```json
{
  "message": "Payroll period created successfully",
  "success": true,
  "error": null,
  "data": {
    "period": {
      "id": "a5bda2b8-c373-497a-a7e8-aa89190e1588",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "periodStart": "2050-01-01",
      "periodEnd": "2050-01-31",
      "status": "draft",
      "processedAt": null,
      "finalizedAt": null,
      "createdBy": "a6747a74-d260-4619-b24a-9bce284efa27",
      "createdAt": "2026-08-30T10:29:56.015Z"
    }
  }
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
        "id": "a5bda2b8-c373-497a-a7e8-aa89190e1588",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "periodStart": "2050-01-01",
        "periodEnd": "2050-01-31",
        "status": "draft",
        "processedAt": null,
        "finalizedAt": null,
        "createdBy": "a6747a74-d260-4619-b24a-9bce284efa27",
        "createdAt": "2026-08-30T10:29:56.015Z"
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
      }
    ]
  }
}
```

> **Note**: Retrieves all historical and upcoming payroll cycles.

---

### 3. Process Payroll Period (Admin)

- **Endpoint**: `POST /api/payroll/periods/a5bda2b8-c373-497a-a7e8-aa89190e1588/process`
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
  "message": "Payroll period processed and payslips calculated successfully",
  "success": true,
  "error": null,
  "data": {
    "period": {
      "id": "a5bda2b8-c373-497a-a7e8-aa89190e1588",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "periodStart": "2050-01-01",
      "periodEnd": "2050-01-31",
      "status": "calculated",
      "processedAt": "2026-08-30T10:30:25.618Z",
      "finalizedAt": null,
      "createdBy": "a6747a74-d260-4619-b24a-9bce284efa27",
      "createdAt": "2026-08-30T10:29:56.015Z"
    }
  }
}
```

> **Note**: Executes payroll engine: aggregates attendance and leaves, computes payable days, applies unpaid deductions, and computes net pay.

---

### 4. Finalize Payroll Period (Admin)

- **Endpoint**: `POST /api/payroll/periods/a5bda2b8-c373-497a-a7e8-aa89190e1588/finalize`
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
  "message": "Payroll period finalized successfully",
  "success": true,
  "error": null,
  "data": {
    "period": {
      "id": "a5bda2b8-c373-497a-a7e8-aa89190e1588",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "periodStart": "2050-01-01",
      "periodEnd": "2050-01-31",
      "status": "finalized",
      "processedAt": "2026-08-30T10:30:25.618Z",
      "finalizedAt": "2026-08-30T10:30:27.044Z",
      "createdBy": "a6747a74-d260-4619-b24a-9bce284efa27",
      "createdAt": "2026-08-30T10:29:56.015Z"
    }
  }
}
```

> **Note**: Locks payroll run and transitions all payslips to finalized status.

---

### 5. List Period Payslips (Admin)

- **Endpoint**: `GET /api/payroll/payslips`
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
  "payrollPeriodId": "a5bda2b8-c373-497a-a7e8-aa89190e1588"
}
```

- **Response Body**:

```json
{
  "message": "Payslips retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "payslips": [
      {
        "id": "cc3f4e24-02ab-44ea-a594-abebd88500c3",
        "employeeId": "0f599301-09f6-4e35-ac83-f425b5f575df",
        "payrollPeriodId": "a5bda2b8-c373-497a-a7e8-aa89190e1588",
        "salaryStructureId": "05a1a39c-f4bb-4698-96e5-f3328723e9fc",
        "monthlyWage": "75000.00",
        "workingDays": "0.00",
        "payableDays": "31.00",
        "paidLeaveDays": "0.00",
        "unpaidLeaveDays": "0.00",
        "absentDays": "0.00",
        "halfDaysCount": "0.0",
        "grossEarnings": "37500.00",
        "totalEmployeeDeductions": "0.00",
        "employerContributions": "0.00",
        "unpaidDeduction": "0.00",
        "netPay": "37500.00",
        "status": "finalized",
        "generatedAt": "2026-08-30T10:30:14.980Z",
        "finalizedAt": "2026-08-30T10:30:27.226Z",
        "firstName": "Ethan",
        "lastName": "Hunt",
        "employeeCode": "TESTETHU20260029"
      },
      {
        "id": "f73a18a5-fda5-48c3-bbb8-c83a2d1caabf",
        "employeeId": "3244dc4d-14cd-4230-8c21-37834d663c49",
        "payrollPeriodId": "a5bda2b8-c373-497a-a7e8-aa89190e1588",
        "salaryStructureId": "9f76d672-f045-4ab9-96a3-3bddbdbdfb86",
        "monthlyWage": "75000.00",
        "workingDays": "0.00",
        "payableDays": "31.00",
        "paidLeaveDays": "0.00",
        "unpaidLeaveDays": "0.00",
        "absentDays": "0.00",
        "halfDaysCount": "0.0",
        "grossEarnings": "37500.00",
        "totalEmployeeDeductions": "0.00",
        "employerContributions": "0.00",
        "unpaidDeduction": "0.00",
        "netPay": "37500.00",
        "status": "finalized",
        "generatedAt": "2026-08-30T10:30:22.733Z",
        "finalizedAt": "2026-08-30T10:30:27.226Z",
        "firstName": "Ethan",
        "lastName": "Hunt",
        "employeeCode": "TESTETHU20260037"
      },
      {
        "id": "8b6d518b-5ba2-4a27-b757-71b0b4b3d04b",
        "employeeId": "c6601584-d852-475e-a6ec-98f6d7a6c185",
        "payrollPeriodId": "a5bda2b8-c373-497a-a7e8-aa89190e1588",
        "salaryStructureId": "39479f60-c33e-461b-9687-7aa4bd714772",
        "monthlyWage": "75000.00",
        "workingDays": "0.00",
        "payableDays": "31.00",
        "paidLeaveDays": "0.00",
        "unpaidLeaveDays": "0.00",
        "absentDays": "0.00",
        "halfDaysCount": "0.0",
        "grossEarnings": "37500.00",
        "totalEmployeeDeductions": "0.00",
        "employerContributions": "0.00",
        "unpaidDeduction": "0.00",
        "netPay": "37500.00",
        "status": "finalized",
        "generatedAt": "2026-08-30T10:30:17.344Z",
        "finalizedAt": "2026-08-30T10:30:27.226Z",
        "firstName": "Ethan",
        "lastName": "Hunt",
        "employeeCode": "TESTETHU20260030"
      },
      {
        "id": "c8414355-8cc2-487b-8907-8108a377021c",
        "employeeId": "e397e5e3-14ad-4779-9288-c8c520888fa1",
        "payrollPeriodId": "a5bda2b8-c373-497a-a7e8-aa89190e1588",
        "salaryStructureId": "6f31c5c2-5abd-4697-ad56-f13ff03e3824",
        "monthlyWage": "50000.00",
        "workingDays": "0.00",
        "payableDays": "31.00",
        "paidLeaveDays": "0.00",
        "unpaidLeaveDays": "0.00",
        "absentDays": "0.00",
        "halfDaysCount": "0.0",
        "grossEarnings": "0.00",
        "totalEmployeeDeductions": "0.00",
        "employerContributions": "0.00",
        "unpaidDeduction": "0.00",
        "netPay": "0.00",
        "status": "finalized",
        "generatedAt": "2026-08-30T10:30:12.508Z",
        "finalizedAt": "2026-08-30T10:30:27.226Z",
        "firstName": "Fiona",
        "lastName": "Gallagher",
        "employeeCode": "TESTFIGA20260022"
      },
      {
        "id": "20b1fb3a-4f58-4931-bf1b-bdec0ccadcb6",
        "employeeId": "186db7ff-e1a6-4d7f-98c2-681786911e2d",
        "payrollPeriodId": "a5bda2b8-c373-497a-a7e8-aa89190e1588",
        "salaryStructureId": "317e37ff-87cc-4ac4-be96-ba902ecf2b15",
        "monthlyWage": "50000.00",
        "workingDays": "0.00",
        "payableDays": "31.00",
        "paidLeaveDays": "0.00",
        "unpaidLeaveDays": "0.00",
        "absentDays": "0.00",
        "halfDaysCount": "0.0",
        "grossEarnings": "50000.00",
        "totalEmployeeDeductions": "0.00",
        "employerContributions": "0.00",
        "unpaidDeduction": "0.00",
        "netPay": "50000.00",
        "status": "finalized",
        "generatedAt": "2026-08-30T10:30:19.698Z",
        "finalizedAt": "2026-08-30T10:30:27.226Z",
        "firstName": "Fiona",
        "lastName": "Gallagher",
        "employeeCode": "TESTFIGA20260031"
      },
      {
        "id": "caf1ed29-67ee-484d-a84b-5917e8671249",
        "employeeId": "2ca04d4a-e086-4212-8928-e77088301563",
        "payrollPeriodId": "a5bda2b8-c373-497a-a7e8-aa89190e1588",
        "salaryStructureId": "fa1a4a76-8c92-4a07-997c-d1eae8d0340c",
        "monthlyWage": "50000.00",
        "workingDays": "0.00",
        "payableDays": "31.00",
        "paidLeaveDays": "0.00",
        "unpaidLeaveDays": "0.00",
        "absentDays": "0.00",
        "halfDaysCount": "0.0",
        "grossEarnings": "0.00",
        "totalEmployeeDeductions": "0.00",
        "employerContributions": "0.00",
        "unpaidDeduction": "0.00",
        "netPay": "0.00",
        "status": "finalized",
        "generatedAt": "2026-08-30T10:30:02.997Z",
        "finalizedAt": "2026-08-30T10:30:27.226Z",
        "firstName": "Fiona",
        "lastName": "Gallagher",
        "employeeCode": "TESTFIGA20260007"
      },
      {
        "id": "18f44ba3-6ad3-4a6c-bf2a-bbb0f2392157",
        "employeeId": "e33e4053-d082-4684-8285-6d8d982cec79",
        "payrollPeriodId": "a5bda2b8-c373-497a-a7e8-aa89190e1588",
        "salaryStructureId": "b8b74bac-f940-4db4-a001-fb29fae82581",
        "monthlyWage": "50000.00",
        "workingDays": "0.00",
        "payableDays": "31.00",
        "paidLeaveDays": "0.00",
        "unpaidLeaveDays": "0.00",
        "absentDays": "0.00",
        "halfDaysCount": "0.0",
        "grossEarnings": "50000.00",
        "totalEmployeeDeductions": "0.00",
        "employerContributions": "0.00",
        "unpaidDeduction": "0.00",
        "netPay": "50000.00",
        "status": "finalized",
        "generatedAt": "2026-08-30T10:30:24.994Z",
        "finalizedAt": "2026-08-30T10:30:27.226Z",
        "firstName": "Fiona",
        "lastName": "Gallagher",
        "employeeCode": "TESTFIGA20260038"
      },
      {
        "id": "60b84fc0-d1c2-4663-92a2-a3e0881f568b",
        "employeeId": "4a884438-766c-4b04-86a4-8596722bbbd0",
        "payrollPeriodId": "a5bda2b8-c373-497a-a7e8-aa89190e1588",
        "salaryStructureId": "c4825886-925d-467e-b17b-3d76ac921c72",
        "monthlyWage": "50000.00",
        "workingDays": "0.00",
        "payableDays": "31.00",
        "paidLeaveDays": "0.00",
        "unpaidLeaveDays": "0.00",
        "absentDays": "0.00",
        "halfDaysCount": "0.0",
        "grossEarnings": "0.00",
        "totalEmployeeDeductions": "0.00",
        "employerContributions": "0.00",
        "unpaidDeduction": "0.00",
        "netPay": "0.00",
        "status": "finalized",
        "generatedAt": "2026-08-30T10:30:06.522Z",
        "finalizedAt": "2026-08-30T10:30:27.226Z",
        "firstName": "Fiona",
        "lastName": "Gallagher",
        "employeeCode": "TESTFIGA20260014"
      },
      {
        "id": "a1c5b179-f768-4ffe-8561-6315262b2800",
        "employeeId": "9d960d8c-d22c-44a5-9932-605e2b21c435",
        "payrollPeriodId": "a5bda2b8-c373-497a-a7e8-aa89190e1588",
        "salaryStructureId": "b371d405-bffe-4ab4-922b-37f3263458c2",
        "monthlyWage": "50000.00",
        "workingDays": "0.00",
        "payableDays": "31.00",
        "paidLeaveDays": "0.00",
        "unpaidLeaveDays": "0.00",
        "absentDays": "0.00",
        "halfDaysCount": "0.0",
        "grossEarnings": "0.00",
        "totalEmployeeDeductions": "0.00",
        "employerContributions": "0.00",
        "unpaidDeduction": "0.00",
        "netPay": "0.00",
        "status": "finalized",
        "generatedAt": "2026-08-30T10:30:09.145Z",
        "finalizedAt": "2026-08-30T10:30:27.226Z",
        "firstName": "Fiona",
        "lastName": "Gallagher",
        "employeeCode": "TESTFIGA20260016"
      }
    ]
  }
}
```

> **Note**: Retrieves all generated payslips for the target payroll cycle.

---

### 6. Get Payslip Breakdown Details (Success)

- **Endpoint**: `GET /api/payroll/payslips/cc3f4e24-02ab-44ea-a594-abebd88500c3`
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
  "message": "Payslip details retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "payslip": {
      "id": "cc3f4e24-02ab-44ea-a594-abebd88500c3",
      "payrollPeriodId": "a5bda2b8-c373-497a-a7e8-aa89190e1588",
      "employeeId": "0f599301-09f6-4e35-ac83-f425b5f575df",
      "salaryStructureId": "05a1a39c-f4bb-4698-96e5-f3328723e9fc",
      "monthlyWage": "75000.00",
      "workingDays": "0.00",
      "payableDays": "31.00",
      "paidLeaveDays": "0.00",
      "unpaidLeaveDays": "0.00",
      "absentDays": "0.00",
      "halfDaysCount": "0.0",
      "grossEarnings": "37500.00",
      "totalEmployeeDeductions": "0.00",
      "employerContributions": "0.00",
      "unpaidDeduction": "0.00",
      "netPay": "37500.00",
      "status": "finalized",
      "generatedAt": "2026-08-30T10:30:14.980Z",
      "finalizedAt": "2026-08-30T10:30:27.226Z",
      "createdAt": "2026-08-30T10:29:57.805Z"
    },
    "lines": [
      {
        "id": "4e04f427-fbcf-4571-929f-acf6931b80c1",
        "payslipId": "cc3f4e24-02ab-44ea-a594-abebd88500c3",
        "componentCode": "BASIC",
        "componentName": "Basic Salary",
        "componentType": "earning",
        "calculationType": "percentage_of_wage",
        "baseAmount": "75000.00",
        "percentage": "50.000",
        "quantity": "1.00",
        "amount": "37500.00",
        "sequence": 1
      }
    ],
    "attendanceSummary": {
      "payslipId": "cc3f4e24-02ab-44ea-a594-abebd88500c3",
      "totalCalendarDays": 31,
      "scheduledDays": "0.00",
      "presentDays": "0.00",
      "paidLeaveDays": "0.00",
      "unpaidLeaveDays": "0.00",
      "absentDays": "0.00",
      "halfDays": "0.0",
      "holidayDays": "0.0",
      "weekendDays": "31.0",
      "payableDays": "31.00",
      "workingMinutes": 0,
      "overtimeMinutes": 0
    },
    "employee": {
      "firstName": "Ethan",
      "lastName": "Hunt",
      "employeeCode": "TESTETHU20260029"
    },
    "period": {
      "id": "a5bda2b8-c373-497a-a7e8-aa89190e1588",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "periodStart": "2050-01-01",
      "periodEnd": "2050-01-31",
      "status": "finalized",
      "processedAt": "2026-08-30T10:30:25.618Z",
      "finalizedAt": "2026-08-30T10:30:27.044Z",
      "createdBy": "a6747a74-d260-4619-b24a-9bce284efa27",
      "createdAt": "2026-08-30T10:29:56.015Z"
    }
  }
}
```

> **Note**: Returns itemized earnings and deductions lines, attendance days summary, and net payout.

---

### 7. Download PDF Payslip (Success)

- **Endpoint**: `GET /api/payroll/payslips/cc3f4e24-02ab-44ea-a594-abebd88500c3/download`
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
  "inline": "true"
}
```

- **Response Body**:

```json
{
  "contentType": "application/pdf",
  "status": "PDF Buffer Stream"
}
```

> **Note**: Generates static Chromium-free PDF document stream for printing or digital distribution.

---

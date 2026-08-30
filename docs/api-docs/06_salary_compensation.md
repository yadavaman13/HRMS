# Feature 06: Salary & Compensation Management API

> Covers salary component definitions, compensation structures, dynamic percentage calculations, statutory PF/PT settings, and admin-only access boundaries.

## 📋 Endpoints Overview

| Method   | Endpoint                                                       | Scenario                                       | Status |
| :------- | :------------------------------------------------------------- | :--------------------------------------------- | :----- |
| `GET`    | `/api/payroll/components`                                      | List Salary Component Definitions (Admin)      | `200`  |
| `POST`   | `/api/payroll/components`                                      | Create Salary Component (Admin)                | `201`  |
| `PATCH`  | `/api/payroll/components/40ea7ec7-8232-4b72-82aa-bce7f3a1cbe2` | Update Salary Component (Admin)                | `200`  |
| `DELETE` | `/api/payroll/components/40ea7ec7-8232-4b72-82aa-bce7f3a1cbe2` | Delete Salary Component (Admin)                | `200`  |
| `POST`   | `/api/employees/3244dc4d-14cd-4230-8c21-37834d663c49/salary`   | Set Employee Salary Structure (Admin)          | `201`  |
| `GET`    | `/api/employees/3244dc4d-14cd-4230-8c21-37834d663c49/salary`   | Get Employee Salary Structure (Admin)          | `200`  |
| `PATCH`  | `/api/employees/3244dc4d-14cd-4230-8c21-37834d663c49/salary`   | Update Employee Salary Structure (Admin)       | `200`  |
| `POST`   | `/api/employees/3244dc4d-14cd-4230-8c21-37834d663c49/salary`   | Modify Salary (Forbidden for Regular Employee) | `403`  |
| `GET`    | `/api/payroll/settings`                                        | Get Payroll Statutory Settings (Admin)         | `200`  |
| `POST`   | `/api/payroll/settings`                                        | Update Payroll Statutory Settings (Admin)      | `200`  |

---

## 🔍 Detailed Scenarios & Outputs

### 1. List Salary Component Definitions (Admin)

- **Endpoint**: `GET /api/payroll/components`
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
  "message": "Component definitions retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "components": [
      {
        "id": "e7f9bb74-85a6-4408-8a78-4711faf50af0",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "code": "BASIC",
        "name": "Basic Salary",
        "componentType": "earning",
        "calculationType": "percentage_of_wage",
        "calculationBase": null,
        "isActive": true,
        "createdAt": "2026-08-30T10:14:40.162Z",
        "updatedAt": "2026-08-30T10:14:40.162Z"
      }
    ]
  }
}
```

> **Note**: Retrieves salary component catalog (Basic, HRA, Allowances, PF, PT).

---

### 2. Create Salary Component (Admin)

- **Endpoint**: `POST /api/payroll/components`
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
  "code": "BONUS_1788085771162",
  "name": "Performance Bonus",
  "componentType": "earning",
  "calculationType": "percentage_of_wage"
}
```

- **Response Body**:

```json
{
  "message": "Component definition created successfully",
  "success": true,
  "error": null,
  "data": {
    "component": {
      "id": "40ea7ec7-8232-4b72-82aa-bce7f3a1cbe2",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "BONUS_1788085771162",
      "name": "Performance Bonus",
      "componentType": "earning",
      "calculationType": "percentage_of_wage",
      "calculationBase": null,
      "isActive": true,
      "createdAt": "2026-08-30T10:29:31.883Z",
      "updatedAt": "2026-08-30T10:29:31.883Z"
    }
  }
}
```

> **Note**: Registers new earning or deduction component.

---

### 3. Update Salary Component (Admin)

- **Endpoint**: `PATCH /api/payroll/components/40ea7ec7-8232-4b72-82aa-bce7f3a1cbe2`
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
  "name": "Annual Performance Bonus",
  "isTaxable": true
}
```

- **Response Body**:

```json
{
  "message": "Component definition updated successfully",
  "success": true,
  "error": null,
  "data": {
    "component": {
      "id": "40ea7ec7-8232-4b72-82aa-bce7f3a1cbe2",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "BONUS_1788085771162",
      "name": "Annual Performance Bonus",
      "componentType": "earning",
      "calculationType": "percentage_of_wage",
      "calculationBase": null,
      "isActive": true,
      "createdAt": "2026-08-30T10:29:31.883Z",
      "updatedAt": "2026-08-30T10:29:32.913Z"
    }
  }
}
```

> **Note**: Updates component naming, taxability flags, and calculation parameters.

---

### 4. Delete Salary Component (Admin)

- **Endpoint**: `DELETE /api/payroll/components/40ea7ec7-8232-4b72-82aa-bce7f3a1cbe2`
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
  "message": "Component definition deactivated successfully",
  "success": true,
  "error": null
}
```

> **Note**: Soft deletes unused component definition from catalog.

---

### 5. Set Employee Salary Structure (Admin)

- **Endpoint**: `POST /api/employees/3244dc4d-14cd-4230-8c21-37834d663c49/salary`
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
  "monthlyWage": 60000,
  "wageType": "fixed",
  "effectiveFrom": "2026-08-01",
  "components": [
    {
      "componentDefinitionId": "e7f9bb74-85a6-4408-8a78-4711faf50af0",
      "calculationType": "percentage_of_wage",
      "percentage": 50,
      "sequence": 1
    }
  ]
}
```

- **Response Body**:

```json
{
  "message": "Salary structure updated successfully",
  "success": true,
  "error": null,
  "data": {
    "structure": {
      "id": "18e53b18-395d-4238-a278-2203e1dd3393",
      "employeeId": "3244dc4d-14cd-4230-8c21-37834d663c49",
      "monthlyWage": "60000.00",
      "wageType": "fixed",
      "effectiveFrom": "2026-08-01",
      "effectiveTo": null,
      "status": "ACTIVE",
      "createdBy": "198fbfc9-4533-4810-8dc6-bedbb39d2b1f",
      "createdAt": "2026-08-30T10:29:35.078Z",
      "updatedAt": "2026-08-30T10:29:35.078Z",
      "components": [
        {
          "id": "b5a43937-792b-453c-afff-26d17c1692d7",
          "salaryStructureId": "18e53b18-395d-4238-a278-2203e1dd3393",
          "componentDefinitionId": "e7f9bb74-85a6-4408-8a78-4711faf50af0",
          "calculationType": "percentage_of_wage",
          "calculationBase": null,
          "percentage": "50.000",
          "fixedAmount": "0.00",
          "sequence": 1,
          "isResidual": false,
          "code": "BASIC",
          "name": "Basic Salary",
          "componentType": "earning"
        }
      ]
    }
  }
}
```

> **Note**: Configures wage breakdown and percentage component calculations.

---

### 6. Get Employee Salary Structure (Admin)

- **Endpoint**: `GET /api/employees/3244dc4d-14cd-4230-8c21-37834d663c49/salary`
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
  "message": "Salary structure retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "structure": {
      "id": "18e53b18-395d-4238-a278-2203e1dd3393",
      "employeeId": "3244dc4d-14cd-4230-8c21-37834d663c49",
      "monthlyWage": "60000.00",
      "wageType": "fixed",
      "effectiveFrom": "2026-08-01",
      "effectiveTo": null,
      "status": "ACTIVE",
      "createdBy": "198fbfc9-4533-4810-8dc6-bedbb39d2b1f",
      "createdAt": "2026-08-30T10:29:35.078Z",
      "updatedAt": "2026-08-30T10:29:35.078Z",
      "components": [
        {
          "id": "b5a43937-792b-453c-afff-26d17c1692d7",
          "salaryStructureId": "18e53b18-395d-4238-a278-2203e1dd3393",
          "componentDefinitionId": "e7f9bb74-85a6-4408-8a78-4711faf50af0",
          "calculationType": "percentage_of_wage",
          "calculationBase": null,
          "percentage": "50.000",
          "fixedAmount": "0.00",
          "sequence": 1,
          "isResidual": false,
          "code": "BASIC",
          "name": "Basic Salary",
          "componentType": "earning"
        }
      ]
    }
  }
}
```

> **Note**: Retrieves current active salary structure and itemized component formulas.

---

### 7. Update Employee Salary Structure (Admin)

- **Endpoint**: `PATCH /api/employees/3244dc4d-14cd-4230-8c21-37834d663c49/salary`
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
  "monthlyWage": 75000,
  "wageType": "fixed",
  "effectiveFrom": "2026-09-01",
  "components": [
    {
      "componentDefinitionId": "e7f9bb74-85a6-4408-8a78-4711faf50af0",
      "calculationType": "percentage_of_wage",
      "percentage": 50,
      "sequence": 1
    }
  ]
}
```

- **Response Body**:

```json
{
  "message": "Salary structure updated successfully",
  "success": true,
  "error": null,
  "data": {
    "structure": {
      "id": "9f76d672-f045-4ab9-96a3-3bddbdbdfb86",
      "employeeId": "3244dc4d-14cd-4230-8c21-37834d663c49",
      "monthlyWage": "75000.00",
      "wageType": "fixed",
      "effectiveFrom": "2026-09-01",
      "effectiveTo": null,
      "status": "ACTIVE",
      "createdBy": "198fbfc9-4533-4810-8dc6-bedbb39d2b1f",
      "createdAt": "2026-08-30T10:29:38.763Z",
      "updatedAt": "2026-08-30T10:29:38.763Z",
      "components": [
        {
          "id": "5d6f9b94-0151-4052-9bbe-c8292dfe118c",
          "salaryStructureId": "9f76d672-f045-4ab9-96a3-3bddbdbdfb86",
          "componentDefinitionId": "e7f9bb74-85a6-4408-8a78-4711faf50af0",
          "calculationType": "percentage_of_wage",
          "calculationBase": null,
          "percentage": "50.000",
          "fixedAmount": "0.00",
          "sequence": 1,
          "isResidual": false,
          "code": "BASIC",
          "name": "Basic Salary",
          "componentType": "earning"
        }
      ]
    }
  }
}
```

> **Note**: Updates compensation structure with revision date.

---

### 8. Modify Salary (Forbidden for Regular Employee)

- **Endpoint**: `POST /api/employees/3244dc4d-14cd-4230-8c21-37834d663c49/salary`
- **Expected Status**: `403`
- **Headers**:

```json
{
  "Cookie": "token=JWT_EMPLOYEE_TOKEN"
}
```

- **Response Body**:

```json
{
  "message": "You do not have permission to perform this action.",
  "success": false,
  "error": null
}
```

> **Note**: Enforces security preventing employees from modifying compensation data.

---

### 9. Get Payroll Statutory Settings (Admin)

- **Endpoint**: `GET /api/payroll/settings`
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
  "message": "Payroll settings retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "settings": {
      "id": "8babff0e-a372-4729-9c9e-c4ffd5fa07d6",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "payrollFrequency": "MONTHLY",
      "payrollCurrency": "INR",
      "payDay": 1,
      "workingDaysBasis": "22.00",
      "unpaidLeaveDeductionMethod": "PROPORTIONAL_GROSS",
      "pfEnabled": true,
      "employeePfRate": "12.00",
      "employerPfRate": "12.00",
      "professionalTaxEnabled": true,
      "professionalTaxAmount": "200.00",
      "createdAt": "2026-08-30T09:42:03.239Z",
      "updatedAt": "2026-08-30T10:15:55.352Z"
    }
  }
}
```

> **Note**: Retrieves Provident Fund (PF), Professional Tax (PT), and TDS withholding configurations.

---

### 10. Update Payroll Statutory Settings (Admin)

- **Endpoint**: `POST /api/payroll/settings`
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
  "pfEnabled": true,
  "pfEmployerRate": 12,
  "pfEmployeeRate": 12,
  "ptEnabled": true,
  "defaultPaymentDay": 28
}
```

- **Response Body**:

```json
{
  "message": "Payroll settings updated successfully",
  "success": true,
  "error": null,
  "data": {
    "settings": {
      "id": "8babff0e-a372-4729-9c9e-c4ffd5fa07d6",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "payrollFrequency": "MONTHLY",
      "payrollCurrency": "INR",
      "payDay": 1,
      "workingDaysBasis": "22.00",
      "unpaidLeaveDeductionMethod": "PROPORTIONAL_GROSS",
      "pfEnabled": true,
      "employeePfRate": "12.00",
      "employerPfRate": "12.00",
      "professionalTaxEnabled": true,
      "professionalTaxAmount": "200.00",
      "createdAt": "2026-08-30T09:42:03.239Z",
      "updatedAt": "2026-08-30T10:29:42.633Z"
    }
  }
}
```

> **Note**: Configures statutory deduction percentages and default disbursement schedules.

---

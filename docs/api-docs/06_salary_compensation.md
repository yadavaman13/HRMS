# Feature 06: Salary & Compensation Management API

> Covers salary component definitions, compensation structures, dynamic percentage calculations, statutory PF/PT settings, and admin-only access boundaries.

## 📋 Endpoints Overview

| Method   | Endpoint                                                       | Scenario                                       | Status |
| :------- | :------------------------------------------------------------- | :--------------------------------------------- | :----- |
| `GET`    | `/api/payroll/components`                                      | List Salary Component Definitions (Admin)      | `200`  |
| `POST`   | `/api/payroll/components`                                      | Create Salary Component (Admin)                | `201`  |
| `PATCH`  | `/api/payroll/components/ce3b4821-6124-4957-9b88-44a72a5c93c6` | Update Salary Component (Admin)                | `200`  |
| `DELETE` | `/api/payroll/components/ce3b4821-6124-4957-9b88-44a72a5c93c6` | Delete Salary Component (Admin)                | `200`  |
| `POST`   | `/api/employees/986b9ed2-a4e1-41f9-bc4b-682816e82b35/salary`   | Set Employee Salary Structure (Admin)          | `201`  |
| `GET`    | `/api/employees/986b9ed2-a4e1-41f9-bc4b-682816e82b35/salary`   | Get Employee Salary Structure (Admin)          | `200`  |
| `PATCH`  | `/api/employees/986b9ed2-a4e1-41f9-bc4b-682816e82b35/salary`   | Update Employee Salary Structure (Admin)       | `200`  |
| `POST`   | `/api/employees/986b9ed2-a4e1-41f9-bc4b-682816e82b35/salary`   | Modify Salary (Forbidden for Regular Employee) | `403`  |
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
  "code": "BONUS_1788110558453",
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
      "id": "ce3b4821-6124-4957-9b88-44a72a5c93c6",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "BONUS_1788110558453",
      "name": "Performance Bonus",
      "componentType": "earning",
      "calculationType": "percentage_of_wage",
      "calculationBase": null,
      "isActive": true,
      "createdAt": "2026-08-30T17:22:39.162Z",
      "updatedAt": "2026-08-30T17:22:39.162Z"
    }
  }
}
```

> **Note**: Registers new earning or deduction component.

---

### 3. Update Salary Component (Admin)

- **Endpoint**: `PATCH /api/payroll/components/ce3b4821-6124-4957-9b88-44a72a5c93c6`
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
      "id": "ce3b4821-6124-4957-9b88-44a72a5c93c6",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "code": "BONUS_1788110558453",
      "name": "Annual Performance Bonus",
      "componentType": "earning",
      "calculationType": "percentage_of_wage",
      "calculationBase": null,
      "isActive": true,
      "createdAt": "2026-08-30T17:22:39.162Z",
      "updatedAt": "2026-08-30T17:22:40.306Z"
    }
  }
}
```

> **Note**: Updates component naming, taxability flags, and calculation parameters.

---

### 4. Delete Salary Component (Admin)

- **Endpoint**: `DELETE /api/payroll/components/ce3b4821-6124-4957-9b88-44a72a5c93c6`
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

- **Endpoint**: `POST /api/employees/986b9ed2-a4e1-41f9-bc4b-682816e82b35/salary`
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
      "id": "60a64b42-d591-4065-b919-14662c512022",
      "employeeId": "986b9ed2-a4e1-41f9-bc4b-682816e82b35",
      "monthlyWage": "60000.00",
      "wageType": "fixed",
      "effectiveFrom": "2026-08-01",
      "effectiveTo": null,
      "status": "ACTIVE",
      "createdBy": "a6e914e7-67bc-440e-b257-9b3cc254d4f8",
      "createdAt": "2026-08-30T17:22:42.726Z",
      "updatedAt": "2026-08-30T17:22:42.726Z",
      "components": [
        {
          "id": "7cdedc84-fb17-4cda-b6b3-dbf60d980ee1",
          "salaryStructureId": "60a64b42-d591-4065-b919-14662c512022",
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

- **Endpoint**: `GET /api/employees/986b9ed2-a4e1-41f9-bc4b-682816e82b35/salary`
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
      "id": "60a64b42-d591-4065-b919-14662c512022",
      "employeeId": "986b9ed2-a4e1-41f9-bc4b-682816e82b35",
      "monthlyWage": "60000.00",
      "wageType": "fixed",
      "effectiveFrom": "2026-08-01",
      "effectiveTo": null,
      "status": "ACTIVE",
      "createdBy": "a6e914e7-67bc-440e-b257-9b3cc254d4f8",
      "createdAt": "2026-08-30T17:22:42.726Z",
      "updatedAt": "2026-08-30T17:22:42.726Z",
      "components": [
        {
          "id": "7cdedc84-fb17-4cda-b6b3-dbf60d980ee1",
          "salaryStructureId": "60a64b42-d591-4065-b919-14662c512022",
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

- **Endpoint**: `PATCH /api/employees/986b9ed2-a4e1-41f9-bc4b-682816e82b35/salary`
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
      "id": "dc946672-9986-4f45-a822-d9f7cfc7633d",
      "employeeId": "986b9ed2-a4e1-41f9-bc4b-682816e82b35",
      "monthlyWage": "75000.00",
      "wageType": "fixed",
      "effectiveFrom": "2026-09-01",
      "effectiveTo": null,
      "status": "ACTIVE",
      "createdBy": "a6e914e7-67bc-440e-b257-9b3cc254d4f8",
      "createdAt": "2026-08-30T17:22:47.832Z",
      "updatedAt": "2026-08-30T17:22:47.832Z",
      "components": [
        {
          "id": "6064788d-fc75-4123-86bc-fa33e2fd1258",
          "salaryStructureId": "dc946672-9986-4f45-a822-d9f7cfc7633d",
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

- **Endpoint**: `POST /api/employees/986b9ed2-a4e1-41f9-bc4b-682816e82b35/salary`
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
      "updatedAt": "2026-08-30T16:32:57.211Z"
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
      "updatedAt": "2026-08-30T17:22:52.212Z"
    }
  }
}
```

> **Note**: Configures statutory deduction percentages and default disbursement schedules.

---

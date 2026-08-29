# Feature 06: Salary & Compensation Management API

> Covers salary component definitions, compensation structures, dynamic percentage calculations, and admin-only access boundaries.

## 📋 Endpoints Overview

| Method | Endpoint | Scenario | Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/payroll/components` | List Salary Component Definitions (Admin) | `200` |
| `POST` | `/api/payroll/components` | Create Salary Component (Admin) | `201` |
| `POST` | `/api/employees/c31818a1-7b3a-482d-b4a4-b8e09bcbf74b/salary` | Set Employee Salary Structure (Admin) | `201` |
| `GET` | `/api/employees/c31818a1-7b3a-482d-b4a4-b8e09bcbf74b/salary` | Get Employee Salary Structure (Admin) | `200` |
| `POST` | `/api/employees/c31818a1-7b3a-482d-b4a4-b8e09bcbf74b/salary` | Modify Salary (Forbidden for Regular Employee) | `403` |

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
        "id": "49e58c11-ba86-4ecf-beb9-be93db3610d4",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "code": "BONUS_1787995240148",
        "name": "Performance Bonus",
        "componentType": "earning",
        "calculationType": "percentage_of_wage",
        "calculationBase": null,
        "isActive": true,
        "createdAt": "2026-08-29T09:20:41.319Z",
        "updatedAt": "2026-08-29T09:20:41.319Z"
      },
      {
        "id": "ff3c13c0-c321-4f09-a1ce-a16be1ee451a",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "code": "BONUS_1787995749022",
        "name": "Performance Bonus",
        "componentType": "earning",
        "calculationType": "percentage_of_wage",
        "calculationBase": null,
        "isActive": true,
        "createdAt": "2026-08-29T09:29:10.248Z",
        "updatedAt": "2026-08-29T09:29:10.248Z"
      },
      {
        "id": "310d7c66-d1a2-4008-838b-5c8f2109c1b3",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "code": "BONUS_1787997232712",
        "name": "Performance Bonus",
        "componentType": "earning",
        "calculationType": "percentage_of_wage",
        "calculationBase": null,
        "isActive": true,
        "createdAt": "2026-08-29T09:53:56.677Z",
        "updatedAt": "2026-08-29T09:53:56.677Z"
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
  "code": "BONUS_1787998043208",
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
      "id": "be92edba-e7d8-4013-96e7-68ecdda33cea",
      "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
      "code": "BONUS_1787998043208",
      "name": "Performance Bonus",
      "componentType": "earning",
      "calculationType": "percentage_of_wage",
      "calculationBase": null,
      "isActive": true,
      "createdAt": "2026-08-29T10:07:24.850Z",
      "updatedAt": "2026-08-29T10:07:24.850Z"
    }
  }
}
```

> **Note**: Registers new earning or deduction component.

---

### 3. Set Employee Salary Structure (Admin)

- **Endpoint**: `POST /api/employees/c31818a1-7b3a-482d-b4a4-b8e09bcbf74b/salary`
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
      "componentDefinitionId": "49e58c11-ba86-4ecf-beb9-be93db3610d4",
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
      "id": "c7061da2-0f20-4c7c-92a9-dfbe84d39302",
      "employeeId": "c31818a1-7b3a-482d-b4a4-b8e09bcbf74b",
      "monthlyWage": "60000.00",
      "wageType": "fixed",
      "effectiveFrom": "2026-08-01",
      "effectiveTo": null,
      "status": "ACTIVE",
      "createdBy": "a01e3d51-17dd-450c-a5f6-c3f8b0c60e02",
      "createdAt": "2026-08-29T10:07:26.270Z",
      "updatedAt": "2026-08-29T10:07:26.270Z",
      "components": [
        {
          "id": "604ea1e0-8ca5-468a-b04e-6728e4d96620",
          "salaryStructureId": "c7061da2-0f20-4c7c-92a9-dfbe84d39302",
          "componentDefinitionId": "49e58c11-ba86-4ecf-beb9-be93db3610d4",
          "calculationType": "percentage_of_wage",
          "calculationBase": null,
          "percentage": "50.000",
          "fixedAmount": "0.00",
          "sequence": 1,
          "isResidual": false,
          "code": "BONUS_1787995240148",
          "name": "Performance Bonus",
          "componentType": "earning"
        }
      ]
    }
  }
}
```

> **Note**: Configures wage breakdown and percentage component calculations.

---

### 4. Get Employee Salary Structure (Admin)

- **Endpoint**: `GET /api/employees/c31818a1-7b3a-482d-b4a4-b8e09bcbf74b/salary`
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
      "id": "c7061da2-0f20-4c7c-92a9-dfbe84d39302",
      "employeeId": "c31818a1-7b3a-482d-b4a4-b8e09bcbf74b",
      "monthlyWage": "60000.00",
      "wageType": "fixed",
      "effectiveFrom": "2026-08-01",
      "effectiveTo": null,
      "status": "ACTIVE",
      "createdBy": "a01e3d51-17dd-450c-a5f6-c3f8b0c60e02",
      "createdAt": "2026-08-29T10:07:26.270Z",
      "updatedAt": "2026-08-29T10:07:26.270Z",
      "components": [
        {
          "id": "604ea1e0-8ca5-468a-b04e-6728e4d96620",
          "salaryStructureId": "c7061da2-0f20-4c7c-92a9-dfbe84d39302",
          "componentDefinitionId": "49e58c11-ba86-4ecf-beb9-be93db3610d4",
          "calculationType": "percentage_of_wage",
          "calculationBase": null,
          "percentage": "50.000",
          "fixedAmount": "0.00",
          "sequence": 1,
          "isResidual": false,
          "code": "BONUS_1787995240148",
          "name": "Performance Bonus",
          "componentType": "earning"
        }
      ]
    }
  }
}
```

> **Note**: Retrieves current active salary structure and itemized component formulas.

---

### 5. Modify Salary (Forbidden for Regular Employee)

- **Endpoint**: `POST /api/employees/c31818a1-7b3a-482d-b4a4-b8e09bcbf74b/salary`
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


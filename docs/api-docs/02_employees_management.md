# Feature 02: Employee & Account Management API

> Covers employee provisioning, atomic Login ID generation, directory search, activation controls, and credential resets.

## 📋 Endpoints Overview

| Method | Endpoint | Scenario | Status |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/employees` | Create Employee Account (Admin) | `201` |
| `POST` | `/api/employees` | Create Employee (Forbidden for Regular Employee) | `403` |
| `GET` | `/api/employees` | Search & List Employees (Success) | `200` |
| `GET` | `/api/employees/d3ec1d32-9d96-48cf-8e9a-069b797737f5` | Get Employee by ID (Success) | `200` |
| `POST` | `/api/employees/d3ec1d32-9d96-48cf-8e9a-069b797737f5/deactivate` | Deactivate Employee Account (Admin) | `200` |
| `POST` | `/api/employees/d3ec1d32-9d96-48cf-8e9a-069b797737f5/activate` | Reactivate Employee Account (Admin) | `200` |
| `POST` | `/api/employees/d3ec1d32-9d96-48cf-8e9a-069b797737f5/reset-password` | Reset Employee Password (Admin) | `200` |

---

## 🔍 Detailed Scenarios & Outputs

### 1. Create Employee Account (Admin)

- **Endpoint**: `POST /api/employees`
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
  "firstName": "Alice",
  "lastName": "Smith",
  "email": "alice_1787997936610@personal.com",
  "phone": "9123456780",
  "joiningDate": "2026-08-01",
  "employmentType": "full_time"
}
```
- **Response Body**:
```json
{
  "message": "Employee created successfully.",
  "success": true,
  "error": null,
  "data": {
    "employee": {
      "id": "d3ec1d32-9d96-48cf-8e9a-069b797737f5",
      "employeeCode": "TESTALSM20260020",
      "firstName": "Alice",
      "lastName": "Smith",
      "displayName": "Alice Smith",
      "workEmail": "alice.smith3@testorg.dayflow.com",
      "joiningDate": "2026-08-01",
      "employmentStatus": "active",
      "employmentType": "full_time"
    },
    "user": {
      "id": "5a99b220-4c7e-4448-9459-228692417bd2",
      "email": "alice.smith3@testorg.dayflow.com",
      "role": "employee"
    },
    "credentials": {
      "loginId": "TESTALSM20260020",
      "workEmail": "alice.smith3@testorg.dayflow.com",
      "temporaryPassword": "#fU@Yq3QJfov"
    }
  }
}
```

> **Note**: Generates atomic Login ID (e.g. TESTALSM20260001), temporary password, work email, and default leave allocations.

---

### 2. Create Employee (Forbidden for Regular Employee)

- **Endpoint**: `POST /api/employees`
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

> **Note**: Enforces RBAC restricting employee creation to Admin and HR.

---

### 3. Search & List Employees (Success)

- **Endpoint**: `GET /api/employees`
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
  "search": "Alice"
}
```
- **Response Body**:
```json
{
  "message": "Employee directory retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "employees": [
      {
        "id": "b8833954-9cc1-4503-8517-f91c0b704067",
        "employeeCode": "TESTALSM20260003",
        "firstName": "Alice",
        "lastName": "Smith",
        "displayName": "Alice Smith",
        "workEmail": "alice.smith@testorg.dayflow.com",
        "joiningDate": "2026-08-01",
        "employmentStatus": "active",
        "departmentId": null,
        "departmentName": null,
        "jobPositionId": null,
        "jobPositionName": null,
        "locationId": null,
        "locationName": null,
        "status": "absent"
      },
      {
        "id": "f92e3067-be20-4bec-a09b-07aa7ebbd0b1",
        "employeeCode": "TESTALSM20260007",
        "firstName": "Alice",
        "lastName": "Smith",
        "displayName": "Alice Smith",
        "workEmail": "alice.smith1@testorg.dayflow.com",
        "joiningDate": "2026-08-01",
        "employmentStatus": "active",
        "departmentId": null,
        "departmentName": null,
        "jobPositionId": null,
        "jobPositionName": null,
        "locationId": null,
        "locationName": null,
        "status": "absent"
      },
      {
        "id": "ab42ff82-5021-49a2-b97c-be9297900a71",
        "employeeCode": "TESTALSM20260013",
        "firstName": "Alice",
        "lastName": "Smith",
        "displayName": "Alice Smith",
        "workEmail": "alice.smith2@testorg.dayflow.com",
        "joiningDate": "2026-08-01",
        "employmentStatus": "active",
        "departmentId": null,
        "departmentName": null,
        "jobPositionId": null,
        "jobPositionName": null,
        "locationId": null,
        "locationName": null,
        "status": "absent"
      },
      {
        "id": "d3ec1d32-9d96-48cf-8e9a-069b797737f5",
        "employeeCode": "TESTALSM20260020",
        "firstName": "Alice",
        "lastName": "Smith",
        "displayName": "Alice Smith",
        "workEmail": "alice.smith3@testorg.dayflow.com",
        "joiningDate": "2026-08-01",
        "employmentStatus": "active",
        "departmentId": null,
        "departmentName": null,
        "jobPositionId": null,
        "jobPositionName": null,
        "locationId": null,
        "locationName": null,
        "status": "absent"
      }
    ]
  }
}
```

> **Note**: Searches employee directory by name, code, email, and department.

---

### 4. Get Employee by ID (Success)

- **Endpoint**: `GET /api/employees/d3ec1d32-9d96-48cf-8e9a-069b797737f5`
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
  "message": "Employee profile retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "header": {
      "id": "d3ec1d32-9d96-48cf-8e9a-069b797737f5",
      "employeeCode": "TESTALSM20260020",
      "firstName": "Alice",
      "lastName": "Smith",
      "displayName": "Alice Smith",
      "workEmail": "alice.smith3@testorg.dayflow.com",
      "phone": "9123456780",
      "userEmail": "alice.smith3@testorg.dayflow.com",
      "userProfileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg",
      "departmentName": null,
      "jobPositionName": null,
      "locationName": null,
      "managerFirstName": null,
      "managerLastName": null,
      "joiningDate": "2026-08-01",
      "employmentStatus": "active",
      "employmentType": "full_time"
    },
    "resume": {
      "dateOfBirth": null,
      "gender": null,
      "skills": [],
      "certifications": []
    }
  }
}
```

> **Note**: Retrieves complete profile details for the specified employee.

---

### 5. Deactivate Employee Account (Admin)

- **Endpoint**: `POST /api/employees/d3ec1d32-9d96-48cf-8e9a-069b797737f5/deactivate`
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
  "message": "Employee account deactivated successfully.",
  "success": true,
  "error": null,
  "data": {
    "employeeId": "d3ec1d32-9d96-48cf-8e9a-069b797737f5",
    "userId": "5a99b220-4c7e-4448-9459-228692417bd2",
    "isActive": false
  }
}
```

> **Note**: Sets account status to inactive, preventing login attempts.

---

### 6. Reactivate Employee Account (Admin)

- **Endpoint**: `POST /api/employees/d3ec1d32-9d96-48cf-8e9a-069b797737f5/activate`
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
  "message": "Employee account activated successfully.",
  "success": true,
  "error": null,
  "data": {
    "employeeId": "d3ec1d32-9d96-48cf-8e9a-069b797737f5",
    "userId": "5a99b220-4c7e-4448-9459-228692417bd2",
    "isActive": true
  }
}
```

> **Note**: Restores active status on employee user account.

---

### 7. Reset Employee Password (Admin)

- **Endpoint**: `POST /api/employees/d3ec1d32-9d96-48cf-8e9a-069b797737f5/reset-password`
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
  "message": "Employee password reset successfully.",
  "success": true,
  "error": null,
  "data": {
    "employeeId": "d3ec1d32-9d96-48cf-8e9a-069b797737f5",
    "userId": "5a99b220-4c7e-4448-9459-228692417bd2",
    "temporaryPassword": "No5C!W6yHmQi"
  }
}
```

> **Note**: Generates new temporary password, marks mustChangePassword: true, and dispatches reset email.

---


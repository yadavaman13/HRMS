# Feature 02: Employee & Account Management API

> Covers employee provisioning, atomic Login ID generation, directory search, profile updates, account activation controls, credential resets, and leave balance inspection.

## 📋 Endpoints Overview

| Method   | Endpoint                                                             | Scenario                                         | Status |
| :------- | :------------------------------------------------------------------- | :----------------------------------------------- | :----- |
| `POST`   | `/api/employees`                                                     | Create Employee Account (Admin)                  | `201`  |
| `POST`   | `/api/employees`                                                     | Create Employee (Forbidden for Regular Employee) | `403`  |
| `GET`    | `/api/employees`                                                     | Search & List Employees (Success)                | `200`  |
| `GET`    | `/api/employees/32816e3b-d808-483c-9330-f23a5ed9d83b`                | Get Employee by ID (Success)                     | `200`  |
| `PATCH`  | `/api/employees/32816e3b-d808-483c-9330-f23a5ed9d83b`                | Update Employee Record (Admin)                   | `200`  |
| `GET`    | `/api/employees/32816e3b-d808-483c-9330-f23a5ed9d83b/leave-balances` | Get Employee Leave Balances (Admin)              | `200`  |
| `POST`   | `/api/employees/32816e3b-d808-483c-9330-f23a5ed9d83b/deactivate`     | Deactivate Employee Account (Admin)              | `200`  |
| `POST`   | `/api/employees/32816e3b-d808-483c-9330-f23a5ed9d83b/activate`       | Reactivate Employee Account (Admin)              | `200`  |
| `POST`   | `/api/employees/32816e3b-d808-483c-9330-f23a5ed9d83b/reset-password` | Reset Employee Password (Admin)                  | `200`  |
| `DELETE` | `/api/employees/32816e3b-d808-483c-9330-f23a5ed9d83b`                | Delete Employee Account (Admin)                  | `200`  |

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
  "email": "alice_1788110241974@personal.com",
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
      "id": "32816e3b-d808-483c-9330-f23a5ed9d83b",
      "employeeCode": "TESTALSM20260114",
      "firstName": "Alice",
      "lastName": "Smith",
      "displayName": "Alice Smith",
      "workEmail": "alice.smith17@testorg.dayflow.com",
      "joiningDate": "2026-08-01",
      "employmentStatus": "active",
      "employmentType": "full_time"
    },
    "user": {
      "id": "c1eae38e-c790-4904-b077-3cb4191828e8",
      "email": "alice.smith17@testorg.dayflow.com",
      "role": "employee"
    },
    "credentials": {
      "loginId": "TESTALSM20260114",
      "workEmail": "alice.smith17@testorg.dayflow.com",
      "temporaryPassword": "$99MJ6Bb9cjY"
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
        "id": "2bf4d935-68fb-4569-a7b7-abc2dfc38d30",
        "employeeCode": "TESTALSM20260008",
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
        "status": "off_day"
      },
      {
        "id": "6e0fb9d5-7e7d-4544-a2d8-d1a8216886a3",
        "employeeCode": "TESTALSM20260016",
        "firstName": "Alice",
        "lastName": "Smith",
        "displayName": "Alice Smith",
        "workEmail": "alice.smith4@testorg.dayflow.com",
        "joiningDate": "2026-08-01",
        "employmentStatus": "active",
        "departmentId": null,
        "departmentName": null,
        "jobPositionId": null,
        "jobPositionName": null,
        "locationId": null,
        "locationName": null,
        "status": "off_day"
      },
      {
        "id": "32816e3b-d808-483c-9330-f23a5ed9d83b",
        "employeeCode": "TESTALSM20260114",
        "firstName": "Alice",
        "lastName": "Smith",
        "displayName": "Alice Smith",
        "workEmail": "alice.smith17@testorg.dayflow.com",
        "joiningDate": "2026-08-01",
        "employmentStatus": "active",
        "departmentId": null,
        "departmentName": null,
        "jobPositionId": null,
        "jobPositionName": null,
        "locationId": null,
        "locationName": null,
        "status": "off_day"
      }
    ]
  }
}
```

> **Note**: Searches employee directory by name, code, email, and department.

---

### 4. Get Employee by ID (Success)

- **Endpoint**: `GET /api/employees/32816e3b-d808-483c-9330-f23a5ed9d83b`
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
      "id": "32816e3b-d808-483c-9330-f23a5ed9d83b",
      "employeeCode": "TESTALSM20260114",
      "firstName": "Alice",
      "lastName": "Smith",
      "displayName": "Alice Smith",
      "workEmail": "alice.smith17@testorg.dayflow.com",
      "phone": "9123456780",
      "userEmail": "alice.smith17@testorg.dayflow.com",
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

### 5. Update Employee Record (Admin)

- **Endpoint**: `PATCH /api/employees/32816e3b-d808-483c-9330-f23a5ed9d83b`
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
  "phone": "9888899999",
  "employmentType": "full_time"
}
```

- **Response Body**:

```json
{
  "message": "Employee profile updated successfully",
  "success": true,
  "error": null,
  "data": {
    "employee": {
      "id": "32816e3b-d808-483c-9330-f23a5ed9d83b",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "employeeCode": "TESTALSM20260114",
      "firstName": "Alice",
      "middleName": null,
      "lastName": "Smith",
      "displayName": "Alice Smith",
      "dateOfBirth": null,
      "gender": null,
      "phone": "9888899999",
      "workEmail": "alice.smith17@testorg.dayflow.com",
      "departmentId": null,
      "jobPositionId": null,
      "managerId": null,
      "locationId": null,
      "joiningDate": "2026-08-01",
      "terminationDate": null,
      "employmentStatus": "active",
      "employmentType": "full_time",
      "userId": "c1eae38e-c790-4904-b077-3cb4191828e8",
      "createdAt": "2026-08-30T17:17:23.472Z",
      "updatedAt": "2026-08-30T17:17:45.862Z"
    }
  }
}
```

> **Note**: Updates core employee attributes including phone, department, and job title.

---

### 6. Get Employee Leave Balances (Admin)

- **Endpoint**: `GET /api/employees/32816e3b-d808-483c-9330-f23a5ed9d83b/leave-balances`
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
  "message": "Employee leave balances retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "employee": {
      "id": "32816e3b-d808-483c-9330-f23a5ed9d83b",
      "firstName": "Alice",
      "lastName": "Smith",
      "employeeCode": "TESTALSM20260114"
    },
    "balances": [
      {
        "leaveTypeId": "a82e825b-df23-4a21-9157-b924aa120560",
        "code": "CASUAL_1788082885746",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "42bf4909-6c79-4d08-a5e4-e76d8ef52d75",
        "code": "CASUAL_1788083523308",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "1a92e81d-9a85-4ec7-a3e4-47b54b7b8174",
        "code": "CASUAL_1788083768714",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "4fc5307d-a414-4cc8-97ce-2005acb22d5a",
        "code": "CASUAL_1788084091667",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "f9d1b09f-ad10-42d8-b604-1a92441506e6",
        "code": "CASUAL_1788084773277",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "744a13fd-1838-4771-acd9-275285edb589",
        "code": "CASUAL_1788085737574",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "f65f4aa5-28a3-4db5-9f67-0ac999df0c6e",
        "code": "CASUAL_1788099236806",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "b431df60-253a-41a4-a822-946a11ede30e",
        "code": "CASUAL_1788101953267",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "c3de17eb-687b-4b37-9feb-84a981c035ab",
        "code": "CASUAL_1788102118247",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "41c1e56b-57d7-453c-9566-8214b2e155ac",
        "code": "CASUAL_1788102782922",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "1d5c27f2-1e76-414a-9f3a-6251192b6700",
        "code": "CASUAL_1788103701714",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "67033965-e743-4b4f-8a22-e83963669659",
        "code": "CASUAL_1788104338205",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "e59e317a-e99b-4447-8422-e165162090bb",
        "code": "CASUAL_1788104986171",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "031dfa32-ec1d-4e53-9b79-3293238a216b",
        "code": "CASUAL_1788105822180",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "5d906089-6b69-4d04-beaf-f3c98e52204f",
        "code": "CASUAL_1788106684722",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      },
      {
        "leaveTypeId": "31d51bf6-2a08-4608-b41a-a0c962da0bb5",
        "code": "CASUAL_1788107526856",
        "name": "Casual Leave",
        "isPaid": true,
        "requiresAllocation": true,
        "requiresAttachment": false,
        "unit": "day",
        "allocatedDays": 12,
        "usedDays": 0,
        "pendingDays": 0,
        "creditedDays": 0,
        "carryForwardDays": 0,
        "netBalance": 12,
        "availableBalance": 12
      }
    ]
  }
}
```

> **Note**: Allows HR/Admin to inspect remaining leave balances and allocations for any employee.

---

### 7. Deactivate Employee Account (Admin)

- **Endpoint**: `POST /api/employees/32816e3b-d808-483c-9330-f23a5ed9d83b/deactivate`
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
    "employeeId": "32816e3b-d808-483c-9330-f23a5ed9d83b",
    "userId": "c1eae38e-c790-4904-b077-3cb4191828e8",
    "isActive": false
  }
}
```

> **Note**: Sets account status to inactive, preventing login attempts.

---

### 8. Reactivate Employee Account (Admin)

- **Endpoint**: `POST /api/employees/32816e3b-d808-483c-9330-f23a5ed9d83b/activate`
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
    "employeeId": "32816e3b-d808-483c-9330-f23a5ed9d83b",
    "userId": "c1eae38e-c790-4904-b077-3cb4191828e8",
    "isActive": true
  }
}
```

> **Note**: Restores active status on employee user account.

---

### 9. Reset Employee Password (Admin)

- **Endpoint**: `POST /api/employees/32816e3b-d808-483c-9330-f23a5ed9d83b/reset-password`
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
    "employeeId": "32816e3b-d808-483c-9330-f23a5ed9d83b",
    "userId": "c1eae38e-c790-4904-b077-3cb4191828e8",
    "temporaryPassword": "iE^m86bJiXMP"
  }
}
```

> **Note**: Generates new temporary password, marks mustChangePassword: true, and dispatches reset email.

---

### 10. Delete Employee Account (Admin)

- **Endpoint**: `DELETE /api/employees/32816e3b-d808-483c-9330-f23a5ed9d83b`
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
  "message": "Employee soft-deleted successfully",
  "success": true,
  "error": null,
  "data": {
    "employee": {
      "id": "32816e3b-d808-483c-9330-f23a5ed9d83b",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "userId": "c1eae38e-c790-4904-b077-3cb4191828e8",
      "employeeCode": "TESTALSM20260114",
      "firstName": "Alice",
      "middleName": null,
      "lastName": "Smith",
      "displayName": "Alice Smith",
      "dateOfBirth": null,
      "gender": null,
      "phone": "9888899999",
      "workEmail": "alice.smith17@testorg.dayflow.com",
      "departmentId": null,
      "jobPositionId": null,
      "managerId": null,
      "locationId": null,
      "joiningDate": "2026-08-01",
      "terminationDate": null,
      "employmentStatus": "active",
      "employmentType": "full_time",
      "createdAt": "2026-08-30T17:17:23.472Z",
      "updatedAt": "2026-08-30T17:17:45.862Z",
      "deletedAt": null
    }
  }
}
```

> **Note**: Soft-deletes employee account and archives employment relationship.

---

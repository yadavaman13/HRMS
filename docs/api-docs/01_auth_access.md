# Feature 01: Authentication & Access Control API

> Covers user authentication, Login ID login, session management, password rotations, and role permissions.

## 📋 Endpoints Overview

| Method | Endpoint | Scenario | Status |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register Organization and Admin (Success) | `201` |
| `POST` | `/api/auth/register` | Register Organization (Validation Failure) | `400` |
| `POST` | `/api/auth/login` | Login with Email (Success) | `200` |
| `POST` | `/api/auth/login` | Login with Wrong Password (Unauthorized) | `401` |
| `GET` | `/api/auth/me` | Get Current Authenticated User (Success) | `200` |
| `GET` | `/api/auth/me` | Get Current User (Unauthenticated) | `401` |
| `GET` | `/api/auth/roles` | Get Roles Matrix (Success) | `200` |
| `GET` | `/api/auth/permissions` | Get Permissions Matrix (Success) | `200` |
| `POST` | `/api/auth/change-password` | Change Password (Success) | `200` |
| `POST` | `/api/auth/logout` | Logout User (Success) | `200` |

---

## 🔍 Detailed Scenarios & Outputs

### 1. Register Organization and Admin (Success)

- **Endpoint**: `POST /api/auth/register`
- **Expected Status**: `201`
- **Request Body**:
```json
{
  "companyName": "Acme Corp 1787997907183",
  "name": "John Admin",
  "email": "admin_1787997907183@example.com",
  "password": "Password@123",
  "phone": "9876543210"
}
```
- **Response Body**:
```json
{
  "message": "Company and Admin registered successfully",
  "success": true,
  "error": null,
  "user": {
    "id": "0343e308-4959-4a6a-ac64-c516e6a81709",
    "organizationId": "65eddccb-75c5-4f55-b8b2-b904c6153b2e",
    "firstName": "John",
    "lastName": "Admin",
    "email": "admin_1787997907183@example.com",
    "role": "admin",
    "isActive": true,
    "emailVerified": false,
    "mustChangePassword": false,
    "createdAt": "2026-08-29T10:05:14.266Z",
    "updatedAt": "2026-08-29T10:05:14.266Z"
  }
}
```

> **Note**: Registers new company organization and initializes admin user with session token.

---

### 2. Register Organization (Validation Failure)

- **Endpoint**: `POST /api/auth/register`
- **Expected Status**: `400`
- **Request Body**:
```json
{
  "email": "invalid-email",
  "password": ""
}
```
- **Response Body**:
```json
{
  "message": "Validation failed",
  "success": false,
  "error": null,
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Company Name is required",
      "path": "companyName",
      "location": "body"
    },
    {
      "type": "field",
      "value": "",
      "msg": "Name is required",
      "path": "name",
      "location": "body"
    },
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "A valid email is required",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "",
      "msg": "Password must be at least 6 characters long",
      "path": "password",
      "location": "body"
    }
  ]
}
```

> **Note**: Rejects registration when required fields are missing.

---

### 3. Login with Email (Success)

- **Endpoint**: `POST /api/auth/login`
- **Expected Status**: `200`
- **Request Body**:
```json
{
  "email": "test_user_1787997920591_60721@example.com",
  "password": "Password@123"
}
```
- **Response Body**:
```json
{
  "message": "Login successful.",
  "success": true,
  "error": null,
  "user": {
    "id": "e9cdb6ee-5535-462e-b36a-039ac56bd00d",
    "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
    "firstName": "Test",
    "lastName": "User",
    "email": "test_user_1787997920591_60721@example.com",
    "role": "employee",
    "isActive": true,
    "emailVerified": true,
    "mustChangePassword": false,
    "createdAt": "2026-08-29T10:05:21.316Z",
    "updatedAt": "2026-08-29T10:05:21.316Z"
  }
}
```

> **Note**: Validates email credentials and sets HTTP-only session cookie.

---

### 4. Login with Wrong Password (Unauthorized)

- **Endpoint**: `POST /api/auth/login`
- **Expected Status**: `401`
- **Request Body**:
```json
{
  "email": "test_user_1787997920591_60721@example.com",
  "password": "WrongPassword123"
}
```
- **Response Body**:
```json
{
  "message": "Invalid email/Employee ID or password.",
  "success": false,
  "error": null
}
```

> **Note**: Rejects invalid credentials without leaking specific account status.

---

### 5. Get Current Authenticated User (Success)

- **Endpoint**: `GET /api/auth/me`
- **Expected Status**: `200`
- **Headers**:
```json
{
  "Cookie": "token=JWT_SESSION_TOKEN"
}
```
- **Response Body**:
```json
{
  "message": "User retrieved successfully",
  "success": true,
  "error": null,
  "user": {
    "id": "84661394-dde1-4488-997a-06d92cf65dc0",
    "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
    "firstName": "Test",
    "lastName": "User",
    "email": "test_user_1787997922894_4470@example.com",
    "role": "employee",
    "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg",
    "isActive": true,
    "emailVerified": true,
    "mustChangePassword": false,
    "createdAt": "2026-08-29T10:05:23.751Z",
    "updatedAt": "2026-08-29T10:05:23.751Z"
  },
  "data": {
    "user": {
      "id": "84661394-dde1-4488-997a-06d92cf65dc0",
      "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
      "firstName": "Test",
      "lastName": "User",
      "email": "test_user_1787997922894_4470@example.com",
      "role": "employee",
      "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg",
      "isActive": true,
      "emailVerified": true,
      "mustChangePassword": false,
      "createdAt": "2026-08-29T10:05:23.751Z",
      "updatedAt": "2026-08-29T10:05:23.751Z"
    }
  }
}
```

> **Note**: Retrieves active session details and mustChangePassword flag.

---

### 6. Get Current User (Unauthenticated)

- **Endpoint**: `GET /api/auth/me`
- **Expected Status**: `401`
- **Response Body**:
```json
{
  "message": "You are not logged in. Please log in to gain access.",
  "success": false,
  "error": null
}
```

> **Note**: Protected endpoint rejects requests missing session tokens.

---

### 7. Get Roles Matrix (Success)

- **Endpoint**: `GET /api/auth/roles`
- **Expected Status**: `200`
- **Headers**:
```json
{
  "Cookie": "token=JWT_SESSION_TOKEN"
}
```
- **Response Body**:
```json
{
  "message": "Roles retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "roles": [
      {
        "role": "admin",
        "name": "Administrator",
        "description": "Full administrative access to employees, payroll, configurations, and company settings."
      },
      {
        "role": "hr",
        "name": "HR / Time-Off Officer",
        "description": "Access to manage employees, attendance, leave approvals, and view profiles."
      },
      {
        "role": "employee",
        "name": "Employee",
        "description": "Access to personal profile, check-in/out, leave applications, and payslips."
      }
    ]
  }
}
```

> **Note**: Lists active roles (admin, hr, employee) and their tier descriptions.

---

### 8. Get Permissions Matrix (Success)

- **Endpoint**: `GET /api/auth/permissions`
- **Expected Status**: `200`
- **Headers**:
```json
{
  "Cookie": "token=JWT_SESSION_TOKEN"
}
```
- **Response Body**:
```json
{
  "message": "Permissions retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "permissions": {
      "admin": {
        "employees": [
          "create",
          "read",
          "update",
          "delete",
          "activate",
          "deactivate",
          "reset-password"
        ],
        "profile": [
          "read-all",
          "update-all",
          "private-info",
          "salary-info"
        ],
        "attendance": [
          "check-in",
          "check-out",
          "read-all",
          "adjust-all",
          "correct-record"
        ],
        "leave": [
          "view-all",
          "approve",
          "reject",
          "configure-types",
          "allocate"
        ],
        "salary": [
          "view-all",
          "configure-structures",
          "manage-components"
        ],
        "payroll": [
          "run-payroll",
          "calculate",
          "finalize",
          "download-all-payslips",
          "recalculate",
          "lock"
        ],
        "company": [
          "manage-settings",
          "work-schedules",
          "leave-policies",
          "payroll-config"
        ],
        "audit": [
          "view-all-logs",
          "view-stats"
        ],
        "notifications": [
          "broadcast",
          "read-all"
        ]
      },
      "hr": {
        "employees": [
          "create",
          "read",
          "update",
          "activate",
          "deactivate",
          "reset-password"
        ],
        "profile": [
          "read-all",
          "update-profile"
        ],
        "attendance": [
          "check-in",
          "check-out",
          "read-all",
          "adjust-all"
        ],
        "leave": [
          "view-all",
          "approve",
          "reject",
          "allocate"
        ],
        "salary": [
          "view-structures"
        ],
        "payroll": [
          "process-periods",
          "view-payslips"
        ],
        "company": [
          "view-settings",
          "work-schedules"
        ],
        "audit": [
          "view-all-logs"
        ],
        "notifications": [
          "broadcast"
        ]
      },
      "employee": {
        "employees": [
          "read-directory"
        ],
        "profile": [
          "read-self",
          "update-self-limited",
          "upload-avatar"
        ],
        "attendance": [
          "check-in",
          "check-out",
          "read-self",
          "request-adjustment"
        ],
        "leave": [
          "read-self-balances",
          "apply-leave",
          "cancel-self-request"
        ],
        "salary": [
          "read-self-payslips"
        ],
        "payroll": [
          "view-self-payslip",
          "download-self-payslip"
        ],
        "company": [
          "view-basic"
        ],
        "audit": [],
        "notifications": [
          "read-self"
        ]
      }
    },
    "currentRole": "employee"
  }
}
```

> **Note**: Returns permissions hierarchy for the current user role.

---

### 9. Change Password (Success)

- **Endpoint**: `POST /api/auth/change-password`
- **Expected Status**: `200`
- **Headers**:
```json
{
  "Cookie": "token=JWT_SESSION_TOKEN"
}
```
- **Request Body**:
```json
{
  "currentPassword": "Password@123",
  "newPassword": "NewStrongPassword@123"
}
```
- **Response Body**:
```json
{
  "message": "Password changed successfully",
  "success": true,
  "error": null
}
```

> **Note**: Updates user password hash and clears mustChangePassword flag.

---

### 10. Logout User (Success)

- **Endpoint**: `POST /api/auth/logout`
- **Expected Status**: `200`
- **Headers**:
```json
{
  "Cookie": "token=JWT_SESSION_TOKEN"
}
```
- **Response Body**:
```json
{
  "message": "Logout successful.",
  "success": true,
  "error": null
}
```

> **Note**: Blacklists token in Redis cache and clears cookie.

---


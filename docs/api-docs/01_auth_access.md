# Feature 01: Authentication & Access Control API

> Covers user authentication, Login ID login, session management, email verification OTP, password resets, account recovery, and role permissions.

## 📋 Endpoints Overview

| Method | Endpoint                               | Scenario                                            | Status |
| :----- | :------------------------------------- | :-------------------------------------------------- | :----- |
| `POST` | `/api/auth/register`                   | Register Organization and Admin (Success)           | `201`  |
| `POST` | `/api/auth/register`                   | Register Organization (Validation Failure)          | `400`  |
| `POST` | `/api/auth/send-verification-otp`      | Send Verification OTP (Success)                     | `200`  |
| `POST` | `/api/auth/verify-email`               | Verify Email with OTP (Success)                     | `200`  |
| `POST` | `/api/auth/resend-otp`                 | Resend Verification OTP (Success)                   | `200`  |
| `POST` | `/api/auth/login`                      | Login with Email (Success)                          | `200`  |
| `POST` | `/api/auth/login`                      | Login with Wrong Password (Unauthorized)            | `401`  |
| `POST` | `/api/auth/forgot-password`            | Request Password Reset OTP (Success)                | `200`  |
| `POST` | `/api/auth/verify-forgot-password-otp` | Verify Password Reset OTP (Success)                 | `200`  |
| `POST` | `/api/auth/reset-password`             | Reset Password with Confirmed Credentials (Success) | `200`  |
| `POST` | `/api/auth/recover-account/request`    | Request Account Recovery OTP (Success)              | `200`  |
| `POST` | `/api/auth/recover-account/verify`     | Verify Account Recovery OTP & Restore (Success)     | `200`  |
| `GET`  | `/api/auth/me`                         | Get Current Authenticated User (Success)            | `200`  |
| `GET`  | `/api/auth/me`                         | Get Current User (Unauthenticated)                  | `401`  |
| `GET`  | `/api/auth/roles`                      | Get Roles Matrix (Success)                          | `200`  |
| `GET`  | `/api/auth/permissions`                | Get Permissions Matrix (Success)                    | `200`  |
| `POST` | `/api/auth/change-password`            | Change Password (Success)                           | `200`  |
| `POST` | `/api/auth/logout`                     | Logout User (Success)                               | `200`  |

---

## 🔍 Detailed Scenarios & Outputs

### 1. Register Organization and Admin (Success)

- **Endpoint**: `POST /api/auth/register`
- **Expected Status**: `201`
- **Request Body**:

```json
{
  "companyName": "Acme Corp 1788085604547",
  "name": "John Admin",
  "email": "admin_1788085604547@example.com",
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
    "id": "b4d8ea49-4cf4-44aa-9b2d-1661bc71e6f2",
    "organizationId": "fc638ea3-4849-4c92-b4fe-bbe78862a20d",
    "firstName": "John",
    "lastName": "Admin",
    "email": "admin_1788085604547@example.com",
    "role": "admin",
    "isActive": true,
    "emailVerified": false,
    "mustChangePassword": false,
    "createdAt": "2026-08-30T10:26:46.780Z",
    "updatedAt": "2026-08-30T10:26:46.780Z"
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

### 3. Send Verification OTP (Success)

- **Endpoint**: `POST /api/auth/send-verification-otp`
- **Expected Status**: `200`
- **Request Body**:

```json
{
  "email": "otp_test_1788085604544@example.com"
}
```

- **Response Body**:

```json
{
  "message": "Verification OTP sent to your email.",
  "success": true,
  "error": null
}
```

> **Note**: Dispatches 6-digit email verification OTP to unverified email address.

---

### 4. Verify Email with OTP (Success)

- **Endpoint**: `POST /api/auth/verify-email`
- **Expected Status**: `200`
- **Request Body**:

```json
{
  "email": "otp_test_1788085604544@example.com",
  "otp": "123456"
}
```

- **Response Body**:

```json
{
  "message": "Email verified successfully",
  "success": true,
  "error": null
}
```

> **Note**: Verifies email address and marks emailVerified in database/cache.

---

### 5. Resend Verification OTP (Success)

- **Endpoint**: `POST /api/auth/resend-otp`
- **Expected Status**: `200`
- **Request Body**:

```json
{
  "email": "otp_test_1788085604544@example.com",
  "purpose": "verify"
}
```

- **Response Body**:

```json
{
  "message": "OTP resent successfully",
  "success": true,
  "error": null
}
```

> **Note**: Resends verification OTP if cooldown period has elapsed.

---

### 6. Login with Email (Success)

- **Endpoint**: `POST /api/auth/login`
- **Expected Status**: `200`
- **Request Body**:

```json
{
  "email": "test_user_1788085617803_95841@example.com",
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
    "id": "42b1e7cb-14dc-4854-a3dc-24b7ec5d2f88",
    "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
    "firstName": "Test",
    "lastName": "User",
    "email": "test_user_1788085617803_95841@example.com",
    "role": "employee",
    "isActive": true,
    "emailVerified": true,
    "mustChangePassword": false,
    "createdAt": "2026-08-30T10:26:57.940Z",
    "updatedAt": "2026-08-30T10:26:57.940Z"
  }
}
```

> **Note**: Validates email credentials and sets HTTP-only session cookie.

---

### 7. Login with Wrong Password (Unauthorized)

- **Endpoint**: `POST /api/auth/login`
- **Expected Status**: `401`
- **Request Body**:

```json
{
  "email": "test_user_1788085617803_95841@example.com",
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

### 8. Request Password Reset OTP (Success)

- **Endpoint**: `POST /api/auth/forgot-password`
- **Expected Status**: `200`
- **Request Body**:

```json
{
  "email": "test_user_1788085620185_57929@example.com"
}
```

- **Response Body**:

```json
{
  "message": "OTP sent to the registered email. Please check your inbox.",
  "success": true,
  "error": null
}
```

> **Note**: Dispatches password reset OTP to user registered email address.

---

### 9. Verify Password Reset OTP (Success)

- **Endpoint**: `POST /api/auth/verify-forgot-password-otp`
- **Expected Status**: `200`
- **Request Body**:

```json
{
  "email": "test_user_1788085620185_57929@example.com",
  "otp": "654321"
}
```

- **Response Body**:

```json
{
  "message": "OTP verified successfully.",
  "success": true,
  "error": null
}
```

> **Note**: Validates reset OTP and grants a temporary 10-minute reset token in Redis.

---

### 10. Reset Password with Confirmed Credentials (Success)

- **Endpoint**: `POST /api/auth/reset-password`
- **Expected Status**: `200`
- **Request Body**:

```json
{
  "email": "test_user_1788085620185_57929@example.com",
  "otp": "654321",
  "password": "BrandNewPassword@999",
  "confirmPassword": "BrandNewPassword@999"
}
```

- **Response Body**:

```json
{
  "message": "Password reset successful.",
  "success": true,
  "error": null
}
```

> **Note**: Updates user password hash and invalidates active session cache.

---

### 11. Request Account Recovery OTP (Success)

- **Endpoint**: `POST /api/auth/recover-account/request`
- **Expected Status**: `200`
- **Request Body**:

```json
{
  "email": "test_user_1788085625089_27912@example.com"
}
```

- **Response Body**:

```json
{
  "message": "OTP sent to the registered email. Please check your inbox.",
  "success": true,
  "error": null
}
```

> **Note**: Sends recovery OTP to restore a soft-deleted account within the 15-day grace window.

---

### 12. Verify Account Recovery OTP & Restore (Success)

- **Endpoint**: `POST /api/auth/recover-account/verify`
- **Expected Status**: `200`
- **Request Body**:

```json
{
  "email": "test_user_1788085625089_27912@example.com",
  "otp": "112233"
}
```

- **Response Body**:

```json
{
  "message": "Account recovered successfully! You can now login.",
  "success": true,
  "error": null
}
```

> **Note**: Restores user account state (isDeleted: false, isActive: true) and sends confirmation email.

---

### 13. Get Current Authenticated User (Success)

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
    "id": "643b29a0-abc1-41dd-8e0f-c2a6f8cfa477",
    "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
    "firstName": "Test",
    "lastName": "User",
    "email": "test_user_1788085629948_49257@example.com",
    "role": "employee",
    "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg",
    "isActive": true,
    "emailVerified": true,
    "mustChangePassword": false,
    "createdAt": "2026-08-30T10:27:10.100Z",
    "updatedAt": "2026-08-30T10:27:10.100Z"
  },
  "data": {
    "user": {
      "id": "643b29a0-abc1-41dd-8e0f-c2a6f8cfa477",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "firstName": "Test",
      "lastName": "User",
      "email": "test_user_1788085629948_49257@example.com",
      "role": "employee",
      "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg",
      "isActive": true,
      "emailVerified": true,
      "mustChangePassword": false,
      "createdAt": "2026-08-30T10:27:10.100Z",
      "updatedAt": "2026-08-30T10:27:10.100Z"
    }
  }
}
```

> **Note**: Retrieves active session details and mustChangePassword flag.

---

### 14. Get Current User (Unauthenticated)

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

### 15. Get Roles Matrix (Success)

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

### 16. Get Permissions Matrix (Success)

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
        "profile": ["read-all", "update-all", "private-info", "salary-info"],
        "attendance": ["check-in", "check-out", "read-all", "adjust-all", "correct-record"],
        "leave": ["view-all", "approve", "reject", "configure-types", "allocate"],
        "salary": ["view-all", "configure-structures", "manage-components"],
        "payroll": [
          "run-payroll",
          "calculate",
          "finalize",
          "download-all-payslips",
          "recalculate",
          "lock"
        ],
        "company": ["manage-settings", "work-schedules", "leave-policies", "payroll-config"],
        "audit": ["view-all-logs", "view-stats"],
        "notifications": ["broadcast", "read-all"]
      },
      "hr": {
        "employees": ["create", "read", "update", "activate", "deactivate", "reset-password"],
        "profile": ["read-all", "update-profile"],
        "attendance": ["check-in", "check-out", "read-all", "adjust-all"],
        "leave": ["view-all", "approve", "reject", "allocate"],
        "salary": ["view-structures"],
        "payroll": ["process-periods", "view-payslips"],
        "company": ["view-settings", "work-schedules"],
        "audit": ["view-all-logs"],
        "notifications": ["broadcast"]
      },
      "employee": {
        "employees": ["read-directory"],
        "profile": ["read-self", "update-self-limited", "upload-avatar"],
        "attendance": ["check-in", "check-out", "read-self", "request-adjustment"],
        "leave": ["read-self-balances", "apply-leave", "cancel-self-request"],
        "salary": ["read-self-payslips"],
        "payroll": ["view-self-payslip", "download-self-payslip"],
        "company": ["view-basic"],
        "audit": [],
        "notifications": ["read-self"]
      }
    },
    "currentRole": "employee"
  }
}
```

> **Note**: Returns permissions hierarchy for the current user role.

---

### 17. Change Password (Success)

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

### 18. Logout User (Success)

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

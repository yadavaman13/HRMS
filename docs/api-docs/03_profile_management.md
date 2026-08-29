# Feature 03: Employee Profile Management API

> Covers self-service profile inspection, private information, bank details, and field write restrictions.

## 📋 Endpoints Overview

| Method | Endpoint | Scenario | Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/profile/me` | Get My Profile (Self-Service) | `200` |
| `PATCH` | `/api/profile/me` | Update My Profile (Success) | `200` |
| `PATCH` | `/api/profile/me` | Update Profile with Restricted Fields (Forbidden) | `403` |
| `GET` | `/api/profile/me/private-info` | Get Private Info (Self-Service) | `200` |
| `PATCH` | `/api/profile/me/private-info` | Update Private Info (Success) | `200` |

---

## 🔍 Detailed Scenarios & Outputs

### 1. Get My Profile (Self-Service)

- **Endpoint**: `GET /api/profile/me`
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
  "message": "My profile retrieved successfully.",
  "success": true,
  "error": null,
  "data": {
    "header": {
      "id": "b6f49d8a-d1f7-4207-9d84-eff800ea105f",
      "employeeCode": "TESTBOJO20260021",
      "firstName": "Bob",
      "lastName": "Johnson",
      "displayName": "Bob Johnson",
      "phone": "9888877770",
      "workEmail": "bob.johnson4@testorg.dayflow.com",
      "userEmail": "bob.johnson4@testorg.dayflow.com",
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

> **Note**: Returns current employee work details, contact info, and skills resume.

---

### 2. Update My Profile (Success)

- **Endpoint**: `PATCH /api/profile/me`
- **Expected Status**: `200`
- **Headers**:
```json
{
  "Cookie": "token=JWT_EMPLOYEE_TOKEN"
}
```
- **Request Body**:
```json
{
  "phone": "9999911111"
}
```
- **Response Body**:
```json
{
  "message": "Profile updated successfully",
  "success": true,
  "error": null,
  "data": {
    "employee": {
      "id": "b6f49d8a-d1f7-4207-9d84-eff800ea105f",
      "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
      "employeeCode": "TESTBOJO20260021",
      "firstName": "Bob",
      "middleName": null,
      "lastName": "Johnson",
      "displayName": "Bob Johnson",
      "dateOfBirth": null,
      "gender": null,
      "phone": "9999911111",
      "workEmail": "bob.johnson4@testorg.dayflow.com",
      "departmentId": null,
      "jobPositionId": null,
      "managerId": null,
      "locationId": null,
      "joiningDate": "2026-08-01",
      "terminationDate": null,
      "employmentStatus": "active",
      "employmentType": "full_time",
      "userId": "a54f95b7-7411-4d24-ac14-df871ba90fb6",
      "createdAt": "2026-08-29T10:06:03.639Z",
      "updatedAt": "2026-08-29T10:06:14.701Z"
    }
  }
}
```

> **Note**: Allows employees to edit self-service contact fields.

---

### 3. Update Profile with Restricted Fields (Forbidden)

- **Endpoint**: `PATCH /api/profile/me`
- **Expected Status**: `403`
- **Headers**:
```json
{
  "Cookie": "token=JWT_EMPLOYEE_TOKEN"
}
```
- **Request Body**:
```json
{
  "departmentId": "00000000-0000-0000-0000-000000000000"
}
```
- **Response Body**:
```json
{
  "message": "Access denied: You do not have permission to modify employment-related fields",
  "success": false,
  "error": null
}
```

> **Note**: Blocks unauthorized edits to department, salary, and employment records.

---

### 4. Get Private Info (Self-Service)

- **Endpoint**: `GET /api/profile/me/private-info`
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
  "message": "My private information retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "residentialAddress": null,
    "personalEmail": "bob_1787997961684@personal.com",
    "nationality": null,
    "maritalStatus": null,
    "emergencyContactName": null,
    "emergencyContactPhone": null,
    "bankAccounts": [],
    "pan": null,
    "uan": null,
    "aadhaar": null
  }
}
```

> **Note**: Retrieves residential address, emergency contact, and masked bank accounts.

---

### 5. Update Private Info (Success)

- **Endpoint**: `PATCH /api/profile/me/private-info`
- **Expected Status**: `200`
- **Headers**:
```json
{
  "Cookie": "token=JWT_EMPLOYEE_TOKEN"
}
```
- **Request Body**:
```json
{
  "residentialAddress": "123 Tech Park Road, Bengaluru",
  "emergencyContactName": "Jane Johnson",
  "emergencyContactPhone": "9888877771"
}
```
- **Response Body**:
```json
{
  "message": "My private information updated successfully",
  "success": true,
  "error": null,
  "data": {
    "employeeId": "b6f49d8a-d1f7-4207-9d84-eff800ea105f",
    "residentialAddress": "123 Tech Park Road, Bengaluru",
    "personalEmail": null,
    "nationality": null,
    "maritalStatus": null,
    "emergencyContactName": "Jane Johnson",
    "emergencyContactPhone": "9888877771",
    "createdAt": "2026-08-29T10:06:21.163Z",
    "updatedAt": "2026-08-29T10:06:21.163Z"
  }
}
```

> **Note**: Updates personal address and emergency contact data.

---


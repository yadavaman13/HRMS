# Feature 09: Company & HR Configuration API

> Covers company profile, branch locations, departments, job positions, work schedules, and holiday calendars.

## 📋 Endpoints Overview

| Method | Endpoint                                                            | Scenario                           | Status |
| :----- | :------------------------------------------------------------------ | :--------------------------------- | :----- |
| `GET`  | `/api/companies/my`                                                 | Get Company Details (Success)      | `200`  |
| `POST` | `/api/companies/60e50682-c7d3-45ff-9fca-34951308c63a/departments`   | Create Company Department (Admin)  | `201`  |
| `GET`  | `/api/companies/60e50682-c7d3-45ff-9fca-34951308c63a/departments`   | List Company Departments (Success) | `200`  |
| `POST` | `/api/companies/60e50682-c7d3-45ff-9fca-34951308c63a/job-positions` | Create Job Position (Admin)        | `201`  |
| `POST` | `/api/companies/60e50682-c7d3-45ff-9fca-34951308c63a/holidays`      | Create Company Holiday (Admin)     | `201`  |

---

## 🔍 Detailed Scenarios & Outputs

### 1. Get Company Details (Success)

- **Endpoint**: `GET /api/companies/my`
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
  "message": "Company details retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "company": {
      "id": "60e50682-c7d3-45ff-9fca-34951308c63a",
      "name": "Test Organization",
      "code": "TESTORG",
      "logoUrl": null,
      "email": "admin@testorg.com",
      "phone": null,
      "address": null,
      "city": null,
      "state": null,
      "country": "India",
      "postalCode": null,
      "timezone": "Asia/Kolkata",
      "currency": "INR",
      "isActive": true,
      "createdAt": "2026-08-29T09:18:41.623Z",
      "updatedAt": "2026-08-29T09:18:41.623Z"
    }
  }
}
```

> **Note**: Retrieves current company profile, address, and localized settings.

---

### 2. Create Company Department (Admin)

- **Endpoint**: `POST /api/companies/60e50682-c7d3-45ff-9fca-34951308c63a/departments`
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
  "name": "Engineering 1787998111214",
  "code": "ENG_1787998111214"
}
```

- **Response Body**:

```json
{
  "message": "Department created successfully",
  "success": true,
  "error": null,
  "data": {
    "department": {
      "id": "0cd92bf0-da5d-4c69-a6dd-1bdb4c4fd4c6",
      "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
      "name": "Engineering 1787998111214",
      "code": "ENG_1787998111214",
      "managerEmployeeId": null,
      "isActive": true,
      "createdAt": "2026-08-29T10:08:32.343Z",
      "updatedAt": "2026-08-29T10:08:32.343Z"
    }
  }
}
```

> **Note**: Adds department organizational unit.

---

### 3. List Company Departments (Success)

- **Endpoint**: `GET /api/companies/60e50682-c7d3-45ff-9fca-34951308c63a/departments`
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
  "message": "Departments retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "departments": [
      {
        "id": "f094e735-bfd0-416f-b861-06d19fdcde32",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "name": "Engineering 1787995274781",
        "code": "ENG_1787995274781",
        "managerEmployeeId": null,
        "isActive": true,
        "createdAt": "2026-08-29T09:21:15.866Z",
        "updatedAt": "2026-08-29T09:21:15.866Z",
        "manager": null
      },
      {
        "id": "282fdfd2-b8cb-4c34-be62-8773ea17d1bc",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "name": "Engineering 1787995797181",
        "code": "ENG_1787995797181",
        "managerEmployeeId": null,
        "isActive": true,
        "createdAt": "2026-08-29T09:29:58.268Z",
        "updatedAt": "2026-08-29T09:29:58.268Z",
        "manager": null
      },
      {
        "id": "9bff2d77-1ce7-4aeb-8166-56e663e97131",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "name": "Engineering 1787997490949",
        "code": "ENG_1787997490949",
        "managerEmployeeId": null,
        "isActive": true,
        "createdAt": "2026-08-29T09:58:13.850Z",
        "updatedAt": "2026-08-29T09:58:13.850Z",
        "manager": null
      },
      {
        "id": "0cd92bf0-da5d-4c69-a6dd-1bdb4c4fd4c6",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "name": "Engineering 1787998111214",
        "code": "ENG_1787998111214",
        "managerEmployeeId": null,
        "isActive": true,
        "createdAt": "2026-08-29T10:08:32.343Z",
        "updatedAt": "2026-08-29T10:08:32.343Z",
        "manager": null
      }
    ]
  }
}
```

> **Note**: Retrieves department hierarchy for employee assignments.

---

### 4. Create Job Position (Admin)

- **Endpoint**: `POST /api/companies/60e50682-c7d3-45ff-9fca-34951308c63a/job-positions`
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
  "name": "Senior Fullstack Developer 1787998113762",
  "code": "DEV_1787998113762"
}
```

- **Response Body**:

```json
{
  "message": "Job position created successfully",
  "success": true,
  "error": null,
  "data": {
    "jobPosition": {
      "id": "5bebc569-1fbb-48b0-b7de-4e1d696c4e2b",
      "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
      "name": "Senior Fullstack Developer 1787998113762",
      "description": null,
      "isActive": true,
      "createdAt": "2026-08-29T10:08:34.888Z",
      "updatedAt": "2026-08-29T10:08:34.888Z"
    }
  }
}
```

> **Note**: Adds job position designation.

---

### 5. Create Company Holiday (Admin)

- **Endpoint**: `POST /api/companies/60e50682-c7d3-45ff-9fca-34951308c63a/holidays`
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
  "name": "Company Foundation Day 1787998115103",
  "holidayDate": "2034-10-15",
  "isRecurring": false
}
```

- **Response Body**:

```json
{
  "message": "Holiday created successfully",
  "success": true,
  "error": null,
  "data": {
    "holiday": {
      "id": "cb1aec24-cb25-4a1b-a183-8715c8c9ad7d",
      "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
      "name": "Company Foundation Day 1787998115103",
      "holidayDate": "2034-10-15",
      "isOptional": false,
      "description": null,
      "createdAt": "2026-08-29T10:08:36.328Z"
    }
  }
}
```

> **Note**: Registers official company holiday in attendance & payroll calendars.

---

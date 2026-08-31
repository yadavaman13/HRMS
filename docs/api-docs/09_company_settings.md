# Feature 09: Company & HR Configuration API

> Covers company profile, logo branding, branch locations, departments, job positions, work schedules, and holiday calendars.

## 📋 Endpoints Overview

| Method   | Endpoint                                                            | Scenario                             | Status |
| :------- | :------------------------------------------------------------------ | :----------------------------------- | :----- |
| `GET`    | `/api/companies/my`                                                 | Get Company Details (Success)        | `200`  |
| `GET`    | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1`               | Get Company by ID (Success)          | `200`  |
| `PATCH`  | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1`               | Update Company Profile (Admin)       | `200`  |
| `POST`   | `/api/company/logo`                                                 | Upload Company Logo Branding (Admin) | `200`  |
| `POST`   | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/locations`     | Create Location (Admin)              | `201`  |
| `GET`    | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/locations`     | List Company Locations (Success)     | `200`  |
| `PATCH`  | `/api/companies/locations/66f80cf9-9c58-4372-9923-8a2fb440e41e`     | Update Location (Admin)              | `200`  |
| `DELETE` | `/api/companies/locations/66f80cf9-9c58-4372-9923-8a2fb440e41e`     | Delete Location (Admin)              | `200`  |
| `POST`   | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/departments`   | Create Company Department (Admin)    | `201`  |
| `GET`    | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/departments`   | List Company Departments (Success)   | `200`  |
| `PATCH`  | `/api/companies/departments/81fb5288-bffa-4750-83bd-e04e15a0eec3`   | Update Department (Admin)            | `200`  |
| `DELETE` | `/api/companies/departments/81fb5288-bffa-4750-83bd-e04e15a0eec3`   | Delete Department (Admin)            | `200`  |
| `POST`   | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/job-positions` | Create Job Position (Admin)          | `201`  |
| `GET`    | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/job-positions` | List Job Positions (Success)         | `200`  |
| `PATCH`  | `/api/companies/job-positions/6a7ed851-799e-449d-a839-a22323c7b373` | Update Job Position (Admin)          | `200`  |
| `DELETE` | `/api/companies/job-positions/6a7ed851-799e-449d-a839-a22323c7b373` | Delete Job Position (Admin)          | `200`  |
| `POST`   | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/schedules`     | Create Work Schedule (Admin)         | `201`  |
| `GET`    | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/schedules`     | List Work Schedules (Success)        | `200`  |
| `GET`    | `/api/companies/schedules/4cadd136-8d2c-44c5-9086-ab8076f963b3`     | Get Work Schedule by ID (Success)    | `200`  |
| `PATCH`  | `/api/companies/schedules/4cadd136-8d2c-44c5-9086-ab8076f963b3`     | Update Work Schedule (Admin)         | `200`  |
| `DELETE` | `/api/companies/schedules/4cadd136-8d2c-44c5-9086-ab8076f963b3`     | Delete Work Schedule (Admin)         | `200`  |
| `POST`   | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/holidays`      | Create Company Holiday (Admin)       | `201`  |
| `GET`    | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/holidays`      | List Company Holidays (Success)      | `200`  |
| `DELETE` | `/api/companies/holidays/ab3b377b-4289-4252-83b3-19c53d249554`      | Delete Company Holiday (Admin)       | `200`  |

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
      "id": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Test Organization",
      "code": "TESTORG",
      "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_GgSQOsOiVS.png",
      "email": "admin@testorg.com",
      "phone": null,
      "address": null,
      "city": "Bengaluru",
      "state": "Karnataka",
      "country": "India",
      "postalCode": null,
      "timezone": "Asia/Kolkata",
      "currency": "INR",
      "isActive": true,
      "createdAt": "2026-08-30T09:34:04.865Z",
      "updatedAt": "2026-08-30T16:35:32.769Z"
    }
  }
}
```

> **Note**: Retrieves current company profile, address, and localized settings.

---

### 2. Get Company by ID (Success)

- **Endpoint**: `GET /api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1`
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
      "id": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Test Organization",
      "code": "TESTORG",
      "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_GgSQOsOiVS.png",
      "email": "admin@testorg.com",
      "phone": null,
      "address": null,
      "city": "Bengaluru",
      "state": "Karnataka",
      "country": "India",
      "postalCode": null,
      "timezone": "Asia/Kolkata",
      "currency": "INR",
      "isActive": true,
      "createdAt": "2026-08-30T09:34:04.865Z",
      "updatedAt": "2026-08-30T16:35:32.769Z"
    }
  }
}
```

> **Note**: Retrieves company master configuration by ID.

---

### 3. Update Company Profile (Admin)

- **Endpoint**: `PATCH /api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1`
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
  "city": "Bengaluru",
  "state": "Karnataka",
  "country": "India",
  "timezone": "Asia/Kolkata"
}
```

- **Response Body**:

```json
{
  "message": "Company details updated successfully",
  "success": true,
  "error": null,
  "data": {
    "company": {
      "id": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Test Organization",
      "code": "TESTORG",
      "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_GgSQOsOiVS.png",
      "email": "admin@testorg.com",
      "phone": null,
      "address": null,
      "city": "Bengaluru",
      "state": "Karnataka",
      "country": "India",
      "postalCode": null,
      "timezone": "Asia/Kolkata",
      "currency": "INR",
      "isActive": true,
      "createdAt": "2026-08-30T09:34:04.865Z",
      "updatedAt": "2026-08-30T17:24:35.333Z"
    }
  }
}
```

> **Note**: Updates organization profile, address, and localized timezone/currency.

---

### 4. Upload Company Logo Branding (Admin)

- **Endpoint**: `POST /api/company/logo`
- **Expected Status**: `200`
- **Headers**:

```json
{
  "Cookie": "token=JWT_ADMIN_TOKEN",
  "Content-Type": "multipart/form-data"
}
```

- **Request Body**:

```json
{
  "logo": "(binary image buffer)"
}
```

- **Response Body**:

```json
{
  "message": "Company logo uploaded successfully",
  "success": true,
  "error": null,
  "data": {
    "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_VIcNMWCd3.png",
    "company": {
      "id": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Test Organization",
      "code": "TESTORG",
      "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_VIcNMWCd3.png",
      "email": "admin@testorg.com",
      "phone": null,
      "address": null,
      "city": "Bengaluru",
      "state": "Karnataka",
      "country": "India",
      "postalCode": null,
      "timezone": "Asia/Kolkata",
      "currency": "INR",
      "isActive": true,
      "createdAt": "2026-08-30T09:34:04.865Z",
      "updatedAt": "2026-08-30T17:24:37.868Z"
    }
  }
}
```

> **Note**: Uploads and updates organization brand logo.

---

### 5. Create Location (Admin)

- **Endpoint**: `POST /api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/locations`
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
  "name": "Bengaluru HQ 1788110678387",
  "city": "Bengaluru",
  "country": "India",
  "isHeadquarters": true
}
```

- **Response Body**:

```json
{
  "message": "Location created successfully",
  "success": true,
  "error": null,
  "data": {
    "location": {
      "id": "66f80cf9-9c58-4372-9923-8a2fb440e41e",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Bengaluru HQ 1788110678387",
      "address": null,
      "isActive": true,
      "createdAt": "2026-08-30T17:24:38.928Z",
      "updatedAt": "2026-08-30T17:24:38.928Z"
    }
  }
}
```

> **Note**: Registers new office branch or office building.

---

### 6. List Company Locations (Success)

- **Endpoint**: `GET /api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/locations`
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
  "message": "Locations retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "locations": [
      {
        "id": "66f80cf9-9c58-4372-9923-8a2fb440e41e",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "name": "Bengaluru HQ 1788110678387",
        "address": null,
        "isActive": true,
        "createdAt": "2026-08-30T17:24:38.928Z",
        "updatedAt": "2026-08-30T17:24:38.928Z"
      }
    ]
  }
}
```

> **Note**: Retrieves branch locations for organizational work schedules.

---

### 7. Update Location (Admin)

- **Endpoint**: `PATCH /api/companies/locations/66f80cf9-9c58-4372-9923-8a2fb440e41e`
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
  "city": "Bengaluru Tech Park"
}
```

- **Response Body**:

```json
{
  "message": "Location updated successfully",
  "success": true,
  "error": null,
  "data": {
    "location": {
      "id": "66f80cf9-9c58-4372-9923-8a2fb440e41e",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Bengaluru HQ 1788110678387",
      "address": "Bengaluru Tech Park",
      "isActive": true,
      "createdAt": "2026-08-30T17:24:38.928Z",
      "updatedAt": "2026-08-30T17:24:40.963Z"
    }
  }
}
```

> **Note**: Updates branch address and details.

---

### 8. Delete Location (Admin)

- **Endpoint**: `DELETE /api/companies/locations/66f80cf9-9c58-4372-9923-8a2fb440e41e`
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
  "message": "Location deleted successfully",
  "success": true,
  "error": null,
  "data": {
    "location": {
      "id": "66f80cf9-9c58-4372-9923-8a2fb440e41e",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Bengaluru HQ 1788110678387",
      "address": "Bengaluru Tech Park",
      "isActive": false,
      "createdAt": "2026-08-30T17:24:38.928Z",
      "updatedAt": "2026-08-30T17:24:42.073Z"
    }
  }
}
```

> **Note**: Removes location from company directory.

---

### 9. Create Company Department (Admin)

- **Endpoint**: `POST /api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/departments`
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
  "name": "Engineering 1788110682564",
  "code": "ENG_1788110682564"
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
      "id": "81fb5288-bffa-4750-83bd-e04e15a0eec3",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Engineering 1788110682564",
      "code": "ENG_1788110682564",
      "managerEmployeeId": null,
      "isActive": true,
      "createdAt": "2026-08-30T17:24:43.043Z",
      "updatedAt": "2026-08-30T17:24:43.043Z"
    }
  }
}
```

> **Note**: Adds department organizational unit.

---

### 10. List Company Departments (Success)

- **Endpoint**: `GET /api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/departments`
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
        "id": "81fb5288-bffa-4750-83bd-e04e15a0eec3",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "name": "Engineering 1788110682564",
        "code": "ENG_1788110682564",
        "managerEmployeeId": null,
        "isActive": true,
        "createdAt": "2026-08-30T17:24:43.043Z",
        "updatedAt": "2026-08-30T17:24:43.043Z",
        "manager": null
      }
    ]
  }
}
```

> **Note**: Retrieves department hierarchy for employee assignments.

---

### 11. Update Department (Admin)

- **Endpoint**: `PATCH /api/companies/departments/81fb5288-bffa-4750-83bd-e04e15a0eec3`
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
  "name": "Software Engineering & AI"
}
```

- **Response Body**:

```json
{
  "message": "Department updated successfully",
  "success": true,
  "error": null,
  "data": {
    "department": {
      "id": "81fb5288-bffa-4750-83bd-e04e15a0eec3",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Software Engineering & AI",
      "code": "ENG_1788110682564",
      "managerEmployeeId": null,
      "isActive": true,
      "createdAt": "2026-08-30T17:24:43.043Z",
      "updatedAt": "2026-08-30T17:24:45.092Z"
    }
  }
}
```

> **Note**: Modifies department name and parent reporting structure.

---

### 12. Delete Department (Admin)

- **Endpoint**: `DELETE /api/companies/departments/81fb5288-bffa-4750-83bd-e04e15a0eec3`
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
  "message": "Department deleted successfully",
  "success": true,
  "error": null,
  "data": {
    "department": {
      "id": "81fb5288-bffa-4750-83bd-e04e15a0eec3",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Software Engineering & AI",
      "code": "ENG_1788110682564",
      "managerEmployeeId": null,
      "isActive": false,
      "createdAt": "2026-08-30T17:24:43.043Z",
      "updatedAt": "2026-08-30T17:24:46.193Z"
    }
  }
}
```

> **Note**: Removes department from organizational directory.

---

### 13. Create Job Position (Admin)

- **Endpoint**: `POST /api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/job-positions`
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
  "name": "Senior Fullstack Developer 1788110686660",
  "code": "DEV_1788110686660"
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
      "id": "6a7ed851-799e-449d-a839-a22323c7b373",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Senior Fullstack Developer 1788110686660",
      "description": null,
      "isActive": true,
      "createdAt": "2026-08-30T17:24:47.128Z",
      "updatedAt": "2026-08-30T17:24:47.128Z"
    }
  }
}
```

> **Note**: Adds job position designation.

---

### 14. List Job Positions (Success)

- **Endpoint**: `GET /api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/job-positions`
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
  "message": "Job positions retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "jobPositions": [
      {
        "id": "6a7ed851-799e-449d-a839-a22323c7b373",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "name": "Senior Fullstack Developer 1788110686660",
        "description": null,
        "isActive": true,
        "createdAt": "2026-08-30T17:24:47.128Z",
        "updatedAt": "2026-08-30T17:24:47.128Z"
      }
    ]
  }
}
```

> **Note**: Lists all defined organizational designations.

---

### 15. Update Job Position (Admin)

- **Endpoint**: `PATCH /api/companies/job-positions/6a7ed851-799e-449d-a839-a22323c7b373`
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
  "name": "Lead Fullstack Developer"
}
```

- **Response Body**:

```json
{
  "message": "Job position updated successfully",
  "success": true,
  "error": null,
  "data": {
    "jobPosition": {
      "id": "6a7ed851-799e-449d-a839-a22323c7b373",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Lead Fullstack Developer",
      "description": null,
      "isActive": true,
      "createdAt": "2026-08-30T17:24:47.128Z",
      "updatedAt": "2026-08-30T17:24:49.053Z"
    }
  }
}
```

> **Note**: Modifies job title and requirements.

---

### 16. Delete Job Position (Admin)

- **Endpoint**: `DELETE /api/companies/job-positions/6a7ed851-799e-449d-a839-a22323c7b373`
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
  "message": "Job position deleted successfully",
  "success": true,
  "error": null,
  "data": {
    "jobPosition": {
      "id": "6a7ed851-799e-449d-a839-a22323c7b373",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Lead Fullstack Developer",
      "description": null,
      "isActive": false,
      "createdAt": "2026-08-30T17:24:47.128Z",
      "updatedAt": "2026-08-30T17:24:50.153Z"
    }
  }
}
```

> **Note**: Soft deletes job position designation.

---

### 17. Create Work Schedule (Admin)

- **Endpoint**: `POST /api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/schedules`
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
  "name": "Standard Day Shift 1788110690657",
  "hoursPerWeek": 40,
  "daysPerWeek": 5
}
```

- **Response Body**:

```json
{
  "message": "Work schedule created successfully",
  "success": true,
  "error": null,
  "data": {
    "schedule": {
      "id": "4cadd136-8d2c-44c5-9086-ab8076f963b3",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Standard Day Shift 1788110690657",
      "timezone": "Asia/Kolkata",
      "isActive": true,
      "defaultBreakMinutes": 60,
      "createdAt": "2026-08-30T17:24:51.167Z",
      "updatedAt": "2026-08-30T17:24:51.167Z",
      "days": []
    }
  }
}
```

> **Note**: Defines standard working hours and weekly schedule.

---

### 18. List Work Schedules (Success)

- **Endpoint**: `GET /api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/schedules`
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
  "message": "Work schedules retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "schedules": [
      {
        "id": "4cadd136-8d2c-44c5-9086-ab8076f963b3",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "name": "Standard Day Shift 1788110690657",
        "timezone": "Asia/Kolkata",
        "isActive": true,
        "defaultBreakMinutes": 60,
        "createdAt": "2026-08-30T17:24:51.167Z",
        "updatedAt": "2026-08-30T17:24:51.167Z",
        "days": []
      }
    ]
  }
}
```

> **Note**: Lists active work schedules and shifts.

---

### 19. Get Work Schedule by ID (Success)

- **Endpoint**: `GET /api/companies/schedules/4cadd136-8d2c-44c5-9086-ab8076f963b3`
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
  "message": "Work schedule details retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "schedule": {
      "id": "4cadd136-8d2c-44c5-9086-ab8076f963b3",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Standard Day Shift 1788110690657",
      "timezone": "Asia/Kolkata",
      "isActive": true,
      "defaultBreakMinutes": 60,
      "createdAt": "2026-08-30T17:24:51.167Z",
      "updatedAt": "2026-08-30T17:24:51.167Z",
      "days": []
    }
  }
}
```

> **Note**: Retrieves work schedule parameters and timing details.

---

### 20. Update Work Schedule (Admin)

- **Endpoint**: `PATCH /api/companies/schedules/4cadd136-8d2c-44c5-9086-ab8076f963b3`
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
  "name": "Flexible Day Shift",
  "hoursPerWeek": 42
}
```

- **Response Body**:

```json
{
  "message": "Work schedule updated successfully",
  "success": true,
  "error": null,
  "data": {
    "schedule": {
      "id": "4cadd136-8d2c-44c5-9086-ab8076f963b3",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Flexible Day Shift",
      "timezone": "Asia/Kolkata",
      "isActive": true,
      "defaultBreakMinutes": 60,
      "createdAt": "2026-08-30T17:24:51.167Z",
      "updatedAt": "2026-08-30T17:24:55.907Z",
      "days": []
    }
  }
}
```

> **Note**: Modifies weekly expected work hours.

---

### 21. Delete Work Schedule (Admin)

- **Endpoint**: `DELETE /api/companies/schedules/4cadd136-8d2c-44c5-9086-ab8076f963b3`
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
  "message": "Work schedule deleted successfully",
  "success": true,
  "error": null,
  "data": {
    "schedule": {
      "id": "4cadd136-8d2c-44c5-9086-ab8076f963b3",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Flexible Day Shift",
      "timezone": "Asia/Kolkata",
      "isActive": false,
      "defaultBreakMinutes": 60,
      "createdAt": "2026-08-30T17:24:51.167Z",
      "updatedAt": "2026-08-30T17:24:58.353Z"
    }
  }
}
```

> **Note**: Removes work schedule definition.

---

### 22. Create Company Holiday (Admin)

- **Endpoint**: `POST /api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/holidays`
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
  "name": "Company Foundation Day 1788110699240",
  "holidayDate": "2036-10-17",
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
      "id": "ab3b377b-4289-4252-83b3-19c53d249554",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Company Foundation Day 1788110699240",
      "holidayDate": "2036-10-17",
      "isOptional": false,
      "description": null,
      "createdAt": "2026-08-30T17:24:59.778Z"
    }
  }
}
```

> **Note**: Registers official company holiday in attendance & payroll calendars.

---

### 23. List Company Holidays (Success)

- **Endpoint**: `GET /api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/holidays`
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
  "message": "Holidays retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "holidays": [
      {
        "id": "ab3b377b-4289-4252-83b3-19c53d249554",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "name": "Company Foundation Day 1788110699240",
        "holidayDate": "2036-10-17",
        "isOptional": false,
        "description": null,
        "createdAt": "2026-08-30T17:24:59.778Z"
      }
    ]
  }
}
```

> **Note**: Retrieves holiday calendar for current organizational year.

---

### 24. Delete Company Holiday (Admin)

- **Endpoint**: `DELETE /api/companies/holidays/ab3b377b-4289-4252-83b3-19c53d249554`
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
  "message": "Holiday deleted successfully",
  "success": true,
  "error": null,
  "data": {
    "holiday": {
      "id": "ab3b377b-4289-4252-83b3-19c53d249554",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Company Foundation Day 1788110699240",
      "holidayDate": "2036-10-17",
      "isOptional": false,
      "description": null,
      "createdAt": "2026-08-30T17:24:59.778Z"
    }
  }
}
```

> **Note**: Removes holiday from company holiday calendar.

---

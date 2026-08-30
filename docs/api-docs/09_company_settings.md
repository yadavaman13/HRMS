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
| `PATCH`  | `/api/companies/locations/cae15271-b0b7-4d5d-afb4-68910a0ee1f5`     | Update Location (Admin)              | `200`  |
| `DELETE` | `/api/companies/locations/cae15271-b0b7-4d5d-afb4-68910a0ee1f5`     | Delete Location (Admin)              | `200`  |
| `POST`   | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/departments`   | Create Company Department (Admin)    | `201`  |
| `GET`    | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/departments`   | List Company Departments (Success)   | `200`  |
| `PATCH`  | `/api/companies/departments/4b4f1864-0194-46cf-b374-01dd66f3b898`   | Update Department (Admin)            | `200`  |
| `DELETE` | `/api/companies/departments/4b4f1864-0194-46cf-b374-01dd66f3b898`   | Delete Department (Admin)            | `200`  |
| `POST`   | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/job-positions` | Create Job Position (Admin)          | `201`  |
| `GET`    | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/job-positions` | List Job Positions (Success)         | `200`  |
| `PATCH`  | `/api/companies/job-positions/df66c097-13bc-4438-af12-98cbad5a3fa4` | Update Job Position (Admin)          | `200`  |
| `DELETE` | `/api/companies/job-positions/df66c097-13bc-4438-af12-98cbad5a3fa4` | Delete Job Position (Admin)          | `200`  |
| `POST`   | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/schedules`     | Create Work Schedule (Admin)         | `201`  |
| `GET`    | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/schedules`     | List Work Schedules (Success)        | `200`  |
| `GET`    | `/api/companies/schedules/0b52d735-3187-49b9-a7ea-50f53dbda4f5`     | Get Work Schedule by ID (Success)    | `200`  |
| `PATCH`  | `/api/companies/schedules/0b52d735-3187-49b9-a7ea-50f53dbda4f5`     | Update Work Schedule (Admin)         | `200`  |
| `DELETE` | `/api/companies/schedules/0b52d735-3187-49b9-a7ea-50f53dbda4f5`     | Delete Work Schedule (Admin)         | `200`  |
| `POST`   | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/holidays`      | Create Company Holiday (Admin)       | `201`  |
| `GET`    | `/api/companies/144f96a2-86b3-422d-88b1-9fd2a825e9e1/holidays`      | List Company Holidays (Success)      | `200`  |
| `DELETE` | `/api/companies/holidays/028ef869-3d81-4c9d-a2b1-94ac04f30fd7`      | Delete Company Holiday (Admin)       | `200`  |

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
      "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_98ynM9TKk.png",
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
      "updatedAt": "2026-08-30T10:26:15.310Z"
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
      "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_98ynM9TKk.png",
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
      "updatedAt": "2026-08-30T10:26:15.310Z"
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
      "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_98ynM9TKk.png",
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
      "updatedAt": "2026-08-30T10:31:20.032Z"
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
    "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_h4btUztok.png",
    "company": {
      "id": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Test Organization",
      "code": "TESTORG",
      "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_h4btUztok.png",
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
      "updatedAt": "2026-08-30T10:31:22.682Z"
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
  "name": "Bengaluru HQ 1788085883176",
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
      "id": "cae15271-b0b7-4d5d-afb4-68910a0ee1f5",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Bengaluru HQ 1788085883176",
      "address": null,
      "isActive": true,
      "createdAt": "2026-08-30T10:31:23.682Z",
      "updatedAt": "2026-08-30T10:31:23.682Z"
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
        "id": "cae15271-b0b7-4d5d-afb4-68910a0ee1f5",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "name": "Bengaluru HQ 1788085883176",
        "address": null,
        "isActive": true,
        "createdAt": "2026-08-30T10:31:23.682Z",
        "updatedAt": "2026-08-30T10:31:23.682Z"
      }
    ]
  }
}
```

> **Note**: Retrieves branch locations for organizational work schedules.

---

### 7. Update Location (Admin)

- **Endpoint**: `PATCH /api/companies/locations/cae15271-b0b7-4d5d-afb4-68910a0ee1f5`
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
      "id": "cae15271-b0b7-4d5d-afb4-68910a0ee1f5",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Bengaluru HQ 1788085883176",
      "address": "Bengaluru Tech Park",
      "isActive": true,
      "createdAt": "2026-08-30T10:31:23.682Z",
      "updatedAt": "2026-08-30T10:31:26.032Z"
    }
  }
}
```

> **Note**: Updates branch address and details.

---

### 8. Delete Location (Admin)

- **Endpoint**: `DELETE /api/companies/locations/cae15271-b0b7-4d5d-afb4-68910a0ee1f5`
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
      "id": "cae15271-b0b7-4d5d-afb4-68910a0ee1f5",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Bengaluru HQ 1788085883176",
      "address": "Bengaluru Tech Park",
      "isActive": false,
      "createdAt": "2026-08-30T10:31:23.682Z",
      "updatedAt": "2026-08-30T10:31:27.182Z"
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
  "name": "Engineering 1788085887690",
  "code": "ENG_1788085887690"
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
      "id": "4b4f1864-0194-46cf-b374-01dd66f3b898",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Engineering 1788085887690",
      "code": "ENG_1788085887690",
      "managerEmployeeId": null,
      "isActive": true,
      "createdAt": "2026-08-30T10:31:28.172Z",
      "updatedAt": "2026-08-30T10:31:28.172Z"
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
        "id": "4b4f1864-0194-46cf-b374-01dd66f3b898",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "name": "Engineering 1788085887690",
        "code": "ENG_1788085887690",
        "managerEmployeeId": null,
        "isActive": true,
        "createdAt": "2026-08-30T10:31:28.172Z",
        "updatedAt": "2026-08-30T10:31:28.172Z",
        "manager": null
      }
    ]
  }
}
```

> **Note**: Retrieves department hierarchy for employee assignments.

---

### 11. Update Department (Admin)

- **Endpoint**: `PATCH /api/companies/departments/4b4f1864-0194-46cf-b374-01dd66f3b898`
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
      "id": "4b4f1864-0194-46cf-b374-01dd66f3b898",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Software Engineering & AI",
      "code": "ENG_1788085887690",
      "managerEmployeeId": null,
      "isActive": true,
      "createdAt": "2026-08-30T10:31:28.172Z",
      "updatedAt": "2026-08-30T10:31:30.212Z"
    }
  }
}
```

> **Note**: Modifies department name and parent reporting structure.

---

### 12. Delete Department (Admin)

- **Endpoint**: `DELETE /api/companies/departments/4b4f1864-0194-46cf-b374-01dd66f3b898`
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
      "id": "4b4f1864-0194-46cf-b374-01dd66f3b898",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Software Engineering & AI",
      "code": "ENG_1788085887690",
      "managerEmployeeId": null,
      "isActive": false,
      "createdAt": "2026-08-30T10:31:28.172Z",
      "updatedAt": "2026-08-30T10:31:31.402Z"
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
  "name": "Senior Fullstack Developer 1788085891974",
  "code": "DEV_1788085891974"
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
      "id": "df66c097-13bc-4438-af12-98cbad5a3fa4",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Senior Fullstack Developer 1788085891974",
      "description": null,
      "isActive": true,
      "createdAt": "2026-08-30T10:31:32.442Z",
      "updatedAt": "2026-08-30T10:31:32.442Z"
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
        "id": "df66c097-13bc-4438-af12-98cbad5a3fa4",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "name": "Senior Fullstack Developer 1788085891974",
        "description": null,
        "isActive": true,
        "createdAt": "2026-08-30T10:31:32.442Z",
        "updatedAt": "2026-08-30T10:31:32.442Z"
      }
    ]
  }
}
```

> **Note**: Lists all defined organizational designations.

---

### 15. Update Job Position (Admin)

- **Endpoint**: `PATCH /api/companies/job-positions/df66c097-13bc-4438-af12-98cbad5a3fa4`
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
      "id": "df66c097-13bc-4438-af12-98cbad5a3fa4",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Lead Fullstack Developer",
      "description": null,
      "isActive": true,
      "createdAt": "2026-08-30T10:31:32.442Z",
      "updatedAt": "2026-08-30T10:31:34.502Z"
    }
  }
}
```

> **Note**: Modifies job title and requirements.

---

### 16. Delete Job Position (Admin)

- **Endpoint**: `DELETE /api/companies/job-positions/df66c097-13bc-4438-af12-98cbad5a3fa4`
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
      "id": "df66c097-13bc-4438-af12-98cbad5a3fa4",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Lead Fullstack Developer",
      "description": null,
      "isActive": false,
      "createdAt": "2026-08-30T10:31:32.442Z",
      "updatedAt": "2026-08-30T10:31:35.662Z"
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
  "name": "Standard Day Shift 1788085896171",
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
      "id": "0b52d735-3187-49b9-a7ea-50f53dbda4f5",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Standard Day Shift 1788085896171",
      "timezone": "Asia/Kolkata",
      "isActive": true,
      "defaultBreakMinutes": 60,
      "createdAt": "2026-08-30T10:31:36.662Z",
      "updatedAt": "2026-08-30T10:31:36.662Z",
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
        "id": "0b52d735-3187-49b9-a7ea-50f53dbda4f5",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "name": "Standard Day Shift 1788085896171",
        "timezone": "Asia/Kolkata",
        "isActive": true,
        "defaultBreakMinutes": 60,
        "createdAt": "2026-08-30T10:31:36.662Z",
        "updatedAt": "2026-08-30T10:31:36.662Z",
        "days": []
      }
    ]
  }
}
```

> **Note**: Lists active work schedules and shifts.

---

### 19. Get Work Schedule by ID (Success)

- **Endpoint**: `GET /api/companies/schedules/0b52d735-3187-49b9-a7ea-50f53dbda4f5`
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
      "id": "0b52d735-3187-49b9-a7ea-50f53dbda4f5",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Standard Day Shift 1788085896171",
      "timezone": "Asia/Kolkata",
      "isActive": true,
      "defaultBreakMinutes": 60,
      "createdAt": "2026-08-30T10:31:36.662Z",
      "updatedAt": "2026-08-30T10:31:36.662Z",
      "days": []
    }
  }
}
```

> **Note**: Retrieves work schedule parameters and timing details.

---

### 20. Update Work Schedule (Admin)

- **Endpoint**: `PATCH /api/companies/schedules/0b52d735-3187-49b9-a7ea-50f53dbda4f5`
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
      "id": "0b52d735-3187-49b9-a7ea-50f53dbda4f5",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Flexible Day Shift",
      "timezone": "Asia/Kolkata",
      "isActive": true,
      "defaultBreakMinutes": 60,
      "createdAt": "2026-08-30T10:31:36.662Z",
      "updatedAt": "2026-08-30T10:31:40.812Z",
      "days": []
    }
  }
}
```

> **Note**: Modifies weekly expected work hours.

---

### 21. Delete Work Schedule (Admin)

- **Endpoint**: `DELETE /api/companies/schedules/0b52d735-3187-49b9-a7ea-50f53dbda4f5`
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
      "id": "0b52d735-3187-49b9-a7ea-50f53dbda4f5",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Flexible Day Shift",
      "timezone": "Asia/Kolkata",
      "isActive": false,
      "defaultBreakMinutes": 60,
      "createdAt": "2026-08-30T10:31:36.662Z",
      "updatedAt": "2026-08-30T10:31:42.742Z"
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
  "name": "Company Foundation Day 1788085903214",
  "holidayDate": "2034-10-05",
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
      "id": "028ef869-3d81-4c9d-a2b1-94ac04f30fd7",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Company Foundation Day 1788085903214",
      "holidayDate": "2034-10-05",
      "isOptional": false,
      "description": null,
      "createdAt": "2026-08-30T10:31:43.712Z"
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
        "id": "028ef869-3d81-4c9d-a2b1-94ac04f30fd7",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "name": "Company Foundation Day 1788085903214",
        "holidayDate": "2034-10-05",
        "isOptional": false,
        "description": null,
        "createdAt": "2026-08-30T10:31:43.712Z"
      }
    ]
  }
}
```

> **Note**: Retrieves holiday calendar for current organizational year.

---

### 24. Delete Company Holiday (Admin)

- **Endpoint**: `DELETE /api/companies/holidays/028ef869-3d81-4c9d-a2b1-94ac04f30fd7`
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
      "id": "028ef869-3d81-4c9d-a2b1-94ac04f30fd7",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "name": "Company Foundation Day 1788085903214",
      "holidayDate": "2034-10-05",
      "isOptional": false,
      "description": null,
      "createdAt": "2026-08-30T10:31:43.712Z"
    }
  }
}
```

> **Note**: Removes holiday from company holiday calendar.

---

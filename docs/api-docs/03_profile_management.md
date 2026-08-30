# Feature 03: Employee Profile & Private Info Management API

> Covers self-service profile inspection, avatar media management, private contact info, document attachments, and HR/Admin oversight.

## 📋 Endpoints Overview

| Method   | Endpoint                                                                                             | Scenario                                          | Status |
| :------- | :--------------------------------------------------------------------------------------------------- | :------------------------------------------------ | :----- |
| `GET`    | `/api/profile/me`                                                                                    | Get My Profile (Self-Service)                     | `200`  |
| `PATCH`  | `/api/profile/me`                                                                                    | Update My Profile (Success)                       | `200`  |
| `PATCH`  | `/api/profile/me`                                                                                    | Update Profile with Restricted Fields (Forbidden) | `403`  |
| `POST`   | `/api/profile/me/avatar`                                                                             | Upload Profile Avatar (Success)                   | `200`  |
| `DELETE` | `/api/profile/me/avatar`                                                                             | Delete Profile Avatar (Success)                   | `200`  |
| `GET`    | `/api/profile/me/private-info`                                                                       | Get Private Info (Self-Service)                   | `200`  |
| `PATCH`  | `/api/profile/me/private-info`                                                                       | Update Private Info (Success)                     | `200`  |
| `POST`   | `/api/profile/me/documents`                                                                          | Upload Self-Service Document (Success)            | `201`  |
| `GET`    | `/api/profile/me/documents`                                                                          | List My Documents (Success)                       | `200`  |
| `DELETE` | `/api/profile/me/documents/13ca2d10-3051-48d1-bd2f-14cc2603b583`                                     | Delete My Document (Success)                      | `200`  |
| `GET`    | `/api/employees/39376795-fa80-4d76-82de-ce690af01c31/profile`                                        | Get Employee Profile (Admin)                      | `200`  |
| `PATCH`  | `/api/employees/39376795-fa80-4d76-82de-ce690af01c31/profile`                                        | Update Employee Profile (Admin)                   | `200`  |
| `GET`    | `/api/employees/39376795-fa80-4d76-82de-ce690af01c31/private-info`                                   | Get Employee Private Info (Admin)                 | `200`  |
| `PATCH`  | `/api/employees/39376795-fa80-4d76-82de-ce690af01c31/private-info`                                   | Update Employee Private Info (Admin)              | `200`  |
| `PATCH`  | `/api/employees/39376795-fa80-4d76-82de-ce690af01c31/bank-account`                                   | Update Employee Bank Details (Admin)              | `200`  |
| `PATCH`  | `/api/employees/39376795-fa80-4d76-82de-ce690af01c31/identifiers`                                    | Update Employee Identifiers (Admin)               | `200`  |
| `POST`   | `/api/employees/39376795-fa80-4d76-82de-ce690af01c31/documents`                                      | Upload Document for Employee (Admin)              | `201`  |
| `GET`    | `/api/employees/39376795-fa80-4d76-82de-ce690af01c31/documents`                                      | List Employee Documents (Admin)                   | `200`  |
| `DELETE` | `/api/employees/39376795-fa80-4d76-82de-ce690af01c31/documents/4706977c-93c5-429d-a139-060e7daaaa23` | Delete Employee Document (Admin)                  | `200`  |

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
      "id": "39376795-fa80-4d76-82de-ce690af01c31",
      "employeeCode": "TESTBOJO20260034",
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
      "id": "39376795-fa80-4d76-82de-ce690af01c31",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "employeeCode": "TESTBOJO20260034",
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
      "userId": "7e674240-6017-498c-b648-a781185f9669",
      "createdAt": "2026-08-30T10:27:44.497Z",
      "updatedAt": "2026-08-30T10:27:52.582Z"
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

### 4. Upload Profile Avatar (Success)

- **Endpoint**: `POST /api/profile/me/avatar`
- **Expected Status**: `200`
- **Headers**:

```json
{
  "Cookie": "token=JWT_EMPLOYEE_TOKEN",
  "Content-Type": "multipart/form-data"
}
```

- **Request Body**:

```json
{
  "avatar": "(binary image buffer)"
}
```

- **Response Body**:

```json
{
  "message": "Avatar uploaded and profile updated successfully",
  "success": true,
  "error": null,
  "data": {
    "imageUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/avatar_5TDrTWjJn.png",
    "user": {
      "id": "7e674240-6017-498c-b648-a781185f9669",
      "firstName": "Bob",
      "lastName": "Johnson",
      "email": "bob.johnson4@testorg.dayflow.com",
      "role": "employee",
      "profileImage": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/avatar_5TDrTWjJn.png",
      "isActive": true
    }
  }
}
```

> **Note**: Uploads and processes employee avatar image via ImageKit.

---

### 5. Delete Profile Avatar (Success)

- **Endpoint**: `DELETE /api/profile/me/avatar`
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
  "message": "Avatar deleted and reset to default successfully",
  "success": true,
  "error": null,
  "data": {
    "imageUrl": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg",
    "user": {
      "id": "7e674240-6017-498c-b648-a781185f9669",
      "firstName": "Bob",
      "lastName": "Johnson",
      "email": "bob.johnson4@testorg.dayflow.com",
      "role": "employee",
      "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg",
      "isActive": true
    }
  }
}
```

> **Note**: Clears profile picture URL and reverts to initials placeholder.

---

### 6. Get Private Info (Self-Service)

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
    "personalEmail": "bob_1788085662759@personal.com",
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

### 7. Update Private Info (Success)

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
    "employeeId": "39376795-fa80-4d76-82de-ce690af01c31",
    "residentialAddress": "123 Tech Park Road, Bengaluru",
    "personalEmail": null,
    "nationality": null,
    "maritalStatus": null,
    "emergencyContactName": "Jane Johnson",
    "emergencyContactPhone": "9888877771",
    "createdAt": "2026-08-30T10:27:59.992Z",
    "updatedAt": "2026-08-30T10:27:59.992Z"
  }
}
```

> **Note**: Updates personal address and emergency contact data.

---

### 8. Upload Self-Service Document (Success)

- **Endpoint**: `POST /api/profile/me/documents`
- **Expected Status**: `201`
- **Headers**:

```json
{
  "Cookie": "token=JWT_EMPLOYEE_TOKEN",
  "Content-Type": "multipart/form-data"
}
```

- **Request Body**:

```json
{
  "documentType": "pan_card",
  "fileName": "National Identity Proof",
  "file": "(binary PDF buffer)"
}
```

- **Response Body**:

```json
{
  "message": "Document uploaded successfully",
  "success": true,
  "error": null,
  "data": {
    "document": {
      "id": "13ca2d10-3051-48d1-bd2f-14cc2603b583",
      "employeeId": "39376795-fa80-4d76-82de-ce690af01c31",
      "documentType": "pan_card",
      "fileName": "National Identity Proof",
      "fileUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/id_proof_k2Pp_jWmA.pdf",
      "mimeType": "application/pdf",
      "fileSize": 33,
      "uploadedBy": "7e674240-6017-498c-b648-a781185f9669",
      "createdAt": "2026-08-30T10:28:02.402Z"
    }
  }
}
```

> **Note**: Uploads personal verification documents (resumes, diplomas, government IDs).

---

### 9. List My Documents (Success)

- **Endpoint**: `GET /api/profile/me/documents`
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
  "message": "Employee documents retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "documents": [
      {
        "id": "13ca2d10-3051-48d1-bd2f-14cc2603b583",
        "employeeId": "39376795-fa80-4d76-82de-ce690af01c31",
        "documentType": "pan_card",
        "fileName": "National Identity Proof",
        "fileUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/id_proof_k2Pp_jWmA.pdf",
        "mimeType": "application/pdf",
        "fileSize": 33,
        "uploadedBy": "7e674240-6017-498c-b648-a781185f9669",
        "createdAt": "2026-08-30T10:28:02.402Z"
      }
    ]
  }
}
```

> **Note**: Retrieves all document attachments belonging to the logged-in employee.

---

### 10. Delete My Document (Success)

- **Endpoint**: `DELETE /api/profile/me/documents/13ca2d10-3051-48d1-bd2f-14cc2603b583`
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
  "message": "Document deleted successfully",
  "success": true,
  "error": null
}
```

> **Note**: Soft deletes employee-owned document attachment.

---

### 11. Get Employee Profile (Admin)

- **Endpoint**: `GET /api/employees/39376795-fa80-4d76-82de-ce690af01c31/profile`
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
      "id": "39376795-fa80-4d76-82de-ce690af01c31",
      "employeeCode": "TESTBOJO20260034",
      "firstName": "Bob",
      "lastName": "Johnson",
      "displayName": "Bob Johnson",
      "workEmail": "bob.johnson4@testorg.dayflow.com",
      "phone": "9999911111",
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

> **Note**: Administrative inspection of entire employee profile view.

---

### 12. Update Employee Profile (Admin)

- **Endpoint**: `PATCH /api/employees/39376795-fa80-4d76-82de-ce690af01c31/profile`
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
  "aboutMe": "Senior specialist in technical systems"
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
      "id": "39376795-fa80-4d76-82de-ce690af01c31",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "employeeCode": "TESTBOJO20260034",
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
      "userId": "7e674240-6017-498c-b648-a781185f9669",
      "createdAt": "2026-08-30T10:27:44.497Z",
      "updatedAt": "2026-08-30T10:28:06.912Z"
    }
  }
}
```

> **Note**: Allows HR/Admin to edit all employee profile fields.

---

### 13. Get Employee Private Info (Admin)

- **Endpoint**: `GET /api/employees/39376795-fa80-4d76-82de-ce690af01c31/private-info`
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
  "message": "Private information retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "residentialAddress": "123 Tech Park Road, Bengaluru",
    "personalEmail": null,
    "nationality": null,
    "maritalStatus": null,
    "emergencyContactName": "Jane Johnson",
    "emergencyContactPhone": "9888877771",
    "bankAccounts": [],
    "pan": null,
    "uan": null,
    "aadhaar": null
  }
}
```

> **Note**: Administrative access to unmasked residential and emergency info.

---

### 14. Update Employee Private Info (Admin)

- **Endpoint**: `PATCH /api/employees/39376795-fa80-4d76-82de-ce690af01c31/private-info`
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
  "nationality": "Indian",
  "maritalStatus": "single"
}
```

- **Response Body**:

```json
{
  "message": "Private information updated successfully",
  "success": true,
  "error": null,
  "data": {
    "employeeId": "39376795-fa80-4d76-82de-ce690af01c31",
    "residentialAddress": null,
    "personalEmail": null,
    "nationality": "Indian",
    "maritalStatus": "single",
    "emergencyContactName": null,
    "emergencyContactPhone": null,
    "createdAt": "2026-08-30T10:28:09.082Z",
    "updatedAt": "2026-08-30T10:28:09.082Z"
  }
}
```

> **Note**: Updates personal and demographic records for employee.

---

### 15. Update Employee Bank Details (Admin)

- **Endpoint**: `PATCH /api/employees/39376795-fa80-4d76-82de-ce690af01c31/bank-account`
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
  "accountNumber": "987654321000",
  "bankName": "HDFC Bank",
  "ifscCode": "HDFC0001234",
  "accountHolderName": "Bob Johnson"
}
```

- **Response Body**:

```json
{
  "message": "Bank account updated successfully",
  "success": true,
  "error": null,
  "data": {
    "id": "f0c70e89-3bf8-40e3-863b-73729cf2445d",
    "employeeId": "39376795-fa80-4d76-82de-ce690af01c31",
    "accountHolderName": "Bob Johnson",
    "accountNumberEncrypted": {
      "type": "Buffer",
      "data": [57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 48, 48]
    },
    "bankName": "HDFC Bank",
    "ifscCode": "HDFC0001234",
    "isPrimary": false,
    "createdAt": "2026-08-30T10:28:09.922Z",
    "updatedAt": "2026-08-30T10:28:09.922Z"
  }
}
```

> **Note**: Stores encrypted bank account and payout information for payroll.

---

### 16. Update Employee Identifiers (Admin)

- **Endpoint**: `PATCH /api/employees/39376795-fa80-4d76-82de-ce690af01c31/identifiers`
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
  "pan": "ABCDE1234F",
  "uan": "100987654321",
  "aadhaar": "123456789012"
}
```

- **Response Body**:

```json
{
  "message": "Identifiers updated successfully",
  "success": true,
  "error": null,
  "data": {
    "employeeId": "39376795-fa80-4d76-82de-ce690af01c31",
    "panEncrypted": {
      "type": "Buffer",
      "data": [65, 66, 67, 68, 69, 49, 50, 51, 52, 70]
    },
    "uanEncrypted": {
      "type": "Buffer",
      "data": [49, 48, 48, 57, 56, 55, 54, 53, 52, 51, 50, 49]
    },
    "aadhaarEncrypted": {
      "type": "Buffer",
      "data": [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 49, 50]
    },
    "createdAt": "2026-08-30T10:28:11.122Z",
    "updatedAt": "2026-08-30T10:28:11.122Z"
  }
}
```

> **Note**: Configures PAN, Aadhaar/UAN, and statutory identification numbers.

---

### 17. Upload Document for Employee (Admin)

- **Endpoint**: `POST /api/employees/39376795-fa80-4d76-82de-ce690af01c31/documents`
- **Expected Status**: `201`
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
  "documentType": "offer_letter",
  "fileName": "Employment Contract 2026",
  "file": "(binary PDF buffer)"
}
```

- **Response Body**:

```json
{
  "message": "Employee document uploaded successfully",
  "success": true,
  "error": null,
  "data": {
    "document": {
      "id": "4706977c-93c5-429d-a139-060e7daaaa23",
      "employeeId": "39376795-fa80-4d76-82de-ce690af01c31",
      "documentType": "offer_letter",
      "fileName": "Employment Contract 2026",
      "fileUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/contract_sjGWJ_NjS.pdf",
      "mimeType": "application/pdf",
      "fileSize": 39,
      "uploadedBy": "41c7a1de-5ec7-4eee-b512-2f428658f8fd",
      "createdAt": "2026-08-30T10:28:13.408Z"
    }
  }
}
```

> **Note**: Uploads official HR documents (offer letter, contracts, appraisal reviews).

---

### 18. List Employee Documents (Admin)

- **Endpoint**: `GET /api/employees/39376795-fa80-4d76-82de-ce690af01c31/documents`
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
  "message": "Employee documents retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "documents": [
      {
        "id": "4706977c-93c5-429d-a139-060e7daaaa23",
        "employeeId": "39376795-fa80-4d76-82de-ce690af01c31",
        "documentType": "offer_letter",
        "fileName": "Employment Contract 2026",
        "fileUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/contract_sjGWJ_NjS.pdf",
        "mimeType": "application/pdf",
        "fileSize": 39,
        "uploadedBy": "41c7a1de-5ec7-4eee-b512-2f428658f8fd",
        "createdAt": "2026-08-30T10:28:13.408Z"
      }
    ]
  }
}
```

> **Note**: Lists all documents attached to an employee profile.

---

### 19. Delete Employee Document (Admin)

- **Endpoint**: `DELETE /api/employees/39376795-fa80-4d76-82de-ce690af01c31/documents/4706977c-93c5-429d-a139-060e7daaaa23`
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
  "message": "Employee document deleted successfully",
  "success": true,
  "error": null
}
```

> **Note**: Administrative removal of employee document records.

---

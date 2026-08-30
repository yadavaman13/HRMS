# Feature 10: Audit Logs & Notifications API

> Covers immutable audit trail inspection, activity metrics, entity audit history, employee in-app notifications, and admin broadcast alerts.

## 📋 Endpoints Overview

| Method   | Endpoint                                                               | Scenario                                | Status |
| :------- | :--------------------------------------------------------------------- | :-------------------------------------- | :----- |
| `GET`    | `/api/audit-logs`                                                      | List Audit Logs (Admin)                 | `200`  |
| `GET`    | `/api/audit-logs/stats`                                                | Get Audit Activity Stats (Admin)        | `200`  |
| `GET`    | `/api/audit-logs/ab6b67fe-6484-4f13-84ad-d620be95cc0b`                 | Get Audit Log by ID (Admin)             | `200`  |
| `GET`    | `/api/audit-logs/entity/employee/cb8d13a6-a639-4ae9-830e-a71ed4c6c2b6` | Get Entity Audit History (Admin)        | `200`  |
| `POST`   | `/api/notifications/broadcast`                                         | Broadcast Notification (Admin)          | `200`  |
| `GET`    | `/api/notifications`                                                   | Get My Notifications (Success)          | `200`  |
| `GET`    | `/api/notifications/unread-count`                                      | Get Unread Notification Count (Success) | `200`  |
| `PATCH`  | `/api/notifications/a020d04e-3f9c-49c8-af47-3a975c8aa3cd/read`         | Mark Notification as Read (Success)     | `200`  |
| `PATCH`  | `/api/notifications/read-all`                                          | Mark All Notifications Read (Success)   | `200`  |
| `DELETE` | `/api/notifications/a020d04e-3f9c-49c8-af47-3a975c8aa3cd`              | Delete Notification (Success)           | `200`  |

---

## 🔍 Detailed Scenarios & Outputs

### 1. List Audit Logs (Admin)

- **Endpoint**: `GET /api/audit-logs`
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
  "message": "Audit logs retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "logs": [
      {
        "id": "ab6b67fe-6484-4f13-84ad-d620be95cc0b",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
        "action": "DELETE_HOLIDAY",
        "entityType": "HOLIDAY",
        "entityId": "028ef869-3d81-4c9d-a2b1-94ac04f30fd7",
        "oldData": {
          "id": "028ef869-3d81-4c9d-a2b1-94ac04f30fd7",
          "name": "Company Foundation Day 1788085903214",
          "createdAt": "2026-08-30T10:31:43.712Z",
          "isOptional": false,
          "description": null,
          "holidayDate": "2034-10-05",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:31:45.672Z",
        "actor": {
          "id": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085877046_25626@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "f7b21405-dbf9-44a4-a70b-c45bfd74c7da",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
        "action": "CREATE_HOLIDAY",
        "entityType": "HOLIDAY",
        "entityId": "028ef869-3d81-4c9d-a2b1-94ac04f30fd7",
        "oldData": null,
        "newData": {
          "id": "028ef869-3d81-4c9d-a2b1-94ac04f30fd7",
          "name": "Company Foundation Day 1788085903214",
          "createdAt": "2026-08-30T10:31:43.712Z",
          "isOptional": false,
          "description": null,
          "holidayDate": "2034-10-05",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:31:43.882Z",
        "actor": {
          "id": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085877046_25626@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "1b8bb71d-ddc5-4445-89d5-ef4129560f48",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
        "action": "DELETE_WORK_SCHEDULE",
        "entityType": "WORK_SCHEDULE",
        "entityId": "0b52d735-3187-49b9-a7ea-50f53dbda4f5",
        "oldData": {
          "id": "0b52d735-3187-49b9-a7ea-50f53dbda4f5",
          "days": [],
          "name": "Flexible Day Shift",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T10:31:36.662Z",
          "updatedAt": "2026-08-30T10:31:40.812Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "defaultBreakMinutes": 60
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:31:42.902Z",
        "actor": {
          "id": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085877046_25626@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "c462a5b1-ac64-4047-b1ac-916de4c3b7c5",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
        "action": "UPDATE_WORK_SCHEDULE",
        "entityType": "WORK_SCHEDULE",
        "entityId": "0b52d735-3187-49b9-a7ea-50f53dbda4f5",
        "oldData": {
          "id": "0b52d735-3187-49b9-a7ea-50f53dbda4f5",
          "days": [],
          "name": "Standard Day Shift 1788085896171",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T10:31:36.662Z",
          "updatedAt": "2026-08-30T10:31:36.662Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "defaultBreakMinutes": 60
        },
        "newData": {
          "id": "0b52d735-3187-49b9-a7ea-50f53dbda4f5",
          "days": [],
          "name": "Flexible Day Shift",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T10:31:36.662Z",
          "updatedAt": "2026-08-30T10:31:40.812Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "defaultBreakMinutes": 60
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:31:41.582Z",
        "actor": {
          "id": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085877046_25626@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "f3aca489-76d6-41d4-ad4d-a0ebd1ca28e5",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
        "action": "CREATE_WORK_SCHEDULE",
        "entityType": "WORK_SCHEDULE",
        "entityId": "0b52d735-3187-49b9-a7ea-50f53dbda4f5",
        "oldData": null,
        "newData": {
          "id": "0b52d735-3187-49b9-a7ea-50f53dbda4f5",
          "days": [],
          "name": "Standard Day Shift 1788085896171",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T10:31:36.662Z",
          "updatedAt": "2026-08-30T10:31:36.662Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "defaultBreakMinutes": 60
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:31:37.332Z",
        "actor": {
          "id": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085877046_25626@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "a5aa4bb7-d5fd-4db3-8476-754bc9ba26e4",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
        "action": "DELETE_JOB_POSITION",
        "entityType": "JOB_POSITION",
        "entityId": "df66c097-13bc-4438-af12-98cbad5a3fa4",
        "oldData": {
          "id": "df66c097-13bc-4438-af12-98cbad5a3fa4",
          "name": "Lead Fullstack Developer",
          "isActive": true,
          "createdAt": "2026-08-30T10:31:32.442Z",
          "updatedAt": "2026-08-30T10:31:34.502Z",
          "description": null,
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:31:35.832Z",
        "actor": {
          "id": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085877046_25626@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "f35478e8-963f-4d68-9110-63a325983ca5",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
        "action": "UPDATE_JOB_POSITION",
        "entityType": "JOB_POSITION",
        "entityId": "df66c097-13bc-4438-af12-98cbad5a3fa4",
        "oldData": {
          "id": "df66c097-13bc-4438-af12-98cbad5a3fa4",
          "name": "Senior Fullstack Developer 1788085891974",
          "isActive": true,
          "createdAt": "2026-08-30T10:31:32.442Z",
          "updatedAt": "2026-08-30T10:31:32.442Z",
          "description": null,
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": {
          "id": "df66c097-13bc-4438-af12-98cbad5a3fa4",
          "name": "Lead Fullstack Developer",
          "isActive": true,
          "createdAt": "2026-08-30T10:31:32.442Z",
          "updatedAt": "2026-08-30T10:31:34.502Z",
          "description": null,
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:31:34.692Z",
        "actor": {
          "id": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085877046_25626@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "c7b55146-ae62-44c1-9704-0b66dec8c4c0",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
        "action": "CREATE_JOB_POSITION",
        "entityType": "JOB_POSITION",
        "entityId": "df66c097-13bc-4438-af12-98cbad5a3fa4",
        "oldData": null,
        "newData": {
          "id": "df66c097-13bc-4438-af12-98cbad5a3fa4",
          "name": "Senior Fullstack Developer 1788085891974",
          "isActive": true,
          "createdAt": "2026-08-30T10:31:32.442Z",
          "updatedAt": "2026-08-30T10:31:32.442Z",
          "description": null,
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:31:32.622Z",
        "actor": {
          "id": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085877046_25626@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "eb2d4f93-8164-49c2-b9e4-f7fd2a13b193",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
        "action": "DELETE_DEPARTMENT",
        "entityType": "DEPARTMENT",
        "entityId": "4b4f1864-0194-46cf-b374-01dd66f3b898",
        "oldData": {
          "id": "4b4f1864-0194-46cf-b374-01dd66f3b898",
          "code": "ENG_1788085887690",
          "name": "Software Engineering & AI",
          "isActive": true,
          "createdAt": "2026-08-30T10:31:28.172Z",
          "updatedAt": "2026-08-30T10:31:30.212Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "managerEmployeeId": null
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:31:31.562Z",
        "actor": {
          "id": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085877046_25626@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "70a95dfb-303b-4d35-99b9-a03d3583169d",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
        "action": "UPDATE_DEPARTMENT",
        "entityType": "DEPARTMENT",
        "entityId": "4b4f1864-0194-46cf-b374-01dd66f3b898",
        "oldData": {
          "id": "4b4f1864-0194-46cf-b374-01dd66f3b898",
          "code": "ENG_1788085887690",
          "name": "Engineering 1788085887690",
          "isActive": true,
          "createdAt": "2026-08-30T10:31:28.172Z",
          "updatedAt": "2026-08-30T10:31:28.172Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "managerEmployeeId": null
        },
        "newData": {
          "id": "4b4f1864-0194-46cf-b374-01dd66f3b898",
          "code": "ENG_1788085887690",
          "name": "Software Engineering & AI",
          "isActive": true,
          "createdAt": "2026-08-30T10:31:28.172Z",
          "updatedAt": "2026-08-30T10:31:30.212Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "managerEmployeeId": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:31:30.422Z",
        "actor": {
          "id": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085877046_25626@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "d93a443d-e2c9-4316-b426-0bd5fc2e918f",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
        "action": "CREATE_DEPARTMENT",
        "entityType": "DEPARTMENT",
        "entityId": "4b4f1864-0194-46cf-b374-01dd66f3b898",
        "oldData": null,
        "newData": {
          "id": "4b4f1864-0194-46cf-b374-01dd66f3b898",
          "code": "ENG_1788085887690",
          "name": "Engineering 1788085887690",
          "isActive": true,
          "createdAt": "2026-08-30T10:31:28.172Z",
          "updatedAt": "2026-08-30T10:31:28.172Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "managerEmployeeId": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:31:28.342Z",
        "actor": {
          "id": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085877046_25626@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "8d492085-4330-4b3b-a92f-9c88feb9e82d",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
        "action": "DELETE_LOCATION",
        "entityType": "LOCATION",
        "entityId": "cae15271-b0b7-4d5d-afb4-68910a0ee1f5",
        "oldData": {
          "id": "cae15271-b0b7-4d5d-afb4-68910a0ee1f5",
          "name": "Bengaluru HQ 1788085883176",
          "address": "Bengaluru Tech Park",
          "isActive": true,
          "createdAt": "2026-08-30T10:31:23.682Z",
          "updatedAt": "2026-08-30T10:31:26.032Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:31:27.352Z",
        "actor": {
          "id": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085877046_25626@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "05a5fa28-f82f-4008-a06c-8e11026061af",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
        "action": "UPDATE_LOCATION",
        "entityType": "LOCATION",
        "entityId": "cae15271-b0b7-4d5d-afb4-68910a0ee1f5",
        "oldData": {
          "id": "cae15271-b0b7-4d5d-afb4-68910a0ee1f5",
          "name": "Bengaluru HQ 1788085883176",
          "address": null,
          "isActive": true,
          "createdAt": "2026-08-30T10:31:23.682Z",
          "updatedAt": "2026-08-30T10:31:23.682Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": {
          "id": "cae15271-b0b7-4d5d-afb4-68910a0ee1f5",
          "name": "Bengaluru HQ 1788085883176",
          "address": "Bengaluru Tech Park",
          "isActive": true,
          "createdAt": "2026-08-30T10:31:23.682Z",
          "updatedAt": "2026-08-30T10:31:26.032Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:31:26.202Z",
        "actor": {
          "id": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085877046_25626@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "4eed764e-4147-4ca0-b4c4-0f542173bf1f",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
        "action": "CREATE_LOCATION",
        "entityType": "LOCATION",
        "entityId": "cae15271-b0b7-4d5d-afb4-68910a0ee1f5",
        "oldData": null,
        "newData": {
          "id": "cae15271-b0b7-4d5d-afb4-68910a0ee1f5",
          "name": "Bengaluru HQ 1788085883176",
          "address": null,
          "isActive": true,
          "createdAt": "2026-08-30T10:31:23.682Z",
          "updatedAt": "2026-08-30T10:31:23.682Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:31:23.842Z",
        "actor": {
          "id": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085877046_25626@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "896d8528-2704-42ff-8785-39b8cc01f15e",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
        "action": "UPDATE_COMPANY_DETAILS",
        "entityType": "ORGANIZATION",
        "entityId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "oldData": {
          "id": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "city": "Bengaluru",
          "code": "TESTORG",
          "name": "Test Organization",
          "email": "admin@testorg.com",
          "phone": null,
          "state": "Karnataka",
          "address": null,
          "country": "India",
          "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_98ynM9TKk.png",
          "currency": "INR",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T09:34:04.865Z",
          "updatedAt": "2026-08-30T10:31:20.032Z",
          "postalCode": null
        },
        "newData": {
          "id": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "city": "Bengaluru",
          "code": "TESTORG",
          "name": "Test Organization",
          "email": "admin@testorg.com",
          "phone": null,
          "state": "Karnataka",
          "address": null,
          "country": "India",
          "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_h4btUztok.png",
          "currency": "INR",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T09:34:04.865Z",
          "updatedAt": "2026-08-30T10:31:22.682Z",
          "postalCode": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:31:22.852Z",
        "actor": {
          "id": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085877046_25626@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "3479da2c-847b-47ac-a5cf-716f0f3228d2",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
        "action": "UPDATE_COMPANY_DETAILS",
        "entityType": "ORGANIZATION",
        "entityId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "oldData": {
          "id": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "city": "Bengaluru",
          "code": "TESTORG",
          "name": "Test Organization",
          "email": "admin@testorg.com",
          "phone": null,
          "state": "Karnataka",
          "address": null,
          "country": "India",
          "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_98ynM9TKk.png",
          "currency": "INR",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T09:34:04.865Z",
          "updatedAt": "2026-08-30T10:26:15.310Z",
          "postalCode": null
        },
        "newData": {
          "id": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "city": "Bengaluru",
          "code": "TESTORG",
          "name": "Test Organization",
          "email": "admin@testorg.com",
          "phone": null,
          "state": "Karnataka",
          "address": null,
          "country": "India",
          "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_98ynM9TKk.png",
          "currency": "INR",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T09:34:04.865Z",
          "updatedAt": "2026-08-30T10:31:20.032Z",
          "postalCode": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:31:20.202Z",
        "actor": {
          "id": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085877046_25626@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "2090dabb-c747-4526-a8e2-7a7716ac3dff",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "ac15de78-60df-4400-a318-05898bb5f2ad",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "b9b2baaf-41e0-48d6-aa56-72652785eae0",
        "oldData": null,
        "newData": {
          "userId": "610af7a2-1532-4644-b8d4-9f6b22ed3003",
          "lastName": "Clark",
          "firstName": "George",
          "workEmail": "george.clark3@testorg.dayflow.com",
          "employeeId": "b9b2baaf-41e0-48d6-aa56-72652785eae0",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTGECL20260039"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:30:41.741Z",
        "actor": {
          "id": "ac15de78-60df-4400-a318-05898bb5f2ad",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085840225_68910@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "a12f7a07-aaa8-4ae2-b4a5-322d4685267e",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "a6747a74-d260-4619-b24a-9bce284efa27",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "e33e4053-d082-4684-8285-6d8d982cec79",
        "oldData": null,
        "newData": {
          "userId": "eb6f47d1-0df6-43e8-881e-670912f96da0",
          "lastName": "Gallagher",
          "firstName": "Fiona",
          "workEmail": "fiona.gallagher5@testorg.dayflow.com",
          "employeeId": "e33e4053-d082-4684-8285-6d8d982cec79",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTFIGA20260038"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:29:47.915Z",
        "actor": {
          "id": "a6747a74-d260-4619-b24a-9bce284efa27",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085786396_24929@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "675793a1-88bc-4f05-9b3b-a6e048c8ab5d",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "198fbfc9-4533-4810-8dc6-bedbb39d2b1f",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "3244dc4d-14cd-4230-8c21-37834d663c49",
        "oldData": null,
        "newData": {
          "userId": "99aa7711-93f6-4477-b2b2-db0ef882cc2a",
          "lastName": "Hunt",
          "firstName": "Ethan",
          "workEmail": "ethan.hunt6@testorg.dayflow.com",
          "employeeId": "3244dc4d-14cd-4230-8c21-37834d663c49",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTETHU20260037"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:29:23.912Z",
        "actor": {
          "id": "198fbfc9-4533-4810-8dc6-bedbb39d2b1f",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085762429_11848@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "2316eac6-bb10-43aa-bb93-68825d2ff332",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "b52678db-8a78-4e32-89c6-5b69e66b6214",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
        "oldData": null,
        "newData": {
          "userId": "2a2c0ed0-2236-4321-ba16-adf1cf542a5d",
          "lastName": "Prince",
          "firstName": "Diana",
          "workEmail": "diana.prince5@testorg.dayflow.com",
          "employeeId": "b32f1d6a-efae-4957-adb5-b7514c803bbe",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTDIPR20260036"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:28:50.377Z",
        "actor": {
          "id": "b52678db-8a78-4e32-89c6-5b69e66b6214",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085728871_75811@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "19a05b62-4d8c-43f0-8931-4c272ba87437",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "460c97b5-1218-4ba3-8985-37fa01ee3883",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "d12015b5-c157-4634-8ed5-d69965fc5267",
        "oldData": null,
        "newData": {
          "userId": "332e80b0-4fa9-4e14-a574-f346719f296b",
          "lastName": "Davis",
          "firstName": "Charlie",
          "workEmail": "charlie.davis7@testorg.dayflow.com",
          "employeeId": "d12015b5-c157-4634-8ed5-d69965fc5267",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTCHDA20260035"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:28:20.620Z",
        "actor": {
          "id": "460c97b5-1218-4ba3-8985-37fa01ee3883",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085699128_40520@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "bb63b6ad-bd5f-4aec-a171-1d550e4e3616",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "41c7a1de-5ec7-4eee-b512-2f428658f8fd",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "39376795-fa80-4d76-82de-ce690af01c31",
        "oldData": null,
        "newData": {
          "userId": "7e674240-6017-498c-b648-a781185f9669",
          "lastName": "Johnson",
          "firstName": "Bob",
          "workEmail": "bob.johnson4@testorg.dayflow.com",
          "employeeId": "39376795-fa80-4d76-82de-ce690af01c31",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTBOJO20260034"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:27:44.497Z",
        "actor": {
          "id": "41c7a1de-5ec7-4eee-b512-2f428658f8fd",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085662494_29118@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "023f33eb-8a2d-4147-a890-3170cdbc1b0a",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "b0771a4e-9398-4b61-a4e8-4692d4c67850",
        "action": "employee_deleted",
        "entityType": "employee",
        "entityId": "2dd44d42-c6ce-44eb-a754-9e9bca3cd7c4",
        "oldData": null,
        "newData": {
          "deletedAt": "2026-08-30T10:27:37.997Z"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:27:37.652Z",
        "actor": {
          "id": "b0771a4e-9398-4b61-a4e8-4692d4c67850",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085638423_44573@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "a3a20a84-3bb4-49b8-8ab9-92f47abeb782",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "b0771a4e-9398-4b61-a4e8-4692d4c67850",
        "action": "employee_password_reset",
        "entityType": "employee",
        "entityId": "2dd44d42-c6ce-44eb-a754-9e9bca3cd7c4",
        "oldData": null,
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:27:35.138Z",
        "actor": {
          "id": "b0771a4e-9398-4b61-a4e8-4692d4c67850",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085638423_44573@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "f7419acd-f8b9-4189-a2c4-0cb01793f91b",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "b0771a4e-9398-4b61-a4e8-4692d4c67850",
        "action": "employee_activated",
        "entityType": "employee",
        "entityId": "2dd44d42-c6ce-44eb-a754-9e9bca3cd7c4",
        "oldData": null,
        "newData": {
          "isActive": true
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:27:33.172Z",
        "actor": {
          "id": "b0771a4e-9398-4b61-a4e8-4692d4c67850",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085638423_44573@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "74de1ef4-21f6-4f80-9e2e-a1ba409a114e",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "b0771a4e-9398-4b61-a4e8-4692d4c67850",
        "action": "employee_deactivated",
        "entityType": "employee",
        "entityId": "2dd44d42-c6ce-44eb-a754-9e9bca3cd7c4",
        "oldData": null,
        "newData": {
          "isActive": false
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:27:31.412Z",
        "actor": {
          "id": "b0771a4e-9398-4b61-a4e8-4692d4c67850",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085638423_44573@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "f302f54e-944e-4845-8fe3-0a7a58e3c8ad",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "b0771a4e-9398-4b61-a4e8-4692d4c67850",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "2dd44d42-c6ce-44eb-a754-9e9bca3cd7c4",
        "oldData": null,
        "newData": {
          "userId": "7d3f9831-e122-4a24-8cd6-2d53b66d4a47",
          "lastName": "Smith",
          "firstName": "Alice",
          "workEmail": "alice.smith6@testorg.dayflow.com",
          "employeeId": "2dd44d42-c6ce-44eb-a754-9e9bca3cd7c4",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTALSM20260033"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:27:20.172Z",
        "actor": {
          "id": "b0771a4e-9398-4b61-a4e8-4692d4c67850",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085638423_44573@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "11e20fc2-fea6-4f6e-b7bb-eabd539b28a2",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "69985614-ab25-46c3-aef6-fde91f54dfb3",
        "action": "DELETE_HOLIDAY",
        "entityType": "HOLIDAY",
        "entityId": "a3ee3e32-a28b-4f42-9483-915c1c504b82",
        "oldData": {
          "id": "a3ee3e32-a28b-4f42-9483-915c1c504b82",
          "name": "Company Foundation Day 1788085595777",
          "createdAt": "2026-08-30T10:26:36.306Z",
          "isOptional": false,
          "description": null,
          "holidayDate": "2034-10-05",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:26:38.341Z",
        "actor": {
          "id": "69985614-ab25-46c3-aef6-fde91f54dfb3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085569309_75911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "a662bc0b-2e9c-4747-86c9-648e0bc51f68",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "69985614-ab25-46c3-aef6-fde91f54dfb3",
        "action": "CREATE_HOLIDAY",
        "entityType": "HOLIDAY",
        "entityId": "a3ee3e32-a28b-4f42-9483-915c1c504b82",
        "oldData": null,
        "newData": {
          "id": "a3ee3e32-a28b-4f42-9483-915c1c504b82",
          "name": "Company Foundation Day 1788085595777",
          "createdAt": "2026-08-30T10:26:36.306Z",
          "isOptional": false,
          "description": null,
          "holidayDate": "2034-10-05",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:26:36.471Z",
        "actor": {
          "id": "69985614-ab25-46c3-aef6-fde91f54dfb3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085569309_75911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "8136da05-f102-48a0-aea2-73c95b442058",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "69985614-ab25-46c3-aef6-fde91f54dfb3",
        "action": "DELETE_WORK_SCHEDULE",
        "entityType": "WORK_SCHEDULE",
        "entityId": "89aa7718-7d54-40af-9e73-cc28c3f4e975",
        "oldData": {
          "id": "89aa7718-7d54-40af-9e73-cc28c3f4e975",
          "days": [],
          "name": "Flexible Day Shift",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T10:26:29.200Z",
          "updatedAt": "2026-08-30T10:26:33.220Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "defaultBreakMinutes": 60
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:26:35.431Z",
        "actor": {
          "id": "69985614-ab25-46c3-aef6-fde91f54dfb3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085569309_75911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "8f4485eb-1799-4da7-b90b-ae7f52a6909f",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "69985614-ab25-46c3-aef6-fde91f54dfb3",
        "action": "UPDATE_WORK_SCHEDULE",
        "entityType": "WORK_SCHEDULE",
        "entityId": "89aa7718-7d54-40af-9e73-cc28c3f4e975",
        "oldData": {
          "id": "89aa7718-7d54-40af-9e73-cc28c3f4e975",
          "days": [],
          "name": "Standard Day Shift 1788085588684",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T10:26:29.200Z",
          "updatedAt": "2026-08-30T10:26:29.200Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "defaultBreakMinutes": 60
        },
        "newData": {
          "id": "89aa7718-7d54-40af-9e73-cc28c3f4e975",
          "days": [],
          "name": "Flexible Day Shift",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T10:26:29.200Z",
          "updatedAt": "2026-08-30T10:26:33.220Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "defaultBreakMinutes": 60
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:26:33.870Z",
        "actor": {
          "id": "69985614-ab25-46c3-aef6-fde91f54dfb3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085569309_75911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "02beeb4f-3191-4687-acee-3b4653c073d9",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "69985614-ab25-46c3-aef6-fde91f54dfb3",
        "action": "CREATE_WORK_SCHEDULE",
        "entityType": "WORK_SCHEDULE",
        "entityId": "89aa7718-7d54-40af-9e73-cc28c3f4e975",
        "oldData": null,
        "newData": {
          "id": "89aa7718-7d54-40af-9e73-cc28c3f4e975",
          "days": [],
          "name": "Standard Day Shift 1788085588684",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T10:26:29.200Z",
          "updatedAt": "2026-08-30T10:26:29.200Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "defaultBreakMinutes": 60
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:26:29.901Z",
        "actor": {
          "id": "69985614-ab25-46c3-aef6-fde91f54dfb3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085569309_75911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "9af7726a-2e5a-465b-b4d4-a3915a8c927e",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "69985614-ab25-46c3-aef6-fde91f54dfb3",
        "action": "DELETE_JOB_POSITION",
        "entityType": "JOB_POSITION",
        "entityId": "dea79977-f4e2-48d7-a614-db2e758e5ebe",
        "oldData": {
          "id": "dea79977-f4e2-48d7-a614-db2e758e5ebe",
          "name": "Lead Fullstack Developer",
          "isActive": true,
          "createdAt": "2026-08-30T10:26:24.941Z",
          "updatedAt": "2026-08-30T10:26:26.971Z",
          "description": null,
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:26:28.340Z",
        "actor": {
          "id": "69985614-ab25-46c3-aef6-fde91f54dfb3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085569309_75911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "021b1dcd-1788-44f2-ab16-31e55d97f12b",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "69985614-ab25-46c3-aef6-fde91f54dfb3",
        "action": "UPDATE_JOB_POSITION",
        "entityType": "JOB_POSITION",
        "entityId": "dea79977-f4e2-48d7-a614-db2e758e5ebe",
        "oldData": {
          "id": "dea79977-f4e2-48d7-a614-db2e758e5ebe",
          "name": "Senior Fullstack Developer 1788085584419",
          "isActive": true,
          "createdAt": "2026-08-30T10:26:24.941Z",
          "updatedAt": "2026-08-30T10:26:24.941Z",
          "description": null,
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": {
          "id": "dea79977-f4e2-48d7-a614-db2e758e5ebe",
          "name": "Lead Fullstack Developer",
          "isActive": true,
          "createdAt": "2026-08-30T10:26:24.941Z",
          "updatedAt": "2026-08-30T10:26:26.971Z",
          "description": null,
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:26:27.141Z",
        "actor": {
          "id": "69985614-ab25-46c3-aef6-fde91f54dfb3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085569309_75911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "e51c3174-5539-49a6-9a81-d8789a20d778",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "69985614-ab25-46c3-aef6-fde91f54dfb3",
        "action": "CREATE_JOB_POSITION",
        "entityType": "JOB_POSITION",
        "entityId": "dea79977-f4e2-48d7-a614-db2e758e5ebe",
        "oldData": null,
        "newData": {
          "id": "dea79977-f4e2-48d7-a614-db2e758e5ebe",
          "name": "Senior Fullstack Developer 1788085584419",
          "isActive": true,
          "createdAt": "2026-08-30T10:26:24.941Z",
          "updatedAt": "2026-08-30T10:26:24.941Z",
          "description": null,
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:26:25.110Z",
        "actor": {
          "id": "69985614-ab25-46c3-aef6-fde91f54dfb3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085569309_75911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "46270b28-c2c9-488c-ad22-7698dd262009",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "69985614-ab25-46c3-aef6-fde91f54dfb3",
        "action": "DELETE_DEPARTMENT",
        "entityType": "DEPARTMENT",
        "entityId": "8ace5a2e-b8d1-4d0d-8374-eb0faf181c4b",
        "oldData": {
          "id": "8ace5a2e-b8d1-4d0d-8374-eb0faf181c4b",
          "code": "ENG_1788085580039",
          "name": "Software Engineering & AI",
          "isActive": true,
          "createdAt": "2026-08-30T10:26:20.540Z",
          "updatedAt": "2026-08-30T10:26:22.520Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "managerEmployeeId": null
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:26:24.090Z",
        "actor": {
          "id": "69985614-ab25-46c3-aef6-fde91f54dfb3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085569309_75911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "3cbfdc88-29dd-443e-aa2c-2c649d5f6c6a",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "69985614-ab25-46c3-aef6-fde91f54dfb3",
        "action": "UPDATE_DEPARTMENT",
        "entityType": "DEPARTMENT",
        "entityId": "8ace5a2e-b8d1-4d0d-8374-eb0faf181c4b",
        "oldData": {
          "id": "8ace5a2e-b8d1-4d0d-8374-eb0faf181c4b",
          "code": "ENG_1788085580039",
          "name": "Engineering 1788085580039",
          "isActive": true,
          "createdAt": "2026-08-30T10:26:20.540Z",
          "updatedAt": "2026-08-30T10:26:20.540Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "managerEmployeeId": null
        },
        "newData": {
          "id": "8ace5a2e-b8d1-4d0d-8374-eb0faf181c4b",
          "code": "ENG_1788085580039",
          "name": "Software Engineering & AI",
          "isActive": true,
          "createdAt": "2026-08-30T10:26:20.540Z",
          "updatedAt": "2026-08-30T10:26:22.520Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "managerEmployeeId": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:26:22.680Z",
        "actor": {
          "id": "69985614-ab25-46c3-aef6-fde91f54dfb3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085569309_75911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "960923e5-8970-45c3-908f-06c9b7474768",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "69985614-ab25-46c3-aef6-fde91f54dfb3",
        "action": "CREATE_DEPARTMENT",
        "entityType": "DEPARTMENT",
        "entityId": "8ace5a2e-b8d1-4d0d-8374-eb0faf181c4b",
        "oldData": null,
        "newData": {
          "id": "8ace5a2e-b8d1-4d0d-8374-eb0faf181c4b",
          "code": "ENG_1788085580039",
          "name": "Engineering 1788085580039",
          "isActive": true,
          "createdAt": "2026-08-30T10:26:20.540Z",
          "updatedAt": "2026-08-30T10:26:20.540Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "managerEmployeeId": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:26:20.700Z",
        "actor": {
          "id": "69985614-ab25-46c3-aef6-fde91f54dfb3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085569309_75911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "e4a0168c-4f49-47b4-b9c9-3e8fc1c82697",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "69985614-ab25-46c3-aef6-fde91f54dfb3",
        "action": "DELETE_LOCATION",
        "entityType": "LOCATION",
        "entityId": "77fff955-734f-4979-975f-5145f769856a",
        "oldData": {
          "id": "77fff955-734f-4979-975f-5145f769856a",
          "name": "Bengaluru HQ 1788085575804",
          "address": "Bengaluru Tech Park",
          "isActive": true,
          "createdAt": "2026-08-30T10:26:16.310Z",
          "updatedAt": "2026-08-30T10:26:18.310Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:26:19.676Z",
        "actor": {
          "id": "69985614-ab25-46c3-aef6-fde91f54dfb3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085569309_75911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "85ce6a18-181f-4df2-9ec0-973a16b34135",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "69985614-ab25-46c3-aef6-fde91f54dfb3",
        "action": "UPDATE_LOCATION",
        "entityType": "LOCATION",
        "entityId": "77fff955-734f-4979-975f-5145f769856a",
        "oldData": {
          "id": "77fff955-734f-4979-975f-5145f769856a",
          "name": "Bengaluru HQ 1788085575804",
          "address": null,
          "isActive": true,
          "createdAt": "2026-08-30T10:26:16.310Z",
          "updatedAt": "2026-08-30T10:26:16.310Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": {
          "id": "77fff955-734f-4979-975f-5145f769856a",
          "name": "Bengaluru HQ 1788085575804",
          "address": "Bengaluru Tech Park",
          "isActive": true,
          "createdAt": "2026-08-30T10:26:16.310Z",
          "updatedAt": "2026-08-30T10:26:18.310Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:26:18.460Z",
        "actor": {
          "id": "69985614-ab25-46c3-aef6-fde91f54dfb3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085569309_75911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "adca89b2-d010-47a9-96d1-78fa924206fd",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "69985614-ab25-46c3-aef6-fde91f54dfb3",
        "action": "CREATE_LOCATION",
        "entityType": "LOCATION",
        "entityId": "77fff955-734f-4979-975f-5145f769856a",
        "oldData": null,
        "newData": {
          "id": "77fff955-734f-4979-975f-5145f769856a",
          "name": "Bengaluru HQ 1788085575804",
          "address": null,
          "isActive": true,
          "createdAt": "2026-08-30T10:26:16.310Z",
          "updatedAt": "2026-08-30T10:26:16.310Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:26:16.470Z",
        "actor": {
          "id": "69985614-ab25-46c3-aef6-fde91f54dfb3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085569309_75911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "353569c1-1346-413b-ba34-f38bcd71f1b4",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "69985614-ab25-46c3-aef6-fde91f54dfb3",
        "action": "UPDATE_COMPANY_DETAILS",
        "entityType": "ORGANIZATION",
        "entityId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "oldData": {
          "id": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "city": "Bengaluru",
          "code": "TESTORG",
          "name": "Test Organization",
          "email": "admin@testorg.com",
          "phone": null,
          "state": "Karnataka",
          "address": null,
          "country": "India",
          "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_qS5kWTetk.png",
          "currency": "INR",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T09:34:04.865Z",
          "updatedAt": "2026-08-30T10:26:12.550Z",
          "postalCode": null
        },
        "newData": {
          "id": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "city": "Bengaluru",
          "code": "TESTORG",
          "name": "Test Organization",
          "email": "admin@testorg.com",
          "phone": null,
          "state": "Karnataka",
          "address": null,
          "country": "India",
          "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_98ynM9TKk.png",
          "currency": "INR",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T09:34:04.865Z",
          "updatedAt": "2026-08-30T10:26:15.310Z",
          "postalCode": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:26:15.466Z",
        "actor": {
          "id": "69985614-ab25-46c3-aef6-fde91f54dfb3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085569309_75911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "10b0fe7a-d788-43b4-a591-413227ddb948",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "69985614-ab25-46c3-aef6-fde91f54dfb3",
        "action": "UPDATE_COMPANY_DETAILS",
        "entityType": "ORGANIZATION",
        "entityId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "oldData": {
          "id": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "city": "Bengaluru",
          "code": "TESTORG",
          "name": "Test Organization",
          "email": "admin@testorg.com",
          "phone": null,
          "state": "Karnataka",
          "address": null,
          "country": "India",
          "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_qS5kWTetk.png",
          "currency": "INR",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T09:34:04.865Z",
          "updatedAt": "2026-08-30T10:06:03.893Z",
          "postalCode": null
        },
        "newData": {
          "id": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "city": "Bengaluru",
          "code": "TESTORG",
          "name": "Test Organization",
          "email": "admin@testorg.com",
          "phone": null,
          "state": "Karnataka",
          "address": null,
          "country": "India",
          "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_qS5kWTetk.png",
          "currency": "INR",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T09:34:04.865Z",
          "updatedAt": "2026-08-30T10:26:12.550Z",
          "postalCode": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:26:12.720Z",
        "actor": {
          "id": "69985614-ab25-46c3-aef6-fde91f54dfb3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085569309_75911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "c029a29a-72d1-4ab1-bdd8-06abcfbf5486",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "f9417d56-d978-4fd1-8bd5-daa4267b1856",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "ba9bf80e-3c9c-4bea-be68-565546507bd6",
        "oldData": null,
        "newData": {
          "userId": "91939319-5bdc-4a7d-96a8-6d1b753e2953",
          "lastName": "Clark",
          "firstName": "George",
          "workEmail": "george.clark2@testorg.dayflow.com",
          "employeeId": "ba9bf80e-3c9c-4bea-be68-565546507bd6",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTGECL20260032"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:20:15.220Z",
        "actor": {
          "id": "f9417d56-d978-4fd1-8bd5-daa4267b1856",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085213709_20812@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "8c163ee5-4374-428c-8727-9ee7079af5e7",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "099ef189-d0ba-40c0-877c-87486c9b95d6",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "186db7ff-e1a6-4d7f-98c2-681786911e2d",
        "oldData": null,
        "newData": {
          "userId": "6b317ec0-4b50-4e19-b022-154484aec3e6",
          "lastName": "Gallagher",
          "firstName": "Fiona",
          "workEmail": "fiona.gallagher4@testorg.dayflow.com",
          "employeeId": "186db7ff-e1a6-4d7f-98c2-681786911e2d",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTFIGA20260031"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:17:05.844Z",
        "actor": {
          "id": "099ef189-d0ba-40c0-877c-87486c9b95d6",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788085024383_21395@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "d90fd719-4b9e-4f98-b899-dae892099c1c",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "1f337c19-07ba-428a-ad39-8c0fb9ad43dc",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "c6601584-d852-475e-a6ec-98f6d7a6c185",
        "oldData": null,
        "newData": {
          "userId": "a344b159-84e3-4d28-92c2-d6182bffc0b4",
          "lastName": "Hunt",
          "firstName": "Ethan",
          "workEmail": "ethan.hunt5@testorg.dayflow.com",
          "employeeId": "c6601584-d852-475e-a6ec-98f6d7a6c185",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTETHU20260030"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:15:37.462Z",
        "actor": {
          "id": "1f337c19-07ba-428a-ad39-8c0fb9ad43dc",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788084936044_4117@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "94a00e22-2e37-4648-84fc-e137d9bf5ff3",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "bdbaa85a-14b0-438c-b24d-210fe1b7729d",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "0f599301-09f6-4e35-ac83-f425b5f575df",
        "oldData": null,
        "newData": {
          "userId": "3d48d404-4a00-44e0-9526-5a17c8131d93",
          "lastName": "Hunt",
          "firstName": "Ethan",
          "workEmail": "ethan.hunt4@testorg.dayflow.com",
          "employeeId": "0f599301-09f6-4e35-ac83-f425b5f575df",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTETHU20260029"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:14:32.452Z",
        "actor": {
          "id": "bdbaa85a-14b0-438c-b24d-210fe1b7729d",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788084870951_79664@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "4d4a3c53-3902-49d7-8f8c-2130728de6db",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "534bc03d-d45d-4806-9370-efcc1130e770",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "6d0e525c-7cba-4527-b01e-7ee1d1630a54",
        "oldData": null,
        "newData": {
          "userId": "60b4be61-809a-4636-9599-9d783a6319d7",
          "lastName": "Hunt",
          "firstName": "Ethan",
          "workEmail": "ethan.hunt3@testorg.dayflow.com",
          "employeeId": "6d0e525c-7cba-4527-b01e-7ee1d1630a54",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTETHU20260028"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:13:51.522Z",
        "actor": {
          "id": "534bc03d-d45d-4806-9370-efcc1130e770",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788084830067_36230@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "a79beaa0-f54d-475f-8cba-af10074d3d2a",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "f5fee584-036f-43fe-b769-a3bbfa733639",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "f395ce56-3ce4-4c96-8dbe-5317f5e6f5e3",
        "oldData": null,
        "newData": {
          "userId": "0b53bf33-3ff5-4d3e-b5bf-799b99840254",
          "lastName": "Prince",
          "firstName": "Diana",
          "workEmail": "diana.prince4@testorg.dayflow.com",
          "employeeId": "f395ce56-3ce4-4c96-8dbe-5317f5e6f5e3",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTDIPR20260027"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:12:46.551Z",
        "actor": {
          "id": "f5fee584-036f-43fe-b769-a3bbfa733639",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788084765071_9555@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "fbb45c88-cfea-4909-b3d8-e86713c4b7d0",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "1640181d-da7a-413f-9822-0b4427a577ee",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "4d0de561-5947-413c-aa8b-f968e2c106b9",
        "oldData": null,
        "newData": {
          "userId": "92e03367-8f59-415d-99e4-51130d770092",
          "lastName": "Davis",
          "firstName": "Charlie",
          "workEmail": "charlie.davis6@testorg.dayflow.com",
          "employeeId": "4d0de561-5947-413c-aa8b-f968e2c106b9",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTCHDA20260026"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T10:10:59.111Z",
        "actor": {
          "id": "1640181d-da7a-413f-9822-0b4427a577ee",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788084657625_97402@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      }
    ],
    "total": 128,
    "limit": 50,
    "offset": 0
  }
}
```

> **Note**: Retrieves immutable system activity logs with actor metadata and IP addresses.

---

### 2. Get Audit Activity Stats (Admin)

- **Endpoint**: `GET /api/audit-logs/stats`
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
  "message": "Audit statistics retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "stats": {
      "totalLogs": 128,
      "topActions": [
        {
          "action": "employee_created",
          "count": 43
        },
        {
          "action": "UPDATE_COMPANY_DETAILS",
          "count": 10
        },
        {
          "action": "employee_password_reset",
          "count": 5
        },
        {
          "action": "employee_deactivated",
          "count": 5
        },
        {
          "action": "employee_activated",
          "count": 5
        }
      ],
      "topEntities": [
        {
          "entityType": "employee",
          "count": 63
        },
        {
          "entityType": "JOB_POSITION",
          "count": 12
        },
        {
          "entityType": "WORK_SCHEDULE",
          "count": 12
        },
        {
          "entityType": "DEPARTMENT",
          "count": 12
        },
        {
          "entityType": "LOCATION",
          "count": 11
        }
      ]
    }
  }
}
```

> **Note**: Aggregates security events by action type and frequency.

---

### 3. Get Audit Log by ID (Admin)

- **Endpoint**: `GET /api/audit-logs/ab6b67fe-6484-4f13-84ad-d620be95cc0b`
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
  "message": "Audit log record retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "log": {
      "id": "ab6b67fe-6484-4f13-84ad-d620be95cc0b",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "actorUserId": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
      "action": "DELETE_HOLIDAY",
      "entityType": "HOLIDAY",
      "entityId": "028ef869-3d81-4c9d-a2b1-94ac04f30fd7",
      "oldData": {
        "id": "028ef869-3d81-4c9d-a2b1-94ac04f30fd7",
        "name": "Company Foundation Day 1788085903214",
        "createdAt": "2026-08-30T10:31:43.712Z",
        "isOptional": false,
        "description": null,
        "holidayDate": "2034-10-05",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
      },
      "newData": null,
      "ipAddress": "::ffff:127.0.0.1",
      "userAgent": null,
      "createdAt": "2026-08-30T10:31:45.672Z",
      "actor": {
        "id": "c6367ea0-1a75-49e6-ad22-8b64f82c9799",
        "firstName": "Test",
        "lastName": "User",
        "email": "test_user_1788085877046_25626@example.com",
        "role": "admin"
      }
    }
  }
}
```

> **Note**: Retrieves complete before/after state diff and actor metadata.

---

### 4. Get Entity Audit History (Admin)

- **Endpoint**: `GET /api/audit-logs/entity/employee/cb8d13a6-a639-4ae9-830e-a71ed4c6c2b6`
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
  "message": "Entity audit history retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "history": []
  }
}
```

> **Note**: Filters audit trail for specific target entity (e.g. employee, payroll_period, leave_request).

---

### 5. Broadcast Notification (Admin)

- **Endpoint**: `POST /api/notifications/broadcast`
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
  "title": "System Maintenance Notice",
  "message": "Scheduled maintenance will take place this Sunday at midnight.",
  "type": "system_alert"
}
```

- **Response Body**:

```json
{
  "message": "Broadcast sent to 134 recipients",
  "success": true,
  "error": null,
  "data": {
    "sentCount": 134
  }
}
```

> **Note**: Dispatches company-wide announcement to all active employee accounts.

---

### 6. Get My Notifications (Success)

- **Endpoint**: `GET /api/notifications`
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
  "message": "Notifications retrieved successfully",
  "success": true,
  "error": null,
  "data": {
    "notifications": [
      {
        "id": "a020d04e-3f9c-49c8-af47-3a975c8aa3cd",
        "userId": "cb8d13a6-a639-4ae9-830e-a71ed4c6c2b6",
        "type": "system_alert",
        "title": "System Maintenance Notice",
        "message": "Scheduled maintenance will take place this Sunday at midnight.",
        "referenceType": "BROADCAST",
        "referenceId": null,
        "isRead": false,
        "createdAt": "2026-08-30T10:31:55.600Z",
        "readAt": null
      }
    ],
    "total": 1,
    "limit": 20,
    "offset": 0
  }
}
```

> **Note**: Retrieves recent alerts and status updates for the employee.

---

### 7. Get Unread Notification Count (Success)

- **Endpoint**: `GET /api/notifications/unread-count`
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
  "message": "Unread notification count retrieved",
  "success": true,
  "error": null,
  "data": {
    "unreadCount": 1
  }
}
```

> **Note**: Returns badge count of unread messages for topbar notifications indicator.

---

### 8. Mark Notification as Read (Success)

- **Endpoint**: `PATCH /api/notifications/a020d04e-3f9c-49c8-af47-3a975c8aa3cd/read`
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
  "message": "Notification marked as read",
  "success": true,
  "error": null,
  "data": {
    "notification": {
      "id": "a020d04e-3f9c-49c8-af47-3a975c8aa3cd",
      "userId": "cb8d13a6-a639-4ae9-830e-a71ed4c6c2b6",
      "type": "system_alert",
      "title": "System Maintenance Notice",
      "message": "Scheduled maintenance will take place this Sunday at midnight.",
      "referenceType": "BROADCAST",
      "referenceId": null,
      "isRead": true,
      "createdAt": "2026-08-30T10:31:55.600Z",
      "readAt": "2026-08-30T10:31:58.489Z"
    }
  }
}
```

> **Note**: Marks specified alert as read.

---

### 9. Mark All Notifications Read (Success)

- **Endpoint**: `PATCH /api/notifications/read-all`
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
  "message": "0 notifications marked as read",
  "success": true,
  "error": null,
  "data": {
    "count": 0
  }
}
```

> **Note**: Clears unread flag on all user alerts in batch.

---

### 10. Delete Notification (Success)

- **Endpoint**: `DELETE /api/notifications/a020d04e-3f9c-49c8-af47-3a975c8aa3cd`
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
  "message": "Notification deleted successfully",
  "success": true,
  "error": null,
  "data": {
    "notification": {
      "id": "a020d04e-3f9c-49c8-af47-3a975c8aa3cd",
      "userId": "cb8d13a6-a639-4ae9-830e-a71ed4c6c2b6",
      "type": "system_alert",
      "title": "System Maintenance Notice",
      "message": "Scheduled maintenance will take place this Sunday at midnight.",
      "referenceType": "BROADCAST",
      "referenceId": null,
      "isRead": true,
      "createdAt": "2026-08-30T10:31:55.600Z",
      "readAt": "2026-08-30T10:31:58.489Z"
    }
  }
}
```

> **Note**: Permanently removes dismissed notification from user inbox.

---

# Feature 10: Audit Logs & Notifications API

> Covers immutable audit trail inspection, activity metrics, entity audit history, employee in-app notifications, and admin broadcast alerts.

## 📋 Endpoints Overview

| Method   | Endpoint                                                               | Scenario                                | Status |
| :------- | :--------------------------------------------------------------------- | :-------------------------------------- | :----- |
| `GET`    | `/api/audit-logs`                                                      | List Audit Logs (Admin)                 | `200`  |
| `GET`    | `/api/audit-logs/stats`                                                | Get Audit Activity Stats (Admin)        | `200`  |
| `GET`    | `/api/audit-logs/99ac3bf3-1b5a-4e10-8e34-3051917094bb`                 | Get Audit Log by ID (Admin)             | `200`  |
| `GET`    | `/api/audit-logs/entity/employee/8486abb8-a278-456b-bc46-8ea055028cb2` | Get Entity Audit History (Admin)        | `200`  |
| `POST`   | `/api/notifications/broadcast`                                         | Broadcast Notification (Admin)          | `200`  |
| `GET`    | `/api/notifications`                                                   | Get My Notifications (Success)          | `200`  |
| `GET`    | `/api/notifications/unread-count`                                      | Get Unread Notification Count (Success) | `200`  |
| `PATCH`  | `/api/notifications/419cdb43-ca6d-4565-96e2-0a8c503312aa/read`         | Mark Notification as Read (Success)     | `200`  |
| `PATCH`  | `/api/notifications/read-all`                                          | Mark All Notifications Read (Success)   | `200`  |
| `DELETE` | `/api/notifications/419cdb43-ca6d-4565-96e2-0a8c503312aa`              | Delete Notification (Success)           | `200`  |

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
        "id": "99ac3bf3-1b5a-4e10-8e34-3051917094bb",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
        "action": "DELETE_HOLIDAY",
        "entityType": "HOLIDAY",
        "entityId": "ab3b377b-4289-4252-83b3-19c53d249554",
        "oldData": {
          "id": "ab3b377b-4289-4252-83b3-19c53d249554",
          "name": "Company Foundation Day 1788110699240",
          "createdAt": "2026-08-30T17:24:59.778Z",
          "isOptional": false,
          "description": null,
          "holidayDate": "2036-10-17",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:25:02.153Z",
        "actor": {
          "id": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110672098_18306@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "c7f4448c-0cde-4b98-a3ac-5f39e4320811",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
        "action": "CREATE_HOLIDAY",
        "entityType": "HOLIDAY",
        "entityId": "ab3b377b-4289-4252-83b3-19c53d249554",
        "oldData": null,
        "newData": {
          "id": "ab3b377b-4289-4252-83b3-19c53d249554",
          "name": "Company Foundation Day 1788110699240",
          "createdAt": "2026-08-30T17:24:59.778Z",
          "isOptional": false,
          "description": null,
          "holidayDate": "2036-10-17",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:24:59.978Z",
        "actor": {
          "id": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110672098_18306@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "894225b8-67af-4682-bd93-7ad90778e6b5",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
        "action": "DELETE_WORK_SCHEDULE",
        "entityType": "WORK_SCHEDULE",
        "entityId": "4cadd136-8d2c-44c5-9086-ab8076f963b3",
        "oldData": {
          "id": "4cadd136-8d2c-44c5-9086-ab8076f963b3",
          "days": [],
          "name": "Flexible Day Shift",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T17:24:51.167Z",
          "updatedAt": "2026-08-30T17:24:55.907Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "defaultBreakMinutes": 60
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:24:58.578Z",
        "actor": {
          "id": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110672098_18306@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "4fbe624e-f4dd-477e-b095-91a7ca4f9c0e",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
        "action": "UPDATE_WORK_SCHEDULE",
        "entityType": "WORK_SCHEDULE",
        "entityId": "4cadd136-8d2c-44c5-9086-ab8076f963b3",
        "oldData": {
          "id": "4cadd136-8d2c-44c5-9086-ab8076f963b3",
          "days": [],
          "name": "Standard Day Shift 1788110690657",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T17:24:51.167Z",
          "updatedAt": "2026-08-30T17:24:51.167Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "defaultBreakMinutes": 60
        },
        "newData": {
          "id": "4cadd136-8d2c-44c5-9086-ab8076f963b3",
          "days": [],
          "name": "Flexible Day Shift",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T17:24:51.167Z",
          "updatedAt": "2026-08-30T17:24:55.907Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "defaultBreakMinutes": 60
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:24:56.729Z",
        "actor": {
          "id": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110672098_18306@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "d7b8ba0b-6b65-41f4-b322-218522c7f326",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
        "action": "CREATE_WORK_SCHEDULE",
        "entityType": "WORK_SCHEDULE",
        "entityId": "4cadd136-8d2c-44c5-9086-ab8076f963b3",
        "oldData": null,
        "newData": {
          "id": "4cadd136-8d2c-44c5-9086-ab8076f963b3",
          "days": [],
          "name": "Standard Day Shift 1788110690657",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T17:24:51.167Z",
          "updatedAt": "2026-08-30T17:24:51.167Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "defaultBreakMinutes": 60
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:24:51.878Z",
        "actor": {
          "id": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110672098_18306@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "8007a31c-3a87-48cf-89e2-1a89af7a9fda",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
        "action": "DELETE_JOB_POSITION",
        "entityType": "JOB_POSITION",
        "entityId": "6a7ed851-799e-449d-a839-a22323c7b373",
        "oldData": {
          "id": "6a7ed851-799e-449d-a839-a22323c7b373",
          "name": "Lead Fullstack Developer",
          "isActive": true,
          "createdAt": "2026-08-30T17:24:47.128Z",
          "updatedAt": "2026-08-30T17:24:49.053Z",
          "description": null,
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:24:50.318Z",
        "actor": {
          "id": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110672098_18306@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "69cce6cc-b4b7-495b-81a5-952578dd42fc",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
        "action": "UPDATE_JOB_POSITION",
        "entityType": "JOB_POSITION",
        "entityId": "6a7ed851-799e-449d-a839-a22323c7b373",
        "oldData": {
          "id": "6a7ed851-799e-449d-a839-a22323c7b373",
          "name": "Senior Fullstack Developer 1788110686660",
          "isActive": true,
          "createdAt": "2026-08-30T17:24:47.128Z",
          "updatedAt": "2026-08-30T17:24:47.128Z",
          "description": null,
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": {
          "id": "6a7ed851-799e-449d-a839-a22323c7b373",
          "name": "Lead Fullstack Developer",
          "isActive": true,
          "createdAt": "2026-08-30T17:24:47.128Z",
          "updatedAt": "2026-08-30T17:24:49.053Z",
          "description": null,
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:24:49.213Z",
        "actor": {
          "id": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110672098_18306@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "56c379d9-4341-470c-ad0a-4074628a10e4",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
        "action": "CREATE_JOB_POSITION",
        "entityType": "JOB_POSITION",
        "entityId": "6a7ed851-799e-449d-a839-a22323c7b373",
        "oldData": null,
        "newData": {
          "id": "6a7ed851-799e-449d-a839-a22323c7b373",
          "name": "Senior Fullstack Developer 1788110686660",
          "isActive": true,
          "createdAt": "2026-08-30T17:24:47.128Z",
          "updatedAt": "2026-08-30T17:24:47.128Z",
          "description": null,
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:24:47.293Z",
        "actor": {
          "id": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110672098_18306@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "64ed2c54-fa44-4f85-b8a0-06bdba6e33de",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
        "action": "DELETE_DEPARTMENT",
        "entityType": "DEPARTMENT",
        "entityId": "81fb5288-bffa-4750-83bd-e04e15a0eec3",
        "oldData": {
          "id": "81fb5288-bffa-4750-83bd-e04e15a0eec3",
          "code": "ENG_1788110682564",
          "name": "Software Engineering & AI",
          "isActive": true,
          "createdAt": "2026-08-30T17:24:43.043Z",
          "updatedAt": "2026-08-30T17:24:45.092Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "managerEmployeeId": null
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:24:46.358Z",
        "actor": {
          "id": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110672098_18306@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "54ee7117-f1bd-4594-bd8a-f2235d2a269e",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
        "action": "UPDATE_DEPARTMENT",
        "entityType": "DEPARTMENT",
        "entityId": "81fb5288-bffa-4750-83bd-e04e15a0eec3",
        "oldData": {
          "id": "81fb5288-bffa-4750-83bd-e04e15a0eec3",
          "code": "ENG_1788110682564",
          "name": "Engineering 1788110682564",
          "isActive": true,
          "createdAt": "2026-08-30T17:24:43.043Z",
          "updatedAt": "2026-08-30T17:24:43.043Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "managerEmployeeId": null
        },
        "newData": {
          "id": "81fb5288-bffa-4750-83bd-e04e15a0eec3",
          "code": "ENG_1788110682564",
          "name": "Software Engineering & AI",
          "isActive": true,
          "createdAt": "2026-08-30T17:24:43.043Z",
          "updatedAt": "2026-08-30T17:24:45.092Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "managerEmployeeId": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:24:45.248Z",
        "actor": {
          "id": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110672098_18306@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "be5f64c4-35bf-495b-b9d4-c91516443af4",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
        "action": "CREATE_DEPARTMENT",
        "entityType": "DEPARTMENT",
        "entityId": "81fb5288-bffa-4750-83bd-e04e15a0eec3",
        "oldData": null,
        "newData": {
          "id": "81fb5288-bffa-4750-83bd-e04e15a0eec3",
          "code": "ENG_1788110682564",
          "name": "Engineering 1788110682564",
          "isActive": true,
          "createdAt": "2026-08-30T17:24:43.043Z",
          "updatedAt": "2026-08-30T17:24:43.043Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "managerEmployeeId": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:24:43.208Z",
        "actor": {
          "id": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110672098_18306@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "61017440-21e3-4d42-9894-aa1b90ade204",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
        "action": "DELETE_LOCATION",
        "entityType": "LOCATION",
        "entityId": "66f80cf9-9c58-4372-9923-8a2fb440e41e",
        "oldData": {
          "id": "66f80cf9-9c58-4372-9923-8a2fb440e41e",
          "name": "Bengaluru HQ 1788110678387",
          "address": "Bengaluru Tech Park",
          "isActive": true,
          "createdAt": "2026-08-30T17:24:38.928Z",
          "updatedAt": "2026-08-30T17:24:40.963Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:24:42.233Z",
        "actor": {
          "id": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110672098_18306@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "027e0ebe-f655-4b75-86a2-664c41402c40",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
        "action": "UPDATE_LOCATION",
        "entityType": "LOCATION",
        "entityId": "66f80cf9-9c58-4372-9923-8a2fb440e41e",
        "oldData": {
          "id": "66f80cf9-9c58-4372-9923-8a2fb440e41e",
          "name": "Bengaluru HQ 1788110678387",
          "address": null,
          "isActive": true,
          "createdAt": "2026-08-30T17:24:38.928Z",
          "updatedAt": "2026-08-30T17:24:38.928Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": {
          "id": "66f80cf9-9c58-4372-9923-8a2fb440e41e",
          "name": "Bengaluru HQ 1788110678387",
          "address": "Bengaluru Tech Park",
          "isActive": true,
          "createdAt": "2026-08-30T17:24:38.928Z",
          "updatedAt": "2026-08-30T17:24:40.963Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:24:41.119Z",
        "actor": {
          "id": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110672098_18306@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "a968f8ef-d5f2-495f-b459-ee5de7c2e709",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
        "action": "CREATE_LOCATION",
        "entityType": "LOCATION",
        "entityId": "66f80cf9-9c58-4372-9923-8a2fb440e41e",
        "oldData": null,
        "newData": {
          "id": "66f80cf9-9c58-4372-9923-8a2fb440e41e",
          "name": "Bengaluru HQ 1788110678387",
          "address": null,
          "isActive": true,
          "createdAt": "2026-08-30T17:24:38.928Z",
          "updatedAt": "2026-08-30T17:24:38.928Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:24:39.133Z",
        "actor": {
          "id": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110672098_18306@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "07f9b776-887a-48a8-998f-3d971c1c96ee",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
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
          "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_GgSQOsOiVS.png",
          "currency": "INR",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T09:34:04.865Z",
          "updatedAt": "2026-08-30T17:24:35.333Z",
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
          "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_VIcNMWCd3.png",
          "currency": "INR",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T09:34:04.865Z",
          "updatedAt": "2026-08-30T17:24:37.868Z",
          "postalCode": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:24:38.028Z",
        "actor": {
          "id": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110672098_18306@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "c62f414a-5885-40b0-a31c-bf64916b37ca",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
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
          "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_GgSQOsOiVS.png",
          "currency": "INR",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T09:34:04.865Z",
          "updatedAt": "2026-08-30T16:35:32.769Z",
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
          "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_GgSQOsOiVS.png",
          "currency": "INR",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T09:34:04.865Z",
          "updatedAt": "2026-08-30T17:24:35.333Z",
          "postalCode": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:24:35.488Z",
        "actor": {
          "id": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110672098_18306@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "d5be5ed0-b9d3-492e-8e17-bf52646503f7",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "5e4b490c-cced-48dc-803d-89fecad21cfa",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "c02055a5-0107-42e8-8317-ba5d6c18da49",
        "oldData": null,
        "newData": {
          "userId": "7bf034f2-9280-4d79-8213-7768da478660",
          "lastName": "Clark",
          "firstName": "George",
          "workEmail": "george.clark14@testorg.dayflow.com",
          "employeeId": "c02055a5-0107-42e8-8317-ba5d6c18da49",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTGECL20260120"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:23:32.131Z",
        "actor": {
          "id": "5e4b490c-cced-48dc-803d-89fecad21cfa",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110610070_77217@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "e9325287-c19b-4643-8366-692609edb171",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "0ae4c1ff-a37f-42cc-bb95-8e4de98e255b",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "030e1dde-b813-4664-b444-ce5070417835",
        "oldData": null,
        "newData": {
          "userId": "c7e73ad1-7101-46a3-a1fe-a6d3a6841f9f",
          "lastName": "Gallagher",
          "firstName": "Fiona",
          "workEmail": "fiona.gallagher21@testorg.dayflow.com",
          "employeeId": "030e1dde-b813-4664-b444-ce5070417835",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTFIGA20260119"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:23:00.362Z",
        "actor": {
          "id": "0ae4c1ff-a37f-42cc-bb95-8e4de98e255b",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110578470_34727@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "bca2f06f-58aa-4744-acc4-aa5efa952513",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "a6e914e7-67bc-440e-b257-9b3cc254d4f8",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "986b9ed2-a4e1-41f9-bc4b-682816e82b35",
        "oldData": null,
        "newData": {
          "userId": "4cff9bcc-8b74-42d2-b51c-403c5d79e234",
          "lastName": "Hunt",
          "firstName": "Ethan",
          "workEmail": "ethan.hunt17@testorg.dayflow.com",
          "employeeId": "986b9ed2-a4e1-41f9-bc4b-682816e82b35",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTETHU20260118"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:22:18.650Z",
        "actor": {
          "id": "a6e914e7-67bc-440e-b257-9b3cc254d4f8",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110534688_57719@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "26e5f522-55b0-4be8-8701-416ebcdd5ff7",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
        "oldData": null,
        "newData": {
          "userId": "ebf0f028-0966-4309-b335-9aebb8a4205b",
          "lastName": "Prince",
          "firstName": "Diana",
          "workEmail": "diana.prince16@testorg.dayflow.com",
          "employeeId": "5ccb9d8b-d6e2-467b-8d6c-d083800dba46",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTDIPR20260117"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:21:11.570Z",
        "actor": {
          "id": "ff806ecd-839c-4974-8a55-dbc6a577bba5",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110467749_4726@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "dbefc03e-b50a-42f7-b8ec-573e5ee4852c",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "8a59e40a-06f8-482b-96cb-b2ba418534d7",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "38a90a3b-0ba9-4527-86cd-1f11d6db1768",
        "oldData": null,
        "newData": {
          "userId": "bef0158f-63ed-4f45-ad63-8a55e294c170",
          "lastName": "Davis",
          "firstName": "Charlie",
          "workEmail": "charlie.davis18@testorg.dayflow.com",
          "employeeId": "38a90a3b-0ba9-4527-86cd-1f11d6db1768",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTCHDA20260116"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:19:46.467Z",
        "actor": {
          "id": "8a59e40a-06f8-482b-96cb-b2ba418534d7",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110384765_38510@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "ebbf8b13-c071-400a-9f2f-9a1f62726d20",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "61f1c6f0-f93b-47bd-8396-e93f07872298",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "0343b7f2-66ce-42c6-a926-32adfc3a5222",
        "oldData": null,
        "newData": {
          "userId": "61f0695f-2f05-4902-8867-82a0978b4e22",
          "lastName": "Johnson",
          "firstName": "Bob",
          "workEmail": "bob.johnson15@testorg.dayflow.com",
          "employeeId": "0343b7f2-66ce-42c6-a926-32adfc3a5222",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTBOJO20260115"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:18:11.190Z",
        "actor": {
          "id": "61f1c6f0-f93b-47bd-8396-e93f07872298",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110286261_59769@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "97a971c5-b7f5-4781-81b8-4760ce9359ad",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "62389725-87d6-4bf2-ae18-0f6973a08308",
        "action": "employee_deleted",
        "entityType": "employee",
        "entityId": "32816e3b-d808-483c-9330-f23a5ed9d83b",
        "oldData": null,
        "newData": {
          "deletedAt": "2026-08-30T17:17:58.095Z"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:17:57.735Z",
        "actor": {
          "id": "62389725-87d6-4bf2-ae18-0f6973a08308",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110241300_99587@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "3e6d7f11-987c-469c-89a1-826b4614919b",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "62389725-87d6-4bf2-ae18-0f6973a08308",
        "action": "employee_password_reset",
        "entityType": "employee",
        "entityId": "32816e3b-d808-483c-9330-f23a5ed9d83b",
        "oldData": null,
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:17:53.948Z",
        "actor": {
          "id": "62389725-87d6-4bf2-ae18-0f6973a08308",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110241300_99587@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "ee0d0b1d-acb0-471b-af7d-4e67b4078f16",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "62389725-87d6-4bf2-ae18-0f6973a08308",
        "action": "employee_activated",
        "entityType": "employee",
        "entityId": "32816e3b-d808-483c-9330-f23a5ed9d83b",
        "oldData": null,
        "newData": {
          "isActive": true
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:17:52.007Z",
        "actor": {
          "id": "62389725-87d6-4bf2-ae18-0f6973a08308",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110241300_99587@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "4c52e4b1-7da8-478f-a396-491595901c3c",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "62389725-87d6-4bf2-ae18-0f6973a08308",
        "action": "employee_deactivated",
        "entityType": "employee",
        "entityId": "32816e3b-d808-483c-9330-f23a5ed9d83b",
        "oldData": null,
        "newData": {
          "isActive": false
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:17:49.555Z",
        "actor": {
          "id": "62389725-87d6-4bf2-ae18-0f6973a08308",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110241300_99587@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "2f526c78-079e-4110-bc00-d2464a6a7186",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "62389725-87d6-4bf2-ae18-0f6973a08308",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "32816e3b-d808-483c-9330-f23a5ed9d83b",
        "oldData": null,
        "newData": {
          "userId": "c1eae38e-c790-4904-b077-3cb4191828e8",
          "lastName": "Smith",
          "firstName": "Alice",
          "workEmail": "alice.smith17@testorg.dayflow.com",
          "employeeId": "32816e3b-d808-483c-9330-f23a5ed9d83b",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTALSM20260114"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:17:23.472Z",
        "actor": {
          "id": "62389725-87d6-4bf2-ae18-0f6973a08308",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110241300_99587@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "2d508378-c96d-4993-9d3e-152c78f68ef4",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "ca9912b3-59ff-4f3f-9c2e-71ac95697121",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "fbcdcf34-f3b0-4de2-b7cb-95f7e5bfb29f",
        "oldData": null,
        "newData": {
          "userId": "7c0f4571-f906-4448-921c-b995ac094aa9",
          "lastName": "Gallagher",
          "firstName": "Fiona",
          "workEmail": "fiona.gallagher20@testorg.dayflow.com",
          "employeeId": "fbcdcf34-f3b0-4de2-b7cb-95f7e5bfb29f",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTFIGA20260113"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:14:22.272Z",
        "actor": {
          "id": "ca9912b3-59ff-4f3f-9c2e-71ac95697121",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788110061111_78892@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "dc8dc3e0-5855-4646-9455-b033a8b60528",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "48345896-5f38-41bd-a8ee-050c4244125a",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "b90ead69-421a-4159-a914-3753f2877b7f",
        "oldData": null,
        "newData": {
          "userId": "f0536698-c53b-4a1f-9862-da0857f805fb",
          "lastName": "Gallagher",
          "firstName": "Fiona",
          "workEmail": "fiona.gallagher19@testorg.dayflow.com",
          "employeeId": "b90ead69-421a-4159-a914-3753f2877b7f",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTFIGA20260112"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:03:39.982Z",
        "actor": {
          "id": "48345896-5f38-41bd-a8ee-050c4244125a",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788109418858_23592@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "92babf15-04db-47ef-8a72-04aab283dcbb",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "8ccee290-01f1-4868-83ee-73b980345663",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "c11e0d12-6542-4f8a-a481-d35202708f44",
        "oldData": null,
        "newData": {
          "userId": "9ead59a4-2965-4a84-bffc-fc7bd270d6b5",
          "lastName": "Gallagher",
          "firstName": "Fiona",
          "workEmail": "fiona.gallagher18@testorg.dayflow.com",
          "employeeId": "c11e0d12-6542-4f8a-a481-d35202708f44",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTFIGA20260111"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T17:02:06.939Z",
        "actor": {
          "id": "8ccee290-01f1-4868-83ee-73b980345663",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788109321323_61556@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "f39af5e8-b937-4043-b3e1-868c0a64e74c",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "c4785ad6-f438-4ae2-b3a7-7d90052aaa71",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "5f4856d5-514f-4d6b-8f12-9ef9e7edf29f",
        "oldData": null,
        "newData": {
          "userId": "e5389ee7-29a4-46d6-ac5a-fb8f3c5e316b",
          "lastName": "Gallagher",
          "firstName": "Fiona",
          "workEmail": "fiona.gallagher17@testorg.dayflow.com",
          "employeeId": "5f4856d5-514f-4d6b-8f12-9ef9e7edf29f",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTFIGA20260110"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:59:48.917Z",
        "actor": {
          "id": "c4785ad6-f438-4ae2-b3a7-7d90052aaa71",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788109186855_6459@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "ca398c04-edb9-4807-97b2-257dab7e6321",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "f7aa068b-c3d4-4b0f-9595-0e0ac43152e7",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "b0af2762-5eee-4ad0-9b2a-bb6f116284ef",
        "oldData": null,
        "newData": {
          "userId": "10286135-5410-46e3-8d71-683f7a2e3ba4",
          "lastName": "Gallagher",
          "firstName": "Fiona",
          "workEmail": "fiona.gallagher16@testorg.dayflow.com",
          "employeeId": "b0af2762-5eee-4ad0-9b2a-bb6f116284ef",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTFIGA20260109"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:39:18.638Z",
        "actor": {
          "id": "f7aa068b-c3d4-4b0f-9595-0e0ac43152e7",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107948385_71266@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "ac64c213-83ec-4af0-924a-479eeb27baee",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "47911f57-ab8a-4a58-b971-197aef3f916a",
        "action": "DELETE_HOLIDAY",
        "entityType": "HOLIDAY",
        "entityId": "fbcc6550-ef21-497b-9df4-7e87ac69fbc4",
        "oldData": {
          "id": "fbcc6550-ef21-497b-9df4-7e87ac69fbc4",
          "name": "Company Foundation Day 1788107759960",
          "createdAt": "2026-08-30T16:36:00.737Z",
          "isOptional": false,
          "description": null,
          "holidayDate": "2034-10-05",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:36:03.458Z",
        "actor": {
          "id": "47911f57-ab8a-4a58-b971-197aef3f916a",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107723545_5619@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "e5d04b80-8896-4180-9049-28af1cf8c049",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "47911f57-ab8a-4a58-b971-197aef3f916a",
        "action": "CREATE_HOLIDAY",
        "entityType": "HOLIDAY",
        "entityId": "fbcc6550-ef21-497b-9df4-7e87ac69fbc4",
        "oldData": null,
        "newData": {
          "id": "fbcc6550-ef21-497b-9df4-7e87ac69fbc4",
          "name": "Company Foundation Day 1788107759960",
          "createdAt": "2026-08-30T16:36:00.737Z",
          "isOptional": false,
          "description": null,
          "holidayDate": "2034-10-05",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:36:01.106Z",
        "actor": {
          "id": "47911f57-ab8a-4a58-b971-197aef3f916a",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107723545_5619@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "469acfc6-8563-44f2-ba4e-9648e6aa4db1",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "47911f57-ab8a-4a58-b971-197aef3f916a",
        "action": "DELETE_WORK_SCHEDULE",
        "entityType": "WORK_SCHEDULE",
        "entityId": "b94a7b00-808e-4b3d-b9c0-a938654e2183",
        "oldData": {
          "id": "b94a7b00-808e-4b3d-b9c0-a938654e2183",
          "days": [],
          "name": "Flexible Day Shift",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T16:35:51.132Z",
          "updatedAt": "2026-08-30T16:35:56.425Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "defaultBreakMinutes": 60
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:35:59.460Z",
        "actor": {
          "id": "47911f57-ab8a-4a58-b971-197aef3f916a",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107723545_5619@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "038f8d0d-fa97-48a3-833d-4aaa1d037c2f",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "47911f57-ab8a-4a58-b971-197aef3f916a",
        "action": "UPDATE_WORK_SCHEDULE",
        "entityType": "WORK_SCHEDULE",
        "entityId": "b94a7b00-808e-4b3d-b9c0-a938654e2183",
        "oldData": {
          "id": "b94a7b00-808e-4b3d-b9c0-a938654e2183",
          "days": [],
          "name": "Standard Day Shift 1788107750423",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T16:35:51.132Z",
          "updatedAt": "2026-08-30T16:35:51.132Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "defaultBreakMinutes": 60
        },
        "newData": {
          "id": "b94a7b00-808e-4b3d-b9c0-a938654e2183",
          "days": [],
          "name": "Flexible Day Shift",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T16:35:51.132Z",
          "updatedAt": "2026-08-30T16:35:56.425Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "defaultBreakMinutes": 60
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:35:57.400Z",
        "actor": {
          "id": "47911f57-ab8a-4a58-b971-197aef3f916a",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107723545_5619@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "eb2f7e9e-f4c0-4469-ba7d-2841812ab75a",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "47911f57-ab8a-4a58-b971-197aef3f916a",
        "action": "CREATE_WORK_SCHEDULE",
        "entityType": "WORK_SCHEDULE",
        "entityId": "b94a7b00-808e-4b3d-b9c0-a938654e2183",
        "oldData": null,
        "newData": {
          "id": "b94a7b00-808e-4b3d-b9c0-a938654e2183",
          "days": [],
          "name": "Standard Day Shift 1788107750423",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T16:35:51.132Z",
          "updatedAt": "2026-08-30T16:35:51.132Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "defaultBreakMinutes": 60
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:35:52.308Z",
        "actor": {
          "id": "47911f57-ab8a-4a58-b971-197aef3f916a",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107723545_5619@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "c64b1f35-0b85-4e71-8e84-0b3c1d1b0e54",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "47911f57-ab8a-4a58-b971-197aef3f916a",
        "action": "DELETE_JOB_POSITION",
        "entityType": "JOB_POSITION",
        "entityId": "908cc896-a4ba-4c63-ab1b-00cf31dc5eb7",
        "oldData": {
          "id": "908cc896-a4ba-4c63-ab1b-00cf31dc5eb7",
          "name": "Lead Fullstack Developer",
          "isActive": true,
          "createdAt": "2026-08-30T16:35:45.408Z",
          "updatedAt": "2026-08-30T16:35:48.361Z",
          "description": null,
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:35:50.067Z",
        "actor": {
          "id": "47911f57-ab8a-4a58-b971-197aef3f916a",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107723545_5619@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "282259db-4e95-47a1-8ed9-bfef5f36fe63",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "47911f57-ab8a-4a58-b971-197aef3f916a",
        "action": "UPDATE_JOB_POSITION",
        "entityType": "JOB_POSITION",
        "entityId": "908cc896-a4ba-4c63-ab1b-00cf31dc5eb7",
        "oldData": {
          "id": "908cc896-a4ba-4c63-ab1b-00cf31dc5eb7",
          "name": "Senior Fullstack Developer 1788107744808",
          "isActive": true,
          "createdAt": "2026-08-30T16:35:45.408Z",
          "updatedAt": "2026-08-30T16:35:45.408Z",
          "description": null,
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": {
          "id": "908cc896-a4ba-4c63-ab1b-00cf31dc5eb7",
          "name": "Lead Fullstack Developer",
          "isActive": true,
          "createdAt": "2026-08-30T16:35:45.408Z",
          "updatedAt": "2026-08-30T16:35:48.361Z",
          "description": null,
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:35:48.584Z",
        "actor": {
          "id": "47911f57-ab8a-4a58-b971-197aef3f916a",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107723545_5619@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "a726ee73-6203-47ed-ac32-7fcfb2339710",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "47911f57-ab8a-4a58-b971-197aef3f916a",
        "action": "CREATE_JOB_POSITION",
        "entityType": "JOB_POSITION",
        "entityId": "908cc896-a4ba-4c63-ab1b-00cf31dc5eb7",
        "oldData": null,
        "newData": {
          "id": "908cc896-a4ba-4c63-ab1b-00cf31dc5eb7",
          "name": "Senior Fullstack Developer 1788107744808",
          "isActive": true,
          "createdAt": "2026-08-30T16:35:45.408Z",
          "updatedAt": "2026-08-30T16:35:45.408Z",
          "description": null,
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:35:45.698Z",
        "actor": {
          "id": "47911f57-ab8a-4a58-b971-197aef3f916a",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107723545_5619@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "bbed01cb-63ae-4646-bbbd-418a45e51fa5",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "47911f57-ab8a-4a58-b971-197aef3f916a",
        "action": "DELETE_DEPARTMENT",
        "entityType": "DEPARTMENT",
        "entityId": "e1c8b0aa-d880-4305-ad4f-5106a28c0c67",
        "oldData": {
          "id": "e1c8b0aa-d880-4305-ad4f-5106a28c0c67",
          "code": "ENG_1788107739533",
          "name": "Software Engineering & AI",
          "isActive": true,
          "createdAt": "2026-08-30T16:35:40.129Z",
          "updatedAt": "2026-08-30T16:35:42.704Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "managerEmployeeId": null
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:35:44.415Z",
        "actor": {
          "id": "47911f57-ab8a-4a58-b971-197aef3f916a",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107723545_5619@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "4fe0dead-e983-4ca3-ae90-bd452862cbea",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "47911f57-ab8a-4a58-b971-197aef3f916a",
        "action": "UPDATE_DEPARTMENT",
        "entityType": "DEPARTMENT",
        "entityId": "e1c8b0aa-d880-4305-ad4f-5106a28c0c67",
        "oldData": {
          "id": "e1c8b0aa-d880-4305-ad4f-5106a28c0c67",
          "code": "ENG_1788107739533",
          "name": "Engineering 1788107739533",
          "isActive": true,
          "createdAt": "2026-08-30T16:35:40.129Z",
          "updatedAt": "2026-08-30T16:35:40.129Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "managerEmployeeId": null
        },
        "newData": {
          "id": "e1c8b0aa-d880-4305-ad4f-5106a28c0c67",
          "code": "ENG_1788107739533",
          "name": "Software Engineering & AI",
          "isActive": true,
          "createdAt": "2026-08-30T16:35:40.129Z",
          "updatedAt": "2026-08-30T16:35:42.704Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "managerEmployeeId": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:35:43.009Z",
        "actor": {
          "id": "47911f57-ab8a-4a58-b971-197aef3f916a",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107723545_5619@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "9b40e23a-fb8b-47cf-944e-68ed2cec7e51",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "47911f57-ab8a-4a58-b971-197aef3f916a",
        "action": "CREATE_DEPARTMENT",
        "entityType": "DEPARTMENT",
        "entityId": "e1c8b0aa-d880-4305-ad4f-5106a28c0c67",
        "oldData": null,
        "newData": {
          "id": "e1c8b0aa-d880-4305-ad4f-5106a28c0c67",
          "code": "ENG_1788107739533",
          "name": "Engineering 1788107739533",
          "isActive": true,
          "createdAt": "2026-08-30T16:35:40.129Z",
          "updatedAt": "2026-08-30T16:35:40.129Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
          "managerEmployeeId": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:35:40.432Z",
        "actor": {
          "id": "47911f57-ab8a-4a58-b971-197aef3f916a",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107723545_5619@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "ca6fbde7-efb0-4104-b4bb-155d724d8ee2",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "47911f57-ab8a-4a58-b971-197aef3f916a",
        "action": "DELETE_LOCATION",
        "entityType": "LOCATION",
        "entityId": "b92527e8-84f3-4820-bc38-8ddd5433fa45",
        "oldData": {
          "id": "b92527e8-84f3-4820-bc38-8ddd5433fa45",
          "name": "Bengaluru HQ 1788107733473",
          "address": "Bengaluru Tech Park",
          "isActive": true,
          "createdAt": "2026-08-30T16:35:34.085Z",
          "updatedAt": "2026-08-30T16:35:36.923Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:35:39.071Z",
        "actor": {
          "id": "47911f57-ab8a-4a58-b971-197aef3f916a",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107723545_5619@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "d043555f-0a8b-49f3-98e2-51b175b18493",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "47911f57-ab8a-4a58-b971-197aef3f916a",
        "action": "UPDATE_LOCATION",
        "entityType": "LOCATION",
        "entityId": "b92527e8-84f3-4820-bc38-8ddd5433fa45",
        "oldData": {
          "id": "b92527e8-84f3-4820-bc38-8ddd5433fa45",
          "name": "Bengaluru HQ 1788107733473",
          "address": null,
          "isActive": true,
          "createdAt": "2026-08-30T16:35:34.085Z",
          "updatedAt": "2026-08-30T16:35:34.085Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "newData": {
          "id": "b92527e8-84f3-4820-bc38-8ddd5433fa45",
          "name": "Bengaluru HQ 1788107733473",
          "address": "Bengaluru Tech Park",
          "isActive": true,
          "createdAt": "2026-08-30T16:35:34.085Z",
          "updatedAt": "2026-08-30T16:35:36.923Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:35:37.216Z",
        "actor": {
          "id": "47911f57-ab8a-4a58-b971-197aef3f916a",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107723545_5619@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "9c3aa203-722d-4264-8f92-031eadd5b211",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "47911f57-ab8a-4a58-b971-197aef3f916a",
        "action": "CREATE_LOCATION",
        "entityType": "LOCATION",
        "entityId": "b92527e8-84f3-4820-bc38-8ddd5433fa45",
        "oldData": null,
        "newData": {
          "id": "b92527e8-84f3-4820-bc38-8ddd5433fa45",
          "name": "Bengaluru HQ 1788107733473",
          "address": null,
          "isActive": true,
          "createdAt": "2026-08-30T16:35:34.085Z",
          "updatedAt": "2026-08-30T16:35:34.085Z",
          "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:35:34.387Z",
        "actor": {
          "id": "47911f57-ab8a-4a58-b971-197aef3f916a",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107723545_5619@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "56481156-2ba3-43f8-8828-c4446ffd0af3",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "47911f57-ab8a-4a58-b971-197aef3f916a",
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
          "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_YB4MuqLJj.png",
          "currency": "INR",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T09:34:04.865Z",
          "updatedAt": "2026-08-30T16:35:29.567Z",
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
          "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_GgSQOsOiVS.png",
          "currency": "INR",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T09:34:04.865Z",
          "updatedAt": "2026-08-30T16:35:32.769Z",
          "postalCode": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:35:32.944Z",
        "actor": {
          "id": "47911f57-ab8a-4a58-b971-197aef3f916a",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107723545_5619@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "d9e89aa0-1860-4986-8ea3-b6481e51d411",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "47911f57-ab8a-4a58-b971-197aef3f916a",
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
          "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_YB4MuqLJj.png",
          "currency": "INR",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T09:34:04.865Z",
          "updatedAt": "2026-08-30T16:22:55.508Z",
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
          "logoUrl": "https://ik.imagekit.io/2bzzjhgkg/hackathon/images/logo_YB4MuqLJj.png",
          "currency": "INR",
          "isActive": true,
          "timezone": "Asia/Kolkata",
          "createdAt": "2026-08-30T09:34:04.865Z",
          "updatedAt": "2026-08-30T16:35:29.567Z",
          "postalCode": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:35:30.016Z",
        "actor": {
          "id": "47911f57-ab8a-4a58-b971-197aef3f916a",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107723545_5619@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "5713a39a-bdda-4807-a958-16ca390bb3eb",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "7b92ff13-15ae-4174-ad92-73166f2bd3a5",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "dbea06b2-126c-4820-b3be-6a12eefdba28",
        "oldData": null,
        "newData": {
          "userId": "ffee360d-dc60-4a00-836d-bdd4cc19bd24",
          "lastName": "Clark",
          "firstName": "George",
          "workEmail": "george.clark13@testorg.dayflow.com",
          "employeeId": "dbea06b2-126c-4820-b3be-6a12eefdba28",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTGECL20260108"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:34:29.492Z",
        "actor": {
          "id": "7b92ff13-15ae-4174-ad92-73166f2bd3a5",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107667253_90587@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "ac80a398-0854-4af7-8dee-9d3723b3de1a",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
        "actorUserId": "799fc205-3d93-4a37-a7d1-80060c800908",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "41e08357-87e5-45ef-ab59-a8104f30183f",
        "oldData": null,
        "newData": {
          "userId": "6360632f-dd2f-4831-87a9-064a9d6107a6",
          "lastName": "Gallagher",
          "firstName": "Fiona",
          "workEmail": "fiona.gallagher15@testorg.dayflow.com",
          "employeeId": "41e08357-87e5-45ef-ab59-a8104f30183f",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTFIGA20260107"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-30T16:33:04.127Z",
        "actor": {
          "id": "799fc205-3d93-4a37-a7d1-80060c800908",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1788107582569_9776@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      }
    ],
    "total": 430,
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
      "totalLogs": 430,
      "topActions": [
        {
          "action": "employee_created",
          "count": 125
        },
        {
          "action": "UPDATE_COMPANY_DETAILS",
          "count": 32
        },
        {
          "action": "employee_password_reset",
          "count": 16
        },
        {
          "action": "employee_deactivated",
          "count": 16
        },
        {
          "action": "employee_activated",
          "count": 16
        }
      ],
      "topEntities": [
        {
          "entityType": "employee",
          "count": 189
        },
        {
          "entityType": "JOB_POSITION",
          "count": 45
        },
        {
          "entityType": "WORK_SCHEDULE",
          "count": 45
        },
        {
          "entityType": "DEPARTMENT",
          "count": 45
        },
        {
          "entityType": "LOCATION",
          "count": 44
        }
      ]
    }
  }
}
```

> **Note**: Aggregates security events by action type and frequency.

---

### 3. Get Audit Log by ID (Admin)

- **Endpoint**: `GET /api/audit-logs/99ac3bf3-1b5a-4e10-8e34-3051917094bb`
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
      "id": "99ac3bf3-1b5a-4e10-8e34-3051917094bb",
      "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1",
      "actorUserId": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
      "action": "DELETE_HOLIDAY",
      "entityType": "HOLIDAY",
      "entityId": "ab3b377b-4289-4252-83b3-19c53d249554",
      "oldData": {
        "id": "ab3b377b-4289-4252-83b3-19c53d249554",
        "name": "Company Foundation Day 1788110699240",
        "createdAt": "2026-08-30T17:24:59.778Z",
        "isOptional": false,
        "description": null,
        "holidayDate": "2036-10-17",
        "organizationId": "144f96a2-86b3-422d-88b1-9fd2a825e9e1"
      },
      "newData": null,
      "ipAddress": "::ffff:127.0.0.1",
      "userAgent": null,
      "createdAt": "2026-08-30T17:25:02.153Z",
      "actor": {
        "id": "294e6dcf-e8ba-440c-93ca-2b0d4c13a6d3",
        "firstName": "Test",
        "lastName": "User",
        "email": "test_user_1788110672098_18306@example.com",
        "role": "admin"
      }
    }
  }
}
```

> **Note**: Retrieves complete before/after state diff and actor metadata.

---

### 4. Get Entity Audit History (Admin)

- **Endpoint**: `GET /api/audit-logs/entity/employee/8486abb8-a278-456b-bc46-8ea055028cb2`
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
  "message": "Broadcast sent to 375 recipients",
  "success": true,
  "error": null,
  "data": {
    "sentCount": 375
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
        "id": "419cdb43-ca6d-4565-96e2-0a8c503312aa",
        "userId": "8486abb8-a278-456b-bc46-8ea055028cb2",
        "type": "system_alert",
        "title": "System Maintenance Notice",
        "message": "Scheduled maintenance will take place this Sunday at midnight.",
        "referenceType": "BROADCAST",
        "referenceId": null,
        "isRead": false,
        "createdAt": "2026-08-30T17:25:15.281Z",
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

- **Endpoint**: `PATCH /api/notifications/419cdb43-ca6d-4565-96e2-0a8c503312aa/read`
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
      "id": "419cdb43-ca6d-4565-96e2-0a8c503312aa",
      "userId": "8486abb8-a278-456b-bc46-8ea055028cb2",
      "type": "system_alert",
      "title": "System Maintenance Notice",
      "message": "Scheduled maintenance will take place this Sunday at midnight.",
      "referenceType": "BROADCAST",
      "referenceId": null,
      "isRead": true,
      "createdAt": "2026-08-30T17:25:15.281Z",
      "readAt": "2026-08-30T17:25:19.389Z"
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

- **Endpoint**: `DELETE /api/notifications/419cdb43-ca6d-4565-96e2-0a8c503312aa`
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
      "id": "419cdb43-ca6d-4565-96e2-0a8c503312aa",
      "userId": "8486abb8-a278-456b-bc46-8ea055028cb2",
      "type": "system_alert",
      "title": "System Maintenance Notice",
      "message": "Scheduled maintenance will take place this Sunday at midnight.",
      "referenceType": "BROADCAST",
      "referenceId": null,
      "isRead": true,
      "createdAt": "2026-08-30T17:25:15.281Z",
      "readAt": "2026-08-30T17:25:19.389Z"
    }
  }
}
```

> **Note**: Permanently removes dismissed notification from user inbox.

---

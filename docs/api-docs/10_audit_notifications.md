# Feature 10: Audit Logs & Notifications API

> Covers immutable audit trail inspection, activity metrics, employee in-app notifications, and admin broadcast alerts.

## 📋 Endpoints Overview

| Method  | Endpoint                          | Scenario                                | Status |
| :------ | :-------------------------------- | :-------------------------------------- | :----- |
| `GET`   | `/api/audit-logs`                 | List Audit Logs (Admin)                 | `200`  |
| `GET`   | `/api/audit-logs/stats`           | Get Audit Activity Stats (Admin)        | `200`  |
| `GET`   | `/api/notifications`              | Get My Notifications (Success)          | `200`  |
| `GET`   | `/api/notifications/unread-count` | Get Unread Notification Count (Success) | `200`  |
| `PATCH` | `/api/notifications/read-all`     | Mark All Notifications Read (Success)   | `200`  |
| `POST`  | `/api/notifications/broadcast`    | Broadcast Notification (Admin)          | `200`  |

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
        "id": "9cf54e69-24d6-41fb-b9cd-7caf42062bb4",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "677c6a0a-89ae-4e9e-a5bf-a0cc80ea70f3",
        "action": "CREATE_HOLIDAY",
        "entityType": "HOLIDAY",
        "entityId": "cb1aec24-cb25-4a1b-a183-8715c8c9ad7d",
        "oldData": null,
        "newData": {
          "id": "cb1aec24-cb25-4a1b-a183-8715c8c9ad7d",
          "name": "Company Foundation Day 1787998115103",
          "createdAt": "2026-08-29T10:08:36.328Z",
          "isOptional": false,
          "description": null,
          "holidayDate": "2034-10-15",
          "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T10:08:36.538Z",
        "actor": {
          "id": "677c6a0a-89ae-4e9e-a5bf-a0cc80ea70f3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787998109468_61911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "4d6eba86-a15b-49b5-8db1-219a80fd5022",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "677c6a0a-89ae-4e9e-a5bf-a0cc80ea70f3",
        "action": "CREATE_JOB_POSITION",
        "entityType": "JOB_POSITION",
        "entityId": "5bebc569-1fbb-48b0-b7de-4e1d696c4e2b",
        "oldData": null,
        "newData": {
          "id": "5bebc569-1fbb-48b0-b7de-4e1d696c4e2b",
          "name": "Senior Fullstack Developer 1787998113762",
          "isActive": true,
          "createdAt": "2026-08-29T10:08:34.888Z",
          "updatedAt": "2026-08-29T10:08:34.888Z",
          "description": null,
          "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T10:08:35.048Z",
        "actor": {
          "id": "677c6a0a-89ae-4e9e-a5bf-a0cc80ea70f3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787998109468_61911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "710c8d25-db12-4c37-8790-48638cf9d2f4",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "677c6a0a-89ae-4e9e-a5bf-a0cc80ea70f3",
        "action": "CREATE_DEPARTMENT",
        "entityType": "DEPARTMENT",
        "entityId": "0cd92bf0-da5d-4c69-a6dd-1bdb4c4fd4c6",
        "oldData": null,
        "newData": {
          "id": "0cd92bf0-da5d-4c69-a6dd-1bdb4c4fd4c6",
          "code": "ENG_1787998111214",
          "name": "Engineering 1787998111214",
          "isActive": true,
          "createdAt": "2026-08-29T10:08:32.343Z",
          "updatedAt": "2026-08-29T10:08:32.343Z",
          "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
          "managerEmployeeId": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T10:08:32.508Z",
        "actor": {
          "id": "677c6a0a-89ae-4e9e-a5bf-a0cc80ea70f3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787998109468_61911@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "2978126e-d52f-4487-82b8-4c5cbf52732a",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "9b4c687e-7bef-4121-9c2e-3e588504f25e",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "6a957c6a-586e-446e-8b48-94c542419830",
        "oldData": null,
        "newData": {
          "userId": "37fbfc8e-f4c2-4f6e-9f5e-147d7557b403",
          "lastName": "Gallagher",
          "firstName": "Fiona",
          "workEmail": "fiona.gallagher4@testorg.dayflow.com",
          "employeeId": "6a957c6a-586e-446e-8b48-94c542419830",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTFIGA20260025"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T10:07:38.152Z",
        "actor": {
          "id": "9b4c687e-7bef-4121-9c2e-3e588504f25e",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787998055789_56427@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "c1465be0-06af-4afd-b5a9-2a3635f1f644",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "a01e3d51-17dd-450c-a5f6-c3f8b0c60e02",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "c31818a1-7b3a-482d-b4a4-b8e09bcbf74b",
        "oldData": null,
        "newData": {
          "userId": "610adbb2-f8fc-415e-9f36-3cd5ba40aaa0",
          "lastName": "Hunt",
          "firstName": "Ethan",
          "workEmail": "ethan.hunt3@testorg.dayflow.com",
          "employeeId": "c31818a1-7b3a-482d-b4a4-b8e09bcbf74b",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTETHU20260024"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T10:07:15.520Z",
        "actor": {
          "id": "a01e3d51-17dd-450c-a5f6-c3f8b0c60e02",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787998033802_34072@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "505eadb9-b7a6-475f-94ed-4895587bb384",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "af8907b1-bf86-4dce-89f6-aec4967fa8c9",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "bbbc6667-f2e6-444f-9e1d-998399e80caa",
        "oldData": null,
        "newData": {
          "userId": "3f19e7b8-5b60-471f-a51c-1dfd03070648",
          "lastName": "Prince",
          "firstName": "Diana",
          "workEmail": "diana.prince4@testorg.dayflow.com",
          "employeeId": "bbbc6667-f2e6-444f-9e1d-998399e80caa",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTDIPR20260023"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T10:06:53.710Z",
        "actor": {
          "id": "af8907b1-bf86-4dce-89f6-aec4967fa8c9",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787998011875_3902@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "98450622-d98c-4592-8523-d6f25e919516",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "00ebd448-b749-4bf6-9a06-3727ae4a883e",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "2416dbfb-ee51-40b1-89fb-9f23b9037bca",
        "oldData": null,
        "newData": {
          "userId": "27d8b09e-32a7-4fd7-ac20-32041a06d925",
          "lastName": "Davis",
          "firstName": "Charlie",
          "workEmail": "charlie.davis4@testorg.dayflow.com",
          "employeeId": "2416dbfb-ee51-40b1-89fb-9f23b9037bca",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTCHDA20260022"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T10:06:30.154Z",
        "actor": {
          "id": "00ebd448-b749-4bf6-9a06-3727ae4a883e",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787997988425_6483@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "d7758a72-3e30-4265-ac27-44d02838f77f",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "abc057fd-b9b5-4f4f-9089-da4d45d1441c",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "b6f49d8a-d1f7-4207-9d84-eff800ea105f",
        "oldData": null,
        "newData": {
          "userId": "a54f95b7-7411-4d24-ac14-df871ba90fb6",
          "lastName": "Johnson",
          "firstName": "Bob",
          "workEmail": "bob.johnson4@testorg.dayflow.com",
          "employeeId": "b6f49d8a-d1f7-4207-9d84-eff800ea105f",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTBOJO20260021"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T10:06:03.639Z",
        "actor": {
          "id": "abc057fd-b9b5-4f4f-9089-da4d45d1441c",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787997961391_48753@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "5ca5b937-cedf-4b06-bb5e-415f5b6bd1ce",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "01560e19-5dd9-4414-9321-b231d46cab70",
        "action": "employee_password_reset",
        "entityType": "employee",
        "entityId": "d3ec1d32-9d96-48cf-8e9a-069b797737f5",
        "oldData": null,
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T10:05:53.741Z",
        "actor": {
          "id": "01560e19-5dd9-4414-9321-b231d46cab70",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787997935386_97382@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "f05dde0d-1cfc-4aa0-8a9e-e5535256efe5",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "01560e19-5dd9-4414-9321-b231d46cab70",
        "action": "employee_activated",
        "entityType": "employee",
        "entityId": "d3ec1d32-9d96-48cf-8e9a-069b797737f5",
        "oldData": null,
        "newData": {
          "isActive": true
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T10:05:51.501Z",
        "actor": {
          "id": "01560e19-5dd9-4414-9321-b231d46cab70",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787997935386_97382@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "2877dacf-6d6d-456c-85ed-64a034177328",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "01560e19-5dd9-4414-9321-b231d46cab70",
        "action": "employee_deactivated",
        "entityType": "employee",
        "entityId": "d3ec1d32-9d96-48cf-8e9a-069b797737f5",
        "oldData": null,
        "newData": {
          "isActive": false
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T10:05:49.811Z",
        "actor": {
          "id": "01560e19-5dd9-4414-9321-b231d46cab70",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787997935386_97382@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "81bd6819-5034-4a78-be21-38ea3a976b14",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "01560e19-5dd9-4414-9321-b231d46cab70",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "d3ec1d32-9d96-48cf-8e9a-069b797737f5",
        "oldData": null,
        "newData": {
          "userId": "5a99b220-4c7e-4448-9459-228692417bd2",
          "lastName": "Smith",
          "firstName": "Alice",
          "workEmail": "alice.smith3@testorg.dayflow.com",
          "employeeId": "d3ec1d32-9d96-48cf-8e9a-069b797737f5",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTALSM20260020"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T10:05:37.941Z",
        "actor": {
          "id": "01560e19-5dd9-4414-9321-b231d46cab70",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787997935386_97382@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "315111b2-4403-4ec4-a9fa-a6472a68a87c",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "537eafc2-3a67-43ef-8e01-9609910fe772",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "c89b5b83-7e4f-4412-a89f-e3e2ef0a34a3",
        "oldData": null,
        "newData": {
          "userId": "8c412279-8824-4a78-985b-3d51a82f7e9a",
          "lastName": "Gallagher",
          "firstName": "Fiona",
          "workEmail": "fiona.gallagher3@testorg.dayflow.com",
          "employeeId": "c89b5b83-7e4f-4412-a89f-e3e2ef0a34a3",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTFIGA20260019"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T10:04:51.362Z",
        "actor": {
          "id": "537eafc2-3a67-43ef-8e01-9609910fe772",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787997889405_47821@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "948152a0-7413-446d-bd8b-9a2d805e2534",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "04cc86a6-0ef5-4c7d-aa83-005f1ade00ac",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "eaa11093-5830-4fc5-ad15-1cd7f8a528e4",
        "oldData": null,
        "newData": {
          "userId": "a69ed141-47b9-49cb-abb5-61d3b4477b6f",
          "lastName": "Johnson",
          "firstName": "Bob",
          "workEmail": "bob.johnson3@testorg.dayflow.com",
          "employeeId": "eaa11093-5830-4fc5-ad15-1cd7f8a528e4",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTBOJO20260019"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T10:04:51.357Z",
        "actor": {
          "id": "04cc86a6-0ef5-4c7d-aa83-005f1ade00ac",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787997889405_54614@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "ccafe623-69f8-4936-a2f0-ebbb42b8d7ba",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "28390f61-7679-4cf7-a840-e7854c2df8c8",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "4f717085-cf34-4b68-bb40-505c214c27de",
        "oldData": null,
        "newData": {
          "userId": "ad14039b-03b8-432d-be77-4552a1d114f2",
          "lastName": "Prince",
          "firstName": "Diana",
          "workEmail": "diana.prince3@testorg.dayflow.com",
          "employeeId": "4f717085-cf34-4b68-bb40-505c214c27de",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTDIPR20260019"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T10:04:51.356Z",
        "actor": {
          "id": "28390f61-7679-4cf7-a840-e7854c2df8c8",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787997889405_25155@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "e4747eba-8a97-4e88-a4f7-846f5a607d45",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "341cbc3f-a358-4573-aec3-ba5801ebd1fe",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "aacacd73-0c48-4d34-8643-4d04882d0b81",
        "oldData": null,
        "newData": {
          "userId": "da70e146-c3e5-4ddc-98c4-6fec8fd5617d",
          "lastName": "Davis",
          "firstName": "Charlie",
          "workEmail": "charlie.davis3@testorg.dayflow.com",
          "employeeId": "aacacd73-0c48-4d34-8643-4d04882d0b81",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTCHDA20260019"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T10:04:51.351Z",
        "actor": {
          "id": "341cbc3f-a358-4573-aec3-ba5801ebd1fe",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787997889405_15559@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "70e4abc1-224e-42a6-a0f4-d0a6471059da",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "36088c6c-f77b-4a99-a017-6c8e293c4d46",
        "action": "CREATE_HOLIDAY",
        "entityType": "HOLIDAY",
        "entityId": "8fd3eca6-7ed0-46a3-bfa7-d4e7d538c1ec",
        "oldData": null,
        "newData": {
          "id": "8fd3eca6-7ed0-46a3-bfa7-d4e7d538c1ec",
          "name": "Company Foundation Day 1787997501083",
          "createdAt": "2026-08-29T09:58:22.760Z",
          "isOptional": false,
          "description": null,
          "holidayDate": "2034-10-05",
          "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:58:22.990Z",
        "actor": {
          "id": "36088c6c-f77b-4a99-a017-6c8e293c4d46",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787997485474_88712@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "ec01e7d5-847e-46e9-97e6-1fb57ebd140e",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "36088c6c-f77b-4a99-a017-6c8e293c4d46",
        "action": "CREATE_JOB_POSITION",
        "entityType": "JOB_POSITION",
        "entityId": "8ab3f892-ea16-45f1-aed8-0ae99aeccefa",
        "oldData": null,
        "newData": {
          "id": "8ab3f892-ea16-45f1-aed8-0ae99aeccefa",
          "name": "Senior Fullstack Developer 1787997495746",
          "isActive": true,
          "createdAt": "2026-08-29T09:58:20.070Z",
          "updatedAt": "2026-08-29T09:58:20.070Z",
          "description": null,
          "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:58:21.095Z",
        "actor": {
          "id": "36088c6c-f77b-4a99-a017-6c8e293c4d46",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787997485474_88712@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "8f6625b4-465f-47c2-8afe-a836f14775ed",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "36088c6c-f77b-4a99-a017-6c8e293c4d46",
        "action": "CREATE_DEPARTMENT",
        "entityType": "DEPARTMENT",
        "entityId": "9bff2d77-1ce7-4aeb-8166-56e663e97131",
        "oldData": null,
        "newData": {
          "id": "9bff2d77-1ce7-4aeb-8166-56e663e97131",
          "code": "ENG_1787997490949",
          "name": "Engineering 1787997490949",
          "isActive": true,
          "createdAt": "2026-08-29T09:58:13.850Z",
          "updatedAt": "2026-08-29T09:58:13.850Z",
          "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
          "managerEmployeeId": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:58:14.560Z",
        "actor": {
          "id": "36088c6c-f77b-4a99-a017-6c8e293c4d46",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787997485474_88712@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "cada2c51-f130-43cb-b9c9-b7ac098b5fb3",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "6c08e664-b42f-450e-ba87-970503a68f44",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "58d5dc1b-16b3-44d6-be02-68f60b6cece2",
        "oldData": null,
        "newData": {
          "userId": "db8b49c6-7569-439d-b9e7-f9567c65e798",
          "lastName": "Gallagher",
          "firstName": "Fiona",
          "workEmail": "fiona.gallagher2@testorg.dayflow.com",
          "employeeId": "58d5dc1b-16b3-44d6-be02-68f60b6cece2",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTFIGA20260018"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:54:54.271Z",
        "actor": {
          "id": "6c08e664-b42f-450e-ba87-970503a68f44",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787997286883_78148@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "b445554a-f909-403d-89c5-0d3e27be6a9d",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "c225a38d-fe2c-4329-947e-4a12c690706e",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "c803da02-6eb2-4cfa-bbc0-10453f1acedd",
        "oldData": null,
        "newData": {
          "userId": "57b6d6a1-b67b-49dc-8851-cec68eaa52ab",
          "lastName": "Hunt",
          "firstName": "Ethan",
          "workEmail": "ethan.hunt2@testorg.dayflow.com",
          "employeeId": "c803da02-6eb2-4cfa-bbc0-10453f1acedd",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTETHU20260017"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:53:38.956Z",
        "actor": {
          "id": "c225a38d-fe2c-4329-947e-4a12c690706e",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787997208311_86305@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "94f80c95-9c9c-48b4-9057-1e1a274cfc9c",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "947f3171-9974-4e4e-954d-f5a1303f90e6",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "0f887318-a67e-4343-8327-d15edb65d250",
        "oldData": null,
        "newData": {
          "userId": "500f7910-9bc4-46f5-8679-12891450c54d",
          "lastName": "Prince",
          "firstName": "Diana",
          "workEmail": "diana.prince2@testorg.dayflow.com",
          "employeeId": "0f887318-a67e-4343-8327-d15edb65d250",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTDIPR20260016"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:52:03.420Z",
        "actor": {
          "id": "947f3171-9974-4e4e-954d-f5a1303f90e6",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787997120193_80973@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "5178d697-57de-4f18-874d-bbd432fca161",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "0160e547-4dab-4bdc-bcd1-14daa46fb4e0",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "1ca8f64e-02a2-4900-809b-3d2f3018f03d",
        "oldData": null,
        "newData": {
          "userId": "b22db0f0-0249-4d2c-b162-2011cf21e86e",
          "lastName": "Davis",
          "firstName": "Charlie",
          "workEmail": "charlie.davis2@testorg.dayflow.com",
          "employeeId": "1ca8f64e-02a2-4900-809b-3d2f3018f03d",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTCHDA20260015"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:50:28.740Z",
        "actor": {
          "id": "0160e547-4dab-4bdc-bcd1-14daa46fb4e0",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787997025280_35833@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "ecd03b7c-36fa-4552-87d1-e091b7747c3a",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "bcd7529d-19a8-40dd-8581-d9683f271e04",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "9f2873f8-a63d-4c2e-a29f-b0fb3ad57499",
        "oldData": null,
        "newData": {
          "userId": "4c5f82b0-3741-4781-8e62-34a68e701262",
          "lastName": "Johnson",
          "firstName": "Bob",
          "workEmail": "bob.johnson2@testorg.dayflow.com",
          "employeeId": "9f2873f8-a63d-4c2e-a29f-b0fb3ad57499",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTBOJO20260014"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:48:49.311Z",
        "actor": {
          "id": "bcd7529d-19a8-40dd-8581-d9683f271e04",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787996922140_74491@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "8e043e69-f003-4b84-bce0-03d7725b6ad1",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "3a3affde-df09-4596-a566-28b3d6d4efc5",
        "action": "employee_password_reset",
        "entityType": "employee",
        "entityId": "ab42ff82-5021-49a2-b97c-be9297900a71",
        "oldData": null,
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:47:13.664Z",
        "actor": {
          "id": "3a3affde-df09-4596-a566-28b3d6d4efc5",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787996791538_789@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "c8f02aa8-e180-45f1-9996-fc3f8e5d7992",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "3a3affde-df09-4596-a566-28b3d6d4efc5",
        "action": "employee_activated",
        "entityType": "employee",
        "entityId": "ab42ff82-5021-49a2-b97c-be9297900a71",
        "oldData": null,
        "newData": {
          "isActive": true
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:47:07.819Z",
        "actor": {
          "id": "3a3affde-df09-4596-a566-28b3d6d4efc5",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787996791538_789@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "3c2ff518-aba1-4ccb-9cac-9c0f3e66f491",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "3a3affde-df09-4596-a566-28b3d6d4efc5",
        "action": "employee_deactivated",
        "entityType": "employee",
        "entityId": "ab42ff82-5021-49a2-b97c-be9297900a71",
        "oldData": null,
        "newData": {
          "isActive": false
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:47:05.350Z",
        "actor": {
          "id": "3a3affde-df09-4596-a566-28b3d6d4efc5",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787996791538_789@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "8ac05430-adf8-4954-8122-e09fe7d9ea4b",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "3a3affde-df09-4596-a566-28b3d6d4efc5",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "ab42ff82-5021-49a2-b97c-be9297900a71",
        "oldData": null,
        "newData": {
          "userId": "90b199f8-9450-406d-8d10-7f56faa570c1",
          "lastName": "Smith",
          "firstName": "Alice",
          "workEmail": "alice.smith2@testorg.dayflow.com",
          "employeeId": "ab42ff82-5021-49a2-b97c-be9297900a71",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTALSM20260013"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:46:40.493Z",
        "actor": {
          "id": "3a3affde-df09-4596-a566-28b3d6d4efc5",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787996791538_789@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "39979af5-d280-491f-87b3-2d87230917b9",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "8ef46ff5-13da-4305-849b-2883fe4e1b32",
        "action": "CREATE_JOB_POSITION",
        "entityType": "JOB_POSITION",
        "entityId": "c6d81e01-fb26-4296-82ca-232be9f13376",
        "oldData": null,
        "newData": {
          "id": "c6d81e01-fb26-4296-82ca-232be9f13376",
          "name": "Senior Fullstack Developer 1787995799257",
          "isActive": true,
          "createdAt": "2026-08-29T09:30:00.348Z",
          "updatedAt": "2026-08-29T09:30:00.348Z",
          "description": null,
          "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:30:00.508Z",
        "actor": {
          "id": "8ef46ff5-13da-4305-849b-2883fe4e1b32",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995795616_12072@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "a7b1d246-bd1e-4d09-be4a-16364df8f79b",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "8ef46ff5-13da-4305-849b-2883fe4e1b32",
        "action": "CREATE_DEPARTMENT",
        "entityType": "DEPARTMENT",
        "entityId": "282fdfd2-b8cb-4c34-be62-8773ea17d1bc",
        "oldData": null,
        "newData": {
          "id": "282fdfd2-b8cb-4c34-be62-8773ea17d1bc",
          "code": "ENG_1787995797181",
          "name": "Engineering 1787995797181",
          "isActive": true,
          "createdAt": "2026-08-29T09:29:58.268Z",
          "updatedAt": "2026-08-29T09:29:58.268Z",
          "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
          "managerEmployeeId": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:29:58.428Z",
        "actor": {
          "id": "8ef46ff5-13da-4305-849b-2883fe4e1b32",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995795616_12072@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "7d3b3702-a566-4250-ba82-cac3cb92e0ea",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "0ca154d2-5e5d-46b2-986c-f432d422cedc",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "8038cb03-cd1b-412c-8d30-cd1740a5a154",
        "oldData": null,
        "newData": {
          "userId": "c7cce343-5763-4b4d-a8bf-666e5d6a58e2",
          "lastName": "Gallagher",
          "firstName": "Fiona",
          "workEmail": "fiona.gallagher1@testorg.dayflow.com",
          "employeeId": "8038cb03-cd1b-412c-8d30-cd1740a5a154",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTFIGA20260012"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:29:19.369Z",
        "actor": {
          "id": "0ca154d2-5e5d-46b2-986c-f432d422cedc",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995757885_32542@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "0efce23a-300d-4037-a330-eb43b5f26140",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "af8b5d82-b214-4bc9-a89e-fb7382a1a455",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "702aad4b-3ca3-4b1f-a2bd-d8ca319b3a99",
        "oldData": null,
        "newData": {
          "userId": "158fc6a0-2703-41f8-a74f-a71493794ae1",
          "lastName": "Hunt",
          "firstName": "Ethan",
          "workEmail": "ethan.hunt1@testorg.dayflow.com",
          "employeeId": "702aad4b-3ca3-4b1f-a2bd-d8ca319b3a99",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTETHU20260011"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:29:04.183Z",
        "actor": {
          "id": "af8b5d82-b214-4bc9-a89e-fb7382a1a455",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995742615_15895@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "9913da92-aba5-4b3f-84e5-84342a8336cb",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "7e34b2a5-e86e-4362-ba1b-428c6056f9b9",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "04b428ea-adbf-447b-9901-def0a5bba06a",
        "oldData": null,
        "newData": {
          "userId": "8007a8e6-2ead-41af-a2b3-e8f8bf1c4e70",
          "lastName": "Prince",
          "firstName": "Diana",
          "workEmail": "diana.prince1@testorg.dayflow.com",
          "employeeId": "04b428ea-adbf-447b-9901-def0a5bba06a",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTDIPR20260010"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:28:51.393Z",
        "actor": {
          "id": "7e34b2a5-e86e-4362-ba1b-428c6056f9b9",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995729948_20672@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "d92ee25e-0d94-491c-9399-ce8d9c9821b1",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "02ce6e0a-29f6-4ec1-9e9f-819c5130ec8f",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "a46b35e4-8746-43ad-8e01-d5d01eda157f",
        "oldData": null,
        "newData": {
          "userId": "6e7c28e0-816f-435f-8bc9-67c989ac970c",
          "lastName": "Davis",
          "firstName": "Charlie",
          "workEmail": "charlie.davis1@testorg.dayflow.com",
          "employeeId": "a46b35e4-8746-43ad-8e01-d5d01eda157f",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTCHDA20260009"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:28:39.033Z",
        "actor": {
          "id": "02ce6e0a-29f6-4ec1-9e9f-819c5130ec8f",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995717544_96203@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "77efe7f1-bbbb-4692-aa59-e2482386be5a",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "d6f13504-4e63-40c4-bfca-9767a1cb28c7",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "078f51f5-ff19-4233-9552-ae3df52d51ce",
        "oldData": null,
        "newData": {
          "userId": "0141c67e-3e22-42e8-98c6-9cd45c8f5000",
          "lastName": "Johnson",
          "firstName": "Bob",
          "workEmail": "bob.johnson1@testorg.dayflow.com",
          "employeeId": "078f51f5-ff19-4233-9552-ae3df52d51ce",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTBOJO20260008"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:28:27.393Z",
        "actor": {
          "id": "d6f13504-4e63-40c4-bfca-9767a1cb28c7",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995705761_72527@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "5325cfa6-4194-41f6-ae4c-1931c4bbbc24",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "141fd19b-e72d-4e17-ab59-675fb9a520f7",
        "action": "employee_password_reset",
        "entityType": "employee",
        "entityId": "f92e3067-be20-4bec-a09b-07aa7ebbd0b1",
        "oldData": null,
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:28:20.424Z",
        "actor": {
          "id": "141fd19b-e72d-4e17-ab59-675fb9a520f7",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995685992_32435@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "dec1b3cd-6f47-415a-9238-bfa0a1a3217c",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "141fd19b-e72d-4e17-ab59-675fb9a520f7",
        "action": "employee_activated",
        "entityType": "employee",
        "entityId": "f92e3067-be20-4bec-a09b-07aa7ebbd0b1",
        "oldData": null,
        "newData": {
          "isActive": true
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:28:18.749Z",
        "actor": {
          "id": "141fd19b-e72d-4e17-ab59-675fb9a520f7",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995685992_32435@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "245ffa21-8830-4986-addf-ee2fd0212d6e",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "141fd19b-e72d-4e17-ab59-675fb9a520f7",
        "action": "employee_deactivated",
        "entityType": "employee",
        "entityId": "f92e3067-be20-4bec-a09b-07aa7ebbd0b1",
        "oldData": null,
        "newData": {
          "isActive": false
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:28:17.124Z",
        "actor": {
          "id": "141fd19b-e72d-4e17-ab59-675fb9a520f7",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995685992_32435@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "484f4de0-e079-485a-af5c-31446379530b",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "141fd19b-e72d-4e17-ab59-675fb9a520f7",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "f92e3067-be20-4bec-a09b-07aa7ebbd0b1",
        "oldData": null,
        "newData": {
          "userId": "6ee19fb0-61da-425f-b71f-3ed3cbf87709",
          "lastName": "Smith",
          "firstName": "Alice",
          "workEmail": "alice.smith1@testorg.dayflow.com",
          "employeeId": "f92e3067-be20-4bec-a09b-07aa7ebbd0b1",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTALSM20260007"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:28:08.182Z",
        "actor": {
          "id": "141fd19b-e72d-4e17-ab59-675fb9a520f7",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995685992_32435@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "04516e1e-3b82-4ad6-b69a-1398a5def0d9",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "5b71fa87-9353-4511-9e62-318917873cee",
        "action": "CREATE_HOLIDAY",
        "entityType": "HOLIDAY",
        "entityId": "f91aa7eb-df70-4b6b-b1c6-275f9d1f0ee9",
        "oldData": null,
        "newData": {
          "id": "f91aa7eb-df70-4b6b-b1c6-275f9d1f0ee9",
          "name": "Company Foundation Day 1787995277825",
          "createdAt": "2026-08-29T09:21:18.886Z",
          "isOptional": false,
          "description": null,
          "holidayDate": "2026-10-02",
          "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:21:19.046Z",
        "actor": {
          "id": "5b71fa87-9353-4511-9e62-318917873cee",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995272845_60104@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "67a0f712-1148-4afb-89c7-8c1009048ab4",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "5b71fa87-9353-4511-9e62-318917873cee",
        "action": "CREATE_JOB_POSITION",
        "entityType": "JOB_POSITION",
        "entityId": "0602c817-ce7e-4bd0-a8e5-829fc475d95b",
        "oldData": null,
        "newData": {
          "id": "0602c817-ce7e-4bd0-a8e5-829fc475d95b",
          "name": "Senior Fullstack Developer 1787995276808",
          "isActive": true,
          "createdAt": "2026-08-29T09:21:17.801Z",
          "updatedAt": "2026-08-29T09:21:17.801Z",
          "description": null,
          "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:21:17.961Z",
        "actor": {
          "id": "5b71fa87-9353-4511-9e62-318917873cee",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995272845_60104@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "7fa5bfe8-bf83-44b6-af34-73e76d774937",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "5b71fa87-9353-4511-9e62-318917873cee",
        "action": "CREATE_DEPARTMENT",
        "entityType": "DEPARTMENT",
        "entityId": "f094e735-bfd0-416f-b861-06d19fdcde32",
        "oldData": null,
        "newData": {
          "id": "f094e735-bfd0-416f-b861-06d19fdcde32",
          "code": "ENG_1787995274781",
          "name": "Engineering 1787995274781",
          "isActive": true,
          "createdAt": "2026-08-29T09:21:15.866Z",
          "updatedAt": "2026-08-29T09:21:15.866Z",
          "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
          "managerEmployeeId": null
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:21:16.026Z",
        "actor": {
          "id": "5b71fa87-9353-4511-9e62-318917873cee",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995272845_60104@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "9853d337-b0e9-45c2-8e62-13e3e1955820",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "a0e702a5-4e4e-4a7c-8a63-17f4068417a3",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "872b2496-a251-47f0-8771-d43efe7fad5f",
        "oldData": null,
        "newData": {
          "userId": "b6572801-61fd-4372-b7a7-30eeb39162c7",
          "lastName": "Johnson",
          "firstName": "Bob",
          "workEmail": "bob.johnson@testorg.dayflow.com",
          "employeeId": "872b2496-a251-47f0-8771-d43efe7fad5f",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTBOJO20260006"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:21:02.103Z",
        "actor": {
          "id": "a0e702a5-4e4e-4a7c-8a63-17f4068417a3",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995260543_53711@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "1ec831b3-ee2b-435d-b723-ddb41833de88",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "c6ab68f4-6d5e-44f6-92fe-84f1b1336b45",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "7de9ec31-b7c1-4545-84c7-d8c2b80219cf",
        "oldData": null,
        "newData": {
          "userId": "878cfdec-6996-4158-8c79-7e082208ed84",
          "lastName": "Davis",
          "firstName": "Charlie",
          "workEmail": "charlie.davis@testorg.dayflow.com",
          "employeeId": "7de9ec31-b7c1-4545-84c7-d8c2b80219cf",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTCHDA20260005"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:20:49.943Z",
        "actor": {
          "id": "c6ab68f4-6d5e-44f6-92fe-84f1b1336b45",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995247799_54974@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "ddbd5c24-4fbf-457f-8a81-53d02a466990",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "656a0bc9-e5f8-4878-b07a-0e16fdf9e7fc",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "e1020771-0ed1-4c46-9f68-c9ee77aab978",
        "oldData": null,
        "newData": {
          "userId": "154535d8-b256-469b-869a-ff27008f69c7",
          "lastName": "Hunt",
          "firstName": "Ethan",
          "workEmail": "ethan.hunt@testorg.dayflow.com",
          "employeeId": "e1020771-0ed1-4c46-9f68-c9ee77aab978",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTETHU20260004"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:20:35.464Z",
        "actor": {
          "id": "656a0bc9-e5f8-4878-b07a-0e16fdf9e7fc",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995233821_21068@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "aeb127e9-f9da-4858-a603-2184e8304a6f",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "40c470fe-8970-4882-a8c7-57eb616536a9",
        "action": "employee_password_reset",
        "entityType": "employee",
        "entityId": "b8833954-9cc1-4503-8517-f91c0b704067",
        "oldData": null,
        "newData": null,
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:20:27.499Z",
        "actor": {
          "id": "40c470fe-8970-4882-a8c7-57eb616536a9",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995213191_55168@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "c5695638-7f97-4e0d-ae40-62e4d6ea61a1",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "40c470fe-8970-4882-a8c7-57eb616536a9",
        "action": "employee_activated",
        "entityType": "employee",
        "entityId": "b8833954-9cc1-4503-8517-f91c0b704067",
        "oldData": null,
        "newData": {
          "isActive": true
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:20:25.699Z",
        "actor": {
          "id": "40c470fe-8970-4882-a8c7-57eb616536a9",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995213191_55168@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "4162421a-d848-4e37-8ba9-8747e550bc62",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "40c470fe-8970-4882-a8c7-57eb616536a9",
        "action": "employee_deactivated",
        "entityType": "employee",
        "entityId": "b8833954-9cc1-4503-8517-f91c0b704067",
        "oldData": null,
        "newData": {
          "isActive": false
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:20:24.319Z",
        "actor": {
          "id": "40c470fe-8970-4882-a8c7-57eb616536a9",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995213191_55168@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "da307c5b-b302-4a7e-b8e0-dd247cc45bfa",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "40c470fe-8970-4882-a8c7-57eb616536a9",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "b8833954-9cc1-4503-8517-f91c0b704067",
        "oldData": null,
        "newData": {
          "userId": "d275f542-320f-4058-8084-88d02cca0138",
          "lastName": "Smith",
          "firstName": "Alice",
          "workEmail": "alice.smith@testorg.dayflow.com",
          "employeeId": "b8833954-9cc1-4503-8517-f91c0b704067",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTALSM20260003"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:20:15.234Z",
        "actor": {
          "id": "40c470fe-8970-4882-a8c7-57eb616536a9",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995213191_55168@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      },
      {
        "id": "34d64de4-f8a1-4a02-8a3c-d74b877c9dc3",
        "organizationId": "60e50682-c7d3-45ff-9fca-34951308c63a",
        "actorUserId": "db6d9d8b-6a2f-4e97-9853-b9e2e319bac1",
        "action": "employee_created",
        "entityType": "employee",
        "entityId": "0cb0f938-4828-4c4e-aeb9-da890704f68b",
        "oldData": null,
        "newData": {
          "userId": "35bf8266-9cc8-4b3f-aff0-2869d2c3f70f",
          "lastName": "Prince",
          "firstName": "Diana",
          "workEmail": "diana.prince@testorg.dayflow.com",
          "employeeId": "0cb0f938-4828-4c4e-aeb9-da890704f68b",
          "joiningDate": "2026-08-01",
          "employeeCode": "TESTDIPR20260002"
        },
        "ipAddress": "::ffff:127.0.0.1",
        "userAgent": null,
        "createdAt": "2026-08-29T09:19:59.569Z",
        "actor": {
          "id": "db6d9d8b-6a2f-4e97-9853-b9e2e319bac1",
          "firstName": "Test",
          "lastName": "User",
          "email": "test_user_1787995198095_91645@example.com",
          "role": "admin",
          "profileImage": "https://ik.imagekit.io/2bzzjhgkg/defaul_profile_image.jpeg"
        }
      }
    ],
    "total": 51,
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
      "totalLogs": 51,
      "topActions": [
        {
          "action": "employee_created",
          "count": 28
        },
        {
          "action": "CREATE_JOB_POSITION",
          "count": 4
        },
        {
          "action": "CREATE_DEPARTMENT",
          "count": 4
        },
        {
          "action": "employee_activated",
          "count": 4
        },
        {
          "action": "employee_password_reset",
          "count": 4
        }
      ],
      "topEntities": [
        {
          "entityType": "employee",
          "count": 40
        },
        {
          "entityType": "DEPARTMENT",
          "count": 4
        },
        {
          "entityType": "JOB_POSITION",
          "count": 4
        },
        {
          "entityType": "HOLIDAY",
          "count": 3
        }
      ]
    }
  }
}
```

> **Note**: Aggregates security events by action type and frequency.

---

### 3. Get My Notifications (Success)

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
    "notifications": [],
    "total": 0,
    "limit": 20,
    "offset": 0
  }
}
```

> **Note**: Retrieves recent alerts and status updates for the employee.

---

### 4. Get Unread Notification Count (Success)

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
    "unreadCount": 0
  }
}
```

> **Note**: Returns badge count of unread messages.

---

### 5. Mark All Notifications Read (Success)

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

> **Note**: Clears unread flag on all user alerts.

---

### 6. Broadcast Notification (Admin)

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
  "message": "Broadcast sent to 90 recipients",
  "success": true,
  "error": null,
  "data": {
    "sentCount": 90
  }
}
```

> **Note**: Dispatches company-wide announcement.

---

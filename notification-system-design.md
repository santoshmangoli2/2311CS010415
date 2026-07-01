# Notification System Design
# Campus Notifications Microservice

## Stage 1 – REST API Design

### Objective
The Campus Notifications Microservice enables administrators to send notifications to students regarding placements, examinations, events, fee reminders, holidays, and other campus-related announcements. Students can securely retrieve and view notifications assigned to them.

### Base URL
```
/api/v1
```

### Common Headers
```
Content-Type: application/json
Authorization: Bearer <ACCESS_TOKEN>
```

---

## 1. Create Notification

### Endpoint
```
POST /api/v1/notifications
```

### Description
Creates a new notification and sends it to the specified students.

### Request Body

```json
{
  "title": "Placement Drive",
  "message": "Amazon Placement Drive on 10 July at 10:00 AM.",
  "type": "placement",
  "priority": "high",
  "recipients": [
    "2311CS010415",
    "2311CS010416"
  ]
}
```

### Success Response (201 Created)

```json
{
  "notificationId": "NTF1001",
  "status": "created",
  "createdAt": "2026-07-01T10:30:00Z"
}
```

---

## 2. Get All Notifications

### Endpoint
```
GET /api/v1/notifications
```

### Description
Returns the list of all notifications.

### Success Response

```json
[
  {
    "notificationId": "NTF1001",
    "title": "Placement Drive",
    "type": "placement",
    "priority": "high",
    "status": "sent"
  },
  {
    "notificationId": "NTF1002",
    "title": "Exam Schedule",
    "type": "exam",
    "priority": "medium",
    "status": "scheduled"
  }
]
```

---

## 3. Get Notification by ID

### Endpoint
```
GET /api/v1/notifications/{notificationId}
```

### Description
Returns complete information about a specific notification.

### Success Response

```json
{
  "notificationId": "NTF1001",
  "title": "Placement Drive",
  "message": "Amazon Placement Drive on 10 July at 10:00 AM.",
  "type": "placement",
  "priority": "high",
  "createdAt": "2026-07-01T10:30:00Z"
}
```

---

## 4. Update Notification

### Endpoint
```
PUT /api/v1/notifications/{notificationId}
```

### Request Body

```json
{
  "title": "Updated Placement Drive",
  "message": "Venue changed to Seminar Hall.",
  "priority": "high"
}
```

### Success Response

```json
{
  "message": "Notification updated successfully."
}
```

---

## 5. Delete Notification

### Endpoint
```
DELETE /api/v1/notifications/{notificationId}
```

### Success Response

```json
{
  "message": "Notification deleted successfully."
}
```

---

## 6. Get Notifications for a Student

### Endpoint
```
GET /api/v1/students/{rollNo}/notifications
```

### Description
Returns all notifications assigned to a specific student.

### Success Response

```json
[
  {
    "notificationId": "NTF1001",
    "title": "Placement Drive",
    "status": "Unread"
  },
  {
    "notificationId": "NTF1002",
    "title": "Exam Schedule",
    "status": "Read"
  }
]
```

---

## HTTP Status Codes

| Status Code | Description |
|--------------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Error Response Example

```json
{
  "status": 404,
  "message": "Notification not found"
}
```

---

# Stage 2 – Database Design

## Database Selection

**Chosen Database:** MySQL

### Reason for Choosing MySQL

- Supports relational data with foreign keys.
- Ensures ACID compliance for reliable transactions.
- Provides efficient indexing for faster searches.
- Well-suited for structured campus notification records.
- Easy to maintain and scale for university applications.

---

## Database Schema

### Students Table

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| roll_no | VARCHAR(20) | Primary Key |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | UNIQUE |
| department | VARCHAR(50) | NOT NULL |

---

### Notifications Table

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| notification_id | VARCHAR(50) | Primary Key |
| title | VARCHAR(200) | NOT NULL |
| message | TEXT | NOT NULL |
| type | VARCHAR(50) | NOT NULL |
| priority | VARCHAR(20) | NOT NULL |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

---

### Student_Notifications Table

| Column | Data Type | Constraints |
|---------|-----------|-------------|
| id | INT | Primary Key, AUTO_INCREMENT |
| roll_no | VARCHAR(20) | Foreign Key |
| notification_id | VARCHAR(50) | Foreign Key |
| status | ENUM('Read','Unread') | Default 'Unread' |
| read_at | DATETIME | NULL |

---

## Entity Relationship

```
Students
---------
roll_no (PK)
name
email
department

        |
        | 1 : M
        |

Student_Notifications
---------------------
id (PK)
roll_no (FK)
notification_id (FK)
status
read_at

        |
        | M : 1
        |

Notifications
-------------
notification_id (PK)
title
message
type
priority
created_at
```

---

## API Workflow

1. Administrator logs into the system.
2. Administrator creates a notification.
3. Notification is stored in the Notifications table.
4. Mapping entries are created in Student_Notifications for each recipient.
5. Students retrieve notifications using their roll number.
6. Students read notifications, and the status changes from **Unread** to **Read**.

---

## Assumptions

- JWT authentication is used for secure access.
- Only administrators can create, update, or delete notifications.
- Students can only view notifications assigned to them.
- Notification IDs are unique.
- Notifications remain stored until deleted by an administrator.
- All API responses are returned in JSON format.

---

## Advantages of the Proposed Design

- RESTful API design with clear resource naming.
- Secure authentication using JWT.
- Scalable relational database schema.
- Supports efficient querying using indexed primary and foreign keys.
- Easy to extend with additional notification types and user roles.
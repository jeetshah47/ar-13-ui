# Activity Log Integration Guide

## Overview

The Activity Log system provides comprehensive tracking of all operations performed on entities (tasks, projects, users, and calendar events) in the application. All activity logs are stored in a centralized `activityLogs` collection in Firebase Firestore, organized into sub-collections by entity type.

## Architecture

### Collection Structure

```
activityLogs/
  └── logs/
      ├── taskActivityLogs/
      ├── projectActivityLogs/
      ├── userActivityLogs/
      └── calendarEventActivityLogs/
```

### Data Model

Each activity log entry contains:

- `id`: Unique identifier (auto-generated)
- `entityType`: Type of entity (`'task' | 'project' | 'user' | 'calendarEvent'`)
- `entityId`: ID of the entity this log refers to
- `action`: Type of action performed (see [Action Types](#action-types))
- `createdAt`: Timestamp when the action occurred
- `createdBy`: User ID who performed the action
- `fields`: Optional object containing changed fields with old/new values
- `description`: Human-readable description of the activity
- `metadata`: Optional additional metadata
- `created`: Date from IModel
- `updated`: Optional update date from IModel

### Action Types

#### Task Actions
- `created` - Task was created
- `updated` - Task was updated
- `deleted` - Task was deleted
- `assigned` - Task was assigned to a user
- `unassigned` - Task was unassigned from a user
- `status_changed` - Task status changed
- `priority_changed` - Task priority changed
- `description_updated` - Task description updated
- `duration_updated` - Task duration updated
- `file_uploaded` - File attached to task
- `file_removed` - File removed from task
- `time_spent_added` - Time entry added
- `time_spent_updated` - Time entry updated
- `time_spent_removed` - Time entry removed

#### Project Actions
- `created` - Project was created
- `updated` - Project was updated
- `deleted` - Project was deleted
- `member_added` - Member added to project
- `member_removed` - Member removed from project
- `owner_changed` - Project owner changed
- `deadline_updated` - Project deadline updated

#### User Actions
- `created` - User was created
- `updated` - User was updated
- `deleted` - User was deleted
- `profile_updated` - User profile updated
- `role_changed` - User role changed
- `password_changed` - User password changed

#### Calendar Event Actions
- `event_created` - Calendar event was created
- `event_updated` - Calendar event was updated
- `event_deleted` - Calendar event was deleted
- `event_cancelled` - Calendar event was cancelled

## Integration

### Step 1: Import Required Dependencies

```typescript
import ActivityLogRepo from "@src/repos/ActivityLogRepo";
import {
  createTaskCreationLog,
  createTaskUpdateLog,
  // ... other helpers
} from "@src/common/util/activityLogHelpers";
```

### Step 2: Add Activity Logging to Service Methods

#### Basic Pattern

```typescript
async function someOperation(
  entityId: string,
  // ... other params
  performedBy?: string, // Optional user ID
): Promise<void> {
  // Perform the operation
  await SomeRepo.update(entity);
  
  // Log the activity if performedBy is provided
  if (performedBy) {
    try {
      const activityLog = createTaskUpdateLog(
        entityId,
        performedBy,
        changedFields,
      );
      await ActivityLogRepo.add(activityLog);
    } catch (error) {
      console.error("Error creating activity log:", error);
      // Don't throw - logging failure shouldn't break operations
    }
  }
}
```

#### Creation Example

```typescript
async function addOne(task: ITask): Promise<void> {
  // ... validation
  
  const createdTask = await TaskRepo.add(task);
  
  // Log the activity
  try {
    const creatorId = task.assignTo?.[0] || task.id;
    const activityLog = createTaskCreationLog(
      createdTask.id,
      creatorId,
      createdTask.subject,
    );
    await ActivityLogRepo.add(activityLog);
  } catch (error) {
    console.error("Error creating task activity log:", error);
  }
  
  // ... rest of the function
}
```

#### Update Example with Field Tracking

```typescript
async function updateOne(
  task: ITask,
  updatedBy?: string,
): Promise<void> {
  const oldTask = await TaskRepo.getOne(task.projectId, task.id);
  if (!oldTask) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, "Task not found");
  }
  
  await TaskRepo.update(task);
  
  // Log the activity if updatedBy is provided
  if (updatedBy) {
    try {
      // Determine which fields changed
      const changedFields: Record<string, unknown> = {};
      if (oldTask.subject !== task.subject) {
        changedFields.subject = { old: oldTask.subject, new: task.subject };
      }
      if (oldTask.status !== task.status) {
        changedFields.status = { old: oldTask.status, new: task.status };
      }
      
      if (Object.keys(changedFields).length > 0) {
        const activityLog = createTaskUpdateLog(
          task.id,
          updatedBy,
          changedFields,
        );
        await ActivityLogRepo.add(activityLog);
      }
    } catch (error) {
      console.error("Error creating task update activity log:", error);
    }
  }
}
```

#### Deletion Example

```typescript
async function _delete(
  projectId: string,
  id: string,
  deletedBy?: string,
): Promise<void> {
  const task = await TaskRepo.getOne(projectId, id);
  if (!task) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, "Task not found");
  }
  
  // Log the activity if deletedBy is provided
  if (deletedBy) {
    try {
      const activityLog = createTaskDeletionLog(
        id,
        deletedBy,
        task.subject,
      );
      await ActivityLogRepo.add(activityLog);
    } catch (error) {
      console.error("Error creating task deletion activity log:", error);
    }
  }
  
  return TaskRepo.delete(projectId, id);
}
```

## Available Helper Functions

### Task Activity Log Helpers

Located in `src/common/util/activityLogHelpers.ts`:

- `createTaskCreationLog(taskId, createdBy, taskSubject)` - Log task creation
- `createTaskUpdateLog(taskId, createdBy, fields)` - Log task updates
- `createTaskDeletionLog(taskId, createdBy, taskSubject)` - Log task deletion
- `createTaskStatusChangeLog(taskId, createdBy, oldStatus, newStatus)` - Log status change
- `createTaskAssignmentActivityLog(taskId, createdBy, assignedUserId, assignedUserName?)` - Log assignment
- `createTaskDescriptionUpdateLog(taskId, createdBy, oldDescription?, newDescription?)` - Log description update
- `createTaskDurationUpdateLog(taskId, createdBy, oldDuration, newDuration)` - Log duration update
- `createTimeSpentAdditionLog(taskId, createdBy, timeSpent, date, description?)` - Log time entry addition
- `createTimeSpentUpdateLog(taskId, createdBy, timeSpentIndex, oldTimeSpent, newTimeSpent)` - Log time entry update
- `createTimeSpentRemovalLog(taskId, createdBy, timeSpentIndex)` - Log time entry removal
- `createFileUploadActivityLog(taskId, createdBy, fileName, fileSize)` - Log file upload
- `createFileRemovalActivityLog(taskId, createdBy, fileName, fileIndex)` - Log file removal

### Project Activity Log Helpers

- `createProjectCreationLog(projectId, createdBy, projectTitle)` - Log project creation
- `createProjectUpdateLog(projectId, createdBy, fields)` - Log project updates
- `createProjectDeletionLog(projectId, createdBy, projectTitle)` - Log project deletion
- `createProjectMemberAdditionLog(projectId, createdBy, memberId, memberName?)` - Log member addition
- `createProjectMemberRemovalLog(projectId, createdBy, memberId, memberName?)` - Log member removal

### User Activity Log Helpers

- `createUserCreationLog(userId, createdBy, userName)` - Log user creation
- `createUserUpdateLog(userId, createdBy, fields)` - Log user updates
- `createUserDeletionLog(userId, createdBy, userName)` - Log user deletion
- `createUserProfileUpdateLog(userId, createdBy, fields)` - Log profile updates

### Calendar Event Activity Log Helpers

- `createCalendarEventCreationLog(eventId, createdBy, eventTitle)` - Log event creation
- `createCalendarEventUpdateLog(eventId, createdBy, fields)` - Log event updates
- `createCalendarEventDeletionLog(eventId, createdBy, eventTitle)` - Log event deletion

### Generic Helpers

For custom activity logs:

- `createTaskActivityLog(taskId, action, createdBy, fields?, description?)`
- `createProjectActivityLog(projectId, action, createdBy, fields?, description?)`
- `createUserActivityLog(userId, action, createdBy, fields?, description?)`
- `createCalendarEventActivityLog(eventId, action, createdBy, fields?, description?)`

## Repository Usage

### ActivityLogRepo Methods

```typescript
import ActivityLogRepo from "@src/repos/ActivityLogRepo";

// Add an activity log
await ActivityLogRepo.add(activityLog);

// Get activity logs for a specific entity
const logs = await ActivityLogRepo.getByEntity('task', taskId);

// Get activity logs by entity type
const allTaskLogs = await ActivityLogRepo.getByEntityType('task', limit?);

// Get activity logs created by a specific user
const userLogs = await ActivityLogRepo.getByCreatedBy('task', userId, limit?);

// Get one activity log by ID
const log = await ActivityLogRepo.getOne('task', logId);

// Convenience methods for each entity type
const taskLogs = await ActivityLogRepo.getTaskActivityLogs(taskId?, limit?);
const projectLogs = await ActivityLogRepo.getProjectActivityLogs(projectId?, limit?);
const userLogs = await ActivityLogRepo.getUserActivityLogs(userId?, limit?);
const eventLogs = await ActivityLogRepo.getCalendarEventActivityLogs(eventId?, limit?);

// Delete operations
await ActivityLogRepo.deleteOne('task', logId);
await ActivityLogRepo.deleteByEntity('task', taskId);
```

## Best Practices

### 1. Always Use Try-Catch

Activity logging should never break the main operation. Always wrap activity log creation in try-catch blocks:

```typescript
try {
  const activityLog = createTaskCreationLog(...);
  await ActivityLogRepo.add(activityLog);
} catch (error) {
  console.error("Error creating activity log:", error);
  // Don't throw - continue with operation
}
```

### 2. Track Field Changes

When logging updates, include the old and new values in the `fields` property:

```typescript
const changedFields: Record<string, unknown> = {};
if (oldEntity.field !== newEntity.field) {
  changedFields.field = { old: oldEntity.field, new: newEntity.field };
}

if (Object.keys(changedFields).length > 0) {
  const activityLog = createTaskUpdateLog(entityId, createdBy, changedFields);
  await ActivityLogRepo.add(activityLog);
}
```

### 3. Use Optional User Context Parameters

Make user context parameters optional to allow operations even when user ID is not available:

```typescript
async function updateOne(
  task: ITask,
  updatedBy?: string, // Optional
): Promise<void> {
  // ... update logic
  
  if (updatedBy) {
    // Log only if user context is available
    await logActivity(...);
  }
}
```

### 4. Use Appropriate Helper Functions

Use the specific helper functions rather than generic ones when available:

```typescript
// ✅ Good - specific helper
const log = createTaskStatusChangeLog(taskId, userId, oldStatus, newStatus);

// ❌ Less ideal - generic helper
const log = createTaskActivityLog(taskId, 'status_changed', userId, ...);
```

### 5. Log After Successful Operations

Always log activities after the operation succeeds:

```typescript
// ✅ Correct order
await TaskRepo.update(task);
await ActivityLogRepo.add(activityLog); // Log after update

// ❌ Wrong order - don't log before operation completes
await ActivityLogRepo.add(activityLog);
await TaskRepo.update(task);
```

## Example: Complete Service Method

```typescript
import ActivityLogRepo from "@src/repos/ActivityLogRepo";
import {
  createTaskCreationLog,
  createTaskUpdateLog,
  createTaskStatusChangeLog,
} from "@src/common/util/activityLogHelpers";

async function updateTaskStatus(
  projectId: string,
  taskId: string,
  status: string,
  userId: string,
): Promise<void> {
  const task = await TaskRepo.getOne(projectId, taskId);
  if (!task) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, "Task not found");
  }

  const oldStatus = task.status;
  
  // Only update if status is actually changing
  if (oldStatus !== status) {
    await TaskRepo.updateStatus(projectId, taskId, status);

    // Log the activity
    try {
      const activityLog = createTaskStatusChangeLog(
        taskId,
        userId,
        oldStatus,
        status,
      );
      await ActivityLogRepo.add(activityLog);
    } catch (error) {
      console.error("Error creating status change activity log:", error);
    }
  }
}
```

## Querying Activity Logs

### HTTP APIs (Server Endpoints)

All endpoints require a valid Bearer token and appropriate permissions.

- Base path: `/api/activity-logs`
- Permission required: `activityLogs:read`

#### 1) Get supported entity types

**Endpoint:** GET `/api/activity-logs/entity-types`

**Request:**

```bash
curl -X GET \
  -H "Authorization: Bearer <ID_TOKEN>" \
  http://localhost:3000/api/activity-logs/entity-types
```

**Response Example:**

```json
{
  "entityTypes": [
    "task",
    "project",
    "user",
    "calendarEvent"
  ]
}
```

---

#### 2) Get logs for a specific entity

**Endpoint:** GET `/api/activity-logs/:entityType/:entityId`

**Path Parameters:**
- `entityType`: one of `task | project | user | calendarEvent`
- `entityId`: the ID of the entity

**Request Examples:**

```bash
# Get logs for a specific task
curl -X GET \
  -H "Authorization: Bearer <ID_TOKEN>" \
  http://localhost:3000/api/activity-logs/task/task123

# Get logs for a specific project
curl -X GET \
  -H "Authorization: Bearer <ID_TOKEN>" \
  http://localhost:3000/api/activity-logs/project/proj456

# Get logs for a specific user
curl -X GET \
  -H "Authorization: Bearer <ID_TOKEN>" \
  http://localhost:3000/api/activity-logs/user/user789
```

**Response Example (Task):**

```json
{
  "activityLogs": [
    {
      "id": "log_abc123",
      "entityType": "task",
      "entityId": "task123",
      "action": "status_changed",
      "createdAt": "2025-01-15T14:30:00.000Z",
      "created": "2025-01-15T14:30:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "user456",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "+1234567890",
        "role": "Standard",
        "designation": "Developer",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "oldStatus": "Open",
        "newStatus": "In Progress"
      },
      "description": "Status changed from \"Open\" to \"In Progress\"",
      "metadata": {}
    },
    {
      "id": "log_def456",
      "entityType": "task",
      "entityId": "task123",
      "action": "assigned",
      "createdAt": "2025-01-15T10:15:00.000Z",
      "created": "2025-01-15T10:15:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "user789",
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "phoneNumber": "+1234567891",
        "role": "Admin",
        "designation": "Project Manager",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "assignedUserId": "user456",
        "assignedUserName": "John Doe"
      },
      "description": "Assigned task to John Doe",
      "metadata": {}
    },
    {
      "id": "log_ghi789",
      "entityType": "task",
      "entityId": "task123",
      "action": "time_spent_added",
      "createdAt": "2025-01-14T16:45:00.000Z",
      "created": "2025-01-14T16:45:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "user456",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "+1234567890",
        "role": "Standard",
        "designation": "Developer",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "timeSpent": 120,
        "date": "2025-01-14",
        "description": "Initial development work"
      },
      "description": "Added 2h 0m on 2025-01-14: Initial development work",
      "metadata": {}
    },
    {
      "id": "log_jkl012",
      "entityType": "task",
      "entityId": "task123",
      "action": "file_uploaded",
      "createdAt": "2025-01-14T09:20:00.000Z",
      "created": "2025-01-14T09:20:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "user456",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "+1234567890",
        "role": "Standard",
        "designation": "Developer",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "fileName": "document.pdf",
        "fileSize": 524288
      },
      "description": "Uploaded file \"document.pdf\" (0.50 MB)",
      "metadata": {}
    },
    {
      "id": "log_mno345",
      "entityType": "task",
      "entityId": "task123",
      "action": "created",
      "createdAt": "2025-01-13T08:00:00.000Z",
      "created": "2025-01-13T08:00:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "user789",
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "phoneNumber": "+1234567891",
        "role": "Admin",
        "designation": "Project Manager",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "subject": "Implement user authentication"
      },
      "description": "Created task \"Implement user authentication\"",
      "metadata": {}
    }
  ]
}
```

**Response Example (Project):**

```json
{
  "activityLogs": [
    {
      "id": "log_proj001",
      "entityType": "project",
      "entityId": "proj456",
      "action": "member_added",
      "createdAt": "2025-01-15T11:30:00.000Z",
      "created": "2025-01-15T11:30:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "user789",
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "phoneNumber": "+1234567891",
        "role": "Admin",
        "designation": "Project Manager",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "memberId": "user456",
        "memberName": "Jane Smith"
      },
      "description": "Added member Jane Smith",
      "metadata": {}
    },
    {
      "id": "log_proj002",
      "entityType": "project",
      "entityId": "proj456",
      "action": "updated",
      "createdAt": "2025-01-14T15:20:00.000Z",
      "created": "2025-01-14T15:20:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "user789",
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "phoneNumber": "+1234567891",
        "role": "Admin",
        "designation": "Project Manager",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "deadline": {
          "old": "2025-02-01",
          "new": "2025-02-15"
        }
      },
      "description": "Project updated",
      "metadata": {}
    },
    {
      "id": "log_proj003",
      "entityType": "project",
      "entityId": "proj456",
      "action": "created",
      "createdAt": "2025-01-10T09:00:00.000Z",
      "created": "2025-01-10T09:00:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "user789",
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "phoneNumber": "+1234567891",
        "role": "Admin",
        "designation": "Project Manager",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "title": "Mobile App Development"
      },
      "description": "Created project \"Mobile App Development\"",
      "metadata": {}
    }
  ]
}
```

**Response Example (User):**

```json
{
  "activityLogs": [
    {
      "id": "log_user001",
      "entityType": "user",
      "entityId": "user789",
      "action": "profile_updated",
      "createdAt": "2025-01-15T13:45:00.000Z",
      "created": "2025-01-15T13:45:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "user789",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "+1234567890",
        "role": "Standard",
        "designation": "Developer",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "email": {
          "old": "old@example.com",
          "new": "new@example.com"
        },
        "name": {
          "old": "John Doe",
          "new": "John Smith"
        }
      },
      "description": "Profile updated",
      "metadata": {}
    },
    {
      "id": "log_user002",
      "entityType": "user",
      "entityId": "user789",
      "action": "role_changed",
      "createdAt": "2025-01-12T10:00:00.000Z",
      "created": "2025-01-12T10:00:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "admin001",
        "name": "Admin User",
        "email": "admin@example.com",
        "phoneNumber": "+1234567899",
        "role": "Admin",
        "designation": "System Administrator",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "oldRole": "Standard",
        "newRole": "Admin"
      },
      "description": "Role changed from Standard to Admin",
      "metadata": {}
    }
  ]
}
```

**Response Example (Calendar Event):**

```json
{
  "activityLogs": [
    {
      "id": "log_event001",
      "entityType": "calendarEvent",
      "entityId": "event123",
      "action": "event_updated",
      "createdAt": "2025-01-15T16:00:00.000Z",
      "created": "2025-01-15T16:00:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "user456",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "+1234567890",
        "role": "Standard",
        "designation": "Developer",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "startTime": {
          "old": "2025-01-20T10:00:00.000Z",
          "new": "2025-01-20T11:00:00.000Z"
        }
      },
      "description": "Event updated",
      "metadata": {}
    },
    {
      "id": "log_event002",
      "entityType": "calendarEvent",
      "entityId": "event123",
      "action": "event_created",
      "createdAt": "2025-01-13T14:00:00.000Z",
      "created": "2025-01-13T14:00:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "user456",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "+1234567890",
        "role": "Standard",
        "designation": "Developer",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "title": "Team Meeting"
      },
      "description": "Created event \"Team Meeting\"",
      "metadata": {}
    }
  ]
}
```

**Empty Response Example:**

```json
{
  "activityLogs": []
}
```

---

#### 3) Get recent logs for an entity type

**Endpoint:** GET `/api/activity-logs/:entityType?limit=<n>`

**Query Parameters:**
- `limit` (optional): maximum number of logs to return (default: no limit)

**Request Examples:**

```bash
# Get recent task logs (limited to 20)
curl -X GET \
  -H "Authorization: Bearer <ID_TOKEN>" \
  "http://localhost:3000/api/activity-logs/task?limit=20"

# Get recent project logs (limited to 10)
curl -X GET \
  -H "Authorization: Bearer <ID_TOKEN>" \
  "http://localhost:3000/api/activity-logs/project?limit=10"

# Get all recent user logs (no limit)
curl -X GET \
  -H "Authorization: Bearer <ID_TOKEN>" \
  "http://localhost:3000/api/activity-logs/user"
```

**Response Example (Task with limit=3):**

```json
{
  "activityLogs": [
    {
      "id": "log_task001",
      "entityType": "task",
      "entityId": "task456",
      "action": "status_changed",
      "createdAt": "2025-01-15T18:00:00.000Z",
      "created": "2025-01-15T18:00:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "user123",
        "name": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "phoneNumber": "+1234567892",
        "role": "Standard",
        "designation": "Designer",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "oldStatus": "In Progress",
        "newStatus": "Completed"
      },
      "description": "Status changed from \"In Progress\" to \"Completed\"",
      "metadata": {}
    },
    {
      "id": "log_task002",
      "entityType": "task",
      "entityId": "task789",
      "action": "assigned",
      "createdAt": "2025-01-15T17:30:00.000Z",
      "created": "2025-01-15T17:30:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "user456",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phoneNumber": "+1234567890",
        "role": "Standard",
        "designation": "Developer",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "assignedUserId": "user123",
        "assignedUserName": "Alice Johnson"
      },
      "description": "Assigned task to Alice Johnson",
      "metadata": {}
    },
    {
      "id": "log_task003",
      "entityType": "task",
      "entityId": "task123",
      "action": "time_spent_added",
      "createdAt": "2025-01-15T17:00:00.000Z",
      "created": "2025-01-15T17:00:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "user789",
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "phoneNumber": "+1234567891",
        "role": "Admin",
        "designation": "Project Manager",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "timeSpent": 90,
        "date": "2025-01-15",
        "description": "Bug fixes and testing"
      },
      "description": "Added 1h 30m on 2025-01-15: Bug fixes and testing",
      "metadata": {}
    }
  ]
}
```

**Response Example (Project with limit=5):**

```json
{
  "activityLogs": [
    {
      "id": "log_proj001",
      "entityType": "project",
      "entityId": "proj999",
      "action": "member_removed",
      "createdAt": "2025-01-15T19:00:00.000Z",
      "created": "2025-01-15T19:00:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "admin001",
        "name": "Admin User",
        "email": "admin@example.com",
        "phoneNumber": "+1234567899",
        "role": "Admin",
        "designation": "System Administrator",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "memberId": "user555",
        "memberName": "Bob Williams"
      },
      "description": "Removed member Bob Williams",
      "metadata": {}
    },
    {
      "id": "log_proj002",
      "entityType": "project",
      "entityId": "proj888",
      "action": "owner_changed",
      "createdAt": "2025-01-15T18:30:00.000Z",
      "created": "2025-01-15T18:30:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "admin001",
        "name": "Admin User",
        "email": "admin@example.com",
        "phoneNumber": "+1234567899",
        "role": "Admin",
        "designation": "System Administrator",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "oldOwnerId": "user111",
        "newOwnerId": "user222",
        "newOwnerName": "Carol Martinez"
      },
      "description": "Project owner changed to Carol Martinez",
      "metadata": {}
    },
    {
      "id": "log_proj003",
      "entityType": "project",
      "entityId": "proj777",
      "action": "deadline_updated",
      "createdAt": "2025-01-15T18:00:00.000Z",
      "created": "2025-01-15T18:00:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "user333",
        "name": "Bob Wilson",
        "email": "bob.wilson@example.com",
        "phoneNumber": "+1234567893",
        "role": "Standard",
        "designation": "Team Lead",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "oldDeadline": "2025-03-01",
        "newDeadline": "2025-03-15"
      },
      "description": "Deadline updated from 2025-03-01 to 2025-03-15",
      "metadata": {}
    },
    {
      "id": "log_proj004",
      "entityType": "project",
      "entityId": "proj666",
      "action": "member_added",
      "createdAt": "2025-01-15T17:45:00.000Z",
      "created": "2025-01-15T17:45:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "user444",
        "name": "Carol White",
        "email": "carol.white@example.com",
        "phoneNumber": "+1234567894",
        "role": "Standard",
        "designation": "Developer",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "memberId": "user777",
        "memberName": "David Brown"
      },
      "description": "Added member David Brown",
      "metadata": {}
    },
    {
      "id": "log_proj005",
      "entityType": "project",
      "entityId": "proj555",
      "action": "updated",
      "createdAt": "2025-01-15T17:00:00.000Z",
      "created": "2025-01-15T17:00:00.000Z",
      "updated": null,
      "createdByUser": {
        "id": "user888",
        "name": "David Brown",
        "email": "david.brown@example.com",
        "phoneNumber": "+1234567895",
        "role": "Standard",
        "designation": "Developer",
        "created": "2025-01-01T00:00:00.000Z",
        "updated": null
      },
      "fields": {
        "description": {
          "old": "Old project description",
          "new": "Updated project description"
        }
      },
      "description": "Project updated",
      "metadata": {}
    }
  ]
}
```

**Response Example (Empty result):**

```json
{
  "activityLogs": []
}
```

### Get All Logs for a Task

```typescript
const taskLogs = await ActivityLogRepo.getTaskActivityLogs(taskId);
// Returns: ITaskActivityLog[]
```

### Get Recent Task Activity

```typescript
const recentLogs = await ActivityLogRepo.getTaskActivityLogs(undefined, 10);
// Returns: Last 10 task activity logs
```

### Get Logs by User

```typescript
const userLogs = await ActivityLogRepo.getByCreatedBy('task', userId, 20);
// Returns: Last 20 task logs created by the user
```

### Get Specific Log

```typescript
const log = await ActivityLogRepo.getOne('task', logId);
// Returns: ITaskActivityLog | null
```

## Testing

When testing services with activity logging:

1. **Mock ActivityLogRepo**:
   ```typescript
   jest.mock("@src/repos/ActivityLogRepo");
   ```

2. **Verify Logging Calls**:
   ```typescript
   expect(ActivityLogRepo.add).toHaveBeenCalledWith(
     expect.objectContaining({
       entityType: 'task',
       entityId: taskId,
       action: 'created',
    })
   );
   ```

3. **Test Error Handling**: Ensure operations succeed even if logging fails

## Migration Notes

### From Embedded Activity Logs

If you're migrating from embedded activity logs (stored in the entity document):

1. **Old Pattern** (embedded):
   ```typescript
   await TaskRepo.addActivityLog(projectId, taskId, activityLog);
   ```

2. **New Pattern** (separate collection):
   ```typescript
   const activityLog = createTaskStatusChangeLog(...);
   await ActivityLogRepo.add(activityLog);
   ```

### Benefits of New Approach

- **Separation of Concerns**: Activity logs don't clutter entity documents
- **Better Querying**: Query activity logs independently
- **Scalability**: No document size limits from embedded arrays
- **Performance**: Fetch activity logs only when needed
- **Centralized Management**: All activity logs in one place

## Troubleshooting

### Activity Logs Not Appearing

1. Check that `createdBy` parameter is provided
2. Verify try-catch isn't swallowing errors silently
3. Check Firebase console for collection structure
4. Ensure ActivityLogRepo is properly imported

### Performance Issues

1. Use limits when querying logs: `getByEntityType('task', 100)`
2. Index frequently queried fields in Firestore
3. Consider pagination for large result sets

### Missing Helper Functions

If you need a helper function that doesn't exist:

1. Use the generic helper function:
   ```typescript
   createTaskActivityLog(taskId, 'custom_action', createdBy, fields, description)
   ```

2. Or create a new helper in `activityLogHelpers.ts` following the existing pattern

## Support

For questions or issues with activity logging:

1. Check existing implementations in:
   - `src/services/TaskService.ts`
   - `src/services/ProjectService.ts`
   - `src/services/UserService.ts`
   - `src/services/CalendarEventService.ts`

2. Review helper functions in:
   - `src/common/util/activityLogHelpers.ts`

3. Check repository methods in:
   - `src/repos/ActivityLogRepo.ts`



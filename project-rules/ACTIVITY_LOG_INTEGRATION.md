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


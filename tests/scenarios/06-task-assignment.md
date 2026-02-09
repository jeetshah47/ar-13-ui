# Task Assignment and Transfer Test Scenarios

## Scenario 1: Assign Task to User

### User Role
- Admin (or user with `tasks:assign` permission)

### Prerequisites
- User is logged in
- Task exists
- Multiple users exist in system
- User has permission to assign tasks

### Steps
1. Navigate to task details page
2. Click "Assign" or "Edit" button
3. Select assignee from user dropdown
4. Save assignment
5. Verify task assignment

### Expected Results
- Assign functionality is available
- User dropdown lists available users
- User selection works
- Task is assigned successfully
- Assigned user appears in task info sidebar
- Activity log entry created
- Assigned user can see task in their list
- Notification sent to assigned user (if implemented)

### Test Data
- Available users: `user1@example.com`, `user2@example.com`, `user3@example.com`
- Assign to: `user1@example.com`

### Edge Cases
- Assign task to user who doesn't have project access
- Assign task already assigned to another user
- Assign task to multiple users (if supported)
- Network error during assignment

---

## Scenario 2: Claim Task

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists without assignee (or unassigned task)
- User has access to project

### Steps
1. Navigate to task details page
2. Click "Claim Task" button
3. Confirm claim (if confirmation dialog)
4. Verify task claim

### Expected Results
- "Claim Task" button is visible for unassigned tasks
- Claim confirmation works (if implemented)
- Task is assigned to current user
- Activity log entry created
- Task appears in user's assigned tasks
- Success message appears

### Edge Cases
- Claim task already assigned to another user
- Claim task without project access
- Multiple users trying to claim same task
- Network error during claim

---

## Scenario 3: Transfer Task to Another User

### User Role
- Task assignee or Admin

### Prerequisites
- User is logged in
- Task exists and is assigned to current user (or user is Admin)
- Multiple users exist in system

### Steps
1. Navigate to task details page
2. Click "Transfer Task" button
3. Select new assignee from user list
4. Optionally add transfer reason/comment
5. Confirm transfer
6. Verify task transfer

### Expected Results
- "Transfer Task" button is visible
- Transfer modal/form opens
- User selection works
- Current assignee is excluded or marked (if applicable)
- Transfer reason field works (if implemented)
- Task is transferred successfully
- Activity log entry created
- Previous assignee no longer sees task as assigned
- New assignee sees task as assigned
- Notification sent to new assignee (if implemented)
- Notification sent to previous assignee (if implemented)

### Test Data
- Current assignee: `user1@example.com`
- Transfer to: `user2@example.com`
- Transfer reason: `Reassigning due to workload`

### Edge Cases
- Transfer to user without project access
- Transfer to same user (should be prevented)
- Transfer task with active time tracking
- Transfer task with file attachments
- Network error during transfer

---

## Scenario 4: Unassign Task

### User Role
- Admin (or task assignee)

### Prerequisites
- User is logged in
- Task exists and is assigned
- User has permission to unassign

### Steps
1. Navigate to task details page
2. Click "Unassign" or remove assignee
3. Confirm unassignment (if confirmation)
4. Verify task unassignment

### Expected Results
- Unassign functionality is available
- Task assignee is removed
- Task becomes unassigned
- Activity log entry created
- Task no longer appears in previous assignee's list
- "Claim Task" button appears (if applicable)
- Success message appears

### Edge Cases
- Unassign task with active work
- Unassign task with time logged
- Unassign during status update

---

## Scenario 5: Assign Task to Multiple Users

### User Role
- Admin (or user with `tasks:assign` permission)

### Prerequisites
- User is logged in
- Task exists
- Multiple users exist
- System supports multiple assignees (if applicable)

### Steps
1. Navigate to task details page
2. Click "Assign" or "Edit"
3. Select multiple users from assignee list
4. Save assignment
5. Verify multiple assignments

### Expected Results
- Multiple user selection is supported (if feature exists)
- All selected users are assigned
- All assigned users appear in task info
- All assigned users see task in their list
- Activity log reflects multiple assignments
- Notifications sent to all assignees (if implemented)

### Edge Cases
- Assign to users with different project access levels
- Remove one assignee from multiple assignees
- Maximum number of assignees (if limit exists)

---

## Scenario 6: View Assigned Tasks

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- User has tasks assigned to them

### Steps
1. Navigate to Projects page
2. Select a project
3. View task list
4. Filter by "Assigned to me" (if filter exists)
5. Verify assigned tasks display

### Expected Results
- Assigned tasks are visible in task list
- Task list can be filtered by assignee
- Assigned tasks show correct assignee information
- Tasks assigned to current user are highlighted or marked
- Task count for assigned tasks is accurate

### Edge Cases
- User with no assigned tasks
- User with many assigned tasks
- Tasks assigned to multiple users

---

## Scenario 7: Task Assignment Permissions

### User Role
- Standard User

### Prerequisites
- User is logged in
- Task exists
- User does NOT have `tasks:assign` permission

### Steps
1. Navigate to task details page
2. Attempt to assign/transfer task
3. Verify permission enforcement

### Expected Results
- Assign/Transfer buttons are hidden or disabled
- Direct API call returns 403 Forbidden
- Error message displayed (if attempted)
- User cannot assign tasks to others
- User can only claim unassigned tasks (if allowed)

### Edge Cases
- User tries to assign via direct API call
- Permission changed during session
- User with limited assign permissions (e.g., can assign within project only)

---

## Scenario 8: Assignment Notifications

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Notification system is enabled
- Task assignment occurs

### Steps
1. Admin assigns task to user
2. Verify notification received
3. Check notification content
4. Click notification (if clickable)
5. Verify navigation to task

### Expected Results
- Notification appears when task is assigned
- Notification contains:
  - Task title/code
  - Assigner name
  - Project name
- Notification is clickable (if implemented)
- Clicking notification navigates to task
- Notification can be marked as read
- WebSocket/real-time notification works (if implemented)

### Edge Cases
- Notification delivery failure
- Multiple assignments in short time
- Notification for task user doesn't have access to

---

## Scenario 9: Bulk Task Assignment

### User Role
- Admin

### Prerequisites
- User is logged in
- Multiple tasks exist
- Bulk assignment feature exists (if implemented)

### Steps
1. Navigate to Projects page
2. Select multiple tasks (if bulk selection supported)
3. Click "Assign" or bulk action
4. Select assignee
5. Confirm bulk assignment
6. Verify all tasks assigned

### Expected Results
- Bulk selection works (if feature exists)
- Bulk assign action is available
- All selected tasks are assigned
- Activity logs created for each task
- Notifications sent for each assignment
- Success message shows count of assigned tasks

### Edge Cases
- Bulk assign to user without project access
- Partial assignment failure
- Very large number of tasks

---

## Scenario 10: Assignment History

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists with assignment history

### Steps
1. Navigate to task details page
2. View activity logs section
3. Find assignment-related activity logs
4. Verify assignment history

### Expected Results
- Assignment changes appear in activity logs
- Assignment history shows:
  - Previous assignees
  - New assignees
  - Assignment date/time
  - User who made assignment
- History is chronological
- Transfer reasons/comments visible (if provided)

### Edge Cases
- Task with many assignment changes
- Assignment by deleted user
- Assignment history with missing data







# Task Lifecycle Test Scenarios

## Scenario 1: Create New Task

### User Role
- Authenticated User (with `tasks:write` permission)

### Prerequisites
- User is logged in
- Project exists and is selected
- User has permission to create tasks

### Steps
1. Navigate to Projects page
2. Select a project
3. Click "Add Task" button
4. Fill in task form:
   - Subject: `New Test Task`
   - Description: `This is a test task description`
   - Priority: `High`
   - Status: `To Do`
   - Assign To: Select user (optional)
   - Deadline: Select future date
   - Start Date: Select date (optional)
   - End Date: Select date (optional)
5. Submit the form
6. Verify task creation

### Expected Results
- "Add Task" button is visible and clickable
- Task creation form opens in modal
- Form validation works:
  - Required fields validated
  - Date validations (end date after start date, etc.)
  - Status selection works
- Success message appears
- Task appears in task list
- Task details are correct
- Activity log entry created

### Test Data
- Valid task:
  - Subject: `Complete API Integration`
  - Description: `Integrate new API endpoints`
  - Priority: `High`
  - Status: `To Do`
  - Assign To: `user@example.com`
  - Deadline: `2024-12-31`
- Invalid data:
  - Empty subject
  - End date before start date
  - Past deadline (if validation exists)

### Edge Cases
- Create task without assignee
- Create task with very long description
- Network error during creation
- Create task in project user doesn't have access to

---

## Scenario 2: Create Drawing Task

### User Role
- Authenticated User (with `tasks:write` permission)

### Prerequisites
- User is logged in
- Project exists and is selected
- Drawing types/categories exist

### Steps
1. Navigate to Projects page
2. Select a project
3. Click "Add Drawing" button
4. Fill in drawing task form:
   - Drawing Type: Select from dropdown
   - Drawing Category: Select from dropdown
   - Other required fields
5. Submit the form
6. Verify drawing task creation

### Expected Results
- "Add Drawing" button is visible
- Drawing task form opens
- Drawing type and category dropdowns work
- Drawing task created successfully
- Task appears with drawing-specific information
- Task code reflects drawing type

### Edge Cases
- No drawing types available
- Invalid drawing type/category combination
- Drawing task with special characters

---

## Scenario 3: View Task List

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Project is selected
- Tasks exist in project

### Steps
1. Navigate to Projects page
2. Select a project
3. Verify task list displays
4. Check task information:
   - Task code
   - Subject
   - Status
   - Assignee
   - Priority
   - Deadline

### Expected Results
- Task list displays correctly
- All tasks in project are visible
- Task information is accurate
- Tasks are sorted appropriately (by status, date, etc.)
- Empty state displays if no tasks
- Task count is accurate

### Test Data
- Tasks with different statuses: `To Do`, `In Progress`, `Done`
- Tasks with different priorities: `High`, `Medium`, `Low`
- Tasks assigned to different users

---

## Scenario 4: View Task Details

### User Role
- Authenticated User (with project access)

### Prerequisites
- User is logged in
- Task exists in accessible project

### Steps
1. Navigate to Projects page
2. Select project with tasks
3. Click on a task
4. Verify task details page loads
5. Check all task sections:
   - Task header (code, subject, status)
   - Task description
   - File attachments
   - Time tracking
   - Activity logs
   - Task info sidebar

### Expected Results
- Task details page loads correctly
- All task information displays accurately
- Task status is visible and changeable
- File attachments section is visible
- Time tracking section shows logged time
- Activity logs display correctly
- Task info sidebar shows:
  - Reporter
  - Assignee
  - Priority
  - Deadline
  - Time logged
- Navigation back to projects works

### Edge Cases
- Task with no description
- Task with no assignee
- Task with no deadline
- Task with many file attachments
- Task with many activity logs

---

## Scenario 5: Update Task Status

### User Role
- Authenticated User (task assignee or Admin)

### Prerequisites
- User is logged in
- Task exists
- User has permission to update task

### Steps
1. Navigate to task details page
2. Click on status dropdown/button
3. Select new status (e.g., `To Do` → `In Progress`)
4. Enter remark/comment (if required)
5. Confirm status change
6. Verify status update

### Expected Results
- Status dropdown/button is visible
- Status options are available
- Status change modal opens (if implemented)
- Remark field works (if required)
- Status updates successfully
- Activity log entry created
- Task list reflects new status
- Success message appears

### Test Data
- Status transitions:
  - `To Do` → `In Progress`
  - `In Progress` → `Done`
  - `Done` → `To Do` (reopen)
- Remarks: `Starting work on this task`, `Task completed successfully`

### Edge Cases
- Invalid status transition
- Status change without permission
- Status change with network error
- Concurrent status changes

---

## Scenario 6: Edit Task

### User Role
- Authenticated User (task assignee or Admin)

### Prerequisites
- User is logged in
- Task exists
- User has permission to edit

### Steps
1. Navigate to task details page
2. Click "Edit" button
3. Modify task fields:
   - Update subject
   - Update description
   - Change priority
   - Update deadline
   - Change assignee
   - Update progress percentage
4. Save changes
5. Verify updates

### Expected Results
- Edit button is visible
- Edit form opens (modal or page)
- Form pre-populates with current values
- All fields are editable
- Form validation works
- Success message appears
- Changes reflect in task details
- Activity log entry created
- Changes reflect in task list

### Test Data
- Updated subject: `Updated Task Subject`
- Updated description: `Updated description`
- Changed priority: `Medium` → `High`
- New deadline: `2025-01-15`
- New assignee: Different user
- Progress: `50%`

### Edge Cases
- Edit with no changes
- Edit with invalid data
- Edit task assigned to another user (permission check)
- Network error during save

---

## Scenario 7: Delete Task

### User Role
- Admin (or user with `tasks:delete` permission)

### Prerequisites
- User is logged in
- Task exists
- User has permission to delete

### Steps
1. Navigate to task details page
2. Click "Delete" button (if available)
   OR
   Delete from task list
3. Confirm deletion (if confirmation dialog)
4. Verify task deletion

### Expected Results
- Delete button is visible (if user has permission)
- Confirmation dialog appears (if implemented)
- Task is deleted from system
- Success message appears
- Task no longer appears in list
- Activity log entry created (if applicable)
- Associated file attachments handled appropriately

### Edge Cases
- Delete task with file attachments
- Delete task with time logged
- Delete task with activity logs/replies
- Cancel deletion
- Network error during deletion

---

## Scenario 8: Task Filtering

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Project is selected
- Multiple tasks exist with different:
  - Statuses
  - Assignees
  - Deadlines

### Steps
1. Navigate to Projects page
2. Select a project
3. Click "Filter" button
4. Apply filters:
   - Filter by status: Select one or more statuses
   - Filter by assignee: Select one or more users
   - Filter by date range: Select start and end dates
5. Verify filtered results
6. Clear filters
7. Verify all tasks display again

### Expected Results
- Filter button is visible
- Filter modal/form opens
- Status filter works (multi-select)
- Assignee filter works (multi-select)
- Date range filter works
- Filtered tasks display correctly
- Filter count/indicator shows active filters
- Clear filters button works
- All tasks display when filters cleared

### Test Data
- Tasks with statuses: `To Do`, `In Progress`, `Done`
- Tasks assigned to: `User A`, `User B`, `User C`
- Tasks with deadlines: Various dates

### Edge Cases
- Filter with no matching results
- Multiple filters combined
- Filter with invalid date range
- Filter cleared during active filter

---

## Scenario 9: Task Search

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Project is selected
- Multiple tasks exist

### Steps
1. Navigate to Projects page
2. Select a project
3. Use search functionality (if available):
   - Search by task code: `TASK-001`
   - Search by subject: `Test`
4. Verify search results
5. Clear search

### Expected Results
- Search functionality is available
- Search works for task code
- Search works for task subject
- Search is case-insensitive (or as designed)
- Search results highlight matching terms
- Clear search works
- All tasks display when search cleared

### Edge Cases
- Search with no results
- Search with special characters
- Search during active filter

---

## Scenario 10: Task Progress Tracking

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists
- Task has progress field

### Steps
1. Navigate to task details page
2. View progress indicator
3. Update progress (if editable):
   - Set progress to 50%
   - Set progress to 100%
4. Verify progress updates

### Expected Results
- Progress indicator is visible
- Progress displays as percentage or progress bar
- Progress is editable (if user has permission)
- Progress updates successfully
- Progress reflects in task list (if shown)
- Activity log entry created

### Edge Cases
- Progress > 100%
- Progress < 0%
- Progress with decimal values
- Progress update without permission







# Project Management Test Scenarios

## Scenario 1: Create New Project

### User Role
- Admin (or user with `projects:write` permission)

### Prerequisites
- User is logged in
- User has permission to create projects
- Backend API is running

### Steps
1. Navigate to Projects page (`/app/projects`)
2. Click "Add Project" button
3. Fill in project form:
   - Title: `New Test Project`
   - Code: `TEST-001`
   - Description: `This is a test project for E2E testing`
   - Priority: `High`
   - Deadline: Select future date
   - Assign members: Select one or more users
4. Submit the form
5. Verify project creation

### Expected Results
- "Add Project" button is visible and clickable
- Project creation form opens
- Form validation works:
  - Required fields (title, code) validated
  - Code format validation (if applicable)
  - Date picker works correctly
  - Member selection works
- Success message appears after creation
- Project appears in project list
- User is redirected to project list or new project details

### Test Data
- Valid project:
  - Title: `New Test Project`
  - Code: `TEST-001`
  - Description: `Test description`
  - Priority: `High`, `Medium`, `Low`
  - Deadline: `2024-12-31`
- Invalid data:
  - Empty title
  - Duplicate code
  - Past deadline (if validation exists)

### Edge Cases
- Duplicate project code
- Very long title/description
- Special characters in code
- Network error during creation
- Form submission with invalid data

---

## Scenario 2: View Project List

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- At least one project exists (assigned to user if Standard role)

### Steps
1. Navigate to Projects page
2. Verify project list displays
3. Check project sidebar (desktop) or dropdown (mobile)
4. Select a project
5. Verify tasks load for selected project

### Expected Results
- Project list displays correctly
- Projects are filtered by user role:
  - Admin sees all projects
  - Standard user sees only assigned projects
- Project sidebar shows:
  - Project title
  - Project code
  - "View details" link for selected project
- Search functionality works
- Selecting project loads associated tasks
- Empty state displays if no projects

### Test Data
- Multiple projects with different statuses
- Projects assigned to different users
- Projects with various priorities

---

## Scenario 3: Search and Filter Projects

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Multiple projects exist

### Steps
1. Navigate to Projects page
2. Use search box to search for project:
   - Search by title: `Test`
   - Search by code: `TEST`
3. Verify search results
4. Clear search
5. Verify all projects display again

### Expected Results
- Search box is visible and functional
- Search filters projects in real-time (or on submit)
- Search works for:
  - Project title
  - Project code
- Search is case-insensitive (or case-sensitive as designed)
- Clear search button works
- Empty search shows "No projects found" message

### Test Data
- Projects: `Test Project 1`, `Test Project 2`, `Production Project`
- Search terms: `Test`, `test`, `TEST`, `Production`, `NonExistent`

---

## Scenario 4: View Project Details

### User Role
- Authenticated User (with project access)

### Prerequisites
- User is logged in
- Project exists and user has access

### Steps
1. Navigate to Projects page
2. Select a project from sidebar
3. Click "View details" link
4. Verify project details page loads
5. Check project information:
   - Title and code
   - Description
   - Priority
   - Deadline
   - Members/Assignees
   - Statistics

### Expected Results
- "View details" link is clickable
- Project details page loads correctly
- All project information displays accurately
- Project statistics are visible
- Navigation back to projects list works
- URL reflects project ID: `/app/projects/info/:projectId`

### Edge Cases
- Project with no description
- Project with no deadline
- Project with no members
- Very long description (text wrapping)

---

## Scenario 5: Edit Project

### User Role
- Admin (or user with `projects:write` permission)

### Prerequisites
- User is logged in
- Project exists
- User has permission to edit

### Steps
1. Navigate to project details page
2. Click "Edit" button (if available on details page)
   OR
   Navigate to edit project page
3. Modify project fields:
   - Change title
   - Update description
   - Change priority
   - Update deadline
   - Add/remove members
4. Save changes
5. Verify updates

### Expected Results
- Edit button/option is available
- Edit form pre-populates with current values
- All fields are editable
- Form validation works
- Success message appears after save
- Changes reflect in project details
- Changes reflect in project list

### Test Data
- Updated title: `Updated Test Project`
- Updated description: `Updated description`
- Changed priority: `Medium` → `High`
- New deadline: `2025-01-31`

### Edge Cases
- Edit with no changes
- Edit with invalid data
- Network error during save
- Concurrent edits (if applicable)

---

## Scenario 6: Delete Project

### User Role
- Admin (or user with `projects:delete` permission)

### Prerequisites
- User is logged in
- Project exists
- User has permission to delete

### Steps
1. Navigate to project details page
2. Click "Delete" button
3. Confirm deletion (if confirmation dialog)
4. Verify project deletion

### Expected Results
- Delete button is visible (if user has permission)
- Confirmation dialog appears (if implemented)
- Project is deleted from system
- Success message appears
- User is redirected to projects list
- Project no longer appears in list
- Associated tasks are handled appropriately (deleted or orphaned as per business logic)

### Edge Cases
- Delete project with active tasks
- Delete project with file attachments
- Cancel deletion
- Network error during deletion
- Delete non-existent project

---

## Scenario 7: Project Statistics

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Project exists with tasks and activity

### Steps
1. Navigate to project details page
2. View project statistics section
3. Verify statistics display:
   - Total tasks
   - Completed tasks
   - In progress tasks
   - Time spent
   - Completion rate

### Expected Results
- Statistics section is visible
- All statistics display correctly
- Statistics update when tasks change
- Charts/graphs render properly (if applicable)
- Statistics are accurate

### Test Data
- Project with:
  - 10 total tasks
  - 5 completed tasks
  - 3 in progress tasks
  - 2 pending tasks
  - 40 hours time spent

---

## Scenario 8: Project Member Management

### User Role
- Admin (or project owner)

### Prerequisites
- User is logged in
- Project exists
- Multiple users exist in system

### Steps
1. Navigate to project details page
2. View project members section
3. Add new member:
   - Click "Add Member" (if available)
   - Select user from list
   - Confirm addition
4. Remove member:
   - Click remove/delete icon next to member
   - Confirm removal
5. Verify member changes

### Expected Results
- Members list displays correctly
- Add member functionality works
- Remove member functionality works
- Member changes reflect immediately
- Removed members lose access to project
- Added members gain access to project

### Edge Cases
- Add member who is already a member
- Remove project owner
- Remove last member
- Add/remove during active task assignment

---

## Scenario 9: Project Views (List/Tile/Timeline)

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Project is selected
- Tasks exist in project

### Steps
1. Navigate to Projects page
2. Select a project
3. Switch between view options:
   - List view
   - Tile view (if available)
   - Timeline view (if available)
4. Verify each view displays correctly

### Expected Results
- View toggle buttons are visible
- List view shows tasks in list format
- Tile view shows tasks as cards (if implemented)
- Timeline view shows tasks on timeline (if implemented)
- View preference persists (if implemented)
- Tasks are visible in all views
- Mobile devices show appropriate view (list only)

### Edge Cases
- Switch views with no tasks
- Switch views with many tasks (performance)
- View switching during task updates

---

## Scenario 10: Project Pagination

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Many projects exist (more than one page)

### Steps
1. Navigate to Projects page
2. Verify pagination controls appear
3. Navigate to next page
4. Navigate to previous page
5. Navigate to specific page number
6. Verify projects load correctly

### Expected Results
- Pagination controls are visible when needed
- Page navigation works correctly
- Projects load for each page
- Current page is highlighted
- Page size is appropriate
- Total count displays correctly

### Edge Cases
- Last page navigation
- First page navigation
- Invalid page number
- Empty page







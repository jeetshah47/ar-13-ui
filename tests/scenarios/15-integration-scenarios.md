# Cross-Feature Integration Test Scenarios

## Scenario 1: Complete Project and Task Workflow

### User Role
- Admin

### Prerequisites
- User is logged in
- Backend API is running

### Steps
1. **Create Project**:
   - Navigate to Projects page
   - Create new project: "Integration Test Project"
   - Assign team members
2. **Create Tasks**:
   - Select the project
   - Create multiple tasks with different statuses
   - Assign tasks to team members
3. **Track Progress**:
   - Log time to tasks
   - Update task statuses
   - Upload files to tasks
4. **Monitor Dashboard**:
   - Navigate to Dashboard
   - Verify project appears in statistics
   - Verify tasks are counted
5. **Complete Project**:
   - Mark all tasks as done
   - Update project status to "Completed"
   - Verify completion reflects in dashboard

### Expected Results
- All steps complete successfully
- Data flows correctly between features
- Statistics update in real-time
- No data inconsistencies
- Activity logs track all actions

---

## Scenario 2: Vacation Request and Calendar Integration

### User Role
- Standard User → Admin

### Prerequisites
- User is logged in
- Calendar and Vacation features are accessible

### Steps
1. **Request Vacation** (Standard User):
   - Navigate to Vacations page
   - Create vacation request for specific dates
   - Submit request
2. **Approve Request** (Admin):
   - Switch to Admin user
   - Navigate to Vacations page
   - Approve the vacation request
3. **Verify Calendar**:
   - Navigate to Calendar page
   - Verify approved vacation appears on calendar
   - Check vacation dates are marked
4. **Verify Dashboard**:
   - Navigate to Dashboard
   - Check calendar events widget shows vacation

### Expected Results
- Vacation request workflow completes
- Approved vacation appears in calendar
- Calendar events widget shows vacation
- Dates are correctly marked
- Integration between features works

---

## Scenario 3: Task Assignment and Notification Flow

### User Role
- Admin → Standard User

### Prerequisites
- User is logged in
- Notification system is enabled
- Multiple users exist

### Steps
1. **Assign Task** (Admin):
   - Navigate to Projects page
   - Create task
   - Assign task to Standard User
2. **Receive Notification** (Standard User):
   - Switch to Standard User
   - Verify notification received
   - Click notification
3. **Work on Task**:
   - Navigate to task details
   - Log time to task
   - Update task status
   - Add comment
4. **Verify Updates**:
   - Switch back to Admin
   - Verify task updates are visible
   - Check activity logs show all actions

### Expected Results
- Task assignment triggers notification
- Notification navigation works
- Task updates are tracked
- Activity logs reflect all actions
- Real-time updates work (if WebSocket enabled)

---

## Scenario 4: File Attachment and Task Integration

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Task exists
- File storage is configured

### Steps
1. **Upload File to Task**:
   - Navigate to task details
   - Upload file attachment
   - Verify file appears
2. **Link File from NAS**:
   - Click "Link File" button
   - Browse NAS storage
   - Link file from storage
   - Verify linked file appears
3. **Use File in Activity**:
   - Add comment referencing file
   - Verify file is accessible from comment
4. **Verify Project Level**:
   - Navigate to project details
   - Verify file attachments are tracked at project level (if applicable)

### Expected Results
- File upload works
- File linking works
- Files are accessible
- Files appear in activity logs
- Project-level tracking works (if implemented)

---

## Scenario 5: Employee Management and Project Assignment

### User Role
- Admin

### Prerequisites
- User is logged in as Admin
- Employees exist

### Steps
1. **Register New Employee**:
   - Navigate to Employees page
   - Register new employee
   - Assign role and permissions
2. **Assign to Project**:
   - Navigate to Projects page
   - Open project details
   - Add new employee as project member
3. **Assign Task to Employee**:
   - Create task in project
   - Assign task to new employee
4. **Verify Employee Profile**:
   - Navigate to employee profile
   - Verify project appears in assigned projects
   - Verify task appears in assigned tasks
   - Check statistics update

### Expected Results
- Employee registration works
- Project assignment works
- Task assignment works
- Employee profile reflects assignments
- Statistics are accurate

---

## Scenario 6: Dashboard Data Aggregation

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Multiple projects and tasks exist

### Steps
1. **Create Multiple Projects**:
   - Create 3 projects with different statuses
   - Create tasks in each project
   - Assign tasks to different users
2. **Update Project Statuses**:
   - Mark one project as "Completed"
   - Mark one project as "On Hold"
   - Keep one project as "Active"
3. **Verify Dashboard Statistics**:
   - Navigate to Dashboard
   - Verify project statistics:
     - Total projects: 3
     - Active: 1
     - Completed: 1
     - On Hold: 1
   - Verify task statistics are accurate
   - Verify charts reflect data

### Expected Results
- Dashboard statistics are accurate
- Project counts are correct
- Task counts are correct
- Charts display correctly
- Data updates when projects change

---

## Scenario 7: Activity Log Cross-Entity Tracking

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Projects and tasks exist

### Steps
1. **Perform Actions Across Entities**:
   - Create project (activity log created)
   - Create task in project (activity log in both project and task)
   - Assign task (activity log in task)
   - Upload file (activity log in task)
   - Log time (activity log in task)
2. **Verify Activity Logs**:
   - Check project activity logs
   - Check task activity logs
   - Verify all actions are tracked
   - Verify cross-references work

### Expected Results
- All actions create activity logs
- Activity logs appear in correct entities
- Cross-references are accurate
- Activity logs are linked correctly

---

## Scenario 8: Permission Changes and Access Updates

### User Role
- Admin → Standard User

### Prerequisites
- User is logged in
- Standard user exists
- Projects and tasks exist

### Steps
1. **Initial State** (Standard User):
   - Log in as Standard User
   - Verify limited access
   - Note accessible projects/tasks
2. **Grant Access** (Admin):
   - Switch to Admin
   - Add Standard User to project
   - Grant additional permissions
3. **Verify Access Update** (Standard User):
   - Switch back to Standard User
   - Refresh page (if needed)
   - Verify new project is accessible
   - Verify new permissions work
4. **Revoke Access** (Admin):
   - Switch to Admin
   - Remove user from project
5. **Verify Access Revoked** (Standard User):
   - Switch back to Standard User
   - Verify project is no longer accessible

### Expected Results
- Permission changes take effect
- Access updates correctly
- UI reflects permission changes
- No broken states
- Error handling works for revoked access

---

## Scenario 9: Multi-User Concurrent Operations

### User Role
- Multiple Users

### Prerequisites
- Multiple users logged in
- Shared project exists
- Real-time updates enabled (WebSocket)

### Steps
1. **User A Actions**:
   - Create task in shared project
   - Assign task to User B
2. **User B Actions** (Simultaneously):
   - View project
   - See new task appear in real-time
   - Update task status
3. **User A Verification**:
   - See task status update in real-time
   - Verify no conflicts
4. **User C Actions**:
   - Add comment to task
   - Verify all users see comment

### Expected Results
- Real-time updates work
- No data conflicts
- All users see updates
- WebSocket connections stable
- Concurrent edits handled correctly

---

## Scenario 10: End-to-End Project Lifecycle

### User Role
- Admin

### Prerequisites
- User is logged in
- Clean system state

### Steps
1. **Project Creation**:
   - Create new project
   - Assign team members
   - Set deadline
2. **Task Planning**:
   - Create multiple tasks
   - Assign tasks to team members
   - Set task deadlines
   - Set task priorities
3. **Execution Phase**:
   - Team members log time
   - Update task statuses
   - Upload files
   - Add comments
4. **Monitoring**:
   - View dashboard statistics
   - Check project progress
   - Review activity logs
5. **Completion**:
   - Mark all tasks as done
   - Update project status
   - Verify final statistics
6. **Reporting**:
   - View project statistics
   - Export data (if available)
   - Review time tracking

### Expected Results
- Complete workflow executes successfully
- All features work together
- Data is consistent throughout
- Statistics are accurate
- No errors or broken states
- Performance is acceptable

---

## Scenario 11: Error Handling and Recovery

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Network can be controlled (for testing)

### Steps
1. **Normal Operation**:
   - Perform normal actions
   - Verify everything works
2. **Simulate Network Error**:
   - Disconnect network
   - Attempt to create task
   - Verify error handling
3. **Recovery**:
   - Reconnect network
   - Verify system recovers
   - Retry failed operation
4. **Partial Failure**:
   - Simulate partial network failure
   - Attempt multiple operations
   - Verify graceful degradation

### Expected Results
- Errors are handled gracefully
- User-friendly error messages
- System recovers correctly
- No data loss
- Retry mechanisms work
- Partial failures don't break system

---

## Scenario 12: Data Consistency Across Features

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Data exists across features

### Steps
1. **Create Data**:
   - Create project with tasks
   - Assign users
   - Log time
   - Upload files
2. **Verify Consistency**:
   - Check project statistics match task counts
   - Check time logged matches activity logs
   - Check file counts match uploads
   - Check user assignments match across views
3. **Update Data**:
   - Update task status
   - Add more time
   - Upload more files
4. **Re-verify Consistency**:
   - Check all statistics update
   - Verify no inconsistencies

### Expected Results
- Data is consistent across features
- Statistics match actual data
- Updates propagate correctly
- No orphaned data
- No duplicate data







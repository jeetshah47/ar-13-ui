# Role-Based Access Control (RBAC) Test Scenarios

## Scenario 1: Admin User Access

### User Role
- Admin

### Prerequisites
- Admin user account exists
- User is logged in as Admin

### Steps
1. Log in as Admin user
2. Navigate through all major sections:
   - Dashboard
   - Projects
   - Calendar
   - Employees
   - Vacations
   - Info Portal
   - Metrics
   - Audit Logs
   - Backup
   - Drawing List
3. Verify access to all features

### Expected Results
- Admin can access all pages
- All navigation items are visible
- Admin-specific features are available:
  - Create/Edit/Delete projects
  - Manage employees
  - Approve/reject vacation requests
  - View metrics and audit logs
  - Access backup functionality
- No permission denied errors

### Test Data
- Admin user: `admin@example.com`
- Admin permissions: All permissions enabled

---

## Scenario 2: Standard User Access

### User Role
- Standard User

### Prerequisites
- Standard user account exists
- User is logged in as Standard user
- User is assigned to at least one project

### Steps
1. Log in as Standard user
2. Navigate through available sections
3. Attempt to access Admin-only features
4. Verify restricted access

### Expected Results
- Standard user can access:
  - Dashboard (with filtered data)
  - Projects (only assigned projects)
  - Calendar
  - Profile
  - Info Portal (read-only)
- Standard user cannot access:
  - Employees page (redirects or shows error)
  - Metrics page
  - Audit Logs page
  - Backup page
  - Vacation approval (only can request)
- Permission denied messages appear appropriately

### Test Data
- Standard user: `standard@example.com`
- Assigned project: `Project-001`

---

## Scenario 3: Project Access Control

### User Role
- Standard User

### Prerequisites
- Multiple projects exist
- User is assigned to some projects but not others

### Steps
1. Log in as Standard user
2. Navigate to Projects page
3. Verify project list
4. Attempt to access unassigned project via direct URL

### Expected Results
- Only assigned projects appear in list
- Search and filter work on assigned projects only
- Direct URL access to unassigned project:
  - Redirects to dashboard, OR
  - Shows "Access Denied" message
- Cannot view project details of unassigned project

### Test Data
- Assigned projects: `Project-001`, `Project-002`
- Unassigned project: `Project-003`

---

## Scenario 4: Task Access Control

### User Role
- Standard User

### Prerequisites
- Tasks exist in assigned projects
- Some tasks are assigned to user, others are not

### Steps
1. Log in as Standard user
2. Navigate to Projects page
3. Select assigned project
4. View task list
5. Attempt to access unassigned task

### Expected Results
- Can view all tasks in assigned projects
- Can create tasks in assigned projects
- Can edit tasks assigned to self
- Cannot edit tasks assigned to others (or limited edit)
- Cannot delete tasks without permission
- Cannot transfer tasks without permission

### Edge Cases
- Task assigned to multiple users
- Task unassigned (no assignee)
- Task in project user is not member of

---

## Scenario 5: Permission-Based UI Elements

### User Role
- Standard User

### Prerequisites
- User is logged in
- User has limited permissions

### Steps
1. Navigate to Projects page
2. Check for "Add Project" button
3. Navigate to Employees page (if accessible)
4. Check for "Add Employee" button
5. Navigate to Vacations page
6. Check for "Add Request" button

### Expected Results
- Buttons are hidden if user lacks permission
- Buttons are disabled if user lacks permission
- Appropriate tooltips/messages explain restrictions
- No JavaScript errors from missing elements

### Test Cases
- `projects:write` permission → Add Project button visible
- `users:write` permission → Add Employee button visible
- `vacation:write` permission → Add Request button visible
- Missing permissions → Buttons hidden/disabled

---

## Scenario 6: Route Protection

### User Role
- Unauthenticated / Standard User

### Prerequisites
- User is not logged in OR logged in as Standard user

### Steps
1. Attempt to access protected route directly:
   - `/app/dashboard`
   - `/app/projects`
   - `/app/employees`
   - `/app/metrics`
2. Verify redirect behavior

### Expected Results
- Unauthenticated users:
  - Redirected to `/auth/login`
  - Original URL preserved for redirect after login
- Authenticated users without permission:
  - Redirected to `/app/dashboard` (or appropriate page)
  - Error message displayed (optional)

### Edge Cases
- Deep link to specific task/project
- Browser back button after redirect
- Multiple redirects in sequence

---

## Scenario 7: API Permission Enforcement

### User Role
- Standard User

### Prerequisites
- User is logged in
- Backend API enforces permissions

### Steps
1. Attempt to perform unauthorized actions:
   - Create project (without `projects:write`)
   - Delete project (without `projects:delete`)
   - Approve vacation (without `vacation:approve`)
   - Access employee list (without `employees:read`)
2. Verify API responses

### Expected Results
- API returns 403 Forbidden for unauthorized actions
- Error messages are user-friendly
- UI handles errors gracefully
- No sensitive data exposed in error messages

### Test Cases
- POST `/api/projects` without `projects:write` → 403
- DELETE `/api/projects/:id` without `projects:delete` → 403
- PUT `/api/vacations/:id/approve` without `vacation:approve` → 403
- GET `/api/employees` without `employees:read` → 403

---

## Scenario 8: Permission Changes During Session

### User Role
- Authenticated User

### Prerequisites
- User is logged in
- Admin can modify user permissions

### Steps
1. Log in as Standard user
2. Admin revokes a permission (e.g., `projects:write`)
3. User attempts to use feature requiring that permission
4. Verify behavior

### Expected Results
- User session reflects permission changes
- Features become unavailable immediately (or after refresh)
- Appropriate error messages displayed
- No broken UI states

### Edge Cases
- Permission revoked during active operation
- Multiple permissions changed simultaneously
- Role change (Standard → Admin or vice versa)







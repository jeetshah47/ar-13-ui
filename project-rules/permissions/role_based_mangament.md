# Role-Based Access Control (RBAC) System

This document describes the role-based access control system implemented in the AR-13 Node.js backend project.

## Overview

The RBAC system provides fine-grained access control based on user roles. It ensures that users can only access and modify resources they are authorized to work with.

## User Roles

### Admin
- **Full Access**: Admin users have complete access to all system operations
- **Permissions**: All permissions including user management, project management, task assignment, and vacation approval

### Standard
- **Limited Access**: Standard users have restricted access based on resource ownership/assignment
- **Permissions**: Can only access projects they own or are members of, and tasks assigned to them

## Permission System

The system uses a permission-based approach with the following permission types:

### Project Permissions
- `projects:read` - View projects
- `projects:write` - Create and update projects
- `projects:delete` - Delete projects

### Task Permissions
- `tasks:read` - View tasks
- `tasks:write` - Create, update, and modify tasks
- `tasks:delete` - Delete tasks
- `tasks:assign` - Assign tasks to users

### User Management Permissions
- `users:read` - View user information
- `users:write` - Create and update users
- `users:delete` - Delete users

### Calendar Permissions
- `calendar:read` - View calendar events
- `calendar:write` - Create and update calendar events
- `calendar:delete` - Delete calendar events

### Vacation Permissions
- `vacation:read` - View vacation requests
- `vacation:write` - Create and update vacation requests
- `vacation:delete` - Delete vacation requests
- `vacation:approve` - Approve/reject vacation requests

### Notification Permissions
- `notifications:read` - View notifications
- `notifications:write` - Mark notifications as read
- `notifications:delete` - Delete notifications

### Dashboard Permissions
- `dashboard:read` - View dashboard statistics

## Role Permissions Matrix

| Permission | Admin | Standard |
|------------|-------|----------|
| projects:read | ✅ | ✅ |
| projects:write | ✅ | ❌ |
| projects:delete | ✅ | ❌ |
| tasks:read | ✅ | ✅ |
| tasks:write | ✅ | ✅ |
| tasks:delete | ✅ | ✅ |
| tasks:assign | ✅ | ❌ |
| users:read | ✅ | ❌ |
| users:write | ✅ | ❌ |
| users:delete | ✅ | ❌ |
| calendar:read | ✅ | ✅ |
| calendar:write | ✅ | ✅ |
| calendar:delete | ✅ | ✅ |
| vacation:read | ✅ | ✅ |
| vacation:write | ✅ | ✅ |
| vacation:delete | ✅ | ✅ |
| vacation:approve | ✅ | ❌ |
| notifications:read | ✅ | ✅ |
| notifications:write | ✅ | ✅ |
| notifications:delete | ✅ | ✅ |
| dashboard:read | ✅ | ✅ |

## Resource Ownership Rules

### Projects
- **Admin**: Can access all projects
- **Standard**: Can only access projects where they are:
  - The owner (`ownerId` matches user ID)
  - A member (`membersIds` array contains user ID)

### Tasks
- **Admin**: Can access all tasks
- **Standard**: Can only access tasks where they are:
  - Assigned to the task (`assignTo` array contains user ID)

## Implementation Details

### Middleware Components

1. **`authenticateUser`**: Enhanced authentication that extracts user role from Firebase token
2. **`requirePermission`**: Checks if user has specific permission
3. **`requireAdmin`**: Ensures user has Admin role
4. **`requireProjectAccess`**: Validates project ownership/membership
5. **`requireTaskAccess`**: Validates task assignment

### Route Protection

All routes are protected with appropriate middleware combinations:

```typescript
// Example: Project routes
projectRouter.get(Paths.Project.Get, ProjectRoutes.getAll);
projectRouter.get(
  Paths.Project.GetOne, 
  requireProjectAccess, 
  ProjectRoutes.getOne,
);
projectRouter.post(
  Paths.Project.Add, 
  requirePermission('projects:write'), 
  ProjectRoutes.add,
);
```

### Database Integration

The system integrates with Firebase Firestore to:
- Fetch user role information during authentication
- Validate resource ownership and membership
- Check task assignments

## Security Features

1. **Token Validation**: All requests require valid Firebase authentication tokens
2. **Role Verification**: User roles are verified against the database on each request
3. **Resource Ownership**: Access is restricted based on actual resource ownership/assignment
4. **Permission Granularity**: Fine-grained permissions prevent unauthorized access

## Usage Examples

### Admin User
- Can view all projects and tasks
- Can create, update, and delete any project
- Can assign tasks to any user
- Can manage user accounts
- Can approve vacation requests

### Standard User
- Can view projects they own or are members of
- Can view and modify tasks assigned to them
- Cannot create or delete projects
- Cannot assign tasks to others
- Cannot manage user accounts
- Cannot approve vacation requests

## Error Handling

The system returns appropriate HTTP status codes:
- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: Insufficient permissions or access denied
- `404 Not Found`: Resource not found or not accessible to user

## Testing

The RBAC system has been tested to ensure:
- Admin users have full access to all operations
- Standard users are properly restricted based on ownership/assignment
- Permission checks work correctly for all route combinations
- Error handling provides appropriate feedback

## Future Enhancements

Potential improvements to consider:
1. **Role Hierarchy**: Support for multiple role levels
2. **Custom Permissions**: Allow custom permission sets per user
3. **Temporary Permissions**: Time-limited access grants
4. **Audit Logging**: Track permission usage and access patterns
5. **Permission Groups**: Group permissions for easier management

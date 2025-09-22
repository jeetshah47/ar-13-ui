# Role-Based Access Control (RBAC) Implementation

This document describes the role-based access control system implemented in the AR-13 React frontend project.

## Overview

The RBAC system provides fine-grained access control based on user roles and permissions. It ensures that users can only access and modify resources they are authorized to work with.

## Architecture

### Core Components

1. **Types and Interfaces** (`src/store/types/RBAC/`)
   - `index.ts`: Core RBAC types and interfaces
   - `config.ts`: Permission matrix and utility functions

2. **Hooks** (`src/store/hooks/`)
   - `usePermissions.ts`: Permission checking utilities
   - `useResourceAccess.ts`: Resource-specific access control

3. **Components** (`src/common/components/RBAC/`)
   - `RequirePermission.tsx`: Permission-based rendering
   - `RequireResourceAccess.tsx`: Resource-based access control
   - `RoleBasedExample.tsx`: Usage examples and demo

4. **State Management**
   - Extended auth state to include user role and permissions
   - Role-based filtering in project and task slices

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

## Usage Examples

### Permission-Based Rendering

```tsx
import { RequirePermission } from '../common/components/RBAC';

// Show button only if user has permission
<RequirePermission permission="projects:write">
  <Button onClick={handleCreateProject}>
    Create Project
  </Button>
</RequirePermission>

// Show content with fallback
<RequirePermission 
  permission="users:write" 
  fallback={<Typography>Access Denied</Typography>}
>
  <UserManagementPanel />
</RequirePermission>
```

### Role-Based Rendering

```tsx
import { RequireAdmin, RequireStandard } from '../common/components/RBAC';

// Admin-only content
<RequireAdmin>
  <AdminPanel />
</RequireAdmin>

// Standard user content
<RequireStandard>
  <StandardUserPanel />
</RequireStandard>
```

### Resource-Based Access Control

```tsx
import { RequireProjectAccess, RequireTaskAccess } from '../common/components/RBAC';

// Project access control
<RequireProjectAccess project={project} accessType="write">
  <ProjectEditForm project={project} />
</RequireProjectAccess>

// Task access control
<RequireTaskAccess task={task} accessType="delete">
  <DeleteTaskButton taskId={task.id} />
</RequireTaskAccess>
```

### Using Hooks for Conditional Logic

```tsx
import { usePermissions, useResourceAccess } from '../store/hooks/usePermissions';

const MyComponent = () => {
  const { checkPermission, isAdmin, userRole } = usePermissions();
  const { canAssignTask, canManageUsers } = useResourceAccess();

  const handleAction = () => {
    if (!checkPermission('tasks:assign')) {
      toast.error('You do not have permission to assign tasks');
      return;
    }
    // Proceed with task assignment
  };

  return (
    <div>
      {isAdmin() && <AdminControls />}
      {canAssignTask() && <TaskAssignmentPanel />}
    </div>
  );
};
```

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

### State Management

The auth state has been extended to include user role and permissions:

```typescript
interface AuthState {
  // ... existing fields
  user: {
    role: UserRole | null;
    permissions: Permission[];
    email: string | null;
    name: string | null;
  };
}
```

### Filtering

Projects and tasks are automatically filtered based on user role:

- **Admin**: Sees all projects and tasks
- **Standard**: Only sees projects they own/are members of and tasks assigned to them

### Local Storage

User role information is stored in localStorage for persistence:
- `userRole`: User's role (Admin/Standard)
- `userEmail`: User's email
- `userName`: User's display name

## Security Features

1. **Client-Side Validation**: All UI components check permissions before rendering
2. **State-Based Filtering**: Data is filtered at the Redux level based on user role
3. **Resource Ownership**: Access is restricted based on actual resource ownership/assignment
4. **Permission Granularity**: Fine-grained permissions prevent unauthorized access

## Testing

The RBAC system includes:
- Permission checking utilities
- Role-based component rendering
- Resource access validation
- Comprehensive example component (`RoleBasedExample.tsx`)

## Future Enhancements

Potential improvements to consider:
1. **Role Hierarchy**: Support for multiple role levels
2. **Custom Permissions**: Allow custom permission sets per user
3. **Temporary Permissions**: Time-limited access grants
4. **Audit Logging**: Track permission usage and access patterns
5. **Permission Groups**: Group permissions for easier management
6. **Dynamic Permissions**: Permissions that change based on context or time

## Migration Notes

When implementing this RBAC system:

1. **Update Auth State**: Ensure your auth slice includes the new user fields
2. **Set User Role**: Update your authentication flow to set user role in localStorage
3. **Wrap Components**: Use RBAC components to protect sensitive UI elements
4. **Update API Calls**: Ensure backend APIs respect the same permission model
5. **Test Thoroughly**: Verify that users can only access what they're authorized to see

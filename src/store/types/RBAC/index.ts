// Role-Based Access Control Types

export type UserRole = 'Admin' | 'Standard';

export type Permission = 
  // Project Permissions
  | 'projects:read'
  | 'projects:write'
  | 'projects:delete'
  // Task Permissions
  | 'tasks:read'
  | 'tasks:write'
  | 'tasks:delete'
  | 'tasks:assign'
  // User Management Permissions
  | 'users:read'
  | 'users:write'
  | 'users:delete'
  // Calendar Permissions
  | 'calendar:read'
  | 'calendar:write'
  | 'calendar:delete'
  // Vacation Permissions
  | 'vacation:read'
  | 'vacation:write'
  | 'vacation:delete'
  | 'vacation:approve'
  // Notification Permissions
  | 'notifications:read'
  | 'notifications:write'
  | 'notifications:delete'
  // Dashboard Permissions
  | 'dashboard:read';

export interface RolePermissions {
  [key: string]: Permission[];
}

export interface UserContext {
  uid: string;
  role: UserRole;
  permissions: Permission[];
  email?: string;
  name?: string;
}

export interface ResourceAccess {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canAssign?: boolean;
  canApprove?: boolean;
}

export interface ProjectAccess extends ResourceAccess {
  isOwner: boolean;
  isMember: boolean;
}

export interface TaskAccess extends ResourceAccess {
  isAssigned: boolean;
}

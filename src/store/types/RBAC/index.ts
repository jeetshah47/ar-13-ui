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
  | 'users:profile'
  | 'users:invite'
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
  // Activity Logs Permissions
  | 'activityLogs:read'
  // Dashboard Permissions
  | 'dashboard:read'
  // Employees Permissions
  | 'employees:read'
  // Info Portal Permissions
  | 'infoPortal:read'
  | 'infoPortal:write'
  | 'infoPortal:delete'
  // Google Account Permissions
  | 'googleAccount:read'
  | 'googleAccount:write'
  | 'googleAccount:link'
  | 'googleAccount:unlink'
  // WebSocket Permissions
  | 'websocket:connect'
  // Auth Permissions
  | 'auth:read'
  // Project Details Permissions
  | 'projectDetails:read'
  | 'projectDetails:write'
  | 'projectDetails:delete'
  // Backup Permissions
  | 'backup:read'
  | 'backup:write'
  // Drawing List Permissions
  | 'drawingList:read'
  | 'drawingList:write'
  | 'drawingList:delete';

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

// Permissions API Response
export interface PermissionsResponse {
  role: UserRole;
  permissions: Permission[];
}

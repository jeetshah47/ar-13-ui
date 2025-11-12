import type { RolePermissions, UserRole, Permission } from './index';

// Role-Permission Matrix based on PERMISSIONS_API.md specification
export const ROLE_PERMISSIONS: RolePermissions = {
  Admin: [
    // Project Permissions
    'projects:read',
    'projects:write',
    'projects:delete',
    // Task Permissions
    'tasks:read',
    'tasks:write',
    'tasks:delete',
    'tasks:assign',
    // User Management Permissions
    'users:read',
    'users:write',
    'users:delete',
    'users:profile',
    'users:invite',
    // Calendar Permissions
    'calendar:read',
    'calendar:write',
    'calendar:delete',
    // Vacation Permissions
    'vacation:read',
    'vacation:write',
    'vacation:delete',
    'vacation:approve',
    // Notification Permissions
    'notifications:read',
    'notifications:write',
    'notifications:delete',
    // Activity Logs Permissions
    'activityLogs:read',
    // Dashboard Permissions
    'dashboard:read',
    // Employees Permissions
    'employees:read',
    // Info Portal Permissions
    'infoPortal:read',
    'infoPortal:write',
    'infoPortal:delete',
    // Google Account Permissions
    'googleAccount:read',
    'googleAccount:write',
    'googleAccount:link',
    'googleAccount:unlink',
    // WebSocket Permissions
    'websocket:connect',
    // Auth Permissions
    'auth:read',
    // Project Details Permissions
    'projectDetails:read',
    'projectDetails:write',
    'projectDetails:delete',
    // Backup Permissions
    'backup:read',
    'backup:write',
  ],
  Standard: [
    // Project Permissions
    'projects:read',
    // Task Permissions
    'tasks:read',
    'tasks:write',
    'tasks:delete',
    // Calendar Permissions
    'calendar:read',
    'calendar:write',
    'calendar:delete',
    // Vacation Permissions
    'vacation:read',
    'vacation:write',
    'vacation:delete',
    // Notification Permissions
    'notifications:read',
    'notifications:write',
    'notifications:delete',
    // Activity Logs Permissions
    'activityLogs:read',
    // Dashboard Permissions
    'dashboard:read',
    // Employees Permissions
    'employees:read',
    // Info Portal Permissions
    'infoPortal:read',
    'infoPortal:write',
    'infoPortal:delete',
    // Google Account Permissions
    'googleAccount:read',
    'googleAccount:write',
    'googleAccount:link',
    'googleAccount:unlink',
    // WebSocket Permissions
    'websocket:connect',
    // Auth Permissions
    'auth:read',
    // User Management Permissions
    'users:profile',
    // Project Details Permissions
    'projectDetails:read',
  ],
};

export const getPermissionsForRole = (role: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[role] || [];
};

export const hasPermission = (userPermissions: Permission[], requiredPermission: Permission): boolean => {
  return userPermissions.includes(requiredPermission);
};

export const hasAnyPermission = (userPermissions: Permission[], requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

export const hasAllPermissions = (userPermissions: Permission[], requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.every(permission => userPermissions.includes(permission));
};

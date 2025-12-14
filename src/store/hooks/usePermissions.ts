import { useAppSelector } from '../store';
import type { Permission } from '../types/RBAC';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../types/RBAC/config';

export const usePermissions = () => {
  const authState = useAppSelector((state) => state.authReducer);
  
  const userPermissions = authState.user.permissions;
  const userRole = authState.user.role;
  const isAuthenticated = authState.common.isLogin;
  
  const checkPermission = (permission: Permission): boolean => {
    if (!isAuthenticated || !userPermissions) return false;
    return hasPermission(userPermissions, permission);
  };
  
  const checkAnyPermission = (permissions: Permission[]): boolean => {
    if (!isAuthenticated || !userPermissions) return false;
    return hasAnyPermission(userPermissions, permissions);
  };
  
  const checkAllPermissions = (permissions: Permission[]): boolean => {
    if (!isAuthenticated || !userPermissions) return false;
    return hasAllPermissions(userPermissions, permissions);
  };
  
  const isAdmin = (): boolean => {
    return userRole === 'Admin';
  };
  
  const isStandard = (): boolean => {
    return userRole === 'Standard';
  };
  
  return {
    userPermissions,
    userRole,
    isAuthenticated,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    isAdmin,
    isStandard,
  };
};

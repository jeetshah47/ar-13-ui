import React from 'react';
import { usePermissions } from '../../../store/hooks/usePermissions';
import type { Permission } from '../../../store/types/RBAC';

interface RequirePermissionProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const { checkPermission } = usePermissions();
  
  if (!checkPermission(permission)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

interface RequireAnyPermissionProps {
  permissions: Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequireAnyPermission: React.FC<RequireAnyPermissionProps> = ({
  permissions,
  children,
  fallback = null,
}) => {
  const { checkAnyPermission } = usePermissions();
  
  if (!checkAnyPermission(permissions)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

interface RequireAllPermissionsProps {
  permissions: Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequireAllPermissions: React.FC<RequireAllPermissionsProps> = ({
  permissions,
  children,
  fallback = null,
}) => {
  const { checkAllPermissions } = usePermissions();
  
  if (!checkAllPermissions(permissions)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

interface RequireRoleProps {
  role: 'Admin' | 'Standard';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({
  role,
  children,
  fallback = null,
}) => {
  const { userRole } = usePermissions();
  
  if (userRole !== role) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export const RequireAdmin: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => {
  return <RequireRole role="Admin" fallback={fallback}>{children}</RequireRole>;
};

export const RequireStandard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback = null,
}) => {
  return <RequireRole role="Standard" fallback={fallback}>{children}</RequireRole>;
};

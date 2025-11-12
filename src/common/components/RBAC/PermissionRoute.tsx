import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { usePermissions } from "../../../store/hooks/usePermissions";
import { fetchPermissionsAction } from "../../../store/features/auth/authAction";
import { Box, CircularProgress, Typography } from "@mui/material";
import type { Permission, UserRole } from "../../../store/types/RBAC";

interface PermissionRouteProps {
  children: React.ReactNode;
  /**
   * Required permission to access this route
   * If provided, user must have this permission
   */
  permission?: Permission;
  /**
   * Required permissions (any of these)
   * If provided, user must have at least one of these permissions
   */
  anyPermission?: Permission[];
  /**
   * Required permissions (all of these)
   * If provided, user must have all of these permissions
   */
  allPermissions?: Permission[];
  /**
   * Required role to access this route
   * If provided, user must have this role
   */
  role?: UserRole;
  /**
   * Fallback component to render if permission check fails
   * Defaults to redirecting to /app/dashboard
   */
  fallback?: React.ReactNode;
  /**
   * Redirect path if permission check fails
   * Defaults to /app/dashboard
   */
  redirectTo?: string;
  /**
   * Show loading state while permissions are being fetched
   */
  showLoading?: boolean;
}

/**
 * PermissionRoute Component
 * 
 * Protects routes based on user permissions from the Permissions API.
 * Automatically fetches permissions if not already loaded.
 * 
 * @example
 * // Require specific permission
 * <PermissionRoute permission="projects:write">
 *   <ProjectPage />
 * </PermissionRoute>
 * 
 * @example
 * // Require any of multiple permissions
 * <PermissionRoute anyPermission={["projects:read", "projects:write"]}>
 *   <ProjectPage />
 * </PermissionRoute>
 * 
 * @example
 * // Require Admin role
 * <PermissionRoute role="Admin">
 *   <AdminPage />
 * </PermissionRoute>
 */
export const PermissionRoute: React.FC<PermissionRouteProps> = ({
  children,
  permission,
  anyPermission,
  allPermissions,
  role,
  fallback,
  redirectTo = "/app/dashboard",
  showLoading = true,
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { 
    userPermissions, 
    userRole, 
    isAuthenticated,
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
  } = usePermissions();
  
  const { permissionsLoading, permissionsError } = useAppSelector(
    (state) => state.authReducer
  );

  // Fetch permissions if not loaded and user is authenticated
  useEffect(() => {
    if (
      isAuthenticated &&
      (!userPermissions || userPermissions.length === 0) &&
      !permissionsLoading
    ) {
      dispatch(fetchPermissionsAction());
    }
  }, [dispatch, isAuthenticated, userPermissions, permissionsLoading]);

  // Show loading state while permissions are being fetched
  if (permissionsLoading && showLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography color="text.secondary">Loading permissions...</Typography>
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role requirement
  if (role && userRole !== role) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  // Check single permission requirement
  if (permission && !checkPermission(permission)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  // Check any permission requirement
  if (anyPermission && anyPermission.length > 0 && !checkAnyPermission(anyPermission)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  // Check all permissions requirement
  if (allPermissions && allPermissions.length > 0 && !checkAllPermissions(allPermissions)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  // If there's a permissions error but user has some permissions, show warning but allow access
  // This allows the app to continue working even if there was a temporary API error
  if (permissionsError && (!userPermissions || userPermissions.length === 0)) {
    // If we have no permissions at all and there's an error, redirect
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default PermissionRoute;


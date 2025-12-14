import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Typography,
  useTheme,
  Alert,
  Card,
  CardContent,
  Fade,
  IconButton,
  Tooltip,
  alpha,
  type Theme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Refresh,
  Folder,
  Assignment,
  People,
  CalendarToday,
  BeachAccess,
  Notifications,
  History,
  Dashboard,
  Badge,
  Info,
  AccountCircle,
  CloudSync,
  VpnKey,
  Description,
  Backup,
  CheckCircle,
  Security,
  Close,
} from "@mui/icons-material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { usePermissions } from "../../../store/hooks/usePermissions";
import { fetchPermissionsAction } from "../../../store/features/auth/authAction";
import type { Permission } from "../../../store/types/RBAC";

// Category icon mapping
const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, React.ReactElement> = {
    Projects: <Folder />,
    Tasks: <Assignment />,
    "User Management": <People />,
    Calendar: <CalendarToday />,
    Vacation: <BeachAccess />,
    Notifications: <Notifications />,
    "Activity Logs": <History />,
    Dashboard: <Dashboard />,
    Employees: <Badge />,
    "Info Portal": <Info />,
    "Google Account": <AccountCircle />,
    WebSocket: <CloudSync />,
    Auth: <VpnKey />,
    "Project Details": <Description />,
    Backup: <Backup />,
  };
  return iconMap[category] || <Security />;
};

// Category color mapping
const getCategoryColor = (category: string, theme: Theme) => {
  const colorMap: Record<string, string> = {
    Projects: theme.palette.primary.main,
    Tasks: theme.palette.info.main,
    "User Management": theme.palette.success.main,
    Calendar: theme.palette.warning.main,
    Vacation: theme.palette.secondary.main,
    Notifications: theme.palette.error.main,
    "Activity Logs": theme.palette.info.dark,
    Dashboard: theme.palette.primary.dark,
    Employees: theme.palette.success.dark,
    "Info Portal": theme.palette.info.main,
    "Google Account": theme.palette.warning.dark,
    WebSocket: theme.palette.secondary.dark,
    Auth: theme.palette.error.dark,
    "Project Details": theme.palette.primary.main,
    Backup: theme.palette.secondary.main,
  };
  return colorMap[category] || theme.palette.grey[500];
};

// Group permissions by category for better organization
const groupPermissionsByCategory = (permissions: Permission[]) => {
  const categories: Record<string, Permission[]> = {
    Projects: [],
    Tasks: [],
    "User Management": [],
    Calendar: [],
    Vacation: [],
    Notifications: [],
    "Activity Logs": [],
    Dashboard: [],
    Employees: [],
    "Info Portal": [],
    "Google Account": [],
    WebSocket: [],
    Auth: [],
    "Project Details": [],
    Backup: [],
  };

  permissions.forEach((permission) => {
    if (permission.startsWith("projects:")) {
      categories.Projects.push(permission);
    } else if (permission.startsWith("tasks:")) {
      categories.Tasks.push(permission);
    } else if (permission.startsWith("users:")) {
      categories["User Management"].push(permission);
    } else if (permission.startsWith("calendar:")) {
      categories.Calendar.push(permission);
    } else if (permission.startsWith("vacation:")) {
      categories.Vacation.push(permission);
    } else if (permission.startsWith("notifications:")) {
      categories.Notifications.push(permission);
    } else if (permission.startsWith("activityLogs:")) {
      categories["Activity Logs"].push(permission);
    } else if (permission.startsWith("dashboard:")) {
      categories.Dashboard.push(permission);
    } else if (permission.startsWith("employees:")) {
      categories.Employees.push(permission);
    } else if (permission.startsWith("infoPortal:")) {
      categories["Info Portal"].push(permission);
    } else if (permission.startsWith("googleAccount:")) {
      categories["Google Account"].push(permission);
    } else if (permission.startsWith("websocket:")) {
      categories.WebSocket.push(permission);
    } else if (permission.startsWith("auth:")) {
      categories.Auth.push(permission);
    } else if (permission.startsWith("projectDetails:")) {
      categories["Project Details"].push(permission);
    } else if (permission.startsWith("backup:")) {
      categories.Backup.push(permission);
    }
  });

  // Remove empty categories
  return Object.entries(categories).filter(([, perms]) => perms.length > 0);
};

// Format permission name for display
const formatPermissionName = (permission: Permission): string => {
  const [, action] = permission.split(":");
  const actionMap: Record<string, string> = {
    read: "Read",
    write: "Write",
    delete: "Delete",
    assign: "Assign",
    approve: "Approve",
    profile: "Profile",
    invite: "Invite",
    link: "Link",
    unlink: "Unlink",
    connect: "Connect",
  };
  return actionMap[action] || action.charAt(0).toUpperCase() + action.slice(1);
};

// Get permission action icon
const getPermissionIcon = (permission: Permission) => {
  const [, action] = permission.split(":");
  const iconMap: Record<string, React.ReactElement> = {
    read: <CheckCircle fontSize="small" />,
    write: <Description fontSize="small" />,
    delete: <Close fontSize="small" />,
    assign: <People fontSize="small" />,
    approve: <CheckCircle fontSize="small" />,
    profile: <AccountCircle fontSize="small" />,
    invite: <People fontSize="small" />,
    link: <CloudSync fontSize="small" />,
    unlink: <CloudSync fontSize="small" />,
    connect: <CloudSync fontSize="small" />,
  };
  return iconMap[action] || <Security fontSize="small" />;
};

const PermissionsSection = () => {
  const dispatch = useAppDispatch();
  const { userPermissions, userRole } = usePermissions();
  const { permissionsLoading, permissionsError } = useAppSelector(
    (state) => state.authReducer
  );
  const theme = useTheme();

  // Fetch permissions when component mounts (in case they need to be refreshed)
  useEffect(() => {
    // Only fetch if we don't have permissions or if there was an error
    if ((!userPermissions || userPermissions.length === 0) && !permissionsLoading) {
      dispatch(fetchPermissionsAction());
    }
  }, [dispatch, userPermissions, permissionsLoading]);

  const handleRefresh = () => {
    dispatch(fetchPermissionsAction());
  };

  // Loading state
  if (permissionsLoading && (!userPermissions || userPermissions.length === 0)) {
    return (
      <Box
        sx={{
          padding: "48px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          minHeight: "300px",
        }}
      >
        <CircularProgress size={48} thickness={4} />
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
          Loading permissions...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (permissionsError && (!userPermissions || userPermissions.length === 0)) {
    return (
      <Box sx={{ padding: "24px" }}>
        <Card
          sx={{
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
            border: (theme) => `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
          }}
        >
          <CardContent>
            <Alert
              severity="error"
              sx={{
                marginBottom: "24px",
                borderRadius: "12px",
                "& .MuiAlert-icon": {
                  fontSize: "28px",
                },
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {permissionsError}
              </Typography>
            </Alert>
            <Button
              variant="contained"
              onClick={handleRefresh}
              startIcon={<Refresh />}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                padding: "10px 24px",
              }}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // No permissions state
  if (!userPermissions || userPermissions.length === 0) {
    return (
      <Box
        sx={{
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <Card
          sx={{
            maxWidth: "500px",
            margin: "0 auto",
            background: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <CardContent sx={{ padding: "40px 24px" }}>
            <Security
              sx={{
                fontSize: "64px",
                color: "text.secondary",
                marginBottom: "16px",
                opacity: 0.6,
              }}
            />
            <Typography variant="h6" sx={{ marginBottom: "8px", fontWeight: 600 }}>
              No permissions assigned
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: "24px" }}>
              Your account doesn't have any permissions assigned yet.
            </Typography>
            <Button
              variant="outlined"
              onClick={handleRefresh}
              startIcon={<Refresh />}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                padding: "10px 24px",
              }}
            >
              Refresh Permissions
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const groupedPermissions = groupPermissionsByCategory(userPermissions);

  return (
    <Box sx={{ padding: { xs: "16px 0", md: "24px 0" } }}>
      {/* Header Section */}
      <Card
        sx={{
          marginBottom: "32px",
          background: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          borderRadius: "16px",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <Box sx={{ flex: 1, minWidth: "200px" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <Badge
                  sx={{
                    fontSize: "32px",
                    color: "primary.main",
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {userRole || "N/A"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "44px" }}>
                <CheckCircle sx={{ fontSize: "18px", color: "success.main" }} />
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {userPermissions.length} Permission{userPermissions.length !== 1 ? "s" : ""}
                </Typography>
              </Box>
              {permissionsError && (
                <Alert
                  severity="warning"
                  sx={{
                    marginTop: "12px",
                    borderRadius: "8px",
                    "& .MuiAlert-icon": {
                      fontSize: "20px",
                    },
                  }}
                >
                  {permissionsError}
                </Alert>
              )}
            </Box>
            <Tooltip title="Refresh permissions">
              <IconButton
                onClick={handleRefresh}
                disabled={permissionsLoading}
                sx={{
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  width: "48px",
                  height: "48px",
                  transition: "all 0.3s ease",
                  "&:disabled": {
                    backgroundColor: "action.disabledBackground",
                  },
                }}
              >
                {permissionsLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <Refresh />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      {/* Permissions Grid */}
      <Grid container spacing={3}>
        {groupedPermissions.map(([category, permissions], index) => {
          const categoryColor = getCategoryColor(category, theme);
          return (
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={category}>
              <Fade in timeout={300 + index * 100}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: "16px",
                    border: `1px solid ${alpha(categoryColor, 0.2)}`,
                    background: `linear-gradient(135deg, ${alpha(categoryColor, 0.05)} 0%, ${alpha(categoryColor, 0.02)} 100%)`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 8px 24px ${alpha(categoryColor, 0.15)}, 0 0 0 1px ${alpha(categoryColor, 0.3)}`,
                    },
                  }}
                >
                  <CardContent sx={{ padding: "24px" }}>
                    {/* Category Header */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "20px",
                        paddingBottom: "16px",
                        borderBottom: `2px solid ${alpha(categoryColor, 0.2)}`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          backgroundColor: alpha(categoryColor, 0.1),
                          color: categoryColor,
                        }}
                      >
                        {getCategoryIcon(category)}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "text.primary",
                            marginBottom: "4px",
                          }}
                        >
                          {category}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 500,
                          }}
                        >
                          {permissions.length} permission{permissions.length !== 1 ? "s" : ""}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Permissions Chips */}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      {permissions.map((permission) => (
                        <Chip
                          key={permission}
                          icon={getPermissionIcon(permission)}
                          label={formatPermissionName(permission)}
                          sx={{
                            backgroundColor: alpha(categoryColor, 0.1),
                            color: categoryColor,
                            border: `1px solid ${alpha(categoryColor, 0.3)}`,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            height: "32px",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: alpha(categoryColor, 0.2),
                              borderColor: alpha(categoryColor, 0.5),
                              transform: "scale(1.05)",
                            },
                            "& .MuiChip-icon": {
                              color: categoryColor,
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default PermissionsSection;


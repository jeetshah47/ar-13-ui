import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Link,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router";
import { useNotifications } from "../../../contexts/NotificationContext";
import { notificationService } from "../../../services/sse/NotificationService";
import type { Notification } from "../../../services/sse/types";
import { NotificationType } from "../../../services/sse/types";

interface NotificationModalProps {
  onClose: () => void;
}

const NotificationModal = ({ onClose }: NotificationModalProps) => {
  const navigate = useNavigate();
  const {
    notifications,
    isLoading,
    error,
    isConnected,
    markAsRead,
    markAllAsRead,
    refreshNotifications
  } = useNotifications();

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch {
      // Handle error silently or show user-friendly message
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch {
      // Handle error silently or show user-friendly message
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    // Navigate based on notification type and available IDs
    if (notification.taskId && notification.projectId) {
      navigate(`/app/projects/details/${notification.projectId}/${notification.taskId}`);
      onClose();
    } else if (notification.projectId) {
      navigate(`/app/projects/info/${notification.projectId}`);
      onClose();
    } else if (notification.relatedEntityType === "PROJECT" && notification.relatedEntityId) {
      navigate(`/app/projects/info/${notification.relatedEntityId}`);
      onClose();
    } else if (notification.relatedEntityType === "TASK" && notification.relatedEntityId) {
      // For task notifications without projectId, we might need to fetch it
      // For now, just navigate to projects list
      navigate(`/app/projects`);
      onClose();
    }
  };

  const getNotificationIcon = (type: string) => {
    return notificationService.getNotificationIcon(type as NotificationType);
  };

  const formatNotificationMessage = (notification: Notification) => {
    return notificationService.formatNotificationMessage(notification);
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        position: "fixed",
        zIndex: 50,
        backgroundColor: "#2155A316",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        display: "flex",
        top: 0,
        left: 0,
      }}
    >
      <Box
        sx={(theme) => ({
          width: "400px",
          maxHeight: "500px",
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[6],
          borderRadius: "12px",
          margin: "20px",
          overflow: "hidden",
        })}
      >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Typography
                variant="h6"
                sx={(theme) => ({
                  fontSize: "16px",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  margin: 0,
                })}
              >
                Notifications
              </Typography>
              {/* Connection Status Indicator */}
              <Tooltip title={isConnected ? "Connected to server" : "Disconnected from server"}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {isConnected ? (
                    <CheckCircleIcon
                      sx={{
                        fontSize: "16px",
                        color: "#10b981",
                      }}
                    />
                  ) : (
                    <ErrorIcon
                      sx={{
                        fontSize: "16px",
                        color: "#ef4444",
                      }}
                    />
                  )}
                </Box>
              </Tooltip>
            </Box>
            <IconButton
              onClick={onClose}
              size="small"
              sx={(theme) => ({
                padding: "4px",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              })}
            >
              <CloseIcon sx={(theme) => ({ fontSize: "20px", color: theme.palette.text.secondary })} />
            </IconButton>
          </Box>
  
        {/* Error State */}
        {error && (
          <Box sx={{ padding: "16px 20px" }}>
            <Alert severity="error" sx={{ marginBottom: "16px" }}>
              {error}
            </Alert>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={refreshNotifications}
            >
              Retry
            </Button>
          </Box>
        )}

        {/* Loading State */}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px 20px",
            }}
          >
            <CircularProgress size={24} />
            <Typography variant="body2" sx={(theme) => ({ marginLeft: "12px", color: theme.palette.text.secondary })}>
              Loading notifications...
            </Typography>
          </Box>
        )}

        {/* Notifications List */}
        {!isLoading && !error && (
          <Box
            sx={{
              maxHeight: "400px",
              overflowY: "auto",
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: (theme) => theme.palette.grey[50],
              },
              "&::-webkit-scrollbar-thumb": {
                background: (theme) => theme.palette.grey[300],
                borderRadius: "3px",
              },
            }}
          >
            {notifications.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 20px",
                  textAlign: "center",
                }}
              >
                <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.secondary, marginBottom: "8px" })}>
                  No notifications yet
                </Typography>
                <Typography variant="caption" sx={(theme) => ({ color: theme.palette.text.secondary })}>
                  You'll see notifications here when they arrive
                </Typography>
              </Box>
            ) : (
              notifications.map((notification, index) => (
                <Box key={notification.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      padding: "16px 20px",
                      gap: "12px",
                      backgroundColor: (theme) => notification.isRead 
                        ? "transparent" 
                        : theme.palette.grey[50],
                      "&:hover": {
                        backgroundColor: (theme) => theme.palette.grey[50],
                      },
                      cursor: "pointer",
                    }}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Avatar */}
                    <Avatar
                      sx={{
                        width: "32px",
                        height: "32px",
                        fontSize: "14px",
                        fontWeight: 500,
                        backgroundColor: "#3B82F6",
                      }}
                    >
                      {notification.title.charAt(0)}
                    </Avatar>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={(theme) => ({
                          fontSize: "14px",
                          lineHeight: "20px",
                          color: theme.palette.text.primary,
                          marginBottom: "4px",
                          fontWeight: notification.isRead ? 400 : 500,
                        })}
                      >
                        {notification.title}
                      </Typography>
                      
                      <Typography
                        variant="body2"
                        sx={(theme) => ({
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: theme.palette.text.secondary,
                          marginBottom: "8px",
                        })}
                      >
                        {formatNotificationMessage(notification)}
                      </Typography>
                      
                      {/* Project Title Badge */}
                      {notification.projectTitle && (
                        <Box sx={{ marginBottom: "8px" }}>
                          <Chip
                            label={notification.projectTitle}
                            size="small"
                            sx={(theme) => ({
                              fontSize: "11px",
                              height: "20px",
                              backgroundColor: theme.palette.primary.light,
                              color: theme.palette.primary.contrastText,
                              "&:hover": {
                                backgroundColor: theme.palette.primary.main,
                              },
                            })}
                          />
                        </Box>
                      )}
                      
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={(theme) => ({
                            fontSize: "12px",
                            color: theme.palette.text.secondary,
                          })}
                        >
                          {(() => {
                            try {
                              const date = new Date(notification.createdAt);
                              if (isNaN(date.getTime())) {
                                return "Just now";
                              }
                              return formatDistanceToNow(date, { addSuffix: true });
                            } catch {
                              return "Just now";
                            }
                          })()}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={(theme) => ({
                            fontSize: "12px",
                            color: theme.palette.text.secondary,
                          })}
                        >
                          •
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={(theme) => ({
                            fontSize: "12px",
                            color: theme.palette.text.secondary,
                          })}
                        >
                          {getNotificationIcon(notification.type)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Unread indicator */}
                    {!notification.isRead && (
                      <Box
                        sx={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "#3B82F6",
                          marginTop: "4px",
                        }}
                      />
                    )}
                  </Box>
                  
                  {index < notifications.length - 1 && (
                    <Divider sx={{ borderColor: (theme) => theme.palette.divider }} />
                  )}
                </Box>
              ))
            )}
          </Box>
        )}
  
          {/* Footer */}
          <Box
            sx={{
              padding: "16px 20px",
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
              backgroundColor: (theme) => theme.palette.grey[50],
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link
              href="#"
              sx={(theme) => ({
                fontSize: "14px",
                fontWeight: 500,
                color: theme.palette.primary.main,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              })}
            >
              View all notifications
            </Link>
            
            {notifications.some(n => !n.isRead) && (
              <Button
                variant="text"
                size="small"
                onClick={handleMarkAllAsRead}
                sx={(theme) => ({
                  fontSize: "12px",
                  color: theme.palette.text.secondary,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: theme.palette.primary.main,
                  },
                })}
              >
                Mark all as read
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    );
  };
  
  export default NotificationModal;
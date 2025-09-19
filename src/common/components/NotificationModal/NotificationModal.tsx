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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "../../../contexts/NotificationContext";
import { notificationService } from "../../../services/websocket/NotificationService";
import type { Notification } from "../../../services/websocket/types";
import { NotificationType } from "../../../services/websocket/types";

interface NotificationModalProps {
  onClose: () => void;
}

const NotificationModal = ({ onClose }: NotificationModalProps) => {
  const {
    notifications,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications
  } = useNotifications();
  console.log("notifications", notifications);
  console.log("isLoading", isLoading);
  console.log("error", error);

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
        sx={{
          width: "400px",
          maxHeight: "500px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
          borderRadius: "12px",
          margin: "20px",
          overflow: "hidden",
        }}
      >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              borderBottom: "1px solid #F1F5F9",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#1E293B",
                margin: 0,
              }}
            >
              Notifications
            </Typography>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                padding: "4px",
                "&:hover": {
                  backgroundColor: "#F8FAFC",
                },
              }}
            >
              <CloseIcon sx={{ fontSize: "20px", color: "#64748B" }} />
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
            <Typography variant="body2" sx={{ marginLeft: "12px", color: "#64748B" }}>
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
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#F1F5F9",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#CBD5E1",
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
                <Typography variant="body2" sx={{ color: "#64748B", marginBottom: "8px" }}>
                  No notifications yet
                </Typography>
                <Typography variant="caption" sx={{ color: "#94A3B8" }}>
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
                      backgroundColor: notification.isRead ? "transparent" : "#F8FAFC",
                      "&:hover": {
                        backgroundColor: "#F8FAFC",
                      },
                      cursor: "pointer",
                    }}
                    onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
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
                        sx={{
                          fontSize: "14px",
                          lineHeight: "20px",
                          color: "#1E293B",
                          marginBottom: "4px",
                          fontWeight: notification.isRead ? 400 : 500,
                        }}
                      >
                        {notification.title}
                      </Typography>
                      
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: "#64748B",
                          marginBottom: "8px",
                        }}
                      >
                        {formatNotificationMessage(notification)}
                      </Typography>
                      
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "12px",
                            color: "#64748B",
                          }}
                        >
                          {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "12px",
                            color: "#64748B",
                          }}
                        >
                          •
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "12px",
                            color: "#64748B",
                          }}
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
                    <Divider sx={{ borderColor: "#F1F5F9" }} />
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
              borderTop: "1px solid #F1F5F9",
              backgroundColor: "#F8FAFC",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link
              href="#"
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#3B82F6",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              View all notifications
            </Link>
            
            {notifications.some(n => !n.isRead) && (
              <Button
                variant="text"
                size="small"
                onClick={handleMarkAllAsRead}
                sx={{
                  fontSize: "12px",
                  color: "#64748B",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "#3B82F6",
                  },
                }}
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
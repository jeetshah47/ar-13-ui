import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { WebSocketClient } from "../services/websocket";
import { notificationService } from "../services/sse/NotificationService";
import type {
  Notification,
  NotificationCount,
  NotificationContextType,
} from "../services/websocket/types";
import { SERVER_BASE_URL } from "../config/api";

// Get user ID and token from localStorage
const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("uid");
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      return {
        userId: userStr,
        authToken: authToken,
      };
    }
  } catch {
    // Handle error silently
  }

  // Fallback values
  return {
    userId: localStorage.getItem("uid") || "",
    authToken: localStorage.getItem("authToken"),
  };
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: React.ReactNode;
  userId?: string;
  authToken?: string;
  sseUrl?: string;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  userId,
  authToken,
  sseUrl = SERVER_BASE_URL,
}) => {
  // Get user data from localStorage if not provided
  const userData = getUserFromStorage();
  const actualUserId = userId || userData.userId;
  const actualAuthToken = authToken || userData.authToken;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState<NotificationCount>(
    { total: 0, unread: 0 }
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [websocketClient, setWebSocketClient] = useState<WebSocketClient | null>(null);
  const refreshNotificationsRef = useRef<() => Promise<void>>();
  const authenticatedUserIdRef = useRef<string | null>(null);
  const notificationIdsRef = useRef<Set<string>>(new Set());

  // WebSocket methods for listening to events
  const onEvent = useCallback((event: string, listener: (...args: unknown[]) => void) => {
    if (websocketClient) {
      websocketClient.onEvent(event, listener);
    }
  }, [websocketClient]);

  const offEvent = useCallback((event: string, listener?: (...args: unknown[]) => void) => {
    if (websocketClient) {
      websocketClient.offEvent(event, listener);
    }
  }, [websocketClient]);

  const sendMessage = useCallback((message: { type: string; data: unknown }) => {
    if (websocketClient) {
      websocketClient.send(message);
    }
  }, [websocketClient]);

  // Initialize WebSocket client
  useEffect(() => {
    // Don't create client if we don't have auth token or userId
    if (!actualAuthToken || !actualUserId) {
      return;
    }
    
    const client = new WebSocketClient({
      serverUrl: sseUrl,
      authToken: actualAuthToken,
      autoConnect: true,
    });

    setWebSocketClient(client);
    
    // Actually connect the WebSocket
    client.connect();

    // Setup event listeners
    const handleConnect = () => {
      setIsConnected(true);
      setError(null);
    };

    const handleAuthenticated = (data: { userId: string }) => {
      authenticatedUserIdRef.current = data.userId;
      // After authentication, refresh notifications to sync with server
      if (refreshNotificationsRef.current) {
        refreshNotificationsRef.current();
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    // Handle notifications-available event - fetch notifications via REST API
    const handleNotificationsAvailable = (data: { userId: string }) => {
      // Validate userId matches current user
      if (authenticatedUserIdRef.current && data.userId !== authenticatedUserIdRef.current) {
        return;
      }

      // Fetch notifications via REST API when notifications-available event is received
      if (refreshNotificationsRef.current) {
        refreshNotificationsRef.current();
      }
    };

    const handleConnectError = (error: Error) => {
      setError(`WebSocket connection failed: ${error.message}`);
      setIsConnected(false);
      // Handle authentication errors specifically
      if (error.message === 'unauthorized') {
        setError('Authentication failed. Please check your token.');
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleReconnect = (_attemptNumber: number) => {
      setIsConnected(true);
      setError(null);
      // Refresh notifications after reconnection
      if (refreshNotificationsRef.current) {
        refreshNotificationsRef.current();
      }
    };

    // Register event listeners
    client.on("connect", handleConnect);
    client.on("disconnect", handleDisconnect);
    client.on("authenticated", handleAuthenticated);
    client.on("notifications-available", handleNotificationsAvailable);
    client.on("connect_error", handleConnectError);
    client.on("reconnect", handleReconnect);

    return () => {
      // Clean up event listeners
      client.off("connect");
      client.off("disconnect");
      client.off("authenticated");
      client.off("notifications-available");
      client.off("connect_error");
      client.off("reconnect");
      // Disconnect the client only if it exists and is connected/connecting
      try {
        client.disconnect();
      } catch {
        // Ignore errors during cleanup (e.g., if connection was never established)
      }
      setWebSocketClient(null);
      authenticatedUserIdRef.current = null;
    };
  }, [sseUrl, actualAuthToken, actualUserId]);

  // Set auth token in notification service
  useEffect(() => {
    if (actualAuthToken) {
      notificationService.setAuthToken(actualAuthToken);
    }
  }, [actualAuthToken]);

  const refreshNotifications = useCallback(async () => {
    if (!actualUserId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [allNotifications, count] = await Promise.all([
        notificationService.getAllNotifications(actualUserId).catch(() => {
          return []; // Return empty array on error
        }),
        notificationService.getNotificationCount(actualUserId).catch(() => {
          return { total: 0, unread: 0 }; // Return default count on error
        }),
      ]);

      // Update deduplication set with all notification IDs
      notificationIdsRef.current = new Set(allNotifications.map(n => n.id));

      // Ensure dates are Date objects
      const parsedNotifications = allNotifications.map(notification => ({
        ...notification,
        createdAt: notification.createdAt instanceof Date 
          ? notification.createdAt 
          : new Date(notification.createdAt || Date.now()),
        created: notification.created instanceof Date
          ? notification.created
          : new Date(notification.created || notification.createdAt || Date.now()),
      }));

      setNotifications(parsedNotifications);
      setNotificationCount(count);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load notifications";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [actualUserId]);

  // Update the ref whenever refreshNotifications changes
  useEffect(() => {
    refreshNotificationsRef.current = refreshNotifications;
  }, [refreshNotifications]);

  // Load initial notifications
  useEffect(() => {
    if (actualUserId) {
      refreshNotifications();
    }
  }, [actualUserId, refreshNotifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notification) => {
          if (notification.id === notificationId && !notification.isRead) {
            return { ...notification, isRead: true };
          }
          return notification;
        })
      );

      // Only decrement if notification was actually unread
      setNotificationCount((prev) => {
        const notification = notifications.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
          return {
            total: prev.total,
            unread: Math.max(0, prev.unread - 1),
          };
        }
        return prev;
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to mark notification as read"
      );
    }
  }, [notifications]);

  const markAllAsRead = useCallback(async () => {
    if (!actualUserId) return;

    try {
      await notificationService.markAllAsRead(actualUserId);

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );

      setNotificationCount((prev) => ({
        total: prev.total,
        unread: 0,
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to mark all notifications as read"
      );
    }
  }, [actualUserId]);

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        await notificationService.deleteNotification(notificationId);

        const deletedNotification = notifications.find(
          (n) => n.id === notificationId
        );

        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== notificationId)
        );

        if (deletedNotification && !deletedNotification.isRead) {
          setNotificationCount((prev) => ({
            total: Math.max(0, prev.total - 1),
            unread: Math.max(0, prev.unread - 1),
          }));
        } else if (deletedNotification) {
          setNotificationCount((prev) => ({
            total: Math.max(0, prev.total - 1),
            unread: prev.unread,
          }));
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete notification"
        );
      }
    },
    [notifications]
  );

  const contextValue: NotificationContextType = {
    notifications,
    notificationCount,
    isConnected,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  refreshNotifications,
  onEvent,
  offEvent,
  sendMessage,
};

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

// Hook for getting notification count only
export const useNotificationCount = () => {
  const { notificationCount } = useNotifications();
  return notificationCount;
};

// Hook for getting connection status
export const useNotificationConnection = () => {
  const { isConnected, error } = useNotifications();
  return { isConnected, error };
};

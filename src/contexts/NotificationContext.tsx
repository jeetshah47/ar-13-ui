import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { WebSocketClient } from "../services/websocket/WebSocketClient";
import { notificationService } from "../services/websocket/NotificationService";
import type {
  Notification,
  NotificationCount,
  NotificationContextType,
} from "../services/websocket/types";

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
  firebaseToken?: string;
  websocketUrl?: string;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  userId,
  firebaseToken,
  websocketUrl = "http://localhost:3000",
}) => {
  // Get user data from localStorage if not provided
  const userData = getUserFromStorage();
  const actualUserId = userId || userData.userId;
  const actualAuthToken = firebaseToken || userData.authToken;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState<NotificationCount>(
    { total: 0, unread: 0 }
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);
  const refreshNotificationsRef = useRef<() => Promise<void>>();

  // Initialize WebSocket client
  useEffect(() => {
    // Don't create client if we don't have auth token or userId
    if (!actualAuthToken || !actualUserId) {
      return;
    }

    const client = new WebSocketClient({
      serverUrl: websocketUrl,
      authToken: actualAuthToken,
      autoConnect: true,
    });

    setWsClient(client);
    
    // Actually connect the websocket
    client.connect();

    // Setup event listeners
    const handleConnect = () => {
      setIsConnected(true);
      setError(null);
      
      // Join user room for personal notifications
      if (actualUserId) {
        client.joinUserRoom(actualUserId);
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setNotificationCount((prev) => ({
        total: prev.total + 1,
        unread: prev.unread + 1,
      }));
    };

    const handleNotificationCount = (count: NotificationCount) => {
      setNotificationCount(count);
    };

    const handleAuthenticated = (data: { success: boolean }) => {
      if (data.success) {
        setIsConnected(true);
        setError(null);
      } else {
        setError("Authentication failed");
        setIsConnected(false);
      }
    };

    const handleConnectError = (error: Error) => {
      setError(`WebSocket connection failed: ${error.message}`);
      setIsConnected(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleReconnect = (_attemptNumber: number) => {
      // attemptNumber is provided by socket.io but we don't need it
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
    client.on("notification", handleNotification);
    client.on("notification_count", handleNotificationCount);
    client.on("authenticated", handleAuthenticated);
    client.on("connect_error", handleConnectError);
    client.on("reconnect", handleReconnect);

    return () => {
      // Clean up event listeners
      client.off("connect");
      client.off("disconnect");
      client.off("notification");
      client.off("notification_count");
      client.off("authenticated");
      client.off("connect_error");
      client.off("reconnect");
      // Disconnect the client
      client.disconnect();
      setWsClient(null);
    };
  }, [websocketUrl, actualAuthToken, actualUserId]);

  // Set auth token in notification service
  useEffect(() => {
    if (actualAuthToken) {
      notificationService.setAuthToken(actualAuthToken);
    }
  }, [actualAuthToken]);

  // Real-time updates are handled by WebSocket client
  // No need for mock service setup

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

      setNotifications(allNotifications);
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

  // Fallback to mock notifications if websocket fails to connect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isConnected && !isLoading && notifications.length === 0) {
        // You can uncomment this to use mock data when websocket fails
        // const mockNotifications = [
        //   {
        //     id: "mock-1",
        //     title: "Test Notification",
        //     message: "This is a mock notification for testing",
        //     type: "TASK_ASSIGNED" as any,
        //     userId: actualUserId,
        //     relatedEntityId: "task-1",
        //     relatedEntityType: "TASK" as any,
        //     isRead: false,
        //     createdAt: new Date(),
        //     created: new Date(),
        //   }
        // ];
        // setNotifications(mockNotifications);
        // setNotificationCount({ total: 1, unread: 1 });
      }
    }, 5000); // Wait 5 seconds before showing fallback

    return () => clearTimeout(timer);
  }, [isConnected, isLoading, notifications.length, actualUserId]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      setNotificationCount((prev) => ({
        total: prev.total,
        unread: Math.max(0, prev.unread - 1),
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to mark notification as read"
      );
    }
  }, []);

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

  const joinProject = useCallback(
    (projectId: string) => {
      if (wsClient) {
        wsClient.joinProject(projectId); // This will use the legacy method
      }
    },
    [wsClient]
  );

  const leaveProject = useCallback(
    (projectId: string) => {
      if (wsClient) {
        wsClient.leaveProject(projectId); // This will use the legacy method
      }
    },
    [wsClient]
  );

  const joinUserRoom = useCallback(
    (userId: string) => {
      if (wsClient) {
        wsClient.joinUserRoom(userId);
      }
    },
    [wsClient]
  );

  const leaveUserRoom = useCallback(
    (userId: string) => {
      if (wsClient) {
        wsClient.leaveUserRoom(userId);
      }
    },
    [wsClient]
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
    joinProject,
    leaveProject,
    joinUserRoom,
    leaveUserRoom,
    refreshNotifications,
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

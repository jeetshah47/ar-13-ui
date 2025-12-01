import { useState, useEffect, useCallback } from "react";
import { useNotifications } from "../contexts/NotificationContext";

/**
 * Hook to track user online/offline status via WebSocket
 * Returns a function to check if a user is online
 */
export const useUserPresence = () => {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const { onEvent, offEvent } = useNotifications();

  useEffect(() => {
    // Handle user presence updates
    const handleUserPresence = (data: { userId?: string; status?: string }) => {
      if (!data.userId || !data.status) return;

      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        if (data.status === "online") {
          newSet.add(data.userId!);
        } else {
          newSet.delete(data.userId!);
        }
        return newSet;
      });
    };

    // Handle initial online users list
    const handleOnlineUsersList = (data: { users?: string[] }) => {
      if (data.users && Array.isArray(data.users)) {
        setOnlineUsers(new Set(data.users));
      }
    };

    onEvent("user:presence", handleUserPresence);
    onEvent("users:online:list", handleOnlineUsersList);

    return () => {
      offEvent("user:presence", handleUserPresence);
      offEvent("users:online:list", handleOnlineUsersList);
    };
  }, [onEvent, offEvent]);

  const isUserOnline = useCallback(
    (userId: string | undefined | null): boolean => {
      if (!userId) return false;
      return onlineUsers.has(userId);
    },
    [onlineUsers]
  );

  return { isUserOnline, onlineUsers };
};


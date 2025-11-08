// WebSocket Notification Service Types

export const NotificationType = {
  PROJECT_CREATED: "PROJECT_CREATED",
  TASK_CREATED: "TASK_CREATED",
  TASK_ASSIGNED: "TASK_ASSIGNED",
  PROJECT_UPDATED: "PROJECT_UPDATED",
  TASK_UPDATED: "TASK_UPDATED",
  LEAVE_REQUEST_CREATED: "LEAVE_REQUEST_CREATED",
  LEAVE_REQUEST_APPROVED: "LEAVE_REQUEST_APPROVED",
  LEAVE_REQUEST_REJECTED: "LEAVE_REQUEST_REJECTED",
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export const RelatedEntityType = {
  PROJECT: "PROJECT",
  TASK: "TASK",
  LEAVE_REQUEST: "LEAVE_REQUEST",
} as const;

export type RelatedEntityType = typeof RelatedEntityType[keyof typeof RelatedEntityType];

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  userId: string;
  relatedEntityId: string;
  relatedEntityType: RelatedEntityType;
  isRead: boolean;
  createdAt: Date;
  created: Date;
  updated?: Date;
}

// Alias for backward compatibility
export type INotification = Notification;

export interface NotificationCount {
  total: number;
  unread: number;
}

export interface WebSocketConfig {
  serverUrl: string;
  authToken: string;
  autoConnect?: boolean;
}

export interface NotificationClientEvents {
  connect: () => void;
  disconnect: () => void;
  notification: (notification: Notification) => void;
  project_notification: (notification: Notification) => void;
  global_notification: (notification: Notification) => void;
  notification_count: (count: NotificationCount) => void;
  authenticated: (data: { success: boolean }) => void;
  connect_error: (error: Error) => void;
  reconnect: (attemptNumber: number) => void;
  reconnect_error: (error: Error) => void;
}

export interface NotificationContextType {
  notifications: Notification[];
  notificationCount: NotificationCount;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  joinProject: (projectId: string) => void;
  leaveProject: (projectId: string) => void;
  joinUserRoom: (userId: string) => void;
  leaveUserRoom: (userId: string) => void;
  refreshNotifications: () => Promise<void>;
}
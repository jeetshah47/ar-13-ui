// SSE Notification Service Types

export const NotificationType = {
  PROJECT_CREATED: "PROJECT_CREATED",
  TASK_CREATED: "TASK_CREATED",
  TASK_ASSIGNED: "TASK_ASSIGNED",
  PROJECT_UPDATED: "PROJECT_UPDATED",
  TASK_UPDATED: "TASK_UPDATED",
  LEAVE_REQUEST_CREATED: "LEAVE_REQUEST_CREATED",
  LEAVE_REQUEST_APPROVED: "LEAVE_REQUEST_APPROVED",
  LEAVE_REQUEST_REJECTED: "LEAVE_REQUEST_REJECTED",
  USER_LOGIN: "USER_LOGIN",
  USER_LOGOUT: "USER_LOGOUT",
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
  // Additional metadata that may come from SSE events
  taskId?: string;
  projectId?: string;
  projectTitle?: string;
  // Event-specific additional data
  updaterName?: string;
  oldStatus?: string;
  newStatus?: string;
  memberName?: string;
  hours?: number;
  date?: string;
  timeDescription?: string;
}

// Alias for backward compatibility
export type INotification = Notification;

export interface NotificationCount {
  total: number;
  unread: number;
}

export interface SSEConfig {
  serverUrl: string;
  authToken: string;
  autoConnect?: boolean;
}

// SSE event payload structure as per documentation
// notifications-available event data structure
export interface NotificationsAvailableEvent {
  userId: string;
}

export interface NotificationClientEvents {
  connect: () => void;
  disconnect: (reason?: string) => void;
  authenticated: (data: { userId: string }) => void;
  'notifications-available': (data: NotificationsAvailableEvent) => void;
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
  refreshNotifications: () => Promise<void>;
  // SSE methods for listening to events (SSE is unidirectional, no emit method)
  onEvent: (event: string, listener: (...args: any[]) => void) => void;
  offEvent: (event: string, listener?: (...args: any[]) => void) => void;
}


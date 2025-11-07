import type { 
  Notification, 
  NotificationCount 
} from './types';
import { 
  NotificationType, 
  RelatedEntityType 
} from './types';

// Real API service - connects to actual backend
class NotificationAPIService {
  private baseUrl = 'http://localhost:3000/api/notifications';
  private authToken: string | null = null;

  setAuthToken(token: string) {
    this.authToken = token;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    return headers;
  }

  private parseDate(dateValue: any): Date {
    if (!dateValue) {
      return new Date(); // Return current date as fallback
    }
    
    // Handle string dates, timestamps, and Date objects
    let date: Date;
    if (typeof dateValue === 'string') {
      // Try parsing ISO string or timestamp
      date = new Date(dateValue);
    } else if (typeof dateValue === 'number') {
      // Handle timestamp (seconds or milliseconds)
      date = new Date(dateValue > 1000000000000 ? dateValue : dateValue * 1000);
    } else if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      // Try to convert to string first
      date = new Date(String(dateValue));
    }
    
    if (isNaN(date.getTime())) {
      return new Date(); // Return current date as fallback
    }
    
    return date;
  }

  async getAllNotifications(userId: string): Promise<Notification[]> {
    try {
      const response = await fetch(`${this.baseUrl}/all/${userId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        throw new Error(`Failed to fetch notifications: ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      
      // Handle case where API returns notifications directly or wrapped in data
      const notifications = data.notifications || data || [];
      
      return notifications.map((notification: any) => ({
        ...notification,
        createdAt: this.parseDate(notification.createdAt || notification.created),
        created: this.parseDate(notification.created || notification.createdAt)
      }));
    } catch (error) {
      throw error;
    }
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    try {
      const response = await fetch(`${this.baseUrl}/unread/${userId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        throw new Error(`Failed to fetch unread notifications: ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      
      // Handle case where API returns notifications directly or wrapped in data
      const notifications = data.notifications || data || [];
      
      return notifications.map((notification: any) => ({
        ...notification,
        createdAt: this.parseDate(notification.createdAt || notification.created),
        created: this.parseDate(notification.created || notification.createdAt)
      }));
    } catch (error) {
      throw error;
    }
  }

  async getNotificationCount(userId: string): Promise<NotificationCount> {
    try {
      const response = await fetch(`${this.baseUrl}/count/${userId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        throw new Error(`Failed to fetch notification count: ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      
      // Handle different response formats
      if (data.count) {
        return data.count;
      }
      if (data.total !== undefined || data.unread !== undefined) {
        return {
          total: data.total || 0,
          unread: data.unread || 0
        };
      }
      
      // Default fallback
      return { total: 0, unread: 0 };
    } catch {
      // Return default count on error instead of throwing
      return { total: 0, unread: 0 };
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/read/${notificationId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to mark notification as read: ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/read-all/${userId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to mark all notifications as read: ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${notificationId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete notification: ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteAllNotifications(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/user/${userId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete all notifications: ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }
}

export class NotificationService {
  private apiService: NotificationAPIService;

  constructor() {
    this.apiService = new NotificationAPIService();
  }

  setAuthToken(token: string) {
    this.apiService.setAuthToken(token);
  }

  async getAllNotifications(userId: string): Promise<INotification[]> {
    return this.apiService.getAllNotifications(userId);
  }

  async getUnreadNotifications(userId: string): Promise<INotification[]> {
    return this.apiService.getUnreadNotifications(userId);
  }

  async getNotificationCount(userId: string): Promise<NotificationCount> {
    return this.apiService.getNotificationCount(userId);
  }

  async markAsRead(notificationId: string): Promise<void> {
    return this.apiService.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    return this.apiService.markAllAsRead(userId);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    return this.apiService.deleteNotification(notificationId);
  }

  async deleteAllNotifications(userId: string): Promise<void> {
    return this.apiService.deleteAllNotifications(userId);
  }

  // Utility methods for creating notifications (for testing/demo purposes)
  createMockNotification(
    id: string,
    title: string,
    message: string,
    type: NotificationType,
    userId: string,
    relatedEntityId: string,
    relatedEntityType: RelatedEntityType,
    isRead: boolean = false
  ): Notification {
    return {
      id,
      title,
      message,
      type,
      userId,
      relatedEntityId,
      relatedEntityType,
      isRead,
      createdAt: new Date()
    };
  }

  // Get notification icon based on type
  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.PROJECT_CREATED:
        return "📁";
      case NotificationType.TASK_CREATED:
        return "✅";
      case NotificationType.TASK_ASSIGNED:
        return "👤";
      case NotificationType.PROJECT_UPDATED:
        return "📝";
      case NotificationType.TASK_UPDATED:
        return "✏️";
      case NotificationType.LEAVE_REQUEST_CREATED:
        return "📅";
      case NotificationType.LEAVE_REQUEST_APPROVED:
        return "✅";
      case NotificationType.LEAVE_REQUEST_REJECTED:
        return "❌";
      default:
        return "🔔";
    }
  }

  // Format notification message for display
  formatNotificationMessage(notification: Notification): string {
    const { title, message, type } = notification;
    
    switch (type) {
      case NotificationType.TASK_ASSIGNED:
        return `You have been assigned to task: ${message}`;
      case NotificationType.PROJECT_CREATED:
        return `New project created: ${message}`;
      case NotificationType.TASK_CREATED:
        return `New task created: ${message}`;
      case NotificationType.LEAVE_REQUEST_APPROVED:
        return `Your leave request has been approved: ${message}`;
      case NotificationType.LEAVE_REQUEST_REJECTED:
        return `Your leave request has been rejected: ${message}`;
      default:
        return message;
    }
  }
}

export const notificationService = new NotificationService();

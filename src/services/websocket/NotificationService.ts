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
    
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date received from API:', dateValue);
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
        throw new Error(`Failed to fetch notifications: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.notifications.map((notification: any) => ({
        ...notification,
        createdAt: this.parseDate(notification.createdAt),
        created: this.parseDate(notification.created)
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
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
        throw new Error(`Failed to fetch unread notifications: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.notifications.map((notification: any) => ({
        ...notification,
        createdAt: this.parseDate(notification.createdAt),
        created: this.parseDate(notification.created)
      }));
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
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
        throw new Error(`Failed to fetch notification count: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error('Error fetching notification count:', error);
      throw error;
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
      console.error('Error marking notification as read:', error);
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
      console.error('Error marking all notifications as read:', error);
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
      console.error('Error deleting notification:', error);
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
      console.error('Error deleting all notifications:', error);
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

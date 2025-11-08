import type { 
  Notification, 
  NotificationCount 
} from './types';
import { 
  NotificationType, 
  RelatedEntityType 
} from './types';

export class MockNotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private countListeners: ((count: NotificationCount) => void)[] = [];

  constructor() {
    // Initialize with some mock notifications
    this.generateMockNotifications();
  }

  private generateMockNotifications(): void {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "New Task Assigned",
        message: "You have been assigned to task 'Implement user authentication'",
        type: NotificationType.TASK_ASSIGNED,
        userId: "user-123",
        relatedEntityId: "task-789",
        relatedEntityType: RelatedEntityType.TASK,
        isRead: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        created: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      },
      {
        id: "2",
        title: "Project Created",
        message: "New project 'Mobile App Redesign' has been created",
        type: NotificationType.PROJECT_CREATED,
        userId: "user-123",
        relatedEntityId: "project-456",
        relatedEntityType: RelatedEntityType.PROJECT,
        isRead: false,
        createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        created: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      },
      {
        id: "3",
        title: "Task Updated",
        message: "Task 'Update dashboard' has been updated",
        type: NotificationType.TASK_UPDATED,
        userId: "user-123",
        relatedEntityId: "task-101",
        relatedEntityType: RelatedEntityType.TASK,
        isRead: true,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        created: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
      {
        id: "4",
        title: "Leave Request Approved",
        message: "Your leave request for Dec 15-20 has been approved",
        type: NotificationType.LEAVE_REQUEST_APPROVED,
        userId: "user-123",
        relatedEntityId: "leave-202",
        relatedEntityType: RelatedEntityType.LEAVE_REQUEST,
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        created: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: "5",
        title: "New Task Created",
        message: "New task 'Review design mockups' has been created",
        type: NotificationType.TASK_CREATED,
        userId: "user-123",
        relatedEntityId: "task-303",
        relatedEntityType: RelatedEntityType.TASK,
        isRead: false,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        created: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
    ];

    this.notifications = mockNotifications;
    this.notifyListeners();
    this.notifyCountListeners();
  }

  getAllNotifications(): Notification[] {
    return [...this.notifications];
  }

  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.isRead);
  }

  getNotificationCount(): NotificationCount {
    const total = this.notifications.length;
    const unread = this.notifications.filter(n => !n.isRead).length;
    return { total, unread };
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      notification.isRead = true;
      this.notifyListeners();
      this.notifyCountListeners();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
    this.notifyListeners();
    this.notifyCountListeners();
  }

  deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notifyListeners();
    this.notifyCountListeners();
  }

  // Simulate real-time notifications
  simulateNewNotification(): void {
    const newNotification: Notification = {
      id: `mock-${Date.now()}`,
      title: "New Notification",
      message: `This is a simulated notification created at ${new Date().toLocaleTimeString()}`,
      type: NotificationType.TASK_ASSIGNED,
      userId: "user-123",
      relatedEntityId: `task-${Date.now()}`,
      relatedEntityType: RelatedEntityType.TASK,
      isRead: false,
      createdAt: new Date(),
      created: new Date(),
    };

    this.notifications.unshift(newNotification);
    this.notifyListeners();
    this.notifyCountListeners();
  }

  // Add listeners for real-time updates
  addNotificationListener(listener: (notifications: Notification[]) => void): void {
    this.listeners.push(listener);
  }

  addCountListener(listener: (count: NotificationCount) => void): void {
    this.countListeners.push(listener);
  }

  removeNotificationListener(listener: (notifications: Notification[]) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  removeCountListener(listener: (count: NotificationCount) => void): void {
    this.countListeners = this.countListeners.filter(l => l !== listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  private notifyCountListeners(): void {
    const count = this.getNotificationCount();
    this.countListeners.forEach(listener => listener(count));
  }

  // Start simulation for demo purposes
  startSimulation(): void {
    // Simulate new notifications every 30 seconds
    setInterval(() => {
      this.simulateNewNotification();
    }, 30000);
  }

  // Stop simulation
  stopSimulation(): void {
    // Clear any intervals if needed
  }
}

export const mockNotificationService = new MockNotificationService();

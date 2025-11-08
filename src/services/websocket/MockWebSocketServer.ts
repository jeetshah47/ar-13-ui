// Mock WebSocket Server for testing notifications
// This simulates a Socket.IO server for development/testing
// Note: This file is for Node.js server-side use only, not for browser

import type { Notification, NotificationCount } from './types';
import { NotificationType, RelatedEntityType } from './types';

// These types are only available in Node.js environment
type SocketIOServer = any;
type Socket = any;
type HttpServer = any;

export class MockWebSocketServer {
  private io: SocketIOServer;
  private server: HttpServer;
  private port: number;
  private connectedClients: Map<string, any> = new Map();

  constructor(port: number = 3000) {
    this.port = port;
    // Note: createServer and SocketIOServer are Node.js only
    // This code should only run in Node.js environment
    this.server = {} as HttpServer;
    this.io = {} as SocketIOServer;
    // Uncomment when running in Node.js:
    // this.server = createServer();
    // this.io = new SocketIOServer(this.server, {
    //   cors: {
    //     origin: "*",
    //     methods: ["GET", "POST"]
    //   }
    // });
    
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      this.connectedClients.set(socket.id, socket);

      // Handle authentication
      socket.on('authenticate', (_data: unknown) => {
        // For testing, accept any token
        socket.emit('authenticated', { success: true });
      });

      // Handle project joining
      socket.on('join_project', (projectId: string) => {
        socket.join(`project_${projectId}`);
      });

      // Handle project leaving
      socket.on('leave_project', (projectId: string) => {
        socket.leave(`project_${projectId}`);
      });

      // Send initial notification count
      const initialCount: NotificationCount = {
        total: 0,
        unread: 0
      };
      socket.emit('notification_count', initialCount);

      // Send a welcome notification
      const welcomeNotification: Notification = {
        id: `welcome_${Date.now()}`,
        title: "Welcome to Notifications",
        message: "WebSocket connection established successfully!",
        type: NotificationType.TASK_ASSIGNED,
        userId: "test-user",
        relatedEntityId: "welcome",
        relatedEntityType: RelatedEntityType.TASK,
        isRead: false,
        createdAt: new Date(),
        created: new Date()
      };

      setTimeout(() => {
        socket.emit('notification', welcomeNotification);
      }, 1000);

      // Send periodic test notifications
      const testInterval = setInterval(() => {
        const testNotification: Notification = {
          id: `test_${Date.now()}`,
          title: "Test Notification",
          message: `This is a test notification sent at ${new Date().toLocaleTimeString()}`,
          type: NotificationType.TASK_CREATED,
          userId: "test-user",
          relatedEntityId: `task_${Date.now()}`,
          relatedEntityType: RelatedEntityType.TASK,
          isRead: false,
          createdAt: new Date(),
          created: new Date()
        };

        socket.emit('notification', testNotification);
      }, 30000); // Every 30 seconds

      socket.on('disconnect', () => {
        this.connectedClients.delete(socket.id);
        clearInterval(testInterval);
      });
    });
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.listen(this.port, (err?: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  stop(): void {
    this.server.close();
  }

  // Method to send notifications to all connected clients
  broadcastNotification(notification: Notification): void {
    this.io.emit('notification', notification);
  }

  // Method to send notifications to specific project
  sendToProject(projectId: string, notification: Notification): void {
    this.io.to(`project_${projectId}`).emit('project_notification', notification);
  }

  // Method to send global notifications
  sendGlobalNotification(notification: Notification): void {
    this.io.emit('global_notification', notification);
  }

  // Get connected clients count
  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }
}

// Export a singleton instance
export const mockWebSocketServer = new MockWebSocketServer();

// Start the server if this file is run directly
if (require.main === module) {
  mockWebSocketServer.start().catch(() => {
    // Error starting mock server
  });
}

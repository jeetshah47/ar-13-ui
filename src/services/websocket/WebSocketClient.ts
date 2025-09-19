import { io, Socket } from 'socket.io-client';
import type { 
  Notification, 
  NotificationCount, 
  WebSocketConfig, 
  NotificationClientEvents 
} from './types';

export class WebSocketClient {
  private socket: Socket | null = null;
  private config: WebSocketConfig;
  private eventListeners: Partial<NotificationClientEvents> = {};

  constructor(config: WebSocketConfig) {
    this.config = config;
  }

  connect(): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(this.config.serverUrl, {
      auth: {
        token: this.config.authToken
      },
      autoConnect: this.config.autoConnect ?? true
    });

    this.setupEventListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinUserRoom(userId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join_user_room', userId);
      console.log(`Joining user room: user_${userId}`);
    }
  }

  leaveUserRoom(userId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_user_room', userId);
      console.log(`Leaving user room: user_${userId}`);
    }
  }

  // Legacy methods for backward compatibility
  joinProject(projectId: string): void {
    console.warn('joinProject is deprecated, use joinUserRoom instead');
    this.joinUserRoom(projectId);
  }

  leaveProject(projectId: string): void {
    console.warn('leaveProject is deprecated, use leaveUserRoom instead');
    this.leaveUserRoom(projectId);
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  on<K extends keyof NotificationClientEvents>(
    event: K, 
    listener: NotificationClientEvents[K]
  ): void {
    this.eventListeners[event] = listener;
  }

  off<K extends keyof NotificationClientEvents>(event: K): void {
    delete this.eventListeners[event];
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to notification service');
      this.eventListeners.connect?.();
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from notification service');
      this.eventListeners.disconnect?.();
    });

    this.socket.on('notification', (notification: Notification) => {
      console.log('Received notification:', notification);
      this.eventListeners.notification?.(notification);
    });

    this.socket.on('project_notification', (notification: Notification) => {
      console.log('Received project notification:', notification);
      this.eventListeners.project_notification?.(notification);
    });

    this.socket.on('global_notification', (notification: Notification) => {
      console.log('Received global notification:', notification);
      this.eventListeners.global_notification?.(notification);
    });

    this.socket.on('notification_count', (count: NotificationCount) => {
      console.log('Received notification count:', count);
      this.eventListeners.notification_count?.(count);
    });

    this.socket.on('authenticated', (data: { success: boolean }) => {
      console.log('Authentication result:', data);
      this.eventListeners.authenticated?.(data);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('Connection error:', error.message);
      this.eventListeners.connect_error?.(error);
    });

    this.socket.on('reconnect', (attemptNumber: number) => {
      console.log('Reconnected after', attemptNumber, 'attempts');
      this.eventListeners.reconnect?.(attemptNumber);
    });

    this.socket.on('reconnect_error', (error: Error) => {
      console.error('Reconnection failed:', error);
      this.eventListeners.reconnect_error?.(error);
    });
  }

  // Update auth token
  updateAuthToken(token: string): void {
    this.config.authToken = token;
    if (this.socket?.connected) {
      this.socket.auth.token = token;
    }
  }

  // Get connection status
  getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' {
    if (!this.socket) return 'disconnected';
    if (this.socket.connecting) return 'connecting';
    return this.socket.connected ? 'connected' : 'disconnected';
  }
}

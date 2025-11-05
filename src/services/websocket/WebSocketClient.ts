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
    }
  }

  leaveUserRoom(userId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_user_room', userId);
    }
  }

  // Legacy methods for backward compatibility
  joinProject(projectId: string): void {
    this.joinUserRoom(projectId);
  }

  leaveProject(projectId: string): void {
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
      this.eventListeners.connect?.();
    });

    this.socket.on('disconnect', () => {
      this.eventListeners.disconnect?.();
    });

    this.socket.on('notification', (notification: Notification) => {
      this.eventListeners.notification?.(notification);
    });

    this.socket.on('project_notification', (notification: Notification) => {
      this.eventListeners.project_notification?.(notification);
    });

    this.socket.on('global_notification', (notification: Notification) => {
      this.eventListeners.global_notification?.(notification);
    });

    this.socket.on('notification_count', (count: NotificationCount) => {
      this.eventListeners.notification_count?.(count);
    });

    this.socket.on('authenticated', (data: { success: boolean }) => {
      this.eventListeners.authenticated?.(data);
    });

    this.socket.on('connect_error', (error: Error) => {
      this.eventListeners.connect_error?.(error);
    });

    this.socket.on('reconnect', (attemptNumber: number) => {
      this.eventListeners.reconnect?.(attemptNumber);
    });

    this.socket.on('reconnect_error', (error: Error) => {
      this.eventListeners.reconnect_error?.(error);
    });
  }

  // Update auth token
  updateAuthToken(token: string): void {
    this.config.authToken = token;
    if (this.socket?.connected && typeof this.socket.auth === 'object' && this.socket.auth !== null) {
      this.socket.auth.token = token;
    }
  }

  // Get connection status
  getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' {
    if (!this.socket) return 'disconnected';
    if (this.socket.connected) return 'connected';
    // Socket exists but not connected - could be connecting or disconnected
    // Since socket.io-client doesn't expose a 'connecting' state directly,
    // we check if it's actively disconnected vs in a connecting state
    // For simplicity, we'll return 'disconnected' if not connected
    // If you need to track 'connecting' state, consider tracking it manually during connect()
    return this.socket.disconnected ? 'disconnected' : 'connecting';
  }
}

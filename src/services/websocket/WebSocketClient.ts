import type { 
  Notification,
  NotificationCount,
  WebSocketConfig, 
  NotificationClientEvents 
} from './types';

interface WebSocketMessage {
  type: string;
  data: unknown;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private eventListeners: Partial<NotificationClientEvents> = {};
  private customEventListeners: Map<string, Set<(...args: unknown[]) => void>> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private maxReconnectDelay: number = 30000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private shouldReconnect: boolean = true;
  private messageQueue: WebSocketMessage[] = [];

  constructor(config: WebSocketConfig) {
    this.config = config;
  }

  private getWebSocketUrl(): string {
    let baseUrl = this.config.serverUrl;
    
    // Handle ws:// and wss:// URLs
    if (baseUrl.startsWith('ws://') || baseUrl.startsWith('wss://')) {
      baseUrl = baseUrl.replace(/^wss?:\/\//, '');
    } else {
      // Handle http:// and https:// URLs
      baseUrl = baseUrl.replace(/^https?:\/\//, '');
    }
    
    // Remove trailing slash
    baseUrl = baseUrl.replace(/\/$/, '');
    
    // Determine protocol
    const protocol = this.config.serverUrl.startsWith('https') || this.config.serverUrl.startsWith('wss') ? 'wss' : 'ws';
    
    return `${protocol}://${baseUrl}/ws?token=${this.config.authToken}`;
  }

  connect(): void {
    // If already connected, don't reconnect
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    // If connecting, wait
    if (this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    // Close existing connection if any
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // Validate token before attempting connection
    if (!this.config.authToken) {
      // eslint-disable-next-line no-console
      console.error('WebSocketClient: Cannot connect without auth token');
      return;
    }

    const url = this.getWebSocketUrl();
    // eslint-disable-next-line no-console
    console.log(`WebSocketClient: Attempting to connect to ${url}`);
    
    try {
      this.ws = new WebSocket(url);
      this.setupEventListeners();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('WebSocketClient: Failed to create WebSocket connection:', error);
      this.attemptReconnect();
    }
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      // Only close if the WebSocket is in a state that allows closing
      if (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.close();
        } catch (error) {
          // Ignore errors when closing (connection might already be closed)
          // eslint-disable-next-line no-console
          console.log('WebSocketClient: Error closing connection (expected in some cases)', error);
        }
      }
      this.ws = null;
    }
    this.reconnectAttempts = 0;
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      // eslint-disable-next-line no-console
      console.log('WebSocketClient: Connected successfully');
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      this.eventListeners.connect?.();

      // Flush queued messages
      this.flushMessageQueue();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('WebSocketClient: Error parsing message:', error, event.data);
      }
    };

    this.ws.onerror = (error) => {
      // eslint-disable-next-line no-console
      console.error('WebSocketClient: WebSocket error:', error);
      this.eventListeners.connect_error?.(new Error('WebSocket connection error'));
    };

    this.ws.onclose = (event) => {
      // eslint-disable-next-line no-console
      console.log('WebSocketClient: Disconnected:', event.code, event.reason);
      this.eventListeners.disconnect?.(event.reason || 'Connection closed');

      // Attempt reconnection if not intentionally disconnected
      if (this.shouldReconnect && event.code !== 1000) {
        this.attemptReconnect();
      }
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    const { type, data } = message;

    // Handle notification events
    switch (type) {
      case 'notification':
        this.eventListeners.notification?.(data as Notification);
        break;
      case 'project_notification':
        this.eventListeners.project_notification?.(data as Notification);
        break;
      case 'global_notification':
        this.eventListeners.global_notification?.(data as Notification);
        break;
      case 'notification_count':
        this.eventListeners.notification_count?.(data as NotificationCount);
        break;
      case 'authenticated':
        // Authentication successful
        // eslint-disable-next-line no-console
        console.log('WebSocketClient: Authenticated');
        break;
      default: {
        // Handle custom events
        const listeners = this.customEventListeners.get(type);
        if (listeners) {
          listeners.forEach(listener => listener(data));
        }
        break;
      }
    }
  }

  private attemptReconnect(): void {
    if (!this.shouldReconnect || this.reconnectAttempts >= this.maxReconnectAttempts) {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        // eslint-disable-next-line no-console
        console.error('WebSocketClient: Max reconnection attempts reached');
      }
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );

    // eslint-disable-next-line no-console
    console.log(
      `WebSocketClient: Reconnecting in ${delay}ms... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private flushMessageQueue(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue.shift();
        if (message) {
          this.ws.send(JSON.stringify(message));
        }
      }
    }
  }

  // Legacy methods for backward compatibility (no-op for native WebSocket)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  joinUserRoom(_userId: string): void {
    // Native WebSocket doesn't have rooms, server handles this automatically
    // eslint-disable-next-line no-console
    console.log('WebSocketClient: joinUserRoom called (native WebSocket handles this automatically)');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  leaveUserRoom(_userId: string): void {
    // Native WebSocket doesn't have rooms, server handles this automatically
    // eslint-disable-next-line no-console
    console.log('WebSocketClient: leaveUserRoom called (native WebSocket handles this automatically)');
  }

  joinProject(projectId: string): void {
    this.joinUserRoom(projectId);
  }

  leaveProject(projectId: string): void {
    this.leaveUserRoom(projectId);
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Emit an event to the server (sends message with type and data)
  emit(event: string, data?: unknown): void {
    const message: WebSocketMessage = { type: event, data };

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue message for later if not connected
      // eslint-disable-next-line no-console
      console.warn(`WebSocketClient: Cannot emit '${event}' - socket is not connected. Queueing message.`);
      this.messageQueue.push(message);
    }
  }

  // Listen for any event (for task updates and other custom events)
  onEvent(event: string, listener: (...args: unknown[]) => void): void {
    if (!this.customEventListeners.has(event)) {
      this.customEventListeners.set(event, new Set());
    }
    this.customEventListeners.get(event)!.add(listener);
  }

  // Remove listener for any event
  offEvent(event: string, listener?: (...args: unknown[]) => void): void {
    const listeners = this.customEventListeners.get(event);
    if (listeners) {
      if (listener) {
        listeners.delete(listener);
      } else {
        listeners.clear();
      }
      if (listeners.size === 0) {
        this.customEventListeners.delete(event);
      }
    }
  }

  // Notification event handlers
  on<K extends keyof NotificationClientEvents>(
    event: K, 
    listener: NotificationClientEvents[K]
  ): void {
    this.eventListeners[event] = listener;
  }

  off<K extends keyof NotificationClientEvents>(event: K): void {
    delete this.eventListeners[event];
  }

  // Update auth token
  updateAuthToken(token: string): void {
    this.config.authToken = token;
    // Reconnect with new token
    if (this.ws) {
      this.disconnect();
      this.shouldReconnect = true;
      this.connect();
    }
  }

  // Get connection status
  getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' {
    if (!this.ws) return 'disconnected';
    if (this.ws.readyState === WebSocket.OPEN) return 'connected';
    if (this.ws.readyState === WebSocket.CONNECTING) return 'connecting';
    return 'disconnected';
  }
}

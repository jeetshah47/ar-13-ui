import type { 
  Notification,
  NotificationCount,
  SSEConfig, 
  NotificationClientEvents,
  SSENotificationEvent
} from './types';

export class SSEClient {
  private eventSource: EventSource | null = null;
  private config: SSEConfig;
  private eventListeners: Partial<NotificationClientEvents> = {};
  private customEventListeners: Map<string, Set<(...args: unknown[]) => void>> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private maxReconnectDelay: number = 30000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private shouldReconnect: boolean = true;

  constructor(config: SSEConfig) {
    this.config = config;
  }

  private getSSEUrl(): string {
    let baseUrl = this.config.serverUrl;
    
    // Remove trailing slash
    baseUrl = baseUrl.replace(/\/$/, '');
    
    // Ensure we have http:// or https:// protocol
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      // Default to http:// if no protocol specified
      baseUrl = `http://${baseUrl}`;
    }
    
    // SSE endpoint - token can be provided as query parameter or in Authorization header
    // According to docs, both are supported, but query parameter is simpler for EventSource
    return `${baseUrl}/api/events?token=${this.config.authToken}`;
  }

  connect(): void {
    // If already connected, don't reconnect
    if (this.eventSource?.readyState === EventSource.OPEN) {
      return;
    }

    // If connecting, wait
    if (this.eventSource?.readyState === EventSource.CONNECTING) {
      return;
    }

    // Close existing connection if any
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    // Validate token before attempting connection
    if (!this.config.authToken) {
      // eslint-disable-next-line no-console
      console.error('SSEClient: Cannot connect without auth token');
      return;
    }

    const url = this.getSSEUrl();
    // eslint-disable-next-line no-console
    console.log(`SSEClient: Attempting to connect to ${url}`);
    
    try {
      this.eventSource = new EventSource(url);
      this.setupEventListeners();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('SSEClient: Failed to create SSE connection:', error);
      this.attemptReconnect();
    }
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.eventSource) {
      try {
        this.eventSource.close();
      } catch (error) {
        // Ignore errors when closing (connection might already be closed)
        // eslint-disable-next-line no-console
        console.log('SSEClient: Error closing connection (expected in some cases)', error);
      }
      this.eventSource = null;
    }
    this.reconnectAttempts = 0;
  }

  private setupEventListeners(): void {
    if (!this.eventSource) return;

    // Handle heartbeat comments (sent every 30 seconds)
    // EventSource doesn't expose comment events directly, but we can handle them
    // by monitoring the connection state and ignoring empty data

    this.eventSource.onopen = () => {
      // eslint-disable-next-line no-console
      console.log('SSEClient: Connected successfully');
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      this.eventListeners.connect?.();
    };

    // Handle authenticated event (sent immediately after connection)
    this.eventSource.addEventListener('authenticated', (event) => {
      try {
        const data = JSON.parse(event.data);
        // eslint-disable-next-line no-console
        console.log('SSEClient: Authenticated', data);
        // Validate that we received userId
        if (data.userId) {
          this.eventListeners.authenticated?.(data);
        } else {
          // eslint-disable-next-line no-console
          console.warn('SSEClient: Authenticated event missing userId', data);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('SSEClient: Error parsing authenticated event:', error);
      }
    });

    // Handle notification events
    this.eventSource.addEventListener('notification', (event) => {
      try {
        const data = JSON.parse(event.data);
        // Parse the SSE notification event structure
        // According to docs: { notification: {...}, taskId, projectId, projectTitle }
        const notificationEvent: SSENotificationEvent = {
          notification: {
            ...data.notification,
            // Merge metadata from root level into notification object
            taskId: data.taskId || data.notification?.taskId,
            projectId: data.projectId || data.notification?.projectId,
            projectTitle: data.projectTitle || data.notification?.projectTitle,
            // Parse dates
            createdAt: data.notification?.createdAt 
              ? new Date(data.notification.createdAt) 
              : new Date(),
            created: data.notification?.created || data.notification?.createdAt
              ? new Date(data.notification.created || data.notification.createdAt)
              : new Date(),
          },
          taskId: data.taskId,
          projectId: data.projectId,
          projectTitle: data.projectTitle,
        };
        this.eventListeners.notification?.(notificationEvent);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('SSEClient: Error parsing notification event:', error);
      }
    });

    this.eventSource.addEventListener('project_notification', (event) => {
      try {
        const data = JSON.parse(event.data);
        this.eventListeners.project_notification?.(data as Notification);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('SSEClient: Error parsing project_notification event:', error);
      }
    });

    this.eventSource.addEventListener('global_notification', (event) => {
      try {
        const data = JSON.parse(event.data);
        this.eventListeners.global_notification?.(data as Notification);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('SSEClient: Error parsing global_notification event:', error);
      }
    });

    this.eventSource.addEventListener('notification_count', (event) => {
      try {
        const data = JSON.parse(event.data);
        this.eventListeners.notification_count?.(data as NotificationCount);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('SSEClient: Error parsing notification_count event:', error);
      }
    });

    // Handle task status update events
    this.eventSource.addEventListener('task:status-updated', (event) => {
      try {
        const data = JSON.parse(event.data);
        const listeners = this.customEventListeners.get('task:status-updated');
        if (listeners) {
          listeners.forEach(listener => listener(data));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('SSEClient: Error parsing task:status-updated event:', error);
      }
    });

    this.eventSource.addEventListener('task:update-status:success', (event) => {
      try {
        const data = JSON.parse(event.data);
        const listeners = this.customEventListeners.get('task:update-status:success');
        if (listeners) {
          listeners.forEach(listener => listener(data));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('SSEClient: Error parsing task:update-status:success event:', error);
      }
    });

    // Handle error events
    // Note: SSE error events are generic Event objects, not MessageEvent
    // They don't have a data property, so we handle them differently
    this.eventSource.addEventListener('error', () => {
      // eslint-disable-next-line no-console
      console.error('SSEClient: Server error event received');
      // Trigger custom error listeners if any
      const listeners = this.customEventListeners.get('error');
      if (listeners) {
        listeners.forEach(listener => listener({ error: 'Server error' }));
      }
    });

    this.eventSource.onerror = (error) => {
      // eslint-disable-next-line no-console
      console.error('SSEClient: SSE connection error:', error);
      this.eventListeners.connect_error?.(new Error('SSE connection error'));

      // Attempt reconnection if connection is closed
      if (this.eventSource?.readyState === EventSource.CLOSED) {
        if (this.shouldReconnect) {
          this.attemptReconnect();
        }
      }
    };

    // Note: EventSource doesn't have an onclose event like WebSocket
    // Connection closure is detected via onerror when readyState is CLOSED
  }

  private attemptReconnect(): void {
    if (!this.shouldReconnect || this.reconnectAttempts >= this.maxReconnectAttempts) {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        // eslint-disable-next-line no-console
        console.error('SSEClient: Max reconnection attempts reached');
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
      `SSEClient: Reconnecting in ${delay}ms... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Listen for any event (for task updates and other custom events)
  onEvent(event: string, listener: (...args: unknown[]) => void): void {
    if (!this.customEventListeners.has(event)) {
      this.customEventListeners.set(event, new Set());
    }
    this.customEventListeners.get(event)!.add(listener);

    // If eventSource is already connected, we need to ensure the listener is registered
    // Note: EventSource listeners are registered via addEventListener, which we do in setupEventListeners
    // Custom events are handled by routing to customEventListeners
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
    if (this.eventSource) {
      this.disconnect();
      this.shouldReconnect = true;
      this.connect();
    }
  }

  // Get connection status
  getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' {
    if (!this.eventSource) return 'disconnected';
    if (this.eventSource.readyState === EventSource.OPEN) return 'connected';
    if (this.eventSource.readyState === EventSource.CONNECTING) return 'connecting';
    return 'disconnected';
  }

  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}


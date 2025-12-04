import type { 
  SSEConfig, 
  NotificationClientEvents,
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
      return;
    }

    const url = this.getSSEUrl();
    
    try {
      this.eventSource = new EventSource(url);
      this.setupEventListeners();
    } catch {
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
      } catch {
        // Ignore errors when closing (connection might already be closed)
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
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      this.eventListeners.connect?.();
    };

    // Handle authenticated event (sent immediately after connection)
    this.eventSource.addEventListener('authenticated', (event) => {
      try {
        const data = JSON.parse(event.data);
        // Validate that we received userId
        if (data.userId) {
          this.eventListeners.authenticated?.(data);
        }
      } catch {
        // Ignore parsing errors
      }
    });

    // Handle notifications-available event (lightweight signal to fetch notifications)
    this.eventSource.addEventListener('notifications-available', (event) => {
      try {
        const data = JSON.parse(event.data);
        this.eventListeners['notifications-available']?.(data);
      } catch {
        // Ignore parsing errors
      }
    });

    // Handle task status update events (custom events for real-time task updates)
    this.eventSource.addEventListener('task:status-updated', (event) => {
      try {
        const data = JSON.parse(event.data);
        const listeners = this.customEventListeners.get('task:status-updated');
        if (listeners) {
          listeners.forEach(listener => listener(data));
        }
      } catch {
        // Ignore parsing errors
      }
    });

    this.eventSource.addEventListener('task:update-status:success', (event) => {
      try {
        const data = JSON.parse(event.data);
        const listeners = this.customEventListeners.get('task:update-status:success');
        if (listeners) {
          listeners.forEach(listener => listener(data));
        }
      } catch {
        // Ignore parsing errors
      }
    });

    // Handle activity-log:reply-added event
    this.eventSource.addEventListener('activity-log:reply-added', (event) => {
      try {
        const data = JSON.parse(event.data);
        const listeners = this.customEventListeners.get('activity-log:reply-added');
        if (listeners) {
          listeners.forEach(listener => listener(data));
        }
      } catch {
        // Ignore parsing errors
      }
    });

    // Generic handler for any other custom events
    // Note: EventSource requires explicit addEventListener for each event type
    // For dynamic events, we need to add them as they're registered
    // This is a limitation of the EventSource API

    // Handle error events
    // Note: SSE error events are generic Event objects, not MessageEvent
    // They don't have a data property, so we handle them differently
    this.eventSource.addEventListener('error', () => {
      // Trigger custom error listeners if any
      const listeners = this.customEventListeners.get('error');
      if (listeners) {
        listeners.forEach(listener => listener({ error: 'Server error' }));
      }
    });

    this.eventSource.onerror = () => {
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
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Listen for any event (for task updates and other custom events)
  onEvent(event: string, listener: (...args: unknown[]) => void): void {
    if (!this.customEventListeners.has(event)) {
      this.customEventListeners.set(event, new Set());
      
      // Dynamically add EventSource listener for this event type if eventSource exists
      if (this.eventSource) {
        this.eventSource.addEventListener(event, (e: MessageEvent) => {
          try {
            const data = JSON.parse(e.data);
            const listeners = this.customEventListeners.get(event);
            if (listeners) {
              listeners.forEach(l => l(data));
            }
          } catch {
            // Ignore parsing errors
          }
        });
      }
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

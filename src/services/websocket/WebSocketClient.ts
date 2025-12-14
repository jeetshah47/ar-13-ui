import type { 
  WebSocketConfig, 
  NotificationClientEvents,
  WebSocketMessage,
} from './types';

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
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(config: WebSocketConfig) {
    this.config = config;
  }

  private getWebSocketUrl(): string {
    let baseUrl = this.config.serverUrl;
    
    // Remove trailing slash
    baseUrl = baseUrl.replace(/\/$/, '');
    
    // Convert http:// to ws:// and https:// to wss://
    if (baseUrl.startsWith('http://')) {
      baseUrl = baseUrl.replace('http://', 'ws://');
    } else if (baseUrl.startsWith('https://')) {
      baseUrl = baseUrl.replace('https://', 'wss://');
    } else if (!baseUrl.startsWith('ws://') && !baseUrl.startsWith('wss://')) {
      // Default to ws:// if no protocol specified
      baseUrl = `ws://${baseUrl}`;
    }
    
    // WebSocket endpoint - token as query parameter
    return `${baseUrl}/ws?token=${this.config.authToken}`;
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

    // Clean up existing connection if any
    if (this.ws) {
      this.cleanupConnection();
    }

    // Validate token before attempting connection
    if (!this.config.authToken) {
      return;
    }

    const url = this.getWebSocketUrl();
    
    try {
      this.ws = new WebSocket(url);
      this.setupEventListeners();
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      this.attemptReconnect();
    }
  }

  private cleanupConnection(): void {
    // Stop heartbeat first
    this.stopHeartbeat();
    
    // Remove all event listeners to prevent leaks
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;
      
      // Close connection
      try {
        this.ws.close();
      } catch {
        // Ignore errors when closing
      }
      this.ws = null;
    }
  }

  disconnect(): void {
    this.shouldReconnect = false;
    
    // Clear reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    // Clean up connection (includes heartbeat cleanup)
    this.cleanupConnection();
    
    // Clear all event listeners to prevent memory leaks
    this.eventListeners = {};
    this.customEventListeners.clear();
    
    this.reconnectAttempts = 0;
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    // Store reference to current WebSocket to avoid issues with reconnections
    const currentWs = this.ws;

    this.ws.onopen = () => {
      // Verify this is still the current connection
      if (this.ws !== currentWs) return;
      
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      this.eventListeners.connect?.();
      
      // Start heartbeat to keep connection alive
      this.startHeartbeat();
    };

    this.ws.onmessage = (event: MessageEvent) => {
      // Verify this is still the current connection
      if (this.ws !== currentWs) return;
      
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        // Ignore ping/pong messages (handled by browser)
        if (message.type === 'ping' || message.type === 'pong') {
          return;
        }
        
        // Handle authenticated event
        if (message.type === 'authenticated') {
          if (message.data?.userId) {
            this.eventListeners.authenticated?.(message.data);
          }
        }
        // Handle notifications-available event
        else if (message.type === 'notifications-available') {
          this.eventListeners['notifications-available']?.(message.data);
        }
        // Handle custom events
        else {
          const listeners = this.customEventListeners.get(message.type);
          if (listeners) {
            listeners.forEach(listener => listener(message.data));
          }
        }
      } catch (error) {
        console.error('[WebSocket] Error parsing message:', error);
      }
    };

    this.ws.onerror = (error) => {
      // Verify this is still the current connection
      if (this.ws !== currentWs) return;
      
      console.error('[WebSocket] Connection error:', error);
      this.eventListeners.connect_error?.(new Error('WebSocket connection error'));
    };

    this.ws.onclose = (event) => {
      // Verify this is still the current connection
      if (this.ws !== currentWs) return;
      
      this.stopHeartbeat();
      this.eventListeners.disconnect?.(event.reason || 'Connection closed');

      // Attempt reconnection if connection is closed unexpectedly
      if (this.shouldReconnect && event.code !== 1000) { // 1000 = normal closure
        this.attemptReconnect();
      }
    };
  }

  private startHeartbeat(): void {
    // Send ping every 30 seconds to keep connection alive
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        // Send a ping message (server will respond with pong)
        try {
          this.ws.send(JSON.stringify({ type: 'ping', data: {} }));
        } catch (error) {
          console.error('[WebSocket] Error sending ping:', error);
        }
      }
    }, 30000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private attemptReconnect(): void {
    if (!this.shouldReconnect || this.reconnectAttempts >= this.maxReconnectAttempts) {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.warn('[WebSocket] Max reconnection attempts reached');
        this.eventListeners.reconnect_error?.(new Error('Max reconnection attempts reached'));
      }
      return;
    }

    // Clear any existing reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      if (this.shouldReconnect) {
        this.eventListeners.reconnect?.(this.reconnectAttempts);
        this.connect();
      }
    }, delay);
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
    const wasConnected = this.isConnected();
    if (this.ws) {
      // Temporarily disable reconnection to avoid double connection
      const shouldReconnect = this.shouldReconnect;
      this.shouldReconnect = false;
      this.disconnect();
      this.shouldReconnect = shouldReconnect || wasConnected;
      if (this.shouldReconnect) {
        this.connect();
      }
    }
  }

  // Get connection status
  getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' {
    if (!this.ws) return 'disconnected';
    if (this.ws.readyState === WebSocket.OPEN) return 'connected';
    if (this.ws.readyState === WebSocket.CONNECTING) return 'connecting';
    return 'disconnected';
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Send a message via WebSocket
  send(message: WebSocketMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] Cannot send message: connection not open');
      return;
    }

    try {
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error('[WebSocket] Error sending message:', error);
    }
  }
}


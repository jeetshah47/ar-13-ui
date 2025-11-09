# Socket.IO API Documentation

This document describes how to connect and use the Socket.IO API from a client application.

## Endpoint

```
http://localhost:3000/socket.io/
```

For production with HTTPS:
```
https://your-domain.com/socket.io/
```

**Note:** The default port is 3000, but you can change it by setting the `PORT` environment variable.

## Authentication

The Socket.IO connection requires authentication via JWT token. The token must be included in the connection request.

### Connection with Token

You can pass the token as a query parameter:

```javascript
const socket = io('http://localhost:3000', {
  path: '/socket.io/',
  query: {
    token: 'your-jwt-token-here'
  },
  transports: ['websocket', 'polling'],
});
```

**Note:** The server extracts the user ID from the JWT token during connection. The token must be valid and include a valid user ID. If authentication fails, the connection will be rejected.

## Connection Lifecycle

### 1. Connection Setup

The Socket.IO connection is established through an HTTP upgrade request. The server automatically:
- Validates your JWT token
- Extracts your user ID
- Establishes the Socket.IO connection
- Closes any existing connection for the same user (only one active connection per user)

### 2. Keep-Alive

Socket.IO automatically handles ping/pong messages to keep the connection alive. No manual intervention needed.

### 3. Disconnection

The connection will close if:
- Client explicitly disconnects
- Network error occurs
- Server shuts down
- Authentication token is invalid or expired

## Client Implementation Examples

### JavaScript/TypeScript (Browser)

```javascript
import { io } from 'socket.io-client';

const token = 'your-jwt-token-here';

const socket = io('http://localhost:3000', {
  path: '/socket.io/',
  query: {
    token: token
  },
  transports: ['websocket', 'polling'], // Socket.IO will try WebSocket first, fallback to polling
  autoConnect: true,
});

// Connection events
socket.on('connect', () => {
  console.log('Socket.IO connected:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Socket.IO disconnected:', reason);
  // Handle reconnection if needed
  if (reason === 'io server disconnect') {
    // Server disconnected the socket, reconnect manually
    socket.connect();
  }
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  // Handle authentication errors
  if (error.message === 'unauthorized') {
    console.error('Authentication failed. Please check your token.');
    // Refresh token and reconnect
  }
});

// Custom events
socket.on('notification', (data) => {
  console.log('Notification received:', data);
  // Handle notification
});

// Emit events to server
socket.emit('custom-event', { data: 'Hello server' });

// Disconnect
socket.disconnect();
```

### React Hook Example

```typescript
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketIOOptions {
  token: string;
  url?: string;
  onNotification?: (data: any) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
}

export function useSocketIO({
  token,
  url = 'http://localhost:3000',
  onNotification,
  onError,
  onConnect,
  onDisconnect,
}: UseSocketIOOptions) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(url, {
      path: '/socket.io/',
      query: {
        token: token,
      },
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('Socket.IO connected:', socketInstance.id);
      setIsConnected(true);
      onConnect?.();
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
      setIsConnected(false);
      onDisconnect?.(reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      onError?.(error);
    });

    socketInstance.on('notification', (data) => {
      onNotification?.(data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token, url, onNotification, onError, onConnect, onDisconnect]);

  const emit = (event: string, data: any) => {
    if (socket && socket.connected) {
      socket.emit(event, data);
    } else {
      console.error('Socket.IO is not connected');
    }
  };

  return {
    socket,
    isConnected,
    emit,
  };
}

// Usage in a component
function MyComponent() {
  const token = 'your-jwt-token';
  
  const { isConnected, emit } = useSocketIO({
    token,
    onNotification: (data) => {
      console.log('Received notification:', data);
      // Update UI, show notification, etc.
    },
    onError: (error) => {
      console.error('Socket.IO error:', error);
    },
    onConnect: () => {
      console.log('Connected to server');
    },
  });

  const handleSendMessage = () => {
    emit('custom-event', { type: 'test', message: 'Hello' });
  };

  return (
    <div>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={handleSendMessage} disabled={!isConnected}>
        Send Message
      </button>
    </div>
  );
}
```

### Node.js Example

```javascript
const { io } = require('socket.io-client');

class NodeSocketIOClient {
  constructor(token, url = 'http://localhost:3000') {
    this.token = token;
    this.url = url;
    this.socket = null;
  }

  connect() {
    this.socket = io(this.url, {
      path: '/socket.io/',
      query: {
        token: this.token,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket.IO connected:', this.socket.id);
      this.onConnect();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
      this.onDisconnect(reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO error:', error);
      this.onError(error);
    });

    this.socket.on('notification', (data) => {
      this.onNotification(data);
    });
  }

  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.error('Socket.IO is not connected');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  onConnect() {
    console.log('Connection opened');
  }

  onNotification(data) {
    console.log('Notification received:', data);
  }

  onError(error) {
    console.error('Error occurred:', error);
  }

  onDisconnect(reason) {
    console.log('Connection closed:', reason);
  }
}

// Usage
const token = 'your-jwt-token';
const client = new NodeSocketIOClient(token);
client.connect();
```

## Message Format

### Sending Messages

Messages are sent using Socket.IO's `emit` method:

```javascript
// Emit an event with data
socket.emit('event-name', {
  type: 'notification',
  action: 'subscribe',
  userId: 'user123'
});
```

### Receiving Messages

Listen for events from the server:

```javascript
socket.on('notification', (data) => {
  // Handle the notification
  console.log('Notification:', data);
});
```

## Server-Sent Events

The server can send events to connected users. Common events include:

### Notification Event

```javascript
socket.on('notification', (data) => {
  // data structure:
  // {
  //   id: "notif-123",
  //   userId: "user-456",
  //   title: "New Task Assigned",
  //   message: "You have been assigned to task 'Review PR'",
  //   timestamp: "2024-01-15T10:30:00Z",
  //   read: false
  // }
});
```

### Task Status Updated Event

This event is broadcast to all project members when a task status is updated (e.g., via drag and drop):

```javascript
socket.on('task:status-updated', (data) => {
  // data structure:
  // {
  //   projectId: "project-123",
  //   taskId: "task-456",
  //   status: "In Progress",
  //   updatedBy: "user-789",
  //   task: { ... } // Full task object (optional)
  // }
  
  // Update your UI to reflect the status change
  updateTaskStatus(data.taskId, data.status);
});
```

## Client-Sent Events

### Task Status Update (Drag and Drop)

Emit this event when a user drags and drops a task to change its status:

```javascript
// When user drags a task to a new status column
socket.emit('task:update-status', {
  projectId: 'project-123',
  taskId: 'task-456',
  status: 'In Progress' // New status value
});

// Listen for success response
socket.on('task:update-status:success', (data) => {
  console.log('Task status updated:', data);
  // data contains: projectId, taskId, status, updatedBy, task
});

// Listen for error response
socket.on('task:update-status:error', (error) => {
  console.error('Failed to update task status:', error.error);
  // Show error message to user
});
```

### Complete Example: Drag and Drop Task Status Update

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  path: '/socket.io/',
  query: { token: 'your-jwt-token' },
  transports: ['websocket', 'polling'],
});

// Handle drag and drop
function handleTaskDrop(taskId, projectId, newStatus) {
  // Emit the status update
  socket.emit('task:update-status', {
    projectId,
    taskId,
    status: newStatus
  });
}

// Listen for success
socket.on('task:update-status:success', (data) => {
  console.log('Task updated:', data);
  // Update local state/UI optimistically
  updateTaskInState(data.taskId, { status: data.status });
});

// Listen for errors
socket.on('task:update-status:error', (error) => {
  console.error('Update failed:', error.error);
  // Revert UI change, show error
  showErrorMessage(error.error);
});

// Listen for updates from other users
socket.on('task:status-updated', (data) => {
  // Another user updated a task - update your UI
  updateTaskInState(data.taskId, { status: data.status });
  // Optionally show a notification
  showNotification(`Task status updated by another user`);
});
```

## Error Handling

### Connection Errors

```javascript
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  
  // Common errors:
  // - "unauthorized" - Authentication failed
  // - Network errors
  // - Server errors
  
  if (error.message === 'unauthorized') {
    // Handle authentication failure
    // Refresh token and reconnect
  }
});
```

### Disconnect Reasons

```javascript
socket.on('disconnect', (reason) => {
  console.log('Disconnect reason:', reason);
  
  // Common reasons:
  // - "io server disconnect" - Server disconnected
  // - "io client disconnect" - Client disconnected
  // - "ping timeout" - No pong received
  // - "transport close" - Transport closed
  // - "transport error" - Transport error
  
  if (reason === 'io server disconnect') {
    // Server disconnected, reconnect manually
    socket.connect();
  }
});
```

## Best Practices

### 1. Token Management

- Store JWT token securely (not in localStorage for sensitive apps)
- Refresh token before it expires
- Re-authenticate if connection fails with "unauthorized" error
- Update token in query parameters when reconnecting

### 2. Reconnection Strategy

Socket.IO has built-in reconnection, but you can customize it:

```javascript
const socket = io('http://localhost:3000', {
  path: '/socket.io/',
  query: { token },
  reconnection: true,           // Enable reconnection
  reconnectionDelay: 1000,        // Initial delay
  reconnectionDelayMax: 5000,     // Max delay
  reconnectionAttempts: 5,       // Max attempts
  timeout: 20000,                 // Connection timeout
});
```

### 3. Message Handling

- Validate message structure before processing
- Handle different event types appropriately
- Implement message queuing for offline scenarios

### 4. Connection Management

- Disconnect when component unmounts (React)
- Disconnect when user logs out
- Only maintain one connection per user (server enforces this)

### 5. Error Recovery

```javascript
socket.on('connect_error', (error) => {
  if (error.message === 'unauthorized') {
    // Get new token
    const newToken = await refreshToken();
    
    // Reconnect with new token
    socket.io.opts.query.token = newToken;
    socket.connect();
  }
});
```

## Connection Status

Check connection status:

```javascript
// Socket.IO connection states
if (socket.connected) {
  // Connection is open
  socket.emit('event', data);
}

// Check if socket is disconnected
if (socket.disconnected) {
  socket.connect();
}
```

## Testing

### Using Browser Console

```javascript
// Install socket.io-client first: npm install socket.io-client

import { io } from 'socket.io-client';

const token = 'your-jwt-token';
const socket = io('http://localhost:3000', {
  path: '/socket.io/',
  query: { token },
});

socket.on('connect', () => console.log('Connected:', socket.id));
socket.on('notification', (data) => console.log('Notification:', data));
socket.on('disconnect', (reason) => console.log('Disconnected:', reason));
socket.on('connect_error', (error) => console.error('Error:', error));

// Send a message
socket.emit('test-event', { message: 'Hello' });
```

## Server API Reference

### Endpoint Configuration

- **Endpoint:** `/socket.io/`
- **Method:** HTTP upgrade to Socket.IO
- **Authentication:** Required (JWT token in query parameter)
- **Protocol:** Socket.IO (supports WebSocket and HTTP long-polling)

### Server Features

- **Authentication:** JWT token validation on connection
- **User Management:** One connection per user (new connection closes old one)
- **Event System:** Custom events for notifications and messages
- **Automatic Reconnection:** Built-in reconnection support

## Sending Notifications from Server

To send a notification to a user from the server:

```go
// In your Go code
socketIOHandler.SendToUser(userID, "notification", notificationData)
```

This will emit a `notification` event to the specified user if they are connected.

## Troubleshooting

### Connection Fails Immediately

1. **Check authentication:**
   - Verify JWT token is valid
   - Ensure token is included in query parameters
   - Check token hasn't expired

2. **Check server logs:**
   - Look for "Socket.IO connection rejected" messages
   - Check for authentication errors

3. **Check CORS:**
   - Ensure server allows your origin
   - Check browser console for CORS errors

### Connection Drops Frequently

1. **Network issues:**
   - Check network stability
   - Verify firewall/proxy settings

2. **Server issues:**
   - Check server logs for errors
   - Verify server is running and accessible

3. **Token expiration:**
   - Refresh token before it expires
   - Handle reconnection with new token

### Messages Not Received

1. **Check connection status:**
   ```javascript
   if (!socket.connected) {
     console.error('Socket.IO not connected');
   }
   ```

2. **Verify event names:**
   - Ensure event names match between client and server
   - Check server logs for emitted events

3. **Check server logs:**
   - Server logs all connection events
   - Verify events are being emitted

## Support

For issues or questions:
1. Check server logs for detailed error messages
2. Verify authentication token is valid
3. Test connection with browser console
4. Review this documentation for common issues


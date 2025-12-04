# WebSocket Notification Service Documentation

## Overview

The WebSocket Notification Service provides real-time notification capabilities using Socket.IO. It enables instant delivery of notifications to connected clients without requiring polling, supporting user-specific, project-specific, and global notifications.

## Architecture

### Components

1. **WebSocketService** - Manages WebSocket connections and room-based messaging
2. **NotificationEventService** - Event emitter that handles notification events
3. **WebSocketAuthMiddleware** - JWT-based authentication for WebSocket connections
4. **NotificationService** - Business logic for notification operations

### Flow

```
Action Triggered → NotificationService → NotificationEventService → WebSocketService → Client
```

## Connection Setup

### Server Configuration

The WebSocket service is initialized in `server.ts`:

```typescript
const webSocketService = new WebSocketService(httpServer);
NotificationEventService.setWebSocketService(webSocketService);
```

### Client Connection

Connect to the WebSocket server using Socket.IO client:

```javascript
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3000', {
  auth: {
    token: 'your-firebase-id-token'
  }
  // OR
  extraHeaders: {
    'Authorization': 'Bearer your-firebase-id-token'
  }
});
```

## Authentication

### WebSocket Authentication Middleware

The WebSocket service uses Firebase ID token authentication. Tokens can be provided in two ways:

1. **Auth object**: `socket.handshake.auth.token`
2. **Authorization header**: `Authorization: Bearer <token>`

### Authentication Flow

1. Client sends connection request with Firebase ID token
2. Server verifies token using Firebase Admin SDK
3. If valid, user ID is attached to socket
4. User is automatically joined to their personal room (`user_${userId}`)

## Data Types

### INotification Interface

```typescript
interface INotification {
  id: string;                    // Unique notification ID
  title: string;                 // Notification title
  message: string;               // Notification message
  type: NotificationType;        // Type of notification
  userId: string;                // Target user ID
  relatedEntityId: string;       // ID of related entity (project, task, etc.)
  relatedEntityType: RelatedEntityType; // Type of related entity
  isRead: boolean;              // Read status
  createdAt: Date;              // Creation timestamp
}
```

### NotificationType Enum

```typescript
enum NotificationType {
  PROJECT_CREATED = "PROJECT_CREATED",
  TASK_CREATED = "TASK_CREATED",
  TASK_ASSIGNED = "TASK_ASSIGNED",
  PROJECT_UPDATED = "PROJECT_UPDATED",
  TASK_UPDATED = "TASK_UPDATED",
  LEAVE_REQUEST_CREATED = "LEAVE_REQUEST_CREATED",
  LEAVE_REQUEST_APPROVED = "LEAVE_REQUEST_APPROVED",
  LEAVE_REQUEST_REJECTED = "LEAVE_REQUEST_REJECTED",
}
```

### RelatedEntityType Enum

```typescript
enum RelatedEntityType {
  PROJECT = "PROJECT",
  TASK = "TASK",
  LEAVE_REQUEST = "LEAVE_REQUEST",
}
```

## WebSocket Events

### Client → Server Events

#### Connection Events

| Event | Description | Payload | Authentication Required |
|-------|-------------|---------|------------------------|
| `connection` | Initial connection | None | Yes (via middleware) |

#### Room Management Events

| Event | Description | Payload | Authentication Required |
|-------|-------------|---------|------------------------|
| `join_project` | Join a project room for project notifications | `projectId: string` | Yes |
| `leave_project` | Leave a project room | `projectId: string` | Yes |

#### Example Usage

```javascript
// Join a project room
socket.emit('join_project', 'project-123');

// Leave a project room
socket.emit('leave_project', 'project-123');
```

### Server → Client Events

#### Notification Events

| Event | Description | Payload | Target |
|-------|-------------|---------|--------|
| `notification` | Individual user notification | `INotification` | Specific user |
| `project_notification` | Project-specific notification | `INotification` | Project room members |
| `global_notification` | Broadcast to all users | `INotification` | All connected users |
| `notification_count` | Real-time count update | `{ total: number, unread: number }` | Specific user |

#### Example Payloads

**Individual Notification:**
```json
{
  "id": "notif-123",
  "title": "New Task Assigned",
  "message": "You have been assigned to task 'Implement user authentication'",
  "type": "TASK_ASSIGNED",
  "userId": "user-456",
  "relatedEntityId": "task-789",
  "relatedEntityType": "TASK",
  "isRead": false,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Notification Count Update:**
```json
{
  "total": 15,
  "unread": 3
}
```

#### Example Client Listeners

```javascript
// Listen for individual notifications
socket.on('notification', (notification) => {
  console.log('New notification:', notification);
  // Update UI with new notification
});

// Listen for project notifications
socket.on('project_notification', (notification) => {
  console.log('Project notification:', notification);
  // Show project-specific notification
});

// Listen for global notifications
socket.on('global_notification', (notification) => {
  console.log('Global notification:', notification);
  // Show system-wide notification
});

// Listen for count updates
socket.on('notification_count', (count) => {
  console.log('Notification count:', count);
  // Update notification badge
});
```

## Room Management

### Personal Rooms

Each authenticated user is automatically joined to their personal room:
- Room name: `user_${userId}`
- Purpose: Receive individual notifications
- Auto-joined on connection

### Project Rooms

Users can join project-specific rooms for project notifications:
- Room name: `project_${projectId}`
- Purpose: Receive project-related notifications
- Manual join/leave required

### Room Usage Examples

```javascript
// User automatically joins personal room on connection
// No action needed

// Join project room
socket.emit('join_project', 'project-123');

// Leave project room
socket.emit('leave_project', 'project-123');
```

## REST API Integration

The WebSocket service works alongside the existing REST API. All REST endpoints remain available:

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications/all/:userId` | Get all notifications |
| GET | `/api/notifications/unread/:userId` | Get unread notifications |
| GET | `/api/notifications/count/:userId` | Get notification counts |
| PUT | `/api/notifications/read/:id` | Mark as read |
| PUT | `/api/notifications/read-all/:userId` | Mark all as read |
| DELETE | `/api/notifications/:id` | Delete notification |
| DELETE | `/api/notifications/user/:userId` | Delete all for user |
| GET | `/api/notifications/connection-info` | Get WebSocket connection info |

### WebSocket + REST Integration

When using REST endpoints, WebSocket events are automatically triggered:

- **Mark as read**: Triggers `notification_count` event
- **Delete notification**: Triggers `notification_count` event
- **Create notification**: Triggers `notification` event

## Error Handling

### Connection Errors

```javascript
socket.on('connect_error', (error) => {
  console.error('Connection failed:', error.message);
  // Handle authentication errors, network issues, etc.
});
```

### Authentication Errors

Common authentication errors:
- `"Authentication token required"` - No token provided
- `"Invalid token payload"` - Token verification failed
- `"Invalid authentication token"` - Token is malformed or expired

### Reconnection

Socket.IO automatically handles reconnection:

```javascript
socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after', attemptNumber, 'attempts');
  // Rejoin project rooms if needed
});

socket.on('reconnect_error', (error) => {
  console.error('Reconnection failed:', error);
});
```

## Usage Examples

### Complete Client Implementation

```javascript
import { io } from 'socket.io-client';

class NotificationClient {
  constructor(serverUrl, firebaseToken) {
    this.socket = io(serverUrl, {
      auth: { token: firebaseToken },
      autoConnect: false
    });
    
    this.setupEventListeners();
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  joinProject(projectId) {
    this.socket.emit('join_project', projectId);
  }

  leaveProject(projectId) {
    this.socket.emit('leave_project', projectId);
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to notification service');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from notification service');
    });

    this.socket.on('notification', (notification) => {
      this.handleNotification(notification);
    });

    this.socket.on('project_notification', (notification) => {
      this.handleProjectNotification(notification);
    });

    this.socket.on('notification_count', (count) => {
      this.updateNotificationCount(count);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
    });
  }

  handleNotification(notification) {
    // Show notification in UI
    this.showNotificationToast(notification);
    this.updateNotificationList(notification);
  }

  handleProjectNotification(notification) {
    // Show project-specific notification
    this.showProjectNotification(notification);
  }

  updateNotificationCount(count) {
    // Update notification badge
    document.getElementById('notification-badge').textContent = count.unread;
  }

  showNotificationToast(notification) {
    // Implementation for showing toast notification
    console.log('New notification:', notification.title);
  }

  updateNotificationList(notification) {
    // Implementation for updating notification list
    console.log('Adding to notification list:', notification);
  }
}

// Usage
const notificationClient = new NotificationClient(
  'ws://localhost:3000',
  'your-firebase-id-token'
);

notificationClient.connect();
notificationClient.joinProject('project-123');
```

## Server-Side Usage

### Sending Notifications

```typescript
import WebSocketService from '@src/services/WebSocketService';

// Get WebSocket service instance
const webSocketService = (global as { webSocketService: WebSocketService }).webSocketService;

// Send to specific user
webSocketService.sendNotificationToUser('user-123', notification);

// Send to project room
webSocketService.sendNotificationToProject('project-456', notification);

// Broadcast to all users
webSocketService.broadcastNotification(notification);

// Send count update
webSocketService.sendNotificationCount('user-123', { total: 10, unread: 3 });
```

### Monitoring Connections

```typescript
// Check if user is connected
const isConnected = webSocketService.isUserConnected('user-123');

// Get connected users count
const count = webSocketService.getConnectedUsersCount();

// Get all connected user IDs
const userIds = webSocketService.getConnectedUserIds();
```

## Configuration

### CORS Settings

The WebSocket service is configured with CORS:

```typescript
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*", // Configure based on your frontend URL
    methods: ["GET", "POST"],
  },
});
```

### Production Considerations

1. **CORS Configuration**: Update `origin` to your specific frontend domain
2. **Authentication**: Ensure Firebase Admin SDK is properly configured
3. **Scaling**: Consider using Redis adapter for multiple server instances
4. **Monitoring**: Implement connection monitoring and logging
5. **Rate Limiting**: Consider implementing rate limiting for WebSocket events

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Verify Firebase ID token is valid and not expired
   - Check token format and Firebase configuration

2. **Connection Issues**
   - Verify server is running and WebSocket port is accessible
   - Check CORS configuration matches your frontend domain

3. **Missing Notifications**
   - Ensure user is joined to appropriate rooms
   - Verify notification events are being emitted correctly

4. **Performance Issues**
   - Monitor connection count and memory usage
   - Consider implementing connection limits

### Debug Endpoints

Use the connection info endpoint for debugging:

```bash
GET /api/notifications/connection-info
```

Response:
```json
{
  "connectedUsers": 5,
  "connectedUserIds": ["user-1", "user-2", "user-3", "user-4", "user-5"]
}
```

## Security Considerations

1. **Authentication**: All WebSocket connections require valid Firebase ID tokens
2. **Room Access**: Users can only join rooms they have access to
3. **Data Validation**: All notification data is validated before sending
4. **Rate Limiting**: Consider implementing rate limiting for WebSocket events
5. **CORS**: Configure CORS appropriately for production

## Performance Considerations

1. **Connection Limits**: Monitor and limit concurrent connections
2. **Room Management**: Efficiently manage room memberships
3. **Event Batching**: Consider batching multiple notifications
4. **Memory Usage**: Monitor memory usage with large numbers of connections
5. **Database Queries**: Optimize notification count queries

---

This documentation provides a comprehensive guide for implementing and using the WebSocket notification service. For additional support or questions, refer to the source code or contact the development team.

# Activity Log Reply WebSocket Integration Guide

## Overview

The Activity Log Reply system provides real-time chat functionality using WebSockets (Socket.IO). Users can receive instant updates when replies are added or deleted to activity logs, creating a seamless chat-like experience for task discussions.

**Note**: Admin users have full access to all replies - they can view, add, and delete any reply regardless of ownership.

## Architecture

### Components

1. **WebSocketService** - Manages WebSocket connections and room-based messaging
2. **ActivityLogReplyEventService** - Event emitter that handles reply events
3. **ActivityLogReplyService** - Business logic for reply operations
4. **ActivityLogReplyRepo** - Database persistence layer for replies

### Flow

```
Reply Created/Deleted → ActivityLogReplyService → Database Storage → ActivityLogReplyEventService → WebSocketService → Client
```

**Important**: Replies are **always saved to the database first**, regardless of WebSocket connection status. This ensures:
- Offline users receive replies when they reconnect
- Replies persist even if WebSocket service is temporarily unavailable
- Users can access reply history via REST API

## Connection Setup

### Server Configuration

The WebSocket service is already initialized in `server.ts`:

```typescript
const webSocketService = new WebSocketService(httpServer);
ActivityLogReplyEventService.setWebSocketService(webSocketService);
```

### Client Connection

Connect to the WebSocket server using Socket.IO client:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
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
4. User can join activity log rooms for real-time updates

## Data Types

### IActivityLogReplyResponse Interface

```typescript
interface IActivityLogReplyResponse {
  id: string;                                    // Unique reply ID
  activityLogId: string;                         // ID of the activity log
  entityType: 'task' | 'project' | 'user' | 'calendarEvent';
  message: string;                               // Reply message text
  createdAt: Date;                                // Creation timestamp
  createdByUser: IUserResponse | null;          // User who created the reply
  fileAttachments?: IActivityLogReplyFileAttachment[]; // Array of file attachments
  linkAttachment?: IActivityLogReplyLinkAttachment;   // Optional link attachment
  created: Date;
  updated?: Date;
}
```

### IActivityLogReplyFileAttachment Interface

```typescript
interface IActivityLogReplyFileAttachment {
  fileName: string;        // Generated filename
  originalName: string;    // Original filename
  fileSize: number;        // Size in bytes
  mimeType: string;        // MIME type (e.g., 'image/jpeg', 'application/pdf')
  uploadDate: Date;        // Upload timestamp
  uploadedBy: string;     // User ID who uploaded
  fileUrl: string;        // URL to access the file
}
```

### IActivityLogReplyLinkAttachment Interface

```typescript
interface IActivityLogReplyLinkAttachment {
  url: string;            // Link URL
  title?: string;         // Optional title
  description?: string;   // Optional description
  thumbnailUrl?: string;  // Optional thumbnail URL
  addedBy: string;        // User ID who added the link
  addedDate: Date;        // Date when link was added
}
```

## WebSocket Events

### Client → Server Events

#### Join Activity Log Room

**Event**: `join_activity_log`

**Description**: Join a room to receive real-time updates for a specific activity log.

**Payload**:
```typescript
{
  entityType: 'task' | 'project' | 'user' | 'calendarEvent';
  activityLogId: string;
}
```

**Example**:
```javascript
socket.emit('join_activity_log', {
  entityType: 'task',
  activityLogId: 'log_abc123'
});
```

#### Leave Activity Log Room

**Event**: `leave_activity_log`

**Description**: Leave a room to stop receiving updates for a specific activity log.

**Payload**:
```typescript
{
  entityType: 'task' | 'project' | 'user' | 'calendarEvent';
  activityLogId: string;
}
```

**Example**:
```javascript
socket.emit('leave_activity_log', {
  entityType: 'task',
  activityLogId: 'log_abc123'
});
```

#### Add Activity Log Reply

**Event**: `add_activity_log_reply`

**Description**: Add a new reply to an activity log via WebSocket. This is the primary method for adding replies.

**Payload**:
```typescript
{
  entityType: 'task' | 'project' | 'user' | 'calendarEvent';
  activityLogId: string;
  message: string; // Required: Reply message text
  linkAttachment?: { // Optional: Link attachment
    url: string;
    title?: string;
    description?: string;
    thumbnailUrl?: string;
  };
}
```

**Note**: File attachments are not supported via WebSocket. Use REST API for file uploads.

**Example**:
```javascript
// Add a text-only reply
socket.emit('add_activity_log_reply', {
  entityType: 'task',
  activityLogId: 'log_abc123',
  message: 'Great progress! Let me know if you need help.'
});

// Add a reply with a link
socket.emit('add_activity_log_reply', {
  entityType: 'task',
  activityLogId: 'log_abc123',
  message: 'Check out this resource:',
  linkAttachment: {
    url: 'https://example.com/resource',
    title: 'Useful Resource',
    description: 'A helpful article about the topic'
  }
});
```

**Response Events**:
- `activity_log_reply_success` - Emitted to the sender when reply is successfully created
  - Payload: `IActivityLogReplyResponse` (the created reply with user info)
- `activity_log_reply_error` - Emitted when reply creation fails
  - Payload: `{ error: string }`

### Server → Client Events

#### Reply Creation Success

**Event**: `activity_log_reply_success`

**Description**: Emitted to the sender when their reply is successfully created via WebSocket.

**Payload**: `IActivityLogReplyResponse`

**Example**:
```javascript
socket.on('activity_log_reply_success', (reply) => {
  console.log('Reply created successfully:', reply);
  // Update UI optimistically
});
```

#### Reply Creation Error

**Event**: `activity_log_reply_error`

**Description**: Emitted when reply creation fails.

**Payload**: `{ error: string }`

**Example**:
```javascript
socket.on('activity_log_reply_error', ({ error }) => {
  console.error('Failed to create reply:', error);
  // Show error message to user
});
```

#### New Reply Created

**Event**: `activity_log_reply`

**Description**: Emitted when a new reply is added to an activity log.

**Payload**: `IActivityLogReplyResponse`

**Example Payload**:
```json
{
  "id": "reply_xyz789",
  "activityLogId": "log_abc123",
  "entityType": "task",
  "message": "Great progress! Let me know if you need help.",
  "createdAt": "2025-01-15T14:30:00.000Z",
  "createdByUser": {
    "id": "user_456",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "Standard",
    "designation": "Developer"
  },
  "fileAttachments": [
    {
      "fileName": "1234567890_abc123_screenshot.png",
      "originalName": "screenshot.png",
      "fileSize": 245760,
      "mimeType": "image/png",
      "uploadDate": "2025-01-15T14:30:00.000Z",
      "uploadedBy": "user_456",
      "fileUrl": "/uploads/tasks/1234567890_abc123_screenshot.png"
    }
  ],
  "linkAttachment": null,
  "created": "2025-01-15T14:30:00.000Z",
  "updated": null
}
```

#### Reply Deleted

**Event**: `activity_log_reply_deleted`

**Description**: Emitted when a reply is deleted from an activity log.

**Payload**:
```typescript
{
  replyId: string;
  activityLogId: string;
  entityType: 'task' | 'project' | 'user' | 'calendarEvent';
}
```

**Example Payload**:
```json
{
  "replyId": "reply_xyz789",
  "activityLogId": "log_abc123",
  "entityType": "task"
}
```

## Room Management

### Activity Log Rooms

Users must explicitly join activity log rooms to receive real-time updates:

- **Room name format**: `activity_log_{entityType}_{activityLogId}`
- **Example**: `activity_log_task_log_abc123`
- **Purpose**: Receive real-time updates for a specific activity log
- **Manual join/leave required**

### Room Usage Examples

```javascript
// Join an activity log room to receive real-time replies
socket.emit('join_activity_log', {
  entityType: 'task',
  activityLogId: 'log_abc123'
});

// Leave an activity log room when no longer viewing
socket.emit('leave_activity_log', {
  entityType: 'task',
  activityLogId: 'log_abc123'
});
```

## REST API Integration

The WebSocket service works alongside the existing REST API. All REST endpoints remain available:

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/activity-logs/:entityType/:activityLogId/replies` | Add a reply (supports multiple files) |
| GET | `/api/activity-logs/:entityType/:activityLogId/replies` | Get all replies for an activity log |
| GET | `/api/activity-logs/:entityType/:activityLogId/replies/:replyId` | Get one reply by ID |
| DELETE | `/api/activity-logs/:entityType/:activityLogId/replies/:replyId` | Delete a reply |

### WebSocket + REST Integration

The system provides both REST API and WebSocket capabilities:

#### Database-First Approach
All replies are **always saved to the database first**, then WebSocket events are emitted for real-time delivery. This ensures:

- **Offline Users**: Replies are saved and available when they reconnect
- **Connection Issues**: Replies persist even if WebSocket fails
- **Reliability**: No replies are lost due to network issues

#### Event Flow
When using REST endpoints, WebSocket events are automatically triggered:

- **Add reply**: Triggers `activity_log_reply` event
- **Delete reply**: Triggers `activity_log_reply_deleted` event

#### Hybrid Usage
Users can:
1. **Real-time**: Receive instant replies via WebSocket when connected
2. **Historical**: Fetch all replies via REST API (`GET /api/activity-logs/:entityType/:activityLogId/replies`)
3. **Offline**: Access replies when WebSocket is unavailable

## Client Integration Examples

### Basic Setup

```javascript
import { io } from 'socket.io-client';

class ActivityLogReplyClient {
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

  // Join an activity log room
  joinActivityLog(entityType, activityLogId) {
    this.socket.emit('join_activity_log', {
      entityType,
      activityLogId
    });
  }

  // Leave an activity log room
  leaveActivityLog(entityType, activityLogId) {
    this.socket.emit('leave_activity_log', {
      entityType,
      activityLogId
    });
  }

  setupEventListeners() {
    // Connection events
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // New reply received
    this.socket.on('activity_log_reply', (reply) => {
      this.handleNewReply(reply);
    });

    // Reply deleted
    this.socket.on('activity_log_reply_deleted', (data) => {
      this.handleReplyDeleted(data);
    });

    // Connection errors
    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
    });

    this.socket.on('activity_log_reply_success', (reply) => {
      console.log('Reply sent successfully:', reply);
    });

    this.socket.on('activity_log_reply_error', ({ error }) => {
      console.error('Failed to send reply:', error);
      this.showError(error);
    });
  }

  // Add reply via WebSocket
  addReply(entityType, activityLogId, message, linkAttachment) {
    this.socket.emit('add_activity_log_reply', {
      entityType,
      activityLogId,
      message,
      linkAttachment,
    });
  }

  handleNewReply(reply) {
    // Add reply to UI
    console.log('New reply received:', reply);
    this.addReplyToUI(reply);
  }

  handleReplyDeleted(data) {
    // Remove reply from UI
    console.log('Reply deleted:', data.replyId);
    this.removeReplyFromUI(data.replyId);
  }

  showError(error) {
    // Implementation for showing error message
    console.error('Error:', error);
  }

  addReplyToUI(reply) {
    // Your UI update logic here
    // Example: Add to a reply list or chat window
  }

  removeReplyFromUI(replyId) {
    // Your UI update logic here
    // Example: Remove from reply list
  }
}

// Usage
const replyClient = new ActivityLogReplyClient(
  'http://localhost:3000',
  'your-firebase-id-token'
);

replyClient.connect();
```

### React Example

```jsx
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function ActivityLogReplies({ entityType, activityLogId, authToken }) {
  const [replies, setReplies] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to WebSocket
    const newSocket = io('http://localhost:3000', {
      auth: { token: authToken }
    });

    // Join activity log room
    newSocket.emit('join_activity_log', {
      entityType,
      activityLogId
    });

    // Listen for new replies
    newSocket.on('activity_log_reply', (reply) => {
      setReplies(prev => [...prev, reply]);
    });

    // Listen for deleted replies
    newSocket.on('activity_log_reply_deleted', ({ replyId }) => {
      setReplies(prev => prev.filter(r => r.id !== replyId));
    });

    // Listen for reply creation success
    newSocket.on('activity_log_reply_success', (reply) => {
      // Reply already added via 'activity_log_reply' event
      // This can be used for optimistic UI updates
      console.log('Reply sent successfully:', reply);
    });

    // Listen for reply creation errors
    newSocket.on('activity_log_reply_error', ({ error }) => {
      console.error('Failed to send reply:', error);
      // Show error notification
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.emit('leave_activity_log', {
        entityType,
        activityLogId
      });
      newSocket.disconnect();
    };
  }, [entityType, activityLogId, authToken]);

  // Fetch initial replies via REST API
  useEffect(() => {
    fetch(`/api/activity-logs/${entityType}/${activityLogId}/replies`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then(res => res.json())
      .then(data => setReplies(data.replies))
      .catch(err => console.error('Failed to fetch replies:', err));
  }, [entityType, activityLogId, authToken]);

  return (
    <div className="activity-log-replies">
      {replies.map(reply => (
        <div key={reply.id} className="reply">
          <div className="reply-author">
            {reply.createdByUser?.name || 'Unknown User'}
          </div>
          <div className="reply-message">{reply.message}</div>
          <div className="reply-time">
            {new Date(reply.createdAt).toLocaleString()}
          </div>
          {reply.fileAttachments && reply.fileAttachments.length > 0 && (
            <div className="reply-files">
              {reply.fileAttachments.map((file, index) => (
                <a
                  key={index}
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.originalName}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Vue.js Example

```vue
<template>
  <div class="activity-log-replies">
    <div v-for="reply in replies" :key="reply.id" class="reply">
      <div class="reply-author">
        {{ reply.createdByUser?.name || 'Unknown User' }}
      </div>
      <div class="reply-message">{{ reply.message }}</div>
      <div class="reply-time">
        {{ formatDate(reply.createdAt) }}
      </div>
      <div v-if="reply.fileAttachments?.length" class="reply-files">
        <a
          v-for="(file, index) in reply.fileAttachments"
          :key="index"
          :href="file.fileUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ file.originalName }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';

export default {
  props: {
    entityType: String,
    activityLogId: String,
    authToken: String
  },
  setup(props) {
    const replies = ref([]);
    let socket = null;

    onMounted(() => {
      // Connect to WebSocket
      socket = io('http://localhost:3000', {
        auth: { token: props.authToken }
      });

      // Join activity log room
      socket.emit('join_activity_log', {
        entityType: props.entityType,
        activityLogId: props.activityLogId
      });

      // Listen for new replies
      socket.on('activity_log_reply', (reply) => {
        replies.value.push(reply);
      });

      // Listen for deleted replies
      socket.on('activity_log_reply_deleted', ({ replyId }) => {
        replies.value = replies.value.filter(r => r.id !== replyId);
      });

      // Fetch initial replies via REST API
      fetch(`/api/activity-logs/${props.entityType}/${props.activityLogId}/replies`, {
        headers: {
          'Authorization': `Bearer ${props.authToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          replies.value = data.replies;
        })
        .catch(err => console.error('Failed to fetch replies:', err));
    });

    onUnmounted(() => {
      if (socket) {
        socket.emit('leave_activity_log', {
          entityType: props.entityType,
          activityLogId: props.activityLogId
        });
        socket.disconnect();
      }
    });

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString();
    };

    return {
      replies,
      formatDate
    };
  }
};
</script>
```

### Adding a Reply via WebSocket

```javascript
// Basic text reply
socket.emit('add_activity_log_reply', {
  entityType: 'task',
  activityLogId: 'log_abc123',
  message: 'This is a reply sent via WebSocket!'
});

// Reply with link
socket.emit('add_activity_log_reply', {
  entityType: 'task',
  activityLogId: 'log_abc123',
  message: 'Check out this resource:',
  linkAttachment: {
    url: 'https://example.com',
    title: 'Example Resource',
    description: 'A helpful resource'
  }
});

// Handle success
socket.on('activity_log_reply_success', (reply) => {
  console.log('Reply created:', reply);
  // The reply will also be broadcast via 'activity_log_reply' event
});

// Handle errors
socket.on('activity_log_reply_error', ({ error }) => {
  console.error('Error:', error);
  alert('Failed to send reply: ' + error);
});
```

### Adding a Reply with File Upload (REST API)

**Note**: File uploads must use REST API as WebSocket doesn't support binary file transfers efficiently. After uploading, you can optionally send a reply via WebSocket referencing the uploaded file.

```javascript
async function addReplyWithFiles(entityType, activityLogId, message, files, authToken) {
  const formData = new FormData();
  formData.append('message', message);
  
  // Add multiple files
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch(
    `/api/activity-logs/${entityType}/${activityLogId}/replies`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error('Failed to add reply');
  }

  // Reply will be automatically received via WebSocket
  // But you can also get the response
  const data = await response.json();
  return data.reply;
}

// Usage
const files = document.querySelector('#file-input').files;
await addReplyWithFiles('task', 'log_abc123', 'Check out these files!', files, authToken);
```

## Error Handling

### Connection Errors

```javascript
socket.on('connect_error', (error) => {
  console.error('Connection failed:', error.message);
  // Handle authentication errors, network issues, etc.
  // Fallback to REST API polling
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
  // Rejoin activity log rooms if needed
  socket.emit('join_activity_log', {
    entityType: 'task',
    activityLogId: 'log_abc123'
  });
});

socket.on('reconnect_error', (error) => {
  console.error('Reconnection failed:', error);
});
```

### Handling Offline/Online Scenarios

```javascript
class ActivityLogReplyClient {
  constructor(serverUrl, firebaseToken) {
    this.socket = io(serverUrl, {
      auth: { token: firebaseToken },
      autoConnect: false
    });
    
    this.setupOfflineHandling();
  }

  setupOfflineHandling() {
    // Handle offline scenarios
    this.socket.on('disconnect', () => {
      console.log('Disconnected - replies will be saved to database');
      // Replies continue to be saved to database
      // User can fetch them via REST API
      this.startPolling(); // Fallback to REST API polling
    });

    this.socket.on('reconnect', () => {
      console.log('Reconnected - fetching missed replies');
      this.stopPolling();
      // Optionally fetch replies that may have been missed
      this.fetchMissedReplies();
    });
  }

  async fetchMissedReplies() {
    try {
      const response = await fetch(
        `/api/activity-logs/task/log_abc123/replies`,
        {
          headers: {
            'Authorization': `Bearer ${this.authToken}`
          }
        }
      );
      const data = await response.json();
      // Process any replies that were missed while offline
      data.replies.forEach(reply => {
        this.handleNewReply(reply);
      });
    } catch (error) {
      console.error('Failed to fetch missed replies:', error);
    }
  }
}
```

## Best Practices

### 1. Join Rooms Only When Needed

Only join activity log rooms when the user is actively viewing that activity log:

```javascript
// When user opens activity log details
onActivityLogOpen(activityLogId) {
  socket.emit('join_activity_log', {
    entityType: 'task',
    activityLogId
  });
}

// When user closes activity log details
onActivityLogClose(activityLogId) {
  socket.emit('leave_activity_log', {
    entityType: 'task',
    activityLogId
  });
}
```

### 2. Combine REST and WebSocket

Use REST API for initial data load and WebSocket for real-time updates:

```javascript
// Initial load via REST
const replies = await fetchReplies(entityType, activityLogId);

// Then join WebSocket room for real-time updates
socket.emit('join_activity_log', { entityType, activityLogId });
```

### 3. Handle File Attachments

Display file attachments appropriately:

```javascript
function renderFileAttachment(file) {
  if (file.mimeType.startsWith('image/')) {
    return <img src={file.fileUrl} alt={file.originalName} />;
  } else {
    return (
      <a href={file.fileUrl} download={file.originalName}>
        {file.originalName} ({(file.fileSize / 1024).toFixed(2)} KB)
      </a>
    );
  }
}
```

### 4. Optimistic UI Updates

For better UX, update UI optimistically before server confirmation:

```javascript
async function addReply(message) {
  // Optimistic update
  const tempReply = {
    id: `temp_${Date.now()}`,
    message,
    createdAt: new Date(),
    createdByUser: currentUser
  };
  setReplies(prev => [...prev, tempReply]);

  try {
    // Send to server
    await fetch('/api/activity-logs/...', { ... });
    // Real reply will come via WebSocket and replace temp
  } catch (error) {
    // Remove temp reply on error
    setReplies(prev => prev.filter(r => r.id !== tempReply.id));
    showError('Failed to send reply');
  }
}
```

## Configuration

### CORS Settings

The WebSocket service is configured with CORS. Update the origin in `WebSocketService.ts` for production:

```typescript
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "https://your-frontend-domain.com",
    methods: ["GET", "POST"],
  },
});
```

## Troubleshooting

### Common Issues

1. **Not Receiving Replies**
   - Verify you've joined the activity log room
   - Check that entityType and activityLogId match
   - Ensure WebSocket connection is active

2. **Authentication Failures**
   - Verify Firebase ID token is valid and not expired
   - Check token format and Firebase configuration

3. **Connection Issues**
   - Verify server is running and WebSocket port is accessible
   - Check CORS configuration matches your frontend domain

4. **Missing Replies**
   - Use REST API to fetch all replies as fallback
   - Check if replies were created before joining the room

## Security Considerations

1. **Authentication**: All WebSocket connections require valid Firebase ID tokens
2. **Room Access**: Users can only join rooms for activity logs they have access to (enforced by your backend)
3. **Data Validation**: All reply data is validated before sending
4. **CORS**: Configure CORS appropriately for production
5. **Admin Access**: **Admin users have full access** - they can:
   - View all replies for any activity log
   - Add replies to any activity log
   - Delete any reply (even if they didn't create it)
   - Access all activity log rooms via WebSocket

## Performance Considerations

1. **Room Management**: Only join rooms when actively viewing activity logs
2. **Connection Limits**: Monitor and limit concurrent connections
3. **Memory Usage**: Leave rooms when not needed to free up resources
4. **File Uploads**: Use appropriate file size limits (default: 10MB per file, max 10 files)

---

This documentation provides a comprehensive guide for implementing Activity Log Reply WebSocket functionality. For additional support, refer to the source code or contact the development team.


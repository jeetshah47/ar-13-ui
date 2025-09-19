# Real-Time Notification Service

This implementation provides a comprehensive real-time notification system using WebSockets, following the architecture described in `websocket-service.md`.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Components    │    │   Context        │    │   Services      │
│                 │    │                  │    │                 │
│ • Header        │───▶│ NotificationContext│───▶│ WebSocketClient │
│ • NotificationModal│  │                  │    │ NotificationService│
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## File Structure

```
src/services/websocket/
├── types.ts                    # TypeScript interfaces and enums
├── WebSocketClient.ts          # WebSocket client implementation
├── NotificationService.ts       # API service layer
├── MockNotificationService.ts   # Mock service for demo/testing
└── README.md                   # This documentation

src/contexts/
└── NotificationContext.tsx      # React context and hooks

src/common/components/
├── Header/Header.tsx           # Updated with real-time count
└── NotificationModal/          # Updated with real-time data
    ├── NotificationModal.tsx
    └── index.ts
```

## Features Implemented

### ✅ Real-Time Notifications
- **WebSocket Connection**: Automatic connection with Firebase auth
- **Live Updates**: Notifications appear instantly without page refresh
- **Connection Status**: Visual indicators for connection state
- **Auto-Reconnection**: Handles network interruptions gracefully

### ✅ Notification Management
- **Mark as Read**: Click notifications to mark as read
- **Mark All as Read**: Bulk action for all notifications
- **Delete Notifications**: Remove individual notifications
- **Real-Time Count**: Badge updates automatically

### ✅ User Experience
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages with retry
- **Empty States**: Helpful messages when no notifications exist
- **Responsive Design**: Works on all screen sizes

### ✅ Demo Features
- **Mock Data**: Pre-populated with sample notifications
- **Simulation**: Auto-generates new notifications every 30 seconds
- **Interactive**: All actions work in demo mode

## Usage

### 1. Provider Setup

The `NotificationProvider` is already set up in `VerticalLayout.tsx`:

```tsx
<NotificationProvider>
  {/* Your app content */}
</NotificationProvider>
```

### 2. Using Notifications in Components

```tsx
import { useNotifications, useNotificationCount } from '../../../contexts/NotificationContext';

const MyComponent = () => {
  const { notifications, markAsRead, isLoading } = useNotifications();
  const { unread } = useNotificationCount();
  
  // Use notifications data
};
```

### 3. WebSocket Configuration

Update the configuration in `NotificationContext.tsx`:

```tsx
const NotificationProvider = ({
  userId = 'actual-user-id',           // Replace with real user ID
  firebaseToken = 'actual-token',      // Replace with real Firebase token
  websocketUrl = 'ws://your-server'   // Replace with real WebSocket URL
}) => {
  // ...
};
```

## API Integration

### Replace Mock Service

To connect to real backend, update `NotificationService.ts`:

```typescript
// Replace mock calls with actual API calls
async getAllNotifications(userId: string): Promise<INotification[]> {
  const response = await fetch(`${this.baseUrl}/all/${userId}`);
  return response.json();
}
```

### WebSocket Events

The service listens for these WebSocket events:

- `notification` - Individual user notifications
- `project_notification` - Project-specific notifications  
- `global_notification` - System-wide notifications
- `notification_count` - Real-time count updates

## Notification Types

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

## Testing

### Demo Mode
- Mock notifications are pre-loaded
- New notifications appear every 30 seconds
- All interactions work without backend

### Manual Testing
1. Click the bell icon to open notifications
2. Click notifications to mark as read
3. Use "Mark all as read" button
4. Watch badge count update in real-time

## Production Considerations

### Security
- Replace mock Firebase token with real authentication
- Implement proper CORS configuration
- Add rate limiting for WebSocket events

### Performance
- Monitor connection count and memory usage
- Consider Redis adapter for multiple server instances
- Implement connection limits

### Monitoring
- Add connection monitoring and logging
- Implement health checks for WebSocket service
- Monitor notification delivery success rates

## Troubleshooting

### Common Issues

1. **Notifications not appearing**
   - Check WebSocket connection status
   - Verify user is authenticated
   - Check browser console for errors

2. **Badge count not updating**
   - Ensure `useNotificationCount` hook is used
   - Check if notifications are being marked as read

3. **Connection errors**
   - Verify WebSocket server is running
   - Check Firebase token validity
   - Ensure CORS is configured correctly

### Debug Mode

Enable debug logging by setting:
```typescript
// In WebSocketClient.ts
console.log('WebSocket events:', event, data);
```

## Future Enhancements

- [ ] Push notifications for mobile
- [ ] Notification preferences/settings
- [ ] Rich notification content (images, actions)
- [ ] Notification history and search
- [ ] Bulk operations (delete multiple)
- [ ] Notification categories/filtering
- [ ] Sound notifications
- [ ] Email notifications integration

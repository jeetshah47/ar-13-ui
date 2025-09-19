import React, { useState } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationTest: React.FC = () => {
  const { notifications, notificationCount, isConnected, isLoading, error, refreshNotifications } = useNotifications();
  const [testResult, setTestResult] = useState<string>('');

  const testBackendConnection = async () => {
    setTestResult('Testing backend connection...');
    
    try {
      await refreshNotifications();
      setTestResult(`✅ Backend connection successful! Found ${notifications.length} notifications, ${notificationCount.unread} unread.`);
    } catch (err) {
      setTestResult(`❌ Backend connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Notification Backend Test
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          WebSocket Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Loading: {isLoading ? '🔄 Yes' : '✅ No'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Notifications: {notifications.length} total, {notificationCount.unread} unread
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button 
        variant="contained" 
        onClick={testBackendConnection}
        disabled={isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading ? <CircularProgress size={20} /> : 'Test Backend Connection'}
      </Button>

      {testResult && (
        <Alert severity={testResult.includes('✅') ? 'success' : 'error'}>
          {testResult}
        </Alert>
      )}

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Current Notifications:
        </Typography>
        {notifications.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No notifications found
          </Typography>
        ) : (
          <Box>
            {notifications.slice(0, 5).map((notification) => (
              <Box key={notification.id} sx={{ mb: 1, p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight={notification.isRead ? 'normal' : 'bold'}>
                  {notification.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.message} • {notification.type}
                </Typography>
              </Box>
            ))}
            {notifications.length > 5 && (
              <Typography variant="caption" color="text.secondary">
                ... and {notifications.length - 5} more
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NotificationTest;

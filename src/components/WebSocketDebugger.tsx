import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert, Card, CardContent, Chip } from '@mui/material';
import { useNotifications } from '../contexts/NotificationContext';

const WebSocketDebugger: React.FC = () => {
  const { isConnected, error, notifications, notificationCount } = useNotifications();
  const [connectionLogs, setConnectionLogs] = useState<string[]>([]);
  const [authToken, setAuthToken] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthToken(token || 'No token found');
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConnectionLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testConnection = () => {
    addLog('Testing SSE connection...');
    addLog(`Auth Token: ${authToken ? 'Present' : 'Missing'}`);
    addLog(`Connection Status: ${isConnected ? 'Connected' : 'Disconnected'}`);
    addLog(`Error: ${error || 'None'}`);
    addLog(`Notifications: ${notifications.length} total, ${notificationCount.unread} unread`);
  };

  const clearLogs = () => {
    setConnectionLogs([]);
  };

  return (
    <Card sx={{ maxWidth: 800, margin: '20px auto', padding: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          SSE Connection Debugger
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Connection Status: 
            <Chip 
              label={isConnected ? 'Connected' : 'Disconnected'} 
              color={isConnected ? 'success' : 'error'} 
              size="small" 
              sx={{ ml: 1 }}
            />
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Auth Token: {authToken ? 'Present' : 'Missing'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Notifications: {notifications.length} total, {notificationCount.unread} unread
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={testConnection}
            sx={{ mr: 1 }}
          >
            Test Connection
          </Button>
          <Button 
            variant="outlined" 
            onClick={clearLogs}
          >
            Clear Logs
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Connection Logs:
          </Typography>
          <Box 
            sx={{ 
              backgroundColor: '#f5f5f5', 
              padding: 2, 
              borderRadius: 1, 
              maxHeight: 300, 
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}
          >
            {connectionLogs.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No logs yet. Click "Test Connection" to start debugging.
              </Typography>
            ) : (
              connectionLogs.map((log, index) => (
                <div key={index}>{log}</div>
              ))
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Troubleshooting Steps:
          </Typography>
          <Typography variant="body2" component="div">
            1. Check if backend server is running on localhost:3000<br/>
            2. Verify JWT token is present in localStorage (authToken)<br/>
            3. Check browser console for SSE errors<br/>
            4. Ensure backend has SSE endpoint configured at /api/events<br/>
            5. Check CORS settings on backend<br/>
            6. Verify JWT token is valid and not expired<br/>
            7. Check if user is properly authenticated (token in query parameter)<br/>
            8. Note: Server automatically extracts user ID from JWT token and handles user routing
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WebSocketDebugger;

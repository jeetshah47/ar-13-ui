# Task Claim API Documentation

This document provides comprehensive documentation for the Task Claim API endpoint that allows users to claim tasks from projects they are part of.

## Overview

The Task Claim API allows authenticated users to claim tasks from projects they are members of. When a user claims a task, they are automatically added to the task's assignee list if not already assigned. The system validates that the user is part of the project (either as owner or member) before allowing the claim operation.

## Base URL

All Task API endpoints are prefixed with:
```
/api/tasks
```

## Authentication

The Task Claim API requires:
- **Authentication**: Valid Firebase authentication token
- **Authorization**: User must be part of the project (owner or member)

### Headers Required

```http
Authorization: Bearer <firebase_token>
Content-Type: application/json
```

## Endpoint

### Claim Task

Allows a user to claim a task from a project they are part of.

#### Endpoint
```http
PUT /api/tasks/claim/:projectId/:taskId
```

#### Access Control
- **Authentication**: Required
- **Project Membership**: User must be either:
  - Project owner (`ownerId`)
  - Project member (in `membersIds` array)

#### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | string | Yes | The unique identifier of the project |
| `taskId` | string | Yes | The unique identifier of the task |

#### Request Body

No request body is required. The user ID is automatically extracted from the authentication token.

#### Response

**Success Response (200 OK)**
```json
{
  "message": "Task claimed successfully"
}
```

**Error Responses**

| Status Code | Description | Response Body |
|-------------|-------------|---------------|
| 401 | Unauthorized - Missing or invalid auth token | `{ "message": "Auth token missing" }` or `{ "message": "Invalid auth token" }` |
| 403 | Forbidden - User is not part of the project | `{ "error": "User is not part of this project" }` |
| 404 | Not Found - Task or project not found | `{ "error": "Task not found" }` or `{ "error": "Project not found" }` or `{ "error": "User not found" }` |

#### Behavior

When a user successfully claims a task:
1. The user is added to the task's `assignTo` array (if not already present)
2. An activity log entry is created with type `task_assigned` and description "Claimed task by [username]"
3. A notification is sent to the user who claimed the task

**Note**: If the user is already assigned to the task, the operation still succeeds but no duplicate assignment occurs.

## Client Implementation Examples

### JavaScript/TypeScript (Fetch API)

```typescript
/**
 * Claim a task from a project
 * @param projectId - The project ID
 * @param taskId - The task ID
 * @param firebaseToken - Firebase authentication token
 * @returns Promise resolving to the response
 */
async function claimTask(
  projectId: string,
  taskId: string,
  firebaseToken: string
): Promise<{ message: string }> {
  const response = await fetch(
    `/api/tasks/claim/${projectId}/${taskId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.message || 'Failed to claim task');
  }

  return await response.json();
}

// Usage example
try {
  const result = await claimTask(
    'project-123',
    'task-456',
    userAuthToken
  );
  console.log('Success:', result.message);
  // Success: Task claimed successfully
} catch (error) {
  console.error('Error claiming task:', error.message);
}
```

### JavaScript/TypeScript (Axios)

```typescript
import axios from 'axios';

/**
 * Claim a task from a project using Axios
 */
async function claimTask(
  projectId: string,
  taskId: string,
  firebaseToken: string
): Promise<void> {
  try {
    const response = await axios.put(
      `/api/tasks/claim/${projectId}/${taskId}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${firebaseToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('Task claimed successfully:', response.data.message);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message;
      throw new Error(`Failed to claim task: ${errorMessage}`);
    }
    throw error;
  }
}

// Usage example
claimTask('project-123', 'task-456', userAuthToken)
  .then(() => {
    // Handle success - maybe refresh task list or show notification
    showNotification('Task claimed successfully!');
  })
  .catch((error) => {
    // Handle error
    showErrorNotification(error.message);
  });
```

### React Hook Example

```typescript
import { useState } from 'react';
import { useAuth } from './auth-context'; // Your auth context

interface UseClaimTaskResult {
  claimTask: (projectId: string, taskId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

function useClaimTask(): UseClaimTaskResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, getAuthToken } = useAuth();

  const claimTask = async (projectId: string, taskId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      
      const response = await fetch(
        `/api/tasks/claim/${projectId}/${taskId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to claim task');
      }

      const data = await response.json();
      console.log('Task claimed:', data.message);
      
      // Optionally trigger a refresh or update UI
      // onTaskClaimed?.(projectId, taskId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to claim task';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { claimTask, isLoading, error };
}

// Usage in component
function TaskCard({ task, projectId }: { task: Task; projectId: string }) {
  const { claimTask, isLoading, error } = useClaimTask();

  const handleClaim = async () => {
    try {
      await claimTask(projectId, task.id);
      // Show success message
      alert('Task claimed successfully!');
    } catch (err) {
      // Error is already set in the hook
      console.error('Failed to claim task:', err);
    }
  };

  return (
    <div>
      <h3>{task.subject}</h3>
      <button 
        onClick={handleClaim} 
        disabled={isLoading || task.assignTo.includes(userId)}
      >
        {isLoading ? 'Claiming...' : 'Claim Task'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### Error Handling Example

```typescript
async function claimTaskWithErrorHandling(
  projectId: string,
  taskId: string,
  firebaseToken: string
): Promise<void> {
  try {
    const response = await fetch(
      `/api/tasks/claim/${projectId}/${taskId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${firebaseToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      
      switch (response.status) {
        case 401:
          throw new Error('Authentication failed. Please log in again.');
        case 403:
          throw new Error('You are not part of this project.');
        case 404:
          throw new Error('Task or project not found.');
        default:
          throw new Error(errorData.error || errorData.message || 'Failed to claim task');
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
}
```

## Important Notes

### Project Membership Validation

The API validates that the user claiming the task is part of the project. A user is considered part of the project if:
- They are the project owner (`project.ownerId === userId`)
- They are listed in the project members (`project.membersIds.includes(userId)`)

### Idempotency

If a user is already assigned to the task, calling the claim endpoint again will:
- Return a success response (200 OK)
- Not create duplicate assignments
- Not create duplicate activity logs

### Activity Logging

Every successful claim operation creates an activity log entry:
- **Type**: `task_assigned`
- **Description**: "Claimed task by [username]"
- **Metadata**: Contains `claimedBy` (userId) and `userName`

### Notifications

When a task is claimed:
- A notification is created for the user who claimed the task
- The notification follows the standard task assignment notification format

### Related Endpoints

- `PUT /api/tasks/assign/:taskId/:userId` - Assign a task to another user (requires `tasks:assign` permission)
- `GET /api/tasks/all/details/:projectId` - Get all tasks with details
- `GET /api/tasks/detail/:projectId/:taskId` - Get a single task with full details

## Testing

### Manual Testing Example

```bash
# Claim a task using curl
curl -X PUT \
  http://localhost:3000/api/tasks/claim/project-123/task-456 \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json"

# Expected response:
# {
#   "message": "Task claimed successfully"
# }
```

### Test Scenarios

1. **Successful Claim**: User is part of project and task exists
2. **Already Assigned**: User is already in assignTo array
3. **User Not in Project**: User is not owner or member
4. **Task Not Found**: Invalid taskId
5. **Project Not Found**: Invalid projectId
6. **Unauthorized**: Missing or invalid token

## Best Practices

1. **Check Project Membership First**: Before showing the claim button, verify the user is part of the project
2. **Handle Errors Gracefully**: Display user-friendly error messages
3. **Update UI After Claim**: Refresh task details or assignment list after successful claim
4. **Show Loading State**: Display loading indicator while the request is in progress
5. **Disable Button if Already Assigned**: Prevent duplicate claims by checking if user is already assigned

## Troubleshooting

### Common Issues

1. **403 Forbidden Error**: User is not part of the project
   - Solution: Verify user's project membership before allowing claim

2. **401 Unauthorized Error**: Invalid or expired token
   - Solution: Refresh the authentication token

3. **404 Not Found Error**: Task or project doesn't exist
   - Solution: Verify taskId and projectId are correct

4. **Network Error**: API endpoint not reachable
   - Solution: Check API base URL and network connectivity


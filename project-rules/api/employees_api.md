# Employee API Documentation

This document provides comprehensive documentation for the Employee API endpoints that provide user lists with task counts categorized by status.

## Overview

The Employee API provides endpoints to retrieve employee information along with their task counts categorized by status (Backlog, In Progress, In Review). This is useful for project management, resource allocation, and performance tracking.

## Base URL

All Employee API endpoints are prefixed with:
```
/api/employees
```

## Authentication

All Employee API endpoints require:
- **Authentication**: Valid Firebase authentication token
- **Authorization**: Admin role only

### Headers Required

```http
Authorization: Bearer <firebase_token>
Content-Type: application/json
```

## Endpoints

### 1. Get All Employees with Task Counts

Retrieves a list of all employees with their task counts categorized by status.

#### Endpoint
```http
GET /api/employees/list
```

#### Access Control
- **Authentication**: Required
- **Role**: Admin only

#### Response

**Success Response (200 OK)**
```json
{
  "employees": [
    {
      "userId": "string",
      "name": "string",
      "email": "string",
      "role": "Admin" | "Standard",
      "designation": "string",
      "backlogTasks": "number",
      "tasksInProgress": "number",
      "tasksInReview": "number",
      "totalTasks": "number"
    }
  ],
  "totalEmployees": "number"
}
```

**Example Response**
```json
{
  "employees": [
    {
      "userId": "user_123456789",
      "name": "John Doe",
      "email": "john.doe@company.com",
      "role": "Standard",
      "designation": "Senior Developer",
      "backlogTasks": 5,
      "tasksInProgress": 3,
      "tasksInReview": 2,
      "totalTasks": 10
    },
    {
      "userId": "user_987654321",
      "name": "Jane Smith",
      "email": "jane.smith@company.com",
      "role": "Admin",
      "designation": "Project Manager",
      "backlogTasks": 2,
      "tasksInProgress": 1,
      "tasksInReview": 0,
      "totalTasks": 3
    }
  ],
  "totalEmployees": 2
}
```

#### Error Responses

**401 Unauthorized**
```json
{
  "message": "Auth token missing"
}
```

**403 Forbidden**
```json
{
  "message": "Admin access required"
}
```

**500 Internal Server Error**
```json
{
  "message": "Error fetching employee list",
  "error": "Detailed error message"
}
```

---

### 2. Get Specific Employee Task Counts

Retrieves task counts for a specific employee by their user ID.

#### Endpoint
```http
GET /api/employees/list/:userId
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | The unique identifier of the user |

#### Access Control
- **Authentication**: Required
- **Role**: Admin only

#### Response

**Success Response (200 OK)**
```json
{
  "employee": {
    "userId": "string",
    "name": "string",
    "email": "string",
    "role": "Admin" | "Standard",
    "designation": "string",
    "backlogTasks": "number",
    "tasksInProgress": "number",
    "tasksInReview": "number",
    "totalTasks": "number"
  }
}
```

**Example Response**
```json
{
  "employee": {
    "userId": "user_123456789",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "role": "Standard",
    "designation": "Senior Developer",
    "backlogTasks": 5,
    "tasksInProgress": 3,
    "tasksInReview": 2,
    "totalTasks": 10
  }
}
```

#### Error Responses

**401 Unauthorized**
```json
{
  "message": "Auth token missing"
}
```

**403 Forbidden**
```json
{
  "message": "Admin access required"
}
```

**404 Not Found**
```json
{
  "message": "Employee not found"
}
```

**500 Internal Server Error**
```json
{
  "message": "Error fetching employee task counts",
  "error": "Detailed error message"
}
```

## Data Models

### Employee Task Counts

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Unique identifier for the user |
| `name` | string | Full name of the employee |
| `email` | string | Email address of the employee |
| `role` | string | User role ("Admin" or "Standard") |
| `designation` | string | Job title/designation (optional) |
| `backlogTasks` | number | Number of tasks in backlog status |
| `tasksInProgress` | number | Number of tasks currently in progress |
| `tasksInReview` | number | Number of tasks in review/testing |
| `totalTasks` | number | Total number of assigned tasks |

## Task Status Categories

The API automatically categorizes tasks based on their status field:

### Backlog Tasks
Tasks with status:
- `to-do`
- `backlog`
- `todo`
- Any other status not matching the other categories

### Tasks In Progress
Tasks with status:
- `in progress`
- `in-progress`
- `progress`

### Tasks In Review
Tasks with status:
- `in review`
- `in-review`
- `review`
- `testing`

## Usage Examples

### JavaScript/TypeScript

```javascript
// Get all employees
const getAllEmployees = async () => {
  try {
    const response = await fetch('/api/employees/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Employees:', data.employees);
    console.log('Total employees:', data.totalEmployees);
    
    return data;
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
};

// Get specific employee
const getEmployeeById = async (userId) => {
  try {
    const response = await fetch(`/api/employees/list/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Employee:', data.employee);
    
    return data.employee;
  } catch (error) {
    console.error('Error fetching employee:', error);
  }
};
```

### cURL Examples

```bash
# Get all employees
curl -X GET "https://your-api-domain.com/api/employees/list" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json"

# Get specific employee
curl -X GET "https://your-api-domain.com/api/employees/list/user_123456789" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json"
```

### Python

```python
import requests

def get_all_employees(firebase_token):
    url = "https://your-api-domain.com/api/employees/list"
    headers = {
        "Authorization": f"Bearer {firebase_token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        return data['employees'], data['totalEmployees']
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None, None

def get_employee_by_id(user_id, firebase_token):
    url = f"https://your-api-domain.com/api/employees/list/{user_id}"
    headers = {
        "Authorization": f"Bearer {firebase_token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        return data['employee']
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None
```

## Rate Limiting

Currently, there are no specific rate limits implemented for the Employee API endpoints. However, it's recommended to:

- Implement reasonable caching on the client side
- Avoid making excessive requests in short time periods
- Consider implementing pagination for large employee lists in the future

## Performance Considerations

### Current Implementation
- The API fetches all projects and filters them in memory
- Task counts are calculated by querying each project's task collection
- Performance may degrade with large numbers of projects and users

### Recommendations
- Consider implementing database indexes on frequently queried fields
- Implement caching for frequently accessed data
- Consider pagination for large datasets
- Monitor performance and optimize queries as needed

## Security Considerations

1. **Authentication Required**: All endpoints require valid Firebase authentication
2. **Admin Only Access**: Only users with Admin role can access these endpoints
3. **Input Validation**: User IDs are validated before processing
4. **Error Handling**: Sensitive information is not exposed in error messages

## Future Enhancements

Potential improvements to consider:

1. **Pagination**: Add pagination support for large employee lists
2. **Filtering**: Add filters for role, department, or other criteria
3. **Sorting**: Add sorting options for different fields
4. **Caching**: Implement Redis or similar caching for better performance
5. **Real-time Updates**: Add WebSocket support for real-time task count updates
6. **Export Functionality**: Add CSV/Excel export capabilities
7. **Advanced Analytics**: Add more detailed task analytics and reporting

## Support

For technical support or questions about the Employee API:

1. Check the error messages in API responses
2. Verify authentication token validity
3. Ensure user has Admin role
4. Check network connectivity and API endpoint availability
5. Review server logs for detailed error information

## Changelog

### Version 1.0.0
- Initial release of Employee API
- Support for getting all employees with task counts
- Support for getting specific employee task counts
- Admin-only access control
- Firebase authentication integration

# Vacation API Implementation

This module provides a complete implementation for vacation request management, including API functions, Redux state management, and TypeScript types.

## Features

- Create vacation requests (vacation, sick leave, work remotely)
- Get all vacation requests
- Get vacation statistics
- Update request status (approve/reject)
- Full Redux state management with async actions

## API Endpoints

### Create Vacation Request
```
POST /api/vacation/create-request
```

**Request Body:**
```typescript
{
  requestType: "vacation" | "sick_leave" | "work_remotely";
  startDate: string; // ISO date format
  endDate?: string; // Optional for work_remotely
  duration: number;
  durationType: "days" | "hours";
  workingHours?: { // Required for work_remotely
    from: string;
    to: string;
  };
  comments: string;
}
```

**Response:**
```typescript
{
  message: string;
  request: VacationResponse;
}
```

### Get All Vacation Requests
```
GET /api/vacation/requests
```

**Response:**
```typescript
{
  requests: VacationResponse[];
}
```

### Get Vacation Statistics
```
GET /api/vacation/stats
```

**Response:**
```typescript
{
  stats: {
    vacationDays: number;
    sickLeaveDays: number;
    remoteWorkDays: number;
    totalRequests: number;
  };
}
```

### Update Request Status
```
PATCH /api/vacation/requests/{requestId}/status
```

**Request Body:**
```typescript
{
  status: "approved" | "rejected";
}
```

## Usage Examples

### Using the Hook
```typescript
import { useVacation } from '../store/hooks/useVacation';

const MyComponent = () => {
  const { 
    requests, 
    stats, 
    loading, 
    error, 
    createRequest, 
    getAllRequests 
  } = useVacation();

  const handleCreateRequest = async () => {
    const request = {
      requestType: 'vacation',
      startDate: '2024-01-15',
      endDate: '2024-01-17',
      duration: 3,
      durationType: 'days',
      comments: 'Family vacation'
    };
    
    await createRequest(request);
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {/* Your component content */}
    </div>
  );
};
```

### Using Redux Actions Directly
```typescript
import { useAppDispatch } from '../store/store';
import { createVacationRequestAction } from '../store/features/vacation/vacationActions';

const MyComponent = () => {
  const dispatch = useAppDispatch();

  const handleCreateRequest = async () => {
    const request = {
      requestType: 'work_remotely',
      startDate: '2024-01-10',
      duration: 4,
      durationType: 'hours',
      workingHours: {
        from: '9:00 AM',
        to: '1:00 PM'
      },
      comments: 'Doctor appointment in the afternoon'
    };
    
    try {
      await dispatch(createVacationRequestAction(request)).unwrap();
      console.log('Request created successfully!');
    } catch (error) {
      console.error('Failed to create request:', error);
    }
  };

  return (
    <button onClick={handleCreateRequest}>
      Create Request
    </button>
  );
};
```

## Types

### VacationRequest
```typescript
interface VacationRequest {
  requestType: "vacation" | "sick_leave" | "work_remotely";
  startDate: string;
  endDate?: string;
  duration: number;
  durationType: "days" | "hours";
  workingHours?: WorkingHours;
  comments: string;
}
```

### VacationResponse
```typescript
interface VacationResponse {
  id: string;
  requestType: RequestType;
  startDate: string;
  endDate?: string;
  duration: number;
  durationType: DurationType;
  workingHours?: WorkingHours;
  comments: string;
  status: "pending" | "approved" | "rejected";
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

## State Structure

```typescript
interface VacationState {
  requests: VacationResponse[];
  stats: VacationStats | null;
  loading: boolean;
  error: string | null;
}
```

## Files Structure

```
src/store/
├── apis/
│   └── vacationApis.ts          # API functions
├── features/vacation/
│   ├── vacationSlice.ts         # Redux slice
│   ├── vacationActions.ts       # Async actions
│   └── README.md               # This file
├── types/Vacation/
│   ├── VacationTypes.ts         # Core types
│   └── VacationResponse.ts      # Response types
└── hooks/
    └── useVacation.ts          # Custom hook
```

## Error Handling

All async actions include proper error handling and will update the Redux state with error messages. The `useVacation` hook provides access to the error state for easy error handling in components.

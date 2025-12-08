# Development Guide - AR-13 UI Project

Welcome to the AR-13 UI project! This comprehensive guide will help new developers understand the project structure, coding patterns, and best practices used throughout the codebase.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Coding Patterns & Conventions](#coding-patterns--conventions)
6. [Component Architecture](#component-architecture)
7. [State Management](#state-management)
8. [Styling Guidelines](#styling-guidelines)
9. [API Integration](#api-integration)
10. [Routing & Navigation](#routing--navigation)
11. [Authentication & Authorization](#authentication--authorization)
12. [WebSocket Integration](#websocket-integration)
13. [Testing Guidelines](#testing-guidelines)
14. [Best Practices](#best-practices)
15. [Common Patterns](#common-patterns)

## Project Overview

AR-13 UI is a comprehensive project management application built with React, TypeScript, and Material-UI. It provides features for project management, task tracking, employee management, calendar integration, and vacation tracking.

## Tech Stack

### Core Technologies
- **React 18.3.1** - Frontend framework
- **TypeScript 5.8.3** - Type safety and development experience
- **Vite 6.3.5** - Build tool and development server
- **Material-UI (MUI) 7.1.1** - UI component library
- **React Router 7.6.2** - Client-side routing

### State Management
- **Redux Toolkit 2.8.2** - State management
- **React Redux 9.2.0** - React bindings for Redux
- **Zustand 5.0.6** - Alternative state management (used selectively)

### Styling
- **Emotion** - CSS-in-JS styling
- **Styled Components 6.1.19** - Component styling
- **Material-UI Theme** - Custom theme system

### Form Management
- **Formik 2.4.6** - Form handling
- **Yup 1.7.0** - Form validation

### API & Communication
- **Axios 1.11.0** - HTTP client
- **Socket.io-client 4.8.1** - WebSocket communication
- **Firebase 12.0.0** - Backend services

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **Vite Plugin SVGR** - SVG as React components

## Project Structure

```
src/
├── assets/                 # Static assets (icons, images, illustrations)
├── common/                 # Shared components and utilities
│   ├── components/         # Reusable UI components
│   ├── layout/            # Layout components
│   └── ProtectedRoute/    # Route protection logic
├── components/            # Feature-specific components
├── config/               # Configuration files
├── contexts/             # React contexts
├── pages/                # Page components organized by feature
│   ├── Auth/             # Authentication pages
│   ├── Calendar/         # Calendar feature
│   ├── Dashboard/        # Dashboard feature
│   ├── Employees/        # Employee management
│   ├── Projects/         # Project management
│   └── Vacations/        # Vacation management
├── routes/               # Route definitions
├── services/             # External service integrations
├── store/                # Redux store configuration
│   ├── apis/             # API service functions
│   ├── features/         # Feature-specific slices
│   ├── hooks/            # Custom Redux hooks
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Store utilities
├── utils/                # General utilities
└── theme.tsx             # MUI theme configuration
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### Environment Setup
Create a `.env` file in the root directory with the following variables:
```
VITE_APP_API_KEY=your_firebase_api_key
VITE_APP_AUTHDOMAIN=your_firebase_auth_domain
VITE_APP_PROJECTID=your_firebase_project_id
VITE_APP_STORAGEBUCKET=your_firebase_storage_bucket
VITE_APP_MESSAGINGSENDERID=your_firebase_messaging_sender_id
VITE_APP_APPID=your_firebase_app_id
```

## Coding Patterns & Conventions

### TypeScript Conventions

#### Type Definitions
- Place all type definitions in dedicated files under `src/store/types/`
- Use PascalCase for interface names
- Use descriptive names that clearly indicate the purpose
- Group related types in the same file

```typescript
// Good
export interface UserResponse {
  id: string;
  name: string;
  email: string;
}

export interface UserErrorResponse {
  error: string;
}

// Bad
export interface User {
  id: string;
  name: string;
  email: string;
}
```

#### Component Props
- Always define props interfaces
- Use descriptive prop names
- Mark optional props with `?`
- Use union types for status/property variations

```typescript
interface TaskFormProps {
  projectId: string;
  onClose: () => void;
  isEditMode?: boolean;
  initialData?: TaskData;
}
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `TaskForm.tsx`, `UserProfile.tsx`)
- **Utilities**: camelCase (e.g., `dateUtils.ts`, `validationHelpers.ts`)
- **Types**: PascalCase (e.g., `UserTypes.ts`, `ProjectTypes.ts`)
- **Hooks**: camelCase starting with 'use' (e.g., `usePermissions.ts`)

### Import Organization
```typescript
// 1. React and external libraries
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';

// 2. Internal components and utilities
import Modal from '../../common/components/Modal/Modal';
import { useAppSelector } from '../../store/store';

// 3. Types (always last)
import type { TaskFormProps, TaskData } from './types';
```

## Component Architecture

### Component Structure Pattern

#### Functional Components with TypeScript
```typescript
import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';

interface ComponentProps {
  title: string;
  onAction: (data: any) => void;
  isVisible?: boolean;
}

const ComponentName: React.FC<ComponentProps> = ({ 
  title, 
  onAction, 
  isVisible = true 
}) => {
  const [localState, setLocalState] = useState<string>('');

  useEffect(() => {
    // Side effects
  }, []);

  const handleAction = () => {
    onAction(localState);
  };

  if (!isVisible) return null;

  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <Button onClick={handleAction}>Action</Button>
    </Box>
  );
};

export default ComponentName;
```

### Common Component Patterns

#### Modal Pattern
```typescript
const [showModal, setShowModal] = useState(false);

const handleCloseModal = () => {
  setShowModal(false);
};

const handleOpenModal = () => {
  setShowModal(true);
};

return (
  <>
    <Button onClick={handleOpenModal}>Open Modal</Button>
    <Modal onClose={handleCloseModal} show={showModal}>
      <ModalContent onClose={handleCloseModal} />
    </Modal>
  </>
);
```

#### Form Handling with Formik
```typescript
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const MyForm = () => {
  const initialValues = {
    name: '',
    email: '',
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await submitForm(values);
      toast.success('Form submitted successfully');
    } catch (error) {
      toast.error('Submission failed');
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <Field name="name" placeholder="Name" />
          {errors.name && touched.name && <div>{errors.name}</div>}
          
          <Field name="email" placeholder="Email" />
          {errors.email && touched.email && <div>{errors.email}</div>}
          
          <Button type="submit">Submit</Button>
        </Form>
      )}
    </Formik>
  );
};
```

## State Management

### Redux Toolkit Pattern

#### Slice Structure
```typescript
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FeatureState {
  api: {
    data: FeatureData[];
    error: string;
    loading: boolean;
  };
  common: {
    selectedId: string;
    filters: FilterState;
  };
}

const initialState: FeatureState = {
  api: {
    data: [],
    error: '',
    loading: false,
  },
  common: {
    selectedId: '',
    filters: {},
  },
};

const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    // Request actions
    getDataRequest(state) {
      state.api.loading = true;
      state.api.error = '';
    },
    
    // Success actions
    getDataSuccess(state, action: PayloadAction<{ data: FeatureData[] }>) {
      state.api.loading = false;
      state.api.data = action.payload.data;
    },
    
    // Error actions
    getDataFailed(state, action: PayloadAction<string>) {
      state.api.loading = false;
      state.api.error = action.payload;
    },
    
    // Common actions
    updateSelectedId(state, action: PayloadAction<string>) {
      state.common.selectedId = action.payload;
    },
  },
});

export const { 
  getDataRequest, 
  getDataSuccess, 
  getDataFailed,
  updateSelectedId 
} = featureSlice.actions;

export const featureReducer = featureSlice.reducer;
```

#### Using Redux in Components
```typescript
import { useAppSelector, useAppDispatch } from '../../store/store';
import { getDataRequest, updateSelectedId } from '../../store/features/feature/featureSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(state => state.featureReducer.api);
  const selectedId = useAppSelector(state => state.featureReducer.common.selectedId);

  const handleSelectItem = (id: string) => {
    dispatch(updateSelectedId(id));
  };

  useEffect(() => {
    dispatch(getDataRequest());
  }, [dispatch]);

  return (
    // Component JSX
  );
};
```

### Store Configuration
```typescript
// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './features/auth/authSlice';
import { projectListReducer } from './features/projects/projectSlice';
// ... other reducers

export const store = configureStore({
  reducer: {
    authReducer,
    projectListReducer,
    // ... other reducers
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
```

## Styling Guidelines

### Material-UI Theme System

#### Custom Theme Configuration
```typescript
// theme.tsx
import { createTheme } from '@mui/material';

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#3F8CFF',
    },
    secondary: {
      main: '#7D8592',
    },
  },
  typography: {
    allVariants: {
      fontFamily: '"Nunito Sans", sans-serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#3F8CFF',
          boxShadow: '0 6px 58px rgba(63, 140, 255, 0.26)',
          '&:hover': {
            backgroundColor: '#3F8CFF',
            boxShadow: '0 6px 12px rgba(63, 140, 255, 0.4)',
          },
          borderRadius: '12px',
          fontFamily: '"Nunito Sans", sans-serif',
        },
      },
    },
  },
});
```

### Styled Components Pattern
```typescript
import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '24px',
  boxShadow: '0px 6px 58px rgba(196, 203, 214, 0.103611)',
}));

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  backgroundColor: isActive 
    ? theme.palette.primary.main 
    : theme.palette.grey[100],
  color: isActive 
    ? theme.palette.primary.contrastText 
    : theme.palette.text.primary,
}));
```

### CSS-in-JS with Emotion
```typescript
import { Box } from '@mui/material';
import { keyframes } from '@mui/material';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedComponent = () => (
  <Box
    sx={{
      animation: `${fadeIn} 0.3s ease-in-out`,
      padding: '24px',
      borderRadius: '12px',
    }}
  >
    Content
  </Box>
);
```

## API Integration

### HTTP Client Configuration
```typescript
// config/http.ts
import Axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { store } from '../store/store';
import { authLogout } from '../store/features/auth/authSlice';

const http = Axios.create();

const updateHeaders = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const handleServerError = (error: AxiosError<{ message: string }>) => {
  if (error?.response?.status === 401) {
    store.dispatch(authLogout());
  }
  toast.error(error.response?.data?.message || 'An error occurred');
  return Promise.reject(error);
};

http.interceptors.request.use(updateHeaders);
http.interceptors.response.use(response => response, handleServerError);

export { http };
```

### API Service Functions
```typescript
// store/apis/featureApi.ts
import { http } from '../../config/http';
import type { FeatureResponse, FeatureRequest } from '../types/Feature';

export async function getAllFeatures(): Promise<{ features: FeatureResponse[] }> {
  const url = '/api/features/all';
  const result = await http.get(url);
  return result.data;
}

export async function addFeature(feature: FeatureRequest): Promise<FeatureResponse> {
  const url = '/api/features/add';
  const result = await http.post(url, feature);
  return result.data;
}

export async function updateFeature(id: string, feature: Partial<FeatureRequest>): Promise<FeatureResponse> {
  const url = `/api/features/${id}`;
  const result = await http.put(url, feature);
  return result.data;
}

export async function deleteFeature(id: string): Promise<{ message: string }> {
  const url = `/api/features/${id}`;
  const result = await http.delete(url);
  return result.data;
}
```

### Using API in Components
```typescript
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { getDataRequest, getDataSuccess, getDataFailed } from '../../store/features/feature/featureSlice';
import { getAllFeatures } from '../../store/apis/featureApi';

const FeatureComponent = () => {
  const dispatch = useAppDispatch();
  const { loading, data, error } = useAppSelector(state => state.featureReducer.api);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(getDataRequest());
      try {
        const response = await getAllFeatures();
        dispatch(getDataSuccess(response));
      } catch (error) {
        dispatch(getDataFailed(error.message));
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

## Routing & Navigation

### Route Configuration
```typescript
// routes/index.tsx
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ProjectPage from '../pages/Projects/ProjectPage';
// ... other imports

const authRoutes = [
  {
    path: '/dashboard',
    component: <DashboardPage />,
  },
  {
    path: '/projects/*',
    component: <ProjectPage />,
  },
  // ... other routes
];

const publicRoutes = [
  {
    path: '/auth/login',
    component: <SignIn />,
  },
  {
    path: '/auth/register',
    component: <SignUp />,
  },
];

export { authRoutes, publicRoutes };
```

### Protected Routes
```typescript
// common/ProtectedRoute/ProtectedRoute.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppSelector } from '../../store/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const authState = useAppSelector(state => state.authReducer);

  useEffect(() => {
    if (!authState.loading && !authState.common.isLogin) {
      navigate('/auth/login');
    }
  }, [authState.common.isLogin, authState.loading, navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
```

### App Router Setup
```typescript
// App.tsx
import { Routes, Route, Navigate } from 'react-router';
import { ThemeProvider } from '@emotion/react';
import { authRoutes, publicRoutes } from './routes';
import ProtectedRoute from './common/ProtectedRoute/ProtectedRoute';
import VerticalLayout from './common/layout/VerticalLayout';

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Routes>
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <VerticalLayout />
            </ProtectedRoute>
          }
        />
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
        <Route path="/" element={<Navigate to="/app/dashboard" />} />
      </Routes>
    </ThemeProvider>
  );
}
```

## Authentication & Authorization

### Auth Slice Pattern
```typescript
// store/features/auth/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getPermissionsForRole } from '../types/RBAC/config';

interface AuthState {
  api: {
    token: string;
    uid: string;
  };
  common: {
    isLogin: boolean;
  };
  user: {
    role: UserRole | null;
    permissions: Permission[];
    email: string | null;
    name: string | null;
  };
  error: string;
  loading: boolean;
}

const checkAuthFromToken = (): AuthState => {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole') as UserRole | null;
  
  if (token && role) {
    return {
      api: { token, uid: localStorage.getItem('uid') || '' },
      common: { isLogin: true },
      user: {
        role,
        permissions: getPermissionsForRole(role),
        email: localStorage.getItem('userEmail'),
        name: localStorage.getItem('userName'),
      },
      error: '',
      loading: false,
    };
  }
  
  return initialState;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: checkAuthFromToken(),
  reducers: {
    authSignInSuccess(state, action: PayloadAction<AuthResponse>) {
      // Store auth data in localStorage
      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('userRole', action.payload.role);
      
      state.api.token = action.payload.token;
      state.common.isLogin = true;
      state.user.role = action.payload.role;
      state.user.permissions = getPermissionsForRole(action.payload.role);
    },
    authLogout(state) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      // Reset state
      state.common.isLogin = false;
      state.user.role = null;
      state.user.permissions = [];
    },
  },
});
```

### Role-Based Access Control (RBAC)
```typescript
// store/hooks/usePermissions.ts
import { useAppSelector } from '../store';

export const usePermissions = () => {
  const { role, permissions } = useAppSelector(state => state.authReducer.user);
  
  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };
  
  const hasRole = (requiredRole: UserRole): boolean => {
    return role === requiredRole;
  };
  
  return { hasPermission, hasRole, role, permissions };
};

// Usage in components
const AdminOnlyComponent = () => {
  const { hasRole } = usePermissions();
  
  if (!hasRole('Admin')) {
    return <div>Access denied</div>;
  }
  
  return <div>Admin content</div>;
};
```

## WebSocket Integration

### WebSocket Client Setup
```typescript
// services/websocket/WebSocketClient.ts
import { io, Socket } from 'socket.io-client';

export class WebSocketClient {
  private socket: Socket | null = null;
  private config: WebSocketConfig;

  constructor(config: WebSocketConfig) {
    this.config = config;
  }

  connect(): void {
    this.socket = io(this.config.serverUrl, {
      auth: { token: this.config.authToken },
      autoConnect: true
    });

    this.setupEventListeners();
  }

  joinUserRoom(userId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join_user_room', userId);
    }
  }

  on<K extends keyof NotificationEvents>(
    event: K,
    listener: NotificationEvents[K]
  ): void {
    this.socket?.on(event, listener);
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to notification service');
    });

    this.socket.on('notification', (notification: Notification) => {
      // Handle notification
    });
  }
}
```

### Using WebSocket in Components
```typescript
import { useEffect } from 'react';
import { WebSocketClient } from '../../services/websocket/WebSocketClient';

const NotificationComponent = () => {
  useEffect(() => {
    const wsClient = new WebSocketClient({
      serverUrl: 'ws://localhost:3001',
      authToken: localStorage.getItem('authToken') || '',
    });

    wsClient.connect();
    wsClient.joinUserRoom(userId);

    wsClient.on('notification', (notification) => {
      toast.info(notification.message);
    });

    return () => {
      wsClient.disconnect();
    };
  }, [userId]);

  return <div>Notification component</div>;
};
```

## Testing Guidelines

### Component Testing
```typescript
// Component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../../store/store';
import MyComponent from './MyComponent';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('MyComponent', () => {
  test('renders correctly', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  test('handles user interaction', () => {
    renderWithProviders(<MyComponent />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
```

### API Testing
```typescript
// api.test.ts
import { getAllFeatures } from './featureApi';
import { http } from '../config/http';

jest.mock('../config/http');
const mockedHttp = http as jest.Mocked<typeof http>;

describe('featureApi', () => {
  test('getAllFeatures returns features', async () => {
    const mockData = { features: [{ id: '1', name: 'Test' }] };
    mockedHttp.get.mockResolvedValue({ data: mockData });

    const result = await getAllFeatures();
    expect(result).toEqual(mockData);
    expect(mockedHttp.get).toHaveBeenCalledWith('/api/features/all');
  });
});
```

## Best Practices

### Code Organization
1. **Single Responsibility**: Each component should have one clear purpose
2. **Separation of Concerns**: Keep UI logic separate from business logic
3. **Consistent Naming**: Use descriptive names that clearly indicate purpose
4. **Type Safety**: Always define proper TypeScript types

### Performance Optimization
1. **React.memo**: Use for components that receive stable props
2. **useMemo/useCallback**: Use for expensive calculations and stable references
3. **Lazy Loading**: Implement code splitting for large components
4. **Bundle Analysis**: Regularly check bundle size and optimize imports

```typescript
// Performance optimization example
const ExpensiveComponent = React.memo(({ data, onAction }) => {
  const processedData = useMemo(() => {
    return data.map(item => expensiveProcessing(item));
  }, [data]);

  const handleAction = useCallback((id: string) => {
    onAction(id);
  }, [onAction]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleAction(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});
```

### Error Handling
```typescript
// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// API error handling
const handleApiCall = async () => {
  try {
    dispatch(getDataRequest());
    const response = await apiCall();
    dispatch(getDataSuccess(response));
  } catch (error) {
    dispatch(getDataFailed(error.message));
    toast.error('Operation failed. Please try again.');
  }
};
```

### Accessibility
```typescript
// Accessible component example
const AccessibleButton = ({ children, onClick, disabled }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    aria-label={disabled ? 'Button is disabled' : undefined}
    role="button"
    tabIndex={0}
  >
    {children}
  </Button>
);

// Form accessibility
const AccessibleForm = () => (
  <form>
    <label htmlFor="email-input">Email Address</label>
    <input
      id="email-input"
      type="email"
      aria-describedby="email-error"
      aria-invalid={hasError}
    />
    {hasError && (
      <div id="email-error" role="alert">
        Please enter a valid email address
      </div>
    )}
  </form>
);
```

## Common Patterns

### Modal Management
```typescript
const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  
  return { isOpen, openModal, closeModal };
};

// Usage
const MyComponent = () => {
  const { isOpen, openModal, closeModal } = useModal();
  
  return (
    <>
      <Button onClick={openModal}>Open Modal</Button>
      <Modal show={isOpen} onClose={closeModal}>
        <ModalContent />
      </Modal>
    </>
  );
};
```

### Data Fetching Hook
```typescript
const useDataFetching = (fetchFunction: () => Promise<any>) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Usage
const MyComponent = () => {
  const { data, loading, error } = useDataFetching(() => getAllFeatures());
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{data?.map(item => <div key={item.id}>{item.name}</div>)}</div>;
};
```

### Form Validation
```typescript
const useFormValidation = (schema: Yup.ObjectSchema, initialValues: any) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = async (name: string, value: any) => {
    try {
      await schema.validateAt(name, { [name]: value });
      setErrors(prev => ({ ...prev, [name]: '' }));
    } catch (error) {
      setErrors(prev => ({ ...prev, [name]: error.message }));
    }
  };

  const handleChange = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, values[name]);
  };

  return { values, errors, touched, handleChange, handleBlur };
};
```

---

## Conclusion

This development guide provides a comprehensive overview of the AR-13 UI project's architecture, patterns, and best practices. Following these guidelines will help maintain code quality, consistency, and scalability as the project grows.

For additional help or questions, please refer to:
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

Remember to always write clean, maintainable code and follow the established patterns in the codebase. Happy coding!


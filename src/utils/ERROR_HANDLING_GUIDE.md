# Error Handling Guide

This guide explains how to use the centralized error handling utilities to properly display backend errors in the frontend.

## Overview

The error handling system provides:
- **Automatic error extraction** from various error formats
- **Field-specific error mapping** for form validation
- **Toast notifications** with appropriate styling
- **User-friendly error messages**
- **Error type detection** (network, validation, auth, permission, etc.)

## Core Utilities

### `errorUtils.ts`

Main utility functions for error handling:

#### `parseError(error: unknown): ParsedError`
Extracts and parses errors from any format (string, Error, AxiosError, etc.)

```typescript
import { parseError } from "../utils/errorUtils";

try {
  // API call
} catch (error) {
  const parsed = parseError(error);
  console.log(parsed.message); // Main error message
  console.log(parsed.fieldErrors); // Field-specific errors
  console.log(parsed.isValidationError); // Error type flags
}
```

#### `showErrorToast(error: unknown, customMessage?: string): void`
Shows error in toast notification with appropriate styling

```typescript
import { showErrorToast } from "../utils/errorUtils";

try {
  // API call
} catch (error) {
  showErrorToast(error); // Automatically shows appropriate toast
}
```

#### `setFormFieldErrors(error: unknown, setFieldError: Function): void`
Sets form field errors from backend validation errors (for Formik)

```typescript
import { setFormFieldErrors } from "../utils/errorUtils";

try {
  // API call
} catch (error) {
  setFormFieldErrors(error, formik.setFieldError);
}
```

#### `handleActionError(error: unknown, showToast: boolean = true): string`
For use in Redux actions - handles error and optionally shows toast

```typescript
import { handleActionError } from "../utils/errorUtils";

export const myAction = () => async (dispatch: AppDispatch) => {
  try {
    // API call
  } catch (error) {
    const errorMessage = handleActionError(error); // Shows toast and returns message
    dispatch(someFailedAction(errorMessage));
  }
};
```

#### `getUserFriendlyErrorMessage(error: unknown): string`
Converts technical error messages to user-friendly ones

```typescript
import { getUserFriendlyErrorMessage } from "../utils/errorUtils";

const message = getUserFriendlyErrorMessage(error);
// "user not authenticated" -> "Please log in to continue"
```

### `useErrorHandler` Hook

React hook for convenient error handling in components:

```typescript
import { useErrorHandler } from "../hooks/useErrorHandler";

const MyComponent = () => {
  const { handleError, handleFormError, getErrorMessage } = useErrorHandler();

  // In form submission
  const onSubmit = async (values, { setFieldError }) => {
    try {
      await createUser(values);
    } catch (error) {
      // Automatically sets field errors and shows toast
      handleFormError(error, setFieldError);
    }
  };

  // In regular action
  const handleClick = async () => {
    try {
      await doSomething();
    } catch (error) {
      // Shows toast automatically
      handleError(error);
    }
  };
};
```

## Usage Examples

### 1. Redux Actions

**Before:**
```typescript
catch (error) {
  const axiosError = error as AxiosError<ErrorResponse>;
  const errorMessage = axiosError?.response?.data?.error || "Failed";
  dispatch(failedAction(errorMessage));
  toast.error(errorMessage);
}
```

**After:**
```typescript
import { handleActionError } from "../../utils/errorUtils";

catch (error) {
  const errorMessage = handleActionError(error); // Shows toast automatically
  dispatch(failedAction(errorMessage));
}
```

### 2. Form Components (Formik)

**Before:**
```typescript
onSubmit: async (values) => {
  try {
    await createProject(values);
  } catch (error) {
    const axiosError = error as AxiosError;
    toast.error(axiosError.response?.data?.error || "Failed");
  }
}
```

**After:**
```typescript
import { useErrorHandler } from "../../hooks/useErrorHandler";

const { handleFormError } = useErrorHandler();

onSubmit: async (values, { setFieldError }) => {
  try {
    await createProject(values);
  } catch (error) {
    // Automatically sets field errors and shows toast
    handleFormError(error, setFieldError);
  }
}
```

### 3. Regular Components

**Before:**
```typescript
try {
  await deleteItem(id);
} catch (error) {
  const axiosError = error as AxiosError;
  toast.error(axiosError.response?.data?.error || "Failed to delete");
}
```

**After:**
```typescript
import { useErrorHandler } from "../../hooks/useErrorHandler";

const { handleError } = useErrorHandler();

try {
  await deleteItem(id);
} catch (error) {
  handleError(error); // Shows appropriate toast automatically
}
```

## Backend Error Formats Supported

The utilities handle multiple backend error response formats:

### Format 1: Simple Error
```json
{
  "error": "Error message"
}
```

### Format 2: Message Field
```json
{
  "message": "Error message"
}
```

### Format 3: Field-Specific Validation Errors
```json
{
  "error": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "name": "Name is required"
  }
}
```

### Format 4: Alternative Field Errors Format
```json
{
  "error": "Validation failed",
  "fieldErrors": {
    "email": ["Invalid email", "Email already exists"]
  }
}
```

### Format 5: Validation Errors Format
```json
{
  "error": "Validation failed",
  "validationErrors": {
    "password": "Password must be at least 8 characters"
  }
}
```

## Error Type Detection

The utilities automatically detect error types:

- **Network Errors**: Connection problems, timeouts
- **Validation Errors**: 400/422 with field errors
- **Auth Errors**: 401 Unauthorized
- **Permission Errors**: 403 Forbidden
- **Server Errors**: 500+ status codes

Different toast styles are applied based on error type.

## Field Name Mapping

Field names from backend are automatically formatted for display:
- `firstName` → "First Name"
- `emailAddress` → "Email Address"
- `phoneNumber` → "Phone Number"

## Best Practices

1. **Always use error utilities** instead of manual error handling
2. **Use `handleFormError` in forms** to automatically set field errors
3. **Use `handleActionError` in Redux actions** for consistent error handling
4. **Don't show duplicate toasts** - the utilities handle this
5. **Let the utilities handle admin access errors** - they're handled globally

## Migration Checklist

When updating existing code:

- [ ] Replace manual `toast.error()` calls with `handleError()` or `handleActionError()`
- [ ] Replace manual field error setting with `handleFormError()`
- [ ] Remove duplicate error extraction logic
- [ ] Use `parseError()` for custom error handling needs
- [ ] Update Redux actions to use `handleActionError()`






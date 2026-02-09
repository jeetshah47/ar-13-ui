/**
 * Comprehensive error handling utilities for mapping backend errors to frontend
 */

import type { AxiosError } from "axios";
import toast from "react-hot-toast";

/**
 * Backend error response formats
 */
export interface BackendErrorResponse {
  error?: string;
  message?: string;
  errors?: Record<string, string | string[]>; // Field-specific validation errors
  fieldErrors?: Record<string, string | string[]>; // Alternative field errors format
  validationErrors?: Record<string, string | string[]>; // Another alternative format
  statusCode?: number;
  status?: number;
}

/**
 * Parsed error information
 */
export interface ParsedError {
  message: string; // Main error message
  fieldErrors: Record<string, string>; // Field-specific errors (flattened to single string per field)
  statusCode?: number;
  isNetworkError: boolean;
  isValidationError: boolean;
  isServerError: boolean;
  isAuthError: boolean;
  isPermissionError: boolean;
}

/**
 * Check if an error message indicates admin access is required
 */
export const isAdminAccessError = (errorMessage: string | null | undefined): boolean => {
  if (!errorMessage) return false;
  return errorMessage.toLowerCase().includes("admin access required");
};

/**
 * Check if an error message indicates permission denial
 */
export const isPermissionError = (errorMessage: string | null | undefined): boolean => {
  if (!errorMessage) return false;
  const lowerMessage = errorMessage.toLowerCase();
  return (
    lowerMessage.includes("permission denied") ||
    lowerMessage.includes("permission required") ||
    lowerMessage.includes("access denied") ||
    lowerMessage.includes("forbidden")
  );
};

/**
 * Check if an error message indicates authentication failure
 */
export const isAuthError = (errorMessage: string | null | undefined): boolean => {
  if (!errorMessage) return false;
  const lowerMessage = errorMessage.toLowerCase();
  return (
    lowerMessage.includes("unauthorized") ||
    lowerMessage.includes("not authenticated") ||
    lowerMessage.includes("invalid token") ||
    lowerMessage.includes("token expired") ||
    lowerMessage.includes("authentication failed")
  );
};

/**
 * Check if an error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error && typeof error === "object" && "code" in error) {
    const axiosError = error as AxiosError;
    return axiosError.code === "ERR_NETWORK" || axiosError.code === "ECONNABORTED";
  }
  return false;
};

/**
 * Check if an error is a validation error (400 Bad Request with field errors)
 */
export const isValidationError = (error: unknown): boolean => {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;
    
    return (
      status === 400 ||
      status === 422 ||
      !!(data?.errors && Object.keys(data.errors).length > 0) ||
      !!(data?.fieldErrors && Object.keys(data.fieldErrors).length > 0) ||
      !!(data?.validationErrors && Object.keys(data.validationErrors).length > 0)
    );
  }
  return false;
};

/**
 * Flatten field errors array to single string
 */
const flattenFieldError = (error: string | string[]): string => {
  if (Array.isArray(error)) {
    return error.join(", ");
  }
  return error;
};

/**
 * Extract and parse error from various error types
 */
export const parseError = (error: unknown): ParsedError => {
  const defaultError: ParsedError = {
    message: "An unexpected error occurred",
    fieldErrors: {},
    isNetworkError: false,
    isValidationError: false,
    isServerError: false,
    isAuthError: false,
    isPermissionError: false,
  };

  // Handle string errors
  if (typeof error === "string") {
    return {
      ...defaultError,
      message: error,
      isAuthError: isAuthError(error),
      isPermissionError: isPermissionError(error),
    };
  }

  // Handle Error objects
  if (error instanceof Error) {
    return {
      ...defaultError,
      message: error.message || defaultError.message,
      isAuthError: isAuthError(error.message),
      isPermissionError: isPermissionError(error.message),
    };
  }

  // Handle Axios errors
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<BackendErrorResponse>;
    const response = axiosError.response;
    const data = response?.data;
    const statusCode = response?.status;

    // Extract main error message
    const errorMessage =
      data?.error ||
      data?.message ||
      axiosError.message ||
      getDefaultErrorMessage(statusCode) ||
      defaultError.message;

    // Extract field-specific errors
    const fieldErrors: Record<string, string> = {};
    
    if (data?.errors) {
      Object.entries(data.errors).forEach(([field, errorValue]) => {
        fieldErrors[field] = flattenFieldError(errorValue);
      });
    }
    
    if (data?.fieldErrors) {
      Object.entries(data.fieldErrors).forEach(([field, errorValue]) => {
        fieldErrors[field] = flattenFieldError(errorValue);
      });
    }
    
    if (data?.validationErrors) {
      Object.entries(data.validationErrors).forEach(([field, errorValue]) => {
        fieldErrors[field] = flattenFieldError(errorValue);
      });
    }

    // Determine error type
    const isNetwork = isNetworkError(error);
    const isValidation = isValidationError(error);
    const isAuth = isAuthError(errorMessage);
    const isPermission = isPermissionError(errorMessage);
    const isServer = statusCode ? statusCode >= 500 : false;

    return {
      message: errorMessage,
      fieldErrors,
      statusCode,
      isNetworkError: isNetwork,
      isValidationError: isValidation,
      isServerError: isServer,
      isAuthError: isAuth,
      isPermissionError: isPermission,
    };
  }

  // Handle network errors (no response)
  if (error && typeof error === "object" && "code" in error) {
    const axiosError = error as AxiosError;
    if (axiosError.code === "ERR_NETWORK" || axiosError.code === "ECONNABORTED") {
      return {
        ...defaultError,
        message: "Network error. Please check your connection and try again.",
        isNetworkError: true,
      };
    }
  }

  return defaultError;
};

/**
 * Get default error message based on status code
 */
const getDefaultErrorMessage = (statusCode?: number): string | null => {
  if (!statusCode) return null;

  const errorMessages: Record<number, string> = {
    400: "Invalid request. Please check your input and try again",
    401: "Authentication required. Please log in again",
    403: "You don't have permission to perform this action",
    404: "The requested resource was not found",
    409: "A conflict occurred. The resource may already exist",
    422: "Validation error. Please check your input",
    429: "Too many requests. Please try again later",
    500: "Internal server error. Please try again later",
    502: "Bad gateway. The server is temporarily unavailable",
    503: "Service unavailable. Please try again later",
    504: "Gateway timeout. Please try again later",
  };

  return errorMessages[statusCode] || null;
};

/**
 * Extract error message from various error types (backward compatibility)
 */
export const extractErrorMessage = (error: unknown): string => {
  return parseError(error).message;
};

/**
 * Extract field errors from error response
 */
export const extractFieldErrors = (error: unknown): Record<string, string> => {
  return parseError(error).fieldErrors;
};

/**
 * Show error in toast notification
 */
export const showErrorToast = (error: unknown, customMessage?: string): void => {
  const parsedError = parseError(error);
  
  // Don't show toast for admin access errors (handled globally in HTTP interceptor)
  if (isAdminAccessError(parsedError.message)) {
    return;
  }

  const message = customMessage || parsedError.message;
  
  // Show different toast styles based on error type
  if (parsedError.isNetworkError) {
    toast.error(message, {
      duration: 5000,
      icon: "⚠️",
    });
  } else if (parsedError.isValidationError && Object.keys(parsedError.fieldErrors).length > 0) {
    // For validation errors with field errors, show a summary
    const fieldCount = Object.keys(parsedError.fieldErrors).length;
    toast.error(
      fieldCount === 1
        ? message
        : `${message} (${fieldCount} field${fieldCount > 1 ? "s" : ""} have errors)`,
      {
        duration: 4000,
      }
    );
  } else if (parsedError.isAuthError) {
    toast.error(message, {
      duration: 4000,
      icon: "🔒",
    });
  } else if (parsedError.isPermissionError) {
    toast.error(message, {
      duration: 4000,
      icon: "🚫",
    });
  } else {
    toast.error(message, {
      duration: 4000,
    });
  }
};

/**
 * Set form field errors from backend error response
 * Works with Formik's setFieldError
 */
export const setFormFieldErrors = (
  error: unknown,
  setFieldError: (field: string, message: string) => void
): void => {
  const parsedError = parseError(error);
  
  // Set errors for each field
  Object.entries(parsedError.fieldErrors).forEach(([field, message]) => {
    setFieldError(field, message);
  });
  
  // If there's a general error message but no field errors, 
  // and it looks like a field-specific error, try to extract field name
  if (Object.keys(parsedError.fieldErrors).length === 0 && parsedError.message) {
    // Try to extract field name from error message (e.g., "Email is required" -> "email")
    const fieldMatch = parsedError.message.match(/(\w+)\s+(is|must|should|can't|cannot)/i);
    if (fieldMatch) {
      const fieldName = fieldMatch[1].toLowerCase();
      setFieldError(fieldName, parsedError.message);
    }
  }
};

/**
 * Handle error in Redux action (for use in async thunks)
 * Returns error message for dispatch and optionally shows toast
 */
export const handleActionError = (
  error: unknown,
  showToast: boolean = true
): string => {
  const parsedError = parseError(error);
  
  if (showToast) {
    showErrorToast(error);
  }
  
  return parsedError.message;
};

/**
 * Get user-friendly error message
 * Maps technical error messages to user-friendly ones
 */
export const getUserFriendlyErrorMessage = (error: unknown): string => {
  const parsedError = parseError(error);
  let message = parsedError.message;

  // Map common technical errors to user-friendly messages
  const errorMappings: Record<string, string> = {
    "user not authenticated": "Please log in to continue",
    "invalid token": "Your session has expired. Please log in again",
    "token expired": "Your session has expired. Please log in again",
    "permission denied": "You don't have permission to perform this action",
    "admin access required": "Admin access is required for this action",
    "resource not found": "The requested item was not found",
    "invalid request": "Please check your input and try again",
    "validation error": "Please check the form for errors",
    "internal server error": "Something went wrong. Please try again later",
    "network error": "Connection problem. Please check your internet connection",
    "timeout": "Request timed out. Please try again",
  };  const lowerMessage = message.toLowerCase();
  for (const [key, friendlyMessage] of Object.entries(errorMappings)) {
    if (lowerMessage.includes(key)) {
      return friendlyMessage;
    }
  }  return message;
};/**
 * Format field name for display (e.g., "firstName" -> "First Name")
 */
export const formatFieldName = (fieldName: string): string => {
  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};
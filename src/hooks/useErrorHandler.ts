import { useCallback } from "react";
import type { FormikErrors, FormikTouched } from "formik";
import {
  parseError,
  showErrorToast,
  setFormFieldErrors,
  getUserFriendlyErrorMessage,
  type ParsedError,
} from "../utils/errorUtils";

/**
 * Hook for handling errors in forms and components
 */
export const useErrorHandler = () => {
  /**
   * Handle error and show toast notification
   */
  const handleError = useCallback((error: unknown, customMessage?: string) => {
    showErrorToast(error, customMessage);
    return parseError(error);
  }, []);

  /**
   * Handle error and set form field errors (for Formik forms)
   */
  const handleFormError = useCallback(
    (
      error: unknown,
      setFieldError: (field: string, message: string) => void,
      showToast: boolean = true
    ): ParsedError => {
      const parsedError = parseError(error);
      
      // Set field errors
      setFormFieldErrors(error, setFieldError);
      
      // Show toast for general errors (if not field-specific)
      if (showToast && Object.keys(parsedError.fieldErrors).length === 0) {
        showErrorToast(error);
      } else if (showToast && Object.keys(parsedError.fieldErrors).length > 0) {
        // Show summary toast for validation errors
        const fieldCount = Object.keys(parsedError.fieldErrors).length;
        showErrorToast(
          error,
          `Please check ${fieldCount} field${fieldCount > 1 ? "s" : ""} for errors`
        );
      }
      
      return parsedError;
    },
    []
  );

  /**
   * Get user-friendly error message
   */
  const getErrorMessage = useCallback((error: unknown): string => {
    return getUserFriendlyErrorMessage(error);
  }, []);

  /**
   * Parse error without showing toast
   */
  const parseErrorOnly = useCallback((error: unknown): ParsedError => {
    return parseError(error);
  }, []);

  return {
    handleError,
    handleFormError,
    getErrorMessage,
    parseErrorOnly,
  };
};






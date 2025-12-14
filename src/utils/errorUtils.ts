/**
 * Utility functions for error handling
 */

/**
 * Check if an error message indicates admin access is required
 */
export const isAdminAccessError = (errorMessage: string | null | undefined): boolean => {
  if (!errorMessage) return false;
  return errorMessage.toLowerCase().includes("admin access required");
};

/**
 * Extract error message from various error types
 */
export const extractErrorMessage = (error: unknown): string => {
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
    return (
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      "Unknown error"
    );
  }
  return "Unknown error";
};


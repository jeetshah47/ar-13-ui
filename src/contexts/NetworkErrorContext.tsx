import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";

interface NetworkErrorContextType {
  isNetworkError: boolean;
  setNetworkError: (error: boolean) => void;
  clearError: () => void;
}

const NetworkErrorContext = createContext<NetworkErrorContextType | undefined>(undefined);

// Global reference to set network error (for use in non-React code like http.ts)
let globalSetNetworkError: ((error: boolean) => void) | null = null;

export const setGlobalNetworkError = (error: boolean) => {
  if (globalSetNetworkError) {
    globalSetNetworkError(error);
  }
};

export const NetworkErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isNetworkError, setIsNetworkError] = useState(false);

  const setNetworkError = useCallback((error: boolean) => {
    setIsNetworkError(error);
  }, []);

  const clearError = useCallback(() => {
    setIsNetworkError(false);
  }, []);

  // Set global reference when component mounts
  useEffect(() => {
    globalSetNetworkError = setNetworkError;
    return () => {
      globalSetNetworkError = null;
    };
  }, [setNetworkError]);

  return (
    <NetworkErrorContext.Provider
      value={{
        isNetworkError,
        setNetworkError,
        clearError,
      }}
    >
      {children}
    </NetworkErrorContext.Provider>
  );
};

export const useNetworkError = (): NetworkErrorContextType => {
  const context = useContext(NetworkErrorContext);
  if (context === undefined) {
    throw new Error("useNetworkError must be used within a NetworkErrorProvider");
  }
  return context;
};


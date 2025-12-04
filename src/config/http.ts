import Axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { store } from "../store/store";
import { authLogout } from "../store/features/auth/authSlice";
import { setGlobalNetworkError } from "../contexts/NetworkErrorContext";
import { API_BASE_URL } from "./api";
import { isAdminAccessError } from "../utils/errorUtils";

const http = Axios.create();

export type HttpHeaders = {
  [key: string]: string | boolean;
};

const publicApiList = [`${API_BASE_URL}/auth`];

const updateHeaders = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig<HttpHeaders> => {
  const newConfig: InternalAxiosRequestConfig<HttpHeaders> = { ...config };
  const token = localStorage.getItem("authToken");
  if (!publicApiList.includes(config.url ?? "") && token) {
    newConfig.headers.Authorization = `Bearer ${token}`;
  }
  return newConfig;
};

const handleServerError = (rootError: AxiosError<{ message?: string; error?: string }>) => {
  if (rootError?.code === "ERR_NETWORK") {
    toast.dismiss();
    toast.error("Server offline");
    // Set global network error state to show ServerOffline component
    setGlobalNetworkError(true);
  } else {
    // Clear network error if it's a different type of error
    setGlobalNetworkError(false);
  }
  if (rootError?.response?.data) {
    const responseData = rootError.response.data;
    const errorMessage = responseData.message || responseData.error || "";
    
    // Check for "Admin access required" error
    if (isAdminAccessError(errorMessage)) {
      // For GET requests to read-only project/task endpoints, don't redirect
      // Users should be able to view projects/tasks even if not assigned
      const requestUrl = rootError.config?.url || "";
      const isGetRequest = rootError.config?.method?.toLowerCase() === 'get';
      const isReadOnlyEndpoint = 
        requestUrl.includes('/project/all') ||
        requestUrl.includes('/tasks/all') ||
        requestUrl.includes('/tasks/detail/') ||
        requestUrl.includes('/project/details/');
      
      // Only redirect for write/delete operations, not for read operations
      if (isGetRequest && isReadOnlyEndpoint) {
        // For read operations, just show a warning but don't redirect
        // This allows users to see the page even if the API call fails
        toast.dismiss();
        toast.error("Unable to load data. You may not have access to this resource.");
        return Promise.reject(errorMessage);
      }
      
      // For write/delete operations, redirect as before
      toast.dismiss();
      toast.error("Admin access required");
      // Stop any ongoing loading states by dispatching failed actions for common reducers
      // Note: The redirect will cause a page reload, which will naturally stop all loading states
      // Redirect to dashboard
      if (typeof window !== "undefined") {
        // Use setTimeout to ensure error is logged and state is updated before redirect
        setTimeout(() => {
          window.location.href = "/app/dashboard";
        }, 100);
      }
      return Promise.reject(errorMessage);
    }
    
    if (errorMessage === "Auth token Invalid" || rootError.response.status === 401) {
      store.dispatch(authLogout());
      return Promise.reject(errorMessage);
    }
    return Promise.reject(errorMessage);
  }
  return Promise.reject(new Error("unknown error occured"));
};

http.interceptors.request.use(updateHeaders);
http.interceptors.response.use(
  (response) => {
    // Clear network error on successful response
    setGlobalNetworkError(false);
    return response;
  },
  handleServerError
);

export { http };

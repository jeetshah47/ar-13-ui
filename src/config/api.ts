/**
 * API Configuration
 * Centralized configuration for API base URL from environment variables
 */

const getApiBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (!baseUrl) {
    // eslint-disable-next-line no-console
    console.warn('VITE_API_BASE_URL is not set in environment variables. Using default: http://localhost:3000/api');
    return 'http://localhost:3000/api';
  }
  
  // Ensure the URL doesn't end with a slash
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Get the base server URL (without /api) for file URLs and other non-API endpoints
 */
export const getServerBaseUrl = (): string => {
  const apiUrl = API_BASE_URL;
  // Remove /api from the end if present
  if (apiUrl.endsWith('/api')) {
    return apiUrl.slice(0, -4);
  }
  // If it doesn't end with /api, assume the base URL is the server URL
  return apiUrl.replace(/\/api$/, '');
};

export const SERVER_BASE_URL = getServerBaseUrl();

/**
 * Get the filebrowser service base URL from environment variables
 * Defaults to http://localhost:8082 if not set
 */
const getFilebrowserBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_FILEBROWSER_BASE_URL;
  
  if (!baseUrl) {
    // eslint-disable-next-line no-console
    console.warn('VITE_FILEBROWSER_BASE_URL is not set in environment variables. Using default: http://localhost:8082');
    return 'http://localhost:8082';
  }
  
  // Ensure the URL doesn't end with a slash
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

export const FILEBROWSER_BASE_URL = getFilebrowserBaseUrl();


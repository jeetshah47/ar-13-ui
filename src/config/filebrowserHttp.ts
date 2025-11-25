import Axios, { type InternalAxiosRequestConfig } from "axios";
import { FILEBROWSER_BASE_URL } from "./api";

// Create a separate axios instance for filebrowser service
// This will automatically include JWT tokens in requests
const filebrowserHttp = Axios.create({
  baseURL: FILEBROWSER_BASE_URL,
});

// Add JWT token to all requests
filebrowserHttp.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { filebrowserHttp };


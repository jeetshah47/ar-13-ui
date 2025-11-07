import Axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { store } from "../store/store";
import { authLogout } from "../store/features/auth/authSlice";
import { setGlobalNetworkError } from "../contexts/NetworkErrorContext";

const http = Axios.create();

export type HttpHeaders = {
  [key: string]: string | boolean;
};

const publicApiList = [`http://localhost:3000/api/auth`];

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

const handleServerError = (rootError: AxiosError<{ message: string }>) => {
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
    const { message } = rootError.response.data;
    if (message === "Auth token Invalid" || rootError.response.status === 401) {
      store.dispatch(authLogout());
      return Promise.reject(message);
    }
    return Promise.reject(message);
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

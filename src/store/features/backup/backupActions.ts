import type { AppDispatch } from "../../store";
import {
  createBackupRequest,
  createBackupSuccess,
  createBackupFailed,
} from "./backupSlice";
import { createBackup, createBackupWithCustomLocation } from "../../apis/backupApis";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const createBackupAction = () => async (dispatch: AppDispatch) => {
  dispatch(createBackupRequest());
  try {
    const response = await createBackup();
    dispatch(
      createBackupSuccess({
        backupLocation: response.backupLocation,
        message: response.message,
      })
    );
    toast.success(response.message || "Backup created successfully");
    return response;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const errorMessage =
      axiosError?.response?.data?.message ||
      axiosError?.response?.data?.error ||
      axiosError?.message ||
      "Failed to create backup";
    dispatch(createBackupFailed({ error: errorMessage }));
    toast.error(errorMessage);
    throw error;
  }
};

export const createBackupWithCustomLocationAction =
  (customDir: string) => async (dispatch: AppDispatch) => {
    dispatch(createBackupRequest());
    try {
      const response = await createBackupWithCustomLocation(customDir);
      dispatch(
        createBackupSuccess({
          backupLocation: response.backupLocation,
          message: response.message,
        })
      );
      toast.success(response.message || "Backup created successfully");
      return response;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string; error?: string }>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        axiosError?.response?.data?.error ||
        axiosError?.message ||
        "Failed to create backup";
      dispatch(createBackupFailed({ error: errorMessage }));
      toast.error(errorMessage);
      throw error;
    }
  };


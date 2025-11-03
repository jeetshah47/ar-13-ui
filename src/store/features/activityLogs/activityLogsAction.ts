import type { AppDispatch } from "../../store";
import { getRecentActivityLogs } from "../../apis/activityLogsApi";
import {
  getActivityLogsFailed,
  getActivityLogsRequest,
  getActivityLogsSuccess,
} from "./activityLogsSlice";
import type { AxiosError } from "axios";

export const fetchRecentTaskActivityLogs = (limit: number = 10) => async (
  dispatch: AppDispatch
) => {
  dispatch(getActivityLogsRequest());
  try {
    const response = await getRecentActivityLogs("task", limit);
    dispatch(getActivityLogsSuccess({ items: response.activityLogs || [] }));
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    const message = (error?.response?.data?.message as string) || "Failed to fetch activity logs";
    dispatch(getActivityLogsFailed({ error: message }));
  }
};



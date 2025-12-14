import type { AppDispatch } from "../../store";
import {
  getActivityLogsByEntity,
  getActivityLogsByEntityType,
  getEntityTypes,
} from "../../apis/activityLogsApi";
import {
  getActivityLogsFailed,
  getActivityLogsRequest,
  getActivityLogsSuccess,
} from "./activityLogsSlice";
import type { AxiosError } from "axios";
import type { EntityType } from "../../types/ActivityLogs/ActivityLog";

/**
 * Fetch activity logs for a specific entity (task, project, user, or calendarEvent)
 */
export const fetchActivityLogsByEntity = (
  entityType: EntityType,
  entityId: string
) => async (dispatch: AppDispatch) => {
  dispatch(getActivityLogsRequest());
  try {
    const response = await getActivityLogsByEntity(entityType, entityId);
    const items = response.activityLogs || [];
    dispatch(getActivityLogsSuccess({ items }));
    return { items };
  } catch (err) {
    const error = err as AxiosError<{ message?: string; error?: string }>;
    const message =
      (error?.response?.data?.message as string) ||
      (error?.response?.data?.error as string) ||
      "Failed to fetch activity logs";
    dispatch(getActivityLogsFailed({ error: message }));
    throw err;
  }
};

/**
 * Fetch recent activity logs by entity type (across all entities of that type)
 */
export const fetchActivityLogsByEntityType = (
  entityType: EntityType,
  limit?: number
) => async (dispatch: AppDispatch) => {
  dispatch(getActivityLogsRequest());
  try {
    const response = await getActivityLogsByEntityType(entityType, limit);
    dispatch(getActivityLogsSuccess({ items: response.activityLogs || [] }));
  } catch (err) {
    const error = err as AxiosError<{ message?: string; error?: string }>;
    const message =
      (error?.response?.data?.message as string) ||
      (error?.response?.data?.error as string) ||
      "Failed to fetch activity logs";
    dispatch(getActivityLogsFailed({ error: message }));
  }
};

/**
 * Fetch supported entity types
 */
export const fetchEntityTypes = () => async (_dispatch: AppDispatch) => {
  try {
    const response = await getEntityTypes();
    return response.entityTypes;
  } catch (err) {
    const error = err as AxiosError<{ message?: string; error?: string }>;
    const message =
      (error?.response?.data?.message as string) ||
      (error?.response?.data?.error as string) ||
      "Failed to fetch entity types";
    throw new Error(message);
  }
};

/**
 * @deprecated Use fetchActivityLogsByEntityType instead
 * Fetch recent task activity logs
 */
export const fetchRecentTaskActivityLogs = (limit: number = 10) => async (
  dispatch: AppDispatch
) => {
  return dispatch(fetchActivityLogsByEntityType("task", limit));
};



import type { AppDispatch } from "../../store";
import {
  getActivityLogReplies,
  createActivityLogReply,
} from "../../apis/activityLogsApi";
import {
  getRepliesRequest,
  getRepliesSuccess,
  getRepliesFailed,
  createReplyRequest,
  createReplySuccess,
  createReplyFailed,
} from "./activityLogRepliesSlice";
import type { AxiosError } from "axios";

/**
 * Fetch replies for a specific activity log
 */
export const fetchActivityLogReplies = (activityLogId: string) => async (
  dispatch: AppDispatch
) => {
  dispatch(getRepliesRequest({ activityLogId }));
  try {
    const response = await getActivityLogReplies(activityLogId);
    dispatch(getRepliesSuccess({ activityLogId, replies: response.replies || [] }));
    return response.replies || [];
  } catch (err) {
    const error = err as AxiosError<{ message?: string; error?: string }>;
    const message =
      (error?.response?.data?.message as string) ||
      (error?.response?.data?.error as string) ||
      "Failed to fetch replies";
    dispatch(getRepliesFailed({ activityLogId, error: message }));
    throw err;
  }
};

/**
 * Create a reply to an activity log
 */
export const postActivityLogReply = (
  activityLogId: string,
  message: string
) => async (dispatch: AppDispatch) => {
  dispatch(createReplyRequest({ activityLogId }));
  try {
    const response = await createActivityLogReply(activityLogId, message);
    dispatch(createReplySuccess({ activityLogId, reply: response.reply }));
    return response.reply;
  } catch (err) {
    const error = err as AxiosError<{ message?: string; error?: string }>;
    const message =
      (error?.response?.data?.message as string) ||
      (error?.response?.data?.error as string) ||
      "Failed to create reply";
    dispatch(createReplyFailed({ activityLogId, error: message }));
    throw err;
  }
};


import type { AppDispatch } from "../../store";
import {
  getRepliesRequest,
  getRepliesSuccess,
  getRepliesFailed,
  createReplyRequest,
  createReplySuccess,
  createReplyFailed,
} from "./activityLogRepliesSlice";

/**
 * Fetch replies for a specific activity log via WebSocket
 * This function should be called with sendMessage from NotificationContext
 */
export const fetchActivityLogReplies = (
  activityLogId: string,
  sendMessage: (message: { type: string; data: any }) => void
) => (dispatch: AppDispatch) => {
  dispatch(getRepliesRequest({ activityLogId }));
  
  // Send WebSocket message to request replies
  sendMessage({
    type: "activity-log:replies:request",
    data: { activityLogId },
  });
  
  // Note: The actual replies will be received via WebSocket event handler
  // which should dispatch getRepliesSuccess
};

/**
 * Create a reply to an activity log via WebSocket
 * This function should be called with sendMessage from NotificationContext
 */
export const postActivityLogReply = (
  activityLogId: string,
  message: string,
  sendMessage: (message: { type: string; data: any }) => void
) => (dispatch: AppDispatch) => {
  dispatch(createReplyRequest({ activityLogId }));
  
  // Send WebSocket message to create reply
  sendMessage({
    type: "activity-log:reply:create",
    data: {
      activityLogId,
      message,
    },
  });
  
  // Note: The actual reply will be received via WebSocket event handler
  // which should dispatch createReplySuccess
};


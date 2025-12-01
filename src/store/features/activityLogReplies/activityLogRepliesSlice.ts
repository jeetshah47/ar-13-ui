import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ActivityLogReply {
  id: string;
  activityLogId: string;
  message: string;
  createdBy: string;
  createdAt: string;
  createdByUser?: {
    id: string;
    name: string;
    email?: string;
  };
}

interface ActivityLogRepliesState {
  repliesByActivityLog: Record<string, ActivityLogReply[]>;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
  creating: Record<string, boolean>;
}

const initialState: ActivityLogRepliesState = {
  repliesByActivityLog: {},
  loading: {},
  error: {},
  creating: {},
};

const activityLogRepliesSlice = createSlice({
  name: "activityLogReplies",
  initialState,
  reducers: {
    getRepliesRequest: (
      state,
      action: PayloadAction<{ activityLogId: string }>
    ) => {
      const { activityLogId } = action.payload;
      state.loading[activityLogId] = true;
      state.error[activityLogId] = null;
    },
    getRepliesSuccess: (
      state,
      action: PayloadAction<{ activityLogId: string; replies: ActivityLogReply[] }>
    ) => {
      const { activityLogId, replies } = action.payload;
      state.repliesByActivityLog[activityLogId] = replies;
      state.loading[activityLogId] = false;
      state.error[activityLogId] = null;
    },
    getRepliesFailed: (
      state,
      action: PayloadAction<{ activityLogId: string; error: string }>
    ) => {
      const { activityLogId, error } = action.payload;
      state.loading[activityLogId] = false;
      state.error[activityLogId] = error;
    },
    createReplyRequest: (
      state,
      action: PayloadAction<{ activityLogId: string }>
    ) => {
      const { activityLogId } = action.payload;
      state.creating[activityLogId] = true;
      state.error[activityLogId] = null;
    },
    createReplySuccess: (
      state,
      action: PayloadAction<{ activityLogId: string; reply: ActivityLogReply }>
    ) => {
      const { activityLogId, reply } = action.payload;
      if (!state.repliesByActivityLog[activityLogId]) {
        state.repliesByActivityLog[activityLogId] = [];
      }
      // Check if reply already exists to avoid duplicates
      const exists = state.repliesByActivityLog[activityLogId].some(
        (r) => r.id === reply.id
      );
      if (!exists) {
        state.repliesByActivityLog[activityLogId].push(reply);
      }
      state.creating[activityLogId] = false;
      state.error[activityLogId] = null;
    },
    createReplyFailed: (
      state,
      action: PayloadAction<{ activityLogId: string; error: string }>
    ) => {
      const { activityLogId, error } = action.payload;
      state.creating[activityLogId] = false;
      state.error[activityLogId] = error;
    },
    addReplyToCache: (
      state,
      action: PayloadAction<{ activityLogId: string; reply: ActivityLogReply }>
    ) => {
      const { activityLogId, reply } = action.payload;
      if (!state.repliesByActivityLog[activityLogId]) {
        state.repliesByActivityLog[activityLogId] = [];
      }
      // Check if reply already exists
      const exists = state.repliesByActivityLog[activityLogId].some(
        (r) => r.id === reply.id
      );
      if (!exists) {
        state.repliesByActivityLog[activityLogId].push(reply);
      }
    },
  },
});

export const {
  getRepliesRequest,
  getRepliesSuccess,
  getRepliesFailed,
  createReplyRequest,
  createReplySuccess,
  createReplyFailed,
  addReplyToCache,
} = activityLogRepliesSlice.actions;

export const activityLogRepliesReducer = activityLogRepliesSlice.reducer;

export default activityLogRepliesSlice.reducer;


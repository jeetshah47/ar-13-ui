import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ActivityLogsState, ActivityLogItem } from "../../types/ActivityLogs/ActivityLog";

const initialState: ActivityLogsState = {
  api: {
    data: {
      items: [],
    },
    loading: false,
    error: "",
  },
};

const activityLogsSlice = createSlice({
  name: "activityLogs",
  initialState,
  reducers: {
    getActivityLogsRequest(state) {
      state.api.loading = true;
      state.api.error = "";
      state.api.data.items = [];
    },
    getActivityLogsSuccess(
      state,
      action: PayloadAction<{ items: ActivityLogItem[] }>
    ) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.items = action.payload.items;
    },
    getActivityLogsFailed(state, action: PayloadAction<{ error: string }>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
      state.api.data.items = [];
    },
  },
});

export const {
  getActivityLogsRequest,
  getActivityLogsSuccess,
  getActivityLogsFailed,
} = activityLogsSlice.actions;

export const activityLogsReducer = activityLogsSlice.reducer;



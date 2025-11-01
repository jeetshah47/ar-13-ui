import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProjectDetailState } from "./projectDetailTypes";
import type { TaskResponse } from "../../types/Task/TaskResponse";
import type { ProjectDetailResponse } from "../../types/Project/ProjectDetailResponse";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";

// Map API status values to Chips component status values
const mapStatusToChipsFormat = (status: string): string => {
  const statusLower = status.toLowerCase().trim().replace(/-/g, " ");
  
  // Map common status values to Chips format
  const statusMap: Record<string, string> = {
    "to do": "pending",
    "todo": "pending",
    "pending": "pending",
    "in progress": "progress",
    "inprogress": "progress",
    "progress": "progress",
    "review": "review",
    "done": "success",
    "success": "success",
    "completed": "success",
  };

  return statusMap[statusLower] || "pending";
};

const initialState: ProjectDetailState = {
  api: {
    data: {
      taskDetails: null,
      projectDetails: null,
    },
    error: "",
    loading: false,
  },
  common: {
    currentStatus: "pending",
  },
};

const projectDetailSlice = createSlice({
  name: "projectDetail",
  initialState,
  reducers: {
    fetchProjectDetailRequest(state) {
      state.api.loading = true;
      state.api.error = "";
      state.api.data.taskDetails = null;
      state.api.data.projectDetails = null;
    },
    fetchProjectDetailSuccess(
      state,
      action: PayloadAction<{
        taskDetails: TaskResponse;
        projectDetails: ProjectDetailResponse['projectDetails'];
      }>
    ) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.taskDetails = action.payload.taskDetails;
      state.api.data.projectDetails = action.payload.projectDetails;
      state.common.currentStatus = mapStatusToChipsFormat(action.payload.taskDetails.status);
    },
    fetchProjectDetailFailed(state, action: PayloadAction<ProjectErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
      state.api.data.taskDetails = null;
      state.api.data.projectDetails = null;
    },
    updateTaskStatus(state, action: PayloadAction<string>) {
      if (state.api.data.taskDetails) {
        // action.payload is the Chips format status (e.g., "progress", "pending")
        // We need to keep the original status format in taskDetails for API consistency
        // But map it to Chips format for currentStatus
        state.common.currentStatus = action.payload;
      }
    },
    clearProjectDetail(state) {
      state.api.data.taskDetails = null;
      state.api.data.projectDetails = null;
      state.api.error = "";
      state.api.loading = false;
      state.common.currentStatus = "pending";
    },
  },
});

export const {
  fetchProjectDetailRequest,
  fetchProjectDetailSuccess,
  fetchProjectDetailFailed,
  updateTaskStatus,
  clearProjectDetail,
} = projectDetailSlice.actions;

export const projectDetailReducer = projectDetailSlice.reducer;

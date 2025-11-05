import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProjectDetailState } from "./projectDetailTypes";
import type { TaskResponse } from "../../types/Task/TaskResponse";
import type { ProjectDetailResponse } from "../../types/Project/ProjectDetailResponse";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";
import { mapStatusToUnified, type TaskStatus } from "../../../pages/Projects/constants/taskStatus.constants";

// Map API status values to unified status format
const mapStatusToUnifiedFormat = (status: string): TaskStatus => {
  return mapStatusToUnified(status);
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
    currentStatus: "pending" as TaskStatus,
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
      state.common.currentStatus = mapStatusToUnifiedFormat(action.payload.taskDetails.status);
    },
    fetchProjectDetailFailed(state, action: PayloadAction<ProjectErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
      state.api.data.taskDetails = null;
      state.api.data.projectDetails = null;
    },
    updateTaskStatus(state, action: PayloadAction<TaskStatus>) {
      if (state.api.data.taskDetails) {
        // action.payload is the unified status format
        state.common.currentStatus = action.payload;
      }
    },
    clearProjectDetail(state) {
      state.api.data.taskDetails = null;
      state.api.data.projectDetails = null;
      state.api.error = "";
      state.api.loading = false;
      state.common.currentStatus = "pending" as TaskStatus;
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

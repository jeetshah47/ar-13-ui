import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProjectStatisticsState } from "./projectStatisticsTypes";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";
import type { ProjectStatisticsResponse } from "../../types/Project/ProjectStatisticsResponse";
import type { ProjectStatistics } from "../../types/Project/ProjectStatisticsResponse";

const initialState: ProjectStatisticsState = {
  api: {
    data: null,
    error: "",
    loading: false,
  },
  singleProject: {
    data: null,
    error: "",
    loading: false,
  },
};

const projectStatisticsSlice = createSlice({
  name: "projectStatistics",
  initialState,
  reducers: {
    getProjectStatisticsRequest(state) {
      state.api.loading = true;
      state.api.error = "";
      state.api.data = null;
    },
    getProjectStatisticsSuccess(
      state,
      action: PayloadAction<ProjectStatisticsResponse>
    ) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data = action.payload;
    },
    getProjectStatisticsFailed(
      state,
      action: PayloadAction<ProjectErrorResponse>
    ) {
      state.api.loading = false;
      state.api.error = action.payload.error;
      state.api.data = null;
    },
    getSingleProjectStatisticsRequest(state) {
      state.singleProject.loading = true;
      state.singleProject.error = "";
      state.singleProject.data = null;
    },
    getSingleProjectStatisticsSuccess(
      state,
      action: PayloadAction<ProjectStatistics>
    ) {
      state.singleProject.loading = false;
      state.singleProject.error = "";
      state.singleProject.data = action.payload;
    },
    getSingleProjectStatisticsFailed(
      state,
      action: PayloadAction<ProjectErrorResponse>
    ) {
      state.singleProject.loading = false;
      state.singleProject.error = action.payload.error;
      state.singleProject.data = null;
    },
  },
});

export const {
  getProjectStatisticsRequest,
  getProjectStatisticsSuccess,
  getProjectStatisticsFailed,
  getSingleProjectStatisticsRequest,
  getSingleProjectStatisticsSuccess,
  getSingleProjectStatisticsFailed,
} = projectStatisticsSlice.actions;

export const projectStatisticsReducer = projectStatisticsSlice.reducer;


import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProjectStatisticsState } from "./projectStatisticsTypes";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";
import type { ProjectStatisticsResponse } from "../../types/Project/ProjectStatisticsResponse";

const initialState: ProjectStatisticsState = {
  api: {
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
  },
});

export const {
  getProjectStatisticsRequest,
  getProjectStatisticsSuccess,
  getProjectStatisticsFailed,
} = projectStatisticsSlice.actions;

export const projectStatisticsReducer = projectStatisticsSlice.reducer;


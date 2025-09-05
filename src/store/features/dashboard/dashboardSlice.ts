import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardState } from "./dashboardTypes";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";
import type { DashboardResponse } from "../../types/Dashboard/DashboardResponse";

const initialState: DashboardState = {
  api: {
    data: {
      datas: {
        employees: [],
        projects: [],
      },
    },
    error: "",
    loading: false,
  },
};

const dashboardStatsSlice = createSlice({
  name: "common/auth",
  initialState,
  reducers: {
    getDashboardStatsRequest(state) {
      state.api.loading = true;
      state.api.error = "";
      state.api.data.datas = { employees: [], projects: [] };
    },
    getDashboardStatsSuccess(
      state,
      action: PayloadAction<{ datas: DashboardResponse }>
    ) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.datas = action.payload.datas;
    },
    getDashboardStatsFailed(
      state,
      action: PayloadAction<ProjectErrorResponse>
    ) {
      state.api.loading = false;
      state.api.error = action.payload.error;
      state.api.data.datas = { employees: [], projects: [] };
    },
  },
});

export const {
  getDashboardStatsRequest,
  getDashboardStatsSuccess,
  getDashboardStatsFailed,
} = dashboardStatsSlice.actions;

export const dashboardReducer = dashboardStatsSlice.reducer;

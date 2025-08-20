import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProjectState } from "./projectTypes";
import type { ProjectResponse } from "../../types/Project/ProjectResponse";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";

const initialState: ProjectState = {
  api: {
    data: {
      projects: [],
    },
    error: "",
    loading: false,
  },
  common: {
    selectedProjectId: "",
  },
};

const projectListSlice = createSlice({
  name: "common/auth",
  initialState,
  reducers: {
    getProjectListRequest(state) {
      state.api.loading = true;
      state.api.error = "";
      state.api.data.projects = [];
      state.common.selectedProjectId = "";
    },
    getProjectListSuccess(
      state,
      action: PayloadAction<{ projects: ProjectResponse[] }>
    ) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.projects = action.payload.projects;
      state.common.selectedProjectId = "";
    },
    getProjectListFailed(state, action: PayloadAction<ProjectErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
      state.api.data.projects = [];
      state.common.selectedProjectId = "";
    },
    updateSelectedProjectId(state, action: PayloadAction<string>) {
      state.common.selectedProjectId = action.payload;
    },
  },
});

export const {
  getProjectListRequest,
  getProjectListSuccess,
  getProjectListFailed,
  updateSelectedProjectId
} = projectListSlice.actions;

export const projectListReducer = projectListSlice.reducer;

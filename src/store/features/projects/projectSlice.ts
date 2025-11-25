import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProjectState } from "./projectTypes";
import type { ProjectResponse } from "../../types/Project/ProjectResponse";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";

const initialState: ProjectState = {
  api: {
    data: {
      projects: [],
      filteredProjects: [],
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
      state.api.data.filteredProjects = [];
      state.common.selectedProjectId = "";
    },
    getProjectListSuccess(
      state,
      action: PayloadAction<{ projects: ProjectResponse[] }>
    ) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.projects = action.payload.projects;
      // Filtered projects will be set by the action
      state.common.selectedProjectId = "";
    },
    getProjectListFailed(state, action: PayloadAction<ProjectErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
      state.api.data.projects = [];
      state.api.data.filteredProjects = [];
      state.common.selectedProjectId = "";
    },
    updateSelectedProjectId(state, action: PayloadAction<string>) {
      state.common.selectedProjectId = action.payload;
    },
    addProjectRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    addProjectSuccess(state, action: PayloadAction<ProjectResponse>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.projects.push(action.payload);
    },
    addProjectFailed(state, action: PayloadAction<ProjectErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
    setFilteredProjects(state, action: PayloadAction<ProjectResponse[]>) {
      state.api.data.filteredProjects = action.payload;
    },
    updateProjectRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    updateProjectSuccess(state, action: PayloadAction<ProjectResponse>) {
      state.api.loading = false;
      state.api.error = "";
      const index = state.api.data.projects.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.api.data.projects[index] = action.payload;
      }
      // Update filtered projects if the updated project is in the filtered list
      const filteredIndex = state.api.data.filteredProjects.findIndex(
        (p) => p.id === action.payload.id
      );
      if (filteredIndex !== -1) {
        state.api.data.filteredProjects[filteredIndex] = action.payload;
      }
    },
    updateProjectFailed(state, action: PayloadAction<ProjectErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
  },
});

export const {
  getProjectListRequest,
  getProjectListSuccess,
  getProjectListFailed,
  updateSelectedProjectId,
  addProjectRequest,
  addProjectSuccess,
  addProjectFailed,
  setFilteredProjects,
  updateProjectRequest,
  updateProjectSuccess,
  updateProjectFailed,
} = projectListSlice.actions;

export const projectListReducer = projectListSlice.reducer;

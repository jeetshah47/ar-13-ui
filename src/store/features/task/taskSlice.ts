import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TaskState } from "./taskTypes";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";
import type { TaskResponse } from "../../types/Task/TaskResponse";

const initialState: TaskState = {
  api: {
    data: {
      tasks: [],
    },
    error: "",
    loading: false,
  },
};

const taskListSlice = createSlice({
  name: "common/auth",
  initialState,
  reducers: {
    getTaskListRequest(state) {
      state.api.loading = true;
      state.api.error = "";
      state.api.data.tasks = [];
    },
    getTaskListSuccess(state, action: PayloadAction<{ tasks: TaskResponse[] }>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.tasks = action.payload.tasks;
    },
    getTaskListFailed(state, action: PayloadAction<ProjectErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
      state.api.data.tasks = [];
    },
  },
});

export const { getTaskListRequest, getTaskListSuccess, getTaskListFailed } =
  taskListSlice.actions;

export const taskListReducer = taskListSlice.reducer;

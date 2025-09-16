import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TaskState } from "./taskTypes";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";
import type { TaskResponse } from "../../types/Task/TaskResponse";
import type { ActivityLog, FileAttachment } from "../../types/Task/TaskTypes";

const initialState: TaskState = {
  api: {
    data: {
      tasks: [],
      activityLogs: [],
      fileAttachments: [],
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
    },
    addTaskRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    addTaskSuccess(state) {
      state.api.loading = false;
      state.api.error = "";
    },
    addTaskFailed(state, action: PayloadAction<ProjectErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
    updateTaskRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    updateTaskSuccess(state) {
      state.api.loading = false;
      state.api.error = "";
    },
    updateTaskFailed(state, action: PayloadAction<ProjectErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
    deleteTaskRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    deleteTaskSuccess(state) {
      state.api.loading = false;
      state.api.error = "";
    },
    deleteTaskFailed(state, action: PayloadAction<ProjectErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
    addTimeSpentRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    addTimeSpentSuccess(state) {
      state.api.loading = false;
      state.api.error = "";
    },
    addTimeSpentFailed(state, action: PayloadAction<ProjectErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
    getActivityLogsRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    getActivityLogsSuccess(state, action: PayloadAction<{ activityLogs: ActivityLog[] }>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.activityLogs = action.payload.activityLogs;
    },
    getActivityLogsFailed(state, action: PayloadAction<ProjectErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
    getFileAttachmentsRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    getFileAttachmentsSuccess(state, action: PayloadAction<{ attachments: FileAttachment[] }>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.fileAttachments = action.payload.attachments;
    },
    getFileAttachmentsFailed(state, action: PayloadAction<ProjectErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
    addFileAttachmentRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    addFileAttachmentSuccess(state) {
      state.api.loading = false;
      state.api.error = "";
    },
    addFileAttachmentFailed(state, action: PayloadAction<ProjectErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
  },
});

export const {
  getTaskListRequest,
  getTaskListSuccess,
  getTaskListFailed,
  addTaskRequest,
  addTaskSuccess,
  addTaskFailed,
  updateTaskRequest,
  updateTaskSuccess,
  updateTaskFailed,
  deleteTaskRequest,
  deleteTaskSuccess,
  deleteTaskFailed,
  addTimeSpentRequest,
  addTimeSpentSuccess,
  addTimeSpentFailed,
  getActivityLogsRequest,
  getActivityLogsSuccess,
  getActivityLogsFailed,
  getFileAttachmentsRequest,
  getFileAttachmentsSuccess,
  getFileAttachmentsFailed,
  addFileAttachmentRequest,
  addFileAttachmentSuccess,
  addFileAttachmentFailed,
} = taskListSlice.actions;

export const taskListReducer = taskListSlice.reducer;

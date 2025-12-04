import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TaskState } from "./taskTypes";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";
import type { TaskResponse } from "../../types/Task/TaskResponse";
import type { ActivityLog, FileAttachment, TaskStatus } from "../../types/Task/TaskTypes";

const initialState: TaskState = {
  api: {
    data: {
      tasks: [],
      filteredTasks: [],
      activityLogs: [],
      fileAttachments: [],
      taskStatuses: [],
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
      state.api.data.filteredTasks = [];
    },
    getTaskListSuccess(state, action: PayloadAction<{ tasks: TaskResponse[] }>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.tasks = action.payload.tasks;
      // Filtered tasks will be set by the action
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
    addMultipleTasksRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    addMultipleTasksSuccess(state) {
      state.api.loading = false;
      state.api.error = "";
    },
    addMultipleTasksFailed(state, action: PayloadAction<ProjectErrorResponse>) {
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
    claimTaskRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    claimTaskSuccess(state) {
      state.api.loading = false;
      state.api.error = "";
    },
    claimTaskFailed(state, action: PayloadAction<ProjectErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
    transferTaskRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    transferTaskSuccess(state) {
      state.api.loading = false;
      state.api.error = "";
    },
    transferTaskFailed(state, action: PayloadAction<ProjectErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
    setFilteredTasks(state, action: PayloadAction<TaskResponse[]>) {
      state.api.data.filteredTasks = action.payload;
    },
    getTaskStatusesRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    getTaskStatusesSuccess(state, action: PayloadAction<{ statuses: TaskStatus[] }>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.taskStatuses = action.payload.statuses;
    },
    getTaskStatusesFailed(state, action: PayloadAction<ProjectErrorResponse>) {
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
  addMultipleTasksRequest,
  addMultipleTasksSuccess,
  addMultipleTasksFailed,
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
  claimTaskRequest,
  claimTaskSuccess,
  claimTaskFailed,
  transferTaskRequest,
  transferTaskSuccess,
  transferTaskFailed,
  setFilteredTasks,
  getTaskStatusesRequest,
  getTaskStatusesSuccess,
  getTaskStatusesFailed,
} = taskListSlice.actions;

export const taskListReducer = taskListSlice.reducer;

import { getAllTaskByProjectId } from "../../apis/taskApis";
import type { AppDispatch, RootState } from "../../store";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";
import {
  getTaskListRequest,
  getTaskListSuccess,
  getTaskListFailed,
  setFilteredTasks,
} from "./taskSlice";
import { filterTasksByRole } from "../../utils/projectFiltering";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import {
  addTask,
  addMultipleTasks,
  updateTask,
  deleteTask,
  addTimeSpent,
  getActivityLogs,
  getFileAttachments,
  addFileAttachment,
  claimTask,
} from "../../apis/taskApis";
import type { ITask } from "../../types/Task/Task";
import type { TaskResponse } from "../../types/Task/TaskResponse";
import {
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
} from "./taskSlice";

export const getTaskListAction =
  (projectId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(getTaskListRequest());
    try {
      getAllTaskByProjectId(projectId)
        .then((data: { tasks: TaskResponse[] }) => {
          dispatch(getTaskListSuccess(data));
          
          // Apply role-based filtering
          const state = getState();
          const userRole = state.authReducer.user.role;
          const userId = state.authReducer.api.uid;
          
          if (userRole && userId) {
            const filteredTasks = filterTasksByRole(data.tasks, userRole, userId);
            dispatch(setFilteredTasks(filteredTasks));
          }
        })
        .catch((error: AxiosError<ProjectErrorResponse>) => {
          if (error?.response?.data) {
            dispatch(getTaskListFailed(error?.response?.data));
          }
        });
    } catch {
      toast.success("Failed to get tasks");
      dispatch(getTaskListFailed({ error: "Unkown Error" }));
    }
  };

export const addTaskAction = (task: ITask) => async (dispatch: AppDispatch) => {
  dispatch(addTaskRequest());
  try {
    addTask(task)
      .then(() => {
        dispatch(addTaskSuccess());
        toast.success("Task added successfully");
      })
      .catch((error: AxiosError<ProjectErrorResponse>) => {
        if (error?.response?.data) {
          dispatch(addTaskFailed(error?.response?.data));
          toast.error(`Failed to add task, ${error?.response?.data?.error}`);
        }
      });
  } catch {
    toast.success("Failed to add task");
    dispatch(addTaskFailed({ error: "Unknown Error" }));
  }
};

export const addMultipleTasksAction = (tasks: ITask[]) => async (dispatch: AppDispatch) => {
  dispatch(addMultipleTasksRequest());
  try {
    const response = await addMultipleTasks(tasks);
    dispatch(addMultipleTasksSuccess());
    toast.success(response.message || `${response.count} task(s) added successfully`);
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ProjectErrorResponse>;
    if (axiosError?.response?.data) {
      dispatch(addMultipleTasksFailed(axiosError.response.data));
      toast.error(`Failed to add tasks: ${axiosError.response.data.error}`);
    } else {
      dispatch(addMultipleTasksFailed({ error: "Unknown Error" }));
      toast.error("Failed to add tasks");
    }
  }
};

export const updateTaskAction = (task: ITask) => async (dispatch: AppDispatch) => {
  dispatch(updateTaskRequest());
  try {
    updateTask(task)
      .then(() => {
        dispatch(updateTaskSuccess());
      })
      .catch((error: AxiosError<ProjectErrorResponse>) => {
        if (error?.response?.data) {
          dispatch(updateTaskFailed(error?.response?.data));
        }
      });
  } catch {
    toast.success("Failed to update task");
    dispatch(updateTaskFailed({ error: "Unknown Error" }));
  }
};

export const deleteTaskAction = (taskId: string, projectId: string) => async (dispatch: AppDispatch) => {
  dispatch(deleteTaskRequest());
  try {
    deleteTask(taskId, projectId)
      .then(() => {
        dispatch(deleteTaskSuccess());
      })
      .catch((error: AxiosError<ProjectErrorResponse>) => {
        if (error?.response?.data) {
          dispatch(deleteTaskFailed(error?.response?.data));
        }
      });
  } catch {
    toast.success("Failed to delete task");
    dispatch(deleteTaskFailed({ error: "Unknown Error" }));
  }
};

export const addTimeSpentAction = 
  (projectId: string, taskId: string, timeSpentData: { date: string; hours: number; minutes: number; description: string }) =>
  async (dispatch: AppDispatch) => {
    dispatch(addTimeSpentRequest());
    try {
      await addTimeSpent(projectId, taskId, timeSpentData);
      dispatch(addTimeSpentSuccess());
      toast.success("Time logged successfully");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ProjectErrorResponse>;
      if (axiosError?.response?.data) {
        dispatch(addTimeSpentFailed(axiosError.response.data));
        toast.error(`Failed to log time: ${axiosError.response.data.error}`);
      } else {
        dispatch(addTimeSpentFailed({ error: "Unknown Error" }));
        toast.error("Failed to log time");
      }
    }
  };

export const getActivityLogsAction = 
  (projectId: string, taskId: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(getActivityLogsRequest());
    try {
      const data = await getActivityLogs(projectId, taskId);
      dispatch(getActivityLogsSuccess(data));
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ProjectErrorResponse>;
      if (axiosError?.response?.data) {
        dispatch(getActivityLogsFailed(axiosError.response.data));
        toast.error(`Failed to fetch activity logs: ${axiosError.response.data.error}`);
      } else {
        dispatch(getActivityLogsFailed({ error: "Unknown Error" }));
        toast.error("Failed to fetch activity logs");
      }
    }
  };

export const getFileAttachmentsAction = 
  (projectId: string, taskId: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(getFileAttachmentsRequest());
    try {
      const data = await getFileAttachments(projectId, taskId);
      dispatch(getFileAttachmentsSuccess(data));
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ProjectErrorResponse>;
      if (axiosError?.response?.data) {
        dispatch(getFileAttachmentsFailed(axiosError.response.data));
        toast.error(`Failed to fetch file attachments: ${axiosError.response.data.error}`);
      } else {
        dispatch(getFileAttachmentsFailed({ error: "Unknown Error" }));
        toast.error("Failed to fetch file attachments");
      }
    }
  };

export const addFileAttachmentAction = 
  (projectId: string, taskId: string, file: File) =>
  async (dispatch: AppDispatch) => {
    dispatch(addFileAttachmentRequest());
    try {
      const response = await addFileAttachment(projectId, taskId, file);
      dispatch(addFileAttachmentSuccess());
      toast.success(response.message || "File uploaded successfully");
      // Refresh file attachments after successful upload
      dispatch(getFileAttachmentsAction(projectId, taskId));
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ProjectErrorResponse>;
      if (axiosError?.response?.data) {
        dispatch(addFileAttachmentFailed(axiosError.response.data));
        toast.error(`Failed to upload file: ${axiosError.response.data.error}`);
      } else {
        dispatch(addFileAttachmentFailed({ error: "Unknown Error" }));
        toast.error("Failed to upload file");
      }
    }
  };

export const claimTaskAction = 
  (projectId: string, taskId: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(claimTaskRequest());
    try {
      const response = await claimTask(projectId, taskId);
      dispatch(claimTaskSuccess());
      toast.success(response.message || "Task claimed successfully");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ProjectErrorResponse | { message?: string }>;
      if (axiosError?.response?.data) {
        const errorData = axiosError.response.data;
        const errorMessage = (errorData as ProjectErrorResponse).error || (errorData as { message?: string }).message;
        dispatch(claimTaskFailed(errorData as ProjectErrorResponse));
        
        // Handle specific error cases
        if (axiosError.response.status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else if (axiosError.response.status === 403) {
          toast.error("You are not part of this project.");
        } else if (axiosError.response.status === 404) {
          toast.error("Task or project not found.");
        } else {
          toast.error(errorMessage || "Failed to claim task");
        }
      } else {
        dispatch(claimTaskFailed({ error: "Unknown Error" }));
        toast.error("Failed to claim task");
      }
    }
  };

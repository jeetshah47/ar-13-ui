import { getAllTaskByProjectId } from "../../apis/taskApis";
import type { AppDispatch } from "../../store";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";
import {
  getTaskListRequest,
  getTaskListSuccess,
  getTaskListFailed,
} from "./taskSlice";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import {
  addTask,
  updateTask,
  deleteTask,
  addTimeSpent,
  getActivityLogs,
  getFileAttachments,
  addFileAttachment,
} from "../../apis/taskApis";
import type { ITask } from "../../types/Task/Task";
import type { TaskResponse } from "../../types/Task/TaskResponse";
import {
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
} from "./taskSlice";

export const getTaskListAction =
  (projectId: string) => async (dispatch: AppDispatch) => {
    dispatch(getTaskListRequest());
    try {
      getAllTaskByProjectId(projectId)
        .then((data: { tasks: TaskResponse[] }) => {
          dispatch(getTaskListSuccess(data));
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

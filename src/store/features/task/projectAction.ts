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

import type { AppDispatch, RootState } from "../../store";
import {
  fetchProjectDetailRequest,
  fetchProjectDetailSuccess,
  fetchProjectDetailFailed,
  updateTaskStatus,
} from "./projectDetailSlice";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { getTaskDetailById, updateTask } from "../../apis/taskApis";
import { getProjectDetails } from "../../apis/projectApis";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";
import type { ITask } from "../../types/Task/Task";
import type { TaskResponse } from "../../types/Task/TaskResponse";

export const fetchProjectDetailAction =
  (taskId: string, projectId: string) => async (dispatch: AppDispatch) => {
    dispatch(fetchProjectDetailRequest());
    try {
      // Fetch both task and project details in parallel
      const [taskResponse, projectResponse] = await Promise.all([
        getTaskDetailById(projectId, taskId),
        getProjectDetails(projectId),
      ]);

      dispatch(
        fetchProjectDetailSuccess({
          taskDetails: taskResponse.task,
          projectDetails: projectResponse.projectDetails,
        })
      );
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ProjectErrorResponse>;
      if (axiosError?.response?.data) {
        dispatch(fetchProjectDetailFailed(axiosError.response.data));
        toast.error(`Failed to load details: ${axiosError.response.data.error}`);
      } else {
        dispatch(fetchProjectDetailFailed({ error: "Unknown Error" }));
        toast.error("Failed to load task or project details");
      }
    }
  };

export const updateTaskStatusAction =
  (taskId: string, newStatus: string, currentTaskDetails?: TaskResponse) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      // Get current task details from state if not provided
      const state = getState();
      const taskDetails = currentTaskDetails || state.projectDetailReducer.api.data.taskDetails;
      
      if (!taskDetails) {
        toast.error("Task details not found");
        return;
      }

      const updatedTask: ITask = {
        _id: taskId,
        subject: taskDetails.subject,
        code: taskDetails.code,
        status: newStatus,
        duration: new Date(taskDetails.duration),
        priority: taskDetails.priority,
        assignTo: taskDetails.assignTo,
        projectId: taskDetails.projectId,
        createdAt: new Date(taskDetails.created._seconds * 1000),
        updatedAt: new Date(),
      };

      await updateTask(updatedTask);
      dispatch(updateTaskStatus(newStatus));
      toast.success("Task status updated successfully");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ProjectErrorResponse>;
      if (axiosError?.response?.data) {
        toast.error(`Failed to update task: ${axiosError.response.data.error}`);
      } else {
        toast.error("Failed to update task status");
      }
    }
  };

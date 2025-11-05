import type { AppDispatch, RootState } from "../../store";
import {
  fetchProjectDetailRequest,
  fetchProjectDetailSuccess,
  fetchProjectDetailFailed,
  updateTaskStatus,
} from "./projectDetailSlice";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { getTaskDetailById, updateTaskStatus as updateTaskStatusApi } from "../../apis/taskApis";
import { getProjectDetails } from "../../apis/projectApis";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";
import type { TaskResponse } from "../../types/Task/TaskResponse";
import { mapStatusToUnified, type TaskStatus } from "../../../pages/Projects/constants/taskStatus.constants";

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

// Map unified status to API format (for backward compatibility with API)
const mapStatusToApiFormat = (status: TaskStatus | string): string => {
  // First normalize to unified format
  const unifiedStatus = mapStatusToUnified(status);
  
  // Return the unified status as-is (API should accept the unified format)
  return unifiedStatus;
};

export const updateTaskStatusAction =
  (taskId: string, newStatus: string, projectId: string, currentTaskDetails?: TaskResponse) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      // Get current task details from state if not provided
      const state = getState();
      const taskDetails = currentTaskDetails || state.projectDetailReducer.api.data.taskDetails;
      
      if (!taskDetails) {
        toast.error("Task details not found");
        return;
      }

      if (!projectId) {
        toast.error("Project ID not found");
        return;
      }

      // Map status to API format
      const apiStatus = mapStatusToApiFormat(newStatus);

      // Call the new API endpoint
      await updateTaskStatusApi(projectId, taskId, apiStatus);
      
      // Update the local state
      dispatch(updateTaskStatus(newStatus));
      
      // Refresh task details to get the latest status from server
      dispatch(fetchProjectDetailAction(taskId, projectId));
      
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

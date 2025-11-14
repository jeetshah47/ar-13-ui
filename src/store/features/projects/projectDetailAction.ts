import type { AppDispatch, RootState } from "../../store";
import {
  fetchProjectDetailRequest,
  fetchProjectDetailSuccess,
  fetchProjectDetailFailed,
  updateTaskStatus,
  fetchProjectInfoRequest,
  fetchProjectInfoSuccess,
  fetchProjectInfoFailed,
} from "./projectDetailSlice";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { getTaskDetailById, updateTaskStatus as updateTaskStatusApi } from "../../apis/taskApis";
import { getProjectDetails } from "../../apis/projectApis";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";
import type { ProjectDetailResponse } from "../../types/Project/ProjectDetailResponse";
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
  (taskId: string, newStatus: string, projectId: string, remark: string, currentTaskDetails?: TaskResponse) =>
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

      // Call the new API endpoint with status and remark
      await updateTaskStatusApi(projectId, taskId, apiStatus, remark);
      
      // Update the local state - convert to TaskStatus type
      const unifiedStatus = mapStatusToUnified(newStatus);
      dispatch(updateTaskStatus(unifiedStatus));
      
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

export const fetchProjectInfoAction =
  (projectId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(fetchProjectInfoRequest());
    try {
      const projectResponse = await getProjectDetails(projectId);
      
      // Handle different response structures
      // The API might return { projectDetails: {...} } or just the project object directly
      let projectDetails: ProjectDetailResponse['projectDetails'] | null = null;
      
      if (projectResponse) {
        // Check if response has projectDetails property (wrapped response)
        if ('projectDetails' in projectResponse && projectResponse.projectDetails) {
          projectDetails = projectResponse.projectDetails;
        }
        // Check if response is the project object directly (has id, title, etc.)
        else if ('id' in projectResponse && 'title' in projectResponse) {
          // Type assertion: treat the response as project details
          projectDetails = projectResponse as unknown as ProjectDetailResponse['projectDetails'];
        }
      }
      
      if (projectDetails) {
        dispatch(
          fetchProjectInfoSuccess({
            projectDetails,
          })
        );
      } else {
        // If we can't parse the response, try to use project from store as fallback
        const state = getState();
        const projectFromStore = state.projectListReducer.api.data.projects.find(
          (p) => p.id === projectId
        );
        
        if (projectFromStore) {
          dispatch(
            fetchProjectInfoSuccess({
              projectDetails: {
                ...projectFromStore,
                assignes: undefined,
                priority: undefined,
                deadline: projectFromStore.deadLine,
              },
            })
          );
        } else {
          dispatch(fetchProjectInfoFailed({ error: "Invalid response from server" }));
        }
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ProjectErrorResponse>;
      const errorMessage = 
        axiosError?.response?.data?.error || 
        axiosError?.message || 
        "Failed to load project details";
      
      // Check if we have project in store as fallback
      const state = getState();
      const projectFromStore = state.projectListReducer.api.data.projects.find(
        (p) => p.id === projectId
      );
      
      if (projectFromStore) {
        // Convert ProjectResponse to ProjectDetailResponse format
        dispatch(
          fetchProjectInfoSuccess({
            projectDetails: {
              ...projectFromStore,
              assignes: undefined,
              priority: undefined,
              deadline: projectFromStore.deadLine,
            },
          })
        );
      } else {
        dispatch(fetchProjectInfoFailed({ error: errorMessage }));
        toast.error(`Failed to load project: ${errorMessage}`);
      }
    }
  };

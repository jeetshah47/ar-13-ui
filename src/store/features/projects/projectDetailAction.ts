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
import { normalizeTaskStatus, type TaskStatus } from "../../../pages/Projects/constants/taskStatus.constants";
import { handleActionError, isAdminAccessError } from "../../../utils/errorUtils";

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
          projectDetails: projectResponse.project || projectResponse.projectDetails,
        })
      );
    } catch (error: unknown) {
      const errorMessage = handleActionError(error, false);
      const axiosError = error as AxiosError<ProjectErrorResponse>;
      
      if (axiosError?.response?.data) {
        dispatch(fetchProjectDetailFailed(axiosError.response.data));
      } else {
        dispatch(fetchProjectDetailFailed({ error: errorMessage }));
      }
      
      // Only show toast if not an admin access error (handled globally)
      if (!isAdminAccessError(errorMessage)) {
        toast.error(errorMessage);
      }
    }
  };

// Normalize status to backend format
const normalizeStatusToBackend = (status: TaskStatus | string): string => {
  // Normalize to backend format (backend uses the same status values)
  return normalizeTaskStatus(status);
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

      // Normalize status to backend format
      const apiStatus = normalizeStatusToBackend(newStatus);

      // Call the new API endpoint with status and remark
      await updateTaskStatusApi(projectId, taskId, apiStatus, remark);
      
      // Update the local state - normalize to TaskStatus type
      const normalizedStatus = normalizeTaskStatus(newStatus);
      dispatch(updateTaskStatus(normalizedStatus));
      
      // Refresh task details to get the latest status from server
      dispatch(fetchProjectDetailAction(taskId, projectId));
      
      toast.success("Task status updated successfully");
    } catch (error: unknown) {
      handleActionError(error);
    }
  };

export const fetchProjectInfoAction =
  (projectId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(fetchProjectInfoRequest());
    try {
      const projectResponse = await getProjectDetails(projectId);
      
      // Handle different response structures
      // The API might return { project: {...} }, { projectDetails: {...} } or just the project object directly
      let projectDetails: ProjectDetailResponse['project'] | ProjectDetailResponse['projectDetails'] | null = null;
      
      if (projectResponse) {
        // Check if response has project property (new API format)
        if ('project' in projectResponse && projectResponse.project) {
          projectDetails = projectResponse.project;
        }
        // Check if response has projectDetails property (old API format)
        else if ('projectDetails' in projectResponse && projectResponse.projectDetails) {
          projectDetails = projectResponse.projectDetails;
        }
        // Check if response is the project object directly (has id, title, etc.)
        else if ('id' in projectResponse && 'title' in projectResponse) {
          // Type assertion: treat the response as project details
          projectDetails = projectResponse as unknown as ProjectDetailResponse['project'];
        }
      }
      
      if (projectDetails) {
        dispatch(
          fetchProjectInfoSuccess({
            projectDetails: projectDetails as ProjectDetailResponse['projectDetails'],
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
              created: (() => {
                if (!projectFromStore.created) return undefined;
                if (typeof projectFromStore.created === 'string') return projectFromStore.created;
                if (typeof projectFromStore.created === 'object' && '_seconds' in projectFromStore.created) {
                  return new Date(projectFromStore.created._seconds * 1000).toISOString();
                }
                return undefined;
              })() as string | undefined,
            } as any,
            })
          );
        } else {
          dispatch(fetchProjectInfoFailed({ error: "Invalid response from server" }));
        }
      }
    } catch (error: unknown) {
      const errorMessage = handleActionError(error, false);
      
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
              created: (() => {
                if (!projectFromStore.created) return undefined;
                if (typeof projectFromStore.created === 'string') return projectFromStore.created;
                if (typeof projectFromStore.created === 'object' && '_seconds' in projectFromStore.created) {
                  return new Date(projectFromStore.created._seconds * 1000).toISOString();
                }
                return undefined;
              })() as string | undefined,
            } as any,
          })
        );
      } else {
        const axiosError = error as AxiosError<ProjectErrorResponse>;
        if (axiosError?.response?.data) {
          dispatch(fetchProjectInfoFailed(axiosError.response.data));
        } else {
          dispatch(fetchProjectInfoFailed({ error: errorMessage }));
        }
        
        // Only show toast if not an admin access error
        if (!isAdminAccessError(errorMessage)) {
          toast.error(errorMessage);
        }
      }
    }
  };

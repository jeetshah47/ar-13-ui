import type { AppDispatch, RootState } from "../../store";
import {
  addProjectFailed,
  addProjectRequest,
  addProjectSuccess,
  getProjectListFailed,
  getProjectListRequest,
  getProjectListSuccess,
  setFilteredProjects,
  updateProjectRequest,
  updateProjectSuccess,
  updateProjectFailed,
} from "./projectSlice";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { addProject, getAllProjects, updateProject, updateAgencyContact } from "../../apis/projectApis";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";
import type { ProjectRequest, AgencyContact } from "../../types/Project/ProjectRequest";
import type { ProjectResponse } from "../../types/Project/ProjectResponse";
import { filterProjectsByRole } from "../../utils/projectFiltering";

export const getProjectListAction = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(getProjectListRequest());
  try {
    getAllProjects()
      .then((data) => {
        dispatch(getProjectListSuccess(data));
        
        // Apply role-based filtering
        const state = getState();
        const userRole = state.authReducer.user.role;
        const userId = state.authReducer.api.uid;
        
        if (userRole && userId) {
          const filteredProjects = filterProjectsByRole(data.projects, userRole, userId);
          dispatch(setFilteredProjects(filteredProjects));
        }
      })
      .catch((error: AxiosError<ProjectErrorResponse>) => {
        if (error?.response?.data) {
          dispatch(getProjectListFailed(error?.response?.data));
        }
      });
  } catch {
    toast.success("Failed to get projects");
    dispatch(getProjectListFailed({ error: "Unkown Error" }));
  }
};

export const addProjectAction =
  (project: ProjectRequest, cb?: () => void) =>
  async (dispatch: AppDispatch) => {
    dispatch(addProjectRequest());
    try {
      addProject(project)
        .then((data) => {
          dispatch(addProjectSuccess(data));
          toast.success("Project added successfully");
          if (cb) cb();
        })
        .catch((error: AxiosError<ProjectErrorResponse>) => {
          if (error?.response?.data) {
            dispatch(addProjectFailed(error?.response?.data));
            toast.error("Failed to add project");
          }
        });
    } catch {
      toast.error("Failed to add project");
      dispatch(addProjectFailed({ error: "Unkown Error" }));
    }
  };

export const updateProjectAction =
  (projectId: string, project: ProjectRequest, cb?: () => void) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(updateProjectRequest());
    try {
      updateProject(projectId, project)
        .then(() => {
          // Backend returns { message: "..." }, so we construct ProjectResponse from request data
          // Get existing project from store to preserve id and created fields
          const state = getState();
          const existingProject = state.projectListReducer.api.data.projects.find(
            (p) => p.id === projectId
          );
          
          // Construct updated project response
          const updatedProject: ProjectResponse = {
            id: projectId,
            title: project.title,
            description: project.description,
            ownerId: project.ownerId,
            membersIds: project.membersIds,
            deadLine: project.deadLine,
            created: existingProject?.created || { _seconds: Date.now() / 1000, _nanoseconds: 0 },
          };
          
          dispatch(updateProjectSuccess(updatedProject));
          toast.success("Project updated successfully");
          if (cb) cb();
        })
        .catch((error: AxiosError<ProjectErrorResponse>) => {
          if (error?.response?.data) {
            dispatch(updateProjectFailed(error?.response?.data));
            toast.error("Failed to update project");
          }
        });
    } catch {
      toast.error("Failed to update project");
      dispatch(updateProjectFailed({ error: "Unknown Error" }));
    }
  };

export const updateAgencyContactAction =
  (projectId: string, agencyContact: AgencyContact, cb?: () => void) =>
  async (dispatch: AppDispatch) => {
    try {
      await updateAgencyContact(projectId, agencyContact);
      toast.success("Agency contact updated successfully");
      if (cb) cb();
    } catch (error) {
      const axiosError = error as AxiosError<ProjectErrorResponse>;
      if (axiosError?.response?.data) {
        toast.error("Failed to update agency contact");
      } else {
        toast.error("Failed to update agency contact");
      }
    }
  };

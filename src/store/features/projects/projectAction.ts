import type { AppDispatch, RootState } from "../../store";
import {
  addProjectFailed,
  addProjectRequest,
  addProjectSuccess,
  getProjectListFailed,
  getProjectListRequest,
  getProjectListSuccess,
  setFilteredProjects,
} from "./projectSlice";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { addProject, getAllProjects } from "../../apis/projectApis";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";
import type { ProjectRequest } from "../../types/Project/ProjectRequest";
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

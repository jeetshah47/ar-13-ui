import type { AppDispatch } from "../../store";
import {
  getProjectListFailed,
  getProjectListRequest,
  getProjectListSuccess,
} from "./projectSlice";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { getAllProjects } from "../../apis/projectApis";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";

export const getProjectListAction = () => async (dispatch: AppDispatch) => {
  dispatch(getProjectListRequest());
  try {
    getAllProjects()
      .then((data) => {
        dispatch(getProjectListSuccess(data));
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

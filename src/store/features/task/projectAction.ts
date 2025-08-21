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

export const getTaskListAction =
  (projectId: string) => async (dispatch: AppDispatch) => {
    dispatch(getTaskListRequest());
    try {
      getAllTaskByProjectId(projectId)
        .then((data) => {
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

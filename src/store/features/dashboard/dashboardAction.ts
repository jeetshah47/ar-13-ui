import { getDashboardData } from "../../apis/dashboardApi";
import type { AppDispatch } from "../../store";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";
import {
  getDashboardStatsRequest,
  getDashboardStatsSuccess,
  getDashboardStatsFailed,
} from "./dashboardSlice";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";

export const getDashboardActions =
  (proojectLimit: string, empLimit: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(getDashboardStatsRequest());
    try {
      getDashboardData(proojectLimit, empLimit)
        .then((data) => {
          dispatch(getDashboardStatsSuccess({ datas: data }));
        })
        .catch((error: AxiosError<ProjectErrorResponse>) => {
          if (error?.response?.data) {
            dispatch(getDashboardStatsFailed(error?.response?.data));
          }
        });
    } catch {
      toast.success("Failed to get tasks");
      dispatch(getDashboardStatsFailed({ error: "Unkown Error" }));
    }
  };

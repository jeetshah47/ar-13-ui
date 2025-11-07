import type { AppDispatch } from "../../store";
import {
  getProjectStatisticsRequest,
  getProjectStatisticsSuccess,
  getProjectStatisticsFailed,
} from "./projectStatisticsSlice";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { getAllProjectsStatistics } from "../../apis/projectApis";
import type { ProjectErrorResponse } from "../../types/Project/ProjectErrorResponse";

export const getProjectStatisticsAction =
  () => async (dispatch: AppDispatch) => {
    dispatch(getProjectStatisticsRequest());
    try {
      getAllProjectsStatistics()
        .then((data) => {
          dispatch(getProjectStatisticsSuccess(data));
        })
        .catch((error: AxiosError<ProjectErrorResponse>) => {
          if (error?.response?.data) {
            dispatch(getProjectStatisticsFailed(error?.response?.data));
            toast.error("Failed to get project statistics");
          }
        });
    } catch {
      toast.error("Failed to get project statistics");
      dispatch(getProjectStatisticsFailed({ error: "Unknown Error" }));
    }
  };


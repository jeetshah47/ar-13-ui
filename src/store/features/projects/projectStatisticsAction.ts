import type { AppDispatch } from "../../store";
import {
  getProjectStatisticsRequest,
  getProjectStatisticsSuccess,
  getProjectStatisticsFailed,
  getSingleProjectStatisticsRequest,
  getSingleProjectStatisticsSuccess,
  getSingleProjectStatisticsFailed,
} from "./projectStatisticsSlice";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import { getAllProjectsStatistics, getProjectStatistics } from "../../apis/projectApis";
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

export const getSingleProjectStatisticsAction =
  (projectId: string) => async (dispatch: AppDispatch) => {
    dispatch(getSingleProjectStatisticsRequest());
    try {
      const data = await getProjectStatistics(projectId);
      dispatch(getSingleProjectStatisticsSuccess(data.statistics));
    } catch (error) {
      const axiosError = error as AxiosError<ProjectErrorResponse>;
      if (axiosError?.response?.data) {
        dispatch(getSingleProjectStatisticsFailed(axiosError.response.data));
        toast.error(axiosError.response.data.error || "Failed to get project statistics");
      } else {
        dispatch(getSingleProjectStatisticsFailed({ error: "Unknown Error" }));
        toast.error("Failed to get project statistics");
      }
    }
  };


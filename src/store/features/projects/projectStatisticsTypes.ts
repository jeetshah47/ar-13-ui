import type { ProjectStatisticsResponse } from "../../types/Project/ProjectStatisticsResponse";
import type { ProjectStatistics } from "../../types/Project/ProjectStatisticsResponse";

export interface ProjectStatisticsState {
  api: {
    data: ProjectStatisticsResponse | null;
    loading: boolean;
    error: string;
  };
  singleProject: {
    data: ProjectStatistics | null;
    loading: boolean;
    error: string;
  };
}


import type { ProjectStatisticsResponse } from "../../types/Project/ProjectStatisticsResponse";

export interface ProjectStatisticsState {
  api: {
    data: ProjectStatisticsResponse | null;
    loading: boolean;
    error: string;
  };
}


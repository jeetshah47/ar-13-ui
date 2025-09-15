import type { TaskResponse } from "../../types/Task/TaskResponse";
import type { ProjectDetailResponse } from "../../types/Project/ProjectDetailResponse";

export interface ProjectDetailState {
  api: {
    data: {
      taskDetails: TaskResponse | null;
      projectDetails: ProjectDetailResponse['projectDetails'] | null;
    };
    loading: boolean;
    error: string;
  };
  common: {
    currentStatus: string;
  };
}

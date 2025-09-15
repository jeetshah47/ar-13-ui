import type { ProjectResponse } from "./ProjectResponse";

export interface ProjectDetailResponse {
  projectDetails: ProjectResponse & {
    reporter?: {
      name: string;
      avatar: string;
    };
    assignes?: Array<{
      id: string;
      name: string;
      avatar: string;
    }>;
    priority?: string;
    deadline?: string;
  };
}

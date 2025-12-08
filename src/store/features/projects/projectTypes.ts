import type { ProjectResponse } from "../../types/Project/ProjectResponse";

export interface ProjectState {
  api: {
    data: { 
      projects: ProjectResponse[];
      filteredProjects: ProjectResponse[];
    };
    loading: boolean;
    error: string;
  };
  common: {
    selectedProjectId: string;
    searchQuery: string;
  };
}

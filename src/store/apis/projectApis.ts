import type { ProjectResponse } from "../types/Project/ProjectResponse";
import type { ProjectDetailResponse } from "../types/Project/ProjectDetailResponse";
import { http } from "../../config/http";
import { API_BASE_URL } from "../../config/api";
import type { ProjectRequest } from "../types/Project/ProjectRequest";
import type { ProjectStatisticsResponse } from "../types/Project/ProjectStatisticsResponse";


export async function getAllProjects(): Promise<{
  projects: ProjectResponse[];
}> {
  const url = `${API_BASE_URL}/project/all`;
  //   const token = localStorage.getItem("authToken");
  const result = await http.get(url);
  return result.data;
}

export async function addProject(project: ProjectRequest): Promise<ProjectResponse> {
  const url = `${API_BASE_URL}/project/add`;
  const result = await http.post(url, project);
  return result.data;
}

export async function getProjectDetails(projectId: string): Promise<ProjectDetailResponse> {
  const url = `${API_BASE_URL}/project/${projectId}`;
  const result = await http.get(url);
  return result.data;
}

export async function getAllProjectsStatistics(): Promise<ProjectStatisticsResponse> {
  const url = `${API_BASE_URL}/project/all/statistics`;
  const result = await http.get(url);
  return result.data;
}

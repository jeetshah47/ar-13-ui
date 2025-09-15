import type { ProjectResponse } from "../types/Project/ProjectResponse";
import type { ProjectDetailResponse } from "../types/Project/ProjectDetailResponse";
import { http } from "../../config/http";
import type { ProjectRequest } from "../types/Project/ProjectRequest";


export async function getAllProjects(): Promise<{
  projects: ProjectResponse[];
}> {
  const url = `http://localhost:3000/api/project/all`;
  //   const token = localStorage.getItem("authToken");
  const result = await http.get(url);
  return result.data;
}

export async function addProject(project: ProjectRequest): Promise<ProjectResponse> {
  const url = `http://localhost:3000/api/project/add`;
  const result = await http.post(url, project);
  return result.data;
}

export async function getProjectDetails(projectId: string): Promise<ProjectDetailResponse> {
  const url = `http://localhost:3000/api/project/${projectId}`;
  const result = await http.get(url);
  return result.data;
}

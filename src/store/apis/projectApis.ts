import type { ProjectResponse } from "../types/Project/ProjectResponse";
import type { ProjectDetailResponse } from "../types/Project/ProjectDetailResponse";
import { http } from "../../config/http";
import { API_BASE_URL } from "../../config/api";
import type { ProjectRequest, AgencyContact } from "../types/Project/ProjectRequest";
import type { ProjectStatisticsResponse } from "../types/Project/ProjectStatisticsResponse";


export async function getAllProjects(limit?: number): Promise<{
  projects: ProjectResponse[];
}> {
  const url = `${API_BASE_URL}/project/all`;
  const params = limit ? { limit } : {};
  const result = await http.get(url, { params });
  return result.data;
}

export async function addProject(project: ProjectRequest): Promise<{ message: string }> {
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

export async function getProjectStatistics(projectId: string): Promise<{
  statistics: {
    totalTasks: number;
    completedTasks: number;
    activeTasks: number;
    backlogTasks: number;
    tasksInProgress: number;
    tasksInReview: number;
    pendingTasks: number;
    cancelledTasks: number;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    completionRate: number;
    totalTimeSpent: number;
    assignedUsers: number;
    tasksByAssignee: Record<string, number>;
  };
}> {
  const url = `${API_BASE_URL}/project/${projectId}/statistics`;
  const result = await http.get(url);
  return result.data;
}

export async function updateProject(projectId: string, project: ProjectRequest): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/project/update`;
  // Include project ID in the request body as expected by backend
  const projectWithId = {
    ...project,
    id: projectId,
  };
  const result = await http.put(url, projectWithId);
  return result.data;
}

export async function updateAgencyContact(projectId: string, agencyContact: AgencyContact): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/project/${projectId}/agency-contact`;
  const result = await http.put(url, agencyContact);
  return result.data;
}

export async function archiveProject(projectId: string, isArchived: boolean): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/project/${projectId}/archive`;
  const result = await http.put(url, { isArchived });
  return result.data;
}
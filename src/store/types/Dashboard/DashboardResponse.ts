import type { ProjectResponse } from "../Project/ProjectResponse";
import type { UserResponse } from "../User/UserResponse";

export interface Workload {
  backlogTasks: number;
  tasksInProgress: number;
  tasksInReview: number;
  pendingTasks: number;
  totalTasks: number;
  activeTasks: number;
}

export interface DashboardEmployeeResponse extends Omit<UserResponse, 'created'> {
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  workload: Workload;
}

export interface DashboardResponse {
  employees: DashboardEmployeeResponse[];
  projects: ProjectResponse[];
  totalProjects: number;
  totalEmployees: number;
}

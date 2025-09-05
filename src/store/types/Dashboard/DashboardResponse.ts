import type { ProjectResponse } from "../Project/ProjectResponse";
import type { UserResponse } from "../User/UserResponse";

export interface DashboardResponse {
  employees: UserResponse[];
  projects: ProjectResponse[];
}

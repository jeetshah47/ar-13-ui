import type { ProjectResponse } from '../types/Project/ProjectResponse';
import type { UserRole } from '../types/RBAC';

export const filterProjectsByRole = (
  projects: ProjectResponse[],
  userRole: UserRole,
  userId: string
): ProjectResponse[] => {
  // All users can view all projects (no filtering for read access)
  // Filtering is only applied for write/delete operations, which is handled in useResourceAccess
  return projects;
};

export const filterTasksByRole = (
  tasks: any[],
  userRole: UserRole,
  userId: string
): any[] => {
  // All users can view all tasks (no filtering for read access)
  // Filtering is only applied for write/delete operations, which is handled in useResourceAccess
  return tasks;
};

import type { ProjectResponse } from '../types/Project/ProjectResponse';
import type { UserRole } from '../types/RBAC';

export const filterProjectsByRole = (
  projects: ProjectResponse[],
  _userRole: UserRole,
  _userId: string
): ProjectResponse[] => {
  // All users can view all projects (no filtering for read access)
  // Filtering is only applied for write/delete operations, which is handled in useResourceAccess
  return projects;
};

export const filterTasksByRole = (
  tasks: any[],
  _userRole: UserRole,
  _userId: string
): any[] => {
  // All users can view all tasks (no filtering for read access)
  // Filtering is only applied for write/delete operations, which is handled in useResourceAccess
  return tasks;
};

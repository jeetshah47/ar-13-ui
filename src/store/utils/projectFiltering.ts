import type { ProjectResponse } from '../types/Project/ProjectResponse';
import type { UserRole } from '../types/RBAC';

export const filterProjectsByRole = (
  projects: ProjectResponse[],
  userRole: UserRole,
  userId: string
): ProjectResponse[] => {
  if (userRole === 'Admin') {
    // Admin can see all projects
    return projects;
  }
  
  if (userRole === 'Standard') {
    // Standard users can only see projects they own or are members of
    return projects.filter(project => 
      project.ownerId === userId || 
      (project.membersIds && project.membersIds.includes(userId))
    );
  }
  
  // Default: no access
  return [];
};

export const filterTasksByRole = (
  tasks: any[],
  userRole: UserRole,
  userId: string
): any[] => {
  if (userRole === 'Admin') {
    // Admin can see all tasks
    return tasks;
  }
  
  if (userRole === 'Standard') {
    // Standard users can only see tasks assigned to them
    return tasks.filter(task => 
      task.assignTo && task.assignTo.includes(userId)
    );
  }
  
  // Default: no access
  return [];
};

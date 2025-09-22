import { useAppSelector } from '../store';
import type { ProjectResponse } from '../types/Project/ProjectResponse';
import type { TaskResponse } from '../types/Task/TaskResponse';
import type { ProjectAccess, TaskAccess } from '../types/RBAC';
import { usePermissions } from './usePermissions';

export const useResourceAccess = () => {
  const authState = useAppSelector((state) => state.authReducer);
  const { checkPermission, isAdmin } = usePermissions();
  
  const currentUserId = authState.api.uid;
  
  const getProjectAccess = (project: ProjectResponse): ProjectAccess => {
    const isOwner = project.ownerId === currentUserId;
    const isMember = project.membersIds?.includes(currentUserId) || false;
    
    // Admin has full access to all projects
    if (isAdmin()) {
      return {
        canRead: true,
        canWrite: true,
        canDelete: true,
        canAssign: true,
        isOwner: true,
        isMember: true,
      };
    }
    
    // Standard users can only access projects they own or are members of
    const hasAccess = isOwner || isMember;
    
    return {
      canRead: hasAccess,
      canWrite: false, // Standard users cannot write to projects
      canDelete: false, // Standard users cannot delete projects
      canAssign: false, // Standard users cannot assign tasks
      isOwner,
      isMember,
    };
  };
  
  const getTaskAccess = (task: TaskResponse): TaskAccess => {
    const isAssigned = task.assignTo.includes(currentUserId);
    
    // Admin has full access to all tasks
    if (isAdmin()) {
      return {
        canRead: true,
        canWrite: true,
        canDelete: true,
        canAssign: true,
        isAssigned: true,
      };
    }
    
    // Standard users can only access tasks assigned to them
    return {
      canRead: isAssigned,
      canWrite: isAssigned,
      canDelete: isAssigned,
      canAssign: false, // Standard users cannot assign tasks
      isAssigned,
    };
  };
  
  const canAccessProject = (project: ProjectResponse): boolean => {
    return getProjectAccess(project).canRead;
  };
  
  const canAccessTask = (task: TaskResponse): boolean => {
    return getTaskAccess(task).canRead;
  };
  
  const canModifyProject = (project: ProjectResponse): boolean => {
    return getProjectAccess(project).canWrite;
  };
  
  const canModifyTask = (task: TaskResponse): boolean => {
    return getTaskAccess(task).canWrite;
  };
  
  const canDeleteProject = (project: ProjectResponse): boolean => {
    return getProjectAccess(project).canDelete;
  };
  
  const canDeleteTask = (task: TaskResponse): boolean => {
    return getTaskAccess(task).canDelete;
  };
  
  const canAssignTask = (): boolean => {
    return checkPermission('tasks:assign');
  };
  
  const canApproveVacation = (): boolean => {
    return checkPermission('vacation:approve');
  };
  
  const canManageUsers = (): boolean => {
    return checkPermission('users:write');
  };
  
  return {
    getProjectAccess,
    getTaskAccess,
    canAccessProject,
    canAccessTask,
    canModifyProject,
    canModifyTask,
    canDeleteProject,
    canDeleteTask,
    canAssignTask,
    canApproveVacation,
    canManageUsers,
  };
};

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
    
    // All users can read all projects, but can only write/delete if they own or are members
    const hasWriteAccess = isOwner || isMember;
    
    return {
      canRead: true, // All users can view all projects
      canWrite: hasWriteAccess, // Can only write if owner or member
      canDelete: false, // Standard users cannot delete projects
      canAssign: false, // Standard users cannot assign tasks
      isOwner,
      isMember,
    };
  };
  
  const getTaskAccess = (task: TaskResponse): TaskAccess => {
    // Check if task is assigned to current user (handle both string and array formats)
    const assignToArray = Array.isArray(task.assignTo) ? task.assignTo : (task.assignTo ? [task.assignTo] : []);
    const isAssigned = assignToArray.includes(currentUserId);
    
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
    
    // All users can read all tasks, but can only write/delete if assigned to them
    return {
      canRead: true, // All users can view all tasks
      canWrite: isAssigned, // Can only write if assigned
      canDelete: isAssigned, // Can only delete if assigned
      canAssign: false, // Standard users cannot assign tasks
      isAssigned,
    };
  };
  
  /**
   * Check if user can access (view) a project
   * Standard users can view ALL projects (read-only access)
   * Admin users can view and modify all projects
   */
  const canAccessProject = (project: ProjectResponse): boolean => {
    // All users (both Admin and Standard) can view all projects
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
  
  /**
   * Check if user can claim a task from a project
   * User must be a member of the project (owner or member)
   */
  const canClaimTask = (project: ProjectResponse): boolean => {
    if (isAdmin()) {
      return true; // Admin can claim any task
    }
    
    const isOwner = project.ownerId === currentUserId;
    const isMember = project.membersIds?.includes(currentUserId) || false;
    
    return isOwner || isMember;
  };
  
  /**
   * Check if user can log time for a task
   * User must be assigned to the task
   */
  const canLogTime = (task: TaskResponse): boolean => {
    if (isAdmin()) {
      return true; // Admin can log time for any task
    }
    
    const taskAccess = getTaskAccess(task);
    return taskAccess.canWrite; // Can log time if can write (i.e., assigned)
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
    canClaimTask,
    canLogTime,
  };
};

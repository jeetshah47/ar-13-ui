import React from 'react';
import { useResourceAccess } from '../../../store/hooks/useResourceAccess';
import type { ProjectResponse } from '../../../store/types/Project/ProjectResponse';
import type { TaskResponse } from '../../../store/types/Task/TaskResponse';

interface RequireProjectAccessProps {
  project: ProjectResponse;
  accessType: 'read' | 'write' | 'delete';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequireProjectAccess: React.FC<RequireProjectAccessProps> = ({
  project,
  accessType,
  children,
  fallback = null,
}) => {
  const { canAccessProject, canModifyProject, canDeleteProject } = useResourceAccess();
  
  let hasAccess = false;
  
  switch (accessType) {
    case 'read':
      hasAccess = canAccessProject(project);
      break;
    case 'write':
      hasAccess = canModifyProject(project);
      break;
    case 'delete':
      hasAccess = canDeleteProject(project);
      break;
  }
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

interface RequireTaskAccessProps {
  task: TaskResponse;
  accessType: 'read' | 'write' | 'delete';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequireTaskAccess: React.FC<RequireTaskAccessProps> = ({
  task,
  accessType,
  children,
  fallback = null,
}) => {
  const { canAccessTask, canModifyTask, canDeleteTask } = useResourceAccess();
  
  let hasAccess = false;
  
  switch (accessType) {
    case 'read':
      hasAccess = canAccessTask(task);
      break;
    case 'write':
      hasAccess = canModifyTask(task);
      break;
    case 'delete':
      hasAccess = canDeleteTask(task);
      break;
  }
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

interface RequireProjectOwnershipProps {
  project: ProjectResponse;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequireProjectOwnership: React.FC<RequireProjectOwnershipProps> = ({
  project,
  children,
  fallback = null,
}) => {
  const { getProjectAccess } = useResourceAccess();
  const { isOwner } = getProjectAccess(project);
  
  if (!isOwner) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

interface RequireTaskAssignmentProps {
  task: TaskResponse;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequireTaskAssignment: React.FC<RequireTaskAssignmentProps> = ({
  task,
  children,
  fallback = null,
}) => {
  const { getTaskAccess } = useResourceAccess();
  const { isAssigned } = getTaskAccess(task);
  
  if (!isAssigned) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

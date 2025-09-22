import React from 'react';
import { useAppSelector } from '../../../store/store';
import { useResourceAccess } from '../../../store/hooks/useResourceAccess';
import type { ProjectResponse } from '../../../store/types/Project/ProjectResponse';

interface FilteredProjectListProps {
  children: (filteredProjects: ProjectResponse[]) => React.ReactNode;
}

export const FilteredProjectList: React.FC<FilteredProjectListProps> = ({ children }) => {
  const projectListState = useAppSelector((state) => state.projectListReducer);
  const { canAccessProject } = useResourceAccess();
  
  const allProjects = projectListState.api.data.projects;
  
  // Filter projects based on user's access permissions
  const filteredProjects = allProjects.filter(project => canAccessProject(project));
  
  return <>{children(filteredProjects)}</>;
};

interface FilteredTaskListProps {
  projectId: string;
  children: (filteredTasks: any[]) => React.ReactNode;
}

export const FilteredTaskList: React.FC<FilteredTaskListProps> = ({ projectId, children }) => {
  const taskListState = useAppSelector((state) => state.taskListReducer.api);
  const { canAccessTask } = useResourceAccess();
  
  const allTasks = taskListState.data.tasks || [];
  
  // Filter tasks based on user's access permissions
  const filteredTasks = allTasks.filter(task => canAccessTask(task));
  
  return <>{children(filteredTasks)}</>;
};

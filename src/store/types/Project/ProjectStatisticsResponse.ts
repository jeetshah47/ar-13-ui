export interface ProjectStatistics {
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
  completedTasksByAssignee: Record<string, number>;
}

export interface ProjectWithStatistics {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  membersIds: string[];
  deadLine: string;
  logoUrl: string;
  statistics: ProjectStatistics;
}

export interface ProjectStatisticsResponse {
  projects: ProjectWithStatistics[];
  totalProjects: number;
}


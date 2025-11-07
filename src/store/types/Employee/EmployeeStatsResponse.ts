export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  backlogTasks: number;
  tasksInProgress: number;
  tasksInReview: number;
  pendingTasks: number;
  totalTimeSpent: number;
  averageTimePerTask: number;
  completionRate: number;
}

export interface ProjectStats {
  projectId: string;
  projectName: string;
  stats: TaskStats;
}

export interface TimePeriodStats {
  period: string;
  periodLabel: string;
  stats: TaskStats;
}

export interface TaskDistribution {
  completed: number;
  inprogress: number;
  backlog: number;
  inreview: number;
  pending: number;
}

export interface EmployeeStatsAnalysis {
  productivityTrend: "increasing" | "decreasing" | "stable";
  mostActiveProject: string;
  mostActiveProjectId: string;
  averageCompletionTime: number;
  peakProductivityMonth: string;
  taskDistribution: TaskDistribution;
}

export interface EmployeeStats {
  userId: string;
  name: string;
  email: string;
  period: "month" | "quarter" | "year";
  periodValue: string;
  overall: TaskStats;
  byProject: ProjectStats[];
  byTime: TimePeriodStats[];
  analysis: EmployeeStatsAnalysis;
}

export interface EmployeeStatsResponse {
  stats: EmployeeStats;
}

export interface EmployeeStatsErrorResponse {
  message: string;
  error?: string;
}


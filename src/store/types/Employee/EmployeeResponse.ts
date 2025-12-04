export interface EmployeeResponse {
  userId: string;
  name: string;
  email: string;
  role: "Admin" | "Standard";
  designation?: string;
  backlogTasks: number;
  tasksInProgress: number;
  tasksInReview: number;
  pendingTasks: number;
  totalTasks: number;
  activeTasks?: number;
}

export interface EmployeeListResponse {
  employees: EmployeeResponse[];
  totalEmployees: number;
}

export interface EmployeeErrorResponse {
  message: string;
  error?: string;
}

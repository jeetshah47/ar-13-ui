export interface EmployeeResponse {
  userId: string;
  name: string;
  email: string;
  role: "Admin" | "Standard";
  designation: string;
  backlogTasks: number;
  tasksInProgress: number;
  tasksInReview: number;
  totalTasks: number;
}

export interface EmployeeListResponse {
  employees: EmployeeResponse[];
  totalEmployees: number;
}

export interface EmployeeErrorResponse {
  message: string;
  error?: string;
}

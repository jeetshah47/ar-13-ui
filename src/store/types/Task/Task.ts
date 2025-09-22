export interface ITask {
  id: string;
  subject: string;
  code: string;
  status: string;
  duration: Date | { _seconds: number; _nanoseconds: number } | string;
  priority: string;
  assignTo: string[];
  projectId: string;
  createdAt: Date | { _seconds: number; _nanoseconds: number } | string;
  updatedAt: Date;
}

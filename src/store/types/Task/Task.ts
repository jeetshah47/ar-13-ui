export interface ITask {
  id: string;
  subject: string;
  code: string;
  status: string;
  deadline: Date | { _seconds: number; _nanoseconds: number } | string; // RFC3339 format - replaced deprecated 'duration' field
  priority: string;
  assignTo: string | null;
  projectId: string;
  progress?: number | null; // Completion percentage (0-100), optional
  createdAt: Date | { _seconds: number; _nanoseconds: number } | string;
  updatedAt: Date;
}

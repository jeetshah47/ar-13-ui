export interface ITask {
  id?: string;
  subject: string;
  code: string;
  status: string;
  startDate: string; // ISO 8601 format
  endDate: string; // ISO 8601 format
  deadline: string; // ISO 8601 format (RFC3339)
  priority: string;
  projectId: string;
  progress: number; // Completion percentage (0-100), default 0
  assignTo: string | null;
  description: string;
  timeSpent: any[]; // Array of time spent entries
  fileAttachments: any[]; // Array of file attachments
  activityLogs: any[]; // Array of activity logs
  createdAt?: Date | { _seconds: number; _nanoseconds: number } | string;
  updatedAt?: Date;
}

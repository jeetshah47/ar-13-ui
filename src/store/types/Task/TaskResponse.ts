import type { UserResponse } from "../User/UserResponse";
import type { TimeSpentEntry, FileAttachment, ActivityLog, AssignToUser } from "./TaskTypes";

export interface TaskResponse {
  id: string;
  subject: string;
  code: string;
  status: string;
  deadline: string; // RFC3339 format (ISO 8601) - replaced deprecated 'duration' field
  priority: string;
  assignTo: AssignToUser | null;
  assignDetails: UserResponse[];
  projectId: string;
  timeSpent?: TimeSpentEntry[];
  description: string;
  fileAttachments: FileAttachment[];
  activityLogs: ActivityLog[];
  progress?: number | null; // Completion percentage (0-100), optional
  created?: Created;
}

export interface Created {
  _seconds: number;
  _nanoseconds: number;
}

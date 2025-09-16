import type { UserResponse } from "../User/UserResponse";
import type { TimeSpentEntry, FileAttachment, ActivityLog } from "./TaskTypes";

export interface TaskResponse {
  id: string;
  subject: string;
  code: string;
  status: string;
  duration: string;
  priority: string;
  assignTo: string[];
  assignDetails: UserResponse[];
  projectId: string;
  timeSpent?: TimeSpentEntry[];
  description: string;
  fileAttachments: FileAttachment[];
  activityLogs: ActivityLog[];
  created?: Created;
}

export interface Created {
  _seconds: number;
  _nanoseconds: number;
}

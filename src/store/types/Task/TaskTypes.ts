// Additional types for task-related API functions

export interface TimeSpentEntry {
  date: string;
  timeSpent: number; // in minutes
  userId: string;
  description?: string;
}

export interface FileAttachment {
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  uploadDate: string | { _seconds: number; _nanoseconds: number };
  fileUrl: string;
}

export interface AssignableUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ActivityLog {
  id: string;
  type: "time_spent_added" | "file_uploaded" | "task_assigned" | "status_changed" | "task_created";
  timestamp: string | { _seconds: number; _nanoseconds: number };
  userId: string;
  userName: string;
  description: string;
  metadata: {
    timeSpent?: number;
    date?: string;
    description?: string;
    fileName?: string;
    fileSize?: number;
    assignedUserId?: string;
    assignedUserName?: string;
    oldStatus?: string;
    newStatus?: string;
  };
}

export interface TaskStatus {
  value: string;
  displayName: string;
  description: string;
  category: "active" | "completed" | "final";
  isActive: boolean;
  isCompleted: boolean;
  order?: number; // Order field from API response for sorting statuses
}

export interface TaskStatusResponse {
  statuses: TaskStatus[];
  total: number;
}

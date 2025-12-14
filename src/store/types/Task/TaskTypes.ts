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
  uploadedBy?: string;
  fileUrl: string;
  previewUrl?: string; // Pre-signed URL for image preview (from backend, 1 hour expiry)
  downloadUrl?: string; // Pre-signed URL for download (from backend, 1 hour expiry)
}

export interface AssignableUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AssignToUser {
  id: string;
  name: string;
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
  id: string; // Status ID from API
  value: string; // Status value (e.g., "pending")
  displayName: string; // Display name (e.g., "Pending")
  description: string; // Status description
  category: "active" | "completed" | "final"; // Status category
  isActive: boolean; // Whether status is active
  isCompleted: boolean; // Whether status represents completion
  order: number; // Order field from API response for sorting statuses
  createdAt: string; // Creation timestamp (ISO 8601)
  updatedAt: string; // Last update timestamp (ISO 8601)
  _id?: string; // MongoDB document ID (optional, may be present in some responses)
}

export interface TaskStatusResponse {
  statuses: TaskStatus[];
  total: number;
}

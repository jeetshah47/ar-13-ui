// Additional types for task-related API functions

export interface TimeSpentEntry {
  hours: number;
  minutes: number;
  description?: string;
  createdAt: Date;
}

export interface FileAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: Date;
}

export interface AssignableUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

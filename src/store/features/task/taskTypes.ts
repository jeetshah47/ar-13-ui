import type { TaskResponse } from "../../types/Task/TaskResponse";
import type { ActivityLog, FileAttachment } from "../../types/Task/TaskTypes";

export interface TaskState {
  api: {
    data: { 
      tasks: TaskResponse[];
      activityLogs: ActivityLog[];
      fileAttachments: FileAttachment[];
    };
    loading: boolean;
    error: string;
  };
}



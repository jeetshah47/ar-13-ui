import type { TaskResponse } from "../../types/Task/TaskResponse";
import type { ActivityLog, FileAttachment, TaskStatus } from "../../types/Task/TaskTypes";

export interface TaskState {
  api: {
    data: { 
      tasks: TaskResponse[];
      filteredTasks: TaskResponse[];
      activityLogs: ActivityLog[];
      fileAttachments: FileAttachment[];
      taskStatuses: TaskStatus[];
    };
    loading: boolean;
    error: string;
  };
}



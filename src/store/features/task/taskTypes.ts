import type { TaskResponse } from "../../types/Task/TaskResponse";

export interface TaskState {
  api: {
    data: { tasks: TaskResponse[] };
    loading: boolean;
    error: string;
  };
}



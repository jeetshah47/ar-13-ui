import { http } from "../../config/http";
import type { TaskResponse } from "../types/Task/TaskResponse";

export async function getAllTaskByProjectId(projectId: string): Promise<{
  task: TaskResponse[];
}> {
  const url = `http://localhost:3000/api/tasks/all/details/${projectId}`;
  const result = await http.get(url);
  return result.data;
}

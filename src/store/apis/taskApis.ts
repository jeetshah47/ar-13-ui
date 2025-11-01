import { http } from "../../config/http";
import type { TaskResponse } from "../types/Task/TaskResponse";
import type { ITask } from "../types/Task/Task";
import type { TimeSpentEntry, FileAttachment, AssignableUser, ActivityLog } from "../types/Task/TaskTypes";

export async function getAllTaskByProjectId(projectId: string): Promise<{
  tasks: TaskResponse[];
}> {
  const url = `http://localhost:3000/api/tasks/all/${projectId}`;
  const result = await http.get(url);
  return result.data;
}

export async function addTask(task: ITask): Promise<{ message: string }> {
  const url = `http://localhost:3000/api/tasks/add`;
  const result = await http.post(url, task);
  return result.data;
}

export async function addMultipleTasks(tasks: ITask[]): Promise<{ message: string; count: number }> {
  const url = `http://localhost:3000/api/tasks/add-multiple`;
  const result = await http.post(url, { tasks });
  return result.data;
}

export async function updateTask(task: ITask): Promise<{ message: string }> {
  const url = `http://localhost:3000/api/tasks/update`;
  const result = await http.put(url, task);
  return result.data;
}

export async function deleteTask(taskId: string, projectId: string): Promise<{ message: string }> {
  const url = `http://localhost:3000/api/tasks/delete/${projectId}/${taskId}`;
  const result = await http.delete(url);
  return result.data;
}

export async function getTaskDetails(projectId: string): Promise<{
  tasks: TaskResponse[];
}> {
  const url = `http://localhost:3000/api/tasks/all/details/${projectId}`;
  const result = await http.get(url);
  return result.data;
}

export async function getTaskDetailById(projectId: string, taskId: string): Promise<{
  task: TaskResponse;
}> {
  const url = `http://localhost:3000/api/tasks/detail/${projectId}/${taskId}`;
  const result = await http.get(url);
  return result.data;
}

// Additional task API functions based on the provided routes

export async function updateTaskDuration(
  projectId: string,
  taskId: string,
  duration: Date
): Promise<{ message: string }> {
  const url = `http://localhost:3000/api/tasks/update-duration/${projectId}/${taskId}`;
  const result = await http.put(url, { duration });
  return result.data;
}

export async function updateTaskDescription(
  projectId: string,
  taskId: string,
  description: string
): Promise<{ message: string }> {
  const url = `http://localhost:3000/api/tasks/update-description/${projectId}/${taskId}`;
  const result = await http.put(url, { description });
  return result.data;
}

export async function addTimeSpent(
  projectId: string,
  taskId: string,
  timeSpentData: { date: string; hours: number; minutes: number; description: string }
): Promise<{ message: string }> {
  const url = `http://localhost:3000/api/tasks/add-time-spent/${projectId}/${taskId}`;
  
  // Convert hours and minutes to total minutes
  const totalMinutes = (timeSpentData.hours * 60) + timeSpentData.minutes;
  
  const payload = {
    timeSpent: {
      date: timeSpentData.date,
      timeSpent: totalMinutes,
      description: timeSpentData.description
    }
  };
  
  const result = await http.post(url, payload);
  return result.data;
}

export async function updateTimeSpent(
  projectId: string,
  taskId: string,
  timeSpentIndex: number,
  timeSpent: { hours: number; minutes: number; description?: string }
): Promise<{ message: string }> {
  const url = `http://localhost:3000/api/tasks/update-time-spent/${projectId}/${taskId}/${timeSpentIndex}`;
  const result = await http.put(url, timeSpent);
  return result.data;
}

export async function removeTimeSpent(
  projectId: string,
  taskId: string,
  timeSpentIndex: number
): Promise<{ message: string }> {
  const url = `http://localhost:3000/api/tasks/remove-time-spent/${projectId}/${taskId}/${timeSpentIndex}`;
  const result = await http.delete(url);
  return result.data;
}

export async function getTimeSpent(
  projectId: string,
  taskId: string
): Promise<{ timeSpent: TimeSpentEntry[] }> {
  const url = `http://localhost:3000/api/tasks/time-spent/${projectId}/${taskId}`;
  const result = await http.get(url);
  return result.data;
}

export async function addFileAttachment(
  projectId: string,
  taskId: string,
  file: File
): Promise<{ message: string; fileAttachment: FileAttachment }> {
  const url = `http://localhost:3000/api/tasks/add-file-attachment/${projectId}/${taskId}`;
  const formData = new FormData();
  formData.append('file', file);
  const result = await http.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return result.data;
}

export async function removeFileAttachment(
  projectId: string,
  taskId: string,
  fileAttachmentIndex: number
): Promise<{ message: string }> {
  const url = `http://localhost:3000/api/tasks/remove-file-attachment/${projectId}/${taskId}/${fileAttachmentIndex}`;
  const result = await http.delete(url);
  return result.data;
}

export async function getFileAttachments(
  projectId: string,
  taskId: string
): Promise<{ attachments: FileAttachment[] }> {
  const url = `http://localhost:3000/api/tasks/file-attachments/${projectId}/${taskId}`;
  const result = await http.get(url);
  return result.data;
}

export async function assignTask(
  taskId: string,
  userId: string
): Promise<{ message: string }> {
  const url = `http://localhost:3000/api/tasks/assign/${taskId}/${userId}`;
  const result = await http.post(url);
  return result.data;
}

export async function getAssignableUsers(
  projectId: string
): Promise<{ users: AssignableUser[] }> {
  const url = `http://localhost:3000/api/tasks/assignable/${projectId}`;
  const result = await http.get(url);
  return result.data;
}

export async function getActivityLogs(
  projectId: string,
  taskId: string
): Promise<{ activityLogs: ActivityLog[] }> {
  const url = `http://localhost:3000/api/tasks/activity-logs/${projectId}/${taskId}`;
  const result = await http.get(url);
  return result.data;
}

export async function claimTask(
  projectId: string,
  taskId: string
): Promise<{ message: string }> {
  const url = `http://localhost:3000/api/tasks/claim/${projectId}/${taskId}`;
  const result = await http.put(url);
  return result.data;
}

export async function updateTaskStatus(
  projectId: string,
  taskId: string,
  status: string
): Promise<{ message: string }> {
  const url = `http://localhost:3000/api/tasks/update-status/${projectId}/${taskId}`;
  const result = await http.put(url, { status });
  return result.data;
}
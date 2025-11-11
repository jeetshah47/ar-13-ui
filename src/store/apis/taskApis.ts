import { http } from "../../config/http";
import { API_BASE_URL } from "../../config/api";
import type { TaskResponse } from "../types/Task/TaskResponse";
import type { ITask } from "../types/Task/Task";
import type { TimeSpentEntry, FileAttachment, AssignableUser, ActivityLog } from "../types/Task/TaskTypes";

export async function getAllTaskByProjectId(projectId: string): Promise<{
  tasks: TaskResponse[];
}> {
  const url = `${API_BASE_URL}/tasks/all/${projectId}`;
  const result = await http.get(url);
  return result.data;
}

export async function addTask(task: ITask): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/tasks/add`;
  const result = await http.post(url, task);
  return result.data;
}

export async function addMultipleTasks(tasks: ITask[]): Promise<{ message: string; count: number }> {
  const url = `${API_BASE_URL}/tasks/add-multiple`;
  const result = await http.post(url, { tasks });
  return result.data;
}

export async function updateTask(task: ITask): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/tasks/update`;
  const result = await http.put(url, task);
  return result.data;
}

export async function deleteTask(taskId: string, projectId: string): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/tasks/delete/${projectId}/${taskId}`;
  const result = await http.delete(url);
  return result.data;
}

export async function getTaskDetails(projectId: string): Promise<{
  tasks: TaskResponse[];
}> {
  const url = `${API_BASE_URL}/tasks/all/details/${projectId}`;
  const result = await http.get(url);
  return result.data;
}

export async function getTaskDetailById(projectId: string, taskId: string): Promise<{
  task: TaskResponse;
}> {
  const url = `${API_BASE_URL}/tasks/detail/${projectId}/${taskId}`;
  const result = await http.get(url);
  return result.data;
}

// Additional task API functions based on the provided routes

/**
 * Update task deadline (replaces deprecated updateTaskDuration)
 * @param projectId - The project ID
 * @param taskId - The task ID
 * @param deadline - The deadline in RFC3339 format (ISO 8601) string
 * @returns Promise with success message
 */
export async function updateTaskDeadline(
  projectId: string,
  taskId: string,
  deadline: string
): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/tasks/update-deadline/${projectId}/${taskId}`;
  const result = await http.put(url, { deadline });
  return result.data;
}

/**
 * Update task progress (completion percentage)
 * @param projectId - The project ID
 * @param taskId - The task ID
 * @param progress - The progress percentage (0-100)
 * @returns Promise with success message
 */
export async function updateTaskProgress(
  projectId: string,
  taskId: string,
  progress: number
): Promise<{ message: string }> {
  // Clamp progress to 0-100 range
  const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));
  const url = `${API_BASE_URL}/tasks/update-progress/${projectId}/${taskId}`;
  const result = await http.put(url, { progress: clampedProgress });
  return result.data;
}

/**
 * @deprecated Use updateTaskDeadline instead. This function is kept for backward compatibility.
 */
export async function updateTaskDuration(
  projectId: string,
  taskId: string,
  duration: Date
): Promise<{ message: string }> {
  // Convert Date to RFC3339 format string
  const deadline = duration.toISOString();
  return updateTaskDeadline(projectId, taskId, deadline);
}

export async function updateTaskDescription(
  projectId: string,
  taskId: string,
  description: string
): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/tasks/update-description/${projectId}/${taskId}`;
  const result = await http.put(url, { description });
  return result.data;
}

export async function addTimeSpent(
  projectId: string,
  taskId: string,
  timeSpentData: { date: string; hours: number; minutes: number; description: string }
): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/tasks/add-time-spent/${projectId}/${taskId}`;
  
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
  const url = `${API_BASE_URL}/tasks/update-time-spent/${projectId}/${taskId}/${timeSpentIndex}`;
  const result = await http.put(url, timeSpent);
  return result.data;
}

export async function removeTimeSpent(
  projectId: string,
  taskId: string,
  timeSpentIndex: number
): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/tasks/remove-time-spent/${projectId}/${taskId}/${timeSpentIndex}`;
  const result = await http.delete(url);
  return result.data;
}

export async function getTimeSpent(
  projectId: string,
  taskId: string
): Promise<{ timeSpent: TimeSpentEntry[] }> {
  const url = `${API_BASE_URL}/tasks/time-spent/${projectId}/${taskId}`;
  const result = await http.get(url);
  return result.data;
}

export async function addFileAttachment(
  projectId: string,
  taskId: string,
  file: File
): Promise<{ message: string; fileAttachment: FileAttachment }> {
  const url = `${API_BASE_URL}/tasks/add-file-attachment/${projectId}/${taskId}`;
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
  const url = `${API_BASE_URL}/tasks/remove-file-attachment/${projectId}/${taskId}/${fileAttachmentIndex}`;
  const result = await http.delete(url);
  return result.data;
}

export async function getFileAttachments(
  projectId: string,
  taskId: string
): Promise<{ attachments: FileAttachment[] }> {
  const url = `${API_BASE_URL}/tasks/file-attachments/${projectId}/${taskId}`;
  const result = await http.get(url);
  return result.data;
}

export async function assignTask(
  taskId: string,
  userId: string
): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/tasks/assign/${taskId}/${userId}`;
  const result = await http.post(url);
  return result.data;
}

export async function getAssignableUsers(
  projectId: string
): Promise<{ users: AssignableUser[] }> {
  const url = `${API_BASE_URL}/tasks/assignable/${projectId}`;
  const result = await http.get(url);
  return result.data;
}

export async function getActivityLogs(
  projectId: string,
  taskId: string
): Promise<{ activityLogs: ActivityLog[] }> {
  const url = `${API_BASE_URL}/tasks/activity-logs/${projectId}/${taskId}`;
  const result = await http.get(url);
  return result.data;
}

export async function claimTask(
  projectId: string,
  taskId: string
): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/tasks/claim/${projectId}/${taskId}`;
  const result = await http.put(url);
  return result.data;
}

export async function updateTaskStatus(
  projectId: string,
  taskId: string,
  status: string
): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/tasks/update-status/${projectId}/${taskId}`;
  const result = await http.put(url, { status });
  return result.data;
}
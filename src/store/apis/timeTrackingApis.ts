import { http } from "../../config/http";
import { API_BASE_URL } from "../../config/api";
import type { TimeSpentEntry } from "../types/Task/TaskTypes";
import type { TimeTrackingData } from "../types/Task/TimeTrackingTypes";

export async function getTimeTrackingDataForProject(
  projectId: string,
  startDate: string,
  endDate: string
): Promise<{ timeTrackingData: TimeTrackingData[] }> {
  const url = `${API_BASE_URL}/tasks/time-tracking/${projectId}`;
  const params = {
    startDate,
    endDate
  };
  const result = await http.get(url, { params });
  return result.data;
}

export async function getTimeSpentForTask(
  projectId: string,
  taskId: string
): Promise<{ timeSpent: TimeSpentEntry[] }> {
  const url = `${API_BASE_URL}/tasks/time-spent/${projectId}/${taskId}`;
  const result = await http.get(url);
  return result.data;
}

export async function getTimeSpentForDateRange(
  projectId: string,
  startDate: string,
  endDate: string
): Promise<{ timeTrackingData: TimeTrackingData[] }> {
  // This would aggregate time spent data for all tasks in a project for a date range
  const url = `${API_BASE_URL}/tasks/time-tracking-range/${projectId}`;
  const params = {
    startDate,
    endDate
  };
  const result = await http.get(url, { params });
  return result.data;
}

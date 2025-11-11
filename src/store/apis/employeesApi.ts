import { http } from "../../config/http";
import { API_BASE_URL } from "../../config/api";
import type { EmployeeResponse, EmployeeListResponse } from "../types/Employee/EmployeeResponse";
import type { EmployeeStatsResponse } from "../types/Employee/EmployeeStatsResponse";

export async function getAllEmployees(): Promise<EmployeeListResponse> {
  const url = `${API_BASE_URL}/employee/list`;
  const result = await http.get(url);
  return result.data;
}

/**
 * Get employee task counts by userId
 * Endpoint: GET /api/employee/task-counts/:userId
 * Returns employee information with task counts
 */
export async function getEmployeeTaskCounts(userId: string): Promise<{ employee: EmployeeResponse }> {
  const url = `${API_BASE_URL}/employee/task-counts/${userId}`;
  const result = await http.get(url);
  return result.data;
}

/**
 * Get employee task statistics and analysis
 * Endpoint: GET /api/employee/stats/:userId
 * Query params: period (month|quarter|year), periodValue (YYYY-MM|YYYY-QN|YYYY), projectId (optional)
 * Returns detailed statistics and analysis for the employee
 */
export async function getEmployeeStats(
  userId: string,
  period: "month" | "quarter" | "year",
  periodValue: string,
  projectId?: string
): Promise<EmployeeStatsResponse> {
  const url = `${API_BASE_URL}/employee/stats/${userId}`;
  const params: Record<string, string> = {
    period,
    periodValue,
  };
  if (projectId) {
    params.projectId = projectId;
  }
  const result = await http.get(url, { params });
  return result.data;
}

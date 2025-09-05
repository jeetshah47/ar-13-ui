import { http } from "../../config/http";
import type { DashboardResponse } from "../types/Dashboard/DashboardResponse";

export async function getDashboardData(
  project_limit?: string,
  emp_limit?: string
): Promise<DashboardResponse> {
  const url = `http://localhost:3000/api/dashboard/stats`;
  const result = await http.get(url, {
    params: { project_limit, emp_limit },
  });
  return result.data;
}

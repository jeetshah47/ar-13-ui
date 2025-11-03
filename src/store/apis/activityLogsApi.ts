import { http } from "../../config/http";
import type { ActivityLogsResponse } from "../types/ActivityLogs/ActivityLog";

// Get recent activity logs for a specific entity type
export async function getRecentActivityLogs(
  entityType: "task" | "project" | "user" | "calendarEvent",
  limit?: number
): Promise<ActivityLogsResponse> {
  const url = `http://localhost:3000/api/activity-logs/${entityType}`;
  const result = await http.get(url, {
    params: { limit },
  });
  return result.data as ActivityLogsResponse;
}



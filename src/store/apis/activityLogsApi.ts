import { http } from "../../config/http";
import { API_BASE_URL } from "../../config/api";
import type { ActivityLogsResponse, EntityTypesResponse, EntityType } from "../types/ActivityLogs/ActivityLog";

const BASE_URL = `${API_BASE_URL}/activity-log`;

/**
 * Get supported entity types for activity logs
 * @returns List of supported entity types
 */
export async function getEntityTypes(): Promise<EntityTypesResponse> {
  const url = `${BASE_URL}/entity-types`;
  const result = await http.get(url);
  return result.data as EntityTypesResponse;
}

/**
 * Get activity logs for a specific entity
 * @param entityType - The type of entity (task, project, user, or calendarEvent)
 * @param entityId - The unique identifier of the entity
 * @returns Activity logs for the specified entity
 */
export async function getActivityLogsByEntity(
  entityType: EntityType,
  entityId: string
): Promise<ActivityLogsResponse> {
  const url = `${BASE_URL}/entity/${entityType}/${entityId}`;
  const result = await http.get(url);
  return result.data as ActivityLogsResponse;
}

/**
 * Get activity logs by entity type (recent logs across all entities of that type)
 * @param entityType - The type of entity (task, project, user, or calendarEvent)
 * @param limit - Optional limit on number of logs to return
 * @returns Recent activity logs for the specified entity type
 */
export async function getActivityLogsByEntityType(
  entityType: EntityType,
  limit?: number
): Promise<ActivityLogsResponse> {
  const url = `${BASE_URL}/entity-type/${entityType}`;
  const result = await http.get(url, {
    params: limit ? { limit } : undefined,
  });
  return result.data as ActivityLogsResponse;
}

/**
 * @deprecated Use getActivityLogsByEntityType instead
 * Get recent activity logs for a specific entity type
 */
export async function getRecentActivityLogs(
  entityType: EntityType,
  limit?: number
): Promise<ActivityLogsResponse> {
  return getActivityLogsByEntityType(entityType, limit);
}



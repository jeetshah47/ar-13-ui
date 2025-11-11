import type { ActivityLogItem } from "../../../store/types/ActivityLogs/ActivityLog";
import type { ActivityLog } from "../../../store/types/Task/TaskTypes";

/**
 * Maps new ActivityLogItem action types to old ActivityLog type format
 */
const mapActionToType = (action: string): ActivityLog["type"] => {
  const actionMap: Record<string, ActivityLog["type"]> = {
    created: "task_created",
    assigned: "task_assigned",
    unassigned: "task_assigned", // Use same icon as assigned
    status_changed: "status_changed",
    priority_changed: "status_changed", // Use same icon as status changed
    description_updated: "task_created", // Use same icon as created
    deadline_updated: "task_created",
    progress_updated: "task_created",
    file_uploaded: "file_uploaded",
    file_removed: "file_uploaded", // Use same icon as uploaded
    time_spent_added: "time_spent_added",
    time_spent_updated: "time_spent_added",
    time_spent_removed: "time_spent_added",
    updated: "task_created",
    deleted: "task_created",
    // Project actions
    member_added: "task_assigned",
    member_removed: "task_assigned",
    owner_changed: "task_assigned",
    // User actions
    profile_updated: "task_created",
    role_changed: "task_created",
    password_changed: "task_created",
    // Calendar event actions
    event_created: "task_created",
    event_updated: "task_created",
    event_deleted: "task_created",
    event_cancelled: "task_created",
  };

  return actionMap[action] || "task_created";
};

/**
 * Converts ISO timestamp string to Firebase timestamp format (for backward compatibility)
 */
const convertTimestamp = (isoString: string): string => {
  // Return as ISO string - the parseFirebaseTimestamp function should handle both formats
  return isoString;
};

/**
 * Converts new ActivityLogItem format to old ActivityLog format for backward compatibility
 */
export const convertActivityLogItemToLegacy = (
  item: ActivityLogItem
): ActivityLog => {
  const userName =
    item.createdByUser?.name || item.createdByUser?.email || "Unknown User";

  // Extract metadata from fields
  const metadata: ActivityLog["metadata"] = {};
  
  if (item.fields) {
    // Map common fields to metadata
    if (item.fields.timeSpent !== undefined) {
      metadata.timeSpent = item.fields.timeSpent as number;
    }
    if (item.fields.date) {
      metadata.date = item.fields.date as string;
    }
    if (item.fields.description) {
      metadata.description = item.fields.description as string;
    }
    if (item.fields.fileName) {
      metadata.fileName = item.fields.fileName as string;
    }
    if (item.fields.fileSize !== undefined) {
      metadata.fileSize = item.fields.fileSize as number;
    }
    if (item.fields.assignedTo) {
      metadata.assignedUserId = item.fields.assignedTo as string;
    }
    if (item.fields.assignedUserName) {
      metadata.assignedUserName = item.fields.assignedUserName as string;
    }
    if (item.fields.oldStatus) {
      metadata.oldStatus = item.fields.oldStatus as string;
    }
    if (item.fields.newStatus) {
      metadata.newStatus = item.fields.newStatus as string;
    }
  }

  return {
    id: item.id,
    type: mapActionToType(item.action),
    timestamp: convertTimestamp(item.createdAt || item.created),
    userId: item.createdBy,
    userName: userName,
    description: item.description || "",
    metadata: metadata,
  };
};

/**
 * Converts array of ActivityLogItem to array of ActivityLog
 */
export const convertActivityLogItemsToLegacy = (
  items: ActivityLogItem[]
): ActivityLog[] => {
  return items.map(convertActivityLogItemToLegacy);
};


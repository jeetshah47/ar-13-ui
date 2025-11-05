import {
  collection,
  query,
  where,
  onSnapshot,
  type Unsubscribe,
  type Timestamp,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import type { ActivityLog } from "../store/types/Task/TaskTypes";

// Firebase activity log structure from backend
interface FirebaseActivityLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  createdAt: Timestamp | Date | { _seconds: number; _nanoseconds: number };
  createdBy: string;
  description: string;
  fields?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

// Map Firebase action types to ActivityLog types
const mapActionToType = (action: string): ActivityLog["type"] => {
  const actionMap: Record<string, ActivityLog["type"]> = {
    // Direct matches
    created: "task_created",
    status_changed: "status_changed",
    assigned: "task_assigned",
    file_uploaded: "file_uploaded",
    time_spent_added: "time_spent_added",
    
    // Related actions mapped to closest type
    unassigned: "task_assigned", // Map unassigned to assigned type
    file_removed: "file_uploaded", // Map file removal to file_uploaded type
    time_spent_updated: "time_spent_added", // Map update to added type
    time_spent_removed: "time_spent_added", // Map removal to added type
    updated: "task_created", // General updates mapped to created
    deleted: "task_created", // Deletions mapped to created
    priority_changed: "status_changed", // Priority changes mapped to status_changed
    description_updated: "task_created", // Description updates mapped to created
    duration_updated: "task_created", // Duration updates mapped to created
  };

  return actionMap[action] || "task_created";
};

// Convert Firebase timestamp to ActivityLog timestamp format
const convertTimestamp = (
  timestamp: Timestamp | Date | { _seconds: number; _nanoseconds: number } | string
): string | { _seconds: number; _nanoseconds: number } => {
  if (typeof timestamp === "string") {
    return timestamp;
  }

  if (timestamp instanceof Date) {
    return { _seconds: Math.floor(timestamp.getTime() / 1000), _nanoseconds: 0 };
  }

  if (timestamp && typeof timestamp === "object") {
    if ("_seconds" in timestamp && "_nanoseconds" in timestamp) {
      return timestamp;
    }
    
    // Handle Firestore Timestamp
    if ("seconds" in timestamp) {
      const ts = timestamp as { seconds: number; nanoseconds: number };
      return { _seconds: ts.seconds, _nanoseconds: ts.nanoseconds };
    }
  }

  return { _seconds: Date.now() / 1000, _nanoseconds: 0 };
};

// Convert Firebase activity log to ActivityLog format
const convertFirebaseActivityLog = (
  firebaseLog: FirebaseActivityLog,
  userName: string = "Unknown User",
  createdByUser?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    designation?: string;
  }
): ActivityLog => {
  // Extract metadata from fields and metadata
  const metadata: ActivityLog["metadata"] = {
    ...firebaseLog.metadata,
  };

  // If fields exist, extract relevant data to metadata
  if (firebaseLog.fields) {
    if (firebaseLog.fields.oldStatus && firebaseLog.fields.newStatus) {
      metadata.oldStatus = firebaseLog.fields.oldStatus as string;
      metadata.newStatus = firebaseLog.fields.newStatus as string;
    }
    if (firebaseLog.fields.assignedUserId) {
      metadata.assignedUserId = firebaseLog.fields.assignedUserId as string;
    }
    if (firebaseLog.fields.assignedUserName) {
      metadata.assignedUserName = firebaseLog.fields.assignedUserName as string;
    }
  }

  // Use createdByUser name if available, otherwise fall back to userName parameter
  const finalUserName = createdByUser?.name || userName;

  return {
    id: firebaseLog.id,
    type: mapActionToType(firebaseLog.action),
    timestamp: convertTimestamp(firebaseLog.createdAt),
    userId: firebaseLog.createdBy,
    userName: finalUserName,
    description: firebaseLog.description || "",
    metadata: metadata,
  };
};

/**
 * Subscribe to real-time activity logs for a specific task
 * @param projectId - The ID of the project
 * @param taskId - The ID of the task
 * @param callback - Callback function that receives the activity logs
 * @returns Unsubscribe function
 */
export const subscribeToTaskActivityLogs = (
  projectId: string,
  taskId: string,
  callback: (activityLogs: ActivityLog[]) => void
): Unsubscribe => {
  // entityId is in format "projectId/taskId"
  const entityId = `${projectId}/${taskId}`;
  
  // Check if user has a token in localStorage (indicates they're authenticated)
  const hasToken = !!localStorage.getItem("authToken");
  
  // Check authentication state
  const currentUser = auth.currentUser;
  if (!currentUser && !hasToken) {
    // Return early with empty callback if no auth at all
    callback([]);
    // Return a no-op unsubscribe function
    return () => {};
  }
  
  // Try collection path: activityLogs/logs/taskActivityLogs (as subcollection)
  // According to docs, structure is: activityLogs/logs/taskActivityLogs/
  // If this doesn't work, the structure might be different
  let activityLogsRef;
  try {
    // Try path as nested subcollection first
    activityLogsRef = collection(db, "activityLogs", "logs", "taskActivityLogs");
  } catch (error) {
    // Try alternative: maybe taskActivityLogs is a top-level collection
    activityLogsRef = collection(db, "taskActivityLogs");
  }
  
  // Query for logs where entityType is 'task' and entityId matches the full "projectId/taskId" format
  // Query without orderBy to avoid index requirement, then sort manually (like firebaseTaskService)
  const q = query(
    activityLogsRef,
    where("entityType", "==", "task"),
    where("entityId", "==", entityId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const activityLogs: ActivityLog[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Try different field names for timestamp
        const timestamp = data.createdAt || data.created || data.timestamp || new Date();
        
        const firebaseLog: FirebaseActivityLog = {
          id: doc.id,
          entityType: data.entityType || "",
          entityId: data.entityId || "",
          action: data.action || "",
          createdAt: timestamp,
          createdBy: data.createdBy || "",
          description: data.description || "",
          fields: data.fields || {},
          metadata: data.metadata || {},
        };

        // Extract user information from Firebase data
        // Check for createdByUser object first, then fall back to userName field, then createdBy ID
        const createdByUser = data.createdByUser || null;
        const userName = createdByUser?.name || data.userName || data.createdBy || "Unknown User";
        
        const activityLog = convertFirebaseActivityLog(firebaseLog, userName, createdByUser);
        activityLogs.push(activityLog);
      });

      // Sort by timestamp descending (most recent first) - done manually to avoid index requirement
      activityLogs.sort((a, b) => {
        const getTimestamp = (ts: string | { _seconds: number; _nanoseconds: number }): number => {
          if (typeof ts === "string") {
            return new Date(ts).getTime();
          }
          return ts._seconds * 1000;
        };

        return getTimestamp(b.timestamp) - getTimestamp(a.timestamp);
      });

      callback(activityLogs);
    },
    (_error) => {
      // Silently handle errors - callback with empty array
      // Error details can be logged to error tracking service in production
      callback([]);
    }
  );
};


/**
 * Task status constants - aligned with backend
 * Backend statuses: pending, in_progress, in_review, completed, accepted, rejected
 */
export const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  IN_REVIEW: "in_review",
  COMPLETED: "completed",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const;

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

/**
 * Normalize status string to match backend status values
 * Handles legacy/variant status formats and maps them to backend statuses
 * Also handles new backend status names: "Not Started", "In Progress", "On Hold", "Review", "Completed", "Cancelled"
 */
export const normalizeTaskStatus = (status: string): TaskStatus => {
  if (!status) return TASK_STATUS.PENDING;
  
  const statusLower = status.toLowerCase().trim().replace(/-/g, "_").replace(/\s+/g, "_");
  
  // New backend status mappings
  if (statusLower === "not_started" || statusLower === "notstarted") return TASK_STATUS.PENDING;
  if (statusLower === "in_progress" || statusLower === "inprogress") return TASK_STATUS.IN_PROGRESS;
  if (statusLower === "on_hold" || statusLower === "onhold") return TASK_STATUS.PENDING; // Map to pending for now
  if (statusLower === "review" || statusLower === "in_review" || statusLower === "inreview") return TASK_STATUS.IN_REVIEW;
  if (statusLower === "completed" || statusLower === "complete") return TASK_STATUS.COMPLETED;
  if (statusLower === "cancelled" || statusLower === "canceled") return TASK_STATUS.REJECTED;
  
  // Direct matches with legacy backend statuses
  if (statusLower === "pending") return TASK_STATUS.PENDING;
  if (statusLower === "accepted") return TASK_STATUS.ACCEPTED;
  if (statusLower === "rejected") return TASK_STATUS.REJECTED;
  
  // Legacy mappings for backward compatibility
  if (statusLower === "todo" || statusLower === "to_do" || statusLower === "backlog") return TASK_STATUS.PENDING;
  if (statusLower === "done" || statusLower === "finished" || statusLower === "success") return TASK_STATUS.COMPLETED;
  
  // Default fallback
  return TASK_STATUS.PENDING;
};

/**
 * Convert status to display name
 */
export const getStatusDisplayName = (status: TaskStatus | string): string => {
  const normalizedStatus = typeof status === 'string' ? normalizeTaskStatus(status) : status;
  
  const displayMap: Record<TaskStatus, string> = {
    [TASK_STATUS.PENDING]: "Pending",
    [TASK_STATUS.IN_PROGRESS]: "In Progress",
    [TASK_STATUS.IN_REVIEW]: "In Review",
    [TASK_STATUS.COMPLETED]: "Completed",
    [TASK_STATUS.ACCEPTED]: "Accepted",
    [TASK_STATUS.REJECTED]: "Rejected",
  };
  
  return displayMap[normalizedStatus] || "Pending";
};

/**
 * Get all task statuses in order (matching backend order)
 */
export const TASK_STATUSES_ARRAY: TaskStatus[] = [
  TASK_STATUS.PENDING,
  TASK_STATUS.IN_PROGRESS,
  TASK_STATUS.IN_REVIEW,
  TASK_STATUS.COMPLETED,
  TASK_STATUS.ACCEPTED,
  TASK_STATUS.REJECTED,
];

/**
 * Check if a status string is a valid task status
 */
export const isValidTaskStatus = (status: string): boolean => {
  const normalized = normalizeTaskStatus(status);
  return TASK_STATUSES_ARRAY.includes(normalized);
};


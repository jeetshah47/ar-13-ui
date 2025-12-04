/**
 * Unified task status constants
 * Only four statuses are allowed: pending, todo, completed, review
 */
export const TASK_STATUS = {
  PENDING: "pending",
  TODO: "todo",
  COMPLETED: "completed",
  REVIEW: "review",
} as const;

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

/**
 * Map old/legacy status values to the new unified status values
 * Also handles new API status values: in_progress, in_review, accepted, rejected
 */
export const mapStatusToUnified = (status: string): TaskStatus => {
  const statusLower = status.toLowerCase().trim().replace(/-/g, " ").replace(/_/g, " ");
  
  // Map common status values to unified format
  const statusMap: Record<string, TaskStatus> = {
    // Direct matches
    "pending": TASK_STATUS.PENDING,
    "todo": TASK_STATUS.TODO,
    "to do": TASK_STATUS.TODO,
    "completed": TASK_STATUS.COMPLETED,
    "complete": TASK_STATUS.COMPLETED,
    "review": TASK_STATUS.REVIEW,
    
    // New API status values (mapped to closest unified status)
    "in progress": TASK_STATUS.TODO,        // in_progress -> todo
    "inprogress": TASK_STATUS.TODO,
    "in review": TASK_STATUS.REVIEW,        // in_review -> review
    "inreview": TASK_STATUS.REVIEW,
    "accepted": TASK_STATUS.COMPLETED,      // accepted -> completed
    "rejected": TASK_STATUS.PENDING,       // rejected -> pending
    
    // Legacy mappings
    "done": TASK_STATUS.COMPLETED,
    "success": TASK_STATUS.COMPLETED,
    "progress": TASK_STATUS.TODO,
    "backlog": TASK_STATUS.PENDING,
    
    // Display name mappings
    "To Do": TASK_STATUS.TODO,
    "In Progress": TASK_STATUS.TODO,
    "Done": TASK_STATUS.COMPLETED,
    "Review": TASK_STATUS.REVIEW,
    "In Review": TASK_STATUS.REVIEW,
    "Accepted": TASK_STATUS.COMPLETED,
    "Rejected": TASK_STATUS.PENDING,
  };

  return statusMap[statusLower] || TASK_STATUS.PENDING;
};

/**
 * Convert unified status to display name
 */
export const getStatusDisplayName = (status: TaskStatus): string => {
  const displayMap: Record<TaskStatus, string> = {
    [TASK_STATUS.PENDING]: "Pending",
    [TASK_STATUS.TODO]: "Todo",
    [TASK_STATUS.COMPLETED]: "Completed",
    [TASK_STATUS.REVIEW]: "Review",
  };
  
  return displayMap[status] || "Pending";
};

/**
 * Get all task statuses in order
 */
export const TASK_STATUSES_ARRAY: TaskStatus[] = [
  TASK_STATUS.PENDING,
  TASK_STATUS.TODO,
  TASK_STATUS.REVIEW,
  TASK_STATUS.COMPLETED,
];


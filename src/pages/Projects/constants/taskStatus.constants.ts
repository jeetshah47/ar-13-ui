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
    
    // Legacy mappings
    "done": TASK_STATUS.COMPLETED,
    "success": TASK_STATUS.COMPLETED,
    "in progress": TASK_STATUS.TODO,
    "inprogress": TASK_STATUS.TODO,
    "progress": TASK_STATUS.TODO,
    "backlog": TASK_STATUS.PENDING,
    "in review": TASK_STATUS.REVIEW,
    "inreview": TASK_STATUS.REVIEW,
    
    // Display name mappings
    "To Do": TASK_STATUS.TODO,
    "In Progress": TASK_STATUS.TODO,
    "Done": TASK_STATUS.COMPLETED,
    "Review": TASK_STATUS.REVIEW,
    "In Review": TASK_STATUS.REVIEW,
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


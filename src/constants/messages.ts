/**
 * Backend message constants
 * These messages match the backend constants to ensure consistency
 */

// Authorization messages
export const MSG_UNAUTHORIZED_ACCESS = "You are not authorized to access this resource";
export const MSG_USER_NOT_AUTHENTICATED = "Authentication required. Please log in to continue";
export const MSG_PROJECT_OWNER_OR_MEMBER_ONLY = "Only project owners and members can perform this operation";
export const MSG_TASK_ASSIGNED_OR_MEMBER_ONLY = "You must be assigned to this task or be a project member to perform this operation";
export const MSG_PROJECT_MEMBER_ONLY = "Only project members can perform this operation";
export const MSG_TASK_ASSIGNED_ONLY = "You must be assigned to this task to perform this operation";
export const MSG_CANNOT_MODIFY_PROJECT = "You do not have permission to modify this project. Only project owners and members can make changes";
export const MSG_CANNOT_MODIFY_TASK = "You do not have permission to modify this task. You must be assigned to the task or be a project member";
export const MSG_CANNOT_CLAIM_TASK = "You cannot claim this task. You must be a member of the project to claim tasks";
export const MSG_CANNOT_ASSIGN_TASK = "You do not have permission to assign tasks. Only project owners and members can assign tasks";
export const MSG_CANNOT_MODIFY_TIME_LOG = "You do not have permission to modify time logs. You must be assigned to the task or be a project member";

// Project messages
export const MSG_PROJECT_NOT_FOUND = "Project not found";
export const MSG_PROJECT_CREATED = "Project created successfully";
export const MSG_PROJECT_UPDATED = "Project updated successfully";
export const MSG_PROJECT_DELETED = "Project deleted successfully";
export const MSG_PROJECT_RETRIEVED = "Project retrieved successfully";
export const MSG_PROJECTS_RETRIEVED = "Projects retrieved successfully";
export const MSG_PROJECT_STATS_RETRIEVED = "Project statistics retrieved successfully";
export const MSG_INVALID_PROJECT_ID = "Invalid project ID";
export const MSG_PROJECT_ID_REQUIRED = "Project ID is required";

// Task messages
export const MSG_TASK_NOT_FOUND = "Task not found";
export const MSG_TASK_CREATED = "Task created successfully";
export const MSG_TASK_UPDATED = "Task updated successfully";
export const MSG_TASK_DELETED = "Task deleted successfully";
export const MSG_TASK_RETRIEVED = "Task retrieved successfully";
export const MSG_TASKS_RETRIEVED = "Tasks retrieved successfully";
export const MSG_TASK_ASSIGNED = "Task assigned successfully";
export const MSG_TASK_CLAIMED = "Task claimed successfully";
export const MSG_TASK_STATUS_UPDATED = "Task status updated successfully";
export const MSG_TASK_DURATION_UPDATED = "Task duration updated successfully";
export const MSG_TASK_DESCRIPTION_UPDATED = "Task description updated successfully";
export const MSG_INVALID_TASK_ID = "Invalid task ID";
export const MSG_TASK_ID_REQUIRED = "Task ID is required";
export const MSG_TASK_ALREADY_ASSIGNED = "This task is already assigned to you";

// Time log messages
export const MSG_TIME_SPENT_ADDED = "Time log entry added successfully";
export const MSG_TIME_SPENT_UPDATED = "Time log entry updated successfully";
export const MSG_TIME_SPENT_REMOVED = "Time log entry removed successfully";
export const MSG_TIME_SPENT_RETRIEVED = "Time log entries retrieved successfully";
export const MSG_INVALID_TIME_SPENT_INDEX = "Invalid time spent entry index";
export const MSG_TIME_SPENT_INDEX_REQUIRED = "Time spent entry index is required";

// File attachment messages
export const MSG_FILE_ATTACHMENT_ADDED = "File attachment added successfully";
export const MSG_FILE_ATTACHMENT_REMOVED = "File attachment removed successfully";
export const MSG_FILE_ATTACHMENTS_RETRIEVED = "File attachments retrieved successfully";
export const MSG_INVALID_FILE_ATTACHMENT_INDEX = "Invalid file attachment index";
export const MSG_FILE_ATTACHMENT_INDEX_REQUIRED = "File attachment index is required";

// Activity log messages
export const MSG_ACTIVITY_LOGS_RETRIEVED = "Activity logs retrieved successfully";

// General error messages
export const MSG_INVALID_REQUEST = "Invalid request. Please check your input and try again";
export const MSG_INTERNAL_SERVER_ERROR = "An internal server error occurred. Please try again later";
export const MSG_BAD_REQUEST = "Bad request. Please check your input";
export const MSG_NOT_FOUND = "Resource not found";
export const MSG_INVALID_FORMAT = "Invalid format. Please check your input";
export const MSG_MISSING_REQUIRED_FIELD = "Required field is missing";
export const MSG_INVALID_DURATION_FORMAT = "Invalid duration format. Please use RFC3339 format (e.g., 2025-01-20T10:00:00Z)";

// Validation messages
export const MSG_INVALID_JSON = "Invalid JSON format";
export const MSG_INVALID_EMAIL = "Invalid email format";
export const MSG_INVALID_PASSWORD = "Invalid password format";
export const MSG_INVALID_TOKEN = "Invalid or expired token";
export const MSG_TOKEN_REQUIRED = "Authorization token is required";
export const MSG_INVALID_AUTHORIZATION_HEADER = "Invalid authorization header format. Expected: Bearer <token>";


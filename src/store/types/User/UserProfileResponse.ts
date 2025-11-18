import type { LeaveRequest } from "../Vacation/VacationTypes";

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdAt: string; // ISO date string from API
  updatedAt?: string; // ISO date string from API
  password?: string; // Optional, may not be in API response
  projects?: Record<string, unknown>; // Optional, may not be in API response
  tasks?: Record<string, unknown>; // Optional, may not be in API response
  created?: string; // Legacy field, kept for backward compatibility
  leaveRequests?: LeaveRequest[];
}

export interface GetUserProfileApiResponse {
  user: UserProfileResponse;
  role: string;
  permissions: string[];
  leaveRequests?: LeaveRequest[]; // Top-level leaveRequests from API
}



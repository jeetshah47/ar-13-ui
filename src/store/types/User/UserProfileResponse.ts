import type { LeaveRequest } from "../Vacation/VacationTypes";

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  password: string;
  projects: Record<string, unknown>;
  tasks: Record<string, unknown>;
  created: string; // ISO date string
  leaveRequests?: LeaveRequest[];
}

export interface GetUserProfileApiResponse {
  user: UserProfileResponse;
}



export type RequestType = "vacation" | "sick_leave" | "work_remotely";
export type DurationType = "days" | "hours";

export interface WorkingHours {
  from: string;
  to: string;
}

export interface VacationRequest {
  requestType: RequestType;
  startDate: string;
  endDate?: string; // Optional for work_remotely requests
  duration: number;
  durationType: DurationType;
  workingHours?: WorkingHours; // Required for work_remotely requests
  comments: string;
}

export interface VacationResponse {
  id: string;
  requestType: RequestType;
  startDate: string;
  endDate?: string;
  duration: number;
  durationType: DurationType;
  workingHours?: WorkingHours;
  comments: string;
  status: "pending" | "approved" | "rejected";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VacationStats {
  vacationDays: number;
  sickLeaveDays: number;
  remoteWorkDays: number;
  totalRequests: number;
}

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

// Firestore timestamp format
export interface FirestoreTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

// User details for leave requests
export interface LeaveRequestUserDetails {
  name: string;
  email: string;
  password?: string;
  designation?: string;
  created?: FirestoreTimestamp;
  id: string;
  role: string;
}

// Leave request from user profile API
export interface LeaveRequest {
  userId: string;
  requestType: RequestType;
  startDate: FirestoreTimestamp;
  endDate: FirestoreTimestamp;
  duration: number;
  durationType: DurationType;
  comments: string;
  requestedAt: FirestoreTimestamp;
  reviewedAt?: FirestoreTimestamp | null;
  reviewComments?: string | null;
  reviewedBy?: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled";
  id: string;
  userDetails?: LeaveRequestUserDetails | null;
  reviewerDetails?: LeaveRequestUserDetails | null;
}

export interface VacationStats {
  vacationDays: number;
  sickLeaveDays: number;
  remoteWorkDays: number;
  totalRequests: number;
}

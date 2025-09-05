import type { UserResponse } from "../User/UserResponse";

export interface TaskResponse {
  subject: string;
  code: string;
  status: string;
  duration: string;
  priority: string;
  assignTo: string[];
  assignDetails: UserResponse[];
  projectId: string;
  id: string;
  created: Created;
}

export interface Created {
  _seconds: number;
  _nanoseconds: number;
}

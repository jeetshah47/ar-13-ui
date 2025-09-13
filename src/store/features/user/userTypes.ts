import type { UserResponse } from "../../types/User/UserResponse";

export interface UserState {
  users: UserResponse[];
  loading: boolean;
  error: string;
}

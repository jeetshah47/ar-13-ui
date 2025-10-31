import type { UserResponse } from "../../types/User/UserResponse";
import type { UserProfileResponse } from "../../types/User/UserProfileResponse";

export interface UserState {
  users: UserResponse[];
  loading: boolean;
  error: string;
  profile?: UserProfileResponse | null;
  profileLoading?: boolean;
  profileError?: string;
}

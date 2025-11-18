import type { UserResponse } from "../../types/User/UserResponse";
import type { UserProfileResponse } from "../../types/User/UserProfileResponse";
import type { UserPermissionsResponse } from "../../types/User/UserPermissionsResponse";

export interface UserState {
  users: UserResponse[];
  loading: boolean;
  error: string;
  profile?: UserProfileResponse | null;
  profileLoading?: boolean;
  profileError?: string;
  permissions?: UserPermissionsResponse | null;
  permissionsLoading?: boolean;
  permissionsError?: string;
  updating?: boolean;
  updateError?: string;
  deleting?: boolean;
  deleteError?: string;
}

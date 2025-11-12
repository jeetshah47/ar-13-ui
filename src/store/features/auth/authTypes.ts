import type { UserRole, Permission } from '../../types/RBAC';

export interface AuthState {
  loading: boolean;
  error: string;
  permissionsLoading: boolean;
  permissionsError: string | null;
  tokenValidation: {
    isValidating: boolean;
    isValid: boolean | null;
    error: string;
    reason?: string;
    email?: string;
  };
  api: {
    token: string;
    uid: string;
  };
  common: {
    isLogin: boolean;
  };
  user: {
    role: UserRole | null;
    permissions: Permission[];
    email: string | null;
    name: string | null;
  };
}

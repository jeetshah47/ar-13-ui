import type { UserRole } from '../RBAC';

export interface AuthResponse {
  token: string;
  uid: string;
  role?: UserRole;
  email?: string;
  name?: string;
}

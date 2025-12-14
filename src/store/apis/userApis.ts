import { http } from "../../config/http";
import { API_BASE_URL } from "../../config/api";
import type { UserResponse } from "../types/User/UserResponse";
import type { GetUserProfileApiResponse } from "../types/User/UserProfileResponse";
import type { UserPermissionsResponse } from "../types/User/UserPermissionsResponse";
import type { UpdateUserRequest } from "../types/User/UpdateUserRequest";
import type { UpdateUserResponse } from "../types/User/UpdateUserResponse";
import type { DeleteUserResponse } from "../types/User/DeleteUserResponse";

export async function getAllUsers(): Promise<{ users: UserResponse[] }> {
  const url = `${API_BASE_URL}/users/all`;
  const result = await http.get(url);
  return result.data;
}

export async function getUserProfile(userId: string): Promise<UserResponse> {
  const url = `${API_BASE_URL}/users/${userId}`;
  const result = await http.get(url);
  return result.data;
}

export async function inviteUser(email: string): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/users/invite`;
  const result = await http.post(
    url,
    { email },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return result.data;
}

export async function getUserProfileById(
  userId: string
): Promise<GetUserProfileApiResponse> {
  const url = `${API_BASE_URL}/users/profile/${userId}`;
  const result = await http.get(url);
  return result.data as GetUserProfileApiResponse;
}

/**
 * Get user permissions by user ID
 * Endpoint: GET /api/users/permissions/:id
 * @param userId - The user ID to get permissions for
 * @returns UserPermissionsResponse with userId, role, and permissions array
 */
export async function getUserPermissions(userId: string): Promise<UserPermissionsResponse> {
  const url = `${API_BASE_URL}/users/permissions/${userId}`;
  const result = await http.get(url);
  return result.data as UserPermissionsResponse;
}

export async function updateUser(userData: UpdateUserRequest): Promise<UpdateUserResponse> {
  const url = `${API_BASE_URL}/users/update`;
  const result = await http.put(
    url,
    userData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return result.data as UpdateUserResponse;
}

export async function deleteUser(userId: string): Promise<DeleteUserResponse> {
  const url = `${API_BASE_URL}/users/delete/${userId}`;
  const result = await http.delete(url);
  return result.data as DeleteUserResponse;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  phoneNumber?: string;
  role: "Admin" | "Standard";
  designation?: string;
}

export interface CreateEmployeeResponse {
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    designation?: string;
    forceChangePassword: boolean;
    createdAt: string;
    updatedAt: string;
  };
  tempPassword: string;
  message: string;
}

export async function createEmployee(
  employeeData: CreateEmployeeRequest
): Promise<CreateEmployeeResponse> {
  const url = `${API_BASE_URL}/users/create`;
  const result = await http.post(url, employeeData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return result.data as CreateEmployeeResponse;
}

export interface ChangePasswordRequest {
  userId: string;
  currentPassword?: string;
  newPassword: string;
  forceChange: boolean;
}

export interface ChangePasswordResponse {
  message: string;
}

export async function changePassword(
  passwordData: ChangePasswordRequest
): Promise<ChangePasswordResponse> {
  const url = `${API_BASE_URL}/users/change-password`;
  const result = await http.put(url, passwordData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return result.data as ChangePasswordResponse;
}
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import type { PermissionsResponse } from "../types/RBAC";
export type User = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};
// Login API response types
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export type UserRoles = "Standard" | "Admin";
export interface SingUpRequest {
  name: string;
  email: string;
  password: string;
  role: UserRoles;
  phoneNumber?: string;
  token?: string;
}

export async function loginApi(
  email: string,
  password: string
): Promise<LoginResponse> {
  const url = `${API_BASE_URL}/auth/login`;
  const result = await axios.post<LoginResponse>(
    url,
    {
      email,
      password,
    },
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
  return result.data;
}

export async function logoutApi(): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 100));
  return true;
}

export async function signupApi(
  body: SingUpRequest
): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/auth/register`;
  const token = localStorage.getItem("authToken");
  const result = await axios.post(
    url,
    {
      ...body,
    },
    {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return result.data;
}

export async function validateSignupTokenApi(
  token: string
): Promise<{ message: string; valid: boolean }> {
  const url = `${API_BASE_URL}/auth/validate-signup`;
  const result = await axios.get(url, {
    params: { token },
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = result.data;
  // If valid is false, throw an error so it's handled by the catch block
  if (data.valid === false) {
    const error = new Error(data.reason || "Token validation failed") as Error & {
      response?: { data: { valid: false; reason?: string } };
    };
    error.response = { data: { valid: false, reason: data.reason } };
    throw error;
  }
  return result.data;
}

/**
 * Fetch user permissions from the API
 * @returns PermissionsResponse containing role and permissions array
 */
export async function getPermissionsApi(): Promise<PermissionsResponse> {
  const url = `${API_BASE_URL}/auth/permissions`;
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const result = await axios.get<PermissionsResponse>(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  
  return result.data;
}

/**
 * Fetch permissions for a specific user by userId
 * @param userId - The user ID to fetch permissions for
 * @returns PermissionsResponse containing role and permissions array
 */
export async function getUserPermissionsApi(userId: string): Promise<PermissionsResponse> {
  const url = `${API_BASE_URL}/users/${userId}/permissions`;
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const result = await axios.get<PermissionsResponse>(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  
  return result.data;
}

/**
 * Update permissions for a specific user
 * @param userId - The user ID to update permissions for
 * @param permissions - Array of permissions to set
 * @param role - Optional role to update
 * @returns Success message
 */
export async function updateUserPermissionsApi(
  userId: string,
  permissions: string[],
  role?: string
): Promise<{ message: string }> {
  const url = `${API_BASE_URL}/users/${userId}/permissions`;
  const token = localStorage.getItem("authToken");
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const result = await axios.put(
    url,
    { permissions, role },
    {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  
  return result.data;
}
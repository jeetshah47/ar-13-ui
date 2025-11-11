import axios from "axios";
import { API_BASE_URL } from "../../config/api";
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

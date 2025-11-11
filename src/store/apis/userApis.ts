import { http } from "../../config/http";
import { API_BASE_URL } from "../../config/api";
import type { UserResponse } from "../types/User/UserResponse";
import type { GetUserProfileApiResponse } from "../types/User/UserProfileResponse";

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
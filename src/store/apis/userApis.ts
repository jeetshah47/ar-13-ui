import { http } from "../../config/http";
import type { UserResponse } from "../types/User/UserResponse";
import type { GetUserProfileApiResponse } from "../types/User/UserProfileResponse";

export async function getAllUsers(): Promise<{ users: UserResponse[] }> {
  const url = `http://localhost:3000/api/users/all`;
  const result = await http.get(url);
  return result.data;
}

export async function getUserProfile(userId: string): Promise<UserResponse> {
  const url = `http://localhost:3000/api/users/${userId}`;
  const result = await http.get(url);
  return result.data;
}

export async function inviteUser(email: string): Promise<{ message: string }> {
  const url = `http://localhost:3000/api/users/invite`;
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
  const url = `http://localhost:3000/api/users/profile/${userId}`;
  const result = await http.get(url);
  return result.data as GetUserProfileApiResponse;
}
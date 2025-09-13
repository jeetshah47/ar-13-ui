import { http } from "../../config/http";
import type { UserResponse } from "../types/User/UserResponse";

export async function getAllUsers(): Promise<{ users: UserResponse[] }> {
  const url = `http://localhost:3000/api/users/all`;
  const result = await http.get(url);
  return result.data;
}

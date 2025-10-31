import axios from "axios";
export type User = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};
// Simulated login API input/output types
interface LoginResponse {
  token: string;
  user: User;
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
  // Simulate API delay
  await new Promise((res) => setTimeout(res, 500));

  if (email === "user" && password === "pass") {
    return {
      token: "fake-jwt-token-123",
      user: {
        email: "user",
        first_name: "John Doe",
        last_name: "wqd",
        password: "",
      },
    };
  } else {
    throw new Error("Invalid username or password");
  }
}

export async function logoutApi(): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 100));
  return true;
}

export async function signupApi(
  body: SingUpRequest
): Promise<{ message: string }> {
  const url = `http://localhost:3000/api/auth/register`;
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
  const url = `http://localhost:3000/api/auth/validate-signup`;
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

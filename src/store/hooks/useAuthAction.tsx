import { create } from "zustand";
import { signupApi, type SingUpRequest } from "../apis/authApis";

// User type
interface User {
  username: string;
  name: string;
}

// Auth store state and actions
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (request: SingUpRequest, callback: () => void) => Promise<void>;
}

// Simulated API login function
const fakeLoginApi = async (username: string, password: string) => {
  await new Promise((res) => setTimeout(res, 500)); // simulate delay
  if (username === "user" && password === "pass") {
    return {
      token: "fake-jwt-token-123",
      user: { username: "user", name: "John Doe" },
    };
  }
  throw new Error("Invalid username or password");
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async (username, password) => {
    try {
      const { token, user } = await fakeLoginApi(username, password);
      set({ user, token, isAuthenticated: true });
    } catch (error) {
      set({ user: null, token: null, isAuthenticated: false });
      throw error;
    }
  },
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
  signup: async (request: SingUpRequest, callback: () => void) => {
    try {
      const { message } = await signupApi(request);
      console.log(message);
      set({ isAuthenticated: true });
      callback();
    } catch (err) {
      console.log(err);
    }
  },
}));

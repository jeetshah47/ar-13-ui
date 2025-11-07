import type { AppDispatch } from "../../store";
import {
  authSignInFailed,
  authSignInRequest,
  authSignInSuccess,
  authSignUpFailed,
  authSignUpRequest,
  authSignUpSuccess,
  validateSignupTokenRequest,
  validateSignupTokenSuccess,
  validateSignupTokenFailed,
} from "./authSlice";
import type { AxiosError } from "axios";
import type { AuthError } from "../../types/Auth/AuthError";
import toast from "react-hot-toast";
import { loginApi, signupApi, type SingUpRequest, validateSignupTokenApi } from "../../apis/authApis";
import { getUserProfile } from "../../apis/userApis";
import type { UserRole } from "../../types/RBAC";

/**
 * Decode JWT token to extract payload
 */
function decodeJWT(token: string): { userId?: string; sub?: string; email?: string; [key: string]: unknown } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const authSignInActions =
  (email: string, password: string, cb?: () => void) =>
  async (dispatch: AppDispatch) => {
    dispatch(authSignInRequest());
    try {
      const loginResponse = await loginApi(email, password);
      const { accessToken, refreshToken, expiresIn } = loginResponse;
      
      // Decode JWT to get user ID
      const decodedToken = decodeJWT(accessToken);
      const userIdValue = decodedToken?.userId || decodedToken?.sub || decodedToken?.id;
      
      // Ensure userId is a string
      const userId = typeof userIdValue === 'string' ? userIdValue : String(userIdValue || '');
      
      if (!userId || userId === '') {
        throw new Error("Unable to extract user ID from token");
      }
      
      // Store auth data in localStorage
      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("tokenExpiresIn", expiresIn.toString());
      localStorage.setItem("uid", userId);
      
      try {
        // Fetch user profile from backend API
        const userProfile = await getUserProfile(userId);
        
        // Store user data in localStorage
        localStorage.setItem("userRole", userProfile.role);
        localStorage.setItem("userEmail", userProfile.email);
        localStorage.setItem("userName", userProfile.name);
        
        dispatch(authSignInSuccess({ 
          token: accessToken, 
          uid: userId, 
          role: userProfile.role as UserRole,
          email: userProfile.email,
          name: userProfile.name
        }));
      } catch {
        // Fallback to default role if API call fails
        // This ensures the app continues to work even if the user profile API is unavailable
        const defaultRole = "Admin";
        const userEmail = decodedToken?.email || email;
        localStorage.setItem("userRole", defaultRole);
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("userName", "");
        
        dispatch(authSignInSuccess({ 
          token: accessToken, 
          uid: userId, 
          role: defaultRole as UserRole,
          email: userEmail,
          name: undefined
        }));
      }
      
      if (cb) cb();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown Error";
      dispatch(authSignInFailed(errorMessage));
      toast.error(errorMessage);
    }
  };

export const authSignUpActions =
  (body: SingUpRequest, cb?: () => void) => async (dispatch: AppDispatch) => {
    dispatch(authSignUpRequest());
    try {
      signupApi({
        ...body,
      })
        .then(() => {
          toast.success("User Signup Successfull");
          dispatch(authSignUpSuccess());
          if (cb) cb();
        })
        .catch((err: AxiosError<AuthError>) => {
          if (err.response?.data) {
            const errors = JSON.parse(err.response?.data?.error);
            toast.error("User Signup Failed :" + errors?.message);
            dispatch(authSignUpFailed(errors));
          }
        });
    } catch {
      toast.error("Failed");
      dispatch(authSignUpFailed({ error: "User Signup failed" }));
    }
  };

export const validateSignupTokenAction =
  (token: string) => async (dispatch: AppDispatch) => {
    dispatch(validateSignupTokenRequest());
    try {
      await validateSignupTokenApi(token);
      dispatch(validateSignupTokenSuccess());
    } catch (error) {
      const axiosError = error as AxiosError<{ valid?: boolean; reason?: string; message?: string }>;
      const responseData = axiosError.response?.data;
      const reason = responseData?.reason;
      const message = responseData?.message || reason || "Token validation failed";
      
      // Don't show toast for "Invitation already used" - we'll show a better UI instead
      if (reason !== "Invitation already used") {
        toast.error(message);
      }
      
      dispatch(validateSignupTokenFailed({ message, reason }));
    }
  };

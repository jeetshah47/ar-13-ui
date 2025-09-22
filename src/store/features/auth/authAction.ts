import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../config/firebase";
import type { AppDispatch } from "../../store";
import {
  authSignInFailed,
  authSignInRequest,
  authSignInSuccess,
  authSignUpFailed,
  authSignUpRequest,
  authSignUpSuccess,
} from "./authSlice";
import type { AxiosError } from "axios";
import type { AuthError } from "../../types/Auth/AuthError";
import toast from "react-hot-toast";
import { signupApi, type SingUpRequest } from "../../apis/authApis";
import { getUserProfile } from "../../apis/userApis";
import type { FirebaseError } from "firebase/app";
import type { UserRole } from "../../types/RBAC";

export const authSignInActions =
  (email: string, password: string, cb?: () => void) =>
  async (dispatch: AppDispatch) => {
    dispatch(authSignInRequest());
    try {
      signInWithEmailAndPassword(auth, email, password)
        .then(async (data) => {
          const user = data.user;
          const token = await user.getIdToken();
          const uid = user.uid;
          
          // Store auth data in localStorage
          localStorage.setItem("authToken", token);
          localStorage.setItem("uid", uid);
          
          try {
            // Fetch user profile from backend API
            const userProfile = await getUserProfile(uid);
            
            // Store user data in localStorage
            localStorage.setItem("userRole", userProfile.role);
            localStorage.setItem("userEmail", userProfile.email);
            localStorage.setItem("userName", userProfile.name);
            
            dispatch(authSignInSuccess({ 
              token, 
              uid, 
              role: userProfile.role as UserRole,
              email: userProfile.email,
              name: userProfile.name
            }));
          } catch {
            // Fallback to default role if API call fails
            // This ensures the app continues to work even if the user profile API is unavailable
            const defaultRole = "Admin";
            localStorage.setItem("userRole", defaultRole);
            localStorage.setItem("userEmail", user.email || "");
            localStorage.setItem("userName", user.displayName || "");
            
            dispatch(authSignInSuccess({ 
              token, 
              uid, 
              role: defaultRole as UserRole,
              email: user.email || undefined,
              name: user.displayName || undefined
            }));
          }
          
          if (cb) cb();
        })
        .catch((error: FirebaseError) => {
          if (error?.message) {
            dispatch(authSignInFailed(error?.message));
            toast.error(error?.message);
          }
        });
    } catch {
      dispatch(authSignInFailed("Unkown Error"));
      toast.error("Login Failed");
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

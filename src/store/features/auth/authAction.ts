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
import type { FirebaseError } from "firebase/app";

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
          localStorage.setItem("authToken", token);
          localStorage.setItem("uid", uid);
          dispatch(authSignInSuccess({ token, uid }));
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

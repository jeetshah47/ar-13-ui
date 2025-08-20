import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "./authTypes";
import type { AuthResponse } from "../../types/AuthResponse";
import type { AuthError } from "../../types/AuthError";

const checkAuthFromToken = (): AuthState => {
  const token = localStorage.getItem("authToken");
  const uid = localStorage.getItem("uid");
  const state = {
    api: {
      token: "",
      uid: "",
    },
    common: {
      isLogin: false,
    },
    error: "",
    loading: false,
  };
  if (token && uid) {
    state.api.token = token;
    state.api.uid = uid;
    state.common.isLogin = true;
  }

  return state;
};

const initialState: AuthState = checkAuthFromToken();

const authSlice = createSlice({
  name: "common/auth",
  initialState,
  reducers: {
    authSignInRequest(state) {
      state.api.token = "";
      state.api.uid = "";
      state.common.isLogin = false;
      state.loading = true;
      state.error = "";
    },
    authSignInSuccess(state, action: PayloadAction<AuthResponse>) {
      state.api.token = action.payload.token;
      state.api.uid = action.payload.uid;
      state.common.isLogin = true;
      state.loading = false;
      state.error = "";
    },
    authSignInFailed(state, action: PayloadAction<AuthError>) {
      state.api.token = "";
      state.api.uid = "";
      state.common.isLogin = false;
      state.loading = false;
      state.error = action.payload.error;
    },
    authLogout(state) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("uid");
      state.api.token = "";
      state.api.uid = "";
      state.common.isLogin = false;
      state.loading = false;
      state.error = "";
    },
    authSignUpRequest(state) {
      state.loading = true;
      state.error = "";
    },
    authSignUpSuccess(state) {
      state.loading = false;
      state.error = "";
    },
    authSignUpFailed(state, action: PayloadAction<AuthError>) {
      state.loading = false;
      state.error = action.payload.error;
    },
  },
});

export const {
  authSignInRequest,
  authSignInSuccess,
  authSignInFailed,
  authLogout,
  authSignUpRequest,
  authSignUpSuccess,
  authSignUpFailed,
} = authSlice.actions;

export const authReducer = authSlice.reducer;

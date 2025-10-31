import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "./authTypes";
import type { AuthResponse } from "../../types/Auth/AuthResponse";
import type { AuthError } from "../../types/Auth/AuthError";
import { getPermissionsForRole } from "../../types/RBAC/config";
import type { UserRole } from "../../types/RBAC";

const checkAuthFromToken = (): AuthState => {
  const token = localStorage.getItem("authToken");
  const uid = localStorage.getItem("uid");
  const role = localStorage.getItem("userRole") as UserRole | null;
  const email = localStorage.getItem("userEmail");
  const name = localStorage.getItem("userName");
  
  const state: AuthState = {
    api: {
      token: "",
      uid: "",
    },
    common: {
      isLogin: false,
    },
    user: {
      role: null,
      permissions: [],
      email: null,
      name: null,
    },
    error: "",
    loading: false,
    tokenValidation: {
      isValidating: false,
      isValid: null,
      error: "",
      reason: undefined,
    },
  };
  
  if (token && uid) {
    state.api.token = token;
    state.api.uid = uid;
    state.common.isLogin = true;
    
    if (role) {
      state.user.role = role;
      state.user.permissions = getPermissionsForRole(role);
    }
    
    if (email) {
      state.user.email = email;
    }
    
    if (name) {
      state.user.name = name;
    }
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
      state.user.role = null;
      state.user.permissions = [];
      state.user.email = null;
      state.user.name = null;
      state.loading = true;
      state.error = "";
    },
    authSignInSuccess(state, action: PayloadAction<AuthResponse>) {
      state.api.token = action.payload.token;
      state.api.uid = action.payload.uid;
      state.common.isLogin = true;
      
      if (action.payload.role) {
        state.user.role = action.payload.role;
        state.user.permissions = getPermissionsForRole(action.payload.role);
      }
      
      if (action.payload.email) {
        state.user.email = action.payload.email;
      }
      
      if (action.payload.name) {
        state.user.name = action.payload.name;
      }
      
      state.loading = false;
      state.error = "";
    },
    authSignInFailed(state, action: PayloadAction<string>) {
      state.api.token = "";
      state.api.uid = "";
      state.common.isLogin = false;
      state.user.role = null;
      state.user.permissions = [];
      state.user.email = null;
      state.user.name = null;
      state.loading = false;
      state.error = action.payload;
    },
    authLogout(state) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("uid");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      state.api.token = "";
      state.api.uid = "";
      state.common.isLogin = false;
      state.user.role = null;
      state.user.permissions = [];
      state.user.email = null;
      state.user.name = null;
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
    validateSignupTokenRequest(state) {
      state.tokenValidation.isValidating = true;
      state.tokenValidation.error = "";
    },
    validateSignupTokenSuccess(state) {
      state.tokenValidation.isValidating = false;
      state.tokenValidation.isValid = true;
      state.tokenValidation.error = "";
    },
    validateSignupTokenFailed(state, action: PayloadAction<{ message: string; reason?: string }>) {
      state.tokenValidation.isValidating = false;
      state.tokenValidation.isValid = false;
      state.tokenValidation.error = action.payload.message;
      state.tokenValidation.reason = action.payload.reason;
    },
    clearTokenValidation(state) {
      state.tokenValidation.isValidating = false;
      state.tokenValidation.isValid = null;
      state.tokenValidation.error = "";
      state.tokenValidation.reason = undefined;
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
  validateSignupTokenRequest,
  validateSignupTokenSuccess,
  validateSignupTokenFailed,
  clearTokenValidation,
} = authSlice.actions;

export const authReducer = authSlice.reducer;

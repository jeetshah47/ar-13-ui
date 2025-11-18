import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserState } from "./userTypes";
import type { UserResponse } from "../../types/User/UserResponse";
import type { UserErrorResponse } from "../../types/User/UserErrorResponse";
import type { UserProfileResponse } from "../../types/User/UserProfileResponse";
import type { UserPermissionsResponse } from "../../types/User/UserPermissionsResponse";

const initialState: UserState = {
  users: [],
  loading: false,
  error: "",
  profile: null,
  profileLoading: false,
  profileError: "",
  permissions: null,
  permissionsLoading: false,
  permissionsError: "",
  updating: false,
  updateError: "",
  deleting: false,
  deleteError: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUsersRequest: (state) => {
      state.loading = true;
    },
    getUsersSuccess: (state, action: PayloadAction<{ users: UserResponse[] }>) => {
      state.users = action.payload.users;
      state.loading = false;
    },
    getUsersFailed: (state, action: PayloadAction<UserErrorResponse>) => {
      state.loading = false;
      state.error = action.payload.error;
    },
    getUserProfileRequest: (state) => {
      state.profileLoading = true;
      state.profileError = "";
    },
    getUserProfileSuccess: (state, action: PayloadAction<UserProfileResponse>) => {
      state.profile = action.payload;
      state.profileLoading = false;
      state.profileError = "";
    },
    getUserProfileFailed: (state, action: PayloadAction<string>) => {
      state.profileLoading = false;
      state.profileError = action.payload;
    },
    getUserPermissionsRequest: (state) => {
      state.permissionsLoading = true;
      state.permissionsError = "";
    },
    getUserPermissionsSuccess: (state, action: PayloadAction<UserPermissionsResponse>) => {
      state.permissions = action.payload;
      state.permissionsLoading = false;
      state.permissionsError = "";
    },
    getUserPermissionsFailed: (state, action: PayloadAction<string>) => {
      state.permissionsLoading = false;
      state.permissionsError = action.payload;
    },
    updateUserRequest: (state) => {
      state.updating = true;
      state.updateError = "";
    },
    updateUserSuccess: (state) => {
      state.updating = false;
      state.updateError = "";
    },
    updateUserFailed: (state, action: PayloadAction<string>) => {
      state.updating = false;
      state.updateError = action.payload;
    },
    deleteUserRequest: (state) => {
      state.deleting = true;
      state.deleteError = "";
    },
    deleteUserSuccess: (state, action: PayloadAction<string>) => {
      // Remove the deleted user from the users array
      state.users = state.users.filter((user) => user.id !== action.payload);
      state.deleting = false;
      state.deleteError = "";
    },
    deleteUserFailed: (state, action: PayloadAction<string>) => {
      state.deleting = false;
      state.deleteError = action.payload;
    },
  },
});

export const {
  getUsersRequest,
  getUsersSuccess,
  getUsersFailed,
  getUserProfileRequest,
  getUserProfileSuccess,
  getUserProfileFailed,
  getUserPermissionsRequest,
  getUserPermissionsSuccess,
  getUserPermissionsFailed,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailed,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailed,
} = userSlice.actions;

export const userReducer = userSlice.reducer;

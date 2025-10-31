import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserState } from "./userTypes";
import type { UserResponse } from "../../types/User/UserResponse";
import type { UserErrorResponse } from "../../types/User/UserErrorResponse";
import type { UserProfileResponse } from "../../types/User/UserProfileResponse";

const initialState: UserState = {
  users: [],
  loading: false,
  error: "",
  profile: null,
  profileLoading: false,
  profileError: "",
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
  },
});

export const { getUsersRequest, getUsersSuccess, getUsersFailed, getUserProfileRequest, getUserProfileSuccess, getUserProfileFailed } =
  userSlice.actions;

export const userReducer = userSlice.reducer;

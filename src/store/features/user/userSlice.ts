import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserState } from "./userTypes";
import type { UserResponse } from "../../types/User/UserResponse";
import type { UserErrorResponse } from "../../types/User/UserErrorResponse";

const initialState: UserState = {
  users: [],
  loading: false,
  error: "",
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
  },
});

export const { getUsersRequest, getUsersSuccess, getUsersFailed } =
  userSlice.actions;

export const userReducer = userSlice.reducer;

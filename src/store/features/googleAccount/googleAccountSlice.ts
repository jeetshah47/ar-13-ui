import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GoogleAccountState } from "./googleAccountTypes";
import type { IUserAccountLink } from "../../types/GoogleAccount/GoogleAccountTypes";

const initialState: GoogleAccountState = {
  link: null,
  linked: false,
  loading: false,
  error: null,
  linking: false,
  unlinking: false,
};

const googleAccountSlice = createSlice({
  name: "googleAccount",
  initialState,
  reducers: {
    getGoogleAccountStatusRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getGoogleAccountStatusSuccess: (
      state,
      action: PayloadAction<{ linked: boolean; link: IUserAccountLink | null }>
    ) => {
      state.loading = false;
      state.linked = action.payload.linked;
      state.link = action.payload.link;
      state.error = null;
    },
    getGoogleAccountStatusFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    linkGoogleAccountRequest: (state) => {
      state.linking = true;
      state.error = null;
    },
    linkGoogleAccountSuccess: (state, action: PayloadAction<IUserAccountLink>) => {
      state.linking = false;
      state.linked = true;
      state.link = action.payload;
      state.error = null;
    },
    linkGoogleAccountFailed: (state, action: PayloadAction<string>) => {
      state.linking = false;
      state.error = action.payload;
    },
    unlinkGoogleAccountRequest: (state) => {
      state.unlinking = true;
      state.error = null;
    },
    unlinkGoogleAccountSuccess: (state) => {
      state.unlinking = false;
      state.linked = false;
      state.link = null;
      state.error = null;
    },
    unlinkGoogleAccountFailed: (state, action: PayloadAction<string>) => {
      state.unlinking = false;
      state.error = action.payload;
    },
    clearGoogleAccountError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getGoogleAccountStatusRequest,
  getGoogleAccountStatusSuccess,
  getGoogleAccountStatusFailed,
  linkGoogleAccountRequest,
  linkGoogleAccountSuccess,
  linkGoogleAccountFailed,
  unlinkGoogleAccountRequest,
  unlinkGoogleAccountSuccess,
  unlinkGoogleAccountFailed,
  clearGoogleAccountError,
} = googleAccountSlice.actions;

export const googleAccountReducer = googleAccountSlice.reducer;


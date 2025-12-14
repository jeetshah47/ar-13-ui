import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface BackupState {
  api: {
    data: {
      lastBackupLocation: string | null;
    };
    loading: boolean;
    error: string;
  };
}

const initialState: BackupState = {
  api: {
    data: {
      lastBackupLocation: null,
    },
    loading: false,
    error: "",
  },
};

const backupSlice = createSlice({
  name: "backup",
  initialState,
  reducers: {
    createBackupRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    createBackupSuccess(
      state,
      action: PayloadAction<{ backupLocation?: string; message: string }>
    ) {
      state.api.loading = false;
      state.api.error = "";
      if (action.payload.backupLocation) {
        state.api.data.lastBackupLocation = action.payload.backupLocation;
      }
    },
    createBackupFailed(state, action: PayloadAction<{ error: string }>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
  },
});

export const {
  createBackupRequest,
  createBackupSuccess,
  createBackupFailed,
} = backupSlice.actions;

export const backupReducer = backupSlice.reducer;


import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { VacationResponse, VacationStats } from "../../types/Vacation/VacationTypes";

export interface VacationState {
  api: {
    data: {
      requests: VacationResponse[];
      stats: VacationStats | null;
    };
    loading: boolean;
    error: string;
  };
}

const initialState: VacationState = {
  api: {
    data: {
      requests: [],
      stats: null,
    },
    loading: false,
    error: "",
  },
};

const vacationSlice = createSlice({
  name: "vacation",
  initialState,
  reducers: {
    createVacationRequestRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    createVacationRequestSuccess(state, action: PayloadAction<{ request: VacationResponse }>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.requests.unshift(action.payload.request);
    },
    createVacationRequestFailed(state, action: PayloadAction<{ error: string }>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
    getAllVacationRequestsRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    getAllVacationRequestsSuccess(state, action: PayloadAction<{ requests: VacationResponse[] }>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.requests = action.payload.requests;
    },
    getAllVacationRequestsFailed(state, action: PayloadAction<{ error: string }>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
    getVacationStatsRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    getVacationStatsSuccess(state, action: PayloadAction<{ stats: VacationStats }>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.stats = action.payload.stats;
    },
    getVacationStatsFailed(state, action: PayloadAction<{ error: string }>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
    updateVacationRequestStatusRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    updateVacationRequestStatusSuccess(state, action: PayloadAction<{ requestId: string; status: "approved" | "rejected" }>) {
      state.api.loading = false;
      state.api.error = "";
      const request = state.api.data.requests.find((req) => req.id === action.payload.requestId);
      if (request) {
        request.status = action.payload.status;
      }
    },
    updateVacationRequestStatusFailed(state, action: PayloadAction<{ error: string }>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
  },
});

export const {
  createVacationRequestRequest,
  createVacationRequestSuccess,
  createVacationRequestFailed,
  getAllVacationRequestsRequest,
  getAllVacationRequestsSuccess,
  getAllVacationRequestsFailed,
  getVacationStatsRequest,
  getVacationStatsSuccess,
  getVacationStatsFailed,
  updateVacationRequestStatusRequest,
  updateVacationRequestStatusSuccess,
  updateVacationRequestStatusFailed,
} = vacationSlice.actions;

export const vacationReducer = vacationSlice.reducer;

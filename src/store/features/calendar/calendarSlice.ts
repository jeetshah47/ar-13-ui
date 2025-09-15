import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CalendarState } from "./calendarTypes";
import type { CalendarResponse } from "../../types/Calendar/CalendarResponse";
import type { CalendarErrorResponse } from "../../types/Calendar/CalendarErrorResponse";

const initialState: CalendarState = {
  api: {
    data: {
      events: [],
    },
    error: "",
    loading: false,
  },
  common: {
    selectedEventId: "",
  },
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    getCalendarEventsRequest(state) {
      state.api.loading = true;
      state.api.error = "";
      state.api.data.events = [];
      state.common.selectedEventId = "";
    },
    getCalendarEventsSuccess(
      state,
      action: PayloadAction<{ events: CalendarResponse[] }>
    ) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.events = action.payload.events;
      state.common.selectedEventId = "";
    },
    getCalendarEventsFailed(state, action: PayloadAction<CalendarErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
      state.api.data.events = [];
      state.common.selectedEventId = "";
    },
    updateSelectedEventId(state, action: PayloadAction<string>) {
      state.common.selectedEventId = action.payload;
    },
    addCalendarEventRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    addCalendarEventSuccess(state, action: PayloadAction<CalendarResponse>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.events.push(action.payload);
    },
    addCalendarEventFailed(state, action: PayloadAction<CalendarErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
    updateCalendarEventRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    updateCalendarEventSuccess(state, action: PayloadAction<CalendarResponse>) {
      state.api.loading = false;
      state.api.error = "";
      const index = state.api.data.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.api.data.events[index] = action.payload;
      }
    },
    updateCalendarEventFailed(state, action: PayloadAction<CalendarErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
    deleteCalendarEventRequest(state) {
      state.api.loading = true;
      state.api.error = "";
    },
    deleteCalendarEventSuccess(state, action: PayloadAction<string>) {
      state.api.loading = false;
      state.api.error = "";
      state.api.data.events = state.api.data.events.filter(event => event.id !== action.payload);
    },
    deleteCalendarEventFailed(state, action: PayloadAction<CalendarErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
    },
  },
});

export const {
  getCalendarEventsRequest,
  getCalendarEventsSuccess,
  getCalendarEventsFailed,
  updateSelectedEventId,
  addCalendarEventRequest,
  addCalendarEventSuccess,
  addCalendarEventFailed,
  updateCalendarEventRequest,
  updateCalendarEventSuccess,
  updateCalendarEventFailed,
  deleteCalendarEventRequest,
  deleteCalendarEventSuccess,
  deleteCalendarEventFailed,
} = calendarSlice.actions;

export const calendarReducer = calendarSlice.reducer;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CalendarState } from "./calendarTypes";
import type { CalendarResponse } from "../../types/Calendar/CalendarResponse";
import type { CalendarErrorResponse } from "../../types/Calendar/CalendarErrorResponse";

const initialState: CalendarState = {
  api: {
    data: {
      events: [],
      dailyRepeatingEvents: [],
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
      // Don't clear events yet - we'll merge with daily repeating events
      state.common.selectedEventId = "";
    },
    getCalendarEventsSuccess(
      state,
      action: PayloadAction<{ events: CalendarResponse[] }>
    ) {
      state.api.loading = false;
      state.api.error = "";
      
      // Extract daily repeating events from the new events
      const newDailyRepeatingEvents = action.payload.events.filter(
        (event) => event.isRepeating && event.repeatFrequency === 'daily'
      );
      
      // Update the cache of daily repeating events
      // Remove any that might have been deleted/updated, then add/update new ones
      newDailyRepeatingEvents.forEach((newEvent) => {
        const existingIndex = state.api.data.dailyRepeatingEvents.findIndex(
          (e) => e.id === newEvent.id
        );
        if (existingIndex >= 0) {
          state.api.data.dailyRepeatingEvents[existingIndex] = newEvent;
        } else {
          state.api.data.dailyRepeatingEvents.push(newEvent);
        }
      });
      
      // Merge current month events with daily repeating events that should appear this month
      const allEvents = [...action.payload.events];
      
      // Add daily repeating events that aren't already in the current month's events
      state.api.data.dailyRepeatingEvents.forEach((repeatingEvent) => {
        const alreadyIncluded = allEvents.some((e) => e.id === repeatingEvent.id);
        if (!alreadyIncluded) {
          allEvents.push(repeatingEvent);
        }
      });
      
      state.api.data.events = allEvents;
      state.common.selectedEventId = "";
    },
    getCalendarEventsFailed(state, action: PayloadAction<CalendarErrorResponse>) {
      state.api.loading = false;
      state.api.error = action.payload.error;
      state.api.data.events = [];
      // Keep daily repeating events cache even on error
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
      
      // If it's a daily repeating event, add to cache
      if (action.payload.isRepeating && action.payload.repeatFrequency === 'daily') {
        const existingIndex = state.api.data.dailyRepeatingEvents.findIndex(
          (e) => e.id === action.payload.id
        );
        if (existingIndex >= 0) {
          state.api.data.dailyRepeatingEvents[existingIndex] = action.payload;
        } else {
          state.api.data.dailyRepeatingEvents.push(action.payload);
        }
      }
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
      
      // Update daily repeating events cache if it's a daily repeating event
      if (action.payload.isRepeating && action.payload.repeatFrequency === 'daily') {
        const repeatingIndex = state.api.data.dailyRepeatingEvents.findIndex(
          (e) => e.id === action.payload.id
        );
        if (repeatingIndex >= 0) {
          state.api.data.dailyRepeatingEvents[repeatingIndex] = action.payload;
        } else {
          state.api.data.dailyRepeatingEvents.push(action.payload);
        }
      } else {
        // If it's no longer daily repeating, remove from cache
        state.api.data.dailyRepeatingEvents = state.api.data.dailyRepeatingEvents.filter(
          (e) => e.id !== action.payload.id
        );
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
      // Also remove from daily repeating events cache
      state.api.data.dailyRepeatingEvents = state.api.data.dailyRepeatingEvents.filter(
        (e) => e.id !== action.payload
      );
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

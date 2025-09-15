import { 
  getCalendarEventsRequest, 
  getCalendarEventsSuccess, 
  getCalendarEventsFailed,
  addCalendarEventRequest,
  addCalendarEventSuccess,
  addCalendarEventFailed,
  updateCalendarEventRequest,
  updateCalendarEventSuccess,
  updateCalendarEventFailed,
  deleteCalendarEventRequest,
  deleteCalendarEventSuccess,
  deleteCalendarEventFailed,
} from "./calendarSlice";
import { 
  getCalendarEventsByMonth, 
  addCalendarEvent, 
  updateCalendarEvent, 
  deleteCalendarEvent 
} from "../../apis/calendarApis";
import type { CalendarRequest } from "../../types/Calendar/CalendarRequest";
import type { CalendarErrorResponse } from "../../types/Calendar/CalendarErrorResponse";
import type { AppDispatch } from "../../store";

export const fetchCalendarEvents = (year: number, month: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(getCalendarEventsRequest());
    const response = await getCalendarEventsByMonth(year, month);
    dispatch(getCalendarEventsSuccess(response));
  } catch (error) {
    const errorResponse: CalendarErrorResponse = {
      error: error instanceof Error ? error.message : "Failed to fetch calendar events",
    };
    dispatch(getCalendarEventsFailed(errorResponse));
  }
};

export const createCalendarEvent = (eventData: CalendarRequest) => async (dispatch: AppDispatch) => {
  try {
    dispatch(addCalendarEventRequest());
    const response = await addCalendarEvent(eventData);
    dispatch(addCalendarEventSuccess(response));
  } catch (error) {
    const errorResponse: CalendarErrorResponse = {
      error: error instanceof Error ? error.message : "Failed to create calendar event",
    };
    dispatch(addCalendarEventFailed(errorResponse));
  }
};

export const editCalendarEvent = (eventId: string, eventData: CalendarRequest) => async (dispatch: AppDispatch) => {
  try {
    dispatch(updateCalendarEventRequest());
    const response = await updateCalendarEvent(eventId, eventData);
    dispatch(updateCalendarEventSuccess(response));
  } catch (error) {
    const errorResponse: CalendarErrorResponse = {
      error: error instanceof Error ? error.message : "Failed to update calendar event",
    };
    dispatch(updateCalendarEventFailed(errorResponse));
  }
};

export const removeCalendarEvent = (eventId: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(deleteCalendarEventRequest());
    await deleteCalendarEvent(eventId);
    dispatch(deleteCalendarEventSuccess(eventId));
  } catch (error) {
    const errorResponse: CalendarErrorResponse = {
      error: error instanceof Error ? error.message : "Failed to delete calendar event",
    };
    dispatch(deleteCalendarEventFailed(errorResponse));
  }
};

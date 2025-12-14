import type { CalendarResponse } from "../types/Calendar/CalendarResponse";
import type { CalendarRequest } from "../types/Calendar/CalendarRequest";
import { http } from "../../config/http";
import { API_BASE_URL } from "../../config/api";

export async function addCalendarEvent(event: CalendarRequest): Promise<CalendarResponse> {
  const url = `${API_BASE_URL}/calendar/add`;
  const result = await http.post(url, event);
  return result.data;
}

export async function getCalendarEventsByMonth(year: number, month: number): Promise<{
  events: CalendarResponse[];
}> {
  const url = `${API_BASE_URL}/calendar/month/${year}/${month}`;
  const result = await http.get(url);
  return result.data;
}

export async function getCalendarEventById(eventId: string): Promise<CalendarResponse> {
  const url = `${API_BASE_URL}/calendar/event/${eventId}`;
  const result = await http.get(url);
  return result.data;
}

export async function updateCalendarEvent(eventId: string, event: CalendarRequest): Promise<CalendarResponse> {
  const url = `${API_BASE_URL}/calendar/update/${eventId}`;
  const result = await http.put(url, event);
  return result.data;
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const url = `${API_BASE_URL}/calendar/delete/${eventId}`;
  await http.delete(url);
}

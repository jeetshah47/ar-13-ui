import type { CalendarResponse } from "../types/Calendar/CalendarResponse";
import type { CalendarRequest } from "../types/Calendar/CalendarRequest";
import { http } from "../../config/http";

export async function addCalendarEvent(event: CalendarRequest): Promise<CalendarResponse> {
  const url = `http://localhost:3000/api/calendar/add`;
  const result = await http.post(url, event);
  return result.data;
}

export async function getCalendarEventsByMonth(year: number, month: number): Promise<{
  events: CalendarResponse[];
}> {
  const url = `http://localhost:3000/api/calendar/${year}/${month}`;
  const result = await http.get(url);
  return result.data;
}

export async function getCalendarEventById(eventId: string): Promise<CalendarResponse> {
  const url = `http://localhost:3000/api/calendar/${eventId}`;
  const result = await http.get(url);
  return result.data;
}

export async function updateCalendarEvent(eventId: string, event: CalendarRequest): Promise<CalendarResponse> {
  const url = `http://localhost:3000/api/calendar/update/${eventId}`;
  const result = await http.put(url, event);
  return result.data;
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const url = `http://localhost:3000/api/calendar/delete/${eventId}`;
  await http.delete(url);
}

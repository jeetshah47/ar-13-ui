import type { CalendarResponse } from "../../types/Calendar/CalendarResponse";

export interface CalendarState {
  api: {
    data: {
      events: CalendarResponse[];
      dailyRepeatingEvents: CalendarResponse[]; // Cache of daily repeating events
    };
    error: string;
    loading: boolean;
  };
  common: {
    selectedEventId: string;
  };
}

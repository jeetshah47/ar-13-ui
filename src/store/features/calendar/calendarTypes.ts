import type { CalendarResponse } from "../../types/Calendar/CalendarResponse";

export interface CalendarState {
  api: {
    data: {
      events: CalendarResponse[];
    };
    error: string;
    loading: boolean;
  };
  common: {
    selectedEventId: string;
  };
}

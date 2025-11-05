export interface CalendarResponse {
  id: string;
  title?: string;
  category?: string;
  priority?: string;
  start: string;
  end: string;
  time?: string;
  description?: string;
  isRepeating?: boolean;
  repeatFrequency?: string;
  repeatDays?: string[];
  createdBy?: string;
  addToGoogleCalendar?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

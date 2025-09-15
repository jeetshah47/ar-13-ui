export interface CalendarRequest {
  title: string;
  category: string;
  priority: string;
  start: string;
  end: string;
  time: string;
  description: string;
  isRepeating: boolean;
  repeatFrequency: string;
  repeatDays: string[];
  createdBy: string;
}

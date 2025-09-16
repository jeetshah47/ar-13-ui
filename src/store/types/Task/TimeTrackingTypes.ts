export interface TimeTrackingData {
  taskId: string;
  date: string; // YYYY-MM-DD format
  totalMinutes: number;
  entries: TimeSpentEntry[];
}

export interface TimeSpentEntry {
  date: string;
  timeSpent: number; // in minutes
  description?: string;
}

export interface TimeTrackingState {
  api: {
    data: {
      timeTrackingData: TimeTrackingData[];
      dailyTimeSpent: Record<string, number>; // date -> total minutes
    };
    loading: boolean;
    error: string;
  };
}

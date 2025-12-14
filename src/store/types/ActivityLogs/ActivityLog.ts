export type EntityType = "task" | "project" | "user" | "calendarEvent";

export interface ActivityLogFields {
  [key: string]: unknown;
}

export interface CreatedByUser {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  role: string;
  designation?: string;
  created: string;
  updated: string | null;
}

export interface ActivityLogItem {
  id: string;
  entityType: EntityType;
  entityId: string;
  action: string;
  createdAt: string; // ISO string
  created: string; // ISO string
  updated: string | null;
  createdBy: string;
  createdByUser?: CreatedByUser;
  fields?: ActivityLogFields;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface ActivityLogsResponse {
  activityLogs: ActivityLogItem[];
}

export interface ActivityLogsState {
  api: {
    data: {
      items: ActivityLogItem[];
    };
    loading: boolean;
    error: string;
  };
}

export interface EntityTypesResponse {
  entityTypes: EntityType[];
}



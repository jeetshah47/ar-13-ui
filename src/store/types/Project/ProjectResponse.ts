export interface ProjectResponse {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  membersIds: string[] | null;
  productionDuration?: number;
  siteDuration?: number;
  logoUrl?: string;
  code?: string;
  agencyContact?: {
    contact_name?: string;
    contact_agency_type?: string;
    phone_number?: string;
    firm_name?: string;
  };
  created: string | Created; // Support both ISO string and Firebase timestamp format
  updated?: string;
  deadLine?: string; // Keep for backward compatibility
  isArchived?: boolean;
}

interface Created {
  _seconds: number;
  _nanoseconds: number;
}

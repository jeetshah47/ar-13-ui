export interface AgencyContact {
  contact_name?: string;
  contact_agency_type?: string;
}

export interface ProjectRequest {
  id?: string; // Required for updates, optional for creates
  title: string;
  description: string;
  ownerId: string;
  membersIds: string[];
  productionDuration: number; // weeks
  siteDuration: number; // months
  deadLine?: string;
  logoUrl?: string;
  code?: string;
  agencyContact?: AgencyContact;
}

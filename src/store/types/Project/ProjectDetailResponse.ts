import type { ProjectResponse } from "./ProjectResponse";

export interface ProjectDetailResponse {
  project: ProjectResponse & {
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
    created?: string;
    updated?: string;
    reporter?: {
      name: string;
      avatar: string;
    };
    assignes?: Array<{
      id: string;
      name: string;
      avatar: string;
    }>;
    priority?: string;
    deadline?: string;
  };
  // Keep projectDetails for backward compatibility with existing code
  projectDetails?: ProjectResponse & {
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
    created?: string;
    updated?: string;
    reporter?: {
      name: string;
      avatar: string;
    };
    assignes?: Array<{
      id: string;
      name: string;
      avatar: string;
    }>;
    priority?: string;
    deadline?: string;
  };
}

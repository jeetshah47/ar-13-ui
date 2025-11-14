export interface ProjectRequest {
  title: string;
  description: string;
  ownerId: string;
  membersIds: string[];
  startDate: string;
  endDate: string;
  deadLine: string;
  logoUrl?: string;
}

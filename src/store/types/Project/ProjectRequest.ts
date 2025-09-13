export interface ProjectRequest {
  title: string;
  description: string;
  deadLine: string;
  membersIds: string[];
  ownerId: string;
  logoUrl?: string;
}

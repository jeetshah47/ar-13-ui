export interface ProjectResponse {
  title: string;
  description: string;
  ownerId: string;
  membersIds: string[] | null;
  deadLine: string;
  id: string;
  created: Created;
}

interface Created {
  _seconds: number;
  _nanoseconds: number;
}

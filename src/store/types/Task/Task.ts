export interface ITask {
  _id: string;
  subject: string;
  code: string;
  status: string;
  duration: Date;
  priority: string;
  assignTo: string[];
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

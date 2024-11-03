export type TaskStatus = 'Not Started' | 'On Progress' | 'Done' | 'Reject';

export interface Task {
  id: string;
  createdBy: 'Lead' | 'Team';
  assignedTo: string;
  title: string;
  description: string;
  status: TaskStatus;
  logs: { timestamp: Date; message: string }[];
}

export interface TaskLogTypes {
  timestamp: Date;
  message: string;
}

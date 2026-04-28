export interface Board {
  id: number;
  name: string;
  owner_id: number;
  created_at?: string;
}

export enum TaskStatus {
  TODO = "todo",
  DOING = "doing",
  DONE = "done",
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  board_id: number;
  created_at?: string;
}

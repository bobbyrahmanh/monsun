export type TaskStatus = "pending" | "completed";

export interface Task {
  id: string;
  title: string;
  dueDate: string; // format YYYY-MM-DD
  status: TaskStatus;
}

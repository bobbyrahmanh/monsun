export type TaskStatus = "pending" | "completed";
export type Priority = "normal" | "medium" | "high" | "urgent";
export type Repeat = "daily" | "weekly" | "monthly";

export interface Task {
  id: string;
  title: string;
  dueDate: string; // format YYYY-MM-DD
  status: TaskStatus;
  completedAt?: string; // YYYY-MM-DD, diisi saat tugas dicentang selesai
  priority?: Priority; // kosong = normal
  repeat?: Repeat; // kosong = tidak berulang
  spawnedId?: string; // id tugas lanjutan yang dibuat otomatis saat tugas berulang ini selesai
}

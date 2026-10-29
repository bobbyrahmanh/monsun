import { PRIORITY_WEIGHT, priorityOf } from "./taskMeta";
import type { Priority, Task } from "./types";

export type StatusFilter = "all" | "pending" | "completed";
export type PriorityFilter = Priority | "all";

export interface TaskFilter {
  status: StatusFilter;
  query: string;
  priority: PriorityFilter;
}

// Urutan standar: belum selesai dulu, lalu tanggal terdekat, lalu prioritas tertinggi.
// Sengaja TANPA pembanding judul: sort bersifat stabil, jadi tugas yang sama-sama
// setara tetap tampil dengan yang terbaru di atas.
export function compareTasks(a: Task, b: Task): number {
  if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
  if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
  return PRIORITY_WEIGHT[priorityOf(b)] - PRIORITY_WEIGHT[priorityOf(a)];
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort(compareTasks);
}

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  const query = filter.query.trim().toLowerCase();
  return tasks.filter(
    (t) =>
      (filter.status === "all" || t.status === filter.status) &&
      (filter.priority === "all" || priorityOf(t) === filter.priority) &&
      (query === "" || t.title.toLowerCase().includes(query)),
  );
}

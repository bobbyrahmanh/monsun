import type { Priority, Repeat } from "./types";

export const PRIORITIES: Priority[] = ["normal", "medium", "high", "urgent"];

export const PRIORITY_LABEL: Record<Priority, string> = {
  normal: "Normal",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

// Makin besar makin penting (dipakai untuk mengurutkan).
export const PRIORITY_WEIGHT: Record<Priority, number> = { normal: 0, medium: 1, high: 2, urgent: 3 };

export const REPEATS: Repeat[] = ["daily", "weekly", "monthly"];

export const REPEAT_LABEL: Record<Repeat, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

export function isPriority(value: unknown): value is Priority {
  return typeof value === "string" && (PRIORITIES as string[]).includes(value);
}

export function isRepeat(value: unknown): value is Repeat {
  return typeof value === "string" && (REPEATS as string[]).includes(value);
}

// Tugas lama tidak punya field priority, jadi dianggap normal.
export function priorityOf(task: { priority?: Priority }): Priority {
  return task.priority ?? "normal";
}

// "normal" tidak perlu disimpan: kosong sudah berarti normal (data tetap ramping).
export function normalizePriority(priority: Priority | undefined): Priority | undefined {
  return priority && priority !== "normal" ? priority : undefined;
}

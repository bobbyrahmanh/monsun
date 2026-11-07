import { isOverdue } from "@/lib/deadline";
import type { Task } from "@/lib/types";

// Warna status tugas di kalender. Dipakai bersama oleh tampilan bulan dan tampilan minggu,
// supaya satu tugas selalu berwarna sama di mana pun ia muncul.
export type Tone = "done" | "overdue" | "pending";

export function toneOf(task: Task, now: Date): Tone {
  if (task.status === "completed") return "done";
  return isOverdue(task, now) ? "overdue" : "pending";
}

export const DOT: Record<Tone, string> = {
  done: "bg-brand",
  overdue: "bg-red-600",
  pending: "bg-accent ring-1 ring-ink/25",
};

export const CHIP: Record<Tone, string> = {
  done: "bg-brand-soft text-brand-dark line-through",
  overdue: "bg-red-600 text-white",
  pending: "bg-accent text-ink",
};

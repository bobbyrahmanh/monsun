"use client";

import { Check, Trash2 } from "lucide-react";
import { useTasks } from "@/hooks/TasksContext";
import { addDays, formatShortDate, toISODate } from "@/lib/date";
import type { Task } from "@/lib/types";

function getDueLabel(task: Task) {
  const today = toISODate();
  const done = task.status === "completed";

  if (task.dueDate < today && !done) {
    return { text: `Overdue, ${formatShortDate(task.dueDate)}`, className: "bg-red-500 text-white", overdue: true };
  }
  if (task.dueDate === today) return { text: "Today", className: "bg-brand-soft text-brand-dark", overdue: false };
  if (task.dueDate === addDays(1)) return { text: "Tomorrow", className: "bg-canvas text-muted", overdue: false };
  return { text: formatShortDate(task.dueDate), className: "bg-canvas text-muted", overdue: false };
}

export default function TaskItem({ task }: { task: Task }) {
  const { toggleTask, deleteTask } = useTasks();
  const done = task.status === "completed";
  const due = getDueLabel(task);

  return (
    <li
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
        due.overdue
          ? "border-accent bg-accent-soft/90"
          : "border-edge/80 bg-surface/70 hover:bg-surface/90"
      }`}
    >
      <button
        type="button"
        onClick={() => toggleTask(task.id)}
        aria-label={done ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as completed`}
        aria-pressed={done}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          done ? "border-brand bg-brand text-white" : "border-ink/25 text-transparent hover:border-brand"
        }`}
      >
        <Check size={14} strokeWidth={3} />
      </button>

      <span className={`min-w-0 flex-1 truncate text-sm font-medium ${done ? "text-muted line-through" : ""}`}>
        {task.title}
      </span>

      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${due.className}`}>{due.text}</span>

      <button
        type="button"
        onClick={() => deleteTask(task.id)}
        aria-label={`Delete "${task.title}"`}
        className="shrink-0 rounded-full p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={16} />
      </button>
    </li>
  );
}

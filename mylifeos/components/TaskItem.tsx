"use client";

import { Check, Trash2 } from "lucide-react";
import { useTasks } from "@/hooks/TasksContext";
import { addDays, formatShortDate, toISODate } from "@/lib/date";
import type { Task } from "@/lib/types";

function getDueLabel(task: Task) {
  const today = toISODate();
  const done = task.status === "completed";

  if (task.dueDate === today) return { text: "Today", className: "bg-brand-soft text-brand-dark" };
  if (task.dueDate === addDays(1)) return { text: "Tomorrow", className: "bg-canvas text-muted" };
  if (task.dueDate < today && !done) {
    return { text: `Overdue, ${formatShortDate(task.dueDate)}`, className: "bg-red-50 text-red-600" };
  }
  return { text: formatShortDate(task.dueDate), className: "bg-canvas text-muted" };
}

export default function TaskItem({ task }: { task: Task }) {
  const { toggleTask, deleteTask } = useTasks();
  const done = task.status === "completed";
  const due = getDueLabel(task);

  return (
    <li className="group flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 transition-colors hover:border-brand/60">
      <button
        type="button"
        onClick={() => toggleTask(task.id)}
        aria-label={done ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as completed`}
        aria-pressed={done}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          done ? "border-brand bg-brand text-white" : "border-line text-transparent hover:border-brand"
        }`}
      >
        <Check size={14} strokeWidth={3} />
      </button>

      <span className={`min-w-0 flex-1 truncate text-sm font-medium ${done ? "text-muted line-through" : ""}`}>
        {task.title}
      </span>

      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${due.className}`}>{due.text}</span>

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

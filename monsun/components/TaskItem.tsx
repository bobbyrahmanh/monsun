"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Pencil, Repeat as RepeatIcon, Trash2 } from "lucide-react";
import { useTasks } from "@/hooks/TasksContext";
import { addDays, formatShortDate, toISODate } from "@/lib/date";
import { REPEAT_LABEL, priorityOf } from "@/lib/taskMeta";
import type { Task } from "@/lib/types";
import PriorityBadge from "./PriorityBadge";
import TaskEditForm from "./TaskEditForm";

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

const iconButton = "shrink-0 rounded-full p-2 text-muted transition-colors";

export default function TaskItem({ task }: { task: Task }) {
  const { toggleTask, deleteTask } = useTasks();
  const [editing, setEditing] = useState(false);
  const editButton = useRef<HTMLButtonElement>(null);
  const wasEditing = useRef(false);

  // Setelah selesai mengedit, fokus kembali ke tombol Edit (tombolnya sempat hilang saat form tampil).
  useEffect(() => {
    if (wasEditing.current && !editing) editButton.current?.focus();
    wasEditing.current = editing;
  }, [editing]);

  const done = task.status === "completed";
  const due = getDueLabel(task);

  if (editing) {
    return (
      <li className="rounded-2xl border border-edge/80 bg-surface/80 p-4">
        <TaskEditForm task={task} onDone={() => setEditing(false)} />
      </li>
    );
  }

  return (
    <li
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
        due.overdue ? "border-accent bg-accent-soft/90" : "border-edge/80 bg-surface/70 hover:bg-surface/90"
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

      {/* Judul + lencana. Di wadah sempit, lencana otomatis turun ke baris kedua. */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
        <span
          className={`min-w-[8rem] flex-1 truncate text-sm font-medium ${done ? "text-muted line-through" : ""}`}
          title={task.title}
        >
          {task.title}
        </span>
        <span className="flex shrink-0 flex-wrap items-center gap-1.5">
          <PriorityBadge priority={priorityOf(task)} />
          {task.repeat && (
            <span className="inline-flex items-center gap-1 rounded-full bg-canvas px-2.5 py-1 text-xs font-medium text-muted">
              <RepeatIcon size={11} aria-hidden="true" />
              {REPEAT_LABEL[task.repeat]}
            </span>
          )}
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${due.className}`}>{due.text}</span>
        </span>
      </div>

      <div className="flex shrink-0 items-center">
        <button
          ref={editButton}
          type="button"
          onClick={() => setEditing(true)}
          aria-label={`Edit "${task.title}"`}
          className={`${iconButton} hover:bg-canvas hover:text-ink`}
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={() => deleteTask(task.id)}
          aria-label={`Delete "${task.title}"`}
          className={`${iconButton} hover:bg-red-50 hover:text-red-600`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}

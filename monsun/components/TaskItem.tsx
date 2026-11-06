"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Pencil, Repeat as RepeatIcon, Trash2 } from "lucide-react";
import { useSettings } from "@/hooks/SettingsContext";
import { useTasks } from "@/hooks/TasksContext";
import { useMinuteNow } from "@/hooks/useMinuteNow";
import { formatTimeOfDay } from "@/lib/clock";
import { formatShortDate, shiftISO, toISODate } from "@/lib/date";
import { isOverdue } from "@/lib/deadline";
import { REPEAT_LABEL, priorityOf } from "@/lib/taskMeta";
import type { Task } from "@/lib/types";
import PriorityBadge from "./PriorityBadge";
import TaskEditForm from "./TaskEditForm";

// Teks + warna label tenggat. Contoh: "Today, 14:30", "Tomorrow", "Oct 31, 09:00",
// "Overdue, 09:00" (hari ini, jam sudah lewat), "Overdue, Oct 25 09:00" (tanggal sudah lewat).
function getDueLabel(task: Task, now: Date, hour12: boolean) {
  const today = toISODate(now);
  const time = task.dueTime ? formatTimeOfDay(task.dueTime, hour12) : "";

  if (isOverdue(task, now)) {
    const when = task.dueDate === today ? time : `${formatShortDate(task.dueDate)}${time ? ` ${time}` : ""}`;
    return { text: `Overdue, ${when}`, className: "bg-red-500 text-white", overdue: true };
  }

  const day =
    task.dueDate === today ? "Today" : task.dueDate === shiftISO(today, 1) ? "Tomorrow" : formatShortDate(task.dueDate);
  return {
    text: time ? `${day}, ${time}` : day,
    className: task.dueDate === today ? "bg-brand-soft text-brand-dark" : "bg-canvas text-muted",
    overdue: false,
  };
}

const iconButton = "shrink-0 rounded-full p-2 text-muted transition-colors";

export default function TaskItem({ task }: { task: Task }) {
  const { toggleTask, deleteTask } = useTasks();
  const { settings } = useSettings();
  // Berdetak tiap menit (satu timer bersama), jadi label "Overdue" muncul sendiri saat jamnya lewat.
  const minuteNow = useMinuteNow();
  const [editing, setEditing] = useState(false);
  const editButton = useRef<HTMLButtonElement>(null);
  const wasEditing = useRef(false);

  // Setelah selesai mengedit, fokus kembali ke tombol Edit (tombolnya sempat hilang saat form tampil).
  useEffect(() => {
    if (wasEditing.current && !editing) editButton.current?.focus();
    wasEditing.current = editing;
  }, [editing]);

  const done = task.status === "completed";
  const due = getDueLabel(task, new Date(minuteNow || Date.now()), settings.hour12);

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

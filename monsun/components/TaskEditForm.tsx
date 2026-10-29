"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { useTasks } from "@/hooks/TasksContext";
import { PRIORITIES, PRIORITY_LABEL, REPEATS, REPEAT_LABEL, priorityOf } from "@/lib/taskMeta";
import type { Priority, Repeat, Task } from "@/lib/types";
import { inputClass, selectClass } from "./fieldStyles";

interface TaskEditFormProps {
  task: Task;
  onDone: () => void; // dipanggil setelah Simpan atau Batal
}

export default function TaskEditForm({ task, onDone }: TaskEditFormProps) {
  const { updateTask } = useTasks();
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [priority, setPriority] = useState<Priority>(priorityOf(task));
  const [repeat, setRepeat] = useState<Repeat | "">(task.repeat ?? "");

  const canSave = title.trim() !== "" && dueDate !== "";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    updateTask(task.id, { title, dueDate, priority, repeat: repeat || undefined });
    onDone();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      onDone();
    }
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} aria-label="Edit task" className="flex flex-col gap-3">
      <input
        autoFocus
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Task title"
        maxLength={120}
        className={`w-full ${inputClass}`}
      />

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="date"
          required
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Due date"
          className={selectClass}
        />
        <label className="flex items-center gap-2 text-xs text-muted">
          Priority
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={selectClass}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABEL[p]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-muted">
          Repeat
          <select value={repeat} onChange={(e) => setRepeat(e.target.value as Repeat | "")} className={selectClass}>
            <option value="">Does not repeat</option>
            {REPEATS.map((r) => (
              <option key={r} value={r}>
                {REPEAT_LABEL[r]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onDone}
          className="rounded-full border border-edge/80 bg-surface/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!canSave}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </form>
  );
}

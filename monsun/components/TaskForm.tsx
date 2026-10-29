"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { useTasks } from "@/hooks/TasksContext";
import { toISODate } from "@/lib/date";
import { PRIORITIES, PRIORITY_LABEL, REPEATS, REPEAT_LABEL } from "@/lib/taskMeta";
import type { Priority, Repeat } from "@/lib/types";
import { inputClass, selectClass } from "./fieldStyles";

interface TaskFormProps {
  date?: string; // kalau diisi (mis. dari Calendar), tanggal dikunci dan input tanggal disembunyikan
  stacked?: boolean; // true = susun ke bawah, untuk wadah sempit seperti panel di Calendar
}

export default function TaskForm({ date, stacked = false }: TaskFormProps) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(""); // kosong = pakai hari ini saat submit
  const [priority, setPriority] = useState<Priority>("normal");
  const [repeat, setRepeat] = useState<Repeat | "">("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title, dueDate: date ?? (dueDate || toISODate()), priority, repeat: repeat || undefined });
    // Judul, prioritas, dan pengulangan dikosongkan lagi supaya tidak "terbawa" ke tugas berikutnya.
    setTitle("");
    setPriority("normal");
    setRepeat("");
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-3 ${stacked ? "" : "sm:flex-row sm:flex-wrap"}`}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to get done?"
        aria-label="Task title"
        maxLength={120}
        className={`${stacked ? "w-full" : "min-w-[12rem] flex-1"} ${inputClass}`}
      />
      {date === undefined && (
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Due date"
          className={`${stacked ? "w-full" : ""} ${inputClass}`}
        />
      )}
      <button
        type="submit"
        disabled={!title.trim()}
        className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50 ${
          stacked ? "w-full" : ""
        }`}
      >
        <Plus size={16} />
        Add Task
      </button>

      {/* Opsi tambahan di baris sendiri (w-full memaksanya turun baris di mode menyamping) */}
      <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2">
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
    </form>
  );
}

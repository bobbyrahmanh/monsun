"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { useTasks } from "@/hooks/TasksContext";
import { toISODate } from "@/lib/date";

const inputStyle =
  "rounded-full border border-edge/80 bg-surface/70 px-5 py-3 text-sm placeholder:text-muted focus:bg-surface";

interface TaskFormProps {
  date?: string; // kalau diisi (mis. dari Calendar), tanggal dikunci dan input tanggal disembunyikan
  stacked?: boolean; // true = susun ke bawah, untuk wadah sempit seperti panel di Calendar
}

export default function TaskForm({ date, stacked = false }: TaskFormProps) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(""); // kosong = pakai hari ini saat submit

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title, date ?? (dueDate || toISODate()));
    setTitle("");
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
        className={`${stacked ? "w-full" : "min-w-[12rem] flex-1"} ${inputStyle}`}
      />
      {date === undefined && (
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          aria-label="Due date"
          className={`${stacked ? "w-full" : ""} ${inputStyle}`}
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
    </form>
  );
}

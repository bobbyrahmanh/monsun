"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { useTasks } from "@/hooks/TasksContext";
import { toISODate } from "@/lib/date";

const inputStyle =
  "rounded-full border border-edge/80 bg-surface/70 px-5 py-3 text-sm placeholder:text-muted focus:bg-surface";

export default function TaskForm() {
  const { addTask } = useTasks();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(""); // kosong = pakai hari ini saat submit

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title, dueDate || toISODate());
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to get done?"
        aria-label="Task title"
        maxLength={120}
        className={`min-w-0 flex-1 ${inputStyle}`}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        aria-label="Due date"
        className={inputStyle}
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={16} />
        Add Task
      </button>
    </form>
  );
}

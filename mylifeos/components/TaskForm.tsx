"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { useTasks } from "@/hooks/TasksContext";
import { toISODate } from "@/lib/date";

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
        className="min-w-0 flex-1 rounded-full border border-line bg-canvas px-5 py-3 text-sm placeholder:text-muted focus:border-brand focus:bg-white"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        aria-label="Due date"
        className="rounded-full border border-line bg-canvas px-5 py-3 text-sm text-ink focus:border-brand focus:bg-white"
      />
      <button
        type="submit"
        disabled={!title.trim()}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus size={16} />
        Add task
      </button>
    </form>
  );
}

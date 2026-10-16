"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { useTasks } from "@/hooks/TasksContext";

type Filter = "all" | "pending" | "completed";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

export default function TasksPage() {
  const { tasks, ready } = useTasks();
  const [filter, setFilter] = useState<Filter>("all");

  // Pending di atas, lalu urut berdasarkan tanggal jatuh tempo.
  const visible = useMemo(() => {
    return tasks
      .filter((t) => filter === "all" || t.status === filter)
      .sort((a, b) =>
        a.status === b.status ? a.dueDate.localeCompare(b.dueDate) : a.status === "pending" ? -1 : 1,
      );
  }, [tasks, filter]);

  const emptyText =
    filter === "completed" ? "No completed tasks yet." : filter === "pending" ? "All caught up!" : "No tasks yet. Add your first one above.";

  return (
    <>
      <PageHeader title="Tasks" subtitle={`${tasks.length} in total`} />

      <section className="glass p-5 sm:p-6">
        <TaskForm />
      </section>

      <section className="mt-4 glass p-5 sm:p-6">
        <div className="mb-5 flex gap-2" role="tablist" aria-label="Filter tasks">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === value ? "bg-ink text-on-ink" : "bg-surface/60 text-muted hover:bg-surface hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {ready && <TaskList tasks={visible} empty={emptyText} />}
      </section>
    </>
  );
}

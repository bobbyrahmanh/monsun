"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { inputClass, selectClass } from "@/components/fieldStyles";
import { useTasks } from "@/hooks/TasksContext";
import { filterTasks, sortTasks, type PriorityFilter, type StatusFilter } from "@/lib/taskFilter";
import { PRIORITIES, PRIORITY_LABEL } from "@/lib/taskMeta";

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

export default function TasksPage() {
  const { tasks, ready } = useTasks();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<PriorityFilter>("all");

  const visible = useMemo(
    () => sortTasks(filterTasks(tasks, { status, query, priority })),
    [tasks, status, query, priority],
  );

  const searching = query.trim() !== "" || priority !== "all";
  const filtering = searching || status !== "all";

  function clearFilters() {
    setStatus("all");
    setQuery("");
    setPriority("all");
  }

  const empty =
    tasks.length === 0 ? (
      "No tasks yet. Add your first one above."
    ) : searching ? (
      <>
        No tasks match your filters.{" "}
        <button type="button" onClick={clearFilters} className="font-medium text-brand-dark underline underline-offset-2">
          Clear filters
        </button>
      </>
    ) : status === "completed" ? (
      "No completed tasks yet."
    ) : (
      "All caught up!"
    );

  return (
    <>
      <PageHeader title="Tasks" subtitle={`${tasks.length} in total`} />

      <section className="glass p-5 sm:p-6">
        <TaskForm />
      </section>

      <section className="mt-4 glass p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3">
          <div className="flex gap-2" role="tablist" aria-label="Filter by status">
            {STATUS_TABS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={status === value}
                onClick={() => setStatus(value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  status === value ? "bg-ink text-on-ink" : "bg-surface/60 text-muted hover:bg-surface hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[12rem] flex-1">
              <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                role="searchbox"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks"
                aria-label="Search tasks"
                className={`${inputClass} w-full !py-2.5 pl-11 pr-10`}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted transition-colors hover:bg-canvas hover:text-ink"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <label className="flex items-center gap-2 text-xs text-muted">
              Priority
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityFilter)}
                className={selectClass}
              >
                <option value="all">All priorities</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABEL[p]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {ready && filtering && (
          <p className="mb-3 text-xs text-muted" aria-live="polite">
            Showing {visible.length} of {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </p>
        )}

        {ready && <TaskList tasks={visible} empty={empty} />}
      </section>
    </>
  );
}

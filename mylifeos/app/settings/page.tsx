"use client";

import { RotateCcw, Settings } from "lucide-react";
import PlaceholderPage from "@/components/PlaceholderPage";
import { useTasks } from "@/hooks/TasksContext";

export default function SettingsPage() {
  const { resetTasks } = useTasks();

  function handleReset() {
    if (window.confirm("Replace all your tasks with the sample tasks?")) resetTasks();
  }

  return (
    <PlaceholderPage
      title="Settings"
      icon={Settings}
      description="Profile and preferences will live here."
    >
      <section className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6">
        <div>
          <h2 className="font-semibold">Reset data</h2>
          <p className="text-sm text-muted">Go back to the sample tasks. This replaces your current tasks.</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium transition-colors hover:bg-canvas"
        >
          <RotateCcw size={16} />
          Reset tasks
        </button>
      </section>
    </PlaceholderPage>
  );
}

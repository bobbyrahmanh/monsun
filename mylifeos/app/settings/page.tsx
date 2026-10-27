"use client";

import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { CalendarCog, Database, Download, RotateCcw, Trash2, Upload, UserRound } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SettingsSection from "@/components/SettingsSection";
import { useSettings } from "@/hooks/SettingsContext";
import { useTasks } from "@/hooks/TasksContext";
import { toISODate } from "@/lib/date";
import type { WeekStart } from "@/lib/settings";
import { parseTasks, serializeTasks } from "@/lib/taskIO";

const WEEK_OPTIONS: { value: WeekStart; label: string }[] = [
  { value: 1, label: "Monday" },
  { value: 0, label: "Sunday" },
];

const secondaryButton =
  "inline-flex items-center gap-2 rounded-full border border-edge/80 bg-surface/70 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface";

function Row({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-edge/60 py-4 first:border-t-0 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted">{description}</p>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { tasks, replaceTasks, resetTasks } = useTasks();
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function handleExport() {
    const blob = new Blob([serializeTasks(tasks)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mylifeos-tasks-${toISODate()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus({ type: "success", text: `Exported ${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}.` });
  }

  async function handleImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // supaya file yang sama bisa dipilih lagi
    if (!file) return;

    if (file.size > 2_000_000) {
      setStatus({ type: "error", text: "That file is too large (max 2 MB)." });
      return;
    }
    const result = parseTasks(await file.text());
    if (!result.ok) {
      setStatus({ type: "error", text: result.error });
      return;
    }
    if (!window.confirm(`Replace your ${tasks.length} current tasks with ${result.tasks.length} imported tasks?`)) return;

    replaceTasks(result.tasks);
    const skipped = result.skipped > 0 ? ` (${result.skipped} invalid skipped)` : "";
    setStatus({ type: "success", text: `Imported ${result.tasks.length} tasks${skipped}.` });
  }

  function handleReset() {
    if (!window.confirm("Replace all your tasks with the sample tasks?")) return;
    resetTasks();
    setStatus({ type: "success", text: "Sample tasks restored." });
  }

  function handleDeleteAll() {
    if (!window.confirm(`Delete all ${tasks.length} tasks? This can't be undone.`)) return;
    replaceTasks([]);
    setStatus({ type: "success", text: "All tasks deleted." });
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Make Monsun feel like yours" />

      <div className="flex max-w-3xl flex-col gap-4">
        <SettingsSection icon={UserRound} title="Profile" description="Used for the greeting on your dashboard.">
          <label htmlFor="display-name" className="mb-2 block text-sm font-medium">
            Your name
          </label>
          <input
            id="display-name"
            type="text"
            value={settings.name}
            onChange={(e) => updateSettings({ name: e.target.value })}
            placeholder="e.g. Vanessa"
            maxLength={30}
            autoComplete="given-name"
            className="w-full max-w-sm rounded-full border border-edge/80 bg-surface/70 px-5 py-3 text-sm placeholder:text-muted focus:bg-surface"
          />
        </SettingsSection>

        <SettingsSection icon={CalendarCog} title="Calendar" description="Applies to the calendar and your weekly streak.">
          <p id="week-start-label" className="mb-2 text-sm font-medium">
            Week starts on
          </p>
          <div role="radiogroup" aria-labelledby="week-start-label" className="flex gap-2">
            {WEEK_OPTIONS.map(({ value, label }) => {
              const active = settings.weekStart === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => updateSettings({ weekStart: value })}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-ink text-on-ink" : "bg-surface/60 text-muted hover:bg-surface hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </SettingsSection>

        <SettingsSection icon={Database} title="Your data" description="Everything is stored in this browser only.">
          <Row title="Export tasks" description="Download a JSON backup of all your tasks.">
            <button type="button" onClick={handleExport} className={secondaryButton}>
              <Download size={16} /> Export
            </button>
          </Row>
          <Row title="Import tasks" description="Restore from a Monsun backup. Replaces your current tasks.">
            <button type="button" onClick={() => fileInput.current?.click()} className={secondaryButton}>
              <Upload size={16} /> Import
            </button>
            <input ref={fileInput} type="file" accept="application/json,.json" onChange={handleImport} className="hidden" />
          </Row>
          <Row title="Reset to sample tasks" description="Go back to the starter tasks. Replaces your current tasks.">
            <button type="button" onClick={handleReset} className={secondaryButton}>
              <RotateCcw size={16} /> Reset
            </button>
          </Row>
          <Row title="Delete all tasks" description="Remove every task and start with a clean slate.">
            <button
              type="button"
              onClick={handleDeleteAll}
              className="inline-flex items-center gap-2 rounded-full border border-danger/40 px-5 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
            >
              <Trash2 size={16} /> Delete all
            </button>
          </Row>

          <p
            role="status"
            aria-live="polite"
            className={`mt-4 min-h-[1.25rem] text-sm font-medium ${status?.type === "error" ? "text-danger" : "text-brand-dark"}`}
          >
            {status?.text}
          </p>
        </SettingsSection>
      </div>
    </>
  );
}

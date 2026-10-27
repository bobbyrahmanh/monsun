"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CalendarGrid from "@/components/CalendarGrid";
import PageHeader from "@/components/PageHeader";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { useSettings } from "@/hooks/SettingsContext";
import { useTasks } from "@/hooks/TasksContext";
import { useNow } from "@/hooks/useNow";
import { formatMonthTitle } from "@/lib/calendar";
import { formatLongDate, fromISODate, toISODate } from "@/lib/date";
import type { Task } from "@/lib/types";

const roundButton =
  "flex h-9 items-center justify-center rounded-full border border-edge/80 bg-surface/70 text-sm font-medium transition-colors hover:bg-surface";

export default function CalendarPage() {
  const { tasks, ready } = useTasks();
  const { settings } = useSettings();
  const now = useNow();

  // null = "ikuti hari ini". Dengan begitu tidak perlu useEffect untuk nilai awal.
  const [cursor, setCursor] = useState<{ year: number; month: number } | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const todayISO = now ? toISODate(now) : null;
  const view = cursor ?? (now ? { year: now.getFullYear(), month: now.getMonth() } : null);
  const selectedISO = selected ?? todayISO;

  // Kelompokkan tugas per tanggal; pending di atas, selesai di bawah.
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      const list = map.get(task.dueDate);
      if (list) list.push(task);
      else map.set(task.dueDate, [task]);
    }
    for (const list of map.values()) {
      list.sort((a, b) => (a.status === b.status ? 0 : a.status === "pending" ? -1 : 1));
    }
    return map;
  }, [tasks]);

  function shiftMonth(delta: number) {
    if (!view) return;
    const d = new Date(view.year, view.month + delta, 1);
    setCursor({ year: d.getFullYear(), month: d.getMonth() });
  }

  function goToToday() {
    setCursor(null);
    setSelected(null);
  }

  // Klik tanggal dari bulan lain -> sekalian pindah ke bulan itu.
  function selectDay(iso: string) {
    setSelected(iso);
    const d = fromISODate(iso);
    if (!view || d.getFullYear() !== view.year || d.getMonth() !== view.month) {
      setCursor({ year: d.getFullYear(), month: d.getMonth() });
    }
  }

  const dayTasks = selectedISO ? (tasksByDate.get(selectedISO) ?? []) : [];
  const dayDone = dayTasks.filter((t) => t.status === "completed").length;

  return (
    <>
      <PageHeader title="Calendar" subtitle="See what's due and plan ahead" />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="glass p-4 sm:p-6" aria-label="Month view">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold" aria-live="polite">
              {view ? formatMonthTitle(view.year, view.month) : "\u00A0"}
            </h2>
            <div className="flex items-center gap-2">
              <button type="button" onClick={goToToday} className={`${roundButton} px-4`}>
                Today
              </button>
              <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month" className={`${roundButton} w-9`}>
                <ChevronLeft size={18} />
              </button>
              <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month" className={`${roundButton} w-9`}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {view && ready && (
            <CalendarGrid
              year={view.year}
              month={view.month}
              weekStart={settings.weekStart}
              todayISO={todayISO}
              selectedISO={selectedISO}
              tasksByDate={tasksByDate}
              onSelect={selectDay}
            />
          )}
        </section>

        <section className="glass p-5 sm:p-6" aria-label="Selected day">
          {selectedISO && ready && (
            <>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                {selectedISO === todayISO ? "Today" : "Selected day"}
              </p>
              <h2 className="mt-1 text-lg font-semibold">{formatLongDate(fromISODate(selectedISO))}</h2>
              <p className="mb-4 text-sm text-muted">
                {dayTasks.length ? `${dayDone} of ${dayTasks.length} done` : "Nothing planned yet"}
              </p>

              <div className="mb-4">
                <TaskForm date={selectedISO} stacked />
              </div>
              <TaskList tasks={dayTasks} empty="No tasks on this day. Add one above." />
            </>
          )}
        </section>
      </div>
    </>
  );
}

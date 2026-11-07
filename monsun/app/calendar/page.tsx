"use client";

import { useMemo, useState } from "react";
import CalendarGrid from "@/components/CalendarGrid";
import CalendarToolbar from "@/components/CalendarToolbar";
import PageHeader from "@/components/PageHeader";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import WeekView from "@/components/WeekView";
import { useSettings } from "@/hooks/SettingsContext";
import { useTasks } from "@/hooks/TasksContext";
import { useNow } from "@/hooks/useNow";
import { formatMonthTitle, formatWeekTitle, startOfWeek } from "@/lib/calendar";
import { formatLongDate, fromISODate, shiftISO, toISODate } from "@/lib/date";
import type { CalendarView } from "@/lib/settings";
import { compareTasks } from "@/lib/taskFilter";
import type { Task } from "@/lib/types";

export default function CalendarPage() {
  const { tasks, ready } = useTasks();
  const { settings, updateSettings } = useSettings();
  const now = useNow();
  const view = settings.calendarView; // "month" atau "week", tersimpan di Settings

  // anchor = tanggal yang menjadi "pusat" tampilan (bulan/minggu yang memuatnya).
  // null = ikuti hari ini. Dengan begitu tidak perlu useEffect untuk nilai awal.
  const [anchor, setAnchor] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  // Jam awal untuk form di panel, diisi saat sel jam di tampilan minggu diklik.
  // nonce berubah setiap klik, supaya form dibuat ulang (dan terisi lagi) walau jamnya sama.
  const [prefill, setPrefill] = useState<{ time: string; nonce: number } | null>(null);

  const todayISO = now ? toISODate(now) : null;
  const anchorISO = anchor ?? todayISO;
  const selectedISO = selected ?? todayISO;
  const anchorDate = anchorISO ? fromISODate(anchorISO) : null;
  const weekStartISO = anchorISO ? startOfWeek(anchorISO, settings.weekStart) : null;

  // Kelompokkan tugas per tanggal; urutan: pending dulu, lalu jam, lalu prioritas.
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      const list = map.get(task.dueDate);
      if (list) list.push(task);
      else map.set(task.dueDate, [task]);
    }
    for (const list of map.values()) list.sort(compareTasks);
    return map;
  }, [tasks]);

  function step(direction: 1 | -1) {
    if (!anchorISO || !anchorDate) return;
    if (view === "month") {
      setAnchor(toISODate(new Date(anchorDate.getFullYear(), anchorDate.getMonth() + direction, 1)));
    } else {
      setAnchor(shiftISO(anchorISO, 7 * direction));
    }
  }

  function goToToday() {
    setAnchor(null);
    setSelected(null);
  }

  // Pindah tampilan: pusatkan pada hari yang dipilih (kalau ada), seperti Google Calendar.
  function changeView(next: CalendarView) {
    updateSettings({ calendarView: next });
    if (selected) setAnchor(selected);
  }

  // Klik tanggal di luar bulan/minggu yang tampil -> sekalian pindah ke sana.
  function selectDay(iso: string) {
    setSelected(iso);
    if (!anchorISO || !anchorDate) return;
    const d = fromISODate(iso);
    const outside =
      view === "month"
        ? d.getFullYear() !== anchorDate.getFullYear() || d.getMonth() !== anchorDate.getMonth()
        : startOfWeek(iso, settings.weekStart) !== weekStartISO;
    if (outside) setAnchor(iso);
  }

  function handleSlotClick(iso: string, hour: number) {
    selectDay(iso);
    setPrefill((prev) => ({ time: `${String(hour).padStart(2, "0")}:00`, nonce: (prev?.nonce ?? 0) + 1 }));
  }

  const title =
    !anchorDate || !weekStartISO
      ? "\u00A0"
      : view === "month"
        ? formatMonthTitle(anchorDate.getFullYear(), anchorDate.getMonth())
        : formatWeekTitle(weekStartISO);

  const dayTasks = selectedISO ? (tasksByDate.get(selectedISO) ?? []) : [];
  const dayDone = dayTasks.filter((t) => t.status === "completed").length;

  return (
    <>
      <PageHeader title="Calendar" subtitle="See what's due and plan ahead" />

      {/* Tampilan minggu butuh lebar: panel hari baru pindah ke samping di layar sangat lebar */}
      <div
        className={`grid gap-4 ${
          view === "week" ? "2xl:grid-cols-[minmax(0,1fr)_24rem]" : "xl:grid-cols-[minmax(0,1fr)_24rem]"
        }`}
      >
        <section className="glass p-4 sm:p-6" aria-label={view === "week" ? "Week view" : "Month view"}>
          <CalendarToolbar
            title={title}
            view={view}
            onViewChange={changeView}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
            onToday={goToToday}
          />

          {anchorDate && weekStartISO && ready && (
            view === "month" ? (
              <CalendarGrid
                year={anchorDate.getFullYear()}
                month={anchorDate.getMonth()}
                weekStart={settings.weekStart}
                hour12={settings.hour12}
                todayISO={todayISO}
                selectedISO={selectedISO}
                tasksByDate={tasksByDate}
                onSelect={selectDay}
              />
            ) : (
              <WeekView
                weekStartISO={weekStartISO}
                hour12={settings.hour12}
                todayISO={todayISO}
                selectedISO={selectedISO}
                tasksByDate={tasksByDate}
                onSelectDay={selectDay}
                onSlotClick={handleSlotClick}
              />
            )
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
                <TaskForm key={prefill?.nonce ?? 0} date={selectedISO} defaultTime={prefill?.time} stacked />
              </div>
              <TaskList tasks={dayTasks} empty="No tasks on this day. Add one above." />
            </>
          )}
        </section>
      </div>
    </>
  );
}

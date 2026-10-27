"use client";

import { useMemo } from "react";
import { buildMonthGrid, getWeekdays } from "@/lib/calendar";
import { formatLongDate, fromISODate } from "@/lib/date";
import type { WeekStart } from "@/lib/settings";
import type { Task } from "@/lib/types";

interface CalendarGridProps {
  year: number;
  month: number; // 0-11
  weekStart: WeekStart;
  todayISO: string | null;
  selectedISO: string | null;
  tasksByDate: Map<string, Task[]>; // sudah terurut: pending dulu
  onSelect: (iso: string) => void;
}

type Tone = "done" | "overdue" | "pending";

function toneOf(task: Task, todayISO: string | null): Tone {
  if (task.status === "completed") return "done";
  return todayISO && task.dueDate < todayISO ? "overdue" : "pending";
}

const DOT: Record<Tone, string> = {
  done: "bg-brand",
  overdue: "bg-red-600",
  pending: "bg-accent ring-1 ring-ink/25",
};

const CHIP: Record<Tone, string> = {
  done: "bg-brand-soft text-brand-dark line-through",
  overdue: "bg-red-600 text-white",
  pending: "bg-accent text-ink",
};

function summarize(tasks: Task[]): string {
  if (tasks.length === 0) return "no tasks";
  const done = tasks.filter((t) => t.status === "completed").length;
  return `${tasks.length - done} pending, ${done} done`;
}

export default function CalendarGrid({
  year,
  month,
  weekStart,
  todayISO,
  selectedISO,
  tasksByDate,
  onSelect,
}: CalendarGridProps) {
  const cells = useMemo(() => buildMonthGrid(year, month, weekStart), [year, month, weekStart]);
  const weekdays = getWeekdays(weekStart);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 pb-2 text-center text-xs font-medium text-muted sm:gap-1.5" aria-hidden>
        {weekdays.map((d) => (
          <div key={d.full}>{d.short}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {cells.map((cell) => {
          const dayTasks = tasksByDate.get(cell.iso) ?? [];
          const isToday = cell.iso === todayISO;
          const isSelected = cell.iso === selectedISO;
          const chips = dayTasks.slice(0, 2);
          const extra = dayTasks.length - chips.length;

          return (
            <button
              key={cell.iso}
              type="button"
              onClick={() => onSelect(cell.iso)}
              aria-pressed={isSelected}
              aria-current={isToday ? "date" : undefined}
              aria-label={`${formatLongDate(fromISODate(cell.iso))}, ${summarize(dayTasks)}`}
              className={`flex h-[4.25rem] flex-col items-start gap-1 overflow-hidden rounded-2xl border p-1.5 text-left transition-colors sm:h-[6.75rem] sm:p-2 ${
                isSelected ? "border-ink/60 bg-surface/90" : "border-edge/60 bg-surface/50 hover:bg-surface/80"
              } ${cell.inMonth ? "" : "opacity-45"}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                  isToday ? "bg-accent text-ink" : ""
                }`}
              >
                {cell.day}
              </span>

              {/* HP: titik kecil per tugas */}
              <span className="flex gap-1 sm:hidden" aria-hidden>
                {dayTasks.slice(0, 3).map((t) => (
                  <span key={t.id} className={`h-1.5 w-1.5 rounded-full ${DOT[toneOf(t, todayISO)]}`} />
                ))}
              </span>

              {/* Layar lebar: judul tugas (maks. 2) */}
              <span className="hidden w-full flex-col gap-1 sm:flex" aria-hidden>
                {chips.map((t) => (
                  <span
                    key={t.id}
                    className={`truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-tight ${CHIP[toneOf(t, todayISO)]}`}
                  >
                    {t.title}
                  </span>
                ))}
                {extra > 0 && <span className="px-1 text-[11px] font-medium text-muted">+{extra} more</span>}
              </span>
            </button>
          );
        })}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted" aria-label="Legend">
        <li className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${DOT.pending}`} /> Pending</li>
        <li className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${DOT.done}`} /> Done</li>
        <li className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${DOT.overdue}`} /> Overdue</li>
      </ul>
    </div>
  );
}

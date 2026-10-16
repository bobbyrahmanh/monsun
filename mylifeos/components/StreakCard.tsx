"use client";

import { CalendarCheck, Flame, Trophy } from "lucide-react";
import { useTasks } from "@/hooks/TasksContext";
import { useNow } from "@/hooks/useNow";
import { shiftISO, toISODate } from "@/lib/date";
import { getStreaks } from "@/lib/streaks";

const DAYS = [
  { short: "M", full: "Monday" },
  { short: "T", full: "Tuesday" },
  { short: "W", full: "Wednesday" },
  { short: "T", full: "Thursday" },
  { short: "F", full: "Friday" },
  { short: "S", full: "Saturday" },
  { short: "S", full: "Sunday" },
];

const plural = (n: number) => `${n} ${n === 1 ? "day" : "days"}`;

export default function StreakCard() {
  const { tasks, ready } = useTasks();
  const now = useNow();
  const loaded = ready && now !== null;

  const today = loaded ? toISODate(now) : null;
  const { current, best, doneDates } = today
    ? getStreaks(tasks, today)
    : { current: 0, best: 0, doneDates: new Set<string>() };

  // Minggu ini, mulai hari Senin.
  const mondayOffset = now ? (now.getDay() + 6) % 7 : 0;
  const weekStart = today ? shiftISO(today, -mondayOffset) : null;
  const week = DAYS.map((day, i) => {
    const iso = weekStart ? shiftISO(weekStart, i) : null;
    return {
      ...day,
      done: iso ? doneDates.has(iso) : false,
      isToday: iso === today,
      isFuture: iso && today ? iso > today : false,
    };
  });
  const weekDone = week.filter((d) => d.done).length;

  const doneToday = today ? doneDates.has(today) : false;
  const message = doneToday
    ? "Today counts! Come back tomorrow to keep it going."
    : current > 0
      ? "Finish one task today to keep your streak alive."
      : "Finish one task to start a new streak.";

  return (
    <section className="glass p-5 sm:p-6" aria-label="Streak">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-ink">
          <Flame size={18} />
        </span>
        <h2 className="text-lg font-semibold">Streak</h2>
      </div>

      <p className="mt-5 flex items-baseline gap-2">
        <span className="text-5xl font-semibold tracking-tight">{loaded ? current : "–"}</span>
        <span className="text-sm text-muted">{current === 1 ? "day" : "days"} in a row</span>
      </p>
      <p className="mt-1 min-h-[2.5rem] text-sm text-muted">{loaded ? message : ""}</p>

      <ol className="mt-4 grid grid-cols-7 gap-1.5" aria-label="This week">
        {week.map((d, i) => (
          <li key={i} className="flex flex-col items-center gap-1.5">
            <span
              title={`${d.full}${d.done ? ": done" : ""}`}
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                d.done
                  ? "bg-accent text-ink"
                  : d.isToday
                    ? "bg-surface/70 text-muted ring-2 ring-ink/70"
                    : d.isFuture
                      ? "bg-surface/30 text-muted/30"
                      : "bg-surface/60 text-muted/60"
              }`}
            >
              <Flame size={16} fill={d.done ? "currentColor" : "none"} />
              <span className="sr-only">{`${d.full}${d.done ? ", done" : ""}`}</span>
            </span>
            <span className={`text-xs ${d.isToday ? "font-semibold text-ink" : "text-muted"}`} aria-hidden>
              {d.short}
            </span>
          </li>
        ))}
      </ol>

      <dl className="mt-5 space-y-3 border-t border-edge/70 pt-4 text-sm">
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-muted">
            <Trophy size={16} /> Best streak
          </dt>
          <dd className="font-semibold">{plural(best)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 text-muted">
            <CalendarCheck size={16} /> Active this week
          </dt>
          <dd className="font-semibold">{weekDone} / 7</dd>
        </div>
      </dl>
    </section>
  );
}

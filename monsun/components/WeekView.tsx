"use client";

import { useEffect, useMemo, useRef } from "react";
import { useMinuteNow } from "@/hooks/useMinuteNow";
import { getWeekDays } from "@/lib/calendar";
import { formatHourLabel, formatTimeOfDay } from "@/lib/clock";
import { formatLongDate, fromISODate } from "@/lib/date";
import type { Task } from "@/lib/types";
import { BLOCK_MINUTES, MINUTES_PER_DAY, layoutDay, toMinutes } from "@/lib/weekLayout";
import { CHIP, toneOf } from "./taskTone";

export const HOUR_HEIGHT = 56; // tinggi satu jam, dalam piksel
const HOURS = Array.from({ length: 24 }, (_, h) => h);
const COLUMNS = "grid-cols-[3.5rem_repeat(7,minmax(0,1fr))]"; // kolom jam + 7 hari
const pad = (n: number) => String(n).padStart(2, "0");

interface WeekViewProps {
  weekStartISO: string; // hari pertama minggu yang ditampilkan
  hour12: boolean;
  todayISO: string | null;
  selectedISO: string | null;
  tasksByDate: Map<string, Task[]>;
  onSelectDay: (iso: string) => void;
  onSlotClick: (iso: string, hour: number) => void; // klik sel jam kosong -> buat tugas di jam itu
}

export default function WeekView({
  weekStartISO,
  hour12,
  todayISO,
  selectedISO,
  tasksByDate,
  onSelectDay,
  onSlotClick,
}: WeekViewProps) {
  const now = new Date(useMinuteNow() || Date.now()); // berdetak tiap menit: garis "sekarang" ikut bergeser
  const scroller = useRef<HTMLDivElement>(null);

  // Per hari: tugas berjam (ditata berdampingan kalau bertumpuk) dan tugas tanpa jam ("All day").
  const days = useMemo(
    () =>
      getWeekDays(weekStartISO).map((iso) => {
        const list = tasksByDate.get(iso) ?? [];
        const timed = list.filter((t) => t.dueTime);
        const allDay = list.filter((t) => !t.dueTime);
        const placed = new Map(
          layoutDay(timed.map((t) => ({ id: t.id, startMin: toMinutes(t.dueTime as string) }))).map((p) => [p.id, p]),
        );
        return { iso, timed, allDay, placed, count: list.length };
      }),
    [weekStartISO, tasksByDate],
  );

  // Hanya saat pertama tampil: gulir ke 2 jam sebelum sekarang (kalau hari ini ada di minggu ini),
  // atau ke jam 07:00. Sengaja tidak diulang saat pindah minggu, supaya posisi gulirmu tidak melompat.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const todayInWeek = days.some((d) => d.iso === todayISO);
    el.scrollTop = Math.max(0, todayInWeek ? now.getHours() - 2 : 7) * HOUR_HEIGHT;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nowTop = Math.round(((now.getHours() * 60 + now.getMinutes()) / 60) * HOUR_HEIGHT);

  return (
    <div
      ref={scroller}
      role="region"
      aria-label="Week schedule"
      tabIndex={0}
      className="max-h-[min(36rem,70vh)] overflow-auto rounded-2xl border border-edge/60 bg-surface/40"
    >
      <div className="min-w-[44rem]">
        {/* Header (hari + "All day") menempel di atas saat digulir */}
        <div className="sticky top-0 z-30 border-b border-edge/60 bg-surface/90 backdrop-blur-md">
          <div className={`grid ${COLUMNS}`}>
            <div />
            {days.map(({ iso, count }) => {
              const date = fromISODate(iso);
              const isToday = iso === todayISO;
              const isSelected = iso === selectedISO;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => onSelectDay(iso)}
                  aria-pressed={isSelected}
                  aria-current={isToday ? "date" : undefined}
                  aria-label={`${formatLongDate(date)}, ${count === 0 ? "no tasks" : `${count} ${count === 1 ? "task" : "tasks"}`}`}
                  className={`flex flex-col items-center gap-0.5 border-l border-line py-2 transition-colors ${
                    isSelected ? "bg-surface/80" : "hover:bg-surface/50"
                  }`}
                >
                  <span className="text-xs font-medium text-muted">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      isToday ? "bg-accent text-ink" : ""
                    }`}
                  >
                    {date.getDate()}
                  </span>
                </button>
              );
            })}
          </div>

          <div className={`grid ${COLUMNS} border-t border-line`}>
            <div className="px-2 py-2 text-right text-[11px] text-muted">All day</div>
            {days.map(({ iso, allDay }) => (
              <div key={iso} className="flex min-h-[2rem] flex-col gap-1 border-l border-line p-1">
                {allDay.slice(0, 3).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectDay(iso)}
                    title={t.title}
                    className={`truncate rounded-md px-1.5 py-0.5 text-left text-[11px] font-medium leading-tight ${CHIP[toneOf(t, now)]}`}
                  >
                    {t.title}
                  </button>
                ))}
                {allDay.length > 3 && (
                  <span className="px-1 text-[11px] font-medium text-muted">+{allDay.length - 3} more</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Badan: sumbu jam di kiri + 7 kolom hari */}
        <div className={`grid ${COLUMNS}`}>
          <div aria-hidden="true">
            {HOURS.map((h) => (
              <div key={h} style={{ height: HOUR_HEIGHT }}>
                <span className="relative -top-2 block pr-2 text-right text-[11px] text-muted">
                  {h === 0 ? "" : formatHourLabel(h, hour12)}
                </span>
              </div>
            ))}
          </div>

          {days.map((day) => (
            <div
              key={day.iso}
              className={`relative border-l border-line ${day.iso === todayISO ? "bg-accent-soft/40" : ""}`}
            >
              {/* Sel jam: jalan pintas dengan mouse. Pengguna keyboard memakai kolom Time di panel samping. */}
              {HOURS.map((h) => (
                <button
                  key={h}
                  type="button"
                  tabIndex={-1}
                  aria-hidden="true"
                  data-slot={`${day.iso} ${pad(h)}`}
                  onClick={() => onSlotClick(day.iso, h)}
                  className="block w-full border-t border-line transition-colors hover:bg-surface/50"
                  style={{ height: HOUR_HEIGHT }}
                />
              ))}

              {day.timed.map((t) => {
                const placed = day.placed.get(t.id);
                if (!placed) return null;
                const time = formatTimeOfDay(t.dueTime as string, hour12);
                // Tugas di 23:45 tetap utuh terlihat: bloknya diratakan ke dasar hari (jam aslinya tetap di label).
                const top = (Math.min(placed.startMin, MINUTES_PER_DAY - BLOCK_MINUTES) / 60) * HOUR_HEIGHT;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectDay(day.iso)}
                    title={`${time} ${t.title}`}
                    aria-label={`${t.title}, ${time}, ${formatLongDate(fromISODate(day.iso))}`}
                    className={`absolute z-10 overflow-hidden rounded-md px-1.5 text-left text-[11px] font-medium leading-tight ring-1 ring-surface/70 transition hover:brightness-95 ${CHIP[toneOf(t, now)]}`}
                    style={{
                      top,
                      height: (BLOCK_MINUTES / 60) * HOUR_HEIGHT - 2,
                      left: `calc(${(placed.lane / placed.lanes) * 100}% + 1px)`,
                      width: `calc(${100 / placed.lanes}% - 2px)`,
                    }}
                  >
                    <span className="block truncate pt-0.5">
                      <span className="font-semibold">{time}</span> {t.title}
                    </span>
                  </button>
                );
              })}

              {/* Garis merah "sekarang" di kolom hari ini */}
              {day.iso === todayISO && (
                <div
                  aria-hidden="true"
                  data-now-line="true"
                  className="pointer-events-none absolute inset-x-0 z-20 flex items-center"
                  style={{ top: nowTop - 1 }}
                >
                  <span className="-ml-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />
                  <span className="h-0.5 flex-1 bg-red-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

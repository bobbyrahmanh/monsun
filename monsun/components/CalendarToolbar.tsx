"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarView } from "@/lib/settings";

const VIEWS: { value: CalendarView; label: string }[] = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
];

const roundButton =
  "flex h-9 items-center justify-center rounded-full border border-edge/80 bg-surface/70 text-sm font-medium transition-colors hover:bg-surface";

interface CalendarToolbarProps {
  title: string; // "October 2026" atau "Oct 26 – Nov 1, 2026"
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function CalendarToolbar({ title, view, onViewChange, onPrev, onNext, onToday }: CalendarToolbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-semibold" aria-live="polite">
        {title}
      </h2>

      <div className="flex flex-wrap items-center gap-2">
        <div role="radiogroup" aria-label="Calendar view" className="flex rounded-full bg-canvas p-1">
          {VIEWS.map(({ value, label }) => {
            const active = view === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onViewChange(value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  active ? "bg-ink text-on-ink" : "text-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <button type="button" onClick={onToday} className={`${roundButton} px-4`}>
          Today
        </button>
        <button type="button" onClick={onPrev} aria-label={`Previous ${view}`} className={`${roundButton} w-9`}>
          <ChevronLeft size={18} />
        </button>
        <button type="button" onClick={onNext} aria-label={`Next ${view}`} className={`${roundButton} w-9`}>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

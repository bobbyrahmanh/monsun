"use client";

import { Clock as ClockIcon } from "lucide-react";
import { useSettings } from "@/hooks/SettingsContext";
import { useClock } from "@/hooks/useClock";
import { formatClock } from "@/lib/clock";
import { formatLongDate } from "@/lib/date";

// Jam di pojok kanan atas. Tampilannya (24/12 jam, dengan/tanpa detik) diatur di Settings.
export default function LiveClock() {
  const { settings } = useSettings();
  const now = useClock(settings.showSeconds);
  const parts = now ? formatClock(now, { hour12: settings.hour12, seconds: settings.showSeconds }) : null;

  return (
    <div
      className="flex h-10 items-center gap-2 rounded-full border border-edge/80 bg-surface/70 px-4 text-sm font-medium tabular-nums"
      title={now ? formatLongDate(now) : undefined}
    >
      <ClockIcon size={16} aria-hidden="true" className="text-muted" />
      <span className="sr-only">Current time:</span>
      {/* Placeholder selebar jam sungguhan, supaya tata letak tidak bergeser saat jam muncul */}
      <time dateTime={now ? now.toISOString() : undefined}>{parts ? parts.time : settings.showSeconds ? "--:--:--" : "--:--"}</time>
      {parts?.suffix && <span className="text-xs text-muted">{parts.suffix}</span>}
    </div>
  );
}

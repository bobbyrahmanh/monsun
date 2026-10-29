"use client";

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
      className="flex h-10 items-center text-2xl font-semibold tabular-nums tracking-tight"
      title={now ? formatLongDate(now) : undefined}
    >
      <span className="sr-only">Current time:</span>
      {/* Placeholder selebar jam sungguhan, supaya tata letak tidak bergeser saat jam muncul */}
      <time dateTime={now ? now.toISOString() : undefined}>{parts ? parts.time : settings.showSeconds ? "--:--:--" : "--:--"}</time>
      {/* AM/PM tidak ditampilkan, tapi tetap dibacakan pembaca layar supaya waktunya tidak ambigu */}
      {parts?.suffix && <span className="sr-only">{parts.suffix}</span>}
    </div>
  );
}

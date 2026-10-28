import { toISODate } from "./date";
import type { WeekStart } from "./settings";

export interface CalendarCell {
  iso: string; // YYYY-MM-DD
  day: number; // tanggal (1-31)
  inMonth: boolean; // false = tanggal bulan sebelum/sesudahnya (pengisi baris)
}

const WEEKDAYS = [
  { short: "Sun", full: "Sunday" },
  { short: "Mon", full: "Monday" },
  { short: "Tue", full: "Tuesday" },
  { short: "Wed", full: "Wednesday" },
  { short: "Thu", full: "Thursday" },
  { short: "Fri", full: "Friday" },
  { short: "Sat", full: "Saturday" },
];

// Nama hari, diurutkan mulai dari hari pertama pilihan pengguna.
export function getWeekdays(weekStart: WeekStart) {
  return [...WEEKDAYS.slice(weekStart), ...WEEKDAYS.slice(0, weekStart)];
}

// month: 0-11 (sama seperti Date). Hasilnya selalu kelipatan 7 sel (5 atau 6 baris penuh).
export function buildMonthGrid(year: number, month: number, weekStart: WeekStart): CalendarCell[] {
  const leading = (new Date(year, month, 1).getDay() - weekStart + 7) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const total = Math.ceil((leading + daysInMonth) / 7) * 7;

  return Array.from({ length: total }, (_, i) => {
    const d = new Date(year, month, 1 - leading + i);
    return { iso: toISODate(d), day: d.getDate(), inMonth: d.getMonth() === month };
  });
}

export function formatMonthTitle(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

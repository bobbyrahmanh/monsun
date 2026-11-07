import { fromISODate, shiftISO, toISODate } from "./date";
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

// Hari pertama minggu yang memuat tanggal `iso` (Senin atau Minggu, sesuai Settings).
export function startOfWeek(iso: string, weekStart: WeekStart): string {
  const offset = (fromISODate(iso).getDay() - weekStart + 7) % 7;
  return shiftISO(iso, -offset);
}

// 7 tanggal berurutan mulai dari `startISO`.
export function getWeekDays(startISO: string): string[] {
  return Array.from({ length: 7 }, (_, i) => shiftISO(startISO, i));
}

// "Oct 19 – 25, 2026" | "Oct 26 – Nov 1, 2026" | "Dec 28, 2026 – Jan 3, 2027"
export function formatWeekTitle(startISO: string): string {
  const start = fromISODate(startISO);
  const end = fromISODate(shiftISO(startISO, 6));
  const month = (d: Date) => d.toLocaleDateString("en-US", { month: "short" });
  if (start.getFullYear() !== end.getFullYear()) {
    return `${month(start)} ${start.getDate()}, ${start.getFullYear()} – ${month(end)} ${end.getDate()}, ${end.getFullYear()}`;
  }
  if (start.getMonth() !== end.getMonth()) {
    return `${month(start)} ${start.getDate()} – ${month(end)} ${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${month(start)} ${start.getDate()} – ${end.getDate()}, ${end.getFullYear()}`;
}

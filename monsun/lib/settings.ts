import { TIMER_DEFAULTS, normalizeMinutes } from "./timer";

export type WeekStart = 0 | 1; // 0 = Minggu, 1 = Senin (sama dengan Date.getDay())

export interface Settings {
  name: string;
  weekStart: WeekStart;
  focusMinutes: number; // lama sesi fokus
  shortBreakMinutes: number;
  longBreakMinutes: number;
}

// Nama field pengaturan untuk lama tiap mode timer.
export const DURATION_KEY = {
  focus: "focusMinutes",
  short: "shortBreakMinutes",
  long: "longBreakMinutes",
} as const;

export const SETTINGS_KEY = "mylifeos.settings";

export const DEFAULT_SETTINGS: Settings = {
  name: "",
  weekStart: 1,
  focusMinutes: TIMER_DEFAULTS.focus,
  shortBreakMinutes: TIMER_DEFAULTS.short,
  longBreakMinutes: TIMER_DEFAULTS.long,
};

// Data dari localStorage tidak boleh dipercaya begitu saja: validasi dan isi dengan nilai bawaan.
export function parseSettings(raw: unknown): Settings {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    name: typeof r.name === "string" ? r.name.slice(0, 30) : DEFAULT_SETTINGS.name,
    weekStart: r.weekStart === 0 ? 0 : 1,
    focusMinutes: normalizeMinutes("focus", r.focusMinutes),
    shortBreakMinutes: normalizeMinutes("short", r.shortBreakMinutes),
    longBreakMinutes: normalizeMinutes("long", r.longBreakMinutes),
  };
}

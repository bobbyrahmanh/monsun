// Logika murni untuk timer Pomodoro (tanpa React, jadi mudah diuji).

export type TimerMode = "focus" | "short" | "long";

export const TIMER_MODES: TimerMode[] = ["focus", "short", "long"];

export const TIMER_LABEL: Record<TimerMode, string> = {
  focus: "Focus",
  short: "Short break",
  long: "Long break",
};

// Lama bawaan (menit) dan batas yang boleh diatur pengguna.
export const TIMER_DEFAULTS: Record<TimerMode, number> = { focus: 25, short: 5, long: 15 };

export const TIMER_LIMITS: Record<TimerMode, { min: number; max: number; step: number }> = {
  focus: { min: 5, max: 120, step: 5 },
  short: { min: 1, max: 30, step: 1 },
  long: { min: 5, max: 60, step: 5 },
};

// Setelah sekian sesi fokus, istirahatnya yang panjang (aturan Pomodoro klasik).
export const SESSIONS_BEFORE_LONG_BREAK = 4;

// Menerima nilai apa saja (mis. dari localStorage), mengembalikan menit yang valid.
export function normalizeMinutes(mode: TimerMode, value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return TIMER_DEFAULTS[mode];
  const { min, max } = TIMER_LIMITS[mode];
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

// focusSessionsToday = jumlah sesi fokus hari ini, TERMASUK yang baru selesai.
export function nextMode(finished: TimerMode, focusSessionsToday: number): TimerMode {
  if (finished !== "focus") return "focus";
  return focusSessionsToday % SESSIONS_BEFORE_LONG_BREAK === 0 ? "long" : "short";
}

// Statistik harian: reset otomatis kalau tanggalnya sudah ganti.
export interface FocusStats {
  date: string; // YYYY-MM-DD
  sessions: number;
  minutes: number;
}

export function emptyStats(date: string): FocusStats {
  return { date, sessions: 0, minutes: 0 };
}

function toCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
}

export function parseStats(raw: unknown, todayISO: string): FocusStats {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  if (r.date !== todayISO) return emptyStats(todayISO);
  return { date: todayISO, sessions: toCount(r.sessions), minutes: toCount(r.minutes) };
}

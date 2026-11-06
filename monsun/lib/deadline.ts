import { toISODate } from "./date";
import type { Task } from "./types";

// Jam tenggat disimpan sebagai "HH:mm" (24 jam, selalu 2 digit), mis. "09:05", "23:59".
// Karena selalu 2 digit, membandingkannya sebagai teks sama dengan membandingkan waktunya.
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isValidTime(value: unknown): value is string {
  return typeof value === "string" && TIME_RE.test(value);
}

// Menerima nilai apa saja dari form/penyimpanan; hasilnya "HH:mm" yang valid atau undefined.
// Detik (kalau ada, mis. "09:00:30") dibuang.
export function normalizeTime(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const hhmm = value.slice(0, 5);
  return isValidTime(hhmm) ? hhmm : undefined;
}

const pad = (n: number) => String(n).padStart(2, "0");

// Terlambat atau belum? Aturannya:
// - sudah selesai: tidak pernah terlambat
// - tanggal sudah lewat: terlambat
// - tanggal hari ini + punya jam: terlambat SETELAH menit itu berlalu (09:00 baru terlambat pukul 09:01)
// - tanggal hari ini tanpa jam: berlaku sampai akhir hari, jadi belum terlambat
export function isOverdue(task: Pick<Task, "dueDate" | "dueTime" | "status">, now: Date): boolean {
  if (task.status === "completed") return false;
  const today = toISODate(now);
  if (task.dueDate < today) return true;
  if (task.dueDate > today || !task.dueTime) return false;
  return task.dueTime < `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

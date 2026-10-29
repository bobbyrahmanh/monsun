import { fromISODate, shiftISO, toISODate } from "./date";
import type { Repeat } from "./types";

// Selisih hari kalender antara dua tanggal ISO (aman dari pergeseran jam musim panas).
function daysBetween(fromISO: string, toISO: string): number {
  const a = fromISODate(fromISO);
  const b = fromISODate(toISO);
  return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 86_400_000);
}

// Tambah n bulan; tanggal dipotong ke akhir bulan (31 Jan + 1 bulan = 28/29 Feb).
function addMonths(iso: string, months: number): string {
  const d = fromISODate(iso);
  const day = d.getDate();
  const target = new Date(d.getFullYear(), d.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(day, lastDay));
  return toISODate(target);
}

// Kemunculan ke-k dihitung dari tanggal ASLI (bukan dari hasil sebelumnya),
// supaya "tiap tanggal 31" tidak bergeser jadi tanggal 28 selamanya setelah melewati Februari.
function occurrence(due: string, repeat: Repeat, k: number): string {
  if (repeat === "daily") return shiftISO(due, k);
  if (repeat === "weekly") return shiftISO(due, 7 * k);
  return addMonths(due, k);
}

// Tanggal tugas berikutnya setelah tugas berulang diselesaikan.
// Hasilnya selalu SETELAH hari ini, jadi menyelesaikan tugas harian yang telat 5 hari
// tidak menumpuk 5 tugas telat baru: kemunculan yang terlewat dilewati.
export function nextDueDate(due: string, repeat: Repeat, todayISO: string): string {
  if (repeat !== "monthly") {
    const step = repeat === "daily" ? 1 : 7;
    const k = Math.max(1, Math.floor(daysBetween(due, todayISO) / step) + 1);
    return occurrence(due, repeat, k);
  }
  let k = 1;
  let next = occurrence(due, repeat, k);
  while (next <= todayISO && k < 1200) {
    k++;
    next = occurrence(due, repeat, k);
  }
  return next;
}

import { shiftISO } from "./date";
import type { Task } from "./types";

export interface Streaks {
  current: number;
  best: number;
  doneDates: Set<string>; // hari-hari yang punya minimal 1 tugas selesai
}

// Tugas lama (sebelum fitur streak) belum punya completedAt, jadi pakai dueDate sebagai perkiraan.
function getDoneDates(tasks: Task[]): Set<string> {
  const dates = new Set<string>();
  for (const t of tasks) {
    if (t.status === "completed") dates.add(t.completedAt ?? t.dueDate);
  }
  return dates;
}

export function getStreaks(tasks: Task[], todayISO: string): Streaks {
  const doneDates = getDoneDates(tasks);

  // Streak aktif: hitung mundur dari hari ini. Kalau hari ini belum ada yang selesai,
  // mulai dari kemarin: streak belum putus sampai harinya benar-benar lewat.
  let cursor = doneDates.has(todayISO) ? todayISO : shiftISO(todayISO, -1);
  let current = 0;
  while (doneDates.has(cursor)) {
    current++;
    cursor = shiftISO(cursor, -1);
  }

  // Rekor terbaik: deret hari berurutan terpanjang.
  const sorted = [...doneDates].sort();
  let best = 0;
  let run = 0;
  sorted.forEach((date, i) => {
    run = i > 0 && shiftISO(sorted[i - 1], 1) === date ? run + 1 : 1;
    best = Math.max(best, run);
  });

  return { current, best, doneDates };
}

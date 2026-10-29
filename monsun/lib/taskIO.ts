import { fromISODate, toISODate } from "./date";
import { isPriority, isRepeat } from "./taskMeta";
import type { Task } from "./types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// "2026-02-31" lolos regex tapi bukan tanggal asli, jadi cek bolak-balik.
function isRealDate(value: unknown): value is string {
  return typeof value === "string" && DATE_RE.test(value) && toISODate(fromISODate(value)) === value;
}

export function serializeTasks(tasks: Task[]): string {
  return JSON.stringify({ app: "MyLifeOS", version: 1, exportedAt: new Date().toISOString(), tasks }, null, 2);
}

function toTask(item: unknown): Task | null {
  if (!item || typeof item !== "object") return null;
  const r = item as Record<string, unknown>;
  if (typeof r.id !== "string" || !r.id) return null;
  if (typeof r.title !== "string" || !r.title.trim()) return null;
  if (!isRealDate(r.dueDate)) return null;
  if (r.status !== "pending" && r.status !== "completed") return null;

  const task: Task = { id: r.id, title: r.title.trim().slice(0, 120), dueDate: r.dueDate, status: r.status };
  if (r.status === "completed" && isRealDate(r.completedAt)) task.completedAt = r.completedAt;
  if (isPriority(r.priority) && r.priority !== "normal") task.priority = r.priority;
  if (isRepeat(r.repeat)) task.repeat = r.repeat;
  if (typeof r.spawnedId === "string" && r.spawnedId) task.spawnedId = r.spawnedId;
  return task;
}

export type ParseResult = { ok: true; tasks: Task[]; skipped: number } | { ok: false; error: string };

// Menerima hasil ekspor MyLifeOS ({ tasks: [...] }) atau langsung berupa array tugas.
export function parseTasks(text: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file isn't valid JSON." };
  }

  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray((data as { tasks?: unknown }).tasks)
      ? (data as { tasks: unknown[] }).tasks
      : null;
  if (!list) return { ok: false, error: "That doesn't look like a MyLifeOS export." };

  const tasks: Task[] = [];
  const seen = new Set<string>();
  let skipped = 0;
  for (const item of list) {
    const task = toTask(item);
    if (!task || seen.has(task.id)) {
      skipped++;
      continue;
    }
    seen.add(task.id);
    tasks.push(task);
  }

  if (tasks.length === 0) return { ok: false, error: "No valid tasks were found in that file." };
  return { ok: true, tasks, skipped };
}

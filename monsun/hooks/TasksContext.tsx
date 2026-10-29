"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toISODate } from "@/lib/date";
import { nextDueDate } from "@/lib/recurrence";
import { getSampleTasks } from "@/lib/sampleTasks";
import { normalizePriority } from "@/lib/taskMeta";
import type { Priority, Repeat, Task } from "@/lib/types";

const STORAGE_KEY = "mylifeos.tasks";

export interface NewTask {
  title: string;
  dueDate: string;
  priority?: Priority;
  repeat?: Repeat;
}

// Field yang boleh diubah lewat edit. "repeat: undefined" berarti "jangan berulang lagi".
export type TaskPatch = Partial<Pick<Task, "title" | "dueDate" | "priority" | "repeat">>;

export interface DeletedTask {
  task: Task;
  index: number; // posisi aslinya di daftar, supaya undo mengembalikannya ke tempat yang sama
}

interface TasksContextValue {
  tasks: Task[];
  ready: boolean; // false sampai data dari localStorage selesai dimuat
  addTask: (input: NewTask) => void;
  updateTask: (id: string, patch: TaskPatch) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  lastDeleted: DeletedTask | null; // tugas yang baru dihapus (untuk toast Undo)
  undoDelete: () => void;
  dismissUndo: () => void;
  resetTasks: () => void;
  replaceTasks: (tasks: Task[]) => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);
  const [lastDeleted, setLastDeleted] = useState<DeletedTask | null>(null);

  // Muat dari localStorage sekali saat pertama dibuka.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setTasks(saved ? (JSON.parse(saved) as Task[]) : getSampleTasks());
    } catch {
      setTasks(getSampleTasks());
    }
    setReady(true);
  }, []);

  // Simpan setiap kali tugas berubah (setelah data awal dimuat).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Storage penuh atau diblokir: aplikasi tetap jalan tanpa penyimpanan.
    }
  }, [tasks, ready]);

  const addTask = useCallback(({ title, dueDate, priority, repeat }: NewTask) => {
    const clean = title.trim().slice(0, 120);
    if (!clean) return;
    setTasks((prev) => [
      { id: createId(), title: clean, dueDate, status: "pending", priority: normalizePriority(priority), repeat },
      ...prev,
    ]);
  }, []);

  const updateTask = useCallback((id: string, patch: TaskPatch) => {
    setTasks((prev) =>
      prev.map((t): Task => {
        if (t.id !== id) return t;
        const next: Task = { ...t };
        if (patch.title !== undefined) {
          const title = patch.title.trim().slice(0, 120);
          if (!title) return t; // judul kosong ditolak, tugas tidak berubah
          next.title = title;
        }
        if (patch.dueDate !== undefined) next.dueDate = patch.dueDate;
        if ("priority" in patch) next.priority = normalizePriority(patch.priority);
        if ("repeat" in patch) next.repeat = patch.repeat;
        return next;
      }),
    );
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === id);
      if (!target) return prev;

      // Batal selesai: tugas lanjutan yang dibuat otomatis ikut dihapus (kalau belum disentuh),
      // supaya salah centang tidak meninggalkan tugas ganda.
      if (target.status === "completed") {
        return prev
          .filter((t) => !(t.id === target.spawnedId && t.status === "pending"))
          .map((t): Task => (t.id === id ? { ...t, status: "pending", completedAt: undefined, spawnedId: undefined } : t));
      }

      const today = toISODate();
      const completed: Task = { ...target, status: "completed", completedAt: today };

      // Tugas berulang: buat kemunculan berikutnya, tepat di atas yang baru selesai.
      if (target.repeat) {
        const spawned: Task = {
          id: createId(),
          title: target.title,
          dueDate: nextDueDate(target.dueDate, target.repeat, today),
          status: "pending",
          priority: target.priority,
          repeat: target.repeat,
        };
        completed.spawnedId = spawned.id;
        return [spawned, ...prev.map((t) => (t.id === id ? completed : t))];
      }
      return prev.map((t) => (t.id === id ? completed : t));
    });
  }, []);

  const deleteTask = useCallback(
    (id: string) => {
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1) return;
      setLastDeleted({ task: tasks[index], index });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    },
    [tasks],
  );

  const undoDelete = useCallback(() => {
    if (!lastDeleted) return;
    const { task, index } = lastDeleted;
    setTasks((prev) => {
      if (prev.some((t) => t.id === task.id)) return prev;
      const next = [...prev];
      next.splice(Math.min(index, next.length), 0, task);
      return next;
    });
    setLastDeleted(null);
  }, [lastDeleted]);

  const dismissUndo = useCallback(() => setLastDeleted(null), []);

  // Mengganti seluruh daftar membuat "Undo" lama tidak berlaku lagi, jadi dibersihkan.
  const resetTasks = useCallback(() => {
    setTasks(getSampleTasks());
    setLastDeleted(null);
  }, []);

  const replaceTasks = useCallback((next: Task[]) => {
    setTasks(next);
    setLastDeleted(null);
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      ready,
      addTask,
      updateTask,
      toggleTask,
      deleteTask,
      lastDeleted,
      undoDelete,
      dismissUndo,
      resetTasks,
      replaceTasks,
    }),
    [tasks, ready, addTask, updateTask, toggleTask, deleteTask, lastDeleted, undoDelete, dismissUndo, resetTasks, replaceTasks],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used inside <TasksProvider>");
  return ctx;
}

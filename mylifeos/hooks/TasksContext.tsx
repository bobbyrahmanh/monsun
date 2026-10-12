"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getSampleTasks } from "@/lib/sampleTasks";
import type { Task } from "@/lib/types";

const STORAGE_KEY = "mylifeos.tasks";

interface TasksContextValue {
  tasks: Task[];
  ready: boolean; // false sampai data dari localStorage selesai dimuat
  addTask: (title: string, dueDate: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  resetTasks: () => void;
}

const TasksContext = createContext<TasksContextValue | null>(null);

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);

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

  const addTask = useCallback((title: string, dueDate: string) => {
    setTasks((prev) => [{ id: createId(), title: title.trim(), dueDate, status: "pending" }, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t)),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const resetTasks = useCallback(() => setTasks(getSampleTasks()), []);

  const value = useMemo(
    () => ({ tasks, ready, addTask, toggleTask, deleteTask, resetTasks }),
    [tasks, ready, addTask, toggleTask, deleteTask, resetTasks],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used inside <TasksProvider>");
  return ctx;
}

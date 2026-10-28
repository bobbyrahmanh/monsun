"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toISODate } from "@/lib/date";
import { DURATION_KEY, type Settings } from "@/lib/settings";
import {
  TIMER_LABEL,
  TIMER_LIMITS,
  emptyStats,
  formatTime,
  nextMode,
  normalizeMinutes,
  parseStats,
  type FocusStats,
  type TimerMode,
} from "@/lib/timer";
import { useSettings } from "./SettingsContext";

export type TimerStatus = "idle" | "running" | "paused";

const STATS_KEY = "mylifeos.focusStats";
const BASE_TITLE = "MyLifeOS";

interface TimerContextValue {
  mode: TimerMode;
  status: TimerStatus;
  remaining: number; // detik tersisa
  total: number; // detik total mode ini
  minutes: number; // lama mode ini (menit), dari Settings
  sessionsToday: number;
  focusMinutesToday: number;
  message: string | null; // pesan setelah sesi selesai
  toggle: () => void; // mulai / jeda / lanjut
  reset: () => void;
  selectMode: (mode: TimerMode) => void;
  adjustMinutes: (direction: 1 | -1) => void;
}

const TimerContext = createContext<TimerContextValue | null>(null);

// Bunyi "ting" pendek saat sesi selesai. Gagal diam-diam kalau browser tidak mengizinkan.
function beep() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.9);
    osc.onended = () => void ctx.close();
  } catch {
    // Tidak ada suara, timer tetap jalan.
  }
}

export function TimerProvider({ children }: { children: ReactNode }) {
  const { settings, updateSettings } = useSettings();

  const [mode, setMode] = useState<TimerMode>("focus");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const minutes = settings[DURATION_KEY[mode]];
  const [remaining, setRemaining] = useState(minutes * 60);
  const [message, setMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<FocusStats>(emptyStats(""));
  const [statsReady, setStatsReady] = useState(false);

  // Waktu selesai disimpan sebagai jam dinding, bukan hitungan mundur. Jadi tetap akurat
  // walau tab di latar belakang dan interval-nya diperlambat browser.
  const endAt = useRef(0);

  // Statistik harian: muat sekali, simpan setiap berubah.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STATS_KEY);
      setStats(parseStats(saved ? JSON.parse(saved) : null, toISODate()));
    } catch {
      setStats(emptyStats(toISODate()));
    }
    setStatsReady(true);
  }, []);

  useEffect(() => {
    if (!statsReady) return;
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      // Storage diblokir: statistik hanya berlaku selama halaman terbuka.
    }
  }, [stats, statsReady]);

  // Saat diam, tampilan selalu menunjukkan lama penuh (juga ketika durasi diubah / mode berganti).
  useEffect(() => {
    if (status === "idle") setRemaining(minutes * 60);
  }, [status, minutes]);

  const complete = useCallback(() => {
    beep();
    if (mode === "focus") {
      const today = toISODate();
      const base = stats.date === today ? stats : emptyStats(today);
      const updated: FocusStats = { date: today, sessions: base.sessions + 1, minutes: base.minutes + minutes };
      setStats(updated);
      const next = nextMode("focus", updated.sessions);
      setMode(next);
      setMessage(next === "long" ? "Great work! Time for a long break." : "Focus done! Take a short break.");
    } else {
      setMode("focus");
      setMessage("Break over. Ready for another round?");
    }
    setStatus("idle");
  }, [mode, stats, minutes]);

  // Detak: hitung sisa waktu dari jam dinding setiap 250 ms.
  useEffect(() => {
    if (status !== "running") return;
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        window.clearInterval(id);
        complete();
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [status, complete]);

  // Sisa waktu tampil di judul tab, berguna saat kamu sedang di tab lain.
  useEffect(() => {
    if (status === "idle") {
      document.title = BASE_TITLE;
      return;
    }
    document.title = `${formatTime(remaining)} ${TIMER_LABEL[mode]} | ${BASE_TITLE}`;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [status, remaining, mode]);

  const toggle = useCallback(() => {
    if (status === "running") {
      setRemaining(Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000)));
      setStatus("paused");
    } else {
      endAt.current = Date.now() + remaining * 1000;
      setMessage(null);
      setStatus("running");
    }
  }, [status, remaining]);

  const reset = useCallback(() => {
    setStatus("idle");
    setMessage(null);
  }, []);

  const selectMode = useCallback((next: TimerMode) => {
    setMode(next);
    setStatus("idle");
    setMessage(null);
  }, []);

  // Durasi hanya bisa diubah saat timer diam, supaya tidak mengubah sesi yang sedang berjalan.
  const adjustMinutes = useCallback(
    (direction: 1 | -1) => {
      if (status !== "idle") return;
      const next = normalizeMinutes(mode, minutes + direction * TIMER_LIMITS[mode].step);
      const patch: Partial<Settings> = {};
      patch[DURATION_KEY[mode]] = next;
      updateSettings(patch);
    },
    [status, mode, minutes, updateSettings],
  );

  const today = toISODate();
  const todayStats = stats.date === today ? stats : emptyStats(today);

  const value = useMemo<TimerContextValue>(
    () => ({
      mode,
      status,
      remaining,
      total: minutes * 60,
      minutes,
      sessionsToday: todayStats.sessions,
      focusMinutesToday: todayStats.minutes,
      message,
      toggle,
      reset,
      selectMode,
      adjustMinutes,
    }),
    [mode, status, remaining, minutes, todayStats.sessions, todayStats.minutes, message, toggle, reset, selectMode, adjustMinutes],
  );

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

export function useFocusTimer(): TimerContextValue {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useFocusTimer must be used inside <TimerProvider>");
  return ctx;
}

"use client";

import { Minus, Pause, Play, Plus, RotateCcw } from "lucide-react";
import { useFocusTimer } from "@/hooks/TimerContext";
import { SESSIONS_BEFORE_LONG_BREAK, TIMER_LABEL, TIMER_LIMITS, TIMER_MODES, formatTime, type TimerMode } from "@/lib/timer";
import TomatoIcon from "./TomatoIcon";

const SIZE = 96;
const STROKE = 7;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PILL_LABEL: Record<TimerMode, string> = { focus: "Focus", short: "Short", long: "Long" };

const roundButton =
  "flex shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40";

export default function FocusTimerCard({ className = "" }: { className?: string }) {
  const t = useFocusTimer();
  const running = t.status === "running";
  const limits = TIMER_LIMITS[t.mode];
  const progress = t.total > 0 ? 1 - t.remaining / t.total : 0;
  const lengthLocked = t.status !== "idle";

  // Berapa dari 4 tomat siklus ini yang sudah terisi.
  const inCycle = t.sessionsToday === 0 ? 0 : ((t.sessionsToday - 1) % SESSIONS_BEFORE_LONG_BREAK) + 1;

  return (
    <section className={`glass flex h-full flex-col p-5 ${className}`} aria-label="Focus timer">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">Focus Timer</h3>
          <p className="text-xs text-muted">Pomodoro-style sessions</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface/70">
          <TomatoIcon size={22} />
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-4">
        <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }} role="timer" aria-label={`${TIMER_LABEL[t.mode]} timer`}>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" strokeWidth={STROKE} className="stroke-ink/10" />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
              className="stroke-brand transition-[stroke-dashoffset] duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-light tabular-nums tracking-tight">{formatTime(t.remaining)}</span>
            <span className="text-[11px] text-muted">{TIMER_LABEL[t.mode]}</span>
          </div>
        </div>

        <div className="flex min-w-[8rem] flex-1 flex-col gap-3">
          <div role="radiogroup" aria-label="Timer mode" className="flex flex-wrap gap-1.5">
            {TIMER_MODES.map((m) => {
              const active = t.mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={TIMER_LABEL[m]}
                  disabled={running}
                  onClick={() => t.selectMode(m)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    active ? "bg-ink text-on-ink" : "bg-surface/60 text-muted hover:bg-surface hover:text-ink"
                  }`}
                >
                  {PILL_LABEL[m]}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={t.toggle}
              aria-label={running ? "Pause timer" : t.status === "paused" ? "Resume timer" : "Start timer"}
              className={`${roundButton} h-11 w-11 bg-accent text-ink hover:bg-accent-dark`}
            >
              {running ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
              type="button"
              onClick={t.reset}
              disabled={t.status === "idle"}
              aria-label="Reset timer"
              className={`${roundButton} h-11 w-11 border border-edge/80 bg-surface/70 hover:bg-surface`}
            >
              <RotateCcw size={17} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div role="group" aria-label={`${TIMER_LABEL[t.mode]} length`} className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => t.adjustMinutes(-1)}
            disabled={lengthLocked || t.minutes <= limits.min}
            aria-label={`Decrease ${TIMER_LABEL[t.mode].toLowerCase()} length`}
            className={`${roundButton} h-8 w-8 border border-edge/80 bg-surface/70 hover:bg-surface`}
          >
            <Minus size={14} />
          </button>
          <span className="min-w-[3.5rem] text-center text-sm font-medium tabular-nums">{t.minutes} min</span>
          <button
            type="button"
            onClick={() => t.adjustMinutes(1)}
            disabled={lengthLocked || t.minutes >= limits.max}
            aria-label={`Increase ${TIMER_LABEL[t.mode].toLowerCase()} length`}
            className={`${roundButton} h-8 w-8 border border-edge/80 bg-surface/70 hover:bg-surface`}
          >
            <Plus size={14} />
          </button>
        </div>

        <p aria-live="polite" className="min-w-0">
          {t.message ? (
            <span className="inline-block rounded-2xl bg-accent-soft px-3 py-1.5 font-medium text-ink">{t.message}</span>
          ) : (
            <span
              className="inline-flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1.5 font-medium text-ink"
              title={`${t.focusMinutesToday} min focused today`}
            >
              <span className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: SESSIONS_BEFORE_LONG_BREAK }, (_, i) => (
                  <TomatoIcon key={i} size={14} className={i < inCycle ? "" : "opacity-25 grayscale"} />
                ))}
              </span>
              {t.sessionsToday} today
            </span>
          )}
        </p>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock, ListChecks, Plus } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import StreakCard from "@/components/StreakCard";
import TaskList from "@/components/TaskList";
import { useTasks } from "@/hooks/TasksContext";
import { useNow } from "@/hooks/useNow";
import { formatLongDate, getGreeting, toISODate } from "@/lib/date";

export default function DashboardPage() {
  const { tasks, ready } = useTasks();
  const now = useNow();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = total - completed;

  const todayISO = toISODate(now ?? new Date());
  const todayTasks = tasks.filter((t) => t.dueDate === todayISO);
  const todayDone = todayTasks.filter((t) => t.status === "completed").length;
  const todayPercent = todayTasks.length ? Math.round((todayDone / todayTasks.length) * 100) : 0;

  return (
    <>
      <PageHeader
        subtitle={now ? getGreeting(now) : "Welcome back"}
        title="Let's make progress today!"
        action={
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm text-muted sm:inline-flex">
              <CalendarDays size={16} />
              {now ? formatLongDate(now) : "\u00A0"}
            </span>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink/85"
            >
              <Plus size={16} />
              New task
            </Link>
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Summary">
        <StatCard label="Total tasks" value={total} icon={ListChecks} />
        <StatCard label="Completed" value={completed} icon={CheckCircle2} highlight />
        <StatCard label="Pending" value={pending} icon={Clock} />
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
      <section className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6 lg:col-span-2" aria-label="Today's tasks">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Today&apos;s tasks</h2>
            <p className="text-sm text-muted">
              {todayDone} of {todayTasks.length} done
            </p>
          </div>
          <div className="flex w-full items-center gap-3 sm:w-56">
            <div
              className="h-2 flex-1 overflow-hidden rounded-full bg-canvas"
              role="progressbar"
              aria-valuenow={todayPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Today's progress"
            >
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${todayPercent}%` }} />
            </div>
            <span className="w-10 text-right text-sm font-medium">{todayPercent}%</span>
          </div>
        </div>

        {ready && (
          <TaskList
            tasks={todayTasks}
            empty={
              <>
                Nothing due today.{" "}
                <Link href="/tasks" className="font-medium text-brand-dark underline underline-offset-2">
                  Add a task
                </Link>
              </>
            }
          />
        )}
      </section>

      <StreakCard />
      </div>
    </>
  );
}

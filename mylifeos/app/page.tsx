"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, Plus, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import StreakCard from "@/components/StreakCard";
import TaskList from "@/components/TaskList";
import { useSettings } from "@/hooks/SettingsContext";
import { useTasks } from "@/hooks/TasksContext";
import { useNow } from "@/hooks/useNow";
import { formatLongDate, getGreeting, toISODate } from "@/lib/date";

// Label kecil berwarna di kartu statistik.
function Chip({ tone, children }: { tone: "neutral" | "good" | "bad"; children: ReactNode }) {
  const styles = {
    neutral: "bg-surface/70 text-ink",
    good: "bg-brand-soft text-brand-dark",
    bad: "bg-red-100 text-red-600",
  };
  return <span className={`inline-block rounded-full px-3 py-1 font-medium ${styles[tone]}`}>{children}</span>;
}

export default function DashboardPage() {
  const { tasks, ready } = useTasks();
  const now = useNow();
  const { settings } = useSettings();
  const name = settings.name.trim();
  const loaded = ready && now !== null;

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = total - completed;
  const percentOfAll = total ? Math.round((completed / total) * 100) : 0;

  const todayISO = toISODate(now ?? new Date());
  const todayTasks = tasks.filter((t) => t.dueDate === todayISO);
  const todayDone = todayTasks.filter((t) => t.status === "completed").length;
  const todayPercent = todayTasks.length ? Math.round((todayDone / todayTasks.length) * 100) : 0;
  const overdue = tasks.filter((t) => t.status === "pending" && t.dueDate < todayISO).length;
  const atRisk = loaded && overdue > 0;

  return (
    <>
      <PageHeader
        title="My Day"
        subtitle={now ? (name ? `${getGreeting(now)}, ${name}! ${formatLongDate(now)}` : formatLongDate(now)) : "\u00A0"}
        action={
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-accent-dark"
          >
            <Plus size={16} />
            Add Task
          </Link>
        }
      />

      {/* Banner: apakah ada tugas yang terlewat? */}
      <section
        aria-label="Attention"
        className={`glass flex flex-wrap items-center justify-between gap-4 px-5 py-4 ${atRisk ? "!border-red-200" : ""}`}
      >
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-violet-500 shadow-sm">
            <Sparkles size={22} />
          </span>
          <div>
            <p className="text-xs text-muted">{!loaded ? "Checking" : atRisk ? "At Risk" : "On Track"}</p>
            <p className={`text-2xl font-semibold ${atRisk ? "text-red-500" : loaded ? "text-brand-dark" : "text-muted"}`}>
              {!loaded ? "..." : atRisk ? `${overdue} ${overdue === 1 ? "task" : "tasks"}` : "All clear"}
            </p>
          </div>
        </div>
        <div className="text-sm sm:text-right">
          <p className="text-muted">
            {atRisk ? "Overdue and need attention" : now ? `${getGreeting(now)}! Nothing is overdue.` : "Nothing is overdue."}
          </p>
          <Link href="/tasks" className="inline-flex items-center gap-1 font-semibold hover:underline">
            {atRisk ? "Review now" : "Open tasks"}
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Goal &amp; Tasks</h2>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Summary">
        <StatCard
          label="Total Tasks"
          caption="Everything on your list"
          value={total}
          href="/tasks"
          footer={<Chip tone="neutral">{todayTasks.length} due today</Chip>}
        />
        <StatCard
          label="Completed"
          caption="Finished so far"
          value={completed}
          href="/tasks"
          accent
          footer={<Chip tone="good">{percentOfAll}% of all tasks</Chip>}
        />
        <StatCard
          label="Pending"
          caption="Still waiting on you"
          value={pending}
          href="/tasks"
          footer={
            overdue > 0 ? <Chip tone="bad">{overdue} overdue</Chip> : <Chip tone="good">Nothing overdue</Chip>
          }
        />
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="glass p-5 sm:p-6 lg:col-span-2" aria-label="Today's tasks">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/70">
                <ClipboardList size={18} />
              </span>
              <div>
                <h2 className="text-lg font-semibold">Today&apos;s Tasks</h2>
                <p className="text-xs text-muted">Based on tasks planned for today</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-surface/70 px-3 py-1.5 text-xs font-semibold">
              {todayDone} / {todayTasks.length} done
            </span>
          </div>

          <div
            className="my-5 h-2 overflow-hidden rounded-full bg-surface/70"
            role="progressbar"
            aria-valuenow={todayPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Today's progress"
          >
            <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${todayPercent}%` }} />
          </div>

          {ready && (
            <TaskList
              tasks={todayTasks}
              empty={
                <>
                  Nothing due today.{" "}
                  <Link href="/tasks" className="font-semibold text-ink underline underline-offset-2">
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

import type { ReactNode } from "react";
import type { Task } from "@/lib/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  empty: ReactNode; // tampilan saat daftar kosong
}

export default function TaskList({ tasks, empty }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/15 bg-surface/30 px-4 py-10 text-center text-sm text-muted">
        {empty}
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

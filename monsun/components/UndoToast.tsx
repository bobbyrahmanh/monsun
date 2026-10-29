"use client";

import { useEffect } from "react";
import { Undo2, X } from "lucide-react";
import { useTasks } from "@/hooks/TasksContext";

const AUTO_DISMISS_MS = 8000;

// Muncul setelah sebuah tugas dihapus. Pembungkus role="status" selalu ada di halaman
// (hanya isinya yang bergantian), supaya pembaca layar mengumumkan pesannya.
export default function UndoToast() {
  const { lastDeleted, undoDelete, dismissUndo } = useTasks();

  useEffect(() => {
    if (!lastDeleted) return;
    const id = window.setTimeout(dismissUndo, AUTO_DISMISS_MS);
    return () => window.clearTimeout(id);
  }, [lastDeleted, dismissUndo]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 lg:bottom-6"
    >
      {lastDeleted && (
        <div className="glass pointer-events-auto flex max-w-md items-center gap-3 !rounded-full py-2 pl-5 pr-2 text-sm">
          <span className="min-w-0 max-w-[14rem] truncate">Deleted “{lastDeleted.task.title}”</span>
          <button
            type="button"
            onClick={undoDelete}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 font-semibold text-ink transition-colors hover:bg-accent-dark"
          >
            <Undo2 size={14} />
            Undo
          </button>
          <button
            type="button"
            onClick={dismissUndo}
            aria-label="Dismiss"
            className="shrink-0 rounded-full p-2 text-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

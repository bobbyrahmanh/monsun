import { addDays } from "./date";
import type { Task } from "./types";

// Tugas contoh untuk pengalaman pertama. Tanggalnya relatif terhadap hari ini.
export function getSampleTasks(): Task[] {
  return [
    { id: "sample-1", title: "Plan the week ahead", dueDate: addDays(0), status: "completed", completedAt: addDays(0) },
    { id: "sample-7", title: "Write weekly notes", dueDate: addDays(-1), status: "completed", completedAt: addDays(-1) },
    { id: "sample-8", title: "Clean up the inbox", dueDate: addDays(-2), status: "completed", completedAt: addDays(-2) },
    { id: "sample-2", title: "Finish the design system draft", dueDate: addDays(0), status: "pending" },
    { id: "sample-3", title: "Reply to pending emails", dueDate: addDays(0), status: "pending" },
    { id: "sample-4", title: "30-minute walk", dueDate: addDays(0), status: "pending" },
    { id: "sample-5", title: "Prepare presentation slides", dueDate: addDays(2), status: "pending" },
    { id: "sample-6", title: "Pay monthly bills", dueDate: addDays(-1), status: "pending" },
  ];
}

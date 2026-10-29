import { Flag } from "lucide-react";
import { PRIORITY_LABEL } from "@/lib/taskMeta";
import type { Priority } from "@/lib/types";

// Warna tetap di semua tema (seperti rambu lalu lintas), dengan teks yang kontrasnya dicek.
const STYLE: Record<Priority, string> = {
  normal: "",
  medium: "bg-amber-400 text-slate-900",
  high: "bg-pink-600 text-white",
  urgent: "bg-red-600 text-white",
};

// Prioritas "normal" sengaja tidak diberi lencana, supaya daftar tidak ramai.
export default function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority === "normal") return null;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${STYLE[priority]}`}>
      <Flag size={11} aria-hidden="true" />
      {PRIORITY_LABEL[priority]}
    </span>
  );
}

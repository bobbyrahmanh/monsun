import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  highlight?: boolean; // kartu hijau penuh seperti di referensi
}

export default function StatCard({ label, value, icon: Icon, highlight = false }: StatCardProps) {
  return (
    <div
      className={`rounded-3xl p-5 shadow-card ${
        highlight ? "bg-brand text-ink" : "border border-line bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${highlight ? "text-ink/70" : "text-muted"}`}>{label}</span>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full ${
            highlight ? "bg-white/40" : "bg-canvas text-ink"
          }`}
        >
          <Icon size={17} />
        </span>
      </div>
      <p className="mt-4 text-4xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

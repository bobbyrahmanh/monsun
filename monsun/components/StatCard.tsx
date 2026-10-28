import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number;
  caption?: string;
  href?: string; // kalau diisi, muncul tombol panah ke halaman itu
  footer?: ReactNode; // biasanya sebuah chip kecil
  accent?: boolean; // tombol panah / ikon berwarna kuning neon
  icon?: LucideIcon; // dipakai kalau tidak ada href
  highlight?: boolean; // nama lama dari `accent`, tetap didukung
}

export default function StatCard({ label, value, caption, href, footer, accent, icon: Icon, highlight }: StatCardProps) {
  const isAccent = accent || highlight;
  const circle = `flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink transition-colors ${
    isAccent ? "bg-accent" : "bg-surface/70"
  }`;

  return (
    <div className="glass flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{label}</h3>
          {caption && <p className="text-xs text-muted">{caption}</p>}
        </div>

        {href ? (
          <Link
            href={href}
            aria-label={`Open ${label}`}
            className={`${circle} ${isAccent ? "hover:bg-accent-dark" : "hover:bg-surface"}`}
          >
            <ArrowUpRight size={16} />
          </Link>
        ) : Icon ? (
          <span className={circle}>
            <Icon size={16} />
          </span>
        ) : null}
      </div>

      <p className="mt-5 text-5xl font-light tracking-tight">{String(value).padStart(2, "0")}</p>

      {footer && <div className="mt-4 text-xs">{footer}</div>}
    </div>
  );
}

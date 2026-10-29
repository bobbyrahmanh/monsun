import type { ReactNode } from "react";

import LiveClock from "./LiveClock";
import ThemeMenu from "./ThemeMenu";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <LiveClock />
        <ThemeMenu />
        {action}
      </div>
    </header>
  );
}

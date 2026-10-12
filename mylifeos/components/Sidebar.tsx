"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { NAV_ITEMS, isActive } from "./navItems";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-white p-4 lg:flex rounded-3xl">
      <div className="px-2 py-2">
        <Logo />
      </div>

      <nav className="mt-8 flex flex-col gap-1" aria-label="Main">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-ink text-white" : "text-muted hover:bg-canvas hover:text-ink"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <p className="mt-auto px-2 text-xs text-muted">Your data stays in this browser.</p>
    </aside>
  );
}

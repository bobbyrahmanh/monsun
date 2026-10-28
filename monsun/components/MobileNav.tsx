"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActive } from "./navItems";

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-edge/70 bg-surface/70 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl lg:hidden"
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center gap-1 pb-2 text-[11px] font-medium ${
              active ? "text-ink" : "text-muted"
            }`}
          >
            <span className={`rounded-full px-4 py-1.5 transition-colors ${active ? "bg-accent text-ink" : ""}`}>
              <Icon size={18} />
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

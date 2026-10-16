"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Moon, Sun, Sunset, type LucideIcon } from "lucide-react";
import { useTheme } from "@/hooks/ThemeContext";
import type { Theme } from "@/lib/theme";

const OPTIONS: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: "morning", label: "Morning", icon: Sun },
  { value: "sunset", label: "Sunset", icon: Sunset },
  { value: "night", label: "Night", icon: Moon },
];

// Satu tombol bulat (ikonnya mengikuti tema aktif). Diklik -> muncul menu berisi 3 tema.
export default function ThemeMenu() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[0];
  const CurrentIcon = current.icon;

  // Saat menu terbuka: klik di luar atau tekan Esc untuk menutup.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function choose(value: Theme) {
    setTheme(value);
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <div ref={rootRef} className="relative z-30">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Change theme (current: ${current.label})`}
        title="Change theme"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-edge/80 bg-surface/70 text-ink transition-colors hover:bg-surface"
      >
        <CurrentIcon size={18} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Theme"
          className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-edge/70 bg-surface/90 p-1.5 shadow-glass backdrop-blur-xl"
        >
          {OPTIONS.map(({ value, label, icon: Icon }) => {
            const active = theme === value;
            return (
              <button
                key={value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => choose(value)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-accent text-ink" : "text-ink hover:bg-canvas"
                }`}
              >
                <Icon size={16} />
                <span className="flex-1 text-left">{label}</span>
                {active && <Check size={16} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

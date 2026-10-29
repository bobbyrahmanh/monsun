"use client";

import { useId } from "react";

interface Option<T> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T> {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

// Pilihan satu-dari-beberapa berbentuk pil. Dipakai di Settings (hari mulai minggu, format jam, detik).
export default function SegmentedControl<T extends string | number | boolean>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const labelId = useId();

  return (
    <div>
      <p id={labelId} className="mb-2 text-sm font-medium">
        {label}
      </p>
      <div role="radiogroup" aria-labelledby={labelId} className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.value)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                active ? "bg-ink text-on-ink" : "bg-surface/60 text-muted hover:bg-surface hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

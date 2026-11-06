"use client";

import { X } from "lucide-react";
import { selectClass } from "./fieldStyles";

interface TimeInputProps {
  value: string; // "HH:mm", atau "" kalau tidak ada jam
  onChange: (value: string) => void;
}

// Jam tenggat (opsional). Kosong = tugas berlaku sepanjang hari.
// Tombol silang muncul hanya saat ada isinya, karena kolom jam bawaan browser sulit dikosongkan.
export default function TimeInput({ value, onChange }: TimeInputProps) {
  return (
    <div className="flex items-center gap-1.5">
      <label className="flex items-center gap-2 text-xs text-muted">
        Time
        <input type="time" value={value} onChange={(e) => onChange(e.target.value)} className={selectClass} />
      </label>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear time"
          className="rounded-full p-1.5 text-muted transition-colors hover:bg-canvas hover:text-ink"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

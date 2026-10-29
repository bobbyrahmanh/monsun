"use client";

import { useEffect, useState } from "react";

// Mengembalikan waktu sekarang, diperbarui tepat di pergantian detik (atau menit kalau
// detik disembunyikan, supaya tidak membangunkan React tiap detik tanpa perlu).
// Bernilai null di server dan render pertama, supaya tidak ada hydration mismatch.
export function useClock(withSeconds: boolean): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const period = withSeconds ? 1000 : 60_000;
    let timer = 0;
    const tick = () => {
      setNow(new Date());
      timer = window.setTimeout(tick, period - (Date.now() % period));
    };
    tick();
    return () => window.clearTimeout(timer);
  }, [withSeconds]);

  return now;
}

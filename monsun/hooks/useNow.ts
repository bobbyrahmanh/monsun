"use client";

import { useEffect, useState } from "react";

// Mengembalikan null di server dan render pertama, supaya tidak ada hydration mismatch
// (zona waktu server dan browser bisa berbeda).
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  return now;
}

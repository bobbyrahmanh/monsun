"use client";

import { useSyncExternalStore } from "react";

const MINUTE = 60_000;
const listeners = new Set<() => void>();
let timer = 0;

// Satu timer untuk SELURUH aplikasi: berdetak tepat di pergantian menit, lalu memberi tahu
// semua komponen yang berlangganan. 100 tugas di layar tetap hanya memakai satu timer,
// dan timernya berhenti sendiri begitu tidak ada yang berlangganan.
function schedule() {
  timer = window.setTimeout(() => {
    listeners.forEach((notify) => notify());
    schedule();
  }, MINUTE - (Date.now() % MINUTE));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) schedule();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.clearTimeout(timer);
  };
}

// Waktu sekarang dibulatkan ke bawah ke menit (stabil selama satu menit, jadi React tidak
// me-render ulang tanpa perlu). Bernilai 0 di server dan saat hydration.
const getSnapshot = () => Math.floor(Date.now() / MINUTE) * MINUTE;
const getServerSnapshot = () => 0;

// Mengembalikan epoch milidetik (kelipatan menit), atau 0 sebelum terpasang di browser.
export function useMinuteNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

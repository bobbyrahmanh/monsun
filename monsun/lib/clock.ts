export interface ClockOptions {
  hour12: boolean;
  seconds: boolean;
}

const pad = (n: number) => String(n).padStart(2, "0");

// Format manual (bukan Intl) supaya tengah malam selalu "00:05", bukan "24:05" seperti
// yang dihasilkan sebagian browser untuk hour12:false.
export function formatClock(date: Date, { hour12, seconds }: ClockOptions): { time: string; suffix: string } {
  const h = date.getHours();
  const shown = hour12 ? (h % 12 === 0 ? 12 : h % 12) : h;
  const time = `${pad(shown)}:${pad(date.getMinutes())}${seconds ? `:${pad(date.getSeconds())}` : ""}`;
  return { time, suffix: hour12 ? (h < 12 ? "AM" : "PM") : "" };
}

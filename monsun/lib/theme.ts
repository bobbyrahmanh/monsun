export const THEMES = ["morning", "sunset", "night"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_KEY = "mylifeos.theme";

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

// Dijalankan di <head> sebelum halaman tampil, supaya tidak ada kilatan tema yang salah.
export const themeInitScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="morning"||t==="sunset"||t==="night")document.documentElement.dataset.theme=t}catch(e){}`;

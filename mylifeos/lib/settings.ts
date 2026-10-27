export type WeekStart = 0 | 1; // 0 = Minggu, 1 = Senin (sama dengan Date.getDay())

export interface Settings {
  name: string;
  weekStart: WeekStart;
}

export const SETTINGS_KEY = "mylifeos.settings";

export const DEFAULT_SETTINGS: Settings = { name: "", weekStart: 1 };

// Data dari localStorage tidak boleh dipercaya begitu saja: validasi dan isi dengan nilai bawaan.
export function parseSettings(raw: unknown): Settings {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    name: typeof r.name === "string" ? r.name.slice(0, 30) : DEFAULT_SETTINGS.name,
    weekStart: r.weekStart === 0 ? 0 : 1,
  };
}

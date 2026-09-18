import { create } from "zustand";

export type ThemeId = "minimal" | "maximalist" | "terminal" | "paper";

export const THEMES: { id: ThemeId; label: string }[] = [
  { id: "minimal", label: "Minimal" },
  { id: "maximalist", label: "Maximalist" },
  { id: "terminal", label: "Terminal" },
  { id: "paper", label: "Paper" },
];

const THEME_KEY = "luck-game:theme";

function loadTheme(): ThemeId {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw && THEMES.some((t) => t.id === raw)) return raw as ThemeId;
  } catch {
    // localStorage unavailable — fall back to default
  }
  return "minimal";
}

interface ThemeState {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: loadTheme(),
  setTheme: (theme) => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // localStorage unavailable — selection just won't persist
    }
    set({ theme });
  },
}));

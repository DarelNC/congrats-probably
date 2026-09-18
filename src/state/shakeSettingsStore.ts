import { create } from "zustand";

const THRESHOLD_KEY = "congrats-probably:shake-threshold";

export const MIN_THRESHOLD = 8;
export const MAX_THRESHOLD = 30;
export const DEFAULT_THRESHOLD = 14;

function loadThreshold(): number {
  try {
    const raw = localStorage.getItem(THRESHOLD_KEY);
    const parsed = raw === null ? NaN : Number(raw);
    if (!Number.isNaN(parsed) && parsed >= MIN_THRESHOLD && parsed <= MAX_THRESHOLD) return parsed;
  } catch {
    // localStorage unavailable — fall back to default
  }
  return DEFAULT_THRESHOLD;
}

interface ShakeSettingsState {
  threshold: number;
  setThreshold: (value: number) => void;
}

export const useShakeSettingsStore = create<ShakeSettingsState>((set) => ({
  threshold: loadThreshold(),
  setThreshold: (value) => {
    try {
      localStorage.setItem(THRESHOLD_KEY, String(value));
    } catch {
      // localStorage unavailable — selection just won't persist
    }
    set({ threshold: value });
  },
}));

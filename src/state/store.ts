import { create } from "zustand";
import { rollDie } from "../utils/rng";

const BEST_RUN_KEY = "luck-game:best-run";
const LIFETIME_KEY = "luck-game:lifetime";
const ROLL_ANIMATION_MS = 650;

export type Phase = "ready" | "rolling" | "gameover";

export interface BestRun {
  stage: number;
  rolls: number;
}

export interface Lifetime {
  totalRolls: number;
  distribution: [number, number, number, number, number, number];
}

function emptyDistribution(): [number, number, number, number, number, number] {
  return [0, 0, 0, 0, 0, 0];
}

function loadBestRun(): BestRun | null {
  try {
    const raw = localStorage.getItem(BEST_RUN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BestRun;
  } catch {
    return null;
  }
}

function saveBestRun(run: BestRun) {
  try {
    localStorage.setItem(BEST_RUN_KEY, JSON.stringify(run));
  } catch {
    // localStorage unavailable — ignore
  }
}

function loadLifetime(): Lifetime {
  try {
    const raw = localStorage.getItem(LIFETIME_KEY);
    if (!raw) return { totalRolls: 0, distribution: emptyDistribution() };
    return JSON.parse(raw) as Lifetime;
  } catch {
    return { totalRolls: 0, distribution: emptyDistribution() };
  }
}

function saveLifetime(lifetime: Lifetime) {
  try {
    localStorage.setItem(LIFETIME_KEY, JSON.stringify(lifetime));
  } catch {
    // localStorage unavailable — ignore
  }
}

interface GameState {
  phase: Phase;
  stageIndex: number;
  rollHistory: number[];
  lastRoll: number | null;
  pendingRoll: number | null;
  gameStartedAt: number | null;
  bestRun: BestRun | null;
  lifetime: Lifetime;
  roll: () => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: "ready",
  stageIndex: 0,
  rollHistory: [],
  lastRoll: null,
  pendingRoll: null,
  gameStartedAt: null,
  bestRun: loadBestRun(),
  lifetime: loadLifetime(),

  roll: () => {
    const { phase } = get();
    if (phase !== "ready") return;

    const value = rollDie();
    set((state) => ({
      phase: "rolling",
      pendingRoll: value,
      gameStartedAt: state.gameStartedAt ?? Date.now(),
    }));

    setTimeout(() => {
      set((state) => {
        const rollHistory = [...state.rollHistory, value];

        const lifetime: Lifetime = {
          totalRolls: state.lifetime.totalRolls + 1,
          distribution: emptyDistribution(),
        };
        lifetime.distribution = [...state.lifetime.distribution] as Lifetime["distribution"];
        lifetime.distribution[value - 1] += 1;
        saveLifetime(lifetime);

        if (value === 1) {
          const finishedStage = state.stageIndex;
          const finishedRolls = rollHistory.length;
          let bestRun = state.bestRun;
          const isBetter =
            !bestRun ||
            finishedStage > bestRun.stage ||
            (finishedStage === bestRun.stage && finishedRolls < bestRun.rolls);
          if (isBetter) {
            bestRun = { stage: finishedStage, rolls: finishedRolls };
            saveBestRun(bestRun);
          }
          return {
            phase: "gameover",
            lastRoll: value,
            pendingRoll: null,
            rollHistory,
            lifetime,
            bestRun,
          };
        }

        if (value === 6) {
          return {
            phase: "ready",
            lastRoll: value,
            pendingRoll: null,
            rollHistory,
            lifetime,
            stageIndex: state.stageIndex + 1,
          };
        }

        return {
          phase: "ready",
          lastRoll: value,
          pendingRoll: null,
          rollHistory,
          lifetime,
        };
      });
    }, ROLL_ANIMATION_MS);
  },

  reset: () => {
    set({
      phase: "ready",
      stageIndex: 0,
      rollHistory: [],
      lastRoll: null,
      pendingRoll: null,
      gameStartedAt: null,
    });
  },
}));

export { ROLL_ANIMATION_MS };

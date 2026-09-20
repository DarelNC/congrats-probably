import { create } from "zustand";
import { rollDie } from "../utils/rng";
import { stageVariants } from "../content";

const BEST_RUN_KEY = "congrats-probably:best-run";
const LIFETIME_KEY = "congrats-probably:lifetime";
const RUN_HISTORY_KEY = "congrats-probably:run-history";
const MAX_RUN_HISTORY = 5;
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

export interface RunRecord {
  stage: number;
  rolls: number;
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
    // localStorage unavailable: ignore
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
    // localStorage unavailable: ignore
  }
}

function loadRunHistory(): RunRecord[] {
  try {
    const raw = localStorage.getItem(RUN_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RunRecord[];
  } catch {
    return [];
  }
}

function saveRunHistory(history: RunRecord[]) {
  try {
    localStorage.setItem(RUN_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // localStorage unavailable: ignore
  }
}

function randomStageTextIndex(stageIndex: number): number {
  if (stageIndex <= 0 || stageIndex > stageVariants.length) return 0;
  return Math.floor(Math.random() * stageVariants[stageIndex - 1].length);
}

interface GameState {
  phase: Phase;
  stageIndex: number;
  stageTextIndex: number;
  rollHistory: number[];
  lastRoll: number | null;
  pendingRoll: number | null;
  gameStartedAt: number | null;
  bestRun: BestRun | null;
  lifetime: Lifetime;
  runHistory: RunRecord[];
  roll: () => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: "ready",
  stageIndex: 0,
  stageTextIndex: 0,
  rollHistory: [],
  lastRoll: null,
  pendingRoll: null,
  gameStartedAt: null,
  bestRun: loadBestRun(),
  lifetime: loadLifetime(),
  runHistory: loadRunHistory(),

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

          const runHistory = [{ stage: finishedStage, rolls: finishedRolls }, ...state.runHistory].slice(
            0,
            MAX_RUN_HISTORY,
          );
          saveRunHistory(runHistory);

          return {
            phase: "gameover",
            lastRoll: value,
            pendingRoll: null,
            rollHistory,
            lifetime,
            bestRun,
            runHistory,
          };
        }

        if (value === 6) {
          const stageIndex = state.stageIndex + 1;
          return {
            phase: "ready",
            lastRoll: value,
            pendingRoll: null,
            rollHistory,
            lifetime,
            stageIndex,
            stageTextIndex: randomStageTextIndex(stageIndex),
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
      stageTextIndex: 0,
      rollHistory: [],
      lastRoll: null,
      pendingRoll: null,
      gameStartedAt: null,
    });
  },
}));

export { ROLL_ANIMATION_MS };

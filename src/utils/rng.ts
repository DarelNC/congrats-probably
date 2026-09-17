export function rollDie(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export type RollOutcome = "advance" | "gameover" | "neutral";

export function classifyRoll(value: number): RollOutcome {
  if (value === 6) return "advance";
  if (value === 1) return "gameover";
  return "neutral";
}

export const INTRO_LINES = [
  "This is a game about luck.",
  "Roll 6 to start.",
] as const;

export const QUIT_LINE = "Roll 1 to quit.";

export const stages: string[] = [
  "You were born.",
  "You survived being a toddler.",
  "You made a friend.",
  "You passed a test you didn't study for.",
  "You got the job.",
  "You didn't get hit by that car.",
  "You fell in love.",
  "You bought a house.",
  "You had a kid.",
  "You survived the market crash.",
  "You became CEO.",
  "You won the lawsuit.",
  "You found the lump early.",
  "You went to Mars.",
  "You lived to see the sun expand.",
];

export const GAME_OVER_ZERO_STAGE = "You never got past the start.";

export const BEYOND_FINAL_STAGE_LINE = "You kept going. Nobody knows how.";

export function currentStageLine(stageIndex: number): string {
  if (stageIndex <= 0) return INTRO_LINES[0];
  if (stageIndex <= stages.length) return stages[stageIndex - 1];
  return BEYOND_FINAL_STAGE_LINE;
}

export function stageReachedLine(stageIndex: number): string {
  if (stageIndex <= 0) return GAME_OVER_ZERO_STAGE;
  const clamped = Math.min(stageIndex, stages.length);
  return `You made it to stage ${clamped}.`;
}

export function oddsDenominator(stageIndex: number): number {
  return 2 ** Math.max(stageIndex, 0);
}

export function oddsLine(stageIndex: number): string | null {
  if (stageIndex <= 0) return null;
  return `1 in ${oddsDenominator(stageIndex).toLocaleString()} runs make it this far.`;
}

export function streakCommentary(rollHistory: number[]): string | null {
  if (rollHistory.length < 3) return null;

  const last = rollHistory[rollHistory.length - 1];
  const lastThreeMatch = rollHistory.slice(-3).every((v) => v === last);
  if (lastThreeMatch && last !== 1) {
    return `Three ${last}s in a row. Doesn't change the next one.`;
  }

  let noSixStreak = 0;
  for (let i = rollHistory.length - 1; i >= 0; i--) {
    if (rollHistory[i] === 6 || rollHistory[i] === 1) break;
    noSixStreak++;
  }
  if (noSixStreak >= 5) {
    return `No 6 in ${noSixStreak} rolls. The die has no memory.`;
  }

  return null;
}

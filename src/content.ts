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

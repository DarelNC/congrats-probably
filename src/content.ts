export const INTRO_LINES = [
  "This is a game about luck.",
  "Roll 6 to start.",
] as const;

export const QUIT_LINE = "Roll 1 to quit.";

// Stages 1-5: 4 variants each (most likely to be seen).
// Stages 6-10: 3 variants each.
// Stages 11-15: 2 variants each (least likely to be seen).
export const stageVariants: string[][] = [
  [
    "You were born. Nobody asked for your input.",
    "Congratulations, you exist. Try not to ruin it immediately.",
    "Cell division succeeded. Set the bar low, we're all thrilled.",
    "You were born into this. No refunds.",
  ],
  [
    "You survived being a toddler, mostly out of luck and supervision.",
    "You didn't eat anything toxic. This time.",
    "Toddler you made it. Toddler you had no idea how close it was.",
    "You survived two years of pure chaos. You don't even remember it.",
  ],
  [
    "You made a friend. Lower your expectations accordingly.",
    "Someone tolerated you long enough to call it friendship.",
    "You made a friend. They'll forget your birthday within a decade.",
    "Friendship achieved. Emotional labor pending.",
  ],
  [
    "You passed a test you didn't study for. The bar was underground.",
    "You guessed right. The system is fundamentally broken and you benefited.",
    "Multiple choice carried you again.",
    "You passed. Nobody, least of all you, knows how.",
  ],
  [
    "You got the job. They were desperate.",
    "Someone with a hiring budget made a mistake, and it was you.",
    "You got the job nobody else wanted. Congratulations, I guess.",
    "You got hired. HR will regret this eventually.",
  ],
  [
    "You didn't get hit by that car. Reflexes had nothing to do with it.",
    "The car missed you. Physics was just feeling generous.",
    "You didn't get hit by that car. This time.",
  ],
  [
    "You fell in love. Statistically, this ends in tears.",
    "You fell in love with someone who tolerates how you text.",
    "Love happened. Emotionally, you were not prepared.",
  ],
  [
    "You bought a house. The bank owns most of it, but sure, it's yours.",
    "You bought a house you can technically afford.",
    "Homeowner now. Emotionally, still renting.",
  ],
  [
    "You had a kid. There's no undo button on this one.",
    "You had a kid. Good luck, genuinely.",
    "A whole new person exists because of you. No pressure.",
  ],
  [
    "You survived the market crash. Your portfolio did not.",
    "The market crashed. Somehow, you're still standing.",
    "You survived the crash. Your 401k sends its regards.",
  ],
  [
    "You became CEO. Nobody, least of all you, knows how.",
    "CEO now. The board is as confused as you are.",
  ],
  [
    "You won the lawsuit. Legal fees ate the winnings.",
    "You won. The victory tastes like paperwork.",
  ],
  [
    "You found the lump early. Small mercies, but a real one.",
    "Caught it in time. The universe owed you one.",
  ],
  [
    "You went to Mars. The Wi-Fi is somehow worse than home.",
    "Mars. Red, dusty, and still better than your commute.",
  ],
  [
    "You lived to see the sun expand. Everyone else did not.",
    "The sun is expanding. You're still here, watching. Impressive, honestly.",
  ],
];

export const GAME_OVER_ZERO_STAGE = "You never got past the start.";

export const BEYOND_FINAL_STAGE_LINE = "You kept going. Nobody knows how.";

export function currentStageLine(stageIndex: number, textIndex = 0): string {
  if (stageIndex <= 0) return INTRO_LINES[0];
  if (stageIndex <= stageVariants.length) {
    const variants = stageVariants[stageIndex - 1];
    return variants[textIndex % variants.length];
  }
  return BEYOND_FINAL_STAGE_LINE;
}

export function stageReachedLine(stageIndex: number): string {
  if (stageIndex <= 0) return GAME_OVER_ZERO_STAGE;
  const clamped = Math.min(stageIndex, stageVariants.length);
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

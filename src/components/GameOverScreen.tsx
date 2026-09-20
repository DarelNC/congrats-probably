import { useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../state/store";
import { GAME_OVER_ZERO_STAGE, oddsLine, randomCreditsRemark, stageVariants } from "../content";
import { withMonoDigits } from "../utils/withMonoDigits";
import Histogram from "./Histogram";
import RunHistory from "./RunHistory";
import ShareCard from "./ShareCard";

function toCounts(rollHistory: number[]): number[] {
  const counts = [0, 0, 0, 0, 0, 0];
  for (const roll of rollHistory) counts[roll - 1] += 1;
  return counts;
}

// Structured so themes can style "stage" and the number differently; other
// themes just render these spans inline with no extra styling applied.
function GameOverHeadline({ stageIndex }: { stageIndex: number }) {
  if (stageIndex <= 0) return <>{GAME_OVER_ZERO_STAGE}</>;
  const clamped = Math.min(stageIndex, stageVariants.length);
  return (
    <>
      You made it to
      <span className="stage-num-row">
        <span className="stage-word">stage</span>
        <span className="mono-num stage-num">{clamped}.</span>
      </span>
    </>
  );
}

export default function GameOverScreen() {
  const stageIndex = useGameStore((s) => s.stageIndex);
  const stageTextIndex = useGameStore((s) => s.stageTextIndex);
  const rollHistory = useGameStore((s) => s.rollHistory);
  const bestRun = useGameStore((s) => s.bestRun);
  const runHistory = useGameStore((s) => s.runHistory);
  const reset = useGameStore((s) => s.reset);

  const counts = toCounts(rollHistory);
  const rollCount = rollHistory.length;
  const isBest = bestRun && bestRun.stage === stageIndex && bestRun.rolls === rollCount;
  const odds = oddsLine(stageIndex);
  const [creditsRemark] = useState(randomCreditsRemark);

  return (
    <motion.div
      className="game-over"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <p className="game-over-line">
        <GameOverHeadline stageIndex={stageIndex} />
      </p>
      {odds && <p className="odds-line">{withMonoDigits(odds)}</p>}
      <p className="game-over-rolls">
        <span className="mono-num">{rollCount}</span> roll{rollCount === 1 ? "" : "s"} taken
        {isBest && <span className="best-badge"> — new best</span>}
      </p>

      {bestRun && !isBest && (
        <p className="best-run">
          Best run: stage <span className="mono-num">{bestRun.stage}</span> in{" "}
          <span className="mono-num">{bestRun.rolls}</span> roll{bestRun.rolls === 1 ? "" : "s"}
        </p>
      )}

      <Histogram counts={counts} title="Your roll distribution" />

      <RunHistory runs={runHistory} />

      <div className="game-over-actions">
        <motion.button className="roll-button" onClick={reset} whileTap={{ scale: 0.94 }} transition={{ duration: 0.1 }}>
          Try again
        </motion.button>
        <ShareCard stageIndex={stageIndex} stageTextIndex={stageTextIndex} rollCount={rollCount} counts={counts} />
      </div>

      <p className="credits-remark">{creditsRemark}</p>
    </motion.div>
  );
}

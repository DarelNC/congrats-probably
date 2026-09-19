import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "../state/store";
import { INTRO_LINES, currentStageLine, oddsLine, streakCommentary } from "../content";
import { withMonoDigits } from "../utils/withMonoDigits";

export default function StageDisplay() {
  const stageIndex = useGameStore((s) => s.stageIndex);
  const rollHistory = useGameStore((s) => s.rollHistory);
  const odds = oddsLine(stageIndex);
  const streak = streakCommentary(rollHistory);

  return (
    <div className="stage-display">
      <AnimatePresence mode="wait">
        <motion.div
          key={stageIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          <p className="stage-line">{currentStageLine(stageIndex)}</p>
          {stageIndex === 0 && <p className="stage-subline">{INTRO_LINES[1]}</p>}
          {odds && <p className="odds-line">{withMonoDigits(odds)}</p>}
          {streak && <p className="streak-line">{withMonoDigits(streak)}</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

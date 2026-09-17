import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "../state/store";
import { INTRO_LINES, currentStageLine } from "../content";

export default function StageDisplay() {
  const stageIndex = useGameStore((s) => s.stageIndex);

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
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

import { motion } from "framer-motion";
import { useGameStore } from "../state/store";

export default function RollButton() {
  const phase = useGameStore((s) => s.phase);
  const roll = useGameStore((s) => s.roll);

  return (
    <motion.button
      className="roll-button"
      onClick={roll}
      disabled={phase === "rolling"}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.1 }}
    >
      {phase === "rolling" ? "…" : "Roll"}
    </motion.button>
  );
}

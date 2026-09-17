import { AnimatePresence } from "framer-motion";
import { useGameStore, ROLL_ANIMATION_MS } from "./state/store";
import Die from "./components/Die";
import RollButton from "./components/RollButton";
import StageDisplay from "./components/StageDisplay";
import GameOverScreen from "./components/GameOverScreen";
import { QUIT_LINE } from "./content";

function App() {
  const phase = useGameStore((s) => s.phase);
  const lastRoll = useGameStore((s) => s.lastRoll);
  const pendingRoll = useGameStore((s) => s.pendingRoll);

  const dieValue = phase === "rolling" ? (pendingRoll ?? 1) : (lastRoll ?? 1);

  return (
    <main className="app">
      <AnimatePresence mode="wait">
        {phase === "gameover" ? (
          <GameOverScreen key="gameover" />
        ) : (
          <div className="play-screen" key="play">
            <StageDisplay />
            <Die value={dieValue} rolling={phase === "rolling"} durationMs={ROLL_ANIMATION_MS} />
            <RollButton />
            <p className="quit-line">{QUIT_LINE}</p>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;

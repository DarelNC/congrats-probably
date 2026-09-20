import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useGameStore, ROLL_ANIMATION_MS } from "./state/store";
import { useThemeStore } from "./state/themeStore";
import Die from "./components/Die";
import RollButton from "./components/RollButton";
import StageDisplay from "./components/StageDisplay";
import GameOverScreen from "./components/GameOverScreen";
import ThemePicker from "./components/ThemePicker";
import ShakeToRoll from "./components/ShakeToRoll";
import PosterBackdrop from "./components/PosterBackdrop";
import { QUIT_LINE } from "./content";
import { highlightFirstDigit } from "./utils/withMonoDigits";

function App() {
  const phase = useGameStore((s) => s.phase);
  const lastRoll = useGameStore((s) => s.lastRoll);
  const pendingRoll = useGameStore((s) => s.pendingRoll);
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const dieValue = phase === "rolling" ? (pendingRoll ?? 1) : (lastRoll ?? 1);

  return (
    <main className="app">
      {theme === "poster" && <PosterBackdrop />}
      <ThemePicker />
      <AnimatePresence mode="wait">
        {phase === "gameover" ? (
          <GameOverScreen key="gameover" />
        ) : (
          <div className="play-screen" key="play">
            <StageDisplay />
            <Die value={dieValue} rolling={phase === "rolling"} durationMs={ROLL_ANIMATION_MS} />
            <RollButton />
            <ShakeToRoll />
            <p className="quit-line">{highlightFirstDigit(QUIT_LINE, "digit-one")}</p>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;

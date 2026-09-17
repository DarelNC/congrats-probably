import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./Die.css";

const FACE_ROTATION: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: -90, y: 0 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: 90, y: 0 },
  6: { x: 180, y: 0 },
};

const PIP_LAYOUTS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function Face({ value, className }: { value: number; className: string }) {
  const activePips = PIP_LAYOUTS[value];
  return (
    <div className={`die-face ${className}`}>
      <div className="die-pip-grid">
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} className={`die-pip ${activePips.includes(i) ? "on" : ""}`} />
        ))}
      </div>
    </div>
  );
}

interface DieProps {
  value: number;
  rolling: boolean;
  durationMs: number;
}

export default function Die({ value, rolling, durationMs }: DieProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const spinDirection = useRef(1);
  const settledValue = useRef(1);

  useEffect(() => {
    if (!rolling) return;
    spinDirection.current *= -1;
    const target = FACE_ROTATION[value];
    const settled = FACE_ROTATION[settledValue.current];
    const spins = 2 * 360 * spinDirection.current;
    setRotation((prev) => ({
      x: prev.x + spins + (target.x - settled.x),
      y: prev.y + spins + (target.y - settled.y),
    }));
    settledValue.current = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolling, value]);

  return (
    <div className="die-scene">
      <motion.div
        className="die-cube"
        animate={{ rotateX: rotation.x, rotateY: rotation.y }}
        transition={{ duration: durationMs / 1000, ease: [0.22, 0.9, 0.35, 1] }}
      >
        <Face value={1} className="face-front" />
        <Face value={6} className="face-back" />
        <Face value={2} className="face-top" />
        <Face value={5} className="face-bottom" />
        <Face value={3} className="face-right" />
        <Face value={4} className="face-left" />
      </motion.div>
    </div>
  );
}

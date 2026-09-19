import { useState } from "react";
import { motion } from "framer-motion";
import { drawResultCard } from "../utils/canvasExport";
import { exportCanvasAsImage } from "../utils/canvasExport";

interface ShareCardProps {
  stageIndex: number;
  stageTextIndex: number;
  rollCount: number;
  counts: number[];
}

export default function ShareCard({ stageIndex, stageTextIndex, rollCount, counts }: ShareCardProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "downloaded" | "error">("idle");

  async function handleShare() {
    try {
      const canvas = await drawResultCard({ stageIndex, stageTextIndex, rollCount, counts });
      const result = await exportCanvasAsImage(canvas);
      setStatus(result);
      setTimeout(() => setStatus("idle"), 2200);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2200);
    }
  }

  const label =
    status === "copied"
      ? "Copied!"
      : status === "downloaded"
        ? "Downloaded!"
        : status === "error"
          ? "Couldn't export"
          : "Copy result as image";

  return (
    <motion.button className="share-button" onClick={handleShare} whileTap={{ scale: 0.94 }} transition={{ duration: 0.1 }}>
      {label}
    </motion.button>
  );
}

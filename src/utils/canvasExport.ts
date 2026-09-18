import { currentStageLine, stageReachedLine } from "../content";

export interface ResultCardData {
  stageIndex: number;
  rollCount: number;
  counts: number[];
}

const CARD_WIDTH = 800;
const CARD_HEIGHT = 1000;

const DISPLAY_FONT = "'Quicksand', 'Segoe UI', system-ui, sans-serif";
const MONO_FONT = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

async function ensureFontsLoaded(): Promise<void> {
  try {
    await Promise.all([
      document.fonts.load("600 30px 'Quicksand'"),
      document.fonts.load("700 40px 'Quicksand'"),
      document.fonts.load("400 22px 'JetBrains Mono'"),
    ]);
  } catch {
    // fall back to the system stack if the font CDN is unavailable
  }
}

export async function drawResultCard({ stageIndex, rollCount, counts }: ResultCardData): Promise<HTMLCanvasElement> {
  await ensureFontsLoaded();

  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";

  ctx.font = `600 30px ${DISPLAY_FONT}`;
  wrapText(ctx, "This is a game about luck.", CARD_WIDTH / 2, 110, 640, 38);

  ctx.font = `700 40px ${DISPLAY_FONT}`;
  const resultLine = stageIndex > 0 ? stageReachedLine(stageIndex) : stageReachedLine(0);
  wrapText(ctx, resultLine, CARD_WIDTH / 2, 220, 680, 50);

  ctx.font = `600 26px ${MONO_FONT}`;
  ctx.fillStyle = "#b5b5bd";
  ctx.fillText(`${rollCount} roll${rollCount === 1 ? "" : "s"} taken`, CARD_WIDTH / 2, 300);

  if (stageIndex > 0) {
    ctx.font = `italic 22px ${DISPLAY_FONT}`;
    ctx.fillStyle = "#8a8a92";
    wrapText(ctx, `"${currentStageLine(stageIndex)}"`, CARD_WIDTH / 2, 360, 620, 30);
  }

  drawHistogram(ctx, counts, 100, 480, CARD_WIDTH - 200, 320);

  ctx.font = `400 20px ${DISPLAY_FONT}`;
  ctx.fillStyle = "#6a6a72";
  ctx.fillText("Congratulations, Probably", CARD_WIDTH / 2, CARD_HEIGHT - 60);

  return canvas;
}

function drawHistogram(
  ctx: CanvasRenderingContext2D,
  counts: number[],
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const total = counts.reduce((a, b) => a + b, 0);
  const expected = total / 6;
  const max = Math.max(...counts, expected, 1);
  const colWidth = width / 6;
  const barWidth = colWidth * 0.5;

  ctx.textAlign = "center";

  for (let i = 0; i < 6; i++) {
    const colCenter = x + colWidth * i + colWidth / 2;
    const barHeight = (counts[i] / max) * height;
    const expectedY = y + height - (expected / max) * height;

    ctx.fillStyle = "#2a2a32";
    ctx.fillRect(colCenter - barWidth / 2, y, barWidth, height);

    ctx.fillStyle = "#e8e8ec";
    ctx.fillRect(colCenter - barWidth / 2, y + height - barHeight, barWidth, barHeight);

    ctx.strokeStyle = "#ff5a5f";
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(colCenter - barWidth / 2 - 4, expectedY);
    ctx.lineTo(colCenter + barWidth / 2 + 4, expectedY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = `400 22px ${MONO_FONT}`;
    ctx.fillStyle = "#b5b5bd";
    ctx.fillText(String(i + 1), colCenter, y + height + 34);

    ctx.font = `400 18px ${MONO_FONT}`;
    ctx.fillStyle = "#6a6a72";
    ctx.fillText(String(counts[i]), colCenter, y + height + 58);
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let lineY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, lineY);
      line = word;
      lineY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, lineY);
}

export async function exportCanvasAsImage(canvas: HTMLCanvasElement): Promise<"copied" | "downloaded"> {
  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Failed to render image");

  if (navigator.clipboard && "write" in navigator.clipboard && typeof ClipboardItem !== "undefined") {
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      return "copied";
    } catch {
      // fall through to download
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "luck-result.png";
  link.click();
  URL.revokeObjectURL(url);
  return "downloaded";
}

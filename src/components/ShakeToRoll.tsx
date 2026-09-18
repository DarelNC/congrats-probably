import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../state/store";

const MOBILE_QUERY = "(max-width: 480px)";
const SHAKE_THRESHOLD = 18;
const SHAKE_COOLDOWN_MS = 1200;

type MotionEventCtor = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

type PermissionState = "unsupported" | "needs-permission" | "listening";

function needsExplicitPermission(): boolean {
  const ctor = window.DeviceMotionEvent as MotionEventCtor | undefined;
  return typeof ctor?.requestPermission === "function";
}

function computePermission(isMobile: boolean): PermissionState {
  if (!isMobile || typeof window.DeviceMotionEvent === "undefined") return "unsupported";
  return needsExplicitPermission() ? "needs-permission" : "listening";
}

export default function ShakeToRoll() {
  const roll = useGameStore((s) => s.roll);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);
  const [permission, setPermission] = useState<PermissionState>(() => computePermission(isMobile));
  const lastAccel = useRef<{ x: number; y: number; z: number } | null>(null);
  const lastShakeAt = useRef(0);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    function onChange(e: MediaQueryListEvent) {
      setIsMobile(e.matches);
      setPermission(computePermission(e.matches));
    }
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (permission !== "listening") return;

    function handleMotion(e: DeviceMotionEvent) {
      const acc = e.accelerationIncludingGravity ?? e.acceleration;
      if (!acc || acc.x == null || acc.y == null || acc.z == null) return;

      const prev = lastAccel.current;
      lastAccel.current = { x: acc.x, y: acc.y, z: acc.z };
      if (!prev) return;

      const delta = Math.abs(acc.x - prev.x) + Math.abs(acc.y - prev.y) + Math.abs(acc.z - prev.z);
      const now = Date.now();
      if (delta > SHAKE_THRESHOLD && now - lastShakeAt.current > SHAKE_COOLDOWN_MS) {
        lastShakeAt.current = now;
        roll();
      }
    }

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [permission, roll]);

  async function requestPermission() {
    try {
      const ctor = window.DeviceMotionEvent as MotionEventCtor;
      const result = await ctor.requestPermission!();
      setPermission(result === "granted" ? "listening" : "unsupported");
    } catch {
      setPermission("unsupported");
    }
  }

  if (!isMobile || permission === "unsupported") return null;

  if (permission === "needs-permission") {
    return (
      <button className="shake-indicator shake-indicator-button" onClick={requestPermission}>
        Enable shake to roll
      </button>
    );
  }

  return (
    <p className="shake-indicator">
      <span className="shake-icon" aria-hidden="true" />
      Shake to roll
    </p>
  );
}

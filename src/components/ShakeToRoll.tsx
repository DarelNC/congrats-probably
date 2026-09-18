import { useEffect, useMemo, useRef, useState } from "react";
import { useGameStore } from "../state/store";
import { useShakeSettingsStore } from "../state/shakeSettingsStore";
import { useIsMobile } from "../utils/useIsMobile";

const SHAKE_COOLDOWN_MS = 1200;
const VIBRATION_MS = 45;

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

function DieIcon() {
  return (
    <svg className="shake-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="7.5" cy="7.5" r="1.7" fill="currentColor" />
      <circle cx="16.5" cy="7.5" r="1.7" fill="currentColor" />
      <circle cx="12" cy="12" r="1.7" fill="currentColor" />
      <circle cx="7.5" cy="16.5" r="1.7" fill="currentColor" />
      <circle cx="16.5" cy="16.5" r="1.7" fill="currentColor" />
    </svg>
  );
}

export default function ShakeToRoll() {
  const roll = useGameStore((s) => s.roll);
  const threshold = useShakeSettingsStore((s) => s.threshold);
  const isMobile = useIsMobile();
  const derivedPermission = useMemo(() => computePermission(isMobile), [isMobile]);
  const [permissionOverride, setPermissionOverride] = useState<PermissionState | null>(null);
  const permission = permissionOverride ?? derivedPermission;
  const lastAccel = useRef<{ x: number; y: number; z: number } | null>(null);
  const lastShakeAt = useRef(0);
  const thresholdRef = useRef(threshold);

  useEffect(() => {
    thresholdRef.current = threshold;
  }, [threshold]);

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
      if (delta > thresholdRef.current && now - lastShakeAt.current > SHAKE_COOLDOWN_MS) {
        lastShakeAt.current = now;
        if (navigator.vibrate) navigator.vibrate(VIBRATION_MS);
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
      setPermissionOverride(result === "granted" ? "listening" : "unsupported");
    } catch {
      setPermissionOverride("unsupported");
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
      <DieIcon />
      Shake to roll
    </p>
  );
}

import { useEffect, useRef, useState } from "react";
import { THEMES, useThemeStore } from "../state/themeStore";
import { MAX_THRESHOLD, MIN_THRESHOLD, useShakeSettingsStore } from "../state/shakeSettingsStore";
import { useIsMobile } from "../utils/useIsMobile";

export default function ThemePicker() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const threshold = useShakeSettingsStore((s) => s.threshold);
  const setThreshold = useShakeSettingsStore((s) => s.setThreshold);
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutsideClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  // Higher slider position = more sensitive = lower physical threshold, so the range is inverted here.
  const sensitivity = MAX_THRESHOLD + MIN_THRESHOLD - threshold;

  return (
    <div className={`theme-picker ${open ? "open" : ""}`} ref={rootRef}>
      <button
        className="theme-picker-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Theme menu"
      >
        <span />
        <span />
        <span />
      </button>
      <div className="theme-picker-options">
        {THEMES.map((t) => (
          <button
            key={t.id}
            className={`theme-picker-option ${theme === t.id ? "active" : ""}`}
            onClick={() => {
              setTheme(t.id);
              setOpen(false);
            }}
            aria-pressed={theme === t.id}
          >
            {t.label}
          </button>
        ))}
        {isMobile && (
          <div className="sensitivity-control">
            <span className="sensitivity-label">Shake sensitivity</span>
            <div className="sensitivity-slider-row">
              <span>Less</span>
              <input
                type="range"
                min={MIN_THRESHOLD}
                max={MAX_THRESHOLD}
                value={sensitivity}
                onChange={(e) => setThreshold(MAX_THRESHOLD + MIN_THRESHOLD - Number(e.target.value))}
                aria-label="Shake sensitivity"
              />
              <span>More</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

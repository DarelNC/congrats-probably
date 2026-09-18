import { useEffect, useRef, useState } from "react";
import { THEMES, useThemeStore } from "../state/themeStore";

export default function ThemePicker() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
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
      </div>
    </div>
  );
}

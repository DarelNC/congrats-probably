import { THEMES, useThemeStore } from "../state/themeStore";

export default function ThemePicker() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <div className="theme-picker">
      {THEMES.map((t) => (
        <button
          key={t.id}
          className={`theme-picker-option ${theme === t.id ? "active" : ""}`}
          onClick={() => setTheme(t.id)}
          aria-pressed={theme === t.id}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

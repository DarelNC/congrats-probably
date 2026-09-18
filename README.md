# Congratulations, Probably

A single-page game about luck: roll a die. Roll a 6 and you advance to the next stage of an escalating, deadpan life story. Roll a 1 and it's over. Nothing else you do matters — there are no choices, no skill, just the die.

**Live demo:** _(add your deployed URL here)_

## Why

Most games let you believe your choices mattered even when the underlying system was mostly random. This one strips that away: the entire "story" of your run — job, house, kid, Mars — is gated behind nothing but a d6. It's a small, honest joke about how much of what people credit to effort is actually variance, dressed up as a game so it's fun to sit with for thirty seconds instead of depressing.

## Stack

- React 18 + TypeScript + Vite
- Zustand for state
- Framer Motion for the die-roll and stage transitions
- Canvas API for the shareable result card (no chart/image libraries)
- Plain CSS, no Tailwind
- No backend — everything is client-side, persisted to `localStorage`

## Local dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs a static site in `dist/` — deployable as-is to Vercel, Netlify, or GitHub Pages.

## Project structure

```
src/
  content.ts          stage text (edit this to change the game's story)
  state/store.ts       zustand store: roll logic, stage/game-over transitions, persistence
  utils/rng.ts          die-roll RNG + outcome classification
  utils/canvasExport.ts canvas rendering + clipboard/download for the share card
  components/
    Die.tsx             animated 3D die
    RollButton.tsx
    StageDisplay.tsx
    GameOverScreen.tsx
    Histogram.tsx        actual vs. expected roll distribution
    ShareCard.tsx         "copy result as image" button
    ThemePicker.tsx        Minimal / Maximalist / Terminal / Paper theme switcher
  state/themeStore.ts   theme selection + persistence
```

## Persistence

Stored in `localStorage`, nothing else:
- Best run (furthest stage reached, tie-broken by fewest rolls)
- Lifetime roll count and distribution across all sessions

No accounts, no server sync, no leaderboard — intentionally out of scope.

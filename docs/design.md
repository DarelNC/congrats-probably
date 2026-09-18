# Design

Adapted from `frag-ment/rules/design.md` (now removed after being consumed here).

## Role

When touching UI, act as a senior product UI/UX designer with a strong point of view — not as a tool filling in a scaffold with defaults. Every visual decision (layout, type, color, spacing, motion) should be a decision, not a default left untouched.

## The constraint

**Do not ship anything that looks AI-generated.** Every AI-scaffolded site has converged on the same look, and it's now instantly recognizable as "someone let an AI build this." A game asking to be shared and screenshotted needs to look considered, not assembled from a template — even (especially) a minimalist one, since minimalism is where template defaults hide easiest.

## Banned patterns — if you catch yourself about to ship one of these, stop and redo it

- Purple-to-blue (or blue-to-pink) diagonal gradient backgrounds/buttons.
- A centered hero: big bold heading, subheading, two pill-shaped buttons ("Get Started" / "Learn More").
- Glassmorphism cards — `backdrop-blur` + translucent white border — used as generic decoration rather than for a real reason.
- Gradient text (`bg-clip-text text-transparent`) as a default heading treatment.
- Generic icon-in-a-colored-circle badges, especially from an untouched default icon set dropped in without a distinct visual system around them.
- The 3-column "feature grid": icon, bold title, one-line description, repeated identically three times.
- Stock abstract blob/grid-pattern SVG background decoration.
- A single default typeface (Inter/`font-sans`/the OS system-UI stack) used everywhere with no typographic contrast — no second typeface, no mono accents, no scale personality.
- Neon glow text/borders on a plain dark background as the entire "modern" signal.
- A "Loved by developers" logo strip with no real content behind it.

None of these are wrong in isolation. The problem is all of them together, untouched from defaults, is the tell.

## Do instead: lean into what this product actually is

This is a game whose entire content *is* numbers — a die face, a roll count, a distribution of six counts. The design should make that legible and a little dramatic, not decorate around it:

- **Typography with real hierarchy.** A characterful display face for the stage lines and buttons (the "voice" of the game), paired with a monospace face for anything numeric — roll counts, the histogram's axis numbers, the stage counter. The mono isn't decoration, it's showing the actual data the game is about.
- **A deliberate, non-default color system.** Pure black/white matches the reference brief directly (an intentional choice, not a default left untouched) — the one accent color (the histogram's expected-value marker) should stay a single deliberate hue, not expand into a default palette.
- **Let the actual data be the visual centerpiece** — the die and the histogram, not decorative chrome around them.
- **Motion with intent** — the die's roll and the stage-line transition are the two moments the game lives or dies on; button presses should register with a real tactile response, not just a static hover-invert.

## The same constraint applies to copy, not just visuals

Watch for AI-writing tells in stage lines, button labels, and the README: throat-clearing openers, marketing verbs on a tool nobody's marketing ("unlock", "supercharge"), hollow superlatives ("seamless", "game-changing"), the contrastive tag ("X — not Y"), corporate padding ("leverage", "robust solution"), hedge-everything openers, rhetorical-question filler. Say the specific true thing in a plain, dry voice instead.

## Self-check before shipping UI work

Ask: *"Would this specific choice look identical on a random AI-generated SaaS landing page?"* If yes, it's not done yet.

## Current implementation (2026-09-17)

- **Palette:** pure black background, white text, one accent (`#ff5a5f`, the histogram's dashed expected-value line) — matches the reference brief exactly; deliberate, not a default left untouched.
- **Type:** Quicksand (600/700) for the stage lines and buttons — a rounded, characterful display face matching the soft, friendly tone the reference screenshot's lettering has, replacing the initial build's untouched `"Segoe UI"` system stack (a plain miss against the banned-patterns list above, caught in review). JetBrains Mono for every number the game produces — roll counts, the histogram's axis and count labels, the stage-reached line's digit — since that's the actual content of a game about probability. Both loaded via Google Fonts with `font-display: swap` and a system-font fallback stack, so a slow or blocked font CDN degrades to a plain but legible page rather than invisible text.
- **Motion:** the die's 3D roll and the stage-line fade/slide were already real, targeted motion (not decoration). Added `whileTap` scale feedback on the Roll / Try again / Copy-result buttons so the one interactive surface in the game has a tactile response, not just a static hover-invert.
- **Canvas export:** the shareable result card uses the same Quicksand/JetBrains Mono pairing so a screenshot of the game and the exported card read as the same product.

### Decision: adding a font-CDN dependency for a one-screen joke game

**The call:** load two Google Fonts instead of shipping only the system stack.

**Adversarial pass:** this is a client-only, zero-dependency game by design (see [rules.md](rules.md)) — is a font CDN call the first crack in that? Weighed against: it's a `<link>` tag, not a runtime API call the game's logic depends on — the die still rolls, the store still persists, and the page still renders (in the fallback stack) with zero JS involved if the CDN is slow, blocked, or down. That's a materially different risk than the third-party-API rule this project is otherwise built to avoid. Also weighed: is the single-default-typeface finding real, or manufactured to look rigorous? It's real — the initial build used the OS `"Segoe UI"` stack for literally every piece of text on every screen, which is exactly the named banned pattern, not a borderline case. Kept the change.

### Decision: a theme picker (2026-09-17)

**The call:** four selectable themes — Minimal (the shipped default), Maximalist, Terminal, Paper — swapped via a `data-theme` attribute driving CSS custom properties, persisted to `localStorage`. Not a settings panel: four small text buttons, fixed top-right, styled like everything else in the game (no icons, no modal).

- **Minimal:** the original black/white build — unchanged, still the default.
- **Maximalist:** deep plum background, gold/pink/mint accents, glow-shadowed die. The six histogram bars each get their own color (pink → orange across faces 1–6) — not borrowed from any other project's cycling-color scheme, but a direct consequence of this game's content: it has exactly six discrete outcomes, so six colors is the literal data, not decoration.
- **Terminal:** monospace-only, green-phosphor-on-black, sharp corners. Per the reuse-check rule above: the mono-everywhere choice here reads as an instrument/dice-readout, not a code/terminal signal, even though it's the same JetBrains Mono already loaded for the numeric UI in every other theme.
- **Paper:** warm cream background, ink-brown Source Serif 4 headings (one more font family, justified the same way the Quicksand/JetBrains Mono pairing was — a `<link>` addition, not a runtime dependency), a lottery-ticket/editorial feel.

**Adversarial pass:** is four selectable themes scope creep on a one-screen joke game whose entire pitch is "no choices, just the die"? The themes don't add any player choice to the *game* — stage progression, odds, and content are identical in every theme — they only change how the roll and result are dressed, which is squarely a presentation concern, not new game mechanics. Is the implementation actually that cheap, or is "just CSS variables" underselling it? Checked: one new zustand store (mirrors the existing `store.ts` pattern exactly), one new component, and a variable refactor of `index.css` that already existed as hardcoded values — no new runtime dependencies, no change to `content.ts`, `rng.ts`, or the game-over/persistence logic. Kept the change; the canvas-exported share card intentionally always renders in the Minimal palette regardless of the live theme, which is a deliberate cut (documented here, not silently dropped) rather than themeing the export path too — that would double the surface for a feature whose real audience is the on-screen game, not the screenshot.

### Decision: a mobile menu for the theme picker (2026-09-18)

**The call:** below 480px, the four inline theme buttons collapse into a single hamburger toggle (top-right, matching the picker's existing position) that opens a bordered dropdown panel. Desktop is unchanged — still the plain inline row.

**Adversarial pass:** the previous mobile layout (picker stacked as a static, centered row above the game) wasn't broken, so is a second interaction state (open/closed) worth the added complexity? Weighed against: on a 375px screen the four-button row wrapped to two rows and pushed the actual game (the die, the one thing that matters) further down and off the first fold — a real, observed layout cost, not a hypothetical one. The hamburger is plain CSS (three `<span>` bars, no icon asset) and the panel is the same bordered-box language already used everywhere else in the game, so it doesn't introduce a new visual idiom. Kept the change.

### Decision: shake-to-roll on mobile (2026-09-18)

**The call:** on viewports at or under 480px, a `devicemotion` listener rolls the die when the phone is shaken, alongside a small always-visible indicator (a wiggling square + "Shake to roll") near the Roll button. iOS requires an explicit `DeviceMotionEvent.requestPermission()` call from a tap before motion events fire at all — on browsers that expose that gate, the indicator becomes a tappable "Enable shake to roll" button until granted; everywhere else it's just informational text.

**Adversarial pass:** motion permission APIs are exactly the kind of thing that fails silently and differently across browsers — is this actually going to work, or is it going to strand users in a broken half-state? Traced all three real branches: no `DeviceMotionEvent` at all (old/desktop browsers resized narrow) → indicator renders nothing; has the constructor but no `requestPermission` (Android) → listens immediately, no user action needed; has `requestPermission` (iOS Safari) → shows the button, and a denied or failed request falls back to hiding the indicator entirely rather than leaving a dead button on screen. No new dependency — `roll()` already no-ops outside the `ready` phase, so a shake during the roll animation or on the game-over screen is inert by construction, not a special case this feature had to add.

**Follow-up (2026-09-18, same day):** three refinements after real-device feedback that the plain bordered square "read as a checkbox, not a die":
- The icon is now an inline SVG die face (a rounded square outline + 5 pips), still using the same periodic wiggle keyframe — same motion, a shape that actually reads as a die at 18px.
- A short `navigator.vibrate(45)` fires alongside `roll()` on a detected shake. Feature-detected (`if (navigator.vibrate)`) since iOS Safari has no Vibration API at all — silently a no-op there, not a broken promise.
- The shake threshold moved out of a hardcoded constant into `state/shakeSettingsStore.ts` (same persisted-zustand-store shape as `themeStore.ts`), with a "Shake sensitivity" slider in the mobile menu. The slider is inverted from the raw physics value (drag right = more sensitive = lower acceleration-delta threshold) so the control reads the way a person expects a sensitivity knob to read, without needing a units explanation.

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

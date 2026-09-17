# Rules

Adapted from `frag-ment/rules/` (a reusable rules library generalized from the Coined project). That staging copy has now been consumed here and removed — this file is the durable version for this project.

## No third-party API calls, by design — keep it that way

This project has zero backend and zero external service calls: everything is a pure client-side computation (`Math.random`) plus `localStorage`. That's not an oversight, it's the point — a game about luck doesn't need a server to roll a die. Don't reach for a backend to solve a problem that fits client-side (a "verified" roll, a synced leaderboard, an account system). If a feature genuinely needs one, that's a real architecture decision — see below — not a default to slide into.

If an external dependency (analytics, a font CDN, a future leaderboard API) is ever added:
- Never call it directly from arbitrary components — isolate it behind one module so an upstream change, rate limit, or shutdown is a one-file fix, not a rewrite.
- Prefer a documented, stable API contract over scraping or an undocumented endpoint. Treat anything undocumented as a fallback at best.
- Design for the dependency to fail without breaking the game — the die must still roll if a font CDN or an analytics call times out or is blocked.

**Origin:** generalized from a rebuild whose predecessor died because its browser code called an undocumented free API directly with no fallback — not directly applicable to this project's current shape, but the discipline (don't hardcode a fragile single dependency into the client) applies the moment one is introduced.

## Default branch is `master`

Not a deliberate choice — this is just git's own unconfigured default (no `init.defaultBranch` set locally or globally), left as-is rather than renamed to `main`/`trunk` since nothing here depends on the name. Written down so it doesn't get silently assumed to be `main` later.

## No Claude attribution in commits or PRs

Already enforced globally via the root `frag-ment/CLAUDE.md` — restated here since this file is this project's durable memory and the rule applies to every commit made while building it.

## Documentation and critical review are tiered by whether it's actually a decision

Applying full rigor to every change is its own failure mode on a small solo project — it adds friction until the project stalls, which is worse than the sloppiness it's meant to prevent. The bar scales with what kind of change it is:

- **Fast lane (most changes):** typo fixes, formatting, copy tweaks, small bug fixes, routine implementation of something already decided (including anything the original spec already pinned down, like the stack). Do freely — no doc update, no review required.
- **Decision lane (only real decisions):** picking between real alternatives the spec left open — a UX/motion/typography direction, an internal architecture choice, a scope call. For these: write it down here (or in [design.md](design.md)) as part of the same unit of work, and do one honest adversarial pass — state the strongest reason it might be wrong, overengineered, or premature — before proceeding. If that pass genuinely finds nothing, say so and move on; don't manufacture an objection to look rigorous.
- **Publish gate:** documentation doesn't have to happen before every local commit — it has to be caught up before anything goes public (a push to a shared remote, a PR, a deploy). Move fast within a work session; do a doc-sync pass at the end, before publishing.

## Scope discipline

v1 scope is exactly what the original spec defines: a single-die luck game, client-only, no accounts, no server sync, no leaderboard. Those are explicitly out of scope, not just unbuilt — re-adding any of them is a new decision with its own doc entry, not silent scope creep back to "what a full game would have."

**Origin:** the adversarial-pass discipline exists because reflexive agreement is the default failure mode to guard against, not because contradiction for its own sake is useful.

---
name: extravagant-web-motion
description: "Trigger: animaciones extravagantes, awwwards-style site, cinematic web motion, WebGL hero, scroll narrative, kinetic typography, page transitions, fullscreen carousel morph, magnetic cursor, video-driven section. Build high-impact web motion under a declared performance budget."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.1"
---

## Activation Contract

Use when a page must feel cinematic, not merely polished: scroll narratives, pinned scenes, layout morphs, page transitions, kinetic type, canvas/WebGL heroes, video-driven sections.

Not for: CSS micro-interactions (`web-animation-design`), UX structure (`gentle-ui-design`), visual direction (`gentle-design`), game loops, video production.

## Hard Rules

- Motion inventory before code: element, trigger, property, duration, easing. No row, no animation.
- Composite only (`transform`, `opacity`, `clip-path`); CSS transitions where a main-thread stall would kill the motion, GSAP only for timelines and scrub.
- Name your eases — tokens or named GSAP eases. No two sampled sites share a curve; never port one as house style.
- Visible by default: JS applies hidden start states, so a failed script leaves readable content.
- Reduce motion with one of the four forms in `corpus.md`; never ship none.
- Degrade per feature, not per experience: shorter durations, lower DPR, fewer layers, softened hover. A whole immersive mode behind a width+pointer gate is one option, never the default.
- Lazy-load heavy modules (three.js, HLS, audio) by route or `IntersectionObserver`, with a poster fallback and a measured quality ladder.
- Pin library versions per project and verify the API; never port version-specific practice between projects.
- Automatic or repeating motion over 5s needs a visible pause control (WCAG 2.2.2); hover and scroll-into-view count as automatic; interaction-triggered motion stays disableable (2.3.3).
- Declare a saturation budget before designing: one focal motion per viewport, ≤1 loop with control, ≤1 scrubbed scene, entrance settle ≤1.2s. `restraint.md` numbers are ours, not standards.
- State the tier you chose; when 60fps cannot be evidenced, ship one tier lower.
- Batch DOM reads, then writes; never interleave geometry reads with style writes in one frame (forced layout per read).
- Genuinely off-main-thread: null-transform hacks (`translate3d(0,0,0)`) are dead — use `will-change` in the 200ms window and remove it after.
- Blur is the expensive filter: no animated blur over a large area, backdrop-filter on ≤3 elements per viewport, never over a playing video.
- Keep the motion layer lean: ≤365KB compressed JS for motion, total page ≤2.5MB; `decoding="async"` on animated images; off-screen sections under `content-visibility: auto` paired with `contain-intrinsic-size`.

## Decision Gates

| Need | Tier | Approach |
| --- | --- | --- |
| Feedback, entrance on view | 1 CSS | state-class transition; `IntersectionObserver` + keyframes, `--i` stagger |
| Narrative, pins, scrub | 2 GSAP | timeline + ScrollTrigger, Lenis synced to the ticker |
| Morph, page transition | 3 FLIP/VT | transform + `clip-path`; `startViewTransition` with wipe fallback |
| Heavy scene, video, cursor | 4 pipeline | dynamic import + DPR ladder; HLS + IO gating + retries; lerp cursor |

## Execution Steps

1. Read `corpus.md`, `restraint.md`, `fluidity.md`, then copy a spec from `pattern-library.md` — never the look.
2. Write the reduced-motion and mobile branches first (`degradation.md`).
3. Apply the token block, implement inside the declared properties and durations, stay inside the saturation budget.
4. Verify: compositor-only, no layout shift from hidden states, stagger 40–90ms, keyboard and touch paths, no remote fonts.
5. Report inventory, tier, budgets, degradation paths and residual risk.

## Output Contract

Return: files touched; the motion inventory table; tier with its one-line reason; the saturation budget and every budget exceeded with its measurement; reduced-motion, mobile and no-JS behavior; verification run; residual risk.

## References

- `references/corpus.md` — eight verified sites: invariants, fingerprints, where they fail.
- `references/restraint.md` — citable limits and the saturation budgets we chose.
- `references/fluidity.md` — frame budgets, cost drivers, layer-promotion folklore, weight budgets.
- `references/pattern-library.md` — seven patterns: trigger, properties, budget, asset, variants.
- `references/degradation.md` — four reduced-motion forms, degradation ladder, no-JS, keyboard.
- `references/craft-lessons.md` — craft lessons from the reference site.
- Test bench (not shipped): `~/Projects/skill_para_animaciones/motion-lab` — `node serve.mjs`; audits contract, fingerprints and saturation.
- `/home/trujillo/.agents/skills/web-animation-design/SKILL.md` — CSS-tier motion discipline.

---
name: extravagant-web-motion
description: "Trigger: animaciones extravagantes, awwwards-style site, cinematic web motion, WebGL hero, scroll narrative, kinetic typography, page transitions, fullscreen carousel morph, magnetic cursor, video-driven section. Build high-impact web motion under a declared performance budget."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Use when a page must feel cinematic, not merely polished: scroll narratives, pinned scenes, layout morphs, page transitions, kinetic type, canvas/WebGL heroes, video-driven sections.

Not for: CSS micro-interactions (`web-animation-design`), UX structure (`gentle-ui-design`), visual direction (`gentle-design`), game loops, video production.

## Hard Rules

- Motion inventory before code: element, trigger, property, duration, easing. No row, no animation.
- Composite only: `transform`, `opacity`, `clip-path`. Never `width`, `height`, `top`, `left`, `box-shadow`, `filter` on a hot path.
- Two-speed architecture: CSS transitions for motion that must survive a main-thread stall; GSAP only for timelines and scrub.
- Name your eases — CSS tokens or named GSAP eases. The values belong to the project; no two sampled sites share a curve, so never port one site's curve as the house style.
- Visible by default: JS applies hidden start states, so a failed script leaves readable content.
- Reduce motion with one of the four forms in `references/corpus.md`; never ship none.
- Degrade per feature, not per experience: shorter durations, lower DPR, fewer layers, softened hover. A whole "immersive mode" behind a width+pointer gate is one option, never the default.
- Lazy-load heavy modules (three.js, HLS, audio) by route or `IntersectionObserver`, with a poster fallback and a measured quality ladder — pixel ratio from `devicePixelRatio` and frame time, plus a low-power escape hatch.
- Pin library versions per project and verify the API; never port version-specific practice between projects.
- State the tier you chose; when 60fps cannot be evidenced, ship one tier lower.

## Decision Gates

| Need | Tier | Approach |
| --- | --- | --- |
| Feedback, entrance on view | 1 CSS | state-class transition; `IntersectionObserver` + keyframes, `--i` stagger |
| Narrative, pins, scrub | 2 GSAP | timeline + ScrollTrigger, Lenis synced to the ticker |
| Morph, page transition | 3 FLIP/VT | transform + `clip-path`; `startViewTransition` with wipe fallback |
| Heavy scene, video, cursor | 4 pipeline | dynamic import + DPR ladder; HLS + IO gating + retries; lerp cursor |

## Execution Steps

1. Read `corpus.md` for what is invariant, then copy the pattern spec from `pattern-library.md` — the spec, never the look.
2. Write the reduced-motion and mobile branches first (`degradation.md`).
3. Apply the token block, then implement inside the declared properties and durations.
4. Verify: compositor-only, no layout shift from hidden states, stagger 40–90ms, keyboard and touch paths, no remote fonts.
5. Report inventory, tier, degradation paths and residual risk.

## Output Contract

Return: files touched; the motion inventory table; tier with its one-line reason; reduced-motion, mobile and no-JS behavior; verification run; residual performance risk.

## References

- `references/corpus.md` — eight verified sites: invariants, falsification round, fingerprints, retired rules. Read before choosing a technique.
- `references/pattern-library.md` — seven patterns: trigger, properties, budget, asset, variants.
- `references/degradation.md` — the four reduced-motion forms, degradation ladder, no-JS, keyboard.
- `references/craft-lessons.md` — lessons from the reference SOTD implementation.
- Test bench (not shipped with the skill): `~/diseños/motion-lab` — `node serve.mjs`, then open the printed URL. Audits each asset against this contract and lists reference-site fingerprints, unscored.
- `/home/trujillo/.agents/skills/web-animation-design/SKILL.md` — CSS-tier motion discipline.
